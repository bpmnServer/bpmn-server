import { BPMNAPI, SecureUser, notificationsOf, columnValues, columnSortPath, sortOrder, ListColumnError, isLabelPath } from '../../index.js';
import type { IListColumn, ILabelField } from '../../index.js';
import { rationaleSteps } from '../../testing/rationale.js';
import { labeledInstances } from './labels.js';
import { CaseAccess } from '../caseAccess.js';

/*
 * The instance operations, once (docs/design/api-v3.md): the instances a user may see, one with its items, why it went
 * the way it did (the Rationale by step), and what moves it on: a start event, a restart, messages and signals. Every
 * query goes through the user's security rules (BPMNAPI, qualifyInstances), or, with security policies on, the case's
 * policy (caseAccess.ts: what they see of it, which of its data, restart and start events); an instance they may not
 * see is the same 404 as one that does not exist.
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
/** What a list shows of an instance, and its data for its label (addons/labels/Labels.ts): not its items, logs or source. */
const SUMMARY = { id: 1, name: 1, status: 1, startedAt: 1, endedAt: 1, data: 1 };
/** With security policies, its items and tokens too: the instance's actors are in them, in their branches. */
const SUMMARY_AND_ITEMS = { ...SUMMARY, items: 1, tokens: 1, userName: 1 };

/** Its label, once labeled (labels.ts): nothing when it was not. */
const labelOf = i => i.label === undefined ? {} : { label: i.label, labelValues: i.labelValues };
/** A test run's case (a scenario's, development and test only): an ordinary case, marked so. */
export const isTestCase = (id: unknown) => String(id ?? '').startsWith('test-');
const summary = i => ({ id: i.id, name: i.name, status: i.status, startedAt: i.startedAt, endedAt: i.endedAt ?? null, ...labelOf(i), ...(isTestCase(i.id) ? { test: true } : {}) });
const asItem = i => ({
    id: i.id, elementId: i.elementId, name: i.name, type: i.type, status: i.status, startedAt: i.startedAt, endedAt: i.endedAt ?? null,
    userName: i.userName, assignee: i.assignee, candidateUsers: i.candidateUsers, candidateGroups: i.candidateGroups, ...labelOf(i),
});

/** What an engine call answers: its instance, or the engine's errors as a 422. */
function executed(context) {
    if (context?.errors)
        throw new InstanceError(422, String(context.errors), 'ENGINE_ERROR');
    return context?.instance ? summary(context.instance) : null;
}

export class InstanceOperations {
    readonly api: BPMNAPI;
    readonly access: CaseAccess;
    constructor(readonly server) {
        this.api = new BPMNAPI(server);
        this.access = new CaseAccess(server);
    }

    /** The store's instances: through the user's rules, or, with security policies, as they are (the policy decides). */
    private findInstances(query, user: SecureUser, options) {
        if (!this.access.on) return this.api.data.findInstances(query, user, options);
        return this.server.dataStore.findInstances({ ...query, ...(user?.tenantId ? { tenantId: user.tenantId } : {}) }, options);
    }

    /**
     * The instances this user may see, newest first, a page at a time: { instances, next } (next: the bookmark, or
     * undefined on the last page). `status` and `name` narrow it, and `query`: more conditions (a filter by label,
     * labels.ts). Through BPMNAPI, so the user's rules apply to the items. Each is labeled. The store filters, sorts
     * and cuts the page (fable-review.md H5), reading only what the list and the labels need.
     */
    async list(user: SecureUser, { status, name, limit = DEFAULT_LIMIT, after, query: more = {}, columns = [], sort, order, fields = [] }: {
        status?: string, name?: string, limit?: number, after?: string, query?: object,
        /** The person's columns (engine/ListColumns.ts): each instance's values of them, as `columns`. */
        columns?: IListColumn[],
        /** What it is sorted by: started (the default, newest first), ended, model, status, or a column's key; `order` asc or desc. */
        sort?: string, order?: string,
        /** The labels' fields (labelFields): with security policies, a data column is sorted by only when a label reads it. */
        fields?: ILabelField[],
    } = {}) {
        if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT)
            throw new InstanceError(400, `limit is from 1 to ${MAX_LIMIT}`, 'BAD_LIMIT');
        const sorting = this.sorting(sort, order, columns, fields);
        if (sorting) return this.listSorted(user, { status, name, limit, after, more, columns, sorting });
        if (after !== undefined && !/^\d+_./.test(String(after)))
            throw new InstanceError(400, 'cursor is a page\'s next', 'BAD_CURSOR');
        /** The query from a bookmark on. $and: the user's rules put their own $or on it, and a filter by label may have its own. */
        // with security policies, narrowed in the store to the cases they may see (a superset: the policy decides each)
        const narrowed = this.access.on ? await this.access.seeQuery(user) : null;
        const from = (bookmark?: string) => {
            const query: any = { ...(status ? { status } : {}), ...(name ? { name } : {}), ...(narrowed ?? {}) };
            const conditions = [...(Object.keys(more).length ? [more] : []), ...(bookmark !== undefined ? [afterCondition(String(bookmark))] : [])];
            if (conditions.length) query.$and = conditions;
            return query;
        };
        const read = (bookmark: string | undefined, count: number) => this.findInstances(from(bookmark), user,
            { projection: this.access.on ? SUMMARY_AND_ITEMS : SUMMARY, sort: { startedAt: -1, id: -1 }, limit: count });
        // one more than the page: whether there is a next
        let found = await read(after, limit + 1);
        if (this.access.on) {
            // the policy hides some: read on past them, a few times at most, until the page is full or there are no more
            const seen = await this.access.seen(user, found);
            let batch = found, size = limit + 1;
            for (let reads = 1; seen.length <= limit && batch.length === size && reads < 5; reads++) {
                size = 2 * (limit + 1);
                batch = await read(position(batch.at(-1)), size);
                seen.push(...await this.access.seen(user, batch));
            }
            found = seen;
        }
        const page = await labeledInstances(this.server, found.slice(0, limit));
        return { instances: await this.withColumns(user, page, columns), next: found.length > limit ? position(page.at(-1)) : undefined };
    }

    /**
     * The store's sort for `sort`/`order` (undefined: the default, newest first, paged by bookmark): a built-in field,
     * or a column that reads one path in every case. With security policies on, a data column only when a label reads
     * its path: sorting by a field the policy may hide would tell its values.
     */
    private sorting(sort: string | undefined, order: string | undefined, columns: IListColumn[], fields: ILabelField[]): Record<string, 1 | -1> | undefined {
        const key = sort || 'started';
        if (key === 'started' && (order === undefined || order === '' || order === 'desc')) return undefined;
        const direction = sortOrder(order, key === 'started' || key === 'ended' ? -1 : 1);
        const BUILT_IN: Record<string, string> = { started: 'startedAt', ended: 'endedAt', model: 'name', status: 'status' };
        let path = BUILT_IN[key];
        if (!path) {
            const column = columns.find(c => c.key === key);
            if (!column) throw new ListColumnError(`sort is started, ended, model, status, or one of the columns, not ${key}`, 'BAD_SORT');
            path = columnSortPath(column);
            if (!path) throw new ListColumnError(`${key} is read from different fields in different models: choose a model to sort by it`, 'BAD_SORT');
            if (this.access.on && !isLabelPath(fields, path))
                throw new ListColumnError(`with security policies, a list is sorted by the values its labels name, not by ${key}`, 'SORT_REFUSED');
        }
        return { [path]: direction, id: direction };
    }

    /** A sorted list, a page at a time by its position: `after` is `o:<how many come before it>`. */
    private async listSorted(user: SecureUser, { status, name, limit, after, more, columns, sorting }) {
        if (after !== undefined && !/^o:\d+$/.test(String(after)))
            throw new InstanceError(400, 'cursor is a page\'s next', 'BAD_CURSOR');
        const skip = after === undefined ? 0 : Number(String(after).slice(2));
        const narrowed = this.access.on ? await this.access.seeQuery(user) : null;
        const query: any = { ...(status ? { status } : {}), ...(name ? { name } : {}), ...(narrowed ?? {}) };
        if (Object.keys(more).length) query.$and = [more];
        // the ones before the page, the page and one more (whether there is a next); with a policy, those it lets them see
        let want = skip + limit + 1, found: any[] = [];
        for (let reads = 0; reads < 5; reads++) {
            const batch = await this.findInstances(query, user, { projection: this.access.on ? SUMMARY_AND_ITEMS : SUMMARY, sort: sorting, limit: want });
            found = await this.access.seen(user, batch);
            if (found.length >= skip + limit + 1 || batch.length < want) break;
            want *= 2;
        }
        const page = await labeledInstances(this.server, found.slice(skip, skip + limit));
        return { instances: await this.withColumns(user, page, columns), next: found.length > skip + limit ? `o:${skip + limit}` : undefined };
    }

    /** The page's instances as a list shows them; each with its values of the person's columns, from what they may read of its data. */
    private async withColumns(user: SecureUser, page: any[], columns: IListColumn[]) {
        if (!columns.length) return page.map(summary);
        const decided = this.access.on ? await this.access.decideAll(user, page.map(instance => ({ instance }))) : [];
        return page.map((instance, i) => {
            const access = decided[i];
            // a case they see as a line only: its label, none of its data
            const data = !access ? instance.data : access.see === 'full' ? this.access.data(instance, access) : {};
            return { ...summary(instance), columns: columnValues(columns, instance.name, data ?? {}) };
        });
    }

    /** The instance, if this user may see it; a test run's too (an ordinary case, marked `test`). */
    private async find(user: SecureUser, id: string) {
        if (typeof id !== 'string') throw notFound();
        const [instance] = await this.findInstances({ id }, user, 'full');
        if (!instance) throw notFound();
        return instance;
    }

    /** The instance and what this user may do with it; not seen at all is the same 404 as no such instance. */
    private async findWithAccess(user: SecureUser, id: string) {
        const instance = await this.find(user, id);
        const access = await this.access.decide(user, instance);
        if (access.see === 'none') throw notFound();
        return { instance, access };
    }

    /** One instance: its data and its items, labeled; as a line only when the policy shows it so (`summary`). */
    async get(user: SecureUser, id: string) {
        const { instance: found, access } = await this.findWithAccess(user, id);
        const [instance] = await labeledInstances(this.server, [found]);
        if (access.see === 'summary') return summary(instance);
        return { ...summary(instance), data: this.access.data(instance, access), items: (instance.items ?? []).map(asItem) };
    }

/**
     * An instance's page (the instance page): the whole instance, its items, logs and model, for whoever sees it fully;
     * its data as the policy lets them read it. A test run's too (the Test tab examines them). Not seen in full: the
     * same 404 as no such instance.
     */
    async page(user: SecureUser, id: string) {
        if (typeof id !== 'string') throw notFound();
        const [instance] = await this.findInstances({ id }, user, 'full');
        if (!instance) throw notFound();
        if (!this.access.on) return { instance, access: null };
        const access = await this.access.decide(user, instance);
        if (access.see !== 'full') throw notFound();
        if (!access.data.all) instance.data = this.access.data(instance, access);
        return { instance, access };
    }

    /** Who was given its user tasks, and who may do what with it (CaseAccess.instanceAccess), for the instance page. */
    async assignmentAndAccess(instance, directory) {
        return this.access.instanceAccess(instance, directory);
    }

    /** Why it went the way it did: the Rationale, step by step (each operation, its outcome, each decision). */
    /**
     * What its notification policies notified (docs/design/notification-policies.md): every notification kept,
     * delivered or not, oldest first; for whoever sees it fully.
     */
    async notifications(user: SecureUser, id: string) {
        const { instance, access } = await this.findWithAccess(user, id);
        if (access.see !== 'full') throw notFound();
        return { ...summary(instance), items: await notificationsOf(this.server, instance.id) };
    }

    async rationale(user: SecureUser, id: string) {
        const { instance, access } = await this.findWithAccess(user, id);
        if (access.see !== 'full') throw notFound();
        return { ...summary(instance), data: this.access.data(instance, access), steps: rationaleSteps(instance.logs ?? [], instance.items ?? [], instance.startedAt) };
    }

    /**
     * Who was given its tasks and who may do what with it (CaseAccess.instanceAccess): each user task's assignment,
     * after the fact; while security policies are on, its policy asked for each person and role (`directory`).
     * For administrators and the service key only (v3.ts checks): it names people and what they may do.
     */
    async whoMay(user: SecureUser, id: string, directory) {
        const { instance } = await this.findWithAccess(user, id);
        const [full] = await this.server.dataStore.findInstances({ id: instance.id }, 'full');
        return { id: instance.id, name: instance.name, ...(await this.access.instanceAccess(full ?? instance, directory)) };
    }

    /** A start event of a running instance (an event sub-process, a second start), with this data. */
    async startEvent(user: SecureUser, id: string, elementId: string, data = {}) {
        // seen by them (findWithAccess); the case's policy may refuse it: the API's pre-action
        await this.findWithAccess(user, id);
        return executed(await this.api.engine.startEvent(id, elementId, data, user));
    }

    /** Runs an item of the instance again, from it on, with this data. */
    async restart(user: SecureUser, id: string, itemId: string, data = {}) {
        // seen by them (findWithAccess); the case's policy may refuse it: the API's pre-action
        await this.findWithAccess(user, id);
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
