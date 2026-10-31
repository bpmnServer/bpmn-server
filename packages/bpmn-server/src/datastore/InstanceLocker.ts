import { hostname } from 'node:os';
import { randomUUID } from 'node:crypto';
import { DuplicateKeyError } from '../interfaces/storage.js';
import type { IDocumentStore, ILockManager } from '../interfaces/storage.js';

const COLLECTION = 'wf_locks';

export type InstanceLockerOptions = {
    /** The logical database (MongoDB's db name). */
    database: string;
    collection?: string;
    /** This process's identity as an owner; default `SERVER_ID`, else host, process id and a random suffix. */
    owner?: string;
    /** Milliseconds between tries. */
    retryDelay?: number;
    /** Tries before `lock` gives up. */
    maxTries?: number;
    /** Milliseconds after which a lock or claim is stale: its owner is presumed gone and another may take it. */
    staleAfter?: number;
    logger?: { log(...m: any[]): any; warn?(...m: any[]): any };
};

/**
 * The lock port over any {@link IDocumentStore}: a lock is a document with a unique id, so the
 * store's unique index makes acquisition atomic across processes. Only a duplicate key means
 * contention; any other failure (a lost connection) is thrown, not retried as if the lock were
 * busy. A lock is released only by its owner, and one older than `staleAfter` is taken over.
 *
 * Legacy form: `new InstanceLocker(dataStore)`, using the data store's `db` and database. The store
 * may be given as a function, read on each use (the data store gives its current `db`).
 */
class InstanceLocker implements ILockManager {
    readonly owner: string;
    /** The store, read when used: a data store's `db` replaced after it was made (an in-memory one, in a test) is the one locked in. */
    private readonly storeOf: () => IDocumentStore;
    private get store(): IDocumentStore { return this.storeOf(); }
    private readonly database: string;
    private readonly collection: string;
    private readonly retryDelay: number;
    private readonly maxTries: number;
    private readonly staleAfter: number;
    private readonly logger;

    constructor(store: IDocumentStore | (() => IDocumentStore) | { db: IDocumentStore; dbConfiguration: { db: string; Locks_collection?: string }; logger? }, options?: Partial<InstanceLockerOptions>) {
        const legacy = !options && typeof store === 'object' && 'db' in store && 'dbConfiguration' in store;
        this.storeOf = legacy ? () => (store as any).db : typeof store === 'function' ? store as () => IDocumentStore : () => store as IDocumentStore;
        const o: Partial<InstanceLockerOptions> = legacy ? { database: (store as any).dbConfiguration.db, collection: (store as any).dbConfiguration.Locks_collection, logger: (store as any).logger } : options ?? {};
        this.database = o.database ?? 'bpmn';
        this.collection = o.collection ?? COLLECTION;
        this.owner = o.owner ?? InstanceLocker.defaultOwner();
        this.retryDelay = o.retryDelay ?? 1500;
        this.maxTries = o.maxTries ?? 20;
        this.staleAfter = o.staleAfter ?? 5 * 60_000;
        this.logger = o.logger;
    }

    static defaultOwner(): string {
        const configured = typeof process !== 'undefined' ? process.env.SERVER_ID : undefined;
        return configured || `${hostname()}:${process.pid}:${randomUUID().slice(0, 8)}`;
    }

    /** The unique index acquisition relies on; part of the data store's `install()`. */
    async install() {
        await this.store.createIndex(this.database, this.collection, { id: 1 }, { unique: true });
    }

    async lock(id: string): Promise<boolean> {
        for (let tries = 1; tries <= this.maxTries; tries++) {
            if (await this.try(id)) return true;
            if (await this.removeStale(id)) continue;
            if (tries < this.maxTries) await this.delay(this.retryDelay);
        }
        const holder = (await this.store.find(this.database, this.collection, { id }, null))[0];
        throw new Error(`failed to lock instance ${id}: held by ${holder?.server ?? 'unknown'} since ${holder?.time ?? 'unknown'}`);
    }

    /** One attempt: true when acquired, false on contention; any other failure throws. */
    async try(id: string, kind = 'lock'): Promise<boolean> {
        try {
            await this.store.insert(this.database, this.collection, [{ id, kind, server: this.owner, time: new Date() }]);
            return true;
        }
        catch (error) {
            if (DuplicateKeyError.is(error)) return false;
            throw error;
        }
    }

    async release(id: string): Promise<void> {
        const { deletedCount } = await this.store.remove(this.database, this.collection, { id, server: this.owner });
        if (deletedCount === 0) this.logger?.log?.(`lock ${id} was not held by ${this.owner}: nothing released`);
    }

    async claim(key: string): Promise<boolean> {
        const id = 'claim:' + key;
        if (await this.try(id, 'claim')) return true;
        return (await this.removeStale(id)) ? this.try(id, 'claim') : false;
    }

    /** Removes the claims older than the stale age: what is still due after it is tried again. */
    async purgeClaims(): Promise<number> {
        const { deletedCount } = await this.store.remove(this.database, this.collection, { kind: 'claim', time: { $lt: new Date(Date.now() - this.staleAfter) } });
        return deletedCount;
    }

    /** Removes `id` when it is older than `staleAfter`; true when it did. */
    private async removeStale(id: string): Promise<boolean> {
        const { deletedCount } = await this.store.remove(this.database, this.collection, { id, time: { $lt: new Date(Date.now() - this.staleAfter) } });
        if (deletedCount > 0) this.logger?.log?.(`lock ${id} was stale (older than ${this.staleAfter} ms): taken over by ${this.owner}`);
        return deletedCount > 0;
    }

    /** Removes locks matching `query`, whoever holds them: an administrator's tool. */
    async delete(query) {
        return await this.store.remove(this.database, this.collection, query);
    }

    async list() {
        return await this.store.find(this.database, this.collection, {}, null);
    }

    private delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }
}

export { InstanceLocker }
