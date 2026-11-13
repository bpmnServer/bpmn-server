/**
 * Assignment policies (docs/design/assignment.md): a user task names one, `owf:assignmentPolicy="Approval"`, and
 * when it starts the policy says who works on it. A policy is a DMN decision table in the models folder,
 * `policies/assignment/<name>.dmn.xml`: conditions on the case's data in FEEL, the first rule that matches assigns. Its outputs
 * are the task's usual fields, `assignee`, `candidateUsers` and `candidateGroups`; a cell is a FEEL value, or a model
 * expression `$(...)` evaluated as the model's other expressions are (it can call appServices).
 *
 * The policy wins: each field its rule sets replaces what the model and the lane gave. No rule, no policy, or a
 * failing one: it assigns nothing, and the Rationale says why. A task never fails because of its policy.
 */
import * as fs from 'fs';
import * as path from 'path';
import { DMNEngine } from '../dmn/DMNEngine.js';
import { expressionScript } from './Expressions.js';
import { label } from '../elements/Flow.js';
import { decisionContext } from './DecisionContext.js';

export const POLICY_FIELDS = ['assignee', 'candidateUsers', 'candidateGroups'] as const;
/** The models folder's policies, one folder per kind: assignment here, security in policies/security (to come). */
export const POLICIES_FOLDER = 'policies/assignment';
/** Where assignment policies were at first (3.7.1's first try): moved into POLICIES_FOLDER when read. */
const EARLIER_FOLDER = 'policies';

/**
 * Policies written directly in policies/ (before the kinds had folders of their own) moved into policies/assignment.
 * Their tests (`<name>.policy.dmn.feature`, beside the models) stay as they are. One already there is kept, and the
 * other left where it is.
 */
function moveEarlierPolicies(definitionsPath: string) {
    const earlier = path.join(definitionsPath, EARLIER_FOLDER);
    let files: string[];
    try { files = fs.readdirSync(earlier, { withFileTypes: true }).filter(e => e.isFile() && /\.dmn\.xml$/i.test(e.name)).map(e => e.name); }
    catch { return; }
    if (!files.length) return;
    const folder = path.join(definitionsPath, POLICIES_FOLDER);
    fs.mkdirSync(folder, { recursive: true });
    for (const name of files)
        if (!fs.existsSync(path.join(folder, name))) fs.renameSync(path.join(earlier, name), path.join(folder, name));
}

/** What decided a task's assignment, kept on the item: its policy and rule, or the person who reassigned it. */
export interface IItemAssignment {
    policy?: string;
    rule?: number;
    /** who reassigned it by hand (Execution.assign), replacing what its policy decided */
    userName?: string;
}

/** A policy's file in a models folder, or null when it isn't there. */
export function policyFile(definitionsPath: string, name: string): string | null {
    if (!definitionsPath || !name || /[\\/]|\.\./.test(name)) return null;
    moveEarlierPolicies(definitionsPath);
    const file = path.join(definitionsPath, POLICIES_FOLDER, `${name}.dmn.xml`);
    return fs.existsSync(file) ? file : null;
}

/** The policies of a models folder, by name. */
export function policyNames(definitionsPath: string): string[] {
    if (!definitionsPath) return [];
    moveEarlierPolicies(definitionsPath);
    const folder = path.join(definitionsPath, POLICIES_FOLDER);
    if (!fs.existsSync(folder)) return [];
    return fs.readdirSync(folder).filter(f => /\.dmn\.xml$/i.test(f)).map(f => f.replace(/\.dmn\.xml$/i, '')).sort();
}

/** The roles of a models folder (`roles.json`, a list of names), or null when it has none. */
export function roleNames(definitionsPath: string): string[] | null {
    const file = definitionsPath && path.join(definitionsPath, 'roles.json');
    if (!file || !fs.existsSync(file)) return null;
    const roles = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(roles) || roles.some(r => typeof r !== 'string'))
        throw new Error('roles.json is a list of role names: ["Manager", "Director"]');
    return roles;
}

export const isExpression = (cell: string) => typeof cell === 'string' && /^\$[({]/.test(cell.trim());
const asList = (value): string[] => (Array.isArray(value) ? value : String(value).split(','))
    .map(v => String(v ?? '').trim()).filter(Boolean);

/**
 * A policy evaluated with this data: the first matching rule's number and its outputs (a `$(...)` cell as its text,
 * for the caller to evaluate), or no rule. Throws when the file can't be read or a cell isn't FEEL.
 */
export async function evaluatePolicy(file: string, context: Record<string, any>, log?: (message: string) => void): Promise<{ rule?: number; outputs: Record<string, any> | null }> {
    const dmn = await new DMNEngine({ log, keepOutput: isExpression, listInputs: true }).load(file);
    const result = dmn.evaluate({ ...(context || {}) });
    const outputs = (Array.isArray(result) ? result[0] : result) ?? null;
    return { rule: outputs ? dmn.matched[0] : undefined, outputs };
}

/**
 * Evaluates the task's policy and sets its assignment: what the matching rule's outputs give, each field it sets
 * replacing the model's. Writes a Rationale entry either way; never throws.
 */
export async function applyPolicy(node, item, policy: string): Promise<void> {
    const token = item.token;
    const element = `user task ${label(node)}`;
    const decide = (action: string, why: string[]) => token.decision({ seq: item.seq, element, action, why });
    const unassigned = (why: string[]) => decide('is not assigned by its policy', [`policy ${policy}`, ...why]);
    try {
        const file = policyFile(token.execution.server.configuration.definitionsPath, policy);
        if (!file)
            return unassigned([`there is no ${POLICIES_FOLDER}/${policy}.dmn.xml`]);
        // the one context every decision reads (engine/DecisionContext.ts): the data, the task's prepared inputs
        // (camunda:inputOutput), who acts and their relation to the case, the application's facts
        const execution = token.execution;
        const context = await decisionContext({
            kind: 'assignment', name: policy, data: token.data, input: item.input, task: node.id,
            user: { userName: execution.userName ?? null }, instance: execution.instance, appDelegate: execution.appDelegate,
            log: message => token.log(message),
        });
        const { rule, outputs } = await evaluatePolicy(file, context, message => token.log(message));
        if (!outputs)
            return unassigned(['no rule matched']);

        const set: Partial<Record<typeof POLICY_FIELDS[number], any>> = {};
        for (const field of POLICY_FIELDS) {
            let value = outputs[field];
            if (value == null || value === '') continue;
            if (isExpression(value) && expressionScript(value) !== null)
                value = await item.context.scriptHandler.evaluateExpression(item, value, field);
            if (value == null || value === '' || (Array.isArray(value) && !value.length)) continue;
            set[field] = field === 'assignee' ? String(value) : asList(value);
        }
        if (!Object.keys(set).length)
            return unassigned([`rule ${rule} matched, and gave no one`]);

        Object.assign(item, set);
        item.assignment = { policy, rule } as IItemAssignment;
        token.log(`..assignment policy ${policy}, rule ${rule}: ${JSON.stringify(set)}`);
        decide(`is ${whom(set)}`, [`policy ${policy}, rule ${rule}`]);
    }
    catch (exc) {
        unassigned([`the policy failed: ${exc?.message ?? exc}`]);
    }
}

/** An assignment in words: `assigned to ann, and offered to bob, Manager`, or `assigned to no one`. */
function whom(fields: { assignee?: any; candidateUsers?: any; candidateGroups?: any }): string {
    const offered = [...asList(fields.candidateUsers ?? []), ...asList(fields.candidateGroups ?? [])];
    return [
        fields.assignee ? `assigned to ${fields.assignee}` : null,
        offered.length ? `offered to ${offered.join(', ')}` : null,
    ].filter(Boolean).join(', and ') || 'assigned to no one';
}

/**
 * A person changed a waiting task's assignee or candidates (Execution.assign), and the Rationale says what it was and
 * what it is now. `before`: its fields beforehand; `changed`: the assignment's fields given.
 *
 * Taking an unassigned task oneself (a claim: only `assignee`, one's own name) keeps what decided it was offered to
 * them; any other change is that person's, in place of the policy that decided before.
 */
export function reassigned(execution, item, before: Record<string, any>, changed: Record<string, any>, userName: string): void {
    const now = Object.fromEntries(POLICY_FIELDS.map(f => [f, item[f]]));
    // the same people as before (a form sends every field): nothing to say, and what decided it stays
    if (whom(now) === whom(before)) return;
    const earlier = item.assignment?.policy ? `policy ${item.assignment.policy}, rule ${item.assignment.rule}` : item.assignment?.userName;
    const was = `it was ${whom(before)}${earlier ? ` (${earlier})` : ''}`;
    const element = `user task ${label(item.node)}`;
    const claim = userName && !before.assignee && changed.assignee === userName
        && !POLICY_FIELDS.some(f => f !== 'assignee' && f in changed);
    if (claim)
        return execution.decision({ seq: item.seq, element, action: `is claimed by ${userName}`, why: [was] });
    item.assignment = { userName } as IItemAssignment;
    execution.decision({ seq: item.seq, element, action: `is reassigned by ${userName ?? 'the system'}: ${whom(now)}`, why: [was] });
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

/**
 * Where each name is used as a role in a models folder: the lanes of its models (`<model>: lane`), and the groups its
 * policies assign as literals (`policy <name>, rule <n>`). By name.
 */
export async function roleUses(definitionsPath: string): Promise<Map<string, string[]>> {
    const uses = new Map<string, string[]>();
    const add = (name: string, where: string) => uses.set(name, [...(uses.get(name) ?? []), where]);
    if (!definitionsPath || !fs.existsSync(definitionsPath)) return uses;
    for (const file of fs.readdirSync(definitionsPath).filter(f => /\.bpmn$/i.test(f))) {
        const source = fs.readFileSync(path.join(definitionsPath, file), 'utf8');
        for (const m of source.matchAll(/<(?:\w+:)?lane\b[^>]*?\bname="([^"]*)"/g))
            add(m[1].trim(), `${file.replace(/\.bpmn$/i, '')}: lane`);
    }
    const { DMNParser } = await import('../dmn/DMNParser.js');
    for (const policy of policyNames(definitionsPath)) {
        try {
            const definitions = await DMNParser.loadFile(path.join(definitionsPath, POLICIES_FOLDER, `${policy}.dmn.xml`));
            const table = DMNEngine.topDecision(definitions)?.table;
            const groups = table ? table.outputs.findIndex(o => o.name === 'candidateGroups') : -1;
            if (groups < 0) continue;
            table.rules.forEach((rule, r) => {
                const literal = /^"([^"]*)"$/.exec((rule.outputEntries[groups] ?? '').trim());
                for (const group of literal ? literal[1].split(',').map(g => g.trim()).filter(Boolean) : [])
                    add(group, `policy ${policy}, rule ${r + 1}`);
            });
        }
        catch { /* a policy that can't be read: verifyModel says so */ }
    }
    return uses;
}
