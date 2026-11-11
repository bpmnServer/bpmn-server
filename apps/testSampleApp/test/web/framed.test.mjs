// @features: dashboards
// A workflow page framed by a page of this site (an application's own layout: apps/hrdemo) leaves out its menu bar,
// as the browser says it is framed (Sec-Fetch-Dest: iframe, Sec-Fetch-Site: same-origin); opened by itself, or framed
// by another site, it keeps it. The editors keep their own actions. The Fable Review, M7.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

let web, admin;
test.before(async () => { web = await startWebApp(); admin = await web.login('admin'); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

const FRAMED = { 'sec-fetch-dest': 'iframe', 'sec-fetch-site': 'same-origin' };
const hasMenu = html => /<nav class="navbar navbar-default"/.test(html);

test('a page framed by this site: no menu bar, the body marked framed', async () => {
  for (const url of ['/dashboard', '/', '/tasks']) {
    const page = await admin.get(url, { headers: FRAMED });
    assert.equal(page.status, 200, `${url}: ${why(page)}`);
    assert.equal(hasMenu(page.text), false, `${url}: no menu bar`);
    assert.match(page.text, /<body class="framed"/, url);
  }
});

test('opened by itself, or framed by another site: the menu bar as always', async () => {
  for (const headers of [{}, { 'sec-fetch-dest': 'document', 'sec-fetch-site': 'same-origin' }, { 'sec-fetch-dest': 'iframe', 'sec-fetch-site': 'cross-site' }]) {
    const page = await admin.get('/dashboard', { headers });
    assert.equal(hasMenu(page.text), true, JSON.stringify(headers));
    assert.doesNotMatch(page.text, /<body class="framed"/);
  }
});

test('the model editor framed: its menu and brand left out, its actions kept', async () => {
  const framed = await admin.get('/model/edit/leave-request', { headers: FRAMED });
  assert.equal(framed.status, 200, why(framed));
  assert.doesNotMatch(framed.text, /class="brand"/);
  assert.match(framed.text, /id="js-download"/, 'Download stays');
  const alone = await admin.get('/model/edit/leave-request');
  assert.match(alone.text, /class="brand"/);
});
