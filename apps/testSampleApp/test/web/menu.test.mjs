// @features: menu-workbench
// The one menu of every page (views/includes/menu.pug): Workbench first; Dashboard a drop-down for designers and
// administrators (My work, Design, Administration as their role allows), My work alone for everyone else; the
// editors carry the same places in their header (editorMenu.pug).
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why, PASSWORD } from '../support/webApp.mjs';

let web, admin, designer, staff;
test.before(async () => {
    web = await startWebApp();
    [admin, designer, staff] = await Promise.all([web.login('admin'), web.login('designer'), web.login('staff')]);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** The menu's links, in order: [text, href]. */
function menu(html) {
    const at = html.indexOf('app-menu');
    assert.ok(at > 0, 'the page has the menu');
    const part = html.slice(at, html.indexOf('</nav>', at) > 0 ? html.indexOf('</nav>', at) : at + 4000);
    return [...part.matchAll(/<a[^>]*href="([^"#][^"]*)"[^>]*>([^<]*)/g)].map(m => [m[2].replace(/&nbsp;/g, ' ').trim(), m[1]]);
}
const hrefs = html => menu(html).map(([, href]) => href);

test('an end user: Workbench, then My work alone (no Dashboard drop-down)', async () => {
    const page = await staff.get('/dashboard');
    assert.equal(page.status, 200, why(page));
    const links = hrefs(page.text);
    assert.deepEqual(links.slice(0, 2), ['/', '/dashboard']);
    assert.ok(!links.includes('/dashboard/design') && !links.includes('/dashboard/admin'));
    assert.doesNotMatch(page.text, />\s*Dashboard\s*<span class="caret"/);
});

test('the whole bar is the same, page by page: their own links are in the page', async () => {
    const bar = html => {
        const nav = html.slice(html.indexOf('<nav'), html.indexOf('</nav>'));
        return [...nav.matchAll(/<a[^>]*href="([^"#][^"]*)"/g)].map(m => m[1]);
    };
    const expected = bar((await admin.get('/dashboard')).text);
    assert.ok(expected.includes('/account'));
    const { instance } = await web.bpmnServer.engine.start('leave-request', {});
    for (const path of ['/', '/tasks', '/model/list', '/model/new', '/docs', '/account', '/admin', '/dashboard/design', '/dashboard/admin',
        '/instanceDetails?id=' + instance.id, '/executeInput/leave-request']) {
        const page = await admin.get(path);
        assert.equal(page.status, 200, path + ' ' + why(page));
        assert.deepEqual(bar(page.text), expected, path);
    }
    const old = bar((await admin.get('/model/editNoProp/leave-request')).text);
    assert.deepEqual(old.filter(href => !href.startsWith('javascript:')), expected, 'the classic modeler: the menu and its command');
});

test('a browser that is refused or lost still has the menu; a script gets the plain text', async () => {
    const opening = (cookie, path) => fetch(web.base + path, { headers: { accept: 'text/html', cookie } });
    for (const [client, path, status, message] of [
        [staff, '/model/list', 403, 'Designer permission required'],
        [staff, '/dashboard/admin', 403, 'Administrator permission required'],
        [admin, '/no-such-page', 404, 'There is no page /no-such-page'],
    ]) {
        const res = await opening(client.cookieHeader, path);
        assert.equal(res.status, status, path);
        const html = await res.text();
        assert.match(html, /class="[^"]*app-menu/, path);
        assert.ok(html.includes(message), path);
    }
    const script = await fetch(web.base + '/model/list', { headers: { cookie: staff.cookieHeader } });
    assert.equal(script.status, 403);
    assert.equal(await script.text(), 'Designer permission required');
});

test('the verification email can not be sent (no mail set up here): back to the account, not a failure', async () => {
    const res = await staff.get('/account/verify');
    assert.equal(res.status, 302, why(res));
    assert.equal(res.headers.get('location'), '/account');
});

test('the model list links to pages that exist', async () => {
    assert.doesNotMatch((await admin.get('/model/list')).text, /\/wf\//);
});

test('a designer: Dashboard is a drop-down with My work and Design; an administrator also has Administration', async () => {
    let links = hrefs((await designer.get('/dashboard')).text);
    assert.deepEqual(links.slice(0, 3), ['/', '/dashboard', '/dashboard/design']);
    assert.ok(!links.includes('/dashboard/admin'));
    links = hrefs((await admin.get('/dashboard')).text);
    assert.deepEqual(links.slice(0, 4), ['/', '/dashboard', '/dashboard/design', '/dashboard/admin']);
});

test('the same menu on the Workbench, a dashboard and an instance page; the editors have its places', async () => {
    const workbench = (await admin.get('/')).text;
    const dashboard = (await admin.get('/dashboard/admin')).text;
    const { instance } = await web.bpmnServer.engine.start('leave-request', {});
    const instancePage = (await admin.get('/instanceDetails?id=' + instance.id)).text;
    const first = page => hrefs(page).slice(0, 4);
    assert.deepEqual(first(workbench), first(dashboard));
    assert.deepEqual(first(instancePage), first(dashboard));
    const sections = workbench.indexOf('workbench-navigation');
    assert.ok(sections > workbench.indexOf('</nav>'), "the Workbench's own sections are in the page, not in the bar");
    const editor = (await admin.get('/model/edit/leave-request')).text;
    assert.match(editor, /class="editor-menu"/);
    for (const href of ['/', '/dashboard', '/dashboard/design', '/dashboard/admin'])
        assert.match(editor, new RegExp(`editor-menu[^]*href="${href}"`));
});

/** Where signing in sends a user, after first asking for `first` (signed out, as a browser does). */
async function landing(userName, first = '/') {
    const client = web.client();
    await client.get(first);
    await client.get('/login');
    const res = await client.post('/login', { userName, password: PASSWORD });
    assert.equal(res.status, 302, why(res));
    return res.location;
}

test('signing in lands an end user on My work; designers and administrators on the Workbench', async () => {
    assert.equal(await landing('staff'), '/dashboard');
    assert.equal(await landing('designer'), '/');
    assert.equal(await landing('admin'), '/');
});

test('signing in on the way to a page goes on to that page', async () => {
    assert.equal(await landing('designer', '/dashboard/design'), '/dashboard/design');
    assert.equal(await landing('staff', '/dashboard'), '/dashboard');
});

test("an end user's Workbench asks for no diagram preview, a designer's only route", async () => {
    const page = await staff.get('/');
    assert.equal(page.status, 200, why(page));
    assert.doesNotMatch(page.text, /id="svg"/);
    assert.match(page.text, /id="execLink"/, 'they can still start a process from it');
    assert.equal((await staff.get('/model/getSVg/leave-request')).status, 403);
    assert.match((await designer.get('/')).text, /id="svg"/);
});
