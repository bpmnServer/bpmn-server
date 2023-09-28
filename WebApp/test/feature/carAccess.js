const { BPMNServer , DefaultAppDelegate , Logger } = require("../../");
const { configuration } = require('../testConfiguration');

console.log('-------- carAccess.js -----------');

const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
var caseId = Math.floor(Math.random() * 10000);

let name = 'Buy Used Car';
let process;
let response;
let instanceId;
return;
Feature('CarAccess.js - Checking for Access Rules', () => {
        Scenario('Buy Used Car -complete', () => {
            Given('Start Buy Used Car Process',async () => {
                response = await server.engine.start(name, {caseId: caseId});
                instanceId = response.id;
            });
            Then('check for output', () => {
                expect(response).to.have.property('execution');
                expect(response.instance.data.caseId).equals(caseId);
                expect(getItem('task_Buy').status).equals('wait');
             });

            When('a process defintion is executed', async () => {

                const data = { needsCleaning: "Yes", needsRepairs: "Yes" };
                const query ={
                    id: instanceId ,
                    "items.elementId": 'task_Buy'
                };
                response= await server.engine.invoke(query ,data );
            });

            Then('check for output to have engine', () => {
                expect(response).to.have.property('execution');
                expect(getItem('task_Buy').status).equals('end');
            });

            and('Clean it', async () => {

                    const query = {
                        "data.caseId": caseId ,
                    "items.elementId": 'task_clean'
                };
                    await server.engine.invoke(query, {});
            });
      
            and('Repair it', async () => {
                    const query = { id: instanceId ,"items.elementId": 'task_repair'};
                    response = await server.engine.invoke(query, {});
            }); 
            and('Drive it 1', async () => {
                const query = {
                    id: instanceId ,
                    "items.elementId": 'task_Drive'};
                response=await server.engine.invoke(query, {});
            });

            and('Case Complete', async () => {

                expect(response.execution.status).equals('end');
                expect(getItem('task_Drive').status).equals('end');

            });

            and('Check Rules', async () => {

                expect(response.definition.accessRules.length).equals(8);
                expect(response.instance.authorizations.length).equals(1);
                expect(response.instance.involvements.length).equals(1);

                let assigns = 0, auths = 0, notes = 0;
                response.instance.items.forEach(item => {
                    assigns += item.assignments.length;
                    auths += item.authorizations.length;
                    notes += item.notifications.length;
                });
                console.log(" Items", response.instance.items.length, " auth ", auths, "assign", assigns, "notes", notes);

                expect(response.instance.items.length).equals(17);
                expect(assigns).equals(2);
                expect(notes).equals(2);
                expect(auths).equals(1);


            });

            let fileName = __dirname + '/../logs/carAccess.log';

            and('write log file to ' + fileName, async () => {
                logger.save(fileName);
                console.log('filename:', __filename);
            });

        });

    });

function getItem(id)
{
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
}