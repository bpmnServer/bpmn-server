const { BPMNServer , DefaultHandler , Logger } = require("../../");
const { configuration } = require('../../configuration');


const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
var caseId = Math.floor(Math.random() * 10000);

let name = 'boundary-event';
let process;
let response;
let instanceId;

Feature('Boundary Event', () => {
        Scenario('do the task in time- events will cancel', () => {
            Given('Start '+ name + ' Process',async () => {
                response = await server.engine.start(name, {});
            });
            Then('check for output', () => {
                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('user_task').status).equals('wait');
            });

            When('a process defintion is executed', async () => {

                const data = { };
                const query ={
                    instance: { id: instanceId },
                    items: { elementId: 'user_task' }};
                response= await server.engine.invoke(query ,data );
            });

            When('I dont wait for events to complete', async () => {

                expect(getItem('BoundaryEvent_timer').status).equals('end');
                expect(getItem('BoundaryEvent_message').status).equals('end');

            });

            let fileName = __dirname + '/../logs/'+ name +'.log';

            and('write log file to ' + fileName, async () => {
              logger.save(fileName);
            });

        });

    });

function getItem(id)
{
    return response.items.filter(item => { return item.elementId == id; })[0];
}