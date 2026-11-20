// @features: integration-page
// The Integration page (/dashboard/settings, routes/integration.ts): one section per integration point, its state
// and its settings. An administrator changes every setting, a designer the design-side ones, nobody else opens it.
// A change goes to the server's .env (here a file of the test's own), the one before kept as .env.bak; a secret is
// never shown; a setting the environment gives is not changed here.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { startWebApp, why, API_KEY } from '../support/webApp.mjs';

let web, admin, designer, staff;
const envText = () => fs.existsSync(web.envFile) ? fs.readFileSync(web.envFile, 'utf8') : '';
const messageOf = res => decodeURIComponent(new URL(res.location, web.base).searchParams.get('message') ?? '');

test.before(async () => {
    web = await startWebApp();
    fs.writeFileSync(web.envFile, '# the server\'s settings\nMODEL_HISTORY=true\n');
    [admin, designer, staff] = await Promise.all([web.login('admin'), web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

test('administrators and designers open it, with every integration point; an end user may not', async () => {
    assert.equal((await staff.get('/dashboard/settings')).status, 403);
    for (const who of [admin, designer]) {
        const res = await who.get('/dashboard/settings');
        assert.equal(res.status, 200, why(res));
        // the overview: a card for each point, saying what it has in a few words, and linking to its page
        for (const id of ['application', 'connectors', 'policies', 'notifications', 'api', 'forms', 'ai'])
            assert.ok(res.text.includes(`<a class="integration-card" href="/dashboard/settings/${id}" id="${id}">`), `${who.userName} sees ${id}`);
        assert.match(res.text, /Delegate (TestDelegate|AppDelegate), \d+ functions for scripts/, 'the delegate is named, as the engine has it');
        assert.doesNotMatch(res.text, /data-setting=/, 'no settings on the overview');
        assert.ok(!res.text.includes(API_KEY), 'the service key is not shown');
        // a point's page: what it has, its main settings, the rest under More settings
        const app = await who.get('/dashboard/settings/application');
        assert.equal(app.status, 200, why(app));
        assert.match(app.text, /<code>(TestDelegate|AppDelegate)<\/code>/);
        assert.match(app.text, /data-setting="APP_ENV"[\s\S]*<summary>More settings \(1\)<\/summary>[\s\S]*data-setting="APP_ENV_LABEL"/);
        assert.ok(!(await who.get('/dashboard/settings/api')).text.includes(API_KEY), 'the service key is not shown');
    }
    // the menu has it for both; the page's address before 3.7.5 leads to it
    assert.ok((await designer.get('/dashboard')).text.includes('href="/dashboard/settings"'));
    const old = await admin.get('/dashboard/integration/api');
    assert.equal(old.status, 301);
    assert.equal(old.location, '/dashboard/settings/api');
});

test('a designer changes the design-side settings; they go to .env, applied on restart', async () => {
    await designer.get('/dashboard/settings');      // the page first, as a browser: its form's CSRF token
    const res = await designer.post('/dashboard/settings/forms', { FORM_RULES: 'false', MODEL_HISTORY: '' });
    assert.equal(res.status, 302, why(res));
    assert.match(messageOf(res), /Saved to \.env: FORM_RULES, MODEL_HISTORY\. They apply when the server restarts/);
    const text = envText();
    assert.match(text, /^FORM_RULES=false$/m);
    assert.doesNotMatch(text, /MODEL_HISTORY/, 'emptied: back to its default');
    assert.match(text, /# the server's settings/, 'the rest of .env is kept');
    assert.ok(fs.readFileSync(web.envFile + '.bak', 'utf8').includes('MODEL_HISTORY=true'), 'the one before is kept');
    assert.equal(process.env.FORM_RULES, undefined, 'the running server is unchanged until it restarts');
    assert.equal(new URL(res.location, web.base).pathname, '/dashboard/settings/forms', 'back to its page');
    const page = (await designer.get('/dashboard/settings/forms')).text;
    assert.match(page, /data-setting="FORM_RULES"[\s\S]*?restart to apply/);
    assert.match((await designer.get('/dashboard/settings')).text, /id="forms">[\s\S]*?restart to apply/, 'the overview says so too');
});

test('a designer may not change an administrator\'s setting, even by posting it', async () => {
    const before = envText();
    const res = await designer.post('/dashboard/settings/forms', { SCRIPT_SANDBOX: 'true' });
    assert.match(messageOf(res), /Nothing saved\. .*SCRIPT_SANDBOX.*not changed here/);
    assert.equal(envText(), before);
    assert.equal((await staff.post('/dashboard/settings/forms', { FORM_RULES: 'true' })).status, 403);
});

test('an administrator: values checked against the schema; a secret generated, never shown; the environment\'s left alone', async () => {
    let res = await admin.post('/dashboard/settings/api', { API_RATE_LIMIT: 'lots' });
    assert.match(messageOf(res), /Nothing saved\. .*API_RATE_LIMIT.*a number/);

    res = await admin.post('/dashboard/settings/connectors', { 'generate:CONNECTORS_KEY': 'on', CONNECTORS_ALLOW_HOSTS: 'api.example.com' });
    assert.match(messageOf(res), /Saved to \.env: CONNECTORS_KEY, CONNECTORS_ALLOW_HOSTS/);
    const key = envText().match(/^CONNECTORS_KEY=([0-9a-f]+)$/m)?.[1];
    assert.equal(key?.length, 48, envText());
    assert.ok(!(await admin.get('/dashboard/settings/connectors')).text.includes(key), 'the new key is not shown');

    // API_KEY is the environment's here (not in .env): shown as set, not changed
    const page = (await admin.get('/dashboard/settings/api')).text;
    assert.match(page, /data-setting="API_KEY"[\s\S]*?set outside \.env/);
    res = await admin.post('/dashboard/settings/api', { API_KEY: 'another-key-of-at-least-24-chars' });
    assert.match(messageOf(res), /Nothing saved\. .*API_KEY.*not changed here/);
    assert.doesNotMatch(envText(), /^API_KEY=/m);

    assert.equal((await admin.post('/dashboard/settings/nowhere', {})).status, 404);
    assert.equal((await admin.get('/dashboard/settings/nowhere')).status, 404);
});

test('the add-ons: each on or off, the models using it; an administrator turns one off, saved to app-config.json', async () => {
    let page = (await admin.get('/dashboard/settings')).text;
    assert.match(page, /<section class="dash-card wide" id="add-ons">/);
    assert.match(page, /data-addon="policies"[\s\S]*?Policies[\s\S]*?>on</, 'on: no app-config.json');
    // a designer sees them, and may not change them
    let res = await designer.post('/dashboard/settings/add-ons', {});
    assert.match(messageOf(res), /Only an administrator/);
    assert.ok(!fs.existsSync(web.appConfigFile));
    // off: saved, and the running server unchanged until it restarts
    res = await admin.post('/dashboard/settings/add-ons', {});
    assert.match(messageOf(res), /Saved to app-config\.json: no add-ons on\. It applies when the server restarts/);
    assert.deepEqual(JSON.parse(fs.readFileSync(web.appConfigFile, 'utf8')), { addOns: [] });
    page = (await admin.get('/dashboard/settings')).text;
    assert.match(page.split('data-addon="policies"')[1].split('</tr>')[0], />on<[\s\S]*?restart to apply/);
    // and on again: the file's other settings kept
    fs.writeFileSync(web.appConfigFile, JSON.stringify({ addOns: [], mine: 1 }));
    res = await admin.post('/dashboard/settings/add-ons', { 'addon:policies': 'on' });
    assert.deepEqual(JSON.parse(fs.readFileSync(web.appConfigFile, 'utf8')), { mine: 1, addOns: ['policies'] });
    const row = (await admin.get('/dashboard/settings')).text.split('data-addon="policies"')[1].split('</tr>')[0];
    assert.doesNotMatch(row, /restart to apply/, 'as the server runs: nothing to restart for');
});
