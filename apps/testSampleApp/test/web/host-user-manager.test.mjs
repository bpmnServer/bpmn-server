// @features: host-user-manager
// An application that signs people in itself (docs/design/host-users.md): its user manager given to bpmn-web
// (start({ userManager }), IUserManager). bpmn-web keeps no users, sessions or credentials of its own: the pages take
// the application's person; API v3 takes the application's credential (apiUser), refuses a change posted from another
// site with its cookie (CSRF), and issues no tokens or AI links; Administration and /api/v3/users say the application
// manages the users. The service key still opens the API.
import test from 'node:test';
import assert from 'node:assert/strict';
import session from 'express-session';
import { startWebApp, why, WebClient, API_KEY } from '../support/webApp.mjs';

/** The application's people: who they are, and their groups. */
const PEOPLE = { ann: ['staff'], boss: ['ADMIN'] };
const person = userName => PEOPLE[userName] && { userName, userGroups: PEOPLE[userName], email: `${userName}@app.test` };

/** A user manager as an application writes one: its own session cookie, its own sign-in, its own token form. */
class AppUserManager {
  init(app) {
    app.use(session({ name: 'app.sid', secret: 'the application\'s secret', resave: false, saveUninitialized: false, cookie: { sameSite: 'lax', httpOnly: true } }));
    app.use((req, res, next) => {
      const found = person(req.session?.who);
      req.user = found && { ...found, id: found.userName, isAdmin: () => found.userGroups.includes('ADMIN'), isDesigner: () => found.userGroups.includes('ADMIN'), hasGroup: g => found.userGroups.includes(g) };
      req.isAuthenticated = () => !!req.user;
      next();
    });
  }
  setup(app) {
    app.post('/api/app/signin', (req, res) => {
      if (!person(req.body?.who)) return res.status(401).json({ error: 'no such person' });
      req.session.who = req.body.who;
      res.json({ signedIn: req.body.who });
    });
    app.get('/login', (req, res) => res.redirect('/app/login'));
    app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/app/login')));
  }
  /** The application's credentials: its token form (App <name>), else its session. */
  apiUser(req) {
    const named = /^App (\w+)$/.exec(req.get('authorization') ?? '')?.[1];
    return named ? person(named) : req.user ? person(req.user.userName) : null;
  }
}

let web;
test.before(async () => { web = await startWebApp({ userManager: new AppUserManager() }); });
test.after(async () => { await web?.stop(); setImmediate(() => process.exit(0)); });

/** Signed in to the application as one of its people. */
async function signIn(who) {
  const client = new WebClient(web.base);
  const res = await client.request('POST', '/api/app/signin', { json: { who } });
  assert.equal(res.status, 200, why(res));
  return client;
}

test('the pages take the application\'s person; its /login is where a page sends someone signed out', async () => {
  const out = await new WebClient(web.base).get('/dashboard');
  assert.equal(out.status, 302);
  assert.match(out.location, /\/login$/);
  const login = await new WebClient(web.base).get('/login');
  assert.equal(login.status, 302);
  assert.match(login.location, /\/app\/login$/, 'bpmn-web\'s sign-in page is not served: the application\'s is');

  const ann = await signIn('ann');
  // My work calls API v3 on the server with the visitor's own credential (pageClient): no token of bpmn-web's
  const mine = await ann.get('/dashboard');
  assert.equal(mine.status, 200, why(mine));
  assert.match(mine.text, /My work/);
  assert.match(mine.text, /ann/);
});

test('API v3 takes the application\'s credential: its session, its own token form; nothing else of a person\'s', async () => {
  const ann = await signIn('ann');
  assert.equal((await ann.get('/api/v3/tasks')).status, 200);
  const byToken = await new WebClient(web.base).get('/api/v3/tasks', { headers: { authorization: 'App ann' } });
  assert.equal(byToken.status, 200, why(byToken));
  const nobody = await new WebClient(web.base).get('/api/v3/tasks');
  assert.equal(nobody.status, 401);
  // a token of bpmn-web's form is not one of the application's: refused, not looked up
  const owfToken = await new WebClient(web.base).get('/api/v3/tasks', { headers: { authorization: 'Bearer bpt_made_up' } });
  assert.equal(owfToken.status, 401);
  assert.equal(owfToken.body.error.code, 'UNAUTHORIZED');
});

test('with the session cookie, a change posted from another site is refused (CSRF); from this site, or no browser, it is not', async () => {
  const ann = await signIn('ann');
  const start = headers => ann.request('POST', '/api/v3/processes/simple/start', { json: { data: {} }, headers });
  for (const headers of [{ origin: 'https://evil.example' }, { 'sec-fetch-site': 'cross-site' }, { 'sec-fetch-site': 'same-site' }, { origin: 'null' }]) {
    const res = await start(headers);
    assert.equal(res.status, 403, `${JSON.stringify(headers)}: ${why(res)}`);
    assert.equal(res.body.error.code, 'CROSS_SITE');
  }
  for (const headers of [{ origin: web.base }, { 'sec-fetch-site': 'same-origin' }, {}]) {
    const res = await start(headers);
    assert.notEqual(res.body?.error?.code, 'CROSS_SITE', `${JSON.stringify(headers)}: ${why(res)}`);
    assert.notEqual(res.status, 401, why(res));
  }
  // reading is not a change: another site may not read it anyway (no cookie on a cross-site read through CORS)
  assert.equal((await ann.get('/api/v3/tasks', { headers: { 'sec-fetch-site': 'cross-site' } })).status, 200);
});

test('the service key still opens the API, before the application\'s credential, and is not a cookie a form can carry', async () => {
  const ann = await signIn('ann');
  const res = await ann.request('POST', '/api/v3/processes/simple/start', { json: { data: {} }, headers: { 'x-api-key': API_KEY, origin: 'https://evil.example' } });
  assert.notEqual(res.body?.error?.code, 'CROSS_SITE', why(res));
  assert.equal(res.status, 201, why(res));
});

test('bpmn-web issues no credentials: no tokens, no AI links', async () => {
  const issued = await web.api('POST', '/api/v3/tokens', { userName: 'ann', groups: ['staff'], minutes: 5 });
  assert.equal(issued.status, 409, why(issued));
  assert.equal(issued.body.error.code, 'TOKENS_ELSEWHERE');
  const revoked = await web.api('DELETE', '/api/v3/tokens?userName=ann');
  assert.equal(revoked.body.error.code, 'TOKENS_ELSEWHERE');
  const ann = await signIn('ann');
  assert.equal((await ann.get('/ai/key')).status, 404);
});

test('bpmn-web manages no users: Administration and /api/v3/users say the application does', async () => {
  const listed = await web.api('GET', '/api/v3/users');
  assert.equal(listed.status, 409, why(listed));
  assert.equal(listed.body.error.code, 'USERS_ELSEWHERE');
  const boss = await signIn('boss');
  const admin = await boss.get('/dashboard/admin');
  assert.equal(admin.status, 200, why(admin));
  assert.match(admin.text, /The application signs people in and manages its users/);
  assert.doesNotMatch(admin.text, /id="add-user"/);
});

test('signing out of the application signs out of the workflow pages and the API', async () => {
  const ann = await signIn('ann');
  assert.equal((await ann.get('/api/v3/tasks')).status, 200);
  const out = await ann.get('/logout');
  assert.equal(out.status, 302);
  assert.equal((await ann.get('/api/v3/tasks')).status, 401);
  assert.match((await ann.get('/dashboard')).location, /\/login$/);
});
