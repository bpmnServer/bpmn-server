
import { BPMNServer  , Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

const listener = server.listener;

function listen() {

let lastCall;
    listener.on('all', async function ({ context, event,eventDetails }) {
    let r=false;
    let item=context.item;
    switch(event)
    {
        case 'enter':
        case 'transformInput':
        case 'process.saving':
        case 'process.end':
        case 'process.restored':
        case 'validate':
            break;
        case 'end':
        default:
            if (item)
                {
                    if (eventDetails.cancel===true)
                        event='cancel';
                    console.log(`----->Event: '${event}'    -#${item.seq}   for ${item.element.type} '${item.element.id}'`,eventDetails);

                }
            else
                console.log('----->All:' + event, context.definition.name,eventDetails);
       }
    });
}

let name = 'Trans';

let process;
let response;
let instanceId;

/*
let msg=logger.logS('msg1');
msg=logger.log('msg2');
msg=logger.log('msg3');
msg=logger.log('msg4');
msg=logger.logE('msg1-end');

msg=logger.logS('msg11');
msg=logger.log('msg12');
msg=logger.log('msg13');
msg=logger.log('msg14');
msg=logger.logE('msg11-end')


console.log(logger.debugMsgs);
*/
testAll();

async function testAll() {

   await runTest(6010,'Complete Process',{},{},'Event_end','end');  //works fine
   
   console.log('--log',response.instance.log);
  return;

   await runTest(6011,'Error thrown',{error:'true'},null,'Event_end_error','end');

   await runTest(6012,'Cancel thrown',{cancel:'true'},null,'Activity_after_trans_cancel','end');
   
   await runTest(6013,'Cancel after Complete Process',{},{cancel2:'true'},'Activity_cancelHotel','end'); 
    
   await logger.save('trans.log');
}
async function runTest(caseId,scenario,data1,data2,checkItem,checkStatus) {

    Feature('Transaction', () =>{
        Scenario(scenario, () => {

            Given('invoke',async () =>{

                response=await server.engine.start(name,{caseId,scenario});

                response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_bookFlight'},{});
                response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_bookHotel'},{});
                response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_confirm'},data1);
                if (data2)
                    response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_after_trans'},data2);
            });
            Then('output:'+checkItem+' to be '+checkStatus,()=>{
//                listItems();
                expect(getItem(checkItem).status).equals(checkStatus);

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
        console.log('>item:',item.seq,item.elementId,item.status);
    });
}
///```
