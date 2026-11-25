/**
 * The roles of a models folder: `roles.json`, a list of names. A lane is a role, and so is a group a task is offered
 * to; the engine reads them for the model checks, and an add-on (a policy) may name them.
 */
import * as fs from 'fs';
import * as path from 'path';

/** The roles of a models folder (`roles.json`, a list of names), or null when it has none. */
export function roleNames(definitionsPath: string): string[] | null {
    const file = definitionsPath && path.join(definitionsPath, 'roles.json');
    if (!file || !fs.existsSync(file)) return null;
    const roles = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(roles) || roles.some(r => typeof r !== 'string'))
        throw new Error('roles.json is a list of role names: ["Manager", "Director"]');
    return roles;
}

/** Why a role name can't be used, or null: a name of letters, digits, spaces, `_`, `-` or `.`, at most 64. */
export function roleNameProblem(name: unknown): string | null {
    if (typeof name !== 'string' || !name.trim()) return 'A role needs a name';
    if (name.trim().length > 64) return 'A role name is at most 64 characters';
    if (!/^[\p{L}\p{N}][\p{L}\p{N} _.-]*$/u.test(name.trim())) return `'${name}' is not a role name: letters, digits, spaces, _ - . (no commas)`;
    return null;
}

/** Writes roles.json: the names, each once, in the order given. */
export function saveRoleNames(definitionsPath: string, roles: string[]): string[] {
    const names = [...new Set(roles.map(r => String(r).trim()))];
    for (const name of names) {
        const problem = roleNameProblem(name);
        if (problem) throw new Error(problem);
    }
    fs.writeFileSync(path.join(definitionsPath, 'roles.json'), JSON.stringify(names, null, 2) + '\n');
    return names;
}
