import { BPMNAPI, SecureUser } from '../../index.js';
import { notATest } from '../../testing/scenarios.js';

/*
 * The task operations, once (docs/design/api-v3.md): what an application does for one of its users. /api2/tasks (v2)
 * and /api/v3 map them, each with its own shapes. A user has a part in a task when they are its assignee, a candidate,
 * in a candidate group, or the task has no assignment; without one, or with no such task, the answer is the same 404,
 * so an id can not be probed. The engine holds the rule for who may see an item and the check that an item still
 * waits, under the instance's lock; the assignee's rule is here. See docs/docs/application-integration-design.md, 5.1.
 */

export const DEFAULT_LIMIT = 50, MAX_LIMIT = 200;

/** An answer with a real status and a code. */
export class TaskError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) {
        super(message);
    }
}
const notFound = () => new TaskError(404, 'No such task', 'TASK_NOT_FOUND');

const toList = (value): string[] => Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? value.split(',').map(v => v.trim()) : [];

export function hasPart(item, user: SecureUser): boolean {
    const users = toList(item.candidateUsers), groups = toList(item.candidateGroups);
    if (!item.assignee && !users.length && !groups.length) return true;
    return item.assignee === user.userName || users.includes(user.userName) || groups.some(group => user.userGroups.includes(group));
}

/** What an application sees of a task: not the engine's own fields. */
export function asTask(item) {
    const { id, instanceId, processName, elementId, name, status, assignee, candidateUsers, candidateGroups, startedAt, endedAt, dueDate, followUpDate, priority, userName } = item;
    return { id, instanceId, processName, elementId, name, status, assignee, candidateUsers, candidateGroups, startedAt, endedAt, dueDate, followUpDate, priority, completedBy: endedAt ? userName : undefined };
}

/** A form field as the model has it (camunda:formField), as plain JSON: its options and validation too. */
function asField(field) {
    const children = field.$children ?? [];
    const values = field.values ?? children.filter(c => c.$type === 'camunda:value');
    const validation = field.validation?.constraints ?? children.filter(c => c.$type === 'camunda:validation').flatMap(v => v.$children ?? []);
    return {
        id: field.id, label: field.label ?? field.id, type: field.type, defaultValue: field.defaultValue,
        ...(values.length ? { values: values.map(v => ({ id: v.id, name: v.name ?? v.id })) } : {}),
        ...(validation.length ? { validation: validation.map(c => ({ name: c.name, config: c.config })) } : {}),
    };
}

/** An element's form: its fields, and the application's own form when the model names one (formKey). */
export function formOf(definition, elementId: string) {
    const { node, fields, formKey } = definition.getNodeInfo(elementId);
    return node ? { fields: (fields ?? []).map(asField), formKey } : { fields: [] };
}

/** Where a task is in the list, by when it started: a page's bookmark. */
const position = item => `${new Date(item.startedAt ?? 0).getTime()}_${item.id}`;
function isAfter(item, after: string) {
    const [time, id] = [Number(after.slice(0, after.indexOf('_'))), after.slice(after.indexOf('_') + 1)];
    const itemTime = new Date(item.startedAt ?? 0).getTime();
    return itemTime > time || (itemTime === time && item.id > id);
}

const assertWaiting = item => {
    if (item.status !== 'wait')
        throw new TaskError(409, `Task ${item.id} is not waiting (it is ${item.status})`, 'ITEM_NOT_WAITING');
};
const assertData = data => {
    if (typeof data !== 'object' || data === null || Array.isArray(data))
        throw new TaskError(400, 'data is an object', 'BAD_DATA');
};

export class TaskOperations {
    readonly api: BPMNAPI;
    constructor(readonly server) {
        this.api = new BPMNAPI(server);
    }

    /** The task this user has a part in, or the same 404. */
    private async find(id: string, user: SecureUser) {
        const [item] = await this.api.data.findItems({ 'items.id': id, ...notATest }, user);
        if (!item || item.type !== 'bpmn:UserTask' || !hasPart(item, user))
            throw notFound();
        return item;
    }

    /** The waiting tasks this user has a part in, oldest first, a page at a time: { tasks, next } (next: the bookmark, or null). */
    async list(user: SecureUser, { limit = DEFAULT_LIMIT, after }: { limit?: number, after?: string } = {}) {
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT)
            throw new TaskError(400, `limit is from 1 to ${MAX_LIMIT}`, 'BAD_LIMIT');
        if (after !== undefined && !/^\d+_./.test(String(after)))
            throw new TaskError(400, 'after is a list\'s next', 'BAD_AFTER');
        // lean: the instances' data is not read for a list (fable-review.md H5)
        const waiting = (await this.api.data.findItems({ 'items.status': 'wait', 'items.type': 'bpmn:UserTask', ...notATest }, user, { lean: true }))
            .filter(item => item.status === 'wait' && item.type === 'bpmn:UserTask' && hasPart(item, user) && (after === undefined || isAfter(item, String(after))))
            .sort((a, b) => new Date(a.startedAt ?? 0).getTime() - new Date(b.startedAt ?? 0).getTime() || (a.id < b.id ? -1 : 1));
        const page = waiting.slice(0, limit);
        return { tasks: page.map(asTask), next: waiting.length > limit ? position(page.at(-1)) : null };
    }

    /** The tasks this user completed, newest first: the latest `limit`. */
    async completed(user: SecureUser, { limit = 10 }: { limit?: number } = {}) {
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT)
            throw new TaskError(400, `limit is from 1 to ${MAX_LIMIT}`, 'BAD_LIMIT');
        const ended = await this.api.data.findItems({ 'items.status': 'end', 'items.type': 'bpmn:UserTask', 'items.userName': user.userName, ...notATest }, user, { lean: true });
        return ended
            .filter(item => item.userName === user.userName && item.status === 'end' && item.type === 'bpmn:UserTask')
            .sort((a, b) => new Date(b.endedAt ?? 0).getTime() - new Date(a.endedAt ?? 0).getTime())
            .slice(0, limit)
            .map(asTask);
    }

    /** One task, with its instance's data and its form. */
    async get(user: SecureUser, id: string) {
        const item = await this.find(id, user);
        const definition = await this.server.definitions.load(item.processName).catch(() => null);
        return { ...asTask(item), data: (item as any).instanceData, form: definition ? formOf(definition, item.elementId) : { fields: [] } };
    }

    /** The task becomes this user's: { task }. Two claims at the same moment can not both win. */
    async claim(user: SecureUser, id: string) {
        const item = await this.find(id, user);
        assertWaiting(item);
        if (item.assignee === user.userName)
            return { task: asTask(item) };
        if (item.assignee)
            throw new TaskError(409, 'The task is assigned to someone else', 'TASK_ASSIGNED');
        const key = `task:${id}`;
        // a moment's claim, by the engine that owns the locks (docs/design/engine-isolation.md)
        if (!await this.server.engine.claim(key))
            throw new TaskError(409, 'The task is being claimed', 'TASK_ASSIGNED');
        try {
            const current = await this.find(id, user);
            assertWaiting(current);
            if (current.assignee && current.assignee !== user.userName)
                throw new TaskError(409, 'The task is assigned to someone else', 'TASK_ASSIGNED');
            await this.api.engine.assign({ id: item.instanceId, 'items.id': id }, {}, { assignee: user.userName }, user);
            return { task: asTask(await this.find(id, user)) };
        }
        finally {
            await this.server.engine.releaseClaim(key);
        }
    }

    /** Completes the task with this data, recording this user: { task, instance }. */
    async complete(user: SecureUser, id: string, data = {}) {
        assertData(data);
        const item = await this.find(id, user);
        assertWaiting(item);
        if (item.assignee && item.assignee !== user.userName)
            throw new TaskError(403, 'The task is assigned to someone else', 'TASK_ASSIGNED');
        const { instance } = await this.api.engine.invoke({ id: item.instanceId, 'items.id': id }, data, user);
        const done = instance.items.find(i => i.id === id);
        return {
            task: asTask({ ...done, instanceId: instance.id, processName: instance.name }),
            instance: { id: instance.id, name: instance.name, status: instance.status, data: instance.data },
        };
    }

    /** The processes this user may start: each start event, with its form. */
    async startable(user: SecureUser) {
        const events = await this.api.model.findStartEvents({}, user);
        const forms = new Map();
        const starts = [];
        for (const event of events) {
            if (!forms.has(event.modelName))
                forms.set(event.modelName, await this.server.definitions.load(event.modelName).catch(() => null));
            const definition = forms.get(event.modelName);
            if (!definition) continue;
            starts.push({ processName: event.modelName, startNodeId: event.elementId, name: event.name || event.elementId, documentation: event.documentation, form: formOf(definition, event.elementId) });
        }
        return starts.sort((a, b) => a.processName.localeCompare(b.processName) || a.startNodeId.localeCompare(b.startNodeId));
    }

    /** Starts a process as this user, at a start event they may use: { instance, task } (task: their first, or null). */
    async start(user: SecureUser, name: string, { data = {}, startNodeId }: { data?: any, startNodeId?: string } = {}) {
        assertData(data);
        const starts = (await this.api.model.findStartEvents({}, user)).filter(event => event.modelName === name);
        const start = startNodeId ? starts.find(event => event.elementId === startNodeId) : starts[0];
        if (!start)
            throw new TaskError(404, `No process ${name} that this user may start${startNodeId ? ` at ${startNodeId}` : ''}`, 'NOT_STARTABLE');
        const { instance } = await this.api.engine.start(name, data, user, { startNodeId: start.elementId });
        const first = instance.items
            .filter(item => item.status === 'wait' && item.type === 'bpmn:UserTask' && hasPart(item, user))
            .map(item => asTask({ ...item, instanceId: instance.id, processName: instance.name }))[0];
        return {
            instance: { id: instance.id, name: instance.name, status: instance.status, data: instance.data },
            task: first ?? null,
        };
    }
}
