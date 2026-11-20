/**
 * The assignment add-on: a user task's assignment policy (`owf:assignmentPolicy`) decides who works on it as it starts
 * (AssignmentPolicy.ts). It plugs into the engine's hooks (engine/AddOns.ts) and depends on nothing else of ours.
 */
import path from 'node:path';
import { DMNEngine } from '../../dmn/DMNEngine.js';
import { DMNParser } from '../../dmn/DMNParser.js';
import { owfAttribute } from '../../elements/owfAttributes.js';
import type { IAddOn, IAddOnModelCheck, IAddOnDecisionFile } from '../../engine/AddOns.js';
import { applyPolicy, reassigned, policyFile, POLICY_FIELDS, POLICIES_FOLDER } from './AssignmentPolicy.js';

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

export const assignmentAddOn: IAddOn = {
    name: 'assignment',

    // last of what decides who works on it: it wins over the attributes and the lane
    async taskStarting(item, node) {
        const policy = policyOf(node.def);
        if (policy) await applyPolicy(node, item, policy);
    },
    taskReassigned(execution, item, before, changed, userName) {
        reassigned(execution, item, before, changed, userName);
    },

    async verifyNode(check, node, def) {
        const policy = policyOf(def);
        if (policy) await checkPolicy(check, policy, def);
    },
    decisionFiles(definition, folder) {
        const files: IAddOnDecisionFile[] = [];
        for (const node of definition.nodes.values()) {
            const policy = policyOf(node.def);
            const file = policy && policyFile(folder, policy);
            if (file) files.push({ what: `assignment policy ${policy}`, file });
        }
        return files;
    },
    decisionByName(ref, folder) {
        const name = /^(.+)\.policy$/.exec(ref)?.[1];
        return name ? { folder: path.join(folder, POLICIES_FOLDER), name } : null;
    },
};
