// OWF (OmniWorkflow) beside a business application: bpmn-web with this application's settings, delegate and connectors.
// The business application (hrdemo2) is a server of its own: the connector `hr` calls its API (HR_API_BASE_URL, HR_SERVICE_KEY),
// and it calls this server's API v3 for its people's tasks (OWF_URL, OWF_SERVICE_KEY there: this server's API_KEY).
// npm start: the web server; npm run setup: the settings step by step (bpmn-server setup), then prepares the database and stops; npm run cli: the console.
// SERVE in .env: both (default), api (the REST APIs only) or ui (the web pages only).
import { start } from 'bpmn-web';
import { config, connectorsPath } from './settings/config.js';
import { AppDelegate } from './delegates/appDelegate.js';
import { hrConnector } from './integration/hrConnector.js';

const serve = (process.env.SERVE || 'both').toLowerCase();

const webApp = await start({
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
await hrConnector(webApp.bpmnServer);
