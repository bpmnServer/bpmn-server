const { BPMNServer , DefaultAppDelegate , Logger } = require("../../");
const { configuration } = require('../../configuration');


const logger = new Logger({ toConsole: true });

const server = new BPMNServer(configuration, logger);
var caseId = Math.floor(Math.random() * 10000);

let name = 'Buy Used Car';
let process;
let response;
let instanceId;

const scenarios = [{ needsRepairs: true, needsCleaning: true },
    { needsRepairs: true, needsCleaning: false },
    { needsRepairs: false, needsCleaning: true },
    { needsRepairs: false, needsCleaning: false},
];
Feature('Buy Used Car', () => {
    scenarios.forEach(options => {
        let title = 'scenario ' + (options.needsRepairs ? 'repairs' : '') + (options.needsCleaning ? ' cleaning' : '');
        console.log(title);
        Scenario(title, () => {

            Given('Start Buy Used Car Process',async () => {
                response = await server.engine.start(name, {});
            });
            Then('check for output', () => {

                expect(response).to.have.property('execution');
                instanceId = response.execution.id;
                expect(getItem('task_Buy').status).equals('wait');

            });

            When('a process defintion is executed', async () => {

                const data = { needsCleaning: options.needsCleaning, needsRepairs: options.needsRepairs };
                const query ={
                    instance: { id: instanceId },
                    items: { elementId: 'task_Buy' }};
                response= await server.engine.invoke(query ,data );

            });

            Then('check for output to have engine', () => {
                expect(response).to.have.property('execution');
                expect(getItem('task_Buy').status).equals('end');
            });

            and('Clean it', async () => {

                if (options.needsCleaning) {
                    const query = {
                        instance: {
                            data: { caseId: caseId }},
                        items: { elementId: 'task_clean' }
                    };
                    await server.engine.invoke(query, {});
                }
            });
      
            and('Repair it', async () => {
                if (options.needsRepairs) { 
                    const query = {
                        instance: { id: instanceId },
                        items: { elementId: 'task_repair' }
                    };
                    response = await server.engine.invoke(query, {});
                }
            }); 
            and('Drive it 1', async () => {
                const query = {
                    instance: { id: instanceId },
                    items: { elementId: 'task_Drive' }
                };
                response=await server.engine.invoke(query, {});
            });

            and('Case Complete', async () => {
              expect(response.execution.status).equals('end');
                expect(getItem('task_Drive').status).equals('end');

            });

            and('write log file to' + name + '.log', async () => {
              let fileName = __dirname + '/../logs/' + name + title+ '.log';
              logger.save(fileName);
            });

        });

    });
}); 

function getItem(id)
{
    return response.items.filter(item => { return item.elementId == id; })[0];
}