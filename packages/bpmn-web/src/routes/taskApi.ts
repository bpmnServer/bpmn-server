import express from 'express';
import { BPMNAPI, SecureUser } from '../index.js';
import { timingSafeEqualStr } from './middleware/apiKeyAuth.js';
import { notATest } from '../testing/scenarios.js';

/*
 * The task API (/api2/tasks): an application lists, claims and completes tasks for its users, whom it has authenticated itself.
 * Off unless API_ACTING_USER_KEY is set; that key opens these routes and no other, and API_KEY does not open these.
 * A user has a part in a task when they are its assignee, a candidate, in a candidate group, or the task has no assignment.
 * Without one, or with no such task, the answer is the same 404, so an id can not be probed.
 * See docs/docs/application-integration-design.md, section 5.1. The engine is not changed: it holds the rule for who may
 * see an item and the check that an item still waits, under the instance's lock; the assignee's rule is here.
 */

/** The groups an application can not give its users: this key can not make an administrator. */
const REFUSED_GROUPS = ['SYSTEM', 'ADMIN', 'DESIGNER'];
const DEFAULT_LIMIT = 50, MAX_LIMIT = 200;

/** An answer with a real status. */
class TaskError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) {
        super(message);
    }
}
const notFound = () => new TaskError(404, 'No such task', 'TASK_NOT_FOUND');

const toList = (value): string[] => Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? value.split(',').map(v => v.trim()) : [];

function hasPart(item, user: SecureUser): boolean {
    const users = toList(item.candidateUsers), groups = toList(item.candidateGroups);
    if (!item.assignee && !users.length && !groups.length) return true;
    return item.assignee === user.userName || users.includes(user.userName) || groups.some(group => user.userGroups.includes(group));
}

/** What an application sees of a task: not the engine's own fields. */
function asTask(item) {
    const { id, instanceId, processName, elementId, name, status, assignee, candidateUsers, candidateGroups, startedAt, endedAt, dueDate, followUpDate, priority, userName } = item;
    return { id, instanceId, processName, elementId, name, status, assignee, candidateUsers, candidateGroups, startedAt, endedAt, dueDate, followUpDate, priority, completedBy: endedAt ? userName : undefined };
}

/** Where a task is in the list, by when it started: the list's `next`, and a call's `after`. */
const position = item => `${new Date(item.startedAt ?? 0).getTime()}_${item.id}`;
function isAfter(item, after: string) {
    const [time, id] = [Number(after.slice(0, after.indexOf('_'))), after.slice(after.indexOf('_') + 1)];
    const itemTime = new Date(item.startedAt ?? 0).getTime();
    return itemTime > time || (itemTime === time && item.id > id);
}

export function taskApi(server) {
    const router = express.Router();
    const api = new BPMNAPI(server);

    // who calls: the key, then the user it speaks for
    router.use((req: any, res, next) => {
        const key = process.env.API_ACTING_USER_KEY;
        if (!key)
            return res.status(404).json({ errors: 'The task API is not turned on: API_ACTING_USER_KEY', code: 'TASK_API_OFF' });
        const presented = req.header('x-api-key');
        if (typeof presented !== 'string' || !timingSafeEqualStr(presented, key))
            return res.status(401).json({ errors: 'missing or invalid "x-api-key"', code: 'UNAUTHORIZED' });
        const userName = req.header('x-acting-user')?.trim();
        if (!userName)
            return res.status(400).json({ errors: 'missing "x-acting-user"', code: 'ACTING_USER_MISSING' });
        const userGroups = toList(req.header('x-acting-groups'));
        if (userGroups.some(group => REFUSED_GROUPS.includes(group.toUpperCase())))
            return res.status(403).json({ errors: `"x-acting-groups" can not have ${REFUSED_GROUPS.join(', ')}`, code: 'ACTING_GROUP_REFUSED' });
        // the tenant is the service account's, never the caller's; the security rules hold whatever the environment says
        req.actingUser = new SecureUser({ userName, userGroups, tenantId: process.env.API_SERVICE_TENANT_ID, modelsOwner: process.env.API_SERVICE_MODELS_OWNER }, { enforceSecurity: true });
        next();
    });

    /** The task this user has a part in, or the same 404. */
    async function findTask(id: string, user: SecureUser) {
        const [item] = await api.data.findItems({ 'items.id': id, ...notATest }, user);
        if (!item || item.type !== 'bpmn:UserTask' || !hasPart(item, user))
            throw notFound();
        return item;
    }
    const assertWaiting = item => {
        if (item.status !== 'wait')
            throw new TaskError(409, `Task ${item.id} is not waiting (it is ${item.status})`, 'ITEM_NOT_WAITING');
    };
    const handler = fn => async (req, res) => {
        try {
            res.json(await fn(req, req.actingUser));
        }
        catch (error) {
            if (error instanceof TaskError)
                return res.status(error.status).json({ errors: error.message, code: error.code });
            // the engine's own check, under the instance's lock: another call got there first
            if (error?.code === 'ITEM_NOT_WAITING')
                return res.status(409).json({ errors: error.message, code: error.code });
            if (/^failed to lock instance/.test(error?.message ?? ''))
                return res.status(503).json({ errors: 'The instance is busy: try again', code: 'INSTANCE_BUSY' });
            console.error('task API:', error);
            res.status(500).json({ errors: String(error?.message ?? error), code: 'TASK_FAILED' });
        }
    };

    router.get('/', handler(async (req, user) => {
        const limit = req.query.limit === undefined ? DEFAULT_LIMIT : Number(req.query.limit);
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT)
            throw new TaskError(400, `limit is from 1 to ${MAX_LIMIT}`, 'BAD_LIMIT');
        const after = req.query.after;
        if (after !== undefined && !/^\d+_./.test(String(after)))
            throw new TaskError(400, 'after is a list\'s next', 'BAD_AFTER');
        const waiting = (await api.data.findItems({ 'items.status': 'wait', 'items.type': 'bpmn:UserTask', ...notATest }, user))
            .filter(item => item.status === 'wait' && item.type === 'bpmn:UserTask' && hasPart(item, user) && (after === undefined || isAfter(item, String(after))))
            .sort((a, b) => new Date(a.startedAt ?? 0).getTime() - new Date(b.startedAt ?? 0).getTime() || (a.id < b.id ? -1 : 1));
        const page = waiting.slice(0, limit);
        return { tasks: page.map(asTask), next: waiting.length > limit ? position(page.at(-1)) : null };
    }));

    router.get('/:id', handler(async (req, user) => {
        const item = await findTask(req.params.id, user);
        return { ...asTask(item), data: (item as any).instanceData };
    }));

    router.post('/:id/claim', handler(async (req, user) => {
        const { id } = req.params;
        const item = await findTask(id, user);
        assertWaiting(item);
        if (item.assignee === user.userName)
            return { task: asTask(item) };
        if (item.assignee)
            throw new TaskError(409, 'The task is assigned to someone else', 'TASK_ASSIGNED');
        // the check and the assignment are one step: two claims at the same moment can not both win
        const key = `task:${id}`;
        if (!await server.dataStore.locker.claim(key))
            throw new TaskError(409, 'The task is being claimed', 'TASK_ASSIGNED');
        try {
            const current = await findTask(id, user);
            assertWaiting(current);
            if (current.assignee && current.assignee !== user.userName)
                throw new TaskError(409, 'The task is assigned to someone else', 'TASK_ASSIGNED');
            await api.engine.assign({ id: item.instanceId, 'items.id': id }, {}, { assignee: user.userName }, user);
            return { task: asTask(await findTask(id, user)) };
        }
        finally {
            await server.dataStore.locker.release(`claim:${key}`);
        }
    }));

    router.post('/:id/complete', handler(async (req, user) => {
        const { id } = req.params;
        const data = req.body?.data ?? {};
        if (typeof data !== 'object' || Array.isArray(data))
            throw new TaskError(400, 'data is an object', 'BAD_DATA');
        const item = await findTask(id, user);
        assertWaiting(item);
        if (item.assignee && item.assignee !== user.userName)
            throw new TaskError(403, 'The task is assigned to someone else', 'TASK_ASSIGNED');
        const { instance } = await api.engine.invoke({ id: item.instanceId, 'items.id': id }, data, user);
        const done = instance.items.find(i => i.id === id);
        return {
            task: asTask({ ...done, instanceId: instance.id, processName: instance.name }),
            instance: { id: instance.id, name: instance.name, status: instance.status, data: instance.data },
        };
    }));

    router.use((req, res) => { res.status(404).json({ errors: `No task API route ${req.method} ${req.originalUrl}`, code: 'NO_ROUTE' }); });
    return router;
}
