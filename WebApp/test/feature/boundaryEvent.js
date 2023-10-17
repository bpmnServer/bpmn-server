///@boundary-events.md
///# Boundary Events Example

///![BPMN Diagram](boundary-event1.png)

///Boundary Events are started with the owner Activity, but are cancelled when the the owner activity is completed.

///```javascript

const { BPMNServer, DefaultHandler, Logger } = require("../../");
const { configuration } = require('../testConfiguration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
var caseId = Math.floor(Math.random() * 10000);

let name = 'boundary-event';
let response;
let instanceId;

Feature('Boundary Event', () => {

        Scenario('1. do the task right-away- events will end', () => {
            Given('Start '+ name + ' Process',async () => {
                response = await server.engine.start(name, {caseId:1001});
                instanceId=response.instance.id;
            });
            Then('check for output', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('user_task').status).equals('wait');
                expect(getItem('Reminder-Timer').status).equals('wait');
                expect(getItem('Expired-Timer').status).equals('wait');
                expect(getItem('Cancel-Message').status).equals('wait');
            });

            When('I invoke user_task', async () => {

                const data = { };
                const query ={
                   id: instanceId ,
                    "items.elementId" : 'user_task' };
                response= await server.engine.invoke(query ,data );
            });


            Then('All events are complete', async () => {

                expect(getItem('user_task').status).equals('end');
                expect(getItem('Reminder-Timer').status).equals('end');
                expect(getItem('Reminder-Timer').endedAt).equals(null);
                expect(getItem('Expired-Timer').status).equals('end');
                expect(getItem('Expired-Timer').endedAt).equals(null);
                expect(getItem('Cancel-Message').status).equals('end');
                expect(getItem('Cancel-Message').endedAt).equals(null);
                expect(getItem('process_request').status).equals('end');
                expect(getItem('event_end').status).equals('end');

            });

            let fileName = __dirname + '/../logs/'+ name +'1.log';

            and('write log file to ' + fileName, async () => {
              logger.save(fileName);
            });
        });

            Scenario('2. Dont do the task right - away, wait for timer to fire', () => {
                Given('Start ' + name + ' Process', async () => {
                    response = await server.engine.start(name, {caseId:1002, scenario: 'wait for timers' });
                    instanceId=response.instance.id;
                    console.log('---------',instanceId);
                });

                When('wait for the reminder timers to fire', async () => {

                    await delay(16000);
                    response = await server.engine.get({id: instanceId});
                   
                });
  
                Then('      user task : wait', () => {
                    expect(getItem('user_task').status).equals('wait');
                });
                Then('      reminder timer :end', () => {
                    expect(getItem('Reminder-Timer').status).equals('end');
                });
                Then('      expired timer : wait', () => {
                    expect(getItem('Expired-Timer').status).equals('wait');
                });
                Then('      cancel message : wait', () => {
                    expect(getItem('Cancel-Message').status).equals('wait');
                });
                
                When('wait for the expired timer to fire', async () => {

                    await delay(25000);
                    response = await server.engine.get({id: instanceId});
                    displayItems();
                });

                    Then('      user task : end', () => {
                        expect(getItem('user_task').status).equals('end');
                    });
                    Then('      reminder timer : end', () => {
                        expect(getItem('Reminder-Timer').status).equals('end');
                    });
                    Then('      expired timer : end', () => {
                        expect(getItem('Expired-Timer').status).equals('end');
                    });
                    Then('      cancel message : end', () => {
                        expect(getItem('Cancel-Message').status).equals('end');
                    });

///```
///![BPMN Diagram](boundary-event3.png)
///
///
///```javascript
                /*
            When('I wait for events to complete', async () => {

                expect(getItem('BoundaryEvent_timer').status).equals('end');
                expect(getItem('BoundaryEvent_message').status).equals('wait');
                expect(getItem('task_2').status).equals('end');     // issue reminder
                

            }); */

            let fileName = __dirname + '/../logs/' + name + '.log';

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
function displayItems() {
    console.log('instance data:', response.instance.data);
    response.instance.items.forEach(item => {
        console.log(`${item.elementId} -  ${item.status} - Item ${item.id}`);   
    });

}
function getItem(id)
{
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
}