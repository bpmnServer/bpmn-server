import { createRequire } from 'node:module';
import { orderedId } from './orderedId.js';
import { DuplicateKeyError } from '../interfaces/storage.js';
import type { IDocumentStore, StorageQuery, StorageProjection, StorageSort } from '../interfaces/storage.js';
import { DocumentQuery } from './DocumentQuery.js';

export interface SqliteOptions {
    /** How long a write waits for another connection's (another server's) write to end, in ms; default 5000. */
    busyTimeout?: number;
}

/** A date in a stored document: JSON has none, so dates are kept as `{ "$date": iso }` and read back as Dates. */
const DATE = '$date';
function replacer(this: any, key: string, value: any) {
    const raw = this[key];
    return raw instanceof Date ? { [DATE]: raw.toISOString() } : value;
}
function reviver(key: string, value: any) {
    if (value !== null && typeof value === 'object' && typeof value[DATE] === 'string' && Object.keys(value).length === 1)
        return new Date(value[DATE]);
    return value;
}

const ISO_DATE = /^\d{4}-\d\d-\d\dT\d\d:\d\d/;
/** A JSON path for SQLite's JSON functions: `$."a"."b"`. */
const jsonPath = (path: string) => '$' + path.split('.').map(p => '.' + JSON.stringify(p)).join('');
const quoteName = (name: string) => '"' + name.replace(/"/g, '""') + '"';

/**
 * An {@link IDocumentStore} on a SQLite file (Node's built-in `node:sqlite`, Node 22.5 or later): no database
 * server, for small installs, demos and desktop use. Several servers may share one file.
 *
 * One table per collection, `(_id TEXT PRIMARY KEY, doc TEXT)`, the document as JSON. A query's plain
 * equalities (`id`, `name`, `items.id`, ...) narrow the rows in SQL; {@link DocumentQuery} then decides, so
 * queries mean exactly what they mean on the in-memory store. Unique indexes are SQLite expression indexes
 * (a document with none of an index's fields is not in it, as on the in-memory store); other indexes are
 * not needed by that pre-filter and are not made. Writes run in `BEGIN IMMEDIATE` transactions, the file
 * in WAL mode, so one writer at a time and readers never blocked.
 *
 * `database` (MongoDB's database name) is ignored: the file is the database.
 */
export class SqliteDocumentStore implements IDocumentStore {
    private db: any = null;
    private readonly tables = new Set<string>();

    /** @param filename the database file (made when missing), or `:memory:` */
    constructor(readonly filename: string, private readonly options: SqliteOptions = {}) { }

    private open() {
        if (this.db) return this.db;
        let sqlite;
        try {
            sqlite = createRequire(import.meta.url)('node:sqlite');
        }
        catch {
            throw new Error(`SQLite storage needs Node.js 22.5 or later (node:sqlite); this is ${process.version}`);
        }
        const db = new sqlite.DatabaseSync(this.filename);
        db.exec(`PRAGMA busy_timeout = ${Number(this.options.busyTimeout ?? 5000)}`);
        if (this.filename !== ':memory:') {
            db.exec('PRAGMA journal_mode = WAL');
            db.exec('PRAGMA synchronous = NORMAL');
        }
        this.db = db;
        return db;
    }

    /** The collection's table, made on first use. */
    private table(collection: string): string {
        const name = quoteName(collection);
        if (!this.tables.has(collection)) {
            this.open().exec(`CREATE TABLE IF NOT EXISTS ${name} (_id TEXT PRIMARY KEY, doc TEXT NOT NULL)`);
            this.tables.add(collection);
        }
        return name;
    }

    /** Runs `fn` in a write transaction: all of it, or none. */
    private write<T>(fn: () => T): T {
        const db = this.open();
        db.exec('BEGIN IMMEDIATE');
        try {
            const result = fn();
            db.exec('COMMIT');
            return result;
        }
        catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
    }

    /**
     * SQL that keeps every row the query may match (a superset), from its plain equalities on strings and
     * numbers at a path of one or two parts; a value that is an array or an object (a date) is kept for
     * {@link DocumentQuery} to decide.
     */
    private prefilter(query: StorageQuery): { where: string; params: any[] } {
        const clauses = [], params = [];
        for (const [key, value] of Object.entries(query ?? {})) {
            if (key.startsWith('$')) continue;
            const scalar = (typeof value === 'string' && !ISO_DATE.test(value)) || (typeof value === 'number' && Number.isFinite(value));
            const parts = key.split('.');
            if (!scalar || parts.length > 2 || parts.some(p => /^\d+$/.test(p))) continue;
            const path = jsonPath(key);
            let clause = `(json_extract(doc, '${path}') = ? OR json_type(doc, '${path}') IN ('array', 'object'))`;
            params.push(value);
            if (parts.length === 2) {
                const member = jsonPath(parts[1]);
                clause = `(${clause} OR EXISTS (SELECT 1 FROM json_each(doc, '${jsonPath(parts[0])}') AS e WHERE e.type = 'object'`
                    + ` AND (json_extract(e.value, '${member}') = ? OR json_type(e.value, '${member}') IN ('array', 'object'))))`;
                params.push(value);
            }
            clauses.push(clause);
        }
        return { where: clauses.length ? 'WHERE ' + clauses.join(' AND ') : '', params };
    }

    /** The rows matching `query`, in insertion order, as documents. */
    private matching(collection: string, query: StorageQuery): { _id: string; doc: any }[] {
        const { where, params } = this.prefilter(query);
        const rows = this.open().prepare(`SELECT _id, doc FROM ${this.table(collection)} ${where} ORDER BY rowid`).all(...params);
        const out = [];
        for (const row of rows) {
            const doc = JSON.parse(row.doc, reviver);
            if (DocumentQuery.matches(doc, query ?? {})) out.push({ _id: row._id, doc });
        }
        return out;
    }

    private run(sql: string, params: any[]) {
        try {
            return this.open().prepare(sql).run(...params);
        }
        catch (error) {
            if (/UNIQUE constraint failed/i.test(error?.message ?? ''))
                throw new DuplicateKeyError(error.message);
            throw error;
        }
    }

    async find(database: string, collection: string, query: StorageQuery, projection: StorageProjection = null, sort: StorageSort = null): Promise<any[]> {
        const docs = this.matching(collection, query).map(r => r.doc);
        return DocumentQuery.sort(docs, sort).map(d => DocumentQuery.project(d, projection));
    }

    async count(database: string, collection: string, query: StorageQuery): Promise<number> {
        if (!query || Object.keys(query).length === 0)
            return Number(this.open().prepare(`SELECT count(*) AS n FROM ${this.table(collection)}`).get().n);
        return this.matching(collection, query).length;
    }

    async insert(database: string, collection: string, documents: any[]): Promise<number> {
        const table = this.table(collection);
        return this.write(() => {
            for (const document of documents) {
                const doc = { _id: document._id ?? orderedId(), ...document };
                this.run(`INSERT INTO ${table} (_id, doc) VALUES (?, ?)`, [String(doc._id), JSON.stringify(doc, replacer)]);
            }
            return documents.length;
        });
    }

    async update(database: string, collection: string, query: StorageQuery, update: Record<string, any>, options: { upsert?: boolean } = {}): Promise<number> {
        const table = this.table(collection);
        return this.write(() => {
            const [found] = this.matching(collection, query);
            if (!found) {
                if (!options.upsert) return 0;
                const doc = DocumentQuery.apply(DocumentQuery.seed(query), update);
                doc._id ??= orderedId();
                this.run(`INSERT INTO ${table} (_id, doc) VALUES (?, ?)`, [String(doc._id), JSON.stringify(doc, replacer)]);
                return 1;
            }
            const updated = DocumentQuery.apply(found.doc, update);
            this.run(`UPDATE ${table} SET doc = ? WHERE _id = ?`, [JSON.stringify(updated, replacer), found._id]);
            return 1;
        });
    }

    async remove(database: string, collection: string, query: StorageQuery): Promise<{ deletedCount: number }> {
        const table = this.table(collection);
        return this.write(() => {
            if (!query || Object.keys(query).length === 0)
                return { deletedCount: Number(this.run(`DELETE FROM ${table}`, []).changes) };
            const ids = this.matching(collection, query).map(r => r._id);
            const remove = this.open().prepare(`DELETE FROM ${table} WHERE _id = ?`);
            for (const id of ids) remove.run(id);
            return { deletedCount: ids.length };
        });
    }

    async createIndex(database: string, collection: string, index: Record<string, 1 | -1>, options: { unique?: boolean } = {}): Promise<string | null> {
        const fields = Object.keys(index);
        const name = fields.map(f => `${f}_${index[f]}`).join('_');
        if (!options.unique) return name;
        const table = this.table(collection);
        // null (not in the index) when the document has none of the fields; a missing one counts as null
        const none = fields.map(f => `json_type(doc, '${jsonPath(f)}') IS NULL`).join(' AND ');
        const key = `json_array(${fields.map(f => `json_extract(doc, '${jsonPath(f)}')`).join(', ')})`;
        this.open().exec(`CREATE UNIQUE INDEX IF NOT EXISTS ${quoteName(collection + '_' + name)} ON ${table} ((CASE WHEN ${none} THEN NULL ELSE ${key} END))`);
        return name;
    }

    async close(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.tables.clear();
        }
    }
}
