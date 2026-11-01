// Starts bpmn-web with this application's settings, delegate and connectors.
// npm start: the web server; npm run debug: the same with the inspector; npm run setup: prepares the
// database and stops; npm run cli: the console.
import { start } from 'bpmn-web';
import { config, connectorsPath } from './settings/config.js';
import { AppDelegate } from './delegates/appDelegate.js';

await start({
    config: config(),
    appDelegate: AppDelegate,
    elementTemplatesPath: connectorsPath,
    setupOnly: process.argv.includes('--setup'),
    console: process.argv.includes('--cli'),
});
