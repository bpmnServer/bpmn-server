/**
 * The application's contract (docs/design/app-contract.md): what it publishes, in `app-contract.json`, its folder's.
 * The declarative part: the functions an expression may call (`appServices.<name>`, each with its type), its roles,
 * its APIs, its pages. It is guidance, not execution: the editor
 * offers its names and `verifyModel` checks a model against them; a model runs without it, as before.
 *
 * The delegate answers it (`describe()`: DefaultAppDelegate reads the file); the code part is the delegate's own
 * (`getAppServices`, `notify`, the hooks).
 */
import fs from 'node:fs';
import path from 'node:path';

export const APP_CONTRACT_FILE = 'app-contract.json';

export interface IContractParam { name: string; type?: string; description?: string }
export interface IContractExpression {
    /** a function: appServices.<name>(...) */
    kind: 'function';
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
    /**
     * The roles lanes and tasks are given to. `permissions` is what the role is allowed to do
     * (docs/design/security-profiles.md): 'user' starts the workflows it may and works its own tasks, 'designer'
     * designs models, 'administrator' manages users, roles, credentials and the settings. A role the contract does
     * not mention keeps the server's default for its name; one it mentions decides for itself, either way.
     */
    roles?: { name: string; title?: string; description?: string; permissions?: ('designer' | 'administrator')[] }[];
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
        if (e.kind !== 'function') problems.push(`${at}: kind is function`);
        if (typeof e.name !== 'string' || !NAME.test(e.name)) problems.push(`${at}: name is a name an expression can read`);
        else if (seen.has(`${e.kind}:${e.name}`)) problems.push(`${at}: declared twice`);
        else seen.add(`${e.kind}:${e.name}`);
        if (e.effect !== undefined && !['none', 'read', 'write'].includes(e.effect)) problems.push(`${at}: effect is none, read or write`);
        if (e.params !== undefined && (!Array.isArray(e.params) || e.params.some(p => typeof p?.name !== 'string'))) problems.push(`${at}: params is a list of { name, type }`);
    });
    list('roles').forEach((r, i) => {
        if (typeof r?.name !== 'string' || !r.name.trim()) problems.push(`roles[${i}]: name is required`);
        if (r?.permissions !== undefined && (!Array.isArray(r.permissions)
            || r.permissions.some(x => !ROLE_PERMISSIONS.includes(x))))
            problems.push(`roles[${i}]: permissions is a list of ${ROLE_PERMISSIONS.join(' or ')}`);
    });
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

/**
 * The roles the application declares, written back to its `app-contract.json` (3.7.5: where roles belong, replacing
 * the models folder's `roles.json`). Each role keeps what it had; a new one is added with its name only, and the
 * order given is kept. Returns the names written.
 *
 * An application whose contract comes from its delegate's `describe()` has no file to write: the caller checks
 * `readAppContract(file).contract` is from the file before offering to edit.
 */
export function saveContractRoles(file: string, roles: { name: string; title?: string; description?: string }[]): string[] {
    const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '{}';
    const contract = JSON.parse(text);
    const seen = new Set<string>();
    contract.roles = roles
        .map(r => ({ ...r, name: String(r.name).trim() }))
        .filter(r => r.name && !seen.has(r.name) && seen.add(r.name));
    fs.writeFileSync(file, JSON.stringify(contract, null, 2) + '\n');
    cache.delete(file);
    return contract.roles.map(r => r.name);
}

/** What a role may be allowed to do beyond its own tasks (docs/design/security-profiles.md). */
export const ROLE_PERMISSIONS = ['user', 'designer', 'administrator'] as const;
export type RolePermission = typeof ROLE_PERMISSIONS[number];

/**
 * The permissions the contract gives each role, by role name: what an application has said its roles may do, which
 * the server grants in addition to the groups it has always matched on (ADMIN, SYSTEM, DESIGNER). Nothing is taken
 * away by this, so a server that declares none behaves as before.
 */
export function rolePermissionsOf(contract: IAppContract | null | undefined): Map<string, RolePermission[]> {
    const out = new Map<string, RolePermission[]>();
    for (const role of contract?.roles ?? []) {
        const given = (role.permissions ?? []).filter(p => ROLE_PERMISSIONS.includes(p));
        if (given.length) out.set(role.name, [...new Set(given)]);
    }
    return out;
}

/** A contract's names, by kind: its functions (by name), its roles, its pages. */
export function contractNames(contract: IAppContract | null | undefined) {
    const expressions = contract?.expressions ?? [];
    return {
        functions: new Map(expressions.filter(e => e.kind === 'function').map(e => [e.name, e])),
        roles: (contract?.roles ?? []).map(r => r.name),
        pages: (contract?.pages ?? []).map(p => p.id),
    };
}

/** The names of a class's methods (its prototype's, and its parents' up to Object's): a services class. */
export function methodNames(aClass: any): string[] {
    const names = new Set<string>();
    for (let proto = aClass?.prototype; proto && proto !== Object.prototype; proto = Object.getPrototypeOf(proto))
        for (const [name, d] of Object.entries(Object.getOwnPropertyDescriptors(proto)))
            if (name !== 'constructor' && !name.startsWith('_') && (typeof d.value === 'function' || d.get)) names.add(name);
    return [...names];
}

/**
 * The contract compared with the delegate's code: a declared function the services provider lacks is an error, one
 * it has that is not declared a warning. As { severity, message }.
 */
export function compareWithCode(contract: IAppContract, { services }: { services?: string[] | null }) {
    const out: { severity: 'error' | 'warning'; message: string }[] = [];
    const names = contractNames(contract);
    const check = (kind: string, declared: string[], has: string[] | null | undefined, read: string) => {
        if (!has) return;
        for (const name of declared) if (!has.includes(name)) out.push({ severity: 'error', message: `${APP_CONTRACT_FILE} declares the ${kind} ${read}.${name}, which the delegate does not have` });
        for (const name of has) if (!declared.includes(name)) out.push({ severity: 'warning', message: `the delegate has ${read}.${name}, which ${APP_CONTRACT_FILE} does not declare` });
    };
    check('function', [...names.functions.keys()], services, 'appServices');
    return out;
}
