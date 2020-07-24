const { BPMNServer, Behaviour_names, Execution, DefaultAppDelegate, Logger } = require("../../");


const config = require("../testConfiguration.js").configuration;

const logger = new Logger({ toConsole: false });


//=-=-=-==============================

let name = 'Buy Used Car';
let server;
let process;
let needsRepairs = true;
let needsCleaning = true;
let items;
let definition;
let node;
Feature('GetFields', () => {
    Scenario('All path', () => {
        Given('a bpmn source ', async () => {

            server = new BPMNServer(config, logger);
            definition = await server.definitions.load(name);

        });

        When('a process defintion is executed', async () => {

            //console.log(definition);
            node = definition.getNodeById('task_Buy');
            let extName = Behaviour_names.CamundaFormData;
            let ext = node.getBehaviour(extName);
            expect(ext.fields.length).equals(2);
        });

    });
});





