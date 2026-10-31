import { BPMNClient } from "../../src/index.js";



const API_KEY = '12345';
const HOST = 'localhost';
const PORT = '3000';
//const HOST = 'test.omniworkflow.com';
//const PORT = '443';

const BASE_URL = 'api';


console.log('-------- carServer.js -----------');

const server = new BPMNClient(HOST, PORT, API_KEY);

var caseId = Math.floor(Math.random() * 10000);

let name = 'Buy Used Car';
let process;
let response;
let instanceId;
let userId='user1';

Feature('Buy Used Car- clean and repair', () => {
        Scenario('Simple', () => {
            Given('Start Buy Used Car Process',async () => {
                response = await server.engine.start(name, {caseId: caseId},null,userId);
                console.log('**instanceId',  response.id);
                instanceId = response.id;
                console.log('data:',response.data);
                console.log('item',getItem('task_Buy'));
                
//                console.log(' after start ', response.instance.caseId);
            });
            Then('check for output', () => {
                expect(response.data.starterUserId).equals(userId);
                expect(response.data.caseId).equals(caseId);
                expect(getItem('task_Buy').status).equals('wait');
             });

            When('assignTask', async () => {
                const query = {id: instanceId ,"items.elementId": 'task_Buy' };
                const assignment = {assignee: userId, 
                    candidateUsers: ['employee1','manager1'],
                    dueDate :new Date() , priority: 7
                };
                response = await server.engine.assign(query,null,userId,assignment);

                const itm=getItem('task_Buy');

                console.log(itm);

                expect(itm.priority).equals(7);

            });



            When('a process defintion is executed', async () => {

                const data = { needsCleaning: "Yes", needsRepairs: "Yes" };
                const query ={
                    id: instanceId ,
                    "items.elementId": 'task_Buy'
                };
//                console.log(query);
                response= await server.engine.invoke(query ,data );
            });

            When('engine get', async () => {
                const query = {id: instanceId };

                response = await server.engine.get(query);

                expect(response.id).equals(instanceId);

            });


            Then('check for output to have engine', () => {
                expect(getItem('task_Buy').status).equals('end');
            });

            and('Clean it', async () => {

                    const query = {
                        "data.caseId": caseId ,
                    "items.elementId": 'task_clean'
                };
//                console.log(query);
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

//                console.log(response.instance.status);
//                console.log(response.execution.status);
              expect(response.status).equals('end');
                expect(getItem('task_Drive').status).equals('end');

            });

        });

    });

function getItem(id)
{
    return response.items.filter(item => { return item.elementId == id; })[0];
}