/**
 * The storage ports: what the engine's persistence components (the instance DataStore, the models
 * datastore and the instance locker) need from a database, so that MongoDB is one adapter among
 * others (an in-memory store; an application's PostgreSQL) and no engine code changes with it.
 *
 * Documents are plain JSON objects. Queries, updates, projections and sorts use the subset of
 * MongoDB's query language the engine issues (equality, dotted paths into arrays, `$elemMatch`,
 * `$or`, `$nor`, `$and`, `$exists`, `$eq`, `$ne`, `$in`, `$nin`, `$lt`, `$lte`, `$gt`, `$gte`;
 * `$set` and whole-document updates, with `upsert`); an adapter that cannot evaluate a query
 * refuses it, never ignores part of it.
 */
export type StorageQuery = Record<string, any>;
export type StorageProjection = Record<string, 0 | 1 | any> | null;
export type StorageSort = Record<string, 1 | -1> | null;

export interface IDocumentStore {
    /** Documents of `collection` matching `query`, projected and sorted. `database` names the logical database (MongoDB's db name; ignored by single-database adapters). */
    find(database: string, collection: string, query: StorageQuery, projection?: StorageProjection, sort?: StorageSort): Promise<any[]>;
    /** Inserts all of `documents`, or none: a unique-index conflict throws a {@link DuplicateKeyError}; any other failure throws as it is. Returns how many were inserted. */
    insert(database: string, collection: string, documents: any[]): Promise<number>;
    /** Updates the first document matching `query` (`$set` fields, or replaces it); `{ upsert: true }` inserts when none matches. Returns how many were modified. */
    update(database: string, collection: string, query: StorageQuery, update: Record<string, any>, options?: { upsert?: boolean }): Promise<number>;
    /** Removes every document matching `query`; returns `{ deletedCount }`. */
    remove(database: string, collection: string, query: StorageQuery): Promise<{ deletedCount: number }>;
    /** Declares an index; `{ unique: true }` makes {@link insert} refuse a second document with the same values. Idempotent. */
    createIndex(database: string, collection: string, index: Record<string, 1 | -1>, options?: { unique?: boolean }): Promise<string | null>;
    /** Releases connections. Idempotent. */
    close(): Promise<void>;
}

/** Thrown by {@link IDocumentStore.insert} for a unique-index conflict, and only for that. `code` is MongoDB's, for code that tested it. */
export class DuplicateKeyError extends Error {
    readonly code = 11000;
    constructor(message = 'duplicate key') {
        super(message);
        this.name = 'DuplicateKeyError';
    }
    static is(error: unknown): boolean {
        return error instanceof DuplicateKeyError || (typeof error === 'object' && error !== null && (error as any).code === 11000);
    }
}

/**
 * The lock port: one owner at a time per instance, across processes. The engine locks an instance
 * for each operation on it and releases it afterwards, and claims a timer before firing it.
 */
export interface ILockManager {
    /** This process's identity as a lock owner. */
    readonly owner: string;
    /** Waits until `id` is locked by this owner, or throws once the configured tries are spent. A lock older than the stale age is taken over. */
    lock(id: string): Promise<boolean>;
    /** Releases `id` only when this owner holds it. */
    release(id: string): Promise<void>;
    /** Takes `key` once, without waiting: true for the one claimant, false when another (any process) holds it. Claims expire after the stale age. */
    claim(key: string): Promise<boolean>;
    /** Every current lock, for diagnostics. */
    list(): Promise<any[]>;
}
