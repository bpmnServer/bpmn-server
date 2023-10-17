///@boundary-events.md
///# Boundary Events Example

///![BPMN Diagram](boundary-event1.png)

///Boundary Events are started with the owner Activity, but are cancelled when the the owner activity is completed.

///```javascript
/*
const { BPMNServer, DefaultHandler, Logger } = require("../../");
const { configuration } = require('../testConfiguration');

const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);

*/
const { BPMNServer, DefaultHandler, Logger , logger,server,caseId, delay } = require('../helpers/BPMNTester');

let name = 'test-boundary-timer';
let response;
let instanceId;


Feature('Boundary Event', () => {
///```
///## Do the task right-away
///```javascript
        Scenario('1. do the task right-away- events will end', () => {
            Given('Start '+ name + ' Process',async () => {
                response = await server.engine.start(name, {caseId:caseId});
            });
            Then('check for output', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                displayItems();
                expect(getItem('UT1').status).equals('wait');
            });
///```
///![BPMN Diagram](boundary-event2.png)
///
///boundary events have started in a wait state
///```javascript

            When('I invoke user_task', async () => {

                const data = { };
                const query ={
                   id: instanceId ,
                    "items.elementId" : 'UT1' };
                response= await server.engine.invoke(query ,data );
            });
///```
///![BPMN Diagram](boundary-event-nowait.png)
///
///Events are terminated.
///```javascript

            Then('After 20 seconds, All timer event is complete', async () => {
                await delay(20000);
                response=await server.engine.get({id:instanceId});
                log('after wait '+response.id+' '+response.instance.items.length);
//                displayItems();

                expect(getItem('UT1').status).equals('end');

            });

            Then('UT2 is now waiting', async () => {
                displayItems();
                 expect(getItem('UT2').status).equals('wait');
   

            });


            let fileName = __dirname + '/../logs/'+ name +'.log';

            and('write log file to ' + fileName, async () => {
              logger.save(fileName);
            });
        });
        });

function log(msg) {
    logger.log(msg);
    console.log(msg);
}
function displayItems() {
    log('instance data:'+ response.instance.data);
    response.instance.items.forEach(item => {

        log(`${item.elementId} -  ${item.status} - Item ${item.id}`);   
    });

}
function getItem(id)
{
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
}