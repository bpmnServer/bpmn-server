// Every UI page renders, for an administrator and for a regular user.
import test from 'node:test';
import assert from 'node:assert/strict';
import { startWebApp, why } from '../support/webApp.mjs';

let web, admin, staff, instanceId;
const MODEL = 'leave-request';

test.before(async () => {
  web = await startWebApp();
  admin = await web.login('admin');
  staff = await web.login('staff');
  const started = await admin.get('/execute/' + MODEL);
  assert.equal(started.status, 302, `starting ${MODEL}: ${why(started)}`);
  instanceId = new URL(started.location, web.base).searchParams.get('id');
  assert.ok(instanceId, `an instance to show: ${started.location}`);
});
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** [url, text the page shows] for pages every signed-in user can open. */
const userPages = () => [
  ['/', /Models/],
  ['/home', /<html/i],
  ['/tasks', /<html/i],
  [`/instanceDetails?id=${instanceId}`, /Instance Details/],
  [`/executeInput/${MODEL}`, /<form/i],
  ['/user', /<html/i],
  ['/user/tasks', /<html/i],
  [`/user/instanceDetails?id=${instanceId}`, /<html/i],
  [`/user/executeInput/${MODEL}`, /<form/i],
  ['/docs', /<html/i],
  ['/readme_md', /bpmn/i],
  ['/user/readme_md', /bpmn/i],
  ['/account', /<form/i],
];

/** Pages of the designer and administration. */
const adminPages = () => [
  ['/model/list', new RegExp(MODEL)],
  ['/model/new', /<html/i],
  ['/model/import', /Import Processes/],
  ['/model/export', /<html/i],
  [`/model/edit/${MODEL}`, /bpmn/i],
  [`/model/editNoProp/${MODEL}`, /bpmn/i],
  [`/model/rename/${MODEL}`, /<form/i],
  [`/model/delete/${MODEL}`, /<form/i],
  ['/admin', /<html/i],
];

for (const who of ['admin', 'staff']) {
  test(`pages render for ${who}`, async () => {
    const client = who === 'admin' ? admin : staff;
    const failures = [];
    for (const [url, expected] of userPages()) {
      const res = await client.get(url);
      if (res.status !== 200 || !expected.test(res.text)) failures.push(`${url}: ${why(res)}`);
    }
    assert.deepEqual(failures, []);
  });
}

test('designer and administration pages render for admin', async () => {
  const failures = [];
  for (const [url, expected] of adminPages()) {
    const res = await admin.get(url);
    if (res.status !== 200 || !expected.test(res.text)) failures.push(`${url}: ${why(res)}`);
  }
  assert.deepEqual(failures, []);
});

test('the home page lists the definitions and the started instance', async () => {
  const home = await admin.get('/');
  assert.match(home.text, new RegExp(`<option value="${MODEL}"`));
  assert.ok(home.text.includes(instanceId), 'instance listed');
});

test('the model preview is an SVG', async () => {
  const res = await admin.get('/model/getSvg/' + MODEL);
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /image\/svg\+xml/);
  assert.match(res.text, /<svg[\s>]/);
});

test('the instance page shows the diagram with its elements and the replay data', async () => {
  const res = await admin.get(`/instanceDetails?id=${instanceId}`);
  assert.match(res.text, /data-element-id="Submit"/, 'diagram elements addressable for decorations');
  assert.match(res.text, /id="animationItems"/);
  assert.match(res.text, /Show animation/);
  assert.match(res.text, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/, 'dates are formatted');
});

test('static assets are served', async () => {
  for (const url of ['/stylesheets/app.css', '/javascripts/SVGHelper.js', '/javascripts/modeller-withPropertyPanel.js'])
    assert.equal((await admin.get(url)).status, 200, url);
});

test('the health probe answers without a session', async () => {
  const res = await web.client().get('/healthz');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'ok');
});

test('errors show details without secrets', async () => {
  const res = await admin.get('/instanceDetails?id=does-not-exist');
  assert.ok([403, 404, 500].includes(res.status), String(res.status));
  assert.ok(!res.text.includes('test-session-secret'));
  assert.ok(!/at .*\.js:\d+/.test(res.text), 'no stack trace');
});

test('the instance page documents each sequence flow once', async () => {
  const page = await admin.get(`/instanceDetails?id=${instanceId}`);
  assert.equal(page.status, 200, why(page));
  const flows = page.text.slice(page.text.indexOf('Sequence Flows'));
  // the conditional flow is listed (it has details), and once: the model was loaded twice, listing each flow twice
  const rows = flows.match(/<td>ToApprove<\/td>/g) ?? [];
  assert.equal(rows.length, 1, `ToApprove listed ${rows.length} times`);
});
