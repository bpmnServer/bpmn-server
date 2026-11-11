// @features: menu-workbench
// With sign-in off (REQUIRE_AUTHENTICATION=false) every page has the same menu: Workbench and the Dashboard drop-down,
// no Sign in or Create account (there is nothing to sign in to), and no user's menu with a Sign out, whatever `user`
// the page was given. The menu goes by the signed-in account (UserManager: res.locals.account, signInOff).
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp } from '../support/webApp.mjs';

let web, instanceId;
test.before(async () => {
    web = await startWebApp({ env: { REQUIRE_AUTHENTICATION: 'false', ENFORCE_SECURITY: 'false' } });
    instanceId = (await web.bpmnServer.engine.start('leave-request', {})).id;
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const page = async path => {
    const res = await fetch(web.base + path);
    assert.equal(res.status, 200, path);
    return res.text();
};

test('every page: Workbench and the Dashboard; nothing about signing in', async () => {
    for (const path of ['/', '/dashboard', '/dashboard/design', '/dashboard/admin', `/instanceDetails?id=${instanceId}`, '/docs', '/model/list']) {
        const html = await page(path);
        assert.match(html, /href="\/">Workbench</, path);
        assert.match(html, /href="\/dashboard">My work</, path);
        assert.match(html, /href="\/dashboard\/design">Design</, path);
        assert.match(html, /href="\/dashboard\/admin">Administration</, path);
        assert.doesNotMatch(html, /href="\/login"/, path);
        assert.doesNotMatch(html, /href="\/signup"/, path);
        assert.doesNotMatch(html, /href="\/logout"/, path);
    }
});

test('the editors: the same places, the logo from the application itself', async () => {
    for (const path of ['/model/edit/leave-request']) {
        const html = await page(path);
        assert.match(html, /href="\/dashboard\/design">Design</, path);
        assert.doesNotMatch(html, /href="\/logout"/, path);
        assert.match(html, /src="\/images\/omniworkflow_icon.png"/, path);
        assert.doesNotMatch(html, /demo\.omniworkflow\.com/, path);
    }
});

test('no account with sign-in off: a page that says so, with the menu', async () => {
    for (const path of ['/account', '/account/edit/x']) {
        const res = await fetch(web.base + path, { headers: { accept: 'text/html' } });
        assert.equal(res.status, 404, path);
        const html = await res.text();
        assert.match(html, /Sign-in is off on this server/, path);
        assert.match(html, /href="\/dashboard\/design">Design</, path);
    }
    const post = await fetch(web.base + '/account/profile', { method: 'POST' });
    assert.notEqual(post.status, 500);
});

test('the pages work with sign-in off', async () => {
    for (const path of ['/', '/home'])
        assert.match(await page(path), /href="\/dashboard\/design">Design</, path);
});

test('the old list page has no old title', async () => {
    assert.doesNotMatch(await page('/model/list'), /Demo WF2/);
});
