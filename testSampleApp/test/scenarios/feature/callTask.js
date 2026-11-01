import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __filename = __f2p(import.meta.url);
const __dirname = __dn(__filename);
console.log('----', __filename);
///@gateway.md
///# Call Activity:

///![BPMN Diagram](ebg1.png)

///Event Based Gateway launches all valid outbound flows, but once on event is completed, it must cancel the rest.

///```javascript

import { BPMNServer  , Logger } from './index.js';
import { configuration } from './index.js';


const logger = new Logger({ toConsole: false , includeLog: true });

const server = new BPMNServer(configuration, logger);

let name = 'CallTask';

let process;
let response;
let instanceId;
let response1;

Feature('CallTask', () => {

        Scenario('All', () => {

            Given('Start Process', async () => {
                const del=await server.dataStore.deleteInstances({"data.caseId": 1005});
                console.log('deleted ', del.result);
            
                let instances=await server.dataStore.findInstances({"data.caseId":1005},{})
                console.log(instances.length);
            
                response = await server.engine.start(name, {caseId: 1005 });
                response1=response;
            });
            Then('events should fire and wait',async () => {

                //listItems();
                let instances=await server.dataStore.findInstances({"data.caseId":1005})
                //console.log(instances.length);
                response=await server.engine.invoke({"data.caseId":1005,"items.elementId":'task_Buy'});
                response=await server.engine.invoke({"data.caseId":1005,"items.elementId":'task_Drive'});
                //listItems();

            });
            Then('called process is done',async () => {

                expect(getItem('task_Drive').status).equals('end');
                expect(getItem('Event_19ebav7').status).equals('end');

            });
            Then('calling process activity_call is done',async () => {
                response=await server.engine.get({"id":response1.id});
                expect(getItem('activity_call').status).equals('end');

            });
            Then('calling process end event is done',async () => {
                response=await server.engine.get({"id":response1.id});
                expect(getItem('Event_1wxl4bq').status).equals('end');

            });
///```
///to visualize the process, let us borrow from the WebApp
///![BPMN Diagram](ebg2.png)

///    ```javascript
            When('we wait a bit for timer to complete', async () => {
                // we restore to get latest status; since the timer did some work in the background!

            });

            Then('after wait - timer should have completed', () => {
            });
            and('other events complete as well', () => {
            });

            and('also reminder task will fire', () => {
            });
///```
///again, let us see what it looks like now!
//![BPMN Diagram](ebg3.png)

///    ```javascript

            When('we issue reminder', async () => {

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

function listItems() {
    response.instance.items.forEach(item=>{
        console.log('>item:',item.seq,item.elementId,item.status,item.endedAt);
    });
}

///```
