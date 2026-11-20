// @features: add-ons
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

test('none on: the menu has no Notifications; the Settings page no Policies cards, every add-on off', async () => {
    const home = await admin.get('/dashboard');
    assert.equal(home.status, 200, why(home));
    assert.ok(!home.text.includes('href="/dashboard/notifications"'), 'Notifications are the Policies add-on\'s');
    const settings = (await admin.get('/dashboard/settings')).text;
    assert.ok(!settings.includes('href="/dashboard/settings/policies"'), 'no Policies card');
    assert.ok(!settings.includes('href="/dashboard/settings/notifications"'));
    for (const name of ['policies', 'labels', 'forms', 'modeling'])
        assert.match(settings.split(`data-addon="${name}"`)[1].split('</tr>')[0], />off</, `${name} off`);
});

test('none on: the editor is told so, and has no Test or History tab', async () => {
    const model = fs.readdirSync(web.definitionsPath).find(f => f.endsWith('.bpmn')).slice(0, -'.bpmn'.length);
    const page = await admin.get('/model/edit/' + encodeURIComponent(model));
    assert.equal(page.status, 200, why(page));
    const options = optionsOf(page.text);
    assert.deepEqual(options.addOns, []);
    assert.deepEqual(options.manifests.map(m => m.name), ['policies', 'labels', 'forms', 'modeling'], 'every one\'s manifest, for the report');
    assert.ok(!page.text.includes('id="js-tab-test"'), 'no Test tab');
    assert.ok(!page.text.includes('id="js-tab-history"'), 'no History tab: no versions kept');
});
