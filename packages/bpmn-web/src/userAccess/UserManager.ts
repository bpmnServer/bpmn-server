import session from 'express-session';
import passport from 'passport';
import { rateLimit } from 'express-rate-limit';
import { DocumentSessionStore } from './userStore.js';

import User from './models/User.js';
import * as passportConfig from './config/passport.js';
import { Account } from './routes/account.js';
import type { IUserManager } from './IUserManager.js';
import { rememberPage } from './pages.js';
import { UserService } from './UserService.js';


/**
 * bpmn-web's own user manager (IUserManager), the default: its users and sessions on the engine's store
 * (userStore.ts), signing in with Passport, its sign-in, sign-up and account pages, and the first-run page.
 */
export class UserManager implements IUserManager {
	app;
	passport;
	passportConfig;

	constructor(app) {
		this.app = app;
		this.passport = passport;
		this.passportConfig = passportConfig;
	}

	/** The sessions, on the engine's store; Passport puts the user on the request. */
	init(app = this.app) {
		app.use(session({
			resave: false,
			saveUninitialized: false,
			secret: process.env.SESSION_SECRET,
			cookie: {
				maxAge: 1209600000, // two weeks in milliseconds
				httpOnly: true,
				sameSite: 'lax',
				// Only mark cookies Secure when actually served over TLS (direct or via proxy),
				// otherwise the browser drops them on a plain-HTTP internal deployment.
				secure: process.env.HTTPS === 'true' || process.env.SECURE_COOKIES === 'true',
			},
			// on the engine's store, beside the users (userStore.ts)
			store: new DocumentSessionStore(),
		}));
		app.use(passport.initialize());
		app.use(passport.session());
	}

	/** The sign-in, sign-up, setup and account pages, with brute-force protection. */
	setup(app = this.app) {
		const authLimiter = rateLimit({
			windowMs: 15 * 60 * 1000,
			limit: Number(process.env.AUTH_RATE_LIMIT) || 50,
			standardHeaders: true,
			legacyHeaders: false,
			message: { error: 'Too many attempts, please try again later.' },
		});
		app.use(['/login', '/signup', '/forgot', '/reset', '/account/verify', '/setup'], authLimiter);
		app.use('/', (new Account(this)).config());
	}

	/** Its users, on the engine's store. */
	users = new UserService();

	isAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		// back here after signing in
		rememberPage(req);
		res.redirect('/login');
	}
}

/** The users bpmn-web manages: its own user manager's; none when the application's user manager signs people in. */
export function ownUsers(userManager: IUserManager | undefined): UserService | null {
	return userManager instanceof UserManager ? userManager.users : null;
}

/** The application's user manager, when it is the one signing people in (not bpmn-web's own): none otherwise. */
export function hostUserManager(req): IUserManager | null {
	const userManager = req?.app?.get?.('userManager');
	return userManager && !(userManager instanceof UserManager) ? userManager : null;
}
