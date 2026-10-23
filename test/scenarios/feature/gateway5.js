import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __dirname = __dn(__f2p(import.meta.url));

import { BPMNServer  , Logger } from './index.js';
import { configuration } from './index.js';

console.log('config',configuration);

const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

let name = 'test_gateway5';

let process;
let response;
let instanceId;

Feature('Gateway', () => {

        Scenario('Run Task', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, { caseId: 1005 });

            });
            Then('Check waits 1', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('Activity_1m6hqy8').status).equals('wait');
            });

            When('Create Vote', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_1m6hqy8' }, {"vote":"true"});
                });
            Then('check gateway ', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('Gateway_1jwui8m').status).equals('end');
                expect(getItem('Event_1b19bas').status).equals('end');
                expect(getItem('Activity_1uh26d0').status).equals('wait');
            });
      
            and('write log file to' + name + '.log', async () => {
              let fileName = __dirname + '/../logs/' + name+ '_1.log';
              logger.save(fileName);
            });

        });

}); 
async function delay(time) {
    log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            log("delayed is done.");
            resolve();
        }, time);
    });
}
function log(msg) {
    logger.log(msg);
}
function getItem(id)
{
    const item = response.instance.items.filter(item => { return item.elementId == id; })[0]
    if (!item) {
        log('item ' + id + ' not found');
    }
    return item;
}
async function savePoint(response,msg) {
    logger.log('---- save point ----'+msg);
    response.execution.report();
    await response.execution.save();
    await server.cache.shutdown();
    logger.log('--------------------------');
  
}

///```
