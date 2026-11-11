/**
 * Where users and sessions are kept: the engine's document store (IDocumentStore), so they are on the same database
 * as the instances, MongoDB, SQLite or memory. The web application names it when it creates its server
 * ({@link useUserStore}); until then a call on users waits for it, as mongoose's did for its connection.
 */
import session from 'express-session';
import mongoose from 'mongoose';
import type { IDocumentStore } from 'bpmn-server';

interface UserStore { store: IDocumentStore; database: string }

let current: UserStore | null = null;
let named: (value: UserStore) => void;
let ready = new Promise<UserStore>(resolve => named = resolve);

/** The store users and sessions are kept in, and its logical database (MongoDB's name; ignored by the others). */
export function useUserStore(store: IDocumentStore, database: string) {
    current = { store, database };
    named(current);
}

/** The store, once named. */
export async function userStore(): Promise<UserStore> {
    return current ?? ready;
}

/** Forgets the store (a test's server stopped): the next calls wait for a new one. */
export function resetUserStore() {
    current = null;
    ready = new Promise<UserStore>(resolve => named = resolve);
}

/** Whether the store is MongoDB's adapter: its documents may have ObjectIds, made by mongoose before 3.7. */
export const isMongoStore = (store: IDocumentStore) => store?.constructor?.name === 'MongoDB';

/** Whether the database is MongoDB: DATABASE is not sqlite:, and MONGO_DB_URL is a mongodb:// URL. */
export const onMongoDB = () => !process.env.DATABASE?.startsWith('sqlite:') && /^mongodb(\+srv)?:\/\//.test(process.env.MONGO_DB_URL ?? '');

let mongooseConnected = false;
/**
 * On MongoDB, mongoose's connection: for what is still read with it (test sets kept in MongoDB before 3.5, moved to
 * files at start; the health check). Users and sessions do not need it. Elsewhere, nothing.
 */
export function connectMongoose() {
    if (mongooseConnected || !onMongoDB()) return;
    mongooseConnected = true;
    // the address without its password: the log is no place for credentials
    console.log('MongoDB URL', redactUrl(process.env.MONGO_DB_URL));
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGO_DB_URL).catch(() => { /* reported by the error listener below */ });
    // mongoose is only the old test sets' move and the health check now: its trouble is reported, the server goes on
    // (the engine's store has its own connection, and the health check says "degraded")
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB (mongoose) connection error: make sure MongoDB is running.', err?.message ?? err);
    });
}

const SESSIONS = 'sessions';
/** Expired sessions are removed at most this often, in ms. */
const SWEEP_EVERY = 10 * 60 * 1000;

/**
 * express-session's store on the document store: `{ _id: sid, session: JSON, expires: Date }` in `sessions`, the
 * shape connect-mongo kept, so a MongoDB server's sessions go on working after the upgrade.
 */
export class DocumentSessionStore extends session.Store {
    private lastSweep = 0;
    constructor(private readonly ttlMs = 14 * 24 * 60 * 60 * 1000) { super(); }

    private expiry(sess: session.SessionData): Date {
        const at = sess?.cookie?.expires;
        return at ? new Date(at as any) : new Date(Date.now() + this.ttlMs);
    }

    private async sweep() {
        if (Date.now() - this.lastSweep < SWEEP_EVERY) return;
        this.lastSweep = Date.now();
        const { store, database } = await userStore();
        // no projection: not every store keeps _id in one
        const all = await store.find(database, SESSIONS, {});
        const gone = all.filter(s => s.expires && new Date(s.expires).getTime() <= Date.now()).map(s => s._id);
        if (gone.length) await store.remove(database, SESSIONS, { _id: { $in: gone } });
    }

    get(sid: string, callback: (err: any, session?: session.SessionData | null) => void) {
        (async () => {
            const { store, database } = await userStore();
            const [doc] = await store.find(database, SESSIONS, { _id: sid });
            if (!doc) return null;
            if (doc.expires && new Date(doc.expires).getTime() <= Date.now()) {
                await store.remove(database, SESSIONS, { _id: sid });
                return null;
            }
            return typeof doc.session === 'string' ? JSON.parse(doc.session) : doc.session;
        })().then(s => callback(null, s), callback);
    }

    set(sid: string, sess: session.SessionData, callback?: (err?: any) => void) {
        (async () => {
            const { store, database } = await userStore();
            await store.update(database, SESSIONS, { _id: sid },
                { $set: { session: JSON.stringify(sess), expires: this.expiry(sess) } }, { upsert: true });
            await this.sweep();
        })().then(() => callback?.(), callback);
    }

    touch(sid: string, sess: session.SessionData, callback?: (err?: any) => void) {
        (async () => {
            const { store, database } = await userStore();
            await store.update(database, SESSIONS, { _id: sid }, { $set: { expires: this.expiry(sess) } });
        })().then(() => callback?.(), callback);
    }

    destroy(sid: string, callback?: (err?: any) => void) {
        (async () => {
            const { store, database } = await userStore();
            await store.remove(database, SESSIONS, { _id: sid });
        })().then(() => callback?.(), callback);
    }
}

/** A connection string with its password replaced by ***, for the log. */
export function redactUrl(url: string | undefined): string | undefined {
    if (!url) return url;
    try {
        const parsed = new URL(url);
        if (parsed.password) parsed.password = '***';
        return parsed.toString();
    }
    catch {
        return url.replace(/\/\/([^:/@]+):[^@/]+@/, '//$1:***@');
    }
}
