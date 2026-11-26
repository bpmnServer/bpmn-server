// The HR application's side of the integration with OWF (OmniWorkflow), which runs beside it as a server of its own.
//
// The HR application signs its people in and keeps its business data; OWF keeps the workflows. This module is what the HR
// application needs to talk to OWF: it asks OWF for a token for the person who is signed in here (with the service key,
// which stays on this server), and passes the pages' calls on to OWF's API v3 with that token, so every call runs as
// that person, under the models' rules. The browser never sees the key or the token: it calls /api/v3 on this site,
// as it would on OWF's own (the HR pages' task panel and forms read and complete tasks there).
//
//   OWF_URL           where OWF is (http://localhost:3200)
//   OWF_SERVICE_KEY   OWF's API_KEY: acts as the service account, and asks for tokens for this application's users
//
// Only what the HR pages need goes through: a person's tasks and cases, the processes they may start, who they are.
// Design, administration, users, settings and the service key's own calls are not passed on.
import { crossSiteWrite } from './userManager.js';

/** The groups OWF does not take from an application: they are its own (ADMIN, DESIGNER) and the system's. */
const OWF_ONLY = new Set(['SYSTEM', 'ADMIN', 'DESIGNER']);
const MINUTES = 30;

/** What may be asked of OWF through this site: the method and the path (after /api/v3), nothing else. */
const ALLOWED = [
  ['GET', /^\/me$/],
  ['GET', /^\/tasks(\/[^/]+)?$/],
  ['POST', /^\/tasks\/[^/]+\/(claim|complete|choices\/[^/]+)$/],
  ['GET', /^\/processes\/startable$/],
  ['GET', /^\/processes\/[^/]+\/guide$/],
  ['POST', /^\/processes\/[^/]+\/(start|choices\/[^/]+)$/],
  ['GET', /^\/instances(\/[^/]+(\/(access|notifications|rationale))?)?$/],
];
export const mayAsk = (method, path) => ALLOWED.some(([m, pattern]) => m === method && pattern.test(path));

export class OwfLink {
  /** @param {{ url?: string, key?: string, fetch?: typeof fetch }} [options] */
  constructor({ url = process.env.OWF_URL, key = process.env.OWF_SERVICE_KEY, fetch: fetcher = fetch } = {}) {
    this.url = String(url ?? '').replace(/\/+$/, '');
    this.key = key;
    this.fetch = fetcher;
    /** userName + groups -> { token, expires } */
    this.tokens = new Map();
  }

  get configured() { return !!(this.url && this.key); }

  /** A token for this person, kept until shortly before it runs out. */
  async tokenFor(user, { fresh = false } = {}) {
    const groups = [...new Set((user.userGroups ?? []).map(String).filter(g => !OWF_ONLY.has(g)))].sort();
    const id = `${user.userName}|${groups.join(',')}`;
    const kept = this.tokens.get(id);
    if (!fresh && kept && kept.expires - Date.now() > 60_000) return kept.token;
    const response = await this.fetch(`${this.url}/api/v3/tokens`, {
      method: 'POST', headers: { 'x-api-key': this.key, 'content-type': 'application/json' },
      body: JSON.stringify({ userName: user.userName, groups, minutes: MINUTES }),
    });
    if (!response.ok) throw new OwfError(response.status, `OWF would not give a token for ${user.userName} (${response.status})`);
    const { token, expiresAt } = await response.json();
    this.tokens.set(id, { token, expires: Date.parse(expiresAt) || Date.now() + MINUTES * 60_000 });
    return token;
  }

  /** A call to OWF's API v3 as this person; the token asked for again once if OWF no longer knows it. */
  async call(user, method, path, body) {
    for (const fresh of [false, true]) {
      const token = await this.tokenFor(user, { fresh });
      const response = await this.fetch(`${this.url}/api/v3${path}`, {
        method, headers: { authorization: `Bearer ${token}`, accept: 'application/json', ...(body !== undefined ? { 'content-type': 'application/json' } : {}) },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      if (response.status === 401 && !fresh) continue;
      return response;
    }
  }
}

export class OwfError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

/**
 * Express middleware, mounted at /api/v3: the HR pages' calls to OWF, as the person signed in here. A request from
 * another site that would change something is refused, as it is for the HR application's own API.
 */
export function owfProxy(link = new OwfLink()) {
  return async (req, res) => {
    if (!link.configured) return res.status(404).json({ error: { code: 'NOT_CONNECTED', message: 'No workflow server is connected (OWF_URL, OWF_SERVICE_KEY)' } });
    if (!req.user) return res.status(401).json({ error: { code: 'NOT_SIGNED_IN', message: 'Sign in to the HR application' } });
    if (!mayAsk(req.method, req.path)) return res.status(403).json({ error: { code: 'NOT_PASSED_ON', message: 'The HR application does not pass that on to the workflow server' } });
    const wrong = crossSiteWrite(req);
    if (wrong) return res.status(403).json({ error: { code: 'CROSS_SITE', message: wrong } });
    try {
      const body = ['GET', 'HEAD'].includes(req.method) ? undefined : (req.body ?? {});
      const answer = await link.call(req.user, req.method, req.url, body);
      res.status(answer.status);
      const type = answer.headers.get('content-type');
      if (type) res.type(type);
      res.send(await answer.text());
    }
    catch (error) {
      res.status(error instanceof OwfError ? 502 : 504).json({ error: { code: 'WORKFLOW_SERVER', message: error.message } });
    }
  };
}
