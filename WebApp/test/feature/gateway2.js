
const { BPMNServer , DefaultHandler , Logger } = require("../../");
const { configuration } = require('../testConfiguration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

let name = 'test_gateway2';

let process;
let response;
let instanceId;

Feature('Gateway', () => {

        Scenario('All', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, { reminderCounter: 0, caseId: 1005 });
            });
            When('Activity_1', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_1' }, {});
                });
            Then('Check waits 1', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('Activity_2_1').status).equals('wait');
                expect(getItem('Activity_2_4_1').status).equals('wait');
                expect(getItem('Activity_2_4_2').status).equals('wait');
                expect(getItem('Sub-process').status).equals('wait');

            });

            When('Activities 1', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_2_4_1' }, {});
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_2_4_2' }, {});
                });
            Then('Gateway_4 in wait ', () => {
                expect(getItem('Gateway_4').status).equals('wait');

            });
            When('Activities 2 ', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_2_1' }, {});
                });
            Then('Activity_3 in wait ', () => {
                expect(getItem('Activity_3').status).equals('wait');

            });
            When('Activity_3 ', async () => {
                savePoint(response,'before activity_3');
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'Activity_3' }, {});
                });
            Then('Activity_3 end ', () => {
                expect(getItem('Activity_3').status).equals('end');

            });

            and('write log file to' + name + '.log', async () => {
              let fileName = __dirname + '/../logs/' + name+ '.log';
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
function checkItems(id,status)
{
    const items = response.instance.items.filter(item => { return item.elementId == id; });
    let ret=true;
    items.forEach(item=>{
        console.log(`item.status ${item.nodeId} ${item.status} `);
        if (item.status!==status)
            ret=false;
        });
    console.log('ret',ret);
    return ret;
}
async function savePoint(response,msg) {
    logger.log('---- save point ----'+msg);
    response.execution.report();
    await response.execution.save();
    await server.cache.shutdown();
    logger.log('--------------------------');
  
}

///```
