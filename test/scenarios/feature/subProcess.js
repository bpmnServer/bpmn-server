import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __dirname = __dn(__f2p(import.meta.url));

import { BPMNServer  , Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

let name = 'SubProcess';

let process;
let response;
let instanceId;

Feature('SubProcess', () => {

        Scenario('All', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, { caseId:4001, task_subProcess: { clients: ['abc', 'mbc', 'cbc'] } });
            });
            Then('design is waiting:', () => {
                expect(getItem('Task_design').status).equals('wait');
            });

            Given('continue ', async () => {

            response = await server.engine.invoke({
                "items.elementId": "Task_design",
                "id": response.instance.id });
        
            });
            Then('task2 is waiting:', () => {
                expect(getItem('sub_usertask_2').status).equals('wait');
                let items=response.instance.items.filter(item => { return item.elementId == 'sub_task_1'; })
                expect(items.length).equals(3);
            });

            Given('continue2 ', async () => {
                response = await server.engine.invoke({
                    "items.elementId": "sub_usertask_2",
                    "id": response.instance.id 
                });
            });
        
            Then('task2 is waiting:', () => {
                expect(getItem('EndEvent_08zhy2j').status).equals('end');
            });
        
        
            and('write log file to' + name + '.log', async () => {
                let fileName = __dirname + '/../logs/' + name + '.log';
                logger.save(fileName);
            });
        });

        // --------------------------------------------------------------------------------------------------------------
        //
        Scenario('Cancel', () => {

            Given('Start Process', async () => {
                response = await server.engine.start(name, {caseId: 4002, task_subProcess: { clients: ['abc', 'mbc', 'cbc'] } });
            });
            Then('design is waiting:', () => {
                expect(getItem('Task_design').status).equals('wait');
            });

            Given('continue ', async () => {

                response = await server.engine.invoke({
                    "items.elementId": "Task_design",
                    "id": response.instance.id });
            
                });
            Then('task2 is waiting:', () => {
                expect(getItem('sub_usertask_2').status).equals('wait');
            });

            Given('invoke-cancel ', async () => {
                response = await server.engine.invoke({
                    "items.elementId": "Event_cancel",
                    "id": response.instance.id 
                });
            });
        
            Then('end 2 event is done:', () => {
                expect(getItem('Event_0eg36vn').status).equals('end');
            });
        
            and('subprocess has cancelled:', () => {
                expect(getItem('task_subProcess').status).equals('end');
                expect(getItem('task_subProcess').endedAt).equals(null);

                expect(getItem('sub_usertask_2').status).equals('end');
                expect(getItem('sub_usertask_2').endedAt).equals(null);
                
            });
        
            and('write log file to' + name + '.log', async () => {
                let fileName = __dirname + '/../logs/' + name + '2.log';
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

function listItems() {
    response.instance.items.forEach(item=>{
        console.log('>item:',item.seq,item.elementId,item.status,item.itemKey);
    });
}
///```
