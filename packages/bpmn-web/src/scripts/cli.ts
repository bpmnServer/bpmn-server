// bpmn-web's own console (npm run cli), on the sample application's configuration
import "dotenv/config";
import { BPMNServer, Logger } from "bpmn-server";
import { configuration } from '../sample-app/configuration.js';
import { runConsole } from '../console.js';

await runConsole(new BPMNServer(configuration, new Logger({ toConsole: false }), { cron: false }));
