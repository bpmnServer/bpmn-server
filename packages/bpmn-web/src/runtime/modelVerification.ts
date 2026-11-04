import { verifyModel } from 'bpmn-server';
import type { IModelVerification, IModelIssue } from 'bpmn-server';

/**
 * VERIFY_MODELS_ON_IMPORT: what the model import and save routes do with a model that verifyModel
 * finds errors in.
 *
 *   warn (default)  save it and log the issues
 *   enforce         refuse it, nothing saved: the import APIs answer { errors, issues } like their other
 *                   failures (bpmn-client rejects with that body), the editor's model/save answers 422
 *   off             save it unchecked
 *
 * Warnings never stop a save; they are logged in warn and enforce.
 */
export type VerifyMode = 'warn' | 'enforce' | 'off';

export function verifyModeFromEnv(env: Record<string, string | undefined> = process.env): VerifyMode {
	const value = (env.VERIFY_MODELS_ON_IMPORT ?? '').trim().toLowerCase();
	if (value === 'enforce' || value === 'off') return value;
	return 'warn';
}

export interface ModelCheck {
	/** false only in enforce mode, for a model with errors: do not save it */
	accept: boolean;
	verification?: IModelVerification;
	errors: IModelIssue[];
	warnings: IModelIssue[];
}

/** A model refused in enforce mode. */
export class ModelRejectedError extends Error {
	status = 422;
	constructor(public modelName: string, public issues: IModelIssue[]) {
		super(`Model ${modelName} has ${issues.length} error(s) and was not saved (VERIFY_MODELS_ON_IMPORT=enforce)`);
	}
}

export async function checkModel(server, name: string, source: string, mode: VerifyMode = verifyModeFromEnv(),
	log: Pick<Console, 'warn'> = console): Promise<ModelCheck> {
	if (mode === 'off') return { accept: true, errors: [], warnings: [] };
	let verification: IModelVerification;
	try {
		verification = await verifyModel(String(source ?? ''), server, name);
	}
	catch (err) {
		// a model the verifier cannot read at all is an error in its own right
		const issue = { severity: 'error', code: 'unreadable', message: err?.message ?? String(err) } as IModelIssue;
		verification = { valid: false, issues: [issue] } as IModelVerification;
	}
	const errors = verification.issues.filter(i => i.severity === 'error');
	const warnings = verification.issues.filter(i => i.severity !== 'error');
	if (errors.length || warnings.length)
		log.warn(`model ${name}: ${errors.length} error(s), ${warnings.length} warning(s)\n`
			+ verification.issues.map(i => `  ${i.severity} ${i.code}: ${i.message}`).join('\n'));
	return { accept: mode !== 'enforce' || errors.length === 0, verification, errors, warnings };
}

/** checkModel, throwing ModelRejectedError when the model must not be saved. */
export async function assertModelAcceptable(server, name: string, source: string, mode?: VerifyMode, log?: Pick<Console, 'warn'>) {
	const check = await checkModel(server, name, source, mode, log);
	if (!check.accept) throw new ModelRejectedError(name, check.errors);
	return check;
}

/** Verifies saved models (all of them when `names` is empty): one entry per model. */
export async function verifySavedModels(server, names: string[] = []) {
	const list = names.length ? names : (await server.definitions.getList()).map(m => (typeof m === 'string' ? m : m.name));
	const results: { name: string; valid: boolean; issues: IModelIssue[] }[] = [];
	for (const name of list) {
		try {
			const source = await server.definitions.getSource(name);
			const verification = await verifyModel(source, server, name);
			results.push({ name, valid: verification.valid, issues: verification.issues });
		}
		catch (err) {
			results.push({ name, valid: false, issues: [{ severity: 'error', code: 'unreadable', message: err?.message ?? String(err) } as IModelIssue] });
		}
	}
	return results;
}

/**
 * Answers a ModelRejectedError with the model's errors; returns false for any other error. The import APIs
 * answer 200 { errors, issues }, as they do for every other failure: bpmn-client turns that into a rejection
 * carrying the body and no HTTP status, which callers read as "the server refused this model" rather than a
 * transport failure. Pass `status` (422) where no such client depends on it.
 */
export function sendModelRejection(response, exc, status = 200): boolean {
	if (!(exc instanceof ModelRejectedError)) return false;
	response.status(status).json({ errors: exc.message, issues: exc.issues });
	return true;
}
