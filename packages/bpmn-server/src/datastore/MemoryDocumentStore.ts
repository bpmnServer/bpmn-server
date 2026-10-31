import { randomUUID } from 'node:crypto';
import { DuplicateKeyError } from '../interfaces/storage.js';
import type { IDocumentStore, StorageQuery, StorageProjection, StorageSort } from '../interfaces/storage.js';
import { DocumentQuery } from './DocumentQuery.js';

/**
 * An {@link IDocumentStore} in memory: for tests, and for a standalone engine that keeps nothing
 * across restarts. Documents are copied in and out, so callers never share state with the store;
 * unique indexes are enforced as MongoDB does. One instance may be shared by several servers to
 * stand for one database they all use.
 */
export class MemoryDocumentStore implements IDocumentStore {
    private readonly collections = new Map<string, any[]>();
    private readonly uniqueIndexes = new Map<string, string[][]>();

    private name(database: string, collection: string) { return `${database}/${collection}`; }
    private docs(database: string, collection: string): any[] {
        const name = this.name(database, collection);
        if (!this.collections.has(name)) this.collections.set(name, []);
        return this.collections.get(name)!;
    }

    async find(database: string, collection: string, query: StorageQuery, projection: StorageProjection = null, sort: StorageSort = null): Promise<any[]> {
        const found = this.docs(database, collection).filter(d => DocumentQuery.matches(d, query ?? {}));
        return DocumentQuery.sort(found, sort).map(d => DocumentQuery.project(structuredClone(d), projection));
    }

    async insert(database: string, collection: string, documents: any[]): Promise<number> {
        const docs = this.docs(database, collection);
        const added = documents.map(d => ({ _id: d._id ?? randomUUID(), ...structuredClone(d) }));
        for (let i = 0; i < added.length; i++) this.assertUnique(database, collection, [...docs, ...added.slice(0, i)], added[i]);
        docs.push(...added);
        return added.length;
    }

    async update(database: string, collection: string, query: StorageQuery, update: Record<string, any>, options: { upsert?: boolean } = {}): Promise<number> {
        const docs = this.docs(database, collection);
        const index = docs.findIndex(d => DocumentQuery.matches(d, query ?? {}));
        if (index < 0) {
            if (!options.upsert) return 0;
            await this.insert(database, collection, [DocumentQuery.apply(DocumentQuery.seed(query), update)]);
            return 1;
        }
        const updated = DocumentQuery.apply(docs[index], update);
        this.assertUnique(database, collection, docs.filter((_, i) => i !== index), updated);
        docs[index] = updated;
        return 1;
    }

    async remove(database: string, collection: string, query: StorageQuery): Promise<{ deletedCount: number }> {
        const docs = this.docs(database, collection);
        const kept = docs.filter(d => !DocumentQuery.matches(d, query ?? {}));
        this.collections.set(this.name(database, collection), kept);
        return { deletedCount: docs.length - kept.length };
    }

    async createIndex(database: string, collection: string, index: Record<string, 1 | -1>, options: { unique?: boolean } = {}): Promise<string | null> {
        const fields = Object.keys(index);
        const name = fields.map(f => `${f}_${index[f]}`).join('_');
        if (options.unique) {
            const key = this.name(database, collection);
            const list = this.uniqueIndexes.get(key) ?? [];
            if (!list.some(l => l.join() === fields.join())) list.push(fields);
            this.uniqueIndexes.set(key, list);
        }
        return name;
    }

    async close(): Promise<void> { }

    private assertUnique(database: string, collection: string, others: any[], doc: any) {
        for (const fields of this.uniqueIndexes.get(this.name(database, collection)) ?? []) {
            const key = DocumentQuery.indexKey(doc, fields);
            if (key !== null && others.some(o => DocumentQuery.indexKey(o, fields) === key))
                throw new DuplicateKeyError(`duplicate key in ${collection} for ${fields.join(', ')}: ${key}`);
        }
    }
}
