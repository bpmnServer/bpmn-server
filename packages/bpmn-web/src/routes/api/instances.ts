import { BPMNAPI, SecureUser } from '../../index.js';
import { rationaleSteps } from '../../testing/rationale.js';
import { notATest } from '../../testing/scenarios.js';

/*
 * The instance operations, once (docs/design/api-v3.md): the instances a user may see, one with its items, why it went
 * the way it did (the Rationale by step), and what moves it on: a start event, a restart, messages and signals. Every
 * query goes through the user's security rules (BPMNAPI, qualifyInstances); an instance they may not see is the same
 * 404 as one that does not exist.
 */

export const DEFAULT_LIMIT = 50, MAX_LIMIT = 200;

export class InstanceError extends Error {
    constructor(readonly status: number, message: string, readonly code: string) { super(message); }
}
const notFound = () => new InstanceError(404, 'No such instance', 'INSTANCE_NOT_FOUND');

/** Newest first: a page's bookmark is where its last instance is, by when it started. */
const time = i => new Date(i.startedAt ?? 0).getTime();
const position = i => `${time(i)}_${i.id}`;
/** The instances after a bookmark, as a condition of the store's query: older, or as old with a smaller id. */
function afterCondition(after: string) {
    const at = after.indexOf('_'), startedAt = new Date(Number(after.slice(0, at))), id = after.slice(at + 1);
    return { $or: [{ startedAt: { $lt: startedAt } }, { startedAt, id: { $lt: id } }] };
}
/** What a list shows of an instance: read alone, not its data, items or logs. */
const SUMMARY = { id: 1, name: 1, status: 1, startedAt: 1, endedAt: 1 };

const summary = i => ({ id: i.id, name: i.name, status: i.status, startedAt: i.startedAt, endedAt: i.endedAt ?? null });
const asItem = i => ({
    id: i.id, elementId: i.elementId, name: i.name, type: i.type, status: i.status, startedAt: i.startedAt, endedAt: i.endedAt ?? null,
    userName: i.userName, assignee: i.assignee, candidateUsers: i.candidateUsers, candidateGroups: i.candidateGroups,
});

/** What an engine call answers: its instance, or the engine's errors as a 422. */
function executed(context) {
    if (context?.errors)
        throw new InstanceError(422, String(context.errors), 'ENGINE_ERROR');
    return context?.instance ? summary(context.instance) : null;
}

export class InstanceOperations {
    readonly api: BPMNAPI;
    constructor(readonly server) {
        this.api = new BPMNAPI(server);
    }

    /**
     * The instances this user may see, newest first, a page at a time: { instances, next } (next: the bookmark, or
     * undefined on the last page). `status` and `name` narrow it. Through BPMNAPI, so the user's rules apply to the items.
     * The store filters, sorts and cuts the page (fable-review.md H5), reading only what the list shows.
     */
    async list(user: SecureUser, { status, name, limit = DEFAULT_LIMIT, after }: { status?: string, name?: string, limit?: number, after?: string } = {}) {
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT)
            throw new InstanceError(400, `limit is from 1 to ${MAX_LIMIT}`, 'BAD_LIMIT');
        if (after !== undefined && !/^\d+_./.test(String(after)))
            throw new InstanceError(400, 'cursor is a page\'s next', 'BAD_CURSOR');
        const query: any = { ...notATest, ...(status ? { status } : {}), ...(name ? { name } : {}) };
        // $and: the user's rules put their own $or on the query
        if (after !== undefined) query.$and = [afterCondition(String(after))];
        // one more than the page: whether there is a next
        const found = await this.api.data.findInstances(query, user, { projection: SUMMARY, sort: { startedAt: -1, id: -1 }, limit: limit + 1 });
        const page = found.slice(0, limit);
        return { instances: page.map(summary), next: found.length > limit ? position(page.at(-1)) : undefined };
    }

    /** The instance, if this user may see it; never a test run's (notATest is a condition on the id). */
    private async find(user: SecureUser, id: string) {
        if (typeof id !== 'string' || id.startsWith('test-')) throw notFound();
        const [instance] = await this.api.data.findInstances({ id }, user, 'full');
        if (!instance) throw notFound();
        return instance;
    }

    /** One instance: its data and its items. */
    async get(user: SecureUser, id: string) {
        const instance = await this.find(user, id);
        return { ...summary(instance), data: instance.data, items: (instance.items ?? []).map(asItem) };
    }

    /** Why it went the way it did: the Rationale, step by step (each operation, its outcome, each decision). */
    async rationale(user: SecureUser, id: string) {
        const instance = await this.find(user, id);
        return { ...summary(instance), data: instance.data, steps: rationaleSteps(instance.logs ?? [], instance.items ?? [], instance.startedAt) };
    }

    /** A start event of a running instance (an event sub-process, a second start), with this data. */
    async startEvent(user: SecureUser, id: string, elementId: string, data = {}) {
        await this.find(user, id);
        return executed(await this.api.engine.startEvent(id, elementId, data, user));
    }

    /** Runs an item of the instance again, from it on, with this data. */
    async restart(user: SecureUser, id: string, itemId: string, data = {}) {
        await this.find(user, id);
        if (typeof itemId !== 'string' || !itemId)
            throw new InstanceError(400, 'itemId is required', 'BAD_ITEM');
        return executed(await this.api.engine.restart({ id, 'items.id': itemId }, data, user));
    }

    /** Deletes the instance: administrators only (qualifyDeleteInstances). */
    async remove(user: SecureUser, id: string) {
        await this.find(user, id);
        if (!user.isAdmin())
            throw new InstanceError(403, 'Only an administrator deletes instances', 'ADMIN_REQUIRED');
        await this.api.data.deleteInstances({ id }, user);
        return { deleted: id };
    }

    /** A message, to what waits for it or starts on it: system only. */
    async message(user: SecureUser, messageId: string, data = {}, matchingKey = {}) {
        if (!user.isSystem())
            throw new InstanceError(403, 'Only the system throws messages', 'SYSTEM_REQUIRED');
        return { instance: executed(await this.api.engine.throwMessage(messageId, data, matchingKey, user)) };
    }

    /** A signal, to everything that waits for it: system only. */
    async signal(user: SecureUser, signalId: string, data = {}, matchingKey = {}) {
        if (!user.isSystem())
            throw new InstanceError(403, 'Only the system throws signals', 'SYSTEM_REQUIRED');
        await this.api.engine.throwSignal(signalId, data, matchingKey, user);
        return { signalled: signalId };
    }
}
