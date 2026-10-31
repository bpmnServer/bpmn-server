// In-memory MongoDB-compatible store, faithful enough to run the bpmn-server engine
// without a real mongod. Supports: dot-notation matching into arrays, common operators,
// $set/$inc/$push/replace updates, projection, sort, unique-index enforcement (code 11000),
// and a best-effort aggregate pipeline. Injected via `dataStore.db = new MemoryMongoDB(...)`.
import { ObjectId } from 'mongodb';

const clone = (x) => (x == null ? x : structuredClone(x));

function getValues(obj, parts) {
  let cur = [obj];
  for (const p of parts) {
    const next = [];
    for (const o of cur) {
      if (o == null) continue;
      if (Array.isArray(o)) { for (const e of o) if (e && typeof e === 'object' && p in e) next.push(e[p]); }
      else if (typeof o === 'object' && p in o) next.push(o[p]);
    }
    cur = next;
  }
  return cur;
}
const eq = (a, b) => (a instanceof Date && b instanceof Date) ? a.getTime() === b.getTime()
  : (typeof a === 'object' || typeof b === 'object') ? JSON.stringify(a) === JSON.stringify(b) || String(a) === String(b)
  : a === b;
const cmp = (a, b) => { const x = a instanceof Date ? a.getTime() : a, y = b instanceof Date ? b.getTime() : b; return x < y ? -1 : x > y ? 1 : 0; };

function matchValue(vals, cond) {
  if (cond && typeof cond === 'object' && !Array.isArray(cond) && !(cond instanceof Date)
      && Object.keys(cond).some(k => k.startsWith('$'))) {
    return Object.entries(cond).every(([op, arg]) => {
      switch (op) {
        case '$eq': return vals.some(v => eq(v, arg));
        case '$ne': return !vals.some(v => eq(v, arg));
        case '$in': return vals.some(v => arg.some(a => eq(v, a)));
        case '$nin': return !vals.some(v => arg.some(a => eq(v, a)));
        case '$gt': return vals.some(v => cmp(v, arg) > 0);
        case '$gte': return vals.some(v => cmp(v, arg) >= 0);
        case '$lt': return vals.some(v => cmp(v, arg) < 0);
        case '$lte': return vals.some(v => cmp(v, arg) <= 0);
        case '$exists': return arg ? vals.length > 0 : vals.length === 0;
        case '$regex': { const re = arg instanceof RegExp ? arg : new RegExp(arg, cond.$options || ''); return vals.some(v => re.test(String(v))); }
        case '$options': return true;
        case '$elemMatch': return vals.some(v => Array.isArray(v) ? v.some(e => matchDoc(e, arg)) : matchDoc(v, arg));
        default: return true;
      }
    });
  }
  return vals.some(v => eq(v, cond));
}
function matchDoc(doc, query) {
  for (const [k, v] of Object.entries(query || {})) {
    if (k === '$and') { if (!v.every(q => matchDoc(doc, q))) return false; continue; }
    if (k === '$or') { if (!v.some(q => matchDoc(doc, q))) return false; continue; }
    if (k === '$nor') { if (v.some(q => matchDoc(doc, q))) return false; continue; }
    if (!matchValue(getValues(doc, k.split('.')), v)) return false;
  }
  return true;
}
function applyUpdate(doc, upd) {
  const hasOp = Object.keys(upd).some(k => k.startsWith('$'));
  if (!hasOp) { const _id = doc._id; for (const k of Object.keys(doc)) if (k !== '_id') delete doc[k]; Object.assign(doc, clone(upd)); doc._id = _id; return; }
  for (const [op, fields] of Object.entries(upd)) {
    if (op === '$set') Object.assign(doc, clone(fields));
    else if (op === '$unset') for (const f of Object.keys(fields)) delete doc[f];
    else if (op === '$inc') for (const [f, n] of Object.entries(fields)) doc[f] = (doc[f] || 0) + n;
    else if (op === '$push') for (const [f, val] of Object.entries(fields)) { (doc[f] ||= []).push(clone(val)); }
  }
}

export class MemoryMongoDB {
  constructor(dbConfig, logger) { this.dbConfig = dbConfig; this.logger = logger || { log() {} }; this.store = new Map(); this.uniques = new Map(); }
  _coll(name) { if (!this.store.has(name)) this.store.set(name, []); return this.store.get(name); }
  profilerStart() {} profilerEnd() {}

  async find(_db, coll, qry, projection = null, sort = null) {
    let rows = this._coll(coll).filter(d => matchDoc(d, qry || {}));
    if (sort) { const [f, dir] = Object.entries(sort)[0]; rows = rows.slice().sort((a, b) => cmp(getValues(a, f.split('.'))[0], getValues(b, f.split('.'))[0]) * (dir < 0 ? -1 : 1)); }
    rows = rows.map(clone);
    if (projection && Object.keys(projection).length) {
      const incl = Object.entries(projection).filter(([, v]) => v).map(([k]) => k);
      const excl = Object.entries(projection).filter(([, v]) => !v).map(([k]) => k);
      rows = rows.map(d => { if (incl.length) { const o = { _id: d._id }; for (const k of incl) if (k in d) o[k] = d[k]; return o; } for (const k of excl) delete d[k]; return d; });
    }
    return rows;
  }
  async createIndex(_db, coll, index, opts = {}) {
    if (opts && opts.unique) { (this.uniques.get(coll) || this.uniques.set(coll, []).get(coll)).push(Object.keys(index)); }
    return Object.keys(index).join('_') + '_1';
  }
  _checkUnique(coll, doc) {
    for (const keys of (this.uniques.get(coll) || [])) {
      const dup = this._coll(coll).some(d => keys.every(k => eq(getValues(d, k.split('.'))[0], getValues(doc, k.split('.'))[0])));
      if (dup) { const e = new Error('E11000 duplicate key'); e.code = 11000; throw e; }
    }
  }
  async insert(_db, coll, docs) {
    for (const d of docs) { d._id ||= new ObjectId(); this._checkUnique(coll, d); this._coll(coll).push(clone(d)); }
    return docs.length;
  }
  async update(_db, coll, query, updateObject, options = {}) {
    const d = this._coll(coll).find(x => matchDoc(x, query));
    if (d) { applyUpdate(d, updateObject); return 1; }
    if (options.upsert) { const nd = { _id: new ObjectId(), ...query }; applyUpdate(nd, updateObject); this._coll(coll).push(nd); return 1; }
    return 0;
  }
  async remove(_db, coll, query) {
    const arr = this._coll(coll); const before = arr.length;
    for (let i = arr.length - 1; i >= 0; i--) if (matchDoc(arr[i], query || {})) arr.splice(i, 1);
    return { deletedCount: before - arr.length };
  }
  async removeById(_db, coll, id) {
    const arr = this._coll(coll); const i = arr.findIndex(d => String(d._id) === String(id));
    if (i >= 0) arr.splice(i, 1); return { deletedCount: i >= 0 ? 1 : 0 };
  }
  async getClient() {
    const self = this;
    const mkCursor = (rows) => ({ toArray: async () => rows.map(clone) });
    return { db: () => ({ collection: (coll) => ({
      find: (q) => mkCursor(self._coll(coll).filter(d => matchDoc(d, q || {}))),
      aggregate: (pipeline) => {
        let rows = self._coll(coll).map(clone);
        for (const stage of pipeline || []) {
          const [op, arg] = Object.entries(stage)[0];
          if (op === '$match') rows = rows.filter(d => matchDoc(d, arg));
          else if (op === '$sort') { const [f, dir] = Object.entries(arg)[0]; rows.sort((a, b) => cmp(getValues(a, f.split('.'))[0], getValues(b, f.split('.'))[0]) * (dir < 0 ? -1 : 1)); }
          else if (op === '$skip') rows = rows.slice(arg);
          else if (op === '$limit') rows = rows.slice(0, arg);
          else if (op === '$count') rows = [{ [arg]: rows.length }];
          else if (op === '$unwind') { const f = (typeof arg === 'string' ? arg : arg.path).replace('$', ''); rows = rows.flatMap(d => (d[f] || []).map(e => ({ ...d, [f]: e }))); }
        }
        return mkCursor(rows);
      },
    }) }) };
  }
  async connect() { return await this.getClient(); }
}
