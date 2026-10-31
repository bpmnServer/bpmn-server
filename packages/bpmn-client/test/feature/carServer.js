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

Feature('Buy Used Car- clean and repair', () => {
    Scenario('Simple', () => {
        Given('Start Buy Used Car Process', async () => {
            response = await server.engine.start(name, { caseId: caseId },null, 'remoteUser1');
            instanceId = response.id;

            //console.log('**instanceId', response.id, instanceId);
            //console.log(' after start ', response.data.caseId);
        });
        Then('check for output', () => {
            expect(response.data.caseId).equals(caseId);
            expect(getItem('task_Buy').status).equals('wait');
        });

        When('a process defintion is executed', async () => {

            const data = { needsCleaning: "Yes", needsRepairs: "Yes" };
            const query = {
                id: instanceId,
                "items.elementId": 'task_Buy'
            };
            console.log(query);
            response = await server.engine.invoke(query, data,'RemoteUser2');
        });

        When('engine get', async () => {
            const query = { id: instanceId };

            response = await server.engine.get(query);

            expect(response.id).equals(instanceId);

        });


        Then('check for output to have engine', () => {
            expect(getItem('task_Buy').status).equals('end');
        });

        and('Clean it', async () => {

            const query = {
                "data.caseId": caseId,
                "items.elementId": 'task_clean'
            };
            console.log(query);
            await server.engine.invoke(query, {},'remoteUser3');
        });

        and('Repair it', async () => {
            const query = { id: instanceId, "items.elementId": 'task_repair' };
            response = await server.engine.invoke(query, {});
        });
        and('Drive it 1', async () => {
            const query = {
                id: instanceId,
                "items.elementId": 'task_Drive'
            };
            response = await server.engine.invoke(query, {},'remote_user4');
        });

        and('Case Complete', async () => {

            console.log(response.status);
            expect(getItem('task_Drive').status).equals('end');

        });

        and('find engine status', async () => {

            var insts = await server.engine.status();
 
        });

        // 
        and('find instances', async () => {

            var insts = await server.datastore.findInstances({ id: response.id });
            expect(insts).to.have.lengthOf(1);

        });

        and('find items', async () => {

            var items = await server.datastore.findItems({ id: response.id } );
            expect(items).to.have.lengthOf(17);

        });




    });

});

function getItem(id) {
    return response.items.filter(item => { return item.elementId == id; })[0];
}