// The HR demo application with BPMN Server (owf) in one server: the workflow pages and APIs, and the HR application's
// own pages at /hr and API at /api/hr, which models call through the connector `hr`. The HR application signs people
// in (server/userManager.js): bpmn-web keeps no users or sessions of its own.
// npm start: builds the HR pages, then the server; npm run setup: the settings step by step (bpmn-server setup), then
// prepares the database and stops; npm run cli: the console.
// SERVE in .env: both (default), api (the REST APIs only) or ui (the web pages only).
import { start } from 'bpmn-web';
import { config, connectorsPath } from './workflow/settings/config.js';
import { AppDelegate } from './workflow/delegates/appDelegate.js';
import { hrRoutes, hrConnector } from './server/routes.js';
import { hrPages } from './server/pages.js';
import { HrUserManager } from './server/userManager.js';

const serve = (process.env.SERVE || 'both').toLowerCase();

// who signs in: the HR application's users and sessions (its own database), for its pages and the workflow pages alike
const userManager = new HrUserManager();

const webApp = await start({
    config: config(),
    appDelegate: AppDelegate,
    userManager,
    elementTemplatesPath: connectorsPath,
    // the HR application, in this process: mounted before bpmn-web's routes
    routes: app => {
        hrRoutes(app);
        if (serve !== 'api') hrPages(app);
    },
    // the REST APIs: /api, /api2 (bpmn-client)
    api: serve !== 'ui',
    // the web pages: tasks, instances, the model editor, administration
    ui: serve !== 'api',
    setupOnly: process.argv.includes('--setup'),
    console: process.argv.includes('--cli'),
});
await hrConnector(webApp.bpmnServer);
