/**
 * Notification policies (docs/design/notification-policies.md): who is told what, and when. A process names one
 * (`owf:notificationPolicy`), a user task may too; a DMN table in `policies/notification/<name>.dmn.xml`, every rule
 * that matches notifying (hit policy COLLECT). Asked at an event (`assigned`, `completed`, `ended`) with the names every
 * expression reads (engine/DecisionContext.ts) and `event`. Its outputs: `notify` (whom), `template` (a template's
 * name, or the message), `channel`.
 *
 * The application delivers (appDelegate.notify); every notification is kept in the store's `wf_notifications`, and a
 * test run's (or every one, with NOTIFICATIONS=record) only kept. A notification never fails the process.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DMNEngine } from '../dmn/DMNEngine.js';
import { runningDecisionContext, decisionContext, actorElements } from './DecisionContext.js';
import { isExpression } from './AssignmentPolicy.js';
import { expressionScript, evaluateTemplate, templateParts } from './Expressions.js';
import { owfAttribute } from '../elements/owfAttributes.js';

export const NOTIFICATION_FOLDER = 'policies/notification';
export const NOTIFICATION_TEMPLATES = 'policies/notification/templates';
export const NOTIFICATION_COLLECTION = 'wf_notifications';
export const NOTIFICATION_EVENTS = ['assigned', 'completed', 'ended'] as const;
export const NOTIFICATION_OUTPUTS = ['notify', 'template', 'channel'] as const;
export type NotificationEvent = typeof NOTIFICATION_EVENTS[number];

/** One notification, as kept in `wf_notifications` and given to appDelegate.notify. */
export interface INotification {
    id: string;
    createdAt: Date;
    instanceId: string;
    instanceName: string;
    itemId?: string;
    elementId?: string;
    event: NotificationEvent;
    policy: string;
    rule: number;
    /** whom, as the rule said: user names and groups */
    to: string[];
    template?: string;
    subject: string;
    message: string;
    channel?: string;
    /** recorded: kept, not delivered; sent: the application's notify took it; failed: it threw, or the rule did */
    status: 'recorded' | 'sent' | 'failed';
    error?: string;
    /** a test run's */
    test: boolean;
}

const asList = (value): string[] => (Array.isArray(value) ? value.flat() : value == null || value === '' ? [] : String(value).split(','))
    .map(v => String(v ?? '').trim()).filter(Boolean);
const safeName = (name: string) => !!name && !/[\\/]|\.\./.test(name);

/** A notification policy's file, or null. */
export function notificationPolicyFile(definitionsPath: string, name: string): string | null {
    if (!definitionsPath || !safeName(name)) return null;
    const file = path.join(definitionsPath, NOTIFICATION_FOLDER, `${name}.dmn.xml`);
    return fs.existsSync(file) ? file : null;
}

/** The models folder's notification policies, by name. */
export function notificationPolicyNames(definitionsPath: string): string[] {
    const folder = definitionsPath && path.join(definitionsPath, NOTIFICATION_FOLDER);
    if (!folder || !fs.existsSync(folder)) return [];
    return fs.readdirSync(folder).filter(f => /\.dmn\.xml$/i.test(f)).map(f => f.replace(/\.dmn\.xml$/i, '')).sort();
}

/** A template's file (`templates/<name>.md` or `.txt`), or null: a value that isn't one is the message itself. */
export function notificationTemplateFile(definitionsPath: string, name: string): string | null {
    if (!definitionsPath || !safeName(name) || !/^[\w.-]+$/.test(name)) return null;
    for (const ext of ['.md', '.txt']) {
        const file = path.join(definitionsPath, NOTIFICATION_TEMPLATES, name + ext);
        if (fs.existsSync(file)) return file;
    }
    return null;
}

/** Whether notifications are delivered: not for a test run's instance, nor with NOTIFICATIONS=record. */
export function deliversNotifications(instance: any): boolean {
    return String(process.env.NOTIFICATIONS ?? '').toLowerCase() !== 'record' && !isTestInstance(instance);
}
const isTestInstance = (instance: any) => String(instance?.id ?? '').startsWith('test-');

let counter = 0;
const newId = () => `n-${Date.now().toString(36)}-${(counter++).toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * An event of an instance (`item`: its user task, for `assigned` and `completed`): the process's policy and the task's
 * own asked, each matching rule's notification worked out, delivered (or not) and kept. Never throws.
 */
export async function notifyEvent(execution: any, event: NotificationEvent, item?: any): Promise<INotification[]> {
    const sent: INotification[] = [];
    try {
        const folder = execution?.server?.configuration?.definitionsPath;
        const processes = execution?.definition?.processes;
        const proc = (item && typeof processes?.get === 'function' && processes.get(item.node?.processId)) || execution?.process;
        const processDef = proc?.def;
        const names = [owfAttribute(processDef, 'notificationPolicy'), item ? owfAttribute(item.node?.def, 'notificationPolicy') : undefined]
            .map(n => typeof n === 'string' ? n.trim() : '').filter(Boolean);
        for (const name of [...new Set(names)])
            sent.push(...await askPolicy(execution, folder, name, event, item));
    }
    catch (error) {
        execution?.error?.(`notification (${event}): ${error?.message ?? error}`);
    }
    return sent;
}

async function askPolicy(execution, folder: string, name: string, event: NotificationEvent, item?): Promise<INotification[]> {
    const element = item ? `user task '${item.node?.name || item.elementId}' (${item.elementId})` : 'the instance';
    const say = (action: string, why: string[]) => execution.decision({ seq: item?.seq, element, action, why });
    const file = notificationPolicyFile(folder, name);
    if (!file) {
        say('notifies no one', [`policy ${name}`, `there is no ${NOTIFICATION_FOLDER}/${name}.dmn.xml`]);
        return [];
    }
    let rows: { rule: number; outputs: Record<string, any> }[];
    try {
        const context = item
            ? await runningDecisionContext(item, { kind: 'notification', name, task: item.elementId })
            : await decisionContext({ kind: 'notification', name, data: execution.instance?.data, instance: execution.instance,
                items: execution.getItems?.(), elements: actorElements(execution.definition), user: { userName: execution.userName ?? null },
                appServices: execution.servicesProvider, appDelegate: execution.appDelegate });
        context.event = event;
        const dmn = await new DMNEngine({ listInputs: true, keepOutput: isExpression }).load(file);
        const result = await dmn.evaluateAsync(context);
        const outputs: any[] = Array.isArray(result) ? result : result ? [result] : [];
        rows = outputs.map((o, i) => ({ rule: dmn.matched[i] ?? i + 1, outputs: o ?? {} }));
    }
    catch (error) {
        say('notifies no one', [`policy ${name}`, `it failed: ${error?.message ?? error}`]);
        return [];
    }
    const scope = item ?? execution;
    const handler = execution.scriptHandler;
    const made: INotification[] = [];
    for (const { rule, outputs } of rows) {
        const base = {
            id: newId(), createdAt: new Date(), instanceId: execution.instance?.id, instanceName: execution.instance?.name,
            itemId: item?.id, elementId: item?.elementId, event, policy: name, rule, test: isTestInstance(execution.instance),
        };
        let notification: INotification;
        try {
            let to = outputs.notify;
            if (typeof to === 'string' && isExpression(to) && expressionScript(to) !== null)
                to = await handler.evaluateExpression(scope, to, 'notify');
            const whom = [...new Set(asList(to))];
            if (!whom.length) {
                say('notifies no one', [`policy ${name}, rule ${rule}`, 'its notify comes to nobody']);
                continue;
            }
            const { subject, message, template } = await compose(handler, scope, folder, outputs.template);
            notification = { ...base, to: whom, template, subject, message, channel: outputs.channel ? String(outputs.channel) : undefined, status: 'recorded' };
        }
        catch (error) {
            notification = { ...base, to: asList(outputs.notify), subject: '', message: '', status: 'failed', error: `its rule failed: ${error?.message ?? error}` };
        }
        if (notification.status !== 'failed' && deliversNotifications(execution.instance) && typeof execution.appDelegate?.notify === 'function') {
            try {
                await execution.appDelegate.notify(notification);
                notification.status = 'sent';
            }
            catch (error) {
                notification.status = 'failed';
                notification.error = `the application's notify failed: ${error?.message ?? error}`;
            }
        }
        await keep(execution, notification);
        say(notification.status === 'failed' ? `did not notify ${notification.to.join(', ')}` : `notified ${notification.to.join(', ')}`,
            [`policy ${name}, rule ${rule}`, ...(notification.template ? [`template ${notification.template}`] : []),
                notification.status === 'recorded' ? 'kept, not delivered' : notification.status === 'failed' ? notification.error : 'delivered']);
        made.push(notification);
    }
    return made;
}

/** The message: a template's file (first line the subject), or the text itself; ${...} parts filled in. */
async function compose(handler, scope, folder: string, value): Promise<{ subject: string; message: string; template?: string }> {
    const text = value == null ? '' : String(value);
    const file = notificationTemplateFile(folder, text.trim());
    const source = file ? fs.readFileSync(file, 'utf8') : text;
    const fill = async (part: string) => templateParts(part) ? await evaluateTemplate(handler, scope, part) : part;
    const lines = source.replace(/\r\n/g, '\n').split('\n');
    const subject = await fill(lines[0].replace(/^#+\s*/, '').trim());
    const message = file ? (await fill(lines.slice(1).join('\n'))).trim() : await fill(source);
    return { subject, message, template: file ? text.trim() : undefined };
}

/** Where notifications are kept: the server's document store, in its configuration's database (as API v3's tokens are). */
function storeOf(server: any): { store: any; database: string } {
    const store = server?.documentStore ?? server?.dataStore?.db;
    const database = (server?.configuration?.database?.MongoDB ?? { db: 'bpmn' }).db ?? 'bpmn';
    return { store, database };
}

/** Kept in the store's wf_notifications; one that can't be kept is logged. */
async function keep(execution, notification: INotification) {
    try {
        const { store, database } = storeOf(execution.server);
        if (typeof store?.insert !== 'function') throw new Error('the server has no document store');
        await store.insert(database, NOTIFICATION_COLLECTION, [{ ...notification }]);
    }
    catch (error) {
        execution.error?.(`notification ${notification.id} not kept: ${error?.message ?? error}`);
    }
}

/** An instance's notifications, oldest first. */
export async function notificationsOf(server: any, instanceId: string): Promise<INotification[]> {
    const { store, database } = storeOf(server);
    if (typeof store?.find !== 'function') return [];
    const found = await store.find(database, NOTIFICATION_COLLECTION, { instanceId }, null, { createdAt: 1 });
    return (found ?? []).map(({ _id, ...n }) => n);
}
