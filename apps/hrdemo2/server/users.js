// The HR application's users and sessions, in its own database: a SQLite file (HR_DATA, default data/hr.sqlite), apart
// from the workflow server's. Passwords are hashed (scrypt). The first start adds the demo's accounts.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import session from 'express-session';

/**
 * What a role may do in the HR application, and the workflow groups it gives: the models' lanes (Leave Application's
 * Employee, Manager and HR) are the groups that start a process and take its tasks; ADMIN administers the workflows
 * and designs their models. Worked out from the role each time, so a change here reaches every user.
 */
export const ROLES = {
  'HR Administrator': ['Employee', 'HR', 'ADMIN'],
  'Manager': ['Employee', 'Manager'],
  'Employee': ['Employee'],
};

/** The demo's accounts, made on the first start, all with the password HR_DEMO_PASSWORD (default demo1234). */
export const demoPassword = () => process.env.HR_DEMO_PASSWORD || 'demo1234';
export const DEMO_USERS = [
  { userName: 'admin', name: 'HR Administrator', email: 'admin@company.com', role: 'HR Administrator' },
  { userName: 'sarah.chen', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Manager', employeeId: 'EMP-001' },
  { userName: 'michael.brown', name: 'Michael Brown', email: 'michael.brown@company.com', role: 'HR Administrator', employeeId: 'EMP-008' },
  { userName: 'david.kim', name: 'David Kim', email: 'david.kim@company.com', role: 'Employee', employeeId: 'EMP-004' },
];

function hash(password) {
  const salt = crypto.randomBytes(16);
  return `scrypt:${salt.toString('base64')}:${crypto.scryptSync(password, salt, 32).toString('base64')}`;
}

function matches(password, stored) {
  const [kind, salt, key] = String(stored ?? '').split(':');
  if (kind !== 'scrypt' || !salt || !key) return false;
  const given = crypto.scryptSync(String(password), Buffer.from(salt, 'base64'), 32);
  const expected = Buffer.from(key, 'base64');
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

/** A user as the application shows it: never its password. */
const shown = row => row && {
  userName: row.userName, name: row.name, email: row.email, role: row.role, employeeId: row.employeeId ?? null,
  userGroups: ROLES[row.role] ?? [],
};

export class HrUsers {
  constructor(file = process.env.HR_DATA || path.join(import.meta.dirname, '..', 'data', 'hr.sqlite')) {
    if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
    this.db = new DatabaseSync(file);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (userName TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, role TEXT NOT NULL,
        employeeId TEXT, userGroups TEXT NOT NULL, password TEXT NOT NULL, createdAt TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, data TEXT NOT NULL, expires INTEGER NOT NULL);`);
  }

  /** The demo's accounts, when there are no users: what was made. */
  install(password = demoPassword()) {
    if (this.count() > 0) return [];
    for (const user of DEMO_USERS) this.add({ ...user, password });
    console.log(`HR: the demo's accounts (${DEMO_USERS.map(u => u.userName).join(', ')}), password ${password}`);
    return DEMO_USERS.map(u => u.userName);
  }

  count() {
    return this.db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  }

  list() {
    return this.db.prepare('SELECT * FROM users ORDER BY userName').all().map(shown);
  }

  get(userName) {
    return shown(this.db.prepare('SELECT * FROM users WHERE userName = ?').get(String(userName)));
  }

  findByEmail(email) {
    return shown(this.db.prepare('SELECT * FROM users WHERE email = ?').get(String(email)));
  }

  /** The user, when the password is theirs. */
  verify(userName, password) {
    const row = this.db.prepare('SELECT * FROM users WHERE userName = ? OR email = ?').get(String(userName), String(userName));
    return row && matches(password, row.password) ? shown(row) : null;
  }

  add({ userName, name, email, role = 'Employee', employeeId = null, password }) {
    if (!/^[A-Za-z0-9._@-]{2,64}$/.test(userName ?? '')) throw new Error('A user name is 2 to 64 letters, digits or . _ @ -');
    if (!ROLES[role]) throw new Error(`role is one of ${Object.keys(ROLES).join(', ')}`);
    if (typeof password !== 'string' || password.length < 8) throw new Error('A password has 8 characters at least');
    if (this.get(userName)) throw new Error(`There is a user ${userName} already`);
    if (email && this.findByEmail(email)) throw new Error(`There is a user with ${email} already`);
    this.db.prepare('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(userName, name ?? userName, email ?? null, role,
      employeeId, JSON.stringify(ROLES[role]), hash(password), new Date().toISOString());
    return this.get(userName);
  }

  /** A change of name, email, role (and with it the groups) or password. */
  update(userName, { name, email, role, employeeId, password }) {
    const user = this.get(userName);
    if (!user) throw new Error(`No user ${userName}`);
    if (role !== undefined && !ROLES[role]) throw new Error(`role is one of ${Object.keys(ROLES).join(', ')}`);
    if (password !== undefined && (typeof password !== 'string' || password.length < 8)) throw new Error('A password has 8 characters at least');
    const next = { ...user, ...(name !== undefined && { name }), ...(email !== undefined && { email }), ...(employeeId !== undefined && { employeeId }) };
    const groups = role !== undefined ? ROLES[role] : user.userGroups;
    this.db.prepare('UPDATE users SET name = ?, email = ?, role = ?, employeeId = ?, userGroups = ? WHERE userName = ?')
      .run(next.name, next.email, role ?? user.role, next.employeeId, JSON.stringify(groups), userName);
    if (password !== undefined) this.db.prepare('UPDATE users SET password = ? WHERE userName = ?').run(hash(password), userName);
    return this.get(userName);
  }

  remove(userName) {
    return this.db.prepare('DELETE FROM users WHERE userName = ?').run(String(userName)).changes > 0;
  }

  /** express-session's store: the sessions in the same file. */
  sessionStore() {
    const db = this.db;
    class Store extends session.Store {
      get(sid, done) {
        try {
          const row = db.prepare('SELECT data, expires FROM sessions WHERE sid = ?').get(sid);
          done(null, row && row.expires > Date.now() ? JSON.parse(row.data) : null);
        } catch (error) { done(error); }
      }
      set(sid, data, done) {
        try {
          const expires = data.cookie?.expires ? new Date(data.cookie.expires).getTime() : Date.now() + 8 * 3600_000;
          db.prepare('INSERT INTO sessions VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires = excluded.expires')
            .run(sid, JSON.stringify(data), expires);
          done?.(null);
        } catch (error) { done?.(error); }
      }
      touch(sid, data, done) { this.set(sid, data, done); }
      destroy(sid, done) {
        try { db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid); done?.(null); } catch (error) { done?.(error); }
      }
    }
    // the expired ones go, now and then
    setInterval(() => db.prepare('DELETE FROM sessions WHERE expires <= ?').run(Date.now()), 10 * 60_000).unref();
    return new Store();
  }

  close() {
    this.db.close();
  }
}
