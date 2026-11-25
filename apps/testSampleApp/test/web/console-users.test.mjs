// @features: console
// The console's user commands, run as a person runs them (npm run cli -- lu; npm run cli -- spw <user> <password>), on a
// database of their own: `lu` lists the users and `spw` sets a password. Users are kept on the engine's store, so the
// commands work on any database that outlives the console: a SQLite file and a MongoDB are tried here; a memory
// database ends with the console that made it, so there is nothing for a second process to list or change.
//
// An application that manages its own users (the HR demo) has none of bpmn-web's for them to show: they say so.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';

const APPS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-cli-users-'));
const MONGO = process.env.TEST_MONGO_URL ?? 'mongodb://localhost:27017';
const mongoDatabase = `cli-users-${randomUUID().slice(0, 8)}`;

/** Whether a MongoDB answers: the commands are tried on it when there is one. */
async function mongoAnswers() {
    const client = new MongoClient(MONGO, { serverSelectionTimeoutMS: 2500 });
    try { await client.connect(); await client.db('admin').command({ ping: 1 }); return true; }
    catch { return false; }
    finally { await client.close().catch(() => { }); }
}
const hasMongo = await mongoAnswers();

test.after(async () => {
    fs.rmSync(work, { recursive: true, force: true });
    if (hasMongo) {
        const client = new MongoClient(MONGO);
        await client.connect();
        await client.db(mongoDatabase).dropDatabase();       // the test's own, named above
        await client.close();
    }
});

/** `npm run cli -- <args>` of an application, on the database given. */
function cli(app, database, args, env = {}) {
    const run = spawnSync(process.execPath, ['--import', 'tsx', 'index.ts', '--cli', ...args], {
        cwd: path.join(APPS, app), encoding: 'utf8', timeout: 240000,
        env: { ...process.env, NODE_OPTIONS: '--no-warnings=ExperimentalWarning', PORT: '0', ADMIN_PASSWORD: 'Cli-test-1', ...database, ...env },
    });
    return { status: run.status, out: `${run.stdout}${run.stderr}` };
}

/** The databases the commands are tried on, each with how to reach it and how to read a user back. */
const STORES = [
    {
        kind: 'SQLite',
        file: path.join(work, 'sample.sqlite'),
        get env() { return { MONGO_DB_URL: '', DATABASE: `sqlite:${this.file}` }; },
        async user(userName) {
            const db = new DatabaseSync(this.file);
            try { return db.prepare('select doc from users').all().map(r => JSON.parse(r.doc)).find(u => u.userName === userName); }
            finally { db.close(); }
        },
    },
    {
        kind: 'MongoDB',
        skip: hasMongo ? false : `no MongoDB answers at ${MONGO}`,
        get env() { return { DATABASE: '', MONGO_DB_URL: `${MONGO.replace(/\/$/, '')}/${mongoDatabase}` }; },
        async user(userName) {
            const client = new MongoClient(MONGO);
            await client.connect();
            try { return await client.db(mongoDatabase).collection('users').findOne({ userName }); }
            finally { await client.close(); }
        },
    },
];

for (const store of STORES) {
    test(`${store.kind}: lu lists the users of the database: the administrator a new server makes`, { skip: store.skip }, () => {
        const listed = cli('testSampleApp', store.env, ['lu']);
        assert.equal(listed.status, 0, listed.out);
        assert.match(listed.out, /listing Users/);
        assert.match(listed.out, /admin\s+admin@example\.com\s+ADMIN/);
    });

    test(`${store.kind}: spw sets the password in the database: the new one matches, the old one does not`, { skip: store.skip }, async () => {
        const before = await store.user('admin');
        assert.ok(await bcrypt.compare('Cli-test-1', before.password), 'the password the server made it with');
        const changed = cli('testSampleApp', store.env, ['spw', 'admin', 'New-pass-2']);
        assert.equal(changed.status, 0, changed.out);
        assert.match(changed.out, /Password set for admin\./, 'it says it did');
        const after = await store.user('admin');
        assert.ok(await bcrypt.compare('New-pass-2', after.password), 'the new password');
        assert.equal(await bcrypt.compare('Cli-test-1', after.password), false, 'not the old one');
        assert.deepEqual(after.userGroups, before.userGroups, 'its groups are as they were');
        assert.equal(after.password.startsWith('New-pass-2'), false, 'stored hashed, not as typed');
    });

    test(`${store.kind}: spw for a user that does not exist says so, and changes nothing`, { skip: store.skip }, async () => {
        const before = (await store.user('admin')).password;
        const unknown = cli('testSampleApp', store.env, ['spw', 'nosuchuser', 'Whatever-1']);
        assert.match(unknown.out, /User does not exist/);
        assert.equal(unknown.status, 1, 'a script can tell: it exits 1');
        assert.doesNotMatch(unknown.out, /Password set/);
        assert.ok(!(await store.user('nosuchuser')), 'no user is made');
        assert.equal((await store.user('admin')).password, before, 'nobody else changes');
    });

    test(`${store.kind}: lu after spw: the same users`, { skip: store.skip }, () => {
        assert.match(cli('testSampleApp', store.env, ['lu']).out, /admin\s+admin@example\.com\s+ADMIN/);
    });
}

// ---- an application with its own users

test('in an application with its own users (the HR demo) lu and spw say so, and spw is a failure', () => {
    const env = { HR_DATA: path.join(work, 'hr.sqlite'), ADMIN_PASSWORD: '' };
    const database = { MONGO_DB_URL: '', DATABASE: `sqlite:${path.join(work, 'hr-engine.sqlite')}` };
    const listed = cli('hrdemo', database, ['lu'], env);
    assert.equal(listed.status, 0, listed.out);
    assert.match(listed.out, /manages its own users/);
    assert.doesNotMatch(listed.out, /users:\n name/, 'it does not list bpmn-web\'s empty store as if it were theirs');
    const changed = cli('hrdemo', database, ['spw', 'david.kim', 'New-pass-9'], env);
    assert.equal(changed.status, 1, changed.out);
    assert.match(changed.out, /manages its own users/);
    assert.doesNotMatch(changed.out, /Password set|User does not exist/);
});
