import session from 'express-session';
import flash from 'express-flash';
import lusca from 'lusca';
import mongoose from 'mongoose';
import passport from 'passport';
import { rateLimit } from 'express-rate-limit';
import MongoStore from 'connect-mongo';

import User from './models/User.js';
import * as passportConfig from './config/passport.js';
import { Account } from './routes/account.js';
import { adminDisabled, canDesign, isAdminGroups, signupDisabled } from './roles.js';


export class UserManager {
	app;
	passport;
	passportConfig;

	constructor(app) {

		this.app = app;
		this.passport = passport;
		this.passportConfig = passportConfig;

	}
	/**
	 * Create Express server.
	 */
	init() {

		const app = this.app;

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
			store: MongoStore.create({
				mongoUrl: process.env.MONGO_DB_URL,
			})
		}));
		app.use(flash());
		app.use((req, res, next) => {
			res.locals.errors = req.flash("errors");
			res.locals.successes = req.flash("success");
			res.locals.info = req.flash("info");
			next();
		});

		this.initMongo();
		this.initPassport();
	}
	initMongo() {

		console.log("MongoDB URL", process.env.MONGO_DB_URL)
		mongoose.set('strictQuery', false);
		mongoose.connect(process.env.MONGO_DB_URL);
		mongoose.connection.on('error', (err) => {
			console.error(err);
			console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
			process.exit();
		});
	}
	
	initPassport() {

		this.app.use(passport.initialize());
		this.app.use(passport.session());
		this.app.use(flash());
		
		// CSRF protection for the session-authenticated UI. The API routers authenticate with an
		// API key, not a cookie, so they are exempt. (The previous allowlist '/' exempted every path.)
		// Forms send the token as _csrf; scripts as the X-CSRF-Token header (public/javascripts/csrf.js).
		const csrf = lusca.csrf({
			cookie: { name: '_csrf' },
			secret: process.env.SESSION_SECRET,
		});
		const apiPath = /^\/(admin\/)?api2?(\/|$)/;
		this.app.use((req, res, next) => apiPath.test(req.path) ? next() : csrf(req, res, next));

	} 
	setup() {

		const app = this.app;

		/*
		app.use(lusca({
			csrf:  {
				cookie: { name: '_csrf' },
				allowlist: '/',
				secret: 'qwerty'
			},
			hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
			nosniff: true,
			referrerPolicy: "same-origin",
			xframe: "SAMEORIGIN",
			xssProtection: true,
		}));
		*/
		app.use(lusca.xframe('SAMEORIGIN'));
		app.use(lusca.xssProtection(true));
		app.disable('x-powered-by');

		// Brute-force protection on auth endpoints.
		const authLimiter = rateLimit({
			windowMs: 15 * 60 * 1000,
			limit: Number(process.env.AUTH_RATE_LIMIT) || 50,
			standardHeaders: true,
			legacyHeaders: false,
			message: { error: 'Too many attempts, please try again later.' },
		});
		app.use(['/login', '/signup', '/forgot', '/reset', '/account/verify'], authLimiter);

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
			// After successful login, redirect back to the intended page
			if (!req.user
				&& req.path !== '/login'
				&& req.path !== '/signup'
				&& !req.path.match(/^\/auth/)
				&& !req.path.match(/\./)) {
				console.log("redirecting to:", req.originalUrl);
				req.session.returnTo = req.originalUrl;
			} else if (req.user
				&& (req.path === '/account' || req.path.match(/^\/api/))) {
				req.session.returnTo = req.originalUrl;
			}
			next();
		});
		

		this.setupRoutes();
	}

	setupRoutes() {

		
		this.app.use('/', (new Account(this)).config());

	}

	isAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/login');
	}
}

