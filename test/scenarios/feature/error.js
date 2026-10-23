
import { BPMNServer  , Logger } from './index.js';
import { configuration } from './index.js';

const logger = new Logger({ toConsole: false , includeLog: false });

const server = new BPMNServer(configuration, logger);

let name = 'Error events';

let process;
let response;
let instanceId;

testAll(9);

async function testAll(seq) {

    if (seq==1  ||seq==9)
   await runTest(7010,'Complete Process',{"Require_Review":"","Error_Code":""},
    ['UserTask2','EndEventNormal'],
    ['StartEvent_14s2cpf','BoundaryEvent_catchErrors','StartEvent_catchErrors']);  

    if (seq==2||seq==9)
    await runTest(7011,'Raise Escalation',{"Require_Review":"true","Error_Code":""},
    ['UserTask2','EndEventNormal','Event_0ce8dnc','Event_catchEsclation','Event_1e95dbp'],
    ['StartEvent_14s2cpf','BoundaryEvent_catchErrors','StartEvent_catchErrors']);  

    
    if (seq==3||seq==9)
    await runTest(7012,'Error 1',{"Require_Review":"true","Error_Code":"Error1"},
    ['UserTask2','Event_error1','Event_0ce8dnc','Event_catchEsclation','Event_1e95dbp','StartEvent_catchErrors','EndEvent_subprocessErrorHandler'],
    ['StartEvent_14s2cpf','BoundaryEvent_catchErrors']);  


    if (seq==4||seq==9)
    await runTest(7013,'Error 2',{"Require_Review":"true","Error_Code":"Error2"},
    ['UserTask2','Event_error2','BoundaryEvent_catchErrors','Event_catchEsclation','Event_1e95dbp','EndEvent_17fzol9'],
    ['StartEvent_14s2cpf','StartEvent_catchErrors']);  


    if (seq==5||seq==9)
    await runTest(7014,'Error 3',{"Require_Review":"true","Error_Code":"Error3"},
    ['UserTask2','Event_error3','Event_catchEsclation','Event_1e95dbp','StartEvent_14s2cpf'],
    ['StartEvent_catchErrors','BoundaryEvent_catchErrors']);  


    if (seq==6||seq==9)
    await runTest(7015,'Error 4',{"Require_Review":"true","Error_Code":"Error4"},
    ['UserTask2','Event_error4','Event_catchEsclation','Event_1e95dbp','Event_catch_all'],
    ['StartEvent_14s2cpf','BoundaryEvent_catchErrors']);  

    
   await logger.save('trans.log');
}
async function runTest(caseId,scenario,data,completeItems,cancelledItems) {

    Feature('Error Events', () =>{
        Scenario(scenario, () => {

            Given('start',async () =>{

                response=await server.engine.start(name,{caseId,scenario});

            });
            Given('invoke',async () =>{

                response=await server.engine.invoke({id:response.instance.id,'items.elementId':'UserTask2'},data);
//                listItems();

            });

                completeItems.forEach(item=>{

                    Then('check '+item+' end',()=>{
                        expect(getItem(item).status).equals('end');
                    });
                });

                cancelledItems.forEach(item=>{
                    Then('check '+item+' cancelled',()=>{

                    expect(getItem(item).status).equals('end');
                    expect(getItem(item).endedAt).equals(null);
                    });
                });
            });
        
    });

}


async function invoke(id,data={}) {
    response = await server.engine.invoke({
        "items.elementId": id,
        "id": response.instance.id },data);

}
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
        console.log('>item:',item.seq,item.elementId,item.status,item.endedAt);
    });
}
///```
