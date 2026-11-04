// The one menu of every page (views/includes/menu.pug): Workbench first; Dashboard a drop-down for designers and
// administrators (My work, Design, Administration as their role allows), My work alone for everyone else; the
// editors carry the same places in their header (editorMenu.pug).
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

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
    assert.match(workbench, /workbench-navigation/, 'the Workbench keeps its own sections');
    const editor = (await admin.get('/model/edit/leave-request')).text;
    assert.match(editor, /class="editor-menu"/);
    for (const href of ['/', '/dashboard', '/dashboard/design', '/dashboard/admin'])
        assert.match(editor, new RegExp(`editor-menu[^]*href="${href}"`));
});
