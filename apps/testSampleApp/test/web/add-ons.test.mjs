// @features: add-ons, integration-page
// The add-ons, as the web app has them (docs/design/add-ons.md): app-config.json says which are on. With none, the
// pages and the editor offer none of their parts: no Notifications in the menu, no Policies cards on the Settings page,
// no Test or History tab, and the editor is told which are on (its add-ons' modules are not loaded).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startWebApp, why } from '../support/webApp.mjs';

let web, admin;
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-web-addons-'));
const optionsOf = page => JSON.parse(/<script id="modeler-options" type="application\/json">([^<]*)<\/script>/.exec(page)[1]);

test.before(async () => {
    // every add-on off, before the server starts
    fs.writeFileSync(path.join(dir, 'app-config.json'), JSON.stringify({ addOns: [] }));
    web = await startWebApp({ envFile: path.join(dir, '.env') });
    admin = await web.login('admin');
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('none on: the menu has no Notifications; on the Settings page each add-on\'s area is off; the roles are there', async () => {
    const home = await admin.get('/dashboard');
    assert.equal(home.status, 200, why(home));
    assert.ok(!home.text.includes('href="/dashboard/notifications"'), 'Notifications are the Notifications add-on\'s');
    const settings = (await admin.get('/dashboard/settings')).text;
    // an add-on's area is there, marked off, with nothing of what it has (its policies) while it is off
    const card = settings.split('data-addon="assignment">')[1].split('Set up')[0];
    assert.match(card, />off</, 'its card says it is off');
    assert.doesNotMatch(card, /polic/);
    const area = (await admin.get('/dashboard/settings/assignment')).text;
    assert.match(area, /Its settings are kept while it is off/);
    assert.doesNotMatch(area, /<dt>Assignment policies<\/dt>/);
    // the roles are the server's: their area whichever add-ons are on
    assert.ok(settings.includes('<a class="integration-card" href="/dashboard/settings/roles" id="roles">'));
    assert.match((await admin.get('/dashboard/settings/roles')).text, /<dt>Roles<\/dt>/);
    // the Policies add-on, before 3.7.5: its area now Assignment's
    const old = await admin.get('/dashboard/settings/policies');
    assert.equal(old.status, 301);
    assert.equal(old.location, '/dashboard/settings/assignment');
    for (const name of ['assignment', 'notification', 'security', 'labels', 'forms', 'modeling'])
        assert.match(settings.split(`data-addon="${name}">`)[1].split('Set up')[0], />off</, `${name} off`);
});

test('none on: the editor is told so, and has no Test or History tab', async () => {
    const model = fs.readdirSync(web.definitionsPath).find(f => f.endsWith('.bpmn')).slice(0, -'.bpmn'.length);
    const page = await admin.get('/model/edit/' + encodeURIComponent(model));
    assert.equal(page.status, 200, why(page));
    const options = optionsOf(page.text);
    assert.deepEqual(options.addOns, []);
    assert.deepEqual(options.manifests.map(m => m.name), ['assignment', 'notification', 'security', 'labels', 'forms', 'modeling'], 'every one\'s manifest, for the report');
    assert.ok(!page.text.includes('id="js-tab-test"'), 'no Test tab');
    assert.ok(!page.text.includes('id="js-tab-history"'), 'no History tab: no versions kept');
});

test('none on: Design and the guide show no policies, their pages are not there; the roles are, on Admin', async () => {
    const design = await admin.get('/dashboard/design');
    assert.equal(design.status, 200, why(design));
    assert.ok(!design.text.includes('id="policies"'), 'no Policies section on Design');
    const adminPage = await admin.get('/dashboard/admin');
    assert.equal(adminPage.status, 200, why(adminPage));
    assert.ok(adminPage.text.includes('id="roles"'), 'the roles on Admin: the server\'s');
    for (const url of ['/model/policy/Any', '/model/security-policy/Any', '/model/notification-policy/Any', '/model/policies', '/model/policies?kind=security', '/dashboard/notifications'])
        assert.equal((await admin.get(url)).status, 404, `${url}: its add-on's`);
    assert.notEqual((await admin.post('/dashboard/admin/roles', { name: 'Clerk' })).status, 404, 'roles can be added');
});
