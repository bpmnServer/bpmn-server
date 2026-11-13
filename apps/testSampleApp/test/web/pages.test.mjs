// @features: decision-log, health-operations, instance-page
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
  ['/docs', /<html/i],
  ['/readme_md', /bpmn/i],
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
  assert.match(res.text, /id="startSimulation"[^>]*>[^]*?Simulate/, "Simulate, as the editor's");
  assert.match(res.text, /src="\/modeler\/instance.js"/);
  assert.match(res.text, /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/, 'dates are formatted');
});

test('the instance page gives the Rationale: the run from start to end, each step with what happened and why', async () => {
  const { instance } = await web.bpmnServer.engine.start(MODEL, {});
  await web.bpmnServer.engine.invoke({ id: instance.id, 'items.elementId': 'Submit' }, { days: 10 }, 'admin');
  const page = await admin.get(`/instanceDetails?id=${instance.id}`);
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /<h2 id="rationale-heading">Rationale<\/h2>/);
  const table = page.text.match(/<table class="instance-table rationale-table">([^]*?)<\/table>/)[1];
  const text = html => html.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&gt;/g, '>');
  // each row's cells: seq, at, the element (its name and id, or its id), type, what happened, why
  // a step's row heads what it caused: its number, what it was, who, the data, what waits after it
  const steps = [...table.matchAll(/<tr class="rationale-step"[^>]*>([^]*?)<\/tr>/g)].map(r => r[1].replace(/<[^>]+>/g, ' ').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim());
  assert.deepEqual(steps, [
    'Step 1 · Start Process 4 rows',
    'Step 2 · Invoke Item Submit request by admin {"days":10} 8 rows',
  ]);
  const rows = [...table.matchAll(/<tr([^>]*)>([^]*?)<\/tr>/g)].slice(1).filter(r => !/rationale-step/.test(r[1]))
    .map(r => [...r[2].matchAll(/<td[^>]*>([^]*?)<\/td>/g)].map(c => text(c[1])))
    .map(([seq, at, element, type, happened, why]) => {
      const [, name, id] = /^(.*) \(([^()]+)\)$/.exec(element) ?? [, '', element];
      return { seq: Number(seq), at, id, name, type, happened, why };
    });
  // the log, in its order: each item's start (waiting as it starts: one row), end, and each decision where made
  assert.deepEqual(rows.map(r => [r.seq, r.id, r.name, r.type, r.happened]), [
    [1, 'Requested', 'Leave requested', 'bpmn:StartEvent', 'started'],
    [1, 'Requested', 'Leave requested', 'bpmn:StartEvent', 'ended'],
    [2, 'ToSubmit', '', 'bpmn:SequenceFlow', 'taken'],
    [3, 'Submit', 'Submit request', 'bpmn:UserTask', 'started · waits'],
    [3, 'Submit', 'Submit request', 'bpmn:UserTask', 'completed by admin'],
    [4, 'ToGateway', '', 'bpmn:SequenceFlow', 'taken'],
    [5, 'LongLeave', 'More than 5 days?', 'bpmn:ExclusiveGateway', 'started'],
    [5, 'LongLeave', 'More than 5 days?', 'bpmn:ExclusiveGateway', 'ended'],
    [6, 'ToApprove', 'yes', 'bpmn:SequenceFlow', 'taken'],
    [6, 'ToApprove', 'yes', 'bpmn:SequenceFlow', 'taken'],
    [5, 'LongLeave', 'More than 5 days?', 'bpmn:ExclusiveGateway', "takes 'yes' (ToApprove)"],
    [7, 'Approve', 'Approve request', 'bpmn:UserTask', 'started · waits'],
  ], 'every event, in the order logged');
  assert.match(rows[0].at, /^\d+\.\ds$/, 'when, from the start');
  assert.match(rows[8].why, /^from .*\ncondition\n    \$\(Number\(item\.data\.days\) > 5\)\nresult: true \(days=10\)$/, 'the why of a decision');
  assert.equal(rows[4].why, '', 'no why for an event');
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

test('the instance page carries its model for the Report (drawn by /modeler/report.js as in the editor)', async () => {
  const page = await admin.get(`/instanceDetails?id=${instanceId}`);
  assert.equal(page.status, 200, why(page));
  assert.match(page.text, /<script type="application\/json" data-report-source="model-report">/);
  assert.match(page.text, /src="\/modeler\/report.js"/);
  const json = page.text.match(/data-report-source="model-report">([^]*?)<\/script>/)[1];
  assert.ok(!json.includes('<'), 'no < in the script element: a model can not end it early');
  assert.match(JSON.parse(json), /id="ToApprove"/, 'the model, its flows included');
  assert.equal((await admin.get('/modeler/report.js')).status, 200);
});

test('the diagram is of the model, not of a run: marks a picture was saved with (the Test tab\'s) are not shown', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const first = await admin.get(`/instanceDetails?id=${instanceId}`);
  const drawn = /<svg[^]*?<\/svg>/.exec(first.text)[0];
  // saved while the Test tab showed a run on it: Submit waiting, with a mark of where the picture came from
  const marked = drawn.replace('<svg', '<svg data-saved="yes"')
    .replace(/(<g class="[^"]*)("[^>]*data-element-id="Submit")/, '$1 test-waiting$2');
  assert.match(marked, /test-waiting[^>]*data-element-id="Submit"/);
  const file = path.join(web.definitionsPath, `${MODEL}.svg`);
  fs.writeFileSync(file, marked);
  try {
    const { instance } = await web.bpmnServer.engine.start(MODEL, {});
    const page = await admin.get(`/instanceDetails?id=${instance.id}`);
    assert.match(page.text, /data-saved="yes"/, 'the saved picture');
    assert.doesNotMatch(page.text, /class="[^"]*\btest-waiting/, 'without the run\'s marks');
  } finally {
    fs.rmSync(file, { force: true });
  }
});

test('the instance page: each user task\'s assignment under the Rationale, after the fact; without security policies, no "who may"', async () => {
  const page = (await admin.get(`/instanceDetails?id=${instanceId}`)).text;
  assert.match(page, /<h2 id="access-heading">Assignment and access<\/h2>/);
  assert.match(page, /<div class="access-task" data-element="Submit"[^>]*>[^]*?Offered to staff by the task itself/);
  assert.doesNotMatch(page, /id="access-case"/, 'security policies are off here: who may do what is today\'s rules');
});

test('element templates are a preview, off by default (ELEMENT_TEMPLATES): none offered, the editor without its chooser', async () => {
  const catalog = await admin.get('/model/templates');
  assert.equal(catalog.status, 200);
  assert.deepEqual(JSON.parse(catalog.text), { templates: [], rejected: [], warnings: [], off: true });
  const editor = (await admin.get(`/model/edit/${encodeURIComponent(MODEL)}`)).text;
  assert.match(editor, /<script id="modeler-options" type="application\/json">\{"elementTemplates":false\}<\/script>/);
  assert.doesNotMatch((await admin.get('/dashboard/design')).text, /task templates/i);
});
