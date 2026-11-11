import flash from 'express-flash';
import lusca from 'lusca';
import { adminDisabled, canDesign, isAdminGroups, signupDisabled } from './roles.js';
import { firstRunPending } from './firstRun.js';

/*
 * What bpmn-web's pages need on every request, whichever user manager signs people in (IUserManager): messages
 * (req.flash), CSRF protection, the menu's values, and the page to go back to after signing in. All in the session the
 * user manager keeps.
 */

/** After the user manager's init: messages and CSRF protection. */
export function pageSessions(app) {
	app.use(flash());
	app.use((req, res, next) => {
		res.locals.errors = req.flash("errors");
		res.locals.successes = req.flash("success");
		res.locals.info = req.flash("info");
		next();
	});
	// CSRF protection for the session-authenticated UI. The API routers authenticate with an
	// API key, not a cookie, so they are exempt. (The previous allowlist '/' exempted every path.)
	// Forms send the token as _csrf; scripts as the X-CSRF-Token header (public/javascripts/csrf.js).
	const csrf = lusca.csrf({
		cookie: { name: '_csrf' },
		secret: process.env.SESSION_SECRET,
	});
	const apiPath = /^\/(admin\/)?api2?(\/|$)/;
	app.use((req, res, next) => apiPath.test(req.path) ? next() : csrf(req, res, next));
}

/** Before the user manager's routes: headers, the first-run page, the menu's values, the page to go back to. */
export function pageLocals(app) {
	app.use(lusca.xframe('SAMEORIGIN'));
	app.use(lusca.xssProtection(true));
	app.disable('x-powered-by');

	// a server with no users yet: its pages ask for the administrator first (firstRun.ts)
	app.use((req, res, next) => {
		if (!firstRunPending(req.app) || req.path === '/setup' || /\./.test(req.path)
			|| /^\/(api|api2|admin\/api|admin\/api2|healthz)(\/|$)/.test(req.path))
			return next();
		return res.redirect('/setup');
	});

	app.use((req, res, next) => {
		res.locals.user = req.user;
		// the menu goes by these: a page may pass its own `user` (the system user, with sign-in off)
		res.locals.account = req.user;
		res.locals.signInOff = process.env.REQUIRE_AUTHENTICATION === 'false';
		// views show the model actions (new, import, open, rename, delete) to designers
		res.locals.canDesign = canDesign(req.user);
		res.locals.canSignup = !signupDisabled();
		// the menu (views/includes/menu.pug): Administration for administrators; the page it is on
		res.locals.canAdminister = !adminDisabled()
			&& (process.env.REQUIRE_AUTHENTICATION === 'false' || isAdminGroups(req.user?.userGroups));
		res.locals.currentPath = req.path;
		next();
	});

	app.use((req, res, next) => {
		// After successful login, redirect back to the intended page. Not for the APIs: they have no sign-in, and a
		// session kept for each of their calls (the pages' own, through routes/api/pageClient.ts) is waste
		if (/^\/(admin\/)?api(2|\/|$)|^\/api2/.test(req.path) || !req.session)
			return next();
		if (!req.user
			&& req.path !== '/login'
			&& req.path !== '/signup'
			&& !req.path.match(/^\/auth/)
			&& !req.path.match(/\./)) {
			req.session.returnTo = req.originalUrl;
		} else if (req.user
			&& (req.path === '/account' || req.path.match(/^\/api/))) {
			req.session.returnTo = req.originalUrl;
		}
		next();
	});
}
