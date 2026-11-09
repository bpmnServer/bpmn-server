/*
 * When running a process fails (a script or expression of the model throws, a service is missing, ...), the
 * workflow pages answer with what went wrong and what bpmn-server's checks find in the model, instead of an
 * error 500. The engine reports the error to its listeners and rethrows it (Engine.exception); here it is
 * caught, the model is checked (verifyModel) and ProcessRunError carries both to processRunErrorHandler.
 */
import { verifyModel } from '../index.js';
import { redactSecrets } from './middleware/errorDetails.js';

export class ProcessRunError extends Error {
    readonly status: number;
    constructor(readonly processName: string | undefined, readonly cause: any, readonly issues: any[]) {
        super(cause?.message || String(cause));
        this.name = 'ProcessRunError';
        // a task that was already completed is the caller's mistake, not the model's
        this.status = cause?.code === 'ITEM_NOT_WAITING' ? 409 : 422;
    }
}

/** What the operation runs: a model by name, or the instance an item belongs to. */
type RunTarget = { processName?: string; itemId?: string };

async function modelOf(server, target: RunTarget): Promise<string | undefined> {
    if (target.processName)
        return target.processName;
    if (!target.itemId)
        return undefined;
    try {
        const instance = await server.dataStore.findInstance({ 'items.id': target.itemId }, 'summary');
        return instance?.name;
    }
    catch {
        return undefined;
    }
}

/** Run an engine operation; when it fails, throw a ProcessRunError with the model's issues. */
export async function runProcess(server, target: RunTarget, operation: () => Promise<any>): Promise<any> {
    try {
        return await operation();
    }
    catch (err) {
        const processName = await modelOf(server, target);
        let issues = [];
        if (processName) {
            try {
                const source = await server.definitions.getSource(processName);
                issues = (await verifyModel(source, server, processName)).issues
                    .filter(issue => issue.severity !== 'info');
            }
            catch {
                issues = [];    // the model itself is not readable: the error says why
            }
        }
        throw new ProcessRunError(processName, err, issues);
    }
}

/** Express error handler: a failed run as a page (or JSON for API-style requests), status 422 or 409. */
export function processRunErrorHandler(err, req, res, next): void {
    // nothing to run it: not the model's fault, so nothing to check
    if (err?.code === 'ENGINE_NOT_RUNNING' || err?.cause?.code === 'ENGINE_NOT_RUNNING') {
        if (res.headersSent) return next(err);
        res.status(503);
        if (req.xhr || !req.accepts?.('html')) { res.json({ status: 503, error: 'EngineNotRunning', message: err.message }); return; }
        res.render('runError', { processName: err.processName, message: err.message, issues: [], status: 503 });
        return;
    }
    if (!(err instanceof ProcessRunError) || res.headersSent) {
        next(err);
        return;
    }
    console.error(`[process error] ${req.method} ${String(req.originalUrl || req.url).split('?')[0]} ${err.processName ?? ''}`, err.cause);
    const message = redactSecrets(err.message);
    res.status(err.status);
    if (req.xhr || !req.accepts?.('html')) {
        res.json({ status: err.status, error: 'ProcessRunError', processName: err.processName, message, issues: err.issues });
        return;
    }
    res.render('runError', { processName: err.processName, message, issues: err.issues, status: err.status });
}
