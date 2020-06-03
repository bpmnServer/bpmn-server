const { BPMNServer, Execution, DataStore, DefaultHandler, Logger , Behaviour_names } = require("bpmn-server");

const config = require("../configuration.js").configuration;

const logger = new Logger({ toConsole: false });


const source = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions id="pending" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:camunda="http://camunda.org/schema/1.0/bpmn">
  <process id="theWaitingGame" isExecutable="true">
    <startEvent id="start" />
    <parallelGateway id="fork" />
    <userTask id="userTask1">
      <extensionElements>
        <camunda:formData>
          <camunda:formField id="surname" label="Surname" type="string" />
          <camunda:formField id="givenName" label="Given name" type="string" />
        </camunda:formData>
      </extensionElements>
    </userTask>
    <userTask id="userTask2" />
    <task id="task" />
    <parallelGateway id="join" />
    <endEvent id="end" />
    <sequenceFlow id="flow1" sourceRef="start" targetRef="fork" />
    <sequenceFlow id="flow2" sourceRef="fork" targetRef="userTask1" />
    <sequenceFlow id="flow3" sourceRef="fork" targetRef="userTask2" />
    <sequenceFlow id="flow4" sourceRef="fork" targetRef="task" />
    <sequenceFlow id="flow5" sourceRef="userTask1" targetRef="join" />
    <sequenceFlow id="flow6" sourceRef="userTask2" targetRef="join" />
    <sequenceFlow id="flow7" sourceRef="task" targetRef="join" />
    <sequenceFlow id="flowEnd" sourceRef="join" targetRef="end" />
  </process>
</definitions>`;


//=-=-=-==============================

let name = 'GetFields';
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

            definition = await server.loadDefinition(name, source);

        });

        When('a process defintion is executed', async () => {

            //console.log(definition);
            node = definition.getNodeById('userTask1');
            let extName = Behaviour_names.CamundaFormData;
            console.log("ext name:" + extName);
            let ext = node.getBehaviour(extName);
            console.log('fields:'+ ext.fields.length);
            console.log(node.behaviours);

            expect(ext.fields.length).equals(2);

        });

        and('Case Complete', async () => {

        });

        and('write log file to' + name + '.log', async () => {
            let fileName = __dirname + '/../logs/' + name + '.log';
            logger.save(fileName);
        });


    });
});





