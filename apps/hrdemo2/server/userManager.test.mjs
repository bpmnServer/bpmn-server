// The HR application's sign-in, users and passwords (server/userManager.js): with READ_ONLY=true (a public demo,
// docs/docs/environments.md#read-only), its users and passwords can't be changed; signing in still works.
//   npm run test:server
import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { HrUserManager } from './userManager.js';
import { HrUsers, demoPassword } from './users.js';

let server, base;
test.before(async () => {
    process.env.SESSION_SECRET ??= 'a test secret';
    const app = express();
    const manager = new HrUserManager({ users: new HrUsers(':memory:') });
    manager.init(app);
    manager.setup(app);
    await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
    base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => { server?.closeAllConnections?.(); server?.close(); delete process.env.READ_ONLY; setImmediate(() => process.exit(0)); });

/** Signed in as one of the demo's accounts: the session's cookie. */
async function signIn(userName, password = demoPassword()) {
    const res = await fetch(`${base}/api/hr/session`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ userName, password }) });
    assert.equal(res.status, 200, await res.clone().text());
    return res.headers.get('set-cookie').split(';')[0];
}
const call = (cookie, method, url, body) => fetch(base + url, { method, headers: { cookie, 'content-type': 'application/json' }, body: body && JSON.stringify(body) });

test('READ_ONLY=true: no user added, changed or removed, no password changed; signing in still works', async () => {
    process.env.READ_ONLY = 'true';
    const admin = await signIn('admin');
    for (const [method, url, body] of [
        ['POST', '/api/hr/users', { userName: 'visitor', name: 'V', email: 'v@x.com', role: 'Employee', password: 'Another-pass-1' }],
        ['PUT', '/api/hr/users/david.kim', { role: 'HR Administrator' }],
        ['DELETE', '/api/hr/users/david.kim'],
        ['PUT', '/api/hr/session/password', { current: demoPassword(), password: 'Another-pass-1' }],
    ]) {
        const res = await call(admin, method, url, body);
        assert.equal(res.status, 403, `${method} ${url}`);
        assert.match((await res.json()).error, /read-only/);
    }
    assert.ok(await signIn('admin'), 'the password is as it was');
});

test('without it: an administrator manages the users, anyone changes their own password', async () => {
    delete process.env.READ_ONLY;
    const admin = await signIn('admin');
    assert.equal((await call(admin, 'PUT', '/api/hr/session/password', { current: demoPassword(), password: 'Another-pass-1' })).status, 200);
    assert.ok(await signIn('admin', 'Another-pass-1'));
});
