/**
 * A user, kept in the `users` collection of the engine's document store (userStore.ts): MongoDB, SQLite or memory.
 * Before 3.7 a mongoose model; the calls bpmn-web and applications made on it work as they did: `User.find(query)`
 * (`.sort()`, `.lean()`, `.collation()`), `findOne`, `findById`, `countDocuments`, `create`, `updateOne`,
 * `deleteOne`, and a user's `save()`, `comparePassword()`, `isAdmin`, `hasGroup()`, `gravatar()`. A password is
 * hashed (bcrypt) when it is saved changed. A MongoDB server's users stay where they were.
 */
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import mongoose from "mongoose";
import { DuplicateKeyError } from "bpmn-server";
import { isAdminGroups, isDesignerGroups } from "../roles.js";
import { userStore, isMongoStore } from "../userStore.js";

const COLLECTION = 'users';
const indexed = new WeakSet<object>();

async function users() {
    const { store, database } = await userStore();
    if (!indexed.has(store)) {
        indexed.add(store);
        await store.createIndex(database, COLLECTION, { userName: 1 }, { unique: true });
    }
    return { store, database };
}

/** A copy of a document's data, without what is undefined. */
const data = (fields: Record<string, any>) => Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));

/** A query on users: awaited (or `.exec()`), it answers users; `.lean()` plain documents. */
class UserQuery<T> implements PromiseLike<T> {
    private sortBy: Record<string, 1 | -1> | null = null;
    private plain = false;
    private anyCase = false;
    private after: Array<(doc: any) => boolean> = [];
    private field: string | null = null;

    constructor(private readonly query: Record<string, any>, private readonly projection: Record<string, any> | null, private readonly one: boolean) { }

    sort(by: Record<string, 1 | -1>) { this.sortBy = by; return this; }
    lean() { this.plain = true; return this; }
    /** `{ strength: 2 }` (or 1): string values match whatever their case. */
    collation(options: { locale?: string, strength?: number }) { this.anyCase = (options?.strength ?? 3) <= 2; return this; }
    where(field: string) { this.field = field; return this; }
    gt(value: any) {
        const field = this.field, limit = value instanceof Date ? value.getTime() : Number(value);
        this.after.push(doc => doc[field] != null && new Date(doc[field]).getTime() > limit);
        return this;
    }
    exec(): Promise<T> { return this.run(); }

    private async run(): Promise<any> {
        const { store, database } = await users();
        let query = this.query ?? {};
        const loose: Record<string, string> = {};
        if (this.anyCase) {
            query = { ...query };
            for (const [k, v] of Object.entries(query))
                if (typeof v === 'string') { loose[k] = v.toLowerCase(); delete query[k]; }
        }
        let docs = await store.find(database, COLLECTION, query, this.projection, this.sortBy);
        docs = docs.filter(doc => Object.entries(loose).every(([k, v]) => typeof doc[k] === 'string' && doc[k].toLowerCase() === v)
            && this.after.every(test => test(doc)));
        const out = this.plain ? docs : docs.map(doc => User.loaded(doc));
        return this.one ? out[0] ?? null : out;
    }

    then<A = T, B = never>(ok?: ((value: T) => A | PromiseLike<A>) | null, failed?: ((reason: any) => B | PromiseLike<B>) | null): Promise<A | B> {
        return this.run().then(ok, failed);
    }
    catch(failed: (reason: any) => any) { return this.run().catch(failed); }
}

class User {
    [field: string]: any;
    declare _id?: any;
    declare userName?: string;
    declare email?: string;
    declare password?: string;
    declare userGroups?: string[];

    /** The password as last saved (a hash), and the fields it had: to know what a save changes. */
    declare private saved: { password?: string, fields: Set<string> } | null;

    constructor(fields: Record<string, any> = {}) {
        Object.defineProperty(this, 'saved', { value: null, writable: true, enumerable: false });
        Object.assign(this, fields);
        // as mongoose's schema gave them: the pages read user.profile.name, user.tokens
        this.userGroups ??= [];
        this.tokens ??= [];
        this.profile ??= {};
    }

    /** A user as read from the store. */
    static loaded(doc: any): User {
        const user = new User(doc);
        user.saved = { password: doc.password, fields: new Set(Object.keys(doc)) };
        return user;
    }

    static collection = { collectionName: COLLECTION };

    static find(query: Record<string, any> = {}, projection: Record<string, any> | null = null) {
        return new UserQuery<any[]>(query, projection, false);
    }
    static findOne(query: Record<string, any> = {}, projection: Record<string, any> | null = null) {
        return new UserQuery<any>(query, projection, true);
    }
    /** By id: its text, or (a MongoDB user made before 3.7) its ObjectId's. */
    static async findById(id: any): Promise<User | null> {
        if (id == null) return null;
        const found = await User.findOne({ _id: id });
        if (found) return found;
        const { store } = await users();
        if (isMongoStore(store) && typeof id === 'string' && /^[0-9a-f]{24}$/i.test(id))
            return User.findOne({ _id: new mongoose.Types.ObjectId(id) });
        return null;
    }
    static async countDocuments(query: Record<string, any> = {}): Promise<number> {
        const { store, database } = await users();
        return store.count ? store.count(database, COLLECTION, query) : (await store.find(database, COLLECTION, query, { _id: 1 })).length;
    }
    static async create(fields: Record<string, any>): Promise<User> {
        return new User(fields).save();
    }
    static async updateOne(query: Record<string, any>, update: Record<string, any>) {
        const { store, database } = await users();
        const set = Object.keys(update).some(k => k.startsWith('$')) ? update : { $set: { ...data(update), updatedAt: new Date() } };
        return { modifiedCount: await store.update(database, COLLECTION, await User.byId(query), set) };
    }
    static async deleteOne(query: Record<string, any>) {
        const { store, database } = await users();
        // no projection: not every store keeps _id in one
        const target = await User.findOne(await User.byId(query)).lean();
        if (!target) return { deletedCount: 0 };
        return store.remove(database, COLLECTION, { _id: target._id });
    }
    /** A query by `_id` given as text: a MongoDB user made before 3.7 has an ObjectId. */
    private static async byId(query: Record<string, any>) {
        if (typeof query?._id !== 'string') return query;
        const { store } = await users();
        if (!isMongoStore(store) || !/^[0-9a-f]{24}$/i.test(query._id)) return query;
        const user = await User.findById(query._id);
        return user ? { ...query, _id: user._id } : query;
    }

    get id(): string | undefined { return this._id === undefined ? undefined : String(this._id); }
    get isAdmin() { return isAdminGroups(this.userGroups); }
    /** May work on models (see roles.ts). */
    get isDesigner() { return isDesignerGroups(this.userGroups); }

    hasGroup(group: string) { return !!this.userGroups && this.userGroups.indexOf(group) !== -1; }

    gravatar(size = 200) {
        if (!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
        const md5 = crypto.createHash('md5').update(this.email).digest('hex');
        return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
    }

    /** Whether the password matches: a callback `(err, isMatch)`, or a promise without one. */
    comparePassword(candidate: string, callback?: (err: any, isMatch?: boolean) => void): any {
        const done = bcrypt.compare(candidate, this.password ?? '');
        if (!callback) return done;
        done.then(isMatch => callback(null, isMatch), err => callback(err));
    }

    /** Inserts a new user, or saves the changed fields; a changed password is hashed. A field set to undefined is cleared. */
    async save(): Promise<this> {
        const { store, database } = await users();
        // one user per email, as mongoose's unique index had it (not every store has one): code 11000, as before
        if (this.email) {
            const others = await store.find(database, COLLECTION, { email: this.email });
            if (others.some(o => this._id === undefined || String(o._id) !== String(this._id)))
                throw new DuplicateKeyError(`a user with the email ${this.email} exists`);
        }
        if (this.password && this.password !== this.saved?.password)
            this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
        const now = new Date();
        if (!this.saved) {
            this._id ??= crypto.randomUUID();
            this.createdAt ??= now;
            this.updatedAt = now;
            await store.insert(database, COLLECTION, [data({ ...this })]);
        }
        else {
            this.updatedAt = now;
            const fields: Record<string, any> = {};
            for (const [k, v] of Object.entries(this)) if (k !== '_id') fields[k] = v === undefined ? null : v;
            for (const k of this.saved.fields) if (k !== '_id' && !(k in fields)) fields[k] = null;
            await store.update(database, COLLECTION, { _id: this._id }, { $set: fields });
        }
        this.saved = { password: this.password, fields: new Set(Object.keys(this)) };
        return this;
    }

    toJSON() { return { ...this, id: this.id }; }
}

export default User;
