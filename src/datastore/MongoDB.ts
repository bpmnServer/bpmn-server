import { MongoClient, ObjectId } from 'mongodb';
import { DuplicateKeyError } from '../interfaces/storage.js';
import type { IDocumentStore } from '../interfaces/storage.js';

/*
 * mongodb 6/7 driver migration notes (was written against the 3.x callback API):
 *  - The callback form of every method was removed in driver 4.x — all ops are promise-only.
 *  - `update()` and `remove()` were removed: use updateOne/updateMany and deleteOne/deleteMany.
 *  - Result shapes changed: insertMany -> {insertedCount}, updateOne -> {modifiedCount},
 *    deleteMany -> {deletedCount}. The old `result.result.n` / `JSON.parse(result).n` are gone.
 *  - `ObjectID` was renamed to `ObjectId`.
 *  - `useUnifiedTopology` is the default and is no longer an accepted option.
 */
/** The MongoDB adapter of the storage port: one client, opened on first use, closed by `close()`. */
class MongoDB implements IDocumentStore {
    client: MongoClient | null = null;
    private connecting: Promise<MongoClient> | null = null;
    dbConfig: any;
    logger: any;
    operation: string;

    constructor(dbConfig, logger) {
        this.dbConfig = dbConfig;
        this.logger = logger;
    }

    profilerStart(operation: string) {
        if (process.env.ENABLE_PROFILER === 'true') console.time(operation);
        this.operation = operation;
    }

    profilerEnd() {
        if (process.env.ENABLE_PROFILER === 'true') console.timeEnd(this.operation);
    }

    async getClient(): Promise<MongoClient> {
        if (this.client) return this.client;
        // One connection however many callers ask at once.
        this.connecting ??= this.connect().then(client => (this.client = client), error => { this.connecting = null; throw error; });
        return this.connecting;
    }

    async find(dbName, collName, qry, projection = null, sort = null) {
        const client = await this.getClient();
        const collection = client.db(dbName).collection(collName);

        this.profilerStart('>mongo.find:' + collName);
        let cursor = collection.find(qry);
        if (projection) cursor = cursor.project(projection) as any;
        if (sort) cursor = cursor.sort(sort);

        try {
            return await cursor.toArray();
        } finally {
            this.profilerEnd();
        }
    }

    // db.collection.createIndex({ "a.loc": 1, "a.qty": 1 }, { unique: true })
    async createIndex(dbName, collName, index, unique: any = {}) {
        const client = await this.getClient();
        const collection = client.db(dbName).collection(collName);

        try {
            const name = await collection.createIndex(index, unique);
            this.logger.log('index named "' + name + '" was created for collection "' + collName + '"');
            return name;
        } catch (err: any) {
            // 85 IndexOptionsConflict, 86 IndexKeySpecsConflict: an index already exists with other options; keep it.
            if (err && (err.code === 85 || err.code === 86)) {
                this.logger.log('index for ' + JSON.stringify(index) + ' already exists for collection "' + collName + '"');
                return null;
            }
            throw err;
        }
    }

    async insert(dbName, collName, docs) {
        const client = await this.getClient();
        const collection = client.db(dbName).collection(collName);

        this.profilerStart('>mongo.insert:' + collName);
        try {
            const result = await collection.insertMany(docs);
            return result.insertedCount;
        } catch (err: any) {
            if (err && err.code === 11000) throw new DuplicateKeyError(err.message);
            throw err;
        } finally {
            this.profilerEnd();
        }
    }

    async update(dbName, collName, query, updateObject, options: any = {}) {
        const client = await this.getClient();
        const collection = client.db(dbName).collection(collName);

        this.profilerStart('>mongo.update:' + collName);
        try {
            const result = await collection.updateOne(query, updateObject, options);
            this.logger.log(' updated ' + result.modifiedCount);
            return result.modifiedCount;
        } finally {
            this.profilerEnd();
        }
    }

    async remove(dbName, collName, query) {
        const client = await this.getClient();
        const collection = client.db(dbName).collection(collName);

        this.profilerStart('>mongo.remove:' + collName);
        try {
            const result = await collection.deleteMany(query);
            this.logger.log('remove done for ' + result.deletedCount + ' docs in ' + collName);
            return result;
        } catch (err) {
            this.logger.log('error ' + err);
            throw err;
        } finally {
            this.profilerEnd();
        }
    }

    async removeById(dbName, collName, id) {
        const client = await this.getClient();
        const collection = client.db(dbName).collection(collName);

        try {
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            this.logger.log('remove done for ' + id + ' >' + result.deletedCount);
            return result;
        } catch (err) {
            this.logger.log('error ' + err);
            throw err;
        }
    }

    async close(): Promise<void> {
        const client = this.client ?? (this.connecting ? await this.connecting.catch(() => null) : null);
        this.client = null;
        this.connecting = null;
        if (client) await client.close();
    }

    async connect(): Promise<MongoClient> {
        const client = new MongoClient(this.dbConfig.db_url);
        await client.connect();
        return client;
    }
}

export { MongoDB };
