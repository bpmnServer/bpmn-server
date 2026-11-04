// @features: users
// Administrators edit users, groups included (/account/edit/:id); the page acts on the user shown, never on
// the administrator signed in. A user's own profile can not change their groups.
import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { startWebApp, why } from '../support/webApp.mjs';

const WEB = path.resolve(import.meta.dirname, '..', '..', '..', 'packages', 'bpmn-web');

let web, admin, designer, staff, User;
test.before(async () => {
    web = await startWebApp();
    ({ default: User } = await import(pathToFileURL(path.join(WEB, 'dist', 'userAccess', 'models', 'User.js'))));
    [admin, designer, staff] = await Promise.all([web.login('admin'), web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const find = userName => User.findOne({ userName });

test('the edit page edits the user shown, groups included', async () => {
    const target = await find('staff');
    const page = await admin.get(`/account/edit/${target.id}`);
    assert.equal(page.status, 200, why(page));
    assert.match(page.text, /action="\/account\/edit"/);
    assert.match(page.text, /name="userGroups"[^>]*value="staff"/);
    assert.doesNotMatch(page.text, /action="\/account\/password"|action="\/account\/delete"/, 'nothing that acts on the administrator');

    const adminBefore = await find('admin');
    const res = await admin.post('/account/edit', { id: target.id, email: 'staff@test.local', name: 'Sam Staff', userGroups: 'staff, DESIGNER' });
    assert.equal(res.status, 302, why(res));
    assert.equal(res.location, `/account/edit/${target.id}`);

    const after = await find('staff');
    assert.deepEqual([...after.userGroups], ['staff', 'DESIGNER']);
    assert.equal(after.profile.name, 'Sam Staff');
    const adminAfter = await find('admin');
    assert.deepEqual([...adminAfter.userGroups], [...adminBefore.userGroups], 'the administrator is untouched');
    assert.equal(adminAfter.email, adminBefore.email);

    // a new group applies from the user's next sign-in
    const again = await web.login('staff');
    assert.equal((await again.get('/model/list')).status, 200, 'a designer now');
    await User.updateOne({ userName: 'staff' }, { $set: { userGroups: ['staff'] } });
});

test('a duplicate email or unknown user is reported, not an error', async () => {
    const target = await find('staff');
    let res = await admin.post('/account/edit', { id: target.id, email: 'admin@test.local', userGroups: 'staff' });
    assert.equal(res.status, 302, why(res));
    assert.equal(res.location, `/account/edit/${target.id}`);
    assert.equal((await find('staff')).email, 'staff@test.local');

    res = await admin.post('/account/edit', { id: '000000000000000000000000', email: 'x@test.local' });
    assert.equal(res.status, 302, why(res));
    assert.equal(res.location, '/admin');
});

test('only administrators edit users', async () => {
    const target = await find('staff');
    for (const client of [designer, staff]) {
        assert.equal((await client.get(`/account/edit/${target.id}`)).status, 403);
        assert.equal((await client.post('/account/edit', { id: target.id, email: 'staff@test.local', userGroups: 'ADMIN' })).status, 403);
    }
    assert.deepEqual([...(await find('staff')).userGroups], ['staff']);
});

test('your own profile shows your groups, read-only', async () => {
    const page = await staff.get('/account');
    assert.equal(page.status, 200, why(page));
    assert.match(page.text, /action="\/account\/profile"/);
    assert.match(page.text, /id="userGroups"[^>]*readonly/i);
    assert.doesNotMatch(page.text, /name="userGroups"/, 'not sent with the form');
    assert.match(page.text, /action="\/account\/password"/, 'your own password can be changed here');
});
