import { siteGuide } from './routes/siteGuide.js';
import { issueAiKey, aiKeyHolder, revokeAiKeys } from './routes/aiAccess.js';
import { originOf } from './routes/modelApi.js';
import { apiTrace } from './routes/middleware/apiTrace.js';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

import bodyParser from 'body-parser';
import compression from 'compression';
import flash from 'connect-flash';
import busboy from 'connect-busboy'; // middleware for form/file upload
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import multer from 'multer';
import { BPMNServer, Logger } from 'bpmn-server';

import { UserManager } from './userAccess/UserManager.js';
import { useTestsFolder } from './testing/scenarios.js';
import { engineTests } from './testing/engineTests.js';
import { adminDisabled } from './userAccess/roles.js';
import type { WorkflowApplication } from './runtime/WorkflowApplication.js';
import { Workflow } from './routes/workflow.js';
import { EndUser } from './routes/endUser.js';
import { Docs } from './routes/docs.js';
import { Model } from './routes/model.js';
import { Dashboards } from './routes/dashboards.js';
import { API } from './routes/api.js';
import { API2 } from './routes/api2.js';
import { answerMessage } from './routes/common.js';
import { errorDetailsHandler } from './routes/middleware/errorDetails.js';
import { processRunErrorHandler } from './routes/runErrors.js';
import { gracefulShutdown } from './runtime/shutdown.js';

const __dirname = import.meta.dirname;
console.log('app.ts from ', import.meta.filename);

const upload = multer({ dest: path.join(__dirname, 'uploads') });



export class WebApp {
	app;
	userManager;
	bpmnServer;
	packageJson;
	server;

	application: WorkflowApplication;

	constructor(application: WorkflowApplication) {
		this.application = application;

		const configPath = __dirname + '/../package.json';
		if (fs.existsSync(configPath)) {
	
			this.packageJson= JSON.parse(fs.readFileSync(configPath, 'utf8'));
			var _version = this.packageJson['version'];
			console.log("bpmn-server WebApp.ts version "+ _version);
		}
	

		this.initExpress();

		this.userManager = new UserManager(this.app);

		this.userManager.init();
		const wflogger = application.logger ?? new Logger({ toConsole: true });
		this.bpmnServer = BPMNServer.launch(
			application.configuration,
			wflogger,
			// where the engine is: ENGINE_AT=http://... (with ENGINE_KEY), or none: everything but running and testing models
			{ ...application.serverOptions, calls: engineTests, ...(process.env.ENGINE_AT && process.env.ENGINE_AT !== 'local' ? { engine: process.env.ENGINE_AT, engineKey: process.env.ENGINE_KEY, ...(Number(process.env.ENGINE_TIMEOUT_MS) > 0 ? { engineTimeout: Number(process.env.ENGINE_TIMEOUT_MS) } : {}) } : {}) },
		);
		application.initialize?.(this.bpmnServer);
		// the Test tabs' tests are files beside the models
		useTestsFolder(() => this.bpmnServer.configuration.definitionsPath);

		this.setupExpress();
	
	}
		/**
	 * Create Express server.
	 */
	initExpress() {

		const app = express();
		/**
		 * Express configuration.
		 */
		app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
		app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000);
		app.set('views', path.join(__dirname, '../src/views'));
		app.set('view engine', 'pug');
		// the editors' bundles are cached for a year (public/): their URLs carry their build time, so a new build is
		// a new URL and a browser never keeps running an old one
		app.locals.asset = (file: string) => {
			try {
				return `${file}?v=${Math.round(fs.statSync(path.join(__dirname, '../public', file)).mtimeMs)}`;
			}
			catch {
				return file;
			}
		};
		app.use(compression());
		// Security headers. CSP is disabled because the modeler/UI loads inline scripts
		// and a CDN; HSTS only takes effect over HTTPS (harmless over HTTP).
		app.use(helmet({ contentSecurityPolicy: false }));
		// Trust the TLS-terminating proxy (or our own HTTPS listener) so `secure`
		// cookies and req.ip work. Enabled only when serving over TLS.
		if (process.env.HTTPS === 'true' || process.env.SECURE_COOKIES === 'true') {
			app.set('trust proxy', 1);
		}
        app.use(cors({
            origin: process.env.ITSM_HOST,
        }));
		// an AI link's key is a credential: not in the request log
		morgan.token('url', (req: any) => String(req.originalUrl || req.url).replace(/\/ai\/ai_[\w-]+/g, '/ai/ai_***'));
		app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
		const bodyLimit = process.env.BODY_LIMIT || '50mb';
		app.use(bodyParser.json({ limit: bodyLimit }));
		app.use(bodyParser.urlencoded({ limit: bodyLimit, extended: true }));

		app.use(busboy());

		// Unauthenticated health/readiness probe for load balancers (before auth).
		app.get('/healthz', (req, res) => {
			// mongo readyState: 0=disconnected 1=connected 2=connecting 3=disconnecting
			const mongoState = mongoose.connection?.readyState ?? 0;
			const ok = mongoState === 1;
			res.status(ok ? 200 : 503).json({
				status: ok ? 'ok' : 'degraded',
				uptime: process.uptime(),
				mongo: mongoState,
			});
		});

		this.app = app;
	}
	setupExpress() {
		const app = this.app;

		this.userManager.setup();

		this.setupRoutes();

		/**
		 * Error Handler.
		 */
		// a process that fails while running: what went wrong and what the model's checks find
		app.use(processRunErrorHandler);
		if (process.env.NODE_ENV === 'development') {
			// only use in development
			app.use(errorHandler());
		} else {
			app.use(errorDetailsHandler);
		}

	}

	/**
	 * Start the HTTP listener after the application and routes have been composed.
	 * Keeping this separate from construction allows applications and tests to use
	 * the Express app without opening a network port.
	 */
	start() {
		const app = this.app;
		const port = app.get('port');
		const useHttps =
			process.env.HTTPS === 'true' && !!process.env.SSL_KEY_PATH && !!process.env.SSL_CERT_PATH;

		let server;
		if (useHttps) {
			server = https.createServer(
				{ key: fs.readFileSync(process.env.SSL_KEY_PATH), cert: fs.readFileSync(process.env.SSL_CERT_PATH) },
				app,
			);
		} else {
			server = http.createServer(app);
		}

		server.listen(port, () => {
			const proto = useHttps ? 'https' : 'http';
			console.log('App is running at %s://localhost:%s in %s mode', proto, port, app.get('env'));
			console.log('  Press CTRL-C to stop\n');
		});

		this.server = server;
		this.installShutdownHandlers(server);

		return app;
	}

	/**
	 * Process-level resilience: log unhandled errors, and on SIGTERM/SIGINT stop
	 * accepting connections, stop the engine (timers off, running executions given
	 * ENGINE_SHUTDOWN_TIMEOUT_MS to finish and release their locks), close Mongo, then
	 * exit (force-exit after a timeout so a stuck connection can't block restart).
	 */
	installShutdownHandlers(server) {
		let stopping = false;
		const shutdown = (signal) => {
			if (stopping) return;
			stopping = true;
			console.log(`${signal} received — shutting down gracefully...`);
			const engineTimeoutMs = this.bpmnServer?.configuration?.shutdownTimeout ?? 10_000;
			const graceMs = 5_000;
			// the backstop: every stage below is bounded, this only catches what is not
			setTimeout(() => process.exit(1), engineTimeoutMs + 3 * graceMs).unref();
			gracefulShutdown({
				server,
				bpmnServer: this.bpmnServer,
				closeDatabase: () => mongoose.connection.close(false),
				engineTimeoutMs,
				graceMs,
			}).then(result => process.exit(result.clean ? 0 : 1), () => process.exit(1));
		};
		process.on('SIGTERM', () => shutdown('SIGTERM'));
		process.on('SIGINT', () => shutdown('SIGINT'));
		process.on('unhandledRejection', (reason) => console.error('Unhandled Rejection:', reason));
		process.on('uncaughtException', (err) => {
			console.error('Uncaught Exception:', err);
			process.exit(1);
		});
	}

	setupRoutes() {
		const { api = true, ui = true } = this.application;
		// the application's routes first, then the API routers: the UI router at '/' requires a session
		// for every path it sees, which would send API-key callers to /login.
		this.application.routes?.(this.app, this);
		// where an AI agent given this site's address starts; no sign-in
		this.app.get('/llms.txt', (req, res, next) => siteGuide(this, req).then(text => res.type('text/markdown').send(text), next));
		// a link for a person's AI agent: it acts as them on /api2, for minutes (routes/aiAccess.ts)
		this.app.get('/ai/key', (req, res) => {
			if (!req.user) {
				req.session.returnTo = req.originalUrl;
				return res.redirect('/login');
			}
			const issued = issueAiKey(req.user);
			const url = `${originOf(req)}/ai/${issued.key}`;
			if (req.query.format === 'json')
				return res.json({ url, expiresAt: issued.expiresAt, expiresInSeconds: issued.ttlMs / 1000, userName: req.user.userName, groups: issued.groups });
			res.render('aiKey', { title: 'A link for your AI agent', url, userName: req.user.userName, groups: issued.groups,
				expiresAt: issued.expiresAt, minutes: Math.round(issued.ttlMs / 60000),
				revoked: req.query.revoked !== undefined ? Number(req.query.revoked) : undefined });
		});
		this.app.post('/ai/revoke', (req, res) => {
			if (!req.user) return res.redirect('/login');
			res.redirect(`/ai/key?revoked=${revokeAiKeys(req.user.userName)}`);
		});
		// what the agent reads first: whom it acts as, until when, and where to start
		this.app.get('/ai/:key', (req, res) => {
			const holder = aiKeyHolder(req.params.key);
			res.type('text/markdown');
			if (!holder)
				return res.status(401).send('# This link no longer works\n\nIt expired, was revoked, or is not a link of this site. '
					+ 'Ask the person who gave it to you for a new one: they get it, signed in, at /ai/key.\n');
			const origin = originOf(req);
			res.send([
				'# Access to this BPMN Server',
				'',
				`You act as **${holder.userName}**${holder.groups.length ? ` (groups: ${holder.groups.join(', ')})` : ''}, `
					+ `until ${new Date(holder.expiresAt).toISOString()}: with their rights, no more.`,
				'',
				'## Rules',
				'',
				'1. Use curl only (or your own HTTP calls): never a browser, browser tool or computer use. The site\'s pages need a '
					+ 'sign-in you do not have; you would only see a login page.',
				`2. Use ${origin}/api2 only, never /api: this key works there and nowhere else.`,
				`3. Send the header \`x-api-key: ${req.params.key}\` on every call to /api2.`,
				'',
				'## Start',
				'',
				`- Read ${origin}/llms.txt (no key needed): this site, and how to build workflows on it.`,
				`- The operations: ${origin}/api2/openapi.json.`,
				'',
				'For example:',
				'',
				'```',
				`curl -H "x-api-key: ${req.params.key}" ${origin}/api2/models`,
				'```',
				'',
			].join('\n'));
		});
		if (api) {
			// API_TRACE: every API call and its answer, to replay what a client did
			this.app.use(['/api', '/api2'], apiTrace());
			this.app.use('/api', (new API(this)).config());
			this.app.use('/api2', (new API2(this)).config());
			if (!adminDisabled()) {
				this.app.use('/admin/api', (new API(this)).adminConfig());
				this.app.use('/admin/api2', (new API2(this)).adminConfig());
			}
			else
				this.app.use(['/admin/api', '/admin/api2'], (req, res) =>
					res.status(404).json({ errors: 'Administration is turned off on this server' }));
		}
		if (ui)
			this.setupUiRoutes();
	}

	setupUiRoutes() {
		var router = express.Router();
		var root=path.join(__dirname,'../');
		// a package's folder: in our node_modules, else in a parent's (npm workspaces install them at the root)
		const pkg = (name: string) => {
			for (let dir = root; ; dir = path.dirname(dir)) {
				const candidate = path.join(dir, 'node_modules', name);
				if (fs.existsSync(candidate) || dir === path.dirname(dir)) return candidate;
			}
		};

		router.use('/vendor/gsap', express.static(path.join(pkg('gsap'), 'dist'), { maxAge: 31557600000 }));
		router.use('/', express.static(path.join(root, 'public'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(pkg('chart.js'), 'dist'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(pkg('popper.js'), 'dist/umd'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(pkg('bootstrap'), 'dist/js'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(pkg('jquery'), 'dist'), { maxAge: 31557600000 }));
		router.use('/webfonts', express.static(path.join(pkg('@fortawesome/fontawesome-free'), 'webfonts'), { maxAge: 31557600000 }));
		this.app.use('/', router);

		this.app.use('/dashboard', (new Dashboards(this)).config());
		this.app.use('/', (new Workflow(this)).config());
		this.app.use('/user', (new EndUser(this)).config());
		this.app.use('/docs', (new Docs(this)).config());
		this.app.use('/model', (new Model(this)).config());
		// no such page: with the menu, as any other
		this.app.use((req, res) => answerMessage(req, res, 404, `There is no page ${req.path}`));

	}

}
