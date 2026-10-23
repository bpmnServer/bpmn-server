import { fileURLToPath as __f2p } from 'url';
import { dirname as __dn } from 'path';
const __filename = __f2p(import.meta.url);
const __dirname = __dn(__filename);
console.log('----', __filename);
import { BPMNServer , DefaultAppDelegate , Logger } from './index.js';
import { configuration } from './index.js';

console.log('-------- car.js -----------');

const logger = new Logger({ toConsole: false});

const server = new BPMNServer(configuration, logger);
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
                instanceId = response.id;
                //console.log('item',getItem('task_Buy'));
                
//                console.log(' after start ', response.instance.caseId);
            });
            Then('check for output', () => {
                expect(response).to.have.property('execution');
                expect(response.instance.data.starterUserId).equals(userId);
                expect(response.instance.data.caseId).equals(caseId);
                expect(getItem('task_Buy').status).equals('wait');
             });

            When('assignTask', async () => {
                const query = {id: instanceId ,"items.elementId": 'task_Buy' };
                const assignment = {assignee: userId, 
                    candidateUsers: ['employee1','manager1'],
                    dueDate :new Date() , priority: 7
                };
                response = await server.engine.assign(query,null,assignment,userId);

                const itm=getItem('task_Buy');

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

                expect(response.instance.id).equals(instanceId);

            });


            Then('check for output to have engine', () => {
                expect(response).to.have.property('execution');
                expect(getItem('task_Buy').status).equals('end');
            });

            and('Clean it', async () => {

                    const query = {
                        "id": instanceId,
                        "items.elementId": 'task_clean'
                        };
//                console.log(query);
                response=await server.engine.invoke(query, {});
                expect(getItem('task_clean').status).equals('end');

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
                console.log('status',response.execution.status);
                console.log('drive?',getItem('task_Drive').status);
            });

            and('Case Complete', async () => {

                report();
//                console.log(response.execution.status);
                 expect(response.execution.status).equals('end');
                expect(getItem('task_Drive').status).equals('end');

            });

            let fileName = __dirname + '/../logs/car.log';

            and('write log file to ' + fileName, async () => {
                logger.save(fileName);
//                console.log('filename:', __filename);
            });

        });

    });
function report() 
{
    response.instance.items.filter(item=> {return (item.type=='bpmn:UserTask');}).forEach(item=>{
        console.log('item',item.elementId,item.status,item.seq);
    });
}
function getItem(id)
{
    return response.instance.items.filter(item => { return item.elementId == id; })[0];
}