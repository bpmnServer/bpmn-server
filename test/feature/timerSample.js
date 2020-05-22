const config = require('../../configuration.js').configuration;
const Server = require("../../src/BPMNServer");
const Helper = require("../ServerHelper").ServerHelper;


const helper = new Helper();


let bpmnServer = new Server.BPMNServer(config,helper.getLogger());



Feature('Timer-Sample', () => {
    Scenario('All path', () => {
        let server, name;
        let execution, engine, instance, source;
        let item, itemUrl;
        name = 'timer-sample';
        Given('a bpmn source with one user task', () => {
            // server = new BPMNServer.BPMNServer(config);
            server = bpmnServer;
        });

        When('a process defintion is executed', async () => {
            execution = await server.execute(name);
            console.log(execution.instance.id);

        });

        let state;
        and('Find Waiting items', async () => {

            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait' });
            expect(waiting).to.have.length(0);
        });


        and('Waiting for timer to fire', async () => {
            //            Logger.setOptions({ toConsole: true});
            await helper.delay(2500, function () { console.log("done"); })

        });

        and('Case Complete', async () => {

            let waiting = await server.findItems(
                { instanceId: execution.instance.id, taskId: 'Event_04w6u9w', status: 'end' });
            expect(waiting).to.have.length(1);
        });

        and('and removed from Server', async () => {

            let myInstance = Server.BPMNServer.getLive(execution.instance.id);

            expect(myInstance).to.be.an('undefined');

        });

        and('write log file', async () => {
            helper.dumpInfo(execution);
            helper.saveLog('timeSample');
        });
    });
}); 
