import { BPMNAPI, SecureUser, formFieldLookup, filterValue, columnRaw, columnValues, sortOrder, sortRecords, ListColumnError, isLabelPath } from '../../index.js';
import type { IListColumn, ILabelField } from '../../index.js';
import { CaseAccess } from '../caseAccess.js';

/*
 * The task operations, once (docs/design/api-v3.md): what an application does for one of its users. /api2/tasks (v2)
 * and /api/v3 map them, each with its own shapes. A user has a part in a task when they are its assignee, a candidate,
 * in a candidate group, or the task has no assignment; without one, or with no such task, the answer is the same 404,
 * so an id can not be probed. The engine holds the rule for who may see an item and the check that an item still
 * waits, under the instance's lock; the assignee's rule is here. See docs/design/application-integration-design.md, 5.1.
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

/**
 * Whether this user may act on the task: their part in it, or an administrator's, who acts on any (as BPMNAPI's rules
 * always let them: SecureUser.canInvoke). A security policy still decides, case by case.
 */
export const mayAct = (item, user: SecureUser): boolean => user.isAdmin() || hasPart(item, user);

/** What an application sees of a task: not the engine's own fields. */
export function asTask(item) {
    const { id, instanceId, processName, elementId, name, status, assignee, candidateUsers, candidateGroups, startedAt, endedAt, dueDate, followUpDate, priority, userName, assignment } = item;
    return { id, instanceId, processName, elementId, name, status, assignee, candidateUsers, candidateGroups, startedAt, endedAt, dueDate, followUpDate, priority, completedBy: endedAt ? userName : undefined,
        // what decided who works on it: { policy, rule }, or { userName } of who reassigned it
        assignedBy: assignment ?? undefined,
        // a test run's task (a scenario's, development and test only): an ordinary task, marked so
        ...(String(instanceId ?? '').startsWith('test-') ? { test: true } : {}) };
}

/** A form field as the model has it (camunda:formField), as plain JSON: its options and validation too. */
function asField(field) {
    const children = field.$children ?? [];
    const values = field.values ?? children.filter(c => c.$type === 'camunda:value');
    const validation = field.validation?.constraints ?? children.filter(c => c.$type === 'camunda:validation').flatMap(v => v.$children ?? []);
    const lookup = formFieldLookup(field);
    return {
        id: field.id, label: field.label ?? field.id, type: field.type, defaultValue: field.defaultValue,
        ...(values.length ? { values: values.map(v => ({ id: v.id, name: v.name ?? v.id })) } : {}),
        ...(validation.length ? { validation: validation.map(c => ({ name: c.name, config: c.config })) } : {}),
        // its choices come from a source (addons/forms/FormLookup.ts): list, a drop-down; lookup, a search. Its label is saved as <id>Display
        ...(lookup ? { [lookup.kind]: { source: lookup.sourceText, key: lookup.key, display: lookup.display, ...(lookup.filter ? { filter: lookup.filter } : {}) } } : {}),
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

/** The form's values a client sends: an object, else none. */
const asData = data => data && typeof data === 'object' && !Array.isArray(data) ? data : {};
/** Who asks, as a source is told. */
const userOf = (user: SecureUser) => ({ userName: user.userName, userGroups: user.userGroups ?? [] });

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
    readonly access: CaseAccess;
    constructor(readonly server) {
        this.api = new BPMNAPI(server);
        this.access = new CaseAccess(server);
    }

    /** What this user may do with a task, by its case's security policy (caseAccess.ts); all of it when they are off. */
    private async taskAccess(user: SecureUser, item, instance?) {
        if (!this.access.on) return null;
        instance ??= (await this.access.casesOf([item])).get(item.instanceId);
        return { access: await this.access.decide(user, instance, { elementId: item.elementId, itemId: item.id }), instance };
    }

    /** The task this user has a part in, or the same 404. */
    private async find(id: string, user: SecureUser) {
        const [item] = await this.api.data.findItems({ 'items.id': id }, user);
        // an administrator also forces any other waiting item (an event, a receive task), as the instance page offers
        if (!item || (item.type !== 'bpmn:UserTask' && !user.isAdmin()) || !mayAct(item, user))
            throw notFound();
        return item;
    }

    /** The waiting tasks this user has a part in, oldest first, a page at a time: { tasks, next } (next: the bookmark, or null). */
    /** `query`: more conditions on the items' instances (a label filter: routes/labelFilter.ts), in the store's query. */
    /** `all`: an administrator's every waiting task (the Workbench's), not only those they have a part in. */
    async list(user: SecureUser, { limit = DEFAULT_LIMIT, after, query = {}, all = false, columns = [], sort, order, fields = [] }: {
        limit?: number, after?: string, query?: object, all?: boolean,
        /** The person's columns (engine/ListColumns.ts): each task's values of them, from its case, as `columns`. */
        columns?: IListColumn[],
        /** What it is sorted by: started (the default, oldest first), due, model, name, priority, or a column's key; `order` asc or desc. */
        sort?: string, order?: string,
        /** The labels' fields: with security policies, a data column is sorted by only when a label reads it. */
        fields?: ILabelField[],
    } = {}) {
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT)
            throw new TaskError(400, `limit is from 1 to ${MAX_LIMIT}`, 'BAD_LIMIT');
        const sorting = this.sorting(sort, order, columns, fields);
        if (after !== undefined && !(sorting ? /^o:\d+$/ : /^\d+_./).test(String(after)))
            throw new TaskError(400, 'after is a list\'s next', 'BAD_AFTER');
        // lean: the instances' data is not read for a list (fable-review.md H5); the labels read it for the page's tasks
        let waiting = (await this.api.data.findItems({ 'items.status': 'wait', 'items.type': 'bpmn:UserTask', ...query }, user, { lean: true }))
            .filter(item => item.status === 'wait' && item.type === 'bpmn:UserTask' && (all && user.isAdmin() ? true : hasPart(item, user)) && (sorting || after === undefined || isAfter(item, String(after))))
            .sort((a, b) => new Date(a.startedAt ?? 0).getTime() - new Date(b.startedAt ?? 0).getTime() || (a.id < b.id ? -1 : 1));
        // sorted by something else: all of them, by its value (a column's from each task's case), a page at a time by position
        const cases: Map<string, any> = sorting?.column ? await this.access.casesOf(waiting) : new Map();
        if (sorting) {
            const valueOf = sorting.column
                ? (item) => columnRaw(sorting.column, item.processName, cases.get(item.instanceId)?.data)
                : (item) => item[sorting.field];
            waiting = sortRecords(waiting, valueOf, sorting.direction);
        }
        // sorted: the page's position among the tasks they may see
        const skip = sorting && after !== undefined ? Number(String(after).slice(2)) : 0;
        // a task the case's policy doesn't let this user complete is not theirs to see here (the requester's approval)
        if (this.access.on) {
            // only as many as the page needs (and one more: whether there is a next), several at once
            const shown = [];
            for (let i = 0; i < waiting.length && shown.length <= skip + limit; i += 64)
                shown.push(...await this.access.tasksAllowed(user, waiting.slice(i, i + 64)));
            waiting.splice(0, waiting.length, ...shown);
        }
        if (skip) waiting = waiting.slice(skip);
        const page = waiting.slice(0, limit);
        const next = waiting.length > limit ? (sorting ? `o:${skip + limit}` : position(page.at(-1))) : null;
        return { tasks: await this.withColumns(user, page, columns, cases), next };
    }

    /**
     * What `sort`/`order` sort by (undefined: the default, oldest first, paged by bookmark): a task's own field, or a
     * column, from each task's case. With security policies on, a data column only when a label reads its path: sorting
     * by a field the policy may hide would tell its values.
     */
    private sorting(sort: string | undefined, order: string | undefined, columns: IListColumn[], fields: ILabelField[]) {
        const key = sort || 'started';
        if (key === 'started' && (order === undefined || order === '' || order === 'asc')) return undefined;
        const direction = sortOrder(order, 1);
        const BUILT_IN: Record<string, string> = { started: 'startedAt', due: 'dueDate', model: 'processName', name: 'name', priority: 'priority' };
        if (BUILT_IN[key]) return { field: BUILT_IN[key], direction, column: undefined as IListColumn | undefined };
        const column = columns.find(c => c.key === key);
        if (!column) throw new ListColumnError(`sort is started, due, model, name, priority, or one of the columns, not ${key}`, 'BAD_SORT');
        if (this.access.on && !(column.paths ? [...column.paths.values()] : [column.path]).every(path => isLabelPath(fields, path)))
            throw new ListColumnError(`with security policies, a list is sorted by the values its labels name, not by ${key}`, 'SORT_REFUSED');
        return { field: undefined, direction, column };
    }

    /** The page's tasks as a list shows them; each with its values of the person's columns, from what they may read of its case. */
    private async withColumns(user: SecureUser, page: any[], columns: IListColumn[], cases: Map<string, any>) {
        if (!columns.length) return page.map(asTask);
        // the page's cases, when they were not read for the sort
        const missing = page.filter(item => !cases.has(item.instanceId));
        if (missing.length) for (const [id, instance] of await this.access.casesOf(missing)) cases.set(id, instance);
        const decided = this.access.on
            ? await this.access.decideAll(user, page.map(item => ({ instance: cases.get(item.instanceId), task: { elementId: item.elementId, itemId: item.id } })))
            : [];
        return page.map((item, i) => {
            const instance = cases.get(item.instanceId) ?? { data: {} };
            // with a policy, what it lets them read of the case for this task: its form's fields too
            const data = decided[i] ? this.access.data(instance, decided[i], item.elementId) : instance.data;
            return { ...asTask(item), columns: columnValues(columns, item.processName, data ?? {}) };
        });
    }

    /** The tasks this user completed, newest first: the latest `limit`. */
    async completed(user: SecureUser, { limit = 10, query = {} }: { limit?: number, query?: object } = {}) {
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT)
            throw new TaskError(400, `limit is from 1 to ${MAX_LIMIT}`, 'BAD_LIMIT');
        const ended = await this.api.data.findItems({ 'items.status': 'end', 'items.type': 'bpmn:UserTask', 'items.userName': user.userName, ...query }, user, { lean: true });
        return ended
            .filter(item => item.userName === user.userName && item.status === 'end' && item.type === 'bpmn:UserTask')
            .sort((a, b) => new Date(b.endedAt ?? 0).getTime() - new Date(a.endedAt ?? 0).getTime())
            .slice(0, limit)
            .map(asTask);
    }

    /** One task, with its instance's data and its form. */
    async get(user: SecureUser, id: string) {
        const item = await this.find(id, user);
        const decided = await this.taskAccess(user, item);
        // not theirs to complete: the same 404; their data, what the policy lets them read and the task's own fields
        if (decided?.access.complete === false) throw notFound();
        const data = decided ? this.access.data({ ...decided.instance, data: (item as any).instanceData }, decided.access, item.elementId) : (item as any).instanceData;
        const definition = await this.server.definitions.load(item.processName).catch(() => null);
        return { ...asTask(item), data, form: definition ? formOf(definition, item.elementId) : { fields: [] } };
    }

    /**
     * A field's choices on this task's form (docs/design/form-lookups.md): { items: [{ key, display }] }. `text`: what
     * the person typed (a lookup's); `data`: the form's values as they are, read with the case's data by the field's
     * filter. As the person who would complete the task: the same 404 for one that is not theirs. The source is the
     * model's, never the caller's.
     */
    async choices(user: SecureUser, id: string, fieldId: string, { text = '', data = {} }: { text?: string, data?: Record<string, any> } = {}) {
        const item = await this.find(id, user);
        const decided = await this.taskAccess(user, item);
        if (decided?.access.complete === false) throw notFound();
        const caseData = (item as any).instanceData ?? {};
        return this.choicesOf(await this.server.definitions.load(item.processName), item.elementId, fieldId, text, { ...caseData, ...asData(data) },
            { user: userOf(user), processName: item.processName, elementId: item.elementId, instanceId: item.instanceId, taskId: item.id });
    }

    /** A field's choices on a start form, for a process this user may start (at `startNodeId`, else its first start). */
    async startChoices(user: SecureUser, name: string, fieldId: string, { text = '', data = {}, startNodeId }: { text?: string, data?: Record<string, any>, startNodeId?: string } = {}) {
        const start = await this.startOf(user, name, startNodeId);
        return this.choicesOf(await this.server.definitions.load(name), start.elementId, fieldId, text, asData(data),
            { user: userOf(user), processName: name, elementId: start.elementId });
    }

    private async choicesOf(definition, elementId: string, fieldId: string, text: unknown, data: Record<string, any>, context: Record<string, any>) {
        const field = (definition.getNodeInfo(elementId).fields ?? []).find(f => f.id === fieldId);
        const lookup = field && formFieldLookup(field);
        if (!lookup)
            throw new TaskError(404, `The form has no field '${fieldId}' with a list or a lookup`, 'NO_CHOICES');
        if (text !== undefined && typeof text !== 'string')
            throw new TaskError(400, 'text is a string', 'BAD_TEXT');
        try {
            // the source is called by the engine, where the application's code and the connectors' keys are
            return { items: await this.server.engine.formChoices(context.processName, elementId, fieldId, { text: (text as string | undefined) ?? '', filter: filterValue(lookup, data) }, context) };
        }
        catch (exc) {
            throw new TaskError(502, `The ${lookup.kind} of '${fieldId}' (${lookup.sourceText}) failed: ${exc?.message ?? exc}`, 'CHOICES_FAILED');
        }
    }


    /** The task becomes this user's: { task }. Two claims at the same moment can not both win. */
    async claim(user: SecureUser, id: string) {
        const item = await this.find(id, user);
        assertWaiting(item);
        // the case's policy may refuse it: the API's pre-action, as it assigns
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
        // the case's policy may refuse it: the API's pre-action, as it completes
        if (item.assignee && item.assignee !== user.userName && !user.isAdmin())
            throw new TaskError(403, 'The task is assigned to someone else', 'TASK_ASSIGNED');
        const { instance } = await this.api.engine.invoke({ id: item.instanceId, 'items.id': id }, data, user);
        const done = instance.items.find(i => i.id === id);
        return {
            task: asTask({ ...done, instanceId: instance.id, processName: instance.name }),
            instance: { id: instance.id, name: instance.name, status: instance.status, data: instance.data },
        };
    }

/**
     * A task's page (the task form, the assign form): the task, its case as this user may read it (its data as the
     * policy lets them, the task's own fields always; its items), and its element and fields. Not theirs to complete
     * (`purpose` assign: the case not seen) under the case's policy: the same 404.
     */
    async page(user: SecureUser, id: string, { purpose = 'complete' }: { purpose?: 'complete' | 'assign' } = {}) {
        const item = await this.find(id, user);
        const decided = await this.taskAccess(user, item);
        // to complete it, the policy's complete; to give it to someone else, the case seen (assign decides who, on saving)
        if (purpose === 'complete' ? decided?.access.complete === false : decided?.access.see === 'none') throw notFound();
        const [instance] = await this.server.dataStore.findInstances({ id: item.instanceId }, 'full');
        if (!instance) throw notFound();
        const data = decided ? this.access.data(instance, decided.access, item.elementId) : instance.data;
        const definition = await this.server.definitions.loadFromInstance(instance);
        const { node, fields, formKey } = definition.getNodeInfo(item.elementId);
        return {
            task: item,
            instance: { id: instance.id, name: instance.name, status: instance.status, startedAt: instance.startedAt, endedAt: instance.endedAt, data: data ?? {}, items: instance.items ?? [] },
            node, fields: fields ?? [], formKey,
        };
    }

    /**
     * Gives the task to someone else (its assignee, candidates, due dates), with this data: the engine's execution.
     * The case's policy decides whether this user may, and whether it allows the new assignee (CaseAccess.requireAssignment).
     */
    async assign(user: SecureUser, id: string, assignment: Record<string, any>, data = {}) {
        assertData(data);
        const item = await this.find(id, user);
        assertWaiting(item);
        if (this.access.on) await this.access.requireAssignment(user, { 'items.id': id }, assignment);
        return this.api.engine.assign({ 'items.id': id }, data, assignment, user);
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

    /** A start event of this process this user may use: `startNodeId`, else its first; or a 404. */
    private async startOf(user: SecureUser, name: string, startNodeId?: string) {
        const starts = (await this.api.model.findStartEvents({}, user)).filter(event => event.modelName === name);
        const start = startNodeId ? starts.find(event => event.elementId === startNodeId) : starts[0];
        if (!start)
            throw new TaskError(404, `No process ${name} that this user may start${startNodeId ? ` at ${startNodeId}` : ''}`, 'NOT_STARTABLE');
        return start;
    }

    /** Starts a process as this user, at a start event they may use: { instance, task } (task: their first, or null). */
    async start(user: SecureUser, name: string, { data = {}, startNodeId }: { data?: any, startNodeId?: string } = {}) {
        assertData(data);
        const start = await this.startOf(user, name, startNodeId);
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
