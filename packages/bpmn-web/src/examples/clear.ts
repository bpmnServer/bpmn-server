import { EventEmitter } from "events";

import { configuration } from './';
import { BPMNServer, Logger } from './';


const fs = require('fs');

const logger = new Logger({ toConsole: false });

clear();
async function clear() {

    const server = new BPMNServer(configuration, logger, { cron: false });
    let res = await server.dataStore.deleteInstances();
    console.log("deleted ", res['result']['n']);

    process.exit();
}
