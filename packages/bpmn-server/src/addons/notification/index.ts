/**
 * The notification add-on: a process's or user task's notification policy (`owf:notificationPolicy`) says who is told
 * what when a task waits, a task is completed, or the instance ends (NotificationPolicy.ts). It plugs into the engine's
 * hooks (engine/AddOns.ts) and depends on nothing else of ours.
 */
import path from 'node:path';
import { DMNEngine } from '../../dmn/DMNEngine.js';
import { DMNParser } from '../../dmn/DMNParser.js';
import type { IAddOn, IAddOnModelCheck, IAddOnDecisionFile } from '../../engine/AddOns.js';
import { notifyEvent, notificationPolicyFile, notificationTemplateFile, NOTIFICATION_FOLDER, NOTIFICATION_TEMPLATES, NOTIFICATION_OUTPUTS } from './NotificationPolicy.js';

export * from './NotificationPolicy.js';

const policyOf = (def): string | null => {
    const name = def?.$attrs?.['owf:notificationPolicy'];
    return typeof name == 'string' && name.trim() ? name.trim() : null;
};

/**
 * A process's or user task's notification policy: in policies/notification/, a readable decision whose outputs are
 * notify, template, channel; a template cell that is a name, a template file.
 */
async function checkPolicy(check: IAddOnModelCheck, policy: string, def) {
    const folder = check.folder;
    if (!folder) return;
    const file = notificationPolicyFile(folder, policy);
    if (!file) {
        check.add('error', 'notification-policy-not-found', `Notification policy '${policy}': there is no ${NOTIFICATION_FOLDER}/${policy}.dmn.xml.`, def);
        return;
    }
    let definitions;
    try { definitions = await DMNParser.loadFile(file); }
    catch (exc) {
        check.add('error', 'notification-policy-invalid', `Notification policy '${policy}': ${exc.message}`, def);
        return;
    }
    for (const issue of DMNParser.check(definitions))
        check.add('error', 'notification-policy-invalid', `Notification policy '${policy}': ${issue.message}`, def);
    const table = DMNEngine.topDecision(definitions)?.table;
    if (!table) return;
    const outputs: readonly string[] = NOTIFICATION_OUTPUTS;
    for (const output of table.outputs)
        if (!outputs.includes(output.name))
            check.add('warning', 'notification-policy-output', `Notification policy '${policy}': output '${output.name}' is not ${NOTIFICATION_OUTPUTS.join(', ')}; it is not used.`, def);
    const template = table.outputs.findIndex(o => o.name === 'template');
    if (template < 0) return;
    for (const [r, rule] of table.rules.entries()) {
        // a name ("approval-request"): a template file; a text with spaces or ${...} is the message itself
        const name = /^"([\w.-]+)"$/.exec((rule.outputEntries[template] ?? '').trim())?.[1];
        if (name && !notificationTemplateFile(folder, name))
            check.add('warning', 'notification-template-not-found', `Notification policy '${policy}', rule ${r + 1}: there is no template '${name}' (${NOTIFICATION_TEMPLATES}/${name}.md); the name itself would be the message.`, def);
    }
}

export const notificationAddOn: IAddOn = {
    name: 'notification',

    // it waits for someone: its assignment is decided (taskStarting), so whom to tell is known
    async taskWaiting(item) { await notifyEvent(item.token.execution, 'assigned', item); },
    // who completed it is its actor
    async taskCompleted(item) { await notifyEvent(item.token.execution, 'completed', item); },
    async executionEnded(execution) { await notifyEvent(execution, 'ended'); },

    async verifyProcess(check, proc, def) {
        const policy = policyOf(def);
        if (policy) await checkPolicy(check, policy, def);
    },
    async verifyNode(check, node, def) {
        const policy = policyOf(def);
        if (policy) await checkPolicy(check, policy, def);
    },
    decisionFiles(definition, folder) {
        const files: IAddOnDecisionFile[] = [];
        const add = (def) => {
            const policy = policyOf(def);
            const file = policy && notificationPolicyFile(folder, policy);
            if (file && !files.some(f => f.file === file)) files.push({ what: `notification policy ${policy}`, file, actors: false });
        };
        for (const proc of definition.processes.values()) add(proc.def || proc);
        for (const node of definition.nodes.values()) add(node.def);
        return files;
    },
    decisionByName(ref, folder) {
        const name = /^(.+)\.notification-policy$/.exec(ref)?.[1];
        return name ? { folder: path.join(folder, NOTIFICATION_FOLDER), name } : null;
    },
};
