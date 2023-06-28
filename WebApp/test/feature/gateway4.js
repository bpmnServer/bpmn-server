
const { BPMNServer , DefaultHandler , Logger } = require("../../");
const { configuration } = require('../testConfiguration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

let name = 'test_gateway4';

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
                expect(getItem('R1').status).equals('wait');
                expect(getItem('R2').status).equals('wait');
                expect(getItem('T1').status).equals('wait');
                expect(getItem('T2').status).equals('wait');
            });

            When('R1', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'R1' }, {});
                });
            Then('check gateway ', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('R1').status).equals('end');
                expect(getItem('R2').status).equals('end');
                expect(getItem('T1').status).equals('end');
                expect(getItem('T2').status).equals('end');
            });
      
            and('write log file to' + name + '.log', async () => {
              let fileName = __dirname + '/../logs/' + name+ '_1.log';
              logger.save(fileName);
            });

        });

        Scenario('Fire Timer', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, { caseId: 1005 });
            });
            Then('Check waits 1', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('R1').status).equals('wait');
                expect(getItem('R2').status).equals('wait');
                expect(getItem('T1').status).equals('wait');
                expect(getItem('T2').status).equals('wait');
            });

            When('R1', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'T1' }, {});
                });
            Then('check gateway ', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('R1').status).equals('end');
                expect(getItem('R2').status).equals('end');
                expect(getItem('T1').status).equals('end');
                expect(getItem('T2').status).equals('end');
            });
      
            and('write log file to' + name + '.log', async () => {
              let fileName = __dirname + '/../logs/' + name+ '_2.log';
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
