/**
 * The application's contract (docs/design/app-contract.md): what it publishes, in `app-contract.json`, its folder's.
 * The declarative part: the names an expression may use (its variables, `appVars.<name>`, and functions,
 * `appServices.<name>`, each with its type), its roles, its APIs, its pages. It is guidance, not execution: the editor
 * offers its names and `verifyModel` checks a model against them; a model runs without it, as before.
 *
 * The delegate answers it (`describe()`: DefaultAppDelegate reads the file); the code part is the delegate's own
 * (`getAppServices`, `getAppVars`, `notify`, the hooks).
 */
import fs from 'node:fs';
import path from 'node:path';

export const APP_CONTRACT_FILE = 'app-contract.json';

export interface IContractParam { name: string; type?: string; description?: string }
export interface IContractExpression {
    /** var: appVars.<name>, a value with no arguments; function: appServices.<name>(...) */
    kind: 'var' | 'function';
    name: string;
    type?: string;
    description?: string;
    params?: IContractParam[];
    returns?: string;
    async?: boolean;
    /** what a function does: none, read, write. A decision may not call a write function. */
    effect?: 'none' | 'read' | 'write';
}
export interface IAppContract {
    name?: string;
    description?: string;
    expressions?: IContractExpression[];
    /** JSON Schemas, by name, that the expressions' types name */
    types?: Record<string, any>;
    roles?: { name: string; title?: string; description?: string }[];
    apis?: { id: string; openapi: string }[];
    pages?: { id: string; url: string; title?: string }[];
}

const NAME = /^[A-Za-z_$][\w$]*$/;

/** What is wrong with a contract, as sentences; none when it is fine. */
export function contractProblems(contract: any): string[] {
    const problems: string[] = [];
    if (!contract || typeof contract !== 'object' || Array.isArray(contract)) return ['it is not a JSON object'];
    const list = (key: string) => {
        const value = contract[key];
        if (value === undefined) return [];
        if (!Array.isArray(value)) { problems.push(`${key} is a list`); return []; }
        return value;
    };
    const seen = new Set<string>();
    list('expressions').forEach((e, i) => {
        const at = `expressions[${i}]${e?.name ? ` (${e.name})` : ''}`;
        if (!e || typeof e !== 'object') return problems.push(`${at} is an object`);
        if (e.kind !== 'var' && e.kind !== 'function') problems.push(`${at}: kind is var or function`);
        if (typeof e.name !== 'string' || !NAME.test(e.name)) problems.push(`${at}: name is a name an expression can read`);
        else if (seen.has(`${e.kind}:${e.name}`)) problems.push(`${at}: declared twice`);
        else seen.add(`${e.kind}:${e.name}`);
        if (e.effect !== undefined && !['none', 'read', 'write'].includes(e.effect)) problems.push(`${at}: effect is none, read or write`);
        if (e.params !== undefined && (!Array.isArray(e.params) || e.params.some(p => typeof p?.name !== 'string'))) problems.push(`${at}: params is a list of { name, type }`);
        if (e.kind === 'var' && e.params?.length) problems.push(`${at}: a variable takes no arguments`);
    });
    list('roles').forEach((r, i) => { if (typeof r?.name !== 'string' || !r.name.trim()) problems.push(`roles[${i}]: name is required`); });
    list('apis').forEach((a, i) => { if (typeof a?.id !== 'string' || typeof a?.openapi !== 'string') problems.push(`apis[${i}]: id and openapi are required`); });
    list('pages').forEach((p, i) => { if (typeof p?.id !== 'string' || typeof p?.url !== 'string') problems.push(`pages[${i}]: id and url are required`); });
    if (contract.types !== undefined && (typeof contract.types !== 'object' || Array.isArray(contract.types))) problems.push('types is an object of JSON Schemas by name');
    return problems;
}

const cache = new Map<string, { stamp: string; contract: IAppContract | null; problems: string[] }>();

/**
 * The contract in a file (default: the working folder's app-contract.json): { contract, problems }; contract null
 * when there is no file, or it can't be read. Read again only when the file changed.
 */
export function readAppContract(file = path.resolve(APP_CONTRACT_FILE)): { contract: IAppContract | null; problems: string[]; file: string } {
    let stat: fs.Stats;
    try { stat = fs.statSync(file); } catch { return { contract: null, problems: [], file }; }
    const stamp = `${stat.mtimeMs}:${stat.size}`;
    const cached = cache.get(file);
    if (cached?.stamp === stamp) return { contract: cached.contract, problems: cached.problems, file };
    let contract: IAppContract | null = null, problems: string[];
    try {
        const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
        problems = contractProblems(parsed);
        contract = parsed;
    }
    catch (error) { problems = [`${path.basename(file)} can not be read: ${error.message}`]; }
    cache.set(file, { stamp, contract, problems });
    return { contract, problems, file };
}

/** A contract's names, by kind: its variables and functions (by name), its roles, its pages. */
export function contractNames(contract: IAppContract | null | undefined) {
    const expressions = contract?.expressions ?? [];
    return {
        vars: new Map(expressions.filter(e => e.kind === 'var').map(e => [e.name, e])),
        functions: new Map(expressions.filter(e => e.kind === 'function').map(e => [e.name, e])),
        roles: (contract?.roles ?? []).map(r => r.name),
        pages: (contract?.pages ?? []).map(p => p.id),
    };
}

/** The names of a class's methods (its prototype's, and its parents' up to Object's): a variables or functions class. */
export function methodNames(aClass: any): string[] {
    const names = new Set<string>();
    for (let proto = aClass?.prototype; proto && proto !== Object.prototype; proto = Object.getPrototypeOf(proto))
        for (const [name, d] of Object.entries(Object.getOwnPropertyDescriptors(proto)))
            if (name !== 'constructor' && !name.startsWith('_') && (typeof d.value === 'function' || d.get)) names.add(name);
    return [...names];
}

/**
 * The contract compared with the delegate's code: a declared function the services provider lacks is an error, one
 * it has that is not declared a warning; the same for the variables and the variables class. As { severity, message }.
 */
export function compareWithCode(contract: IAppContract, { services, vars }: { services?: string[] | null; vars?: string[] | null }) {
    const out: { severity: 'error' | 'warning'; message: string }[] = [];
    const names = contractNames(contract);
    const check = (kind: string, declared: string[], has: string[] | null | undefined, read: string) => {
        if (!has) return;
        for (const name of declared) if (!has.includes(name)) out.push({ severity: 'error', message: `${APP_CONTRACT_FILE} declares the ${kind} ${read}.${name}, which the delegate does not have` });
        for (const name of has) if (!declared.includes(name)) out.push({ severity: 'warning', message: `the delegate has ${read}.${name}, which ${APP_CONTRACT_FILE} does not declare` });
    };
    check('function', [...names.functions.keys()], services, 'appServices');
    check('variable', [...names.vars.keys()], vars, 'appVars');
    return out;
}

/** The `appVars.<name>`s a text reads (an expression, a script, a decision table's cells). */
export function appVarsRead(text: string): string[] {
    return [...new Set([...String(text ?? '').matchAll(/\bappVars\s*\.\s*([A-Za-z_$][\w$]*)/g)].map(m => m[1]))];
}

/**
 * The application's variables an evaluation reads, worked out before it runs (docs/design/app-contract.md §2.1):
 * the delegate's getAppVars(context) object, each name read once (a method called, an async one awaited). A name it
 * doesn't have reads as undefined. `names`: those read; all of the class's, when not known.
 */
export async function appVarsFor(delegate: any, context: Record<string, any>, names?: string[]): Promise<Record<string, any>> {
    if (!delegate || (typeof delegate.getAppVars !== 'function' && !delegate.appVarsClass)) return {};
    const source = typeof delegate.getAppVars === 'function' ? await delegate.getAppVars(context) : new delegate.appVarsClass(context);
    if (!source) return {};
    const wanted = names ?? (delegate.appVarsClass ? methodNames(delegate.appVarsClass) : Object.keys(source));
    const values: Record<string, any> = {};
    for (const name of wanted) {
        const member = source[name];
        values[name] = await (typeof member === 'function' ? member.call(source) : member);
    }
    return Object.freeze(values);
}
