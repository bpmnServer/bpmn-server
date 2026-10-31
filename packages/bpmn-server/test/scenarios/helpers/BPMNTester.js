// ESM test helper: shared BPMNServer instance + small assertion utilities.
import { BPMNServer, Logger } from '../feature/index.js';
import { configuration } from '../testConfiguration.js';

const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

const caseId = Math.floor(Math.random() * 10000);

let response;

async function delay(time) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            log("delayed is done.");
            resolve();
        }, time);
    });
}
function test1() {
    console.log('test1');
}

function log(msg) {
    logger.log(msg);
}
function displayItems() {
    console.log('instance data:', response.instance.data);
    response.instance.items.forEach(item => {
        console.log(`${item.elementId} -  ${item.status} - Item ${item.id}`);
    });
}
function getItem(id) {
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
}

export {
    BPMNServer, Logger,
    configuration,
    logger, server, response,
    caseId,
    test1, delay, getItem, displayItems, log,
};
