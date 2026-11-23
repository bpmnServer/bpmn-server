/**
 * The assignment add-on: a user task's assignment policy (`owf:assignmentPolicy`) decides who works on it as it starts
 * (AssignmentPolicy.ts). It plugs into the engine's hooks (engine/AddOns.ts) and depends on nothing else of ours.
 */
import path from 'node:path';
import { DMNEngine } from '../../dmn/DMNEngine.js';
import { DMNParser } from '../../dmn/DMNParser.js';
import { owfAttribute } from '../../elements/owfAttributes.js';
import { taskAttribute } from '../../elements/Tasks.js';
import { assignmentFilter } from './filters.js';
import manifest from './addon.json' with { type: 'json' };
import { registerPolicyBasics } from '../basics/index.js';
import type { IAddOnManifest } from '../../engine/AddOns.js';
import type { IAddOn, IAddOnModelCheck, IAddOnDecisionFile, IModelCheck } from '../../engine/AddOns.js';
import { applyPolicy, reassigned, policyFile, POLICY_FIELDS, POLICIES_FOLDER } from './AssignmentPolicy.js';
import { movePolicyFolder } from '../basics/folders.js';

export * from './AssignmentPolicy.js';

const policyOf = (def): string | null => {
    const name = owfAttribute(def, 'assignmentPolicy');
    return typeof name == 'string' && name.trim() ? name.trim() : null;
};

/**
 * A user task's assignment policy: in policies/assignment/, a readable decision whose outputs are the assignment's
 * fields; the groups it names, roles (when there are roles).
 */
async function checkPolicy(check: IAddOnModelCheck, policy: string, def) {
    const folder = check.folder;
    if (!folder) return;
    const file = policyFile(folder, policy);
    if (!file) {
        check.add('error', 'assignment-policy-not-found', `Assignment policy '${policy}': there is no ${POLICIES_FOLDER}/${policy}.dmn.xml.`, def);
        return;
    }
    let definitions;
    try { definitions = await DMNParser.loadFile(file); }
    catch (exc) {
        check.add('error', 'assignment-policy-invalid', `Assignment policy '${policy}': ${exc.message}`, def);
        return;
    }
    for (const issue of DMNParser.check(definitions))
        check.add('error', 'assignment-policy-invalid', `Assignment policy '${policy}': ${issue.message}`, def);
    const table = DMNEngine.topDecision(definitions)?.table;
    if (!table) return;
    const fields: readonly string[] = POLICY_FIELDS;
    for (const output of table.outputs)
        if (!fields.includes(output.name))
            check.add('warning', 'assignment-policy-output', `Assignment policy '${policy}': output '${output.name}' is not ${POLICY_FIELDS.join(', ')}; it is not used.`, def);
    const roles = check.roles();
    const groups = table.outputs.findIndex(o => o.name === 'candidateGroups');
    if (!roles || groups < 0) return;
    for (const [r, rule] of table.rules.entries()) {
        const cell = (rule.outputEntries[groups] ?? '').trim();
        // a literal: "Director", or "A,B"; an expression is known only when it runs
        const literal = /^"([^"]*)"$/.exec(cell);
        for (const group of literal ? literal[1].split(',').map(g => g.trim()).filter(Boolean) : [])
            if (!roles.includes(group))
                check.add('warning', 'role-unknown', `Assignment policy '${policy}', rule ${r + 1}: '${group}' is not a role (roles.json, app-contract.json: ${roles.join(', ')}).`, def);
    }
}

/**
 * Who works on a user task as it starts: its attributes (`camunda:assignee`, `candidateUsers`, `candidateGroups`), the
 * lane's group, then its policy, which wins for each field it sets. Set once, so `assign` is fired once.
 */
async function assignAtStart(execution, item) {
    const node = item.node;
    const set: Record<string, any> = {};
    for (const field of POLICY_FIELDS) {
        const found = await taskAttribute(item, node.def, field);
        if (found) set[field] = found.value;
    }
    // a task in a lane is offered to the group of the lane's name too; a single candidate group is text, not a list
    if (node.lane) {
        const groups = set.candidateGroups == null ? [] : Array.isArray(set.candidateGroups) ? set.candidateGroups : [set.candidateGroups];
        if (!groups.includes(node.lane)) groups.push(node.lane);
        set.candidateGroups = groups;
    }
    // the policy reads the task as its attributes and lane made it
    Object.assign(item, set);
    const policy = policyOf(node.def);
    const decided = policy ? await applyPolicy(node, item, policy) : null;
    await execution.assignItem(item, { ...set, ...(decided?.set ?? {}) }, decided?.why);
}

const modelCheck: IModelCheck = {
    name: 'assignment',
    async verifyNode(check, node, def) {
        const policy = policyOf(def);
        if (policy) await checkPolicy(check, policy, def);
    },
    decisionFiles(definition, folder) {
        movePolicyFolder(folder, 'assignment');
        const files: IAddOnDecisionFile[] = [];
        for (const node of definition.nodes.values()) {
            const policy = policyOf(node.def);
            const file = policy && policyFile(folder, policy);
            if (file) files.push({ what: `assignment policy ${policy}`, file });
        }
        return files;
    },
};

/** The Assignment add-on's manifest (addon.json): what it reads of a model, its settings, its doc page. */
export const assignmentManifest: IAddOnManifest = manifest as IAddOnManifest;

export const assignmentAddOn: IAddOn = {
    name: manifest.name,

    register(server) {
        registerPolicyBasics(server);
        server.listener.subscribe({
            async onEvent({ type, context, details }) {
                const item = context?.item;
                if (item?.node?.type !== 'bpmn:UserTask') return;
                // it starts: who works on it, decided once and set through the engine (Execution.assignItem)
                if (type === 'start') await assignAtStart(context?.execution ?? context, item);
                // a person changed who works on it: the Rationale says what it was
                else if (type === 'assign' && (details as any)?.by && (details as any).changed)
                    reassigned(context?.execution ?? context, item, (details as any).before, (details as any).assignment ?? {}, (details as any).by, (details as any).previous);
            },
        });
        server.registrations.addModelCheck(modelCheck);
        // what each user sees (the API's pre-query): the tasks offered to them, the processes they may start
        server.listener.on?.('pre-query', (context) => {
            const kind = context?.source?.query;
            if (kind === 'instances' || kind === 'items' || kind === 'startEvents')
                context.conditions.push(assignmentFilter.filter(kind, context.user, {}));
        });
        server.registrations.addDecisionLookup((ref, folder) => {
            const name = /^(.+)\.policy$/.exec(ref)?.[1];
            return name ? { folder: path.join(folder, POLICIES_FOLDER), name } : null;
        });
    },

};
