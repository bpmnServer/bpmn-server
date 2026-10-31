import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __dirname = __dn(__f2p(import.meta.url));

import { BPMNServer ,BPMNAPI,SecureUser , Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

const api = new BPMNAPI(server);
const user = new SecureUser({userName:'user1',userGroups:['Employee']});

let name = 'test-wait-invoke';
let response;
let instanceId;


Feature('No Wait', () => {

        Scenario('with NoWait not enabled', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, { reminderCounter: 0, caseId: 1005 });
            });
            Then('events should fire and wait', () => {

                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                report(response.execution.instance); 
            });
            Given('after wait - timer should have completed',async () => {
                response=await api.engine.invoke({ "id": response.instance.id, "items.elementId": 'Activity_0z113lq'},{},user,{});
                report(response.execution.instance); 
            });
            Then('total of 9 items have end', () => {
                expect(getItem('StartEvent_1').status).equals('end');
                expect(getItem('Activity_0z113lq').status).equals('end');
                expect(response.instance.items.filter(item=>{return item.status=='end';}).length).equals(9);
            });
      
            and('write log file to' + name + '.log', async () => {
              let fileName = __dirname + '/../logs/' + name+ '.log';
              logger.save(fileName);
            });

        });
        Scenario('with NoWait option ', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, { reminderCounter: 0, caseId: 1005 });
            });
            Then('events should fire and wait', () => {

                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                report(response.execution.instance); 
            });
            Given('after wait - timer should have completed',async () => {
                response=await api.engine.invoke({ "id": response.instance.id, "items.elementId": 'Activity_0z113lq'},{},user,{noWait:true});
                report(response.execution.instance); 
            });
            Then('only 3 items have end', () => {
                expect(getItem('StartEvent_1').status).equals('end');
                expect(getItem('Activity_0z113lq').status).equals('end');
                expect(response.instance.items.filter(item=>{return item.status=='end';}).length).equals(3);
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
function report(instance) {
    instance.items.forEach(item => {
        console.log('       --item',item.seq,item.elementId,item.type,item.status,item.userName,'assignee:',item.assignee,item.candidateUsers,item.candidateGroups,item.dueDate);
    });
}

///```
