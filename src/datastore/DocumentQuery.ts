import type { StorageQuery, StorageProjection, StorageSort } from '../interfaces/storage.js';

/**
 * Evaluates the engine's MongoDB-style queries, projections, sorts and updates over plain JSON
 * documents: the shared semantics of every non-MongoDB {@link IDocumentStore} (the in-memory store;
 * adapters that keep documents as JSON in another database). An operator it does not know is
 * refused, never ignored.
 */
export class DocumentQuery {

    static matches(doc: any, query: StorageQuery): boolean {
        if (!query) return true;
        return Object.entries(query).every(([key, condition]) => {
            switch (key) {
                case '$or': return DocumentQuery.list(condition, key).some(q => DocumentQuery.matches(doc, q));
                case '$and': return DocumentQuery.list(condition, key).every(q => DocumentQuery.matches(doc, q));
                case '$nor': return !DocumentQuery.list(condition, key).some(q => DocumentQuery.matches(doc, q));
                default:
                    if (key.startsWith('$')) throw new Error(`Unsupported query operator ${key}`);
                    return DocumentQuery.matchCondition(DocumentQuery.values(doc, key), condition);
            }
        });
    }

    /** The values at a dotted path, descending into arrays (as MongoDB does): every value reached, arrays included as themselves. */
    static values(doc: any, path: string): any[] {
        let current = [doc];
        for (const part of path.split('.')) {
            const next = [];
            for (const value of current) {
                if (value == null) continue;
                if (Array.isArray(value)) {
                    if (/^\d+$/.test(part) && value[Number(part)] !== undefined) next.push(value[Number(part)]);
                    for (const element of value) if (element != null && typeof element === 'object' && !Array.isArray(element) && part in element) next.push(element[part]);
                }
                else if (typeof value === 'object' && part in value) next.push(value[part]);
            }
            current = next;
        }
        return current;
    }

    private static list(condition: any, operator: string): StorageQuery[] {
        if (!Array.isArray(condition)) throw new Error(`${operator} takes an array of queries`);
        return condition;
    }

    private static isOperatorObject(condition: any): boolean {
        return condition !== null && typeof condition === 'object' && !Array.isArray(condition) && !(condition instanceof Date)
            && Object.keys(condition).length > 0 && Object.keys(condition).every(k => k.startsWith('$'));
    }

    /** Each value, and each element of an array value: what an equality or comparison is tried against. */
    private static candidates(values: any[]): any[] {
        const out = [];
        for (const v of values) { out.push(v); if (Array.isArray(v)) out.push(...v); }
        return out;
    }

    private static matchCondition(values: any[], condition: any): boolean {
        if (!DocumentQuery.isOperatorObject(condition)) {
            if (condition === null) return values.length === 0 || DocumentQuery.candidates(values).some(v => v == null);
            return DocumentQuery.candidates(values).some(v => DocumentQuery.equal(v, condition));
        }
        return Object.entries(condition).every(([operator, argument]: [string, any]) => {
            const candidates = DocumentQuery.candidates(values);
            switch (operator) {
                case '$eq': return candidates.some(v => DocumentQuery.equal(v, argument));
                case '$ne': return !candidates.some(v => DocumentQuery.equal(v, argument));
                case '$in': return candidates.some(v => (argument as any[]).some(a => DocumentQuery.equal(v, a)));
                case '$nin': return !candidates.some(v => (argument as any[]).some(a => DocumentQuery.equal(v, a)));
                case '$gt': return candidates.some(v => v != null && DocumentQuery.compare(v, argument) > 0);
                case '$gte': return candidates.some(v => v != null && DocumentQuery.compare(v, argument) >= 0);
                case '$lt': return candidates.some(v => v != null && DocumentQuery.compare(v, argument) < 0);
                case '$lte': return candidates.some(v => v != null && DocumentQuery.compare(v, argument) <= 0);
                case '$exists': return argument ? values.length > 0 : values.length === 0;
                case '$elemMatch':
                    return values.some(v => Array.isArray(v) && v.some(element =>
                        DocumentQuery.isOperatorObject(argument) ? DocumentQuery.matchCondition([element], argument) : DocumentQuery.matches(element, argument)));
                case '$not': return !DocumentQuery.matchCondition(values, argument);
                default: throw new Error(`Unsupported query operator ${operator}`);
            }
        });
    }

    private static comparable(value: any): any {
        if (value instanceof Date) return value.getTime();
        if (typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d/.test(value)) { const t = Date.parse(value); if (!Number.isNaN(t)) return t; }
        return value;
    }

    static equal(a: any, b: any): boolean {
        const x = DocumentQuery.comparable(a), y = DocumentQuery.comparable(b);
        if (x === y) return true;
        if (x !== null && y !== null && typeof x === 'object' && typeof y === 'object') return JSON.stringify(x) === JSON.stringify(y);
        return false;
    }

    static compare(a: any, b: any): number {
        const x = DocumentQuery.comparable(a), y = DocumentQuery.comparable(b);
        return x < y ? -1 : x > y ? 1 : 0;
    }

    static project(doc: any, projection: StorageProjection): any {
        if (!projection || Object.keys(projection).length === 0) return doc;
        const entries = Object.entries(projection);
        const including = entries.some(([key, v]) => key !== '_id' && v !== 0 && v !== false);
        if (including) {
            const out: any = {};
            if (projection._id !== 0 && doc._id !== undefined) out._id = doc._id;
            for (const [key, v] of entries) {
                if (v === 0 || v === false) continue;
                const top = key.split('.')[0];
                if (doc[top] !== undefined) out[top] = doc[top];
            }
            return out;
        }
        const out = { ...doc };
        for (const [key] of entries) delete out[key.split('.')[0]];
        return out;
    }

    static sort(docs: any[], sort: StorageSort): any[] {
        if (!sort || Object.keys(sort).length === 0) return docs;
        const keys = Object.entries(sort);
        return [...docs].sort((a, b) => {
            for (const [key, direction] of keys) {
                const c = DocumentQuery.compare(DocumentQuery.values(a, key)[0], DocumentQuery.values(b, key)[0]);
                if (c !== 0) return c * direction;
            }
            return 0;
        });
    }

    /** `update` applied to `doc`: `$set` (dotted paths create objects), `$unset`, `$inc`, `$push`; a document without operators replaces it (its `_id` kept). */
    static apply(doc: any, update: Record<string, any>): any {
        const keys = Object.keys(update);
        if (!keys.some(k => k.startsWith('$'))) return { ...(doc._id !== undefined ? { _id: doc._id } : {}), ...update };
        const out = structuredClone(doc);
        for (const [operator, fields] of Object.entries(update)) {
            for (const [path, value] of Object.entries(fields as object)) {
                const parts = path.split('.');
                const last = parts.pop()!;
                let target = out;
                for (const part of parts) target = (target[part] ??= {});
                switch (operator) {
                    case '$set': target[last] = value; break;
                    case '$unset': delete target[last]; break;
                    case '$inc': target[last] = (target[last] ?? 0) + value; break;
                    case '$push': (target[last] ??= []).push(value); break;
                    default: throw new Error(`Unsupported update operator ${operator}`);
                }
            }
        }
        return out;
    }

    /** The document an upsert inserts: the query's plain equality fields, then the update. */
    static seed(query: StorageQuery): any {
        const seed: any = {};
        for (const [key, value] of Object.entries(query ?? {})) if (!key.startsWith('$') && !key.includes('.') && !DocumentQuery.isOperatorObject(value)) seed[key] = value;
        return seed;
    }

    /** The values a unique index is keyed by, or null when the document has none of its fields. */
    static indexKey(doc: any, fields: string[]): string | null {
        const values = fields.map(f => DocumentQuery.values(doc, f)[0]);
        if (values.every(v => v === undefined)) return null;
        return JSON.stringify(values.map(v => DocumentQuery.comparable(v ?? null)));
    }
}
