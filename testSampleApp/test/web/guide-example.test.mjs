// @features: ai-remote-development
// The guide for AI agents (docs/ai/building-workflows.md) starts with a model and its tests: they are taken from the
// page as written, saved over the API and run, and must all pass. Its roles are lanes: a lane offers its tasks to the
// group of its name.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startWebApp, why } from '../support/webApp.mjs';

const GUIDE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'docs', 'docs', 'ai', 'building-workflows.md');
const page = fs.readFileSync(GUIDE, 'utf8').replace(/\r\n/g, '\n');
const block = lang => new RegExp('```' + lang + '\\n([\\s\\S]*?)```').exec(page)?.[1];

let web;
test.before(async () => { web = await startWebApp({ env: { APP_ENV: 'production', API_TRACE: '' } }); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });
const api = (method, url, body) => web.api(method, '/api2' + url, body);

test('the guide\'s first model, with its lanes, passes its own tests', async () => {
  const source = block('xml'), feature = block('gherkin');
  assert.ok(source && feature, 'the guide has its model and its tests');
  assert.match(source, /<bpmn:lane id="ManagerLane" name="Manager">/, 'roles are lanes');

  const saved = await api('PUT', '/models/approval', { source });
  assert.equal(saved.status, 201, why(saved));
  const run = await api('POST', '/models/approval/test', { source: feature });
  assert.equal(run.status, 200, why(run));
  assert.deepEqual([run.body.passed, run.body.failed], [3, 0], JSON.stringify(run.body));
});
