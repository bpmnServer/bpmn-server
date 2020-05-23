const config = require('../../configuration.js').configuration;
const Server = require("../../src/BPMNServer");

const DefaultLogger = require('../../src/DefaultLogger.js').DefaultLogger;

const logger = new DefaultLogger({ toConsole: false });


let bpmnServer = new Server.BPMNServer(config, logger);


Feature('Buy Used Car', () => {
    Scenario('All path', () => {
        let server, name;
        let execution, engine, instance, source;
        let item, itemUrl;
        name = 'Buy Used Car';
        Given('a bpmn source with one user task', () => {
            // server = new BPMNServer.BPMNServer(config);
            server = bpmnServer;
        });

        When('a process defintion is executed', async () => {
            execution = await server.execute(name);
        });

        let state;
        Then('check for output to have engine', () => {
            expect(execution).to.have.property('engine');
        });
        and('check for output to instance', () => {

            expect(execution).to.have.property('instance');
        });
        and('check for output to have items', async () => {

            expect(execution).to.have.property('events');
        });

        and('Query on items from db', async () => {

            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait' });
            item = waiting[0];
            console.log('waiting for:' + item.name);
            expect(waiting).to.have.length(1);

        });

        and('Buy the car', async () => {
            execution = await server.invoke({
                instanceId: execution.instance.id, status: 'wait', name: 'Buy'
            }, 'ralph'
                , { model: 'Thunderbird', repairsRequired: true, cleaningRequired: false });

        });

        and('Clean it', async () => {
            execution = await server.invoke({
                instanceId: execution.instance.id, status: 'wait', name: 'Clean'
            });
        });

        and('Repair it', async () => {

            execution = await server.invoke({
                instanceId: execution.instance.id, status: 'wait', name: 'Repair'
            });
        });
        and('Drive it', async () => {
            execution = await server.invoke({
                instanceId: execution.instance.id, status: 'wait', name: 'Drive'
            });
        });

        and('Case Complete', async () => {

            let waiting = await server.findItems(
                { instanceId: execution.instance.id, status: 'wait' });

            expect(waiting).to.have.length(0);
        });

    });
});

