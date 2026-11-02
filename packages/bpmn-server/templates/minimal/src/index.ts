// Starts bpmn-web with this application's settings and delegate.
// npm start: the web server; npm run setup: prepares the database and stops; npm run cli: the console.
import { start } from 'bpmn-web';
import { config } from './config.js';
import { AppDelegate } from './appDelegate.js';

await start({
    config,
    appDelegate: AppDelegate,
    // the REST APIs: /api, /api2 (bpmn-client)
    api: __API__,
    // the web pages: tasks, instances, the model editor, administration
    ui: __UI__,
    setupOnly: process.argv.includes('--setup'),
    // npm run cli: the console (start processes, list and complete tasks, locks, users)
    console: process.argv.includes('--cli'),
});
