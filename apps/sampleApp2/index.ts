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

// A demonstration on your own machine, with no sign-in (npm run demo, or DEMO_NO_LOGIN=true): bpmn-web's
// REQUIRE_AUTHENTICATION=false, under which whoever reaches this server is an administrator. So it is refused in production, and
// answers this machine only. The API stays as it is: the business application still calls it with the service key and a token.
const demo = String(process.env.DEMO_NO_LOGIN ?? '').trim().toLowerCase() === 'true';
if (demo) {
    if (process.env.NODE_ENV === 'production')
        throw new Error('DEMO_NO_LOGIN is for a demonstration on your own machine: not with NODE_ENV=production');
    process.env.REQUIRE_AUTHENTICATION = 'false';
    console.warn('\n  DEMO, NO SIGN-IN: whoever reaches this server is an administrator. It answers this machine only. Not for a shared server.\n');
}
const thisMachine = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

const webApp = await start({
    config: config(),
    appDelegate: AppDelegate,
    elementTemplatesPath: connectorsPath,
    // in the demonstration with no sign-in: this machine only (mounted before bpmn-web's routes)
    routes: demo ? app => app.use((req, res, next) => thisMachine.has(req.socket.remoteAddress ?? '') ? next() : res.status(403).send('This demonstration answers the machine it runs on only.')) : undefined,
    // the REST APIs: /api, /api2 (bpmn-client)
    api: serve !== 'ui',
    // the web pages: tasks, instances, the model editor, administration
    ui: serve !== 'api',
    setupOnly: process.argv.includes('--setup'),
    console: process.argv.includes('--cli'),
});
await hrConnector(webApp.bpmnServer);
