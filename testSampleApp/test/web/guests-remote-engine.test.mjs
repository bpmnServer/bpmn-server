// @features: guests
// The engine in a process of its own, with guests: each call says who it is for, and runs in that one's models and nobody else's.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { startWebApp, why, FIXTURES, PASSWORD } from '../support/webApp.mjs';

const GUESTS = fs.mkdtempSync(path.join(os.tmpdir(), 'bpmn-guests-'));
const DEMO = { GUEST_ACCESS: 'true', DEMO_MODE: 'true', DISABLE_ADMIN: 'true', GUESTS_PATH: GUESTS, GUEST_RATE_LIMIT: '1000',
  GUEST_SAVE: 'false', SIGNUP_VERIFY_EMAIL: 'true', SIGNUP_GROUPS: 'DESIGNER', SITE_URL: 'https://demo.example' };
const source = fs.readFileSync(path.join(FIXTURES, 'leave-request.bpmn'), 'utf8');
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>';
let web, User;

async function account(name) {
  const client = web.client();
  await client.follow('/dashboard');
  await client.get('/signup');
  await client.post('/signup', { userName: name, email: `${name}@gmail.com`, password: PASSWORD, confirmPassword: PASSWORD });
  await client.get('/account/verify/' + (await User.findOne({ userName: name })).emailVerificationToken);
  return client;
}
const start = (client, processName) => client.request('POST', '/model/test/start', { json: { processName, data: {} } });
const ask = body => fetch(web.engineAt + '/engine/call', { method: 'POST', headers: { 'x-engine-key': process.env.ENGINE_KEY }, body: JSON.stringify(body) }).then(r => r.json());

test.before(async () => {
  web = await startWebApp({ env: DEMO, remoteEngine: true });
  ({ default: User } = await import(new URL('../../../packages/bpmn-web/dist/userAccess/models/User.js', import.meta.url).href));
});
test.after(async () => {
  for (const key of Object.keys(DEMO)) delete process.env[key];
  await web?.stop();
  fs.rmSync(GUESTS, { recursive: true, force: true });
  setImmediate(() => process.exit(0));
});

test('an account\'s model runs in the engine, for that account alone', async () => {
  const mine = await account('mine');
  const saved = await mine.request('POST', '/model/edit/my-model', { json: { processId: 'my-model', bpmn: source, svg: SVG } });
  assert.equal(saved.status, 200, why(saved));
  const run = await start(mine, 'my-model');
  assert.equal(run.status, 200, why(run));
  const { id } = JSON.parse(run.text).instance;
  const { tenantId } = await User.findOne({ userName: 'mine' });
  assert.equal((await web.bpmnServer.dataStore.findInstance({ id }, 'summary')).tenantId, tenantId);

  const other = await account('other');
  const refused = await start(other, 'my-model');
  assert.match(refused.text, /No process definition named my-model/, why(refused));
  assert.equal((await other.get(`/model/test/instance/${id}`)).status, 404);
});

test('a visitor runs its own copy of the models, as a guest', async () => {
  const guest = web.client();
  assert.equal((await guest.follow('/dashboard')).status, 200);
  const run = await start(guest, 'leave-request');
  assert.equal(run.status, 200, why(run));
  const { id } = JSON.parse(run.text).instance;
  assert.match((await web.bpmnServer.dataStore.findInstance({ id }, 'summary')).tenantId, /^guest-/);
});

test('the engine takes no one it can not place', async () => {
  for (const caller of ['../../etc', 'guest-000000000000', ['guest-000000000000']]) {
    const { error } = await ask({ method: 'start', args: ['leave-request', {}], caller });
    assert.match(error?.message ?? '', /not a guest|can not see the folder/, JSON.stringify(caller));
  }
});
