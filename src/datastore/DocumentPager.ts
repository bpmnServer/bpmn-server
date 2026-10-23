import type { FindParams, FindResult } from '../interfaces/datastore.js';
import type { IDocumentStore } from '../interfaces/storage.js';
import { DocumentQuery } from './DocumentQuery.js';

/**
 * The data store's paged search (`DataStore.find`) on any storage adapter: what the MongoDB
 * aggregation (Aggregate.ts) answers, computed from the documents the adapter finds.
 *
 * - `filter`: on the instance (`name`, `data.x`) and on its items (`items.x`); with an item filter,
 *   the answer has one entry per matching item, `items` being that item (MongoDB's `$unwind`).
 * - `lastItem` / `latestItem`: instead, one entry per instance, with its last item (by `seq`) or its
 *   latest ended item (by `endedAt`) matching the condition, under `lastItem` / `latestItem`.
 * - `sort` (one field, `1` or `-1`; default `_id` descending), `limit` (10), `projection`.
 * - `after`: the `nextCursor` of the page before: `<sort value>|<_id>` (`d:<ms>` for a date), or the `_id`.
 * - `getTotalCount`: how many instances match the filter.
 */
export class DocumentPager {

    static async find(store: IDocumentStore, database: string, collection: string,
        { filter = {}, after, limit = 10, sort = { _id: -1 }, projection, lastItem = {}, latestItem = {}, getTotalCount = false }: FindParams): Promise<FindResult> {
        try {
            const sortField = Object.keys(sort)[0] || '_id';
            const direction = sort[sortField] ?? -1;
            const instanceFilter: Record<string, any> = {}, itemFilter: Record<string, any> = {};
            for (const [key, value] of Object.entries(filter)) {
                if (key.startsWith('items.')) itemFilter[key.substring(6)] = value;
                else instanceFilter[key] = value;
            }
            const instances = await store.find(database, collection, instanceFilter, null);
            const project = (doc) => projection ? DocumentQuery.project(doc, projection) : doc;

            let rows: any[];
            const pick = Object.keys(lastItem).length > 0 ? { key: 'lastItem', match: lastItem, by: 'seq' }
                : Object.keys(latestItem).length > 0 ? { key: 'latestItem', match: latestItem, by: 'endedAt' } : null;
            if (pick) {
                rows = [];
                for (const instance of instances) {
                    if (Object.keys(itemFilter).length && !(instance.items ?? []).some(i => DocumentQuery.matches(i, itemFilter))) continue;
                    const chosen = DocumentQuery.sort((instance.items ?? []).filter(i => DocumentQuery.matches(i, pick.match)), { [pick.by]: -1 })[0];
                    if (chosen) rows.push({ ...project(instance), [pick.key]: chosen });
                }
            }
            else if (Object.keys(itemFilter).length) {
                rows = [];
                for (const instance of instances) {
                    const projected = project(instance);
                    for (const item of instance.items ?? []) if (DocumentQuery.matches(item, itemFilter)) rows.push({ ...projected, items: item });
                }
            }
            else rows = instances.map(project);

            const value = (row) => DocumentQuery.values(row, sortField)[0];
            const compare = (a, b) => (DocumentQuery.compare(value(a), value(b)) || DocumentQuery.compare(String(a._id), String(b._id))) * direction;
            rows.sort(compare);
            if (after) {
                const cursor = DocumentPager.cursorRow(after, sortField);
                rows = rows.filter(row => compare(row, cursor) > 0);
            }
            const data = rows.slice(0, limit);
            const last = data[data.length - 1];
            const result: FindResult = { data, nextCursor: last ? DocumentPager.cursorOf(last, sortField, value(last)) : null };
            if (data.length === 0) result.totalCount = 0;
            if (getTotalCount === true) result.totalCount = (await store.find(database, collection, filter, { _id: 1 })).length;
            return result;
        }
        catch (error) {
            return { error: (error as Error).message };
        }
    }

    /** The cursor of a row: its sort value (a date as `d:<ms>`) and its `_id`. */
    static cursorOf(row, sortField: string, value): string {
        if (sortField === '_id') return String(row._id);
        const date = value instanceof Date || (typeof value === 'string' && isNaN(Number(value)) && !isNaN(Date.parse(value)));
        return `${date ? 'd:' + new Date(value).getTime() : value}|${row._id}`;
    }

    /** A row standing for a cursor, to compare the rows against. */
    static cursorRow(after: string, sortField: string) {
        if (sortField === '_id') return { _id: after };
        const at = after.lastIndexOf('|');
        const raw = after.substring(0, at), id = after.substring(at + 1);
        const v = raw.startsWith('d:') ? new Date(Number(raw.substring(2))) : (isNaN(Number(raw)) ? raw : Number(raw));
        const row: any = { _id: id };
        const parts = sortField.split('.');
        let target = row;
        for (const p of parts.slice(0, -1)) target = (target[p] = {});
        target[parts[parts.length - 1]] = v;
        return row;
    }
}
