// Who signs in: the HR application's own users, sessions and sign-in page (/hr/login). It is bpmn-web's IUserManager
// (start({ userManager })), so the workflow pages take the person the HR application signed in: bpmn-web keeps no users
// or sessions of its own. Without BPMN Server (npm run hr, npm run dev), the HR application uses it the same way.
import express from 'express';
import session from 'express-session';
import { HrUsers, ROLES, DEMO_USERS, demoPassword } from './users.js';

const ADMIN_GROUPS = ['ADMIN', 'SYSTEM'];
const DESIGNER_GROUPS = [...ADMIN_GROUPS, 'DESIGNER'];

/** The person, as bpmn-web's pages read them (bpmn-web's WebUser). */
function webUser(user) {
  const userGroups = [...user.userGroups];
  return {
    ...user,
    userGroups,
    id: user.userName,
    isAdmin: () => userGroups.some(g => ADMIN_GROUPS.includes(g)),
    isDesigner: () => userGroups.some(g => DESIGNER_GROUPS.includes(g)),
    hasGroup: group => userGroups.includes(group),
  };
}

/**
 * Why a change (POST, PUT, DELETE) is refused as coming from another site, or null: as bpmn-web's crossSiteWrite, here
 * too so the HR application runs without it (npm run hr). A browser says where a request comes from; no browser, no
 * cookie of a visitor's.
 */
function crossSiteWrite(req) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return null;
  const site = req.get('sec-fetch-site');
  if (site !== undefined && site !== 'same-origin' && site !== 'none') return `A ${site} request may not change anything here`;
  const origin = req.get('origin');
  const here = `${String(req.get('x-forwarded-proto') ?? req.protocol).split(',')[0].trim()}://${req.get('x-forwarded-host') ?? req.get('host')}`;
  if (origin !== undefined && origin !== here) return `A request from ${origin} may not change anything here`;
  return null;
}

/**
 * The sessions' secret: SESSION_SECRET (or HR_SESSION_SECRET). Without one, a fixed demo secret on a developer's
 * machine only: in production (NODE_ENV=production) the server refuses to start, as anyone could sign their cookies.
 */
function sessionSecret() {
  const secret = process.env.SESSION_SECRET || process.env.HR_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production')
    throw new Error('HR: SESSION_SECRET is not set; in production the sessions need a secret of their own (.env)');
  console.warn('HR: SESSION_SECRET is not set: a demo secret signs the sessions (development only)');
  return 'hr-demo-only';
}

/** Where a person goes after signing in: a page of this site only. */
const safeReturn = to => (typeof to === 'string' && to.startsWith('/') && !to.startsWith('//') ? to : '/hr/');

export class HrUserManager {
  /** @param {object} [options] @param {HrUsers} [options.users] the users and sessions (default: data/hr.sqlite) */
  constructor({ users = new HrUsers() } = {}) {
    this.hr = users;
    this.hr.install();
  }

  /** The sessions (cookie hr.sid, in the HR database), and on each request the person signed in. */
  init(app) {
    app.use(session({
      name: 'hr.sid',
      secret: sessionSecret(),
      resave: false,
      saveUninitialized: false,
      store: this.hr.sessionStore(),
      cookie: { httpOnly: true, sameSite: 'lax', maxAge: 8 * 3600_000, secure: process.env.SECURE_COOKIES === 'true' },
    }));
    app.use((req, res, next) => {
      const user = req.session?.userName ? this.hr.get(req.session.userName) : null;
      req.user = user ? webUser(user) : undefined;
      req.isAuthenticated = () => !!req.user;
      next();
    });
    // the HR API takes the session cookie: a change posted from another site is refused (CSRF). bpmn-web's own check
    // is for its forms, not for /api; the workflows' calls (x-hr-key) carry no cookie and pass
    app.use('/api/hr', (req, res, next) => {
      const why = req.get('x-hr-key') === undefined ? crossSiteWrite(req) : null;
      return why ? res.status(403).json({ error: why }) : next();
    });
  }

  /**
   * Who a call to the workflow API (/api/v3) is from: the HR application issues the credentials, here its session (the
   * pages' calls carry it). An application with API clients of its own would take its tokens here too.
   */
  apiUser(req) {
    const user = req.user;
    return user ? { userName: user.userName, userGroups: user.userGroups, email: user.email } : null;
  }

  /** Signing in and out, the HR users' API, and the workflow pages' sign-in pages sent to the HR application's. */
  setup(app) {
    const json = express.json();
    const admin = (req, res, next) => (req.user?.role === 'HR Administrator' ? next() : res.status(403).json({ error: 'HR Administrator only' }));
    const signedIn = (req, res, next) => (req.user ? next() : res.status(401).json({ error: 'Not signed in' }));
    const fail = (res, error) => res.status(400).json({ error: error.message });

    // who is signed in; signing in; signing out
    app.get('/api/hr/session', (req, res) => (req.user ? res.json(this.hr.get(req.user.userName)) : res.status(401).json({ error: 'Not signed in' })));
    app.post('/api/hr/session', json, (req, res, next) => {
      const user = this.hr.verify(req.body?.userName, req.body?.password);
      if (!user) return res.status(401).json({ error: 'The user name or the password is wrong' });
      const returnTo = safeReturn(req.body?.returnTo ?? req.session?.returnTo);
      // a new session at signing in (no fixation)
      req.session.regenerate(error => {
        if (error) return next(error);
        req.session.userName = user.userName;
        req.session.save(error => (error ? next(error) : res.json({ user, returnTo })));
      });
    });
    // the session goes, and with it the workflow pages' access: they have no credential of their own
    const signOut = (req, res, then) =>
      req.session ? req.session.destroy(() => { res.clearCookie('hr.sid'); then(); }) : then();
    app.delete('/api/hr/session', (req, res) => signOut(req, res, () => res.json({ signedOut: true })));

    // the demo's accounts, for its home page (HR_DEMO_ACCOUNTS=false: none shown)
    app.get('/api/hr/demo', (req, res) => res.json(process.env.HR_DEMO_ACCOUNTS === 'false'
      ? { accounts: [] }
      : { password: demoPassword(), accounts: DEMO_USERS.map(u => ({ userName: u.userName, name: u.name, role: u.role, userGroups: ROLES[u.role] })) }));

    // the HR users, for HR Administrators
    app.get('/api/hr/roles', (req, res) => res.json(Object.keys(ROLES)));
    app.get('/api/hr/users', signedIn, admin, (req, res) => res.json(this.hr.list()));
    app.post('/api/hr/users', json, signedIn, admin, (req, res) => { try { res.status(201).json(this.hr.add(req.body ?? {})); } catch (e) { fail(res, e); } });
    app.put('/api/hr/users/:userName', json, signedIn, admin, (req, res) => { try { res.json(this.hr.update(req.params.userName, req.body ?? {})); } catch (e) { fail(res, e); } });
    app.delete('/api/hr/users/:userName', signedIn, admin, (req, res) => {
      if (req.params.userName === req.user.userName) return res.status(409).json({ error: 'You do not delete yourself' });
      res.json({ deleted: this.hr.remove(req.params.userName) });
    });
    // their own password
    app.put('/api/hr/session/password', json, signedIn, (req, res) => {
      if (!this.hr.verify(req.user.userName, req.body?.current)) return res.status(400).json({ error: 'The current password is wrong' });
      try { this.hr.update(req.user.userName, { password: req.body?.password }); res.json({ changed: true }); } catch (e) { fail(res, e); }
    });

    // the workflow pages' sign-in, sign-out and account pages: the HR application's
    const toLogin = (req, res) => res.redirect('/hr/login?returnTo=' + encodeURIComponent(safeReturn(req.query.returnTo ?? req.session?.returnTo)));
    app.get('/login', toLogin);
    // the site's address, before signing in: the demo's home page
    app.get('/', (req, res, next) => (req.user ? next() : res.redirect('/hr/welcome')));
    app.get('/logout', (req, res) => signOut(req, res, () => res.redirect('/hr/login')));
    for (const page of ['/signup', '/setup', '/forgot', '/reset/:token'])
      app.all(page, (req, res) => res.redirect('/hr/login'));
    app.all(['/account', '/account/*rest'], (req, res) => res.redirect('/hr/account'));
  }
}
