import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __filename = __f2p(import.meta.url);
const __dirname = __dn(__filename);

import { BPMNServer  , Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false});

const server = new BPMNServer(configuration, logger, { cron: true });

let name = 'Issue197A.txt';

let process;
let response;
let items;
let instances;
let caseId = 5501;
Feature('Gateway before subprocess-Loops', () => {
/*
        Scenario('Normal Flow', () => {

            Given('Start', async () => {
                response = await server.engine.start(name, { caseId: caseId,scenario:' normal flow'});
            });
            Then('find 1 item waiting:', async () => {

                items= response.instance.items;
                let list=items.filter(i=>{return i.elementId=='Activity_1olobi3'});
                 expect(list.length).equals(2);
            });
            Given('invoke the item:', async () => {
                console.log('invoking');
                response = await server.engine.invoke({"id":response.id, "items.elementId": 'Activity_1olobi3',"items.itemKey":"IT" }, {"vote":"true"});
                response = await server.engine.invoke({"id":response.id, "items.elementId": 'Activity_1olobi3',"items.itemKey":"HR" }, {"vote":"true"});
            });
            Then('Summary is ready:', async () => {

                let item=getItem('Activity_1mx9fl7');
                expect(item.status).equals('wait');
            });
            Then('Invoke:', async () => {
                response = await server.engine.invoke({"id":response.id, "items.elementId": 'Activity_1mx9fl7' }, {});
            });
            let fileName = __dirname + '/../logs/'+name+'.log';
            Then('Summary is done:', async () => {
                let item=getItem('Event_1jag0kh');
                expect(item.status).equals('end');
            });

            and('write log file to ' + fileName, async () => {
                logger.save(fileName);
                //                console.log('filename:', __filename);
            }); 

        });
*/
        Scenario('Cancel Flow', () => {

            Given('Start', async () => {
                response = await server.engine.start(name, { caseId: caseId,scenario:' normal flow'});
            });
            Then('find 1 item waiting:', async () => {

                items= response.instance.items;
                let list=items.filter(i=>{return i.elementId=='Activity_1olobi3'});
                 expect(list.length).equals(2);
            });
            Given('invoke the cancel:', async () => {
                console.log('invoking');
                response = await server.engine.invoke({"id":response.id, "items.elementId": 'Event_0qsfmsy',"items.itemKey":"IT" }, {"vote":"true"});
            });
            Then('All is cancelled:', async () => {
                listItems();
                expect(getItem('Activity_1olobi3').status).equals('end');
                expect(getItem('Event_0qsfmsy').status).equals('end');
                expect(getItem('Activity_1hcyu4w').status).equals('end');
                expect(getItem('Event_1s6yeg2').status).equals('end');
            });
            let fileName = __dirname + '/../logs/'+name+'.log';
            and('write log file to ' + fileName, async () => {
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
function listItems() {
    response.instance.items.forEach(item=>{
        console.log('>item:',item.seq,item.elementId,item.itemKey,item.status);
    });
}



function getItem(id,key=null)
{
    const items=response.instance.items.filter(function(item){

        if (id===item.elementId) {
            if (key && key===item.itemKey)
                return true;
            else
                return true;
        }
        return false;

    });

    return items[0];
}


