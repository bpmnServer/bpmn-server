const config = require('../../configuration.js').configuration;
const Server = require("../../src/BPMNServer");


const Helper = require("../ServerHelper").ServerHelper;
const helper = new Helper();

let bpmnServer = new Server.BPMNServer(config, helper.getLogger());



Feature('Timer-Sample then user task', () => {
    Scenario('All path', () => {
        let server, name;
        let execution, engine, instance, source;
        let item, itemUrl;
        name = 'timerBeforeUser';
        Given('a bpmn source with one user task', () => {
            // server = new BPMNServer.BPMNServer(config);
            server = bpmnServer;
        });

        When('execute', async () => {
            execution = await server.execute(name);
        });

        let state;
        and('Find Waiting items', async () => {

            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait'});
            expect(waiting).to.have.length(0);
            item = waiting[0];
        });

        and('My instance is alive', async () => {

            let myInstance = await Server.BPMNServer.getLive(execution.instance.id);
    
            expect(myInstance.instance.id).equal(execution.instance.id);


        });
        and('Waiting for timer to fire', async () => {

            await helper.delay(2500, function () { console.log("done"); })

        });
        and('Find Waiting items', async () => {

            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait' });
            helper.log(" searching for item in instance: " + execution.instance.id+" count: "+waiting.length);
            
            helper.dumpInfo(execution);

            expect(waiting).to.have.length(1);
            item = waiting[0];

        });

        and('Fire User Task', async () => {

//            helper.getLogger().setOptions({ toConsole: true });

            execution = await server.invoke({
                instanceId: execution.instance.id, status: 'wait', name: 'User Task'
            });
        });

        and('Case Complete', async () => {

            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait' });
            expect(waiting).to.have.length(0);
        });

        and('and removed from Server', async () => {

            let myInstance = Server.BPMNServer.getLive(execution.instance.id);
            expect(myInstance).to.be.an('undefined');

        });

        and('write log file', async () => {
            helper.dumpInfo(execution);
            helper.saveLog(name);
        });

    });
}); 

