
const { BPMNServer , DefaultHandler , Logger } = require("../../");
const { configuration } = require('../testConfiguration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

let name = 'test_gateway3';

let process;
let response;
let instanceId;

Feature('Gateway', () => {

        Scenario('All', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, { reminderCounter: 0, caseId: 1005 });
            });
            When('Buy', async () => {
                    response = await server.engine.invoke({id: response.id,"items.elementId": 'task_Buy'},
                             { needsCleaning: "Yes", needsRepairs: "Yes" });                
                    
                });
            Then('Check waits 1', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('task_repair').status).equals('wait');
                expect(getItem('task_clean').status).equals('wait');
                expect(getItem('Get_Ready').status).equals('wait');
            });

            When('Clean', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'task_clean' }, {});
                });
            Then('check gateway ', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('task_repair').status).equals('wait');
                expect(getItem('task_clean').status).equals('end');
                expect(getItem('Get_Ready').status).equals('wait');
                expect(getItem('Buy_Supplies').status).equals('wait');
                expect(getItem('gateway_2').status).equals('wait');
            });
            When('Repair', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'task_repair' }, {});
                });
            Then('check gateway ', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('task_repair').status).equals('end');
                expect(getItem('task_clean').status).equals('end');
                expect(getItem('Get_Ready').status).equals('wait');
                expect(getItem('gateway_2').status).equals('end');
                expect(getItem('task_Drive').status).equals('wait');
            });

            When('Drive', async () => {
                response = await server.engine.invoke({ id: response.id, "items.elementId": 'task_Drive' }, {});
                });
            Then('check gateway ', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('task_repair').status).equals('end');
                expect(getItem('task_clean').status).equals('end');
                expect(getItem('Get_Ready').status).equals('wait');
                expect(getItem('gateway_2').status).equals('end');
                expect(getItem('task_Drive').status).equals('end');
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
async function savePoint(response,msg) {
    logger.log('---- save point ----'+msg);
    response.execution.report();
    await response.execution.save();
    await server.cache.shutdown();
    logger.log('--------------------------');
  
}

///```
