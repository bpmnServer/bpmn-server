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
    /** The locks held here, each renewed until released: only a dead holder's goes stale. */
    private readonly renewing = new Map<string, ReturnType<typeof setInterval>>();

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

    private indexed: Promise<void> | null = null;
    /**
     * Makes sure of the unique index before the first lock or claim, once per locker: without it two servers could both
     * "acquire" an instance. A database that `install()` (npm run setup) never ran on is protected all the same. When the index
     * can not be made (no privilege), it may be there already, so that is tried: two inserts of one id. If both succeed nothing
     * excludes anyone, and locking refuses rather than pretends.
     */
    private ensureIndex(): Promise<void> {
        this.indexed ??= this.install().catch(async error => {
            const probe = `probe:${randomUUID()}`;
            const row = () => [{ id: probe, kind: 'probe', server: this.owner, time: new Date() }];
            let exclusive = false;
            try {
                await this.store.insert(this.database, this.collection, row());
                await this.store.insert(this.database, this.collection, row());
            }
            catch (duplicate) {
                if (!DuplicateKeyError.is(duplicate)) throw duplicate;
                exclusive = true;
            }
            finally {
                await this.store.remove(this.database, this.collection, { id: probe });
            }
            if (!exclusive)
                throw new Error(`Locks can not exclude anyone: no unique index on ${this.database}.${this.collection}, and it could not be made (${error?.message ?? error}). `
                    + 'Run the setup (dataStore.install) as a user that may create indexes');
            this.logger?.warn?.(`the unique index on ${this.database}.${this.collection} could not be made (${error?.message ?? error}); it is there, and locks exclude`);
        });
        return this.indexed;
    }

    async lock(id: string): Promise<boolean> {
        for (let tries = 1; tries <= this.maxTries; tries++) {
            if (await this.try(id)) {
                this.keepRenewing(id);
                return true;
            }
            if (await this.removeStale(id)) continue;
            if (tries < this.maxTries) await this.delay(this.retryDelay);
        }
        const holder = (await this.store.find(this.database, this.collection, { id }, null))[0];
        throw new Error(`failed to lock instance ${id}: held by ${holder?.server ?? 'unknown'} since ${holder?.time ?? 'unknown'}`);
    }

    /** One attempt: true when acquired, false on contention; any other failure throws. */
    async try(id: string, kind = 'lock'): Promise<boolean> {
        await this.ensureIndex();
        try {
            await this.store.insert(this.database, this.collection, [{ id, kind, server: this.owner, time: new Date() }]);
            return true;
        }
        catch (error) {
            if (DuplicateKeyError.is(error)) return false;
            throw error;
        }
    }

    /**
     * A running execution can outlast `staleAfter` (a long service task): its lock's time is kept fresh while it runs, or
     * another server would take over and both would change the instance. A holder that dies stops renewing, and its lock goes stale.
     */
    private keepRenewing(id: string) {
        const timer = setInterval(() => {
            Promise.resolve(this.store.update(this.database, this.collection, { id, server: this.owner }, { $set: { time: new Date() } }))
                .catch(error => this.logger?.warn?.(`lock ${id} could not be renewed: ${error?.message ?? error}`));
        }, Math.max(this.staleAfter / 3, 50));
        timer.unref?.();
        this.renewing.get(id) && clearInterval(this.renewing.get(id));
        this.renewing.set(id, timer);
    }

    /** No more renewals: what a holder's death is, for a test; and at shutdown. */
    stopRenewing() {
        for (const timer of this.renewing.values()) clearInterval(timer);
        this.renewing.clear();
    }

    async release(id: string): Promise<void> {
        clearInterval(this.renewing.get(id));
        this.renewing.delete(id);
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
