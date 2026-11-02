// Starts bpmn-web with this application's settings, delegate and connectors.
// npm start: the web server; npm run setup: prepares the database and stops; npm run cli: the console.
// SERVE in .env: both (default), api (the REST APIs only) or ui (the web pages only).
import { start } from 'bpmn-web';
import { config, connectorsPath } from './settings/config.js';
import { AppDelegate } from './delegates/appDelegate.js';

const serve = (process.env.SERVE || 'both').toLowerCase();

await start({
    config: config(),
    appDelegate: AppDelegate,
    elementTemplatesPath: connectorsPath,
    // the REST APIs: /api, /api2 (bpmn-client)
    api: serve !== 'ui',
    // the web pages: tasks, instances, the model editor, administration
    ui: serve !== 'api',
    setupOnly: process.argv.includes('--setup'),
    console: process.argv.includes('--cli'),
});
