// Support Repeat Timers using format R3 / PT3S

var input = 'R3/PT3S';
console.log(getRepeat("PT5M"));
console.log(getRepeat(input));
console.log(getRepeat('R3PT3S'));
    
function getRepeat(input) {
    if (input.startsWith('R')) {
        var l = input.indexOf('/');
        if (l>0)
            return input.substring(1, l);
    }
    return 1;
}


/*

const { BPMNServer, DefaultAppDelegate, Logger } = require("../../");
const { configuration } = require('../testConfiguration');

const logger = new Logger({ toConsole: false });

const server = new BPMNServer(configuration, logger);
var caseId = Math.floor(Math.random() * 10000);

let name = 'Buy Used Car';
let process;
let response;
let instanceId;

expect(item(response, { name: 'task_Buy' }).status).equals('wait');
expect(item(response, { id: 'task_Buy' , status: 'wait' }).status).equals('wait');
expect()

function item(instance,query) {

}
Feature('Buy Used Car- clean and repair', () => {
    Scenario('Simple', () => {
        Given('Start Buy Used Car Process', async () => {
            response = await server.engine.start(name, { caseId: caseId });
            instanceId = response.id;
        });
        Then('check for output', () => {
            expect(response.data.caseId).equals(caseId);
            expect(getItem('task_Buy').status).equals('wait');
        });

        When('a process defintion is executed', async () => {
            response = await server.engine.invoke({
                id: instanceId,
                "items.elementId": 'task_Buy'
            },
                { needsCleaning: "Yes", needsRepairs: "Yes" }
            );
        });


        Then('check for output to have engine', () => {
            expect(getItem('task_Buy').status).equals('end');
        });

        and('Clean it', async () => {

            await server.engine.invoke({
                "data.caseId": caseId,
                "items.elementId": 'task_clean'
            }, {});
        });

        and('Repair it', async () => {
            response = await server.engine.invoke({
                id: instanceId, "items.elementId": 'task_repair'
            }, {});
        });
        and('Drive it 1', async () => {
            response = await server.engine.invoke({
                id: instanceId, "items.elementId": 'task_Drive'
            }, {});
        });

        and('Case Complete', async () => {
            console.log(response.status);
            expect(getItem('task_Drive').status).equals('end');
        });

        // 
        and('find instances', async () => {

            var insts = await server.datastore.findInstances({ id: response.id });
            expect(insts).to.have.lengthOf(1);

        });

        and('find items', async () => {

            var items = await server.datastore.findItems({ id: response.id });
            expect(items).to.have.lengthOf(17);

        });

    });

});

function getItem(id) {
    return response.items.filter(item => { return item.elementId == id; })[0];
}
*/