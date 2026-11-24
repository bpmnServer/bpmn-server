// @features: integration-page
// The Settings page (/dashboard/settings, routes/integration.ts): an area for each part of the server, then one for
// each add-on (its manifest's settings, on or off), each with its state and its settings. An administrator changes
// every setting, a designer the design-side ones, nobody else opens it.
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

test('administrators and designers open it, with every area: the server\'s, then each add-on\'s; an end user may not', async () => {
    assert.equal((await staff.get('/dashboard/settings')).status, 403);
    for (const who of [admin, designer]) {
        const res = await who.get('/dashboard/settings');
        assert.equal(res.status, 200, why(res));
        // the overview: a card for each point, saying what it has in a few words, and linking to its page
        for (const id of ['roles', 'application', 'connectors', 'api', 'models'])
            assert.ok(res.text.includes(`<a class="integration-card" href="/dashboard/settings/${id}" id="${id}">`), `${who.userName} sees ${id}`);
        // an add-on's card: whether it is on (read only), its title linking to its area, where it is turned on or off;
        // Extended Forms is part of Model Options, and AI Agents an add-on
        for (const id of ['assignment', 'notification', 'security', 'labels', 'modeling', 'ai'])
            assert.match(res.text, new RegExp(`<div class="integration-card" id="${id}" data-addon="${id}"><h2><span class="integration-state is-on"[^>]*>●</span><a href="/dashboard/settings/${id}">`), `${who.userName} sees ${id}`);
        assert.ok(!res.text.includes('data-addon="forms"'), 'Extended Forms: no card of its own');
        const [server, addOns] = res.text.split(/<h2 class="integration-group"[^>]*>Add-ons<\/h2>/);
        // the server's own Security area is id="secure"; the Access Control add-on is id="security", below
        assert.ok(server.includes('id="application"') && server.includes('id="roles"') && server.includes('id="secure"') && !server.includes('id="security"'), 'the server\'s areas first');
        assert.ok(addOns.includes('id="security"') && !addOns.includes('id="application"'), 'then the add-ons\'');
        // a card says what its area is, in a few words; what it has is on its page (the delegate's name: below)
        assert.doesNotMatch(res.text, /data-setting=/, 'no settings on the overview');
        assert.ok(!res.text.includes(API_KEY), 'the service key is not shown');
        // a point's page: what it has, its main settings, the rest under More settings
        const app = await who.get('/dashboard/settings/application');
        assert.equal(app.status, 200, why(app));
        assert.match(app.text, /<code>(TestDelegate|AppDelegate)<\/code>/);
        assert.match(app.text, /data-setting="APP_ENV"[\s\S]*<summary>More settings \(1\)<\/summary>[\s\S]*data-setting="APP_ENV_LABEL"/);
        assert.ok(!(await who.get('/dashboard/settings/secure')).text.includes(API_KEY), 'the service key is not shown');
    }
    // the menu has it for both; the page's address before 3.7.5 leads to it
    assert.ok((await designer.get('/dashboard')).text.includes('href="/dashboard/settings"'));
    const old = await admin.get('/dashboard/integration/api');
    assert.equal(old.status, 301);
    assert.equal(old.location, '/dashboard/settings/api');
});

test('a designer changes the design-side settings; they go to .env, applied on restart', async () => {
    await designer.get('/dashboard/settings');      // the page first, as a browser: its form's CSRF token
    const res = await designer.post('/dashboard/settings/models', { FORM_RULES: 'false' });
    assert.equal(res.status, 302, why(res));
    assert.match(messageOf(res), /Saved to \.env: FORM_RULES\. It applies when the server restarts/);
    // the Model History add-on's own setting, in its area
    const history = await designer.post('/dashboard/settings/modeling', { MODEL_HISTORY: '' });
    assert.match(messageOf(history), /Saved to \.env: MODEL_HISTORY\./);
    const text = envText();
    assert.match(text, /^FORM_RULES=false$/m);
    assert.doesNotMatch(text, /MODEL_HISTORY/, 'emptied: back to its default');
    assert.match(text, /# the server's settings/, 'the rest of .env is kept');
    assert.ok(fs.readFileSync(web.envFile + '.bak', 'utf8').includes('FORM_RULES=false'), 'the one before is kept');
    assert.equal(process.env.FORM_RULES, undefined, 'the running server is unchanged until it restarts');
    assert.equal(new URL(res.location, web.base).pathname, '/dashboard/settings/models', 'back to its page');
    const page = (await designer.get('/dashboard/settings/models')).text;
    assert.match(page, /data-setting="FORM_RULES"[\s\S]*?restart to apply/);
});

test('a designer may not change an administrator\'s setting, even by posting it', async () => {
    const before = envText();
    const res = await designer.post('/dashboard/settings/secure', { SCRIPT_SANDBOX: 'true' });
    assert.match(messageOf(res), /Nothing saved\. .*SCRIPT_SANDBOX.*not changed here/);
    assert.equal(envText(), before);
    assert.equal((await staff.post('/dashboard/settings/models', { FORM_RULES: 'true' })).status, 403);
});

test('an administrator: values checked against the schema; a secret generated, never shown; the environment\'s left alone', async () => {
    let res = await admin.post('/dashboard/settings/secure', { API_RATE_LIMIT: 'lots' });
    assert.match(messageOf(res), /Nothing saved\. .*API_RATE_LIMIT.*a number/);

    res = await admin.post('/dashboard/settings/connectors', { 'generate:SECRETS_KEY': 'on' });
    assert.match(messageOf(res), /Saved to \.env: SECRETS_KEY/);
    const key = envText().match(/^SECRETS_KEY=([0-9a-f]+)$/m)?.[1];
    assert.equal(key?.length, 48, envText());
    assert.ok(!(await admin.get('/dashboard/settings/connectors')).text.includes(key), 'the new key is not shown');

    // API_KEY is the environment's here (not in .env): shown as set, not changed
    const page = (await admin.get('/dashboard/settings/secure')).text;
    assert.match(page, /data-setting="API_KEY"[\s\S]*?set outside \.env/);
    res = await admin.post('/dashboard/settings/secure', { API_KEY: 'another-key-of-at-least-24-chars' });
    assert.match(messageOf(res), /Nothing saved\. .*API_KEY.*not changed here/);
    assert.doesNotMatch(envText(), /^API_KEY=/m);

    assert.equal((await admin.post('/dashboard/settings/nowhere', {})).status, 404);
    assert.equal((await admin.get('/dashboard/settings/nowhere')).status, 404);
});

const cardOf = (page, name) => page.split(`data-addon="${name}">`)[1].split('Set up')[0];

test('the add-ons: each card says on or off; an administrator turns one off on its page, saved to app-config.json', async () => {
    const area = async (who = admin) => (await who.get('/dashboard/settings/security')).text;
    let page = (await admin.get('/dashboard/settings')).text;
    assert.match(cardOf(page, 'security'), /aria-label="On"/, 'on: no app-config.json');
    assert.doesNotMatch(cardOf(page, 'security'), /Turn off/, 'the card is read only: the switch is on its page');
    assert.match(await area(), />on<[\s\S]*?action="\/dashboard\/settings\/add-ons\/security"[\s\S]*?Turn off/, 'its switch on its page');
    assert.doesNotMatch(await area(designer), /Turn off/, 'a designer has no switch');
    // a designer may not change them, even by posting
    let res = await designer.post('/dashboard/settings/add-ons/security', { on: 'false' });
    assert.match(messageOf(res), /Only an administrator/);
    assert.ok(!fs.existsSync(web.appConfigFile));
    // off: saved, the others kept on, and the running server unchanged until it restarts
    res = await admin.post('/dashboard/settings/add-ons/security', { on: 'false' });
    assert.match(messageOf(res), /Saved to app-config\.json: security off\. It applies when the server restarts/);
    assert.deepEqual(JSON.parse(fs.readFileSync(web.appConfigFile, 'utf8')).addOns.sort(), ['ai', 'assignment', 'forms', 'labels', 'modeling', 'notification']);
    assert.match(await area(), />on<[\s\S]*?restart to apply[\s\S]*?Turn on/);
    // and on again: the file's other settings kept
    fs.writeFileSync(web.appConfigFile, JSON.stringify({ addOns: [], mine: 1 }));
    res = await admin.post('/dashboard/settings/add-ons/security', { on: 'true' });
    assert.deepEqual(JSON.parse(fs.readFileSync(web.appConfigFile, 'utf8')), { mine: 1, addOns: ['security'] });
    assert.doesNotMatch(await area(), /restart to apply/, 'as the server runs: nothing to restart for');
    assert.equal((await admin.post('/dashboard/settings/add-ons/nothing', { on: 'true' })).status, 404);
    // all at once, as before (an application's own page may post it)
    res = await admin.post('/dashboard/settings/add-ons', { 'addon:security': 'on' });
    assert.deepEqual(JSON.parse(fs.readFileSync(web.appConfigFile, 'utf8')), { mine: 1, addOns: ['security'] });
});

test('each add-on its own area: its manifest\'s settings, on or off, what it has', async () => {
    await admin.get('/dashboard/settings');
    const notices = await admin.get('/dashboard/settings/notification');
    assert.equal(notices.status, 200, why(notices));
    for (const name of ['NOTIFICATIONS', 'EMAIL_ENABLE'])
        assert.ok(notices.text.includes(`data-setting="${name}"`), `the Notifications add-on's ${name}`);
    assert.ok(!notices.text.includes('data-setting="SECURITY_POLICY"'), 'the Security add-on\'s, not this one\'s');
    assert.match(notices.text, />on</);
    assert.match(notices.text, /<dt>Notification policies<\/dt>[\s\S]*<dt>Delivered by<\/dt>/, 'its policies, and the notifications they send');
    const security = (await admin.get('/dashboard/settings/security')).text;
    assert.ok(security.includes('data-setting="SECURITY_POLICY"'));
    assert.match(security, /<dt>Security policies<\/dt>/);
    assert.match((await admin.get('/dashboard/settings/assignment')).text, /<dt>Assignment policies<\/dt>/);
    assert.ok(!(await admin.get('/dashboard/settings/application')).text.includes('data-setting="NOTIFICATIONS"'), 'not the server\'s');
    const res = await admin.post('/dashboard/settings/notification', { NOTIFICATIONS: 'record' });
    assert.match(messageOf(res), /Saved to \.env: NOTIFICATIONS\./);
    assert.match(envText(), /^NOTIFICATIONS=record$/m);
    // its doc page, in a new tab: on its area and its card
    assert.match(notices.text, /<a class="integration-docs" href="https:\/\/bpmnserver\.github\.io\/bpmn-server\/add-ons\/notification\/" target="_blank" rel="noopener">/);
    assert.match(cardOf((await admin.get('/dashboard/settings')).text, 'labels'), /href="https:\/\/bpmnserver\.github\.io\/bpmn-server\/add-ons\/labels\/" target="_blank"/);
    // its card says what it is in a few words, before the models using it
    assert.match(cardOf((await admin.get('/dashboard/settings')).text, 'security'), /<p class="integration-brief">Who may see a case, and what they may do in it\.<\/p>/);
    // an add-on with no settings of its own still has its area
    assert.match((await admin.get('/dashboard/settings/labels')).text, /No settings of its own/);
    // Notifications was an area of its own before, then the Policies add-on's: the Notifications add-on's now
    for (const [was, now] of [['notifications', 'notification'], ['policies', 'assignment']]) {
        const old = await admin.get('/dashboard/settings/' + was);
        assert.equal(old.status, 301);
        assert.equal(old.location, '/dashboard/settings/' + now);
    }
});

// The Security area (docs/design/security-profiles.md, the brief's four sections): the settings that were spread over
// the other areas or were only in .env, and the effective configuration said in plain words.
test('the Security area: the three questions, with a warning for a combination that is not safe', async () => {
    const page = (await admin.get('/dashboard/settings/secure')).text;
    // who may reach it, what each may do, the credentials that are not people, what a model may run
    for (const name of ['REQUIRE_AUTHENTICATION', 'ENFORCE_SECURITY', 'DISABLE_ADMIN', 'DISABLE_DESIGN',
        'SECURITY_POLICY', 'API_KEY', 'AI_ACCESS', 'SCRIPT_SANDBOX', 'TIMERS', 'DEMO_MODE'])
        assert.ok(page.includes(`data-setting="${name}"`), `${name} is on the Security page`);
    // and they are no longer on the areas they were spread over
    const models = (await admin.get('/dashboard/settings/models')).text;
    assert.ok(!models.includes('data-setting="SCRIPT_SANDBOX"'), "what a model may run is the Security area's");
    const application = (await admin.get('/dashboard/settings/application')).text;
    assert.ok(!application.includes('data-setting="READ_ONLY"'), "what people may do is the Security area's");

    // the overview's summary: this server signs people in, so it is not the open one
    const overview = (await admin.get('/dashboard/settings')).text;
    const at = overview.indexOf('id="secure"');
    const card = overview.slice(at, at + 900);
    assert.match(card, /Sign-in required/, 'it says who may reach it');
    assert.doesNotMatch(card, /anyone reaching this server administers it/, 'no warning: sign-in is required here');
});
