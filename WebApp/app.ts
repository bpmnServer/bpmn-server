console.log("bpmn-server WebApp.ts version "+ getVersion());

import debug = require('debug');

/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
//NOPASSPORT const passport = require('passport');
//const sass = require('node-sass-middleware');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') });

import { BPMNServer, Logger } from './';


import { configuration as config } from './configuration';


var busboy = require('connect-busboy'); //middleware for form/file upload


function getVersion() {
	const fs = require('fs');

	const configPath = __dirname + '/package.json';

	if (fs.existsSync(configPath)) {

		var configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'));
		var _version = configuration['version'];
		return _version;
	}
	else
		return 'cannot locate package.json current: ' + __dirname + ' path ' + configPath;


}

export class WebApp {
	app;
//NOPASSPORT 	passport;
//NOPASSPORT passportConfig;
	bpmnServer;

	constructor() {

//NOPASSPORT 		this.passport = passport;
//NOPASSPORT 		this.passportConfig = require('./config/passport');

		this.initExpress();
		this.initMongo();
//NOPASSPORT 		this.initPassport();
		const wflogger = new Logger({ toConsole: true });


		this.bpmnServer = new BPMNServer(config,wflogger);
		this.bpmnServer.appDelegate.winSocket = null;

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
		app.set('views', path.join(__dirname, 'views'));
		app.set('view engine', 'pug');
		app.use(compression());
		/*app.use(sass({
		  src: path.join(__dirname, 'public'),
		  dest: path.join(__dirname, 'public')
		}));*/
		app.use(logger('dev'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(session({
			resave: true,
			saveUninitialized: true,
			secret: process.env.SESSION_SECRET,
			cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
			store: new MongoStore({
				url: process.env.MONGO_DB_URL,
				autoReconnect: true,
			})
		}));
		app.use(busboy());

		this.app = app;
	}

	initMongo() {

		/*mongoose.set('useFindAndModify', false);
		mongoose.set('useCreateIndex', true);
		mongoose.set('useNewUrlParser', true);
		mongoose.set('useUnifiedTopology', true); */
		console.log("MongoDB URL", process.env.MONGO_DB_URL)
		mongoose.set('strictQuery', true);
		mongoose.connect(process.env.MONGO_DB_URL);
		mongoose.connection.on('error', (err) => {
			console.error(err);
			console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
			process.exit();
		});

		mongoose.connection.on('open', function () {
			console.log('db connection open');
		});

	}
	/* //NOPASSPORT
	initPassport() {
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		this.app.use(flash());
		this.app.use((req, res, next) => {
			if (req.path === '/api/upload') {
				// Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
				next();
			} else {
				lusca.csrf()(req, res, next);
			}
		});

	} */
	setupExpress() {
		const app = this.app;

		app.use(lusca.xframe('SAMEORIGIN'));
		app.use(lusca.xssProtection(true));
		app.disable('x-powered-by');
		app.use((req, res, next) => {
			res.locals.user = req.user;
			next();
		});

		/* //NOPASSPORT
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
		*/
		

		this.setupRoutes();

		/**
		 * Error Handler.
		 */
		if (process.env.NODE_ENV === 'development') {
			// only use in development
			app.use(errorHandler());
		} else {
			app.use((err, req, res, next) => {
				console.error(err);
				res.status(500).send('Server Error');
			});
		}

		/**
		 * Start Express server.
		 */
		app.listen(app.get('port'), () => {
			console.log('App is running at http://localhost:%s in %s mode', app.get('port'), app.get('env'));
			console.log('  Press CTRL-C to stop\n');
		});
		return app;
	}

	setupRoutes() {
		var router = express.Router();

		router.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
		router.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
		router.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));
		this.app.use('/', router);

		var Common = require("./routes/common");


		var Workflow = require("./routes/index").Workflow;
		//NOPASSPORT var Account = require("./routes/account").Account;
		var Docs = require("./routes/docs").Docs;
		var Model = require("./routes/model").Model;
		var API = require("./routes/api").API;

		this.app.use('/', (new Workflow(this)).config());
		//NOPASSPORT 		this.app.use('/', (new Account(this)).config());
		this.app.use('/docs', (new Docs(this)).config());
		this.app.use('/model', (new Model(this)).config());
		this.app.use('/api', (new API(this)).config());

	}

}

/** Main logic
*/
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

dotenv.config({ path: '.env' });

const webApp = new WebApp();

module.exports = webApp.app;

