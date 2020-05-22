const config = require('../../configuration.js').configuration;
const Server = require("../../src/BPMNServer");
const Helper = require("../ServerHelper").ServerHelper;


const helper = new Helper();


let bpmnServer = new Server.BPMNServer(config,helper.getLogger());

Feature('Timer-Sample', () => {
    Scenario('Shutdown and restart', () => {
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
            engine = execution.engine;

        });

        let state;
        and('Find Waiting items', async () => {
            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait' });
            expect(waiting).to.have.length(0);
        });
        and('Shutdown the server', async () => {
            await server.shutdown();
            expect(Server.BPMNServer.getLives()).to.have.length(0);
            expect(engine.state=='stopped');
            console.log(engine.state);
            helper.dumpInfo(execution);
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

        and('Start the server', async () => {
            await server.restart();
            expect(Server.BPMNServer.getLives()>0);
            expect(engine.state == 'running');
            console.log(engine.state);
            helper.dumpInfo(execution);
        });

        and('write log file', async () => {
            helper.dumpInfo(execution);
            helper.save(name + '2');
        });
    });
});

