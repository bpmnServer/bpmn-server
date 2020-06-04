const { BPMNServer, Execution, DefaultHandler, Logger } = require("../../dist/");

const config = require("../configuration.js").configuration;

const logger = new Logger({ toConsole: false });

const source = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1vpaa20" 
targetNamespace="http://bpmn.io/schema/bpmn" 
exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1">
  <bpmn:process id="Process_15krzlx" isExecutable="false">
    <bpmn:startEvent id="StartEvent_12lfa5f">
      <bpmn:outgoing>Flow_0bb7flg</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="Flow_0bb7flg" sourceRef="StartEvent_12lfa5f" targetRef="scriptTask" />
    <bpmn:sequenceFlow id="Flow_03lw5wj" sourceRef="scriptTask" targetRef="serviceTask" />
    <bpmn:sequenceFlow id="Flow_0cq93ga" sourceRef="serviceTask" targetRef="sendTask" />
    <bpmn:endEvent id="Event_0iwmzob">
      <bpmn:incoming>Flow_0wyvfqv</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_0wyvfqv" sourceRef="sendTask" targetRef="Event_0iwmzob" />
    <bpmn:scriptTask id="scriptTask" name="ScriptTask">
    <script>
      <![CDATA[
            this.token.log('testing from the inside: '+this.token.data.loopKey);
      ]]>
    </script>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" js:collection="(this.records)" />
      <bpmn:incoming>Flow_0bb7flg</bpmn:incoming>
      <bpmn:outgoing>Flow_03lw5wj</bpmn:outgoing>
    </bpmn:scriptTask>


    <bpmn:serviceTask id="serviceTask" name="ServiceTask"
             implementation="\{this.token.execution.handler.service1(this);}">
      <bpmn:multiInstanceLoopCharacteristics isSequential="false" js:collection="(this.records)" />

      <bpmn:incoming>Flow_03lw5wj</bpmn:incoming>
      <bpmn:outgoing>Flow_0cq93ga</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sendTask id="sendTask" name="SendTask">
      <bpmn:incoming>Flow_0cq93ga</bpmn:incoming>
      <bpmn:outgoing>Flow_0wyvfqv</bpmn:outgoing>
    </bpmn:sendTask>
    <bpmn:intermediateCatchEvent id="Event_w_timer">
      <bpmn:incoming>Flow_1sg7v2d</bpmn:incoming>
      <bpmn:outgoing>Flow_1nku8og</bpmn:outgoing>
      <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
        <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
    </bpmn:intermediateCatchEvent>
  </bpmn:process>
</bpmn:definitions>
`;




//=-=-=-==============================

let name = 'TestDefinition';
let server;
let process;
let needsRepairs = true;
let needsCleaning = true;
let items;
let definition;
let node;
Feature('Test Defintions', () => {
    Scenario('All path', () => {
        Given('a bpmn source ', async () => {

            server = new BPMNServer(config, logger);

            console.log(config);

            definition= await server.loadDefinition(name, source);

        });

        When('a process defintion is executed', async () => {

            //console.log(definition);
            node = definition.getNodeById('Event_w_timer');
            let timerName = 'bpmn: TimerEventDefinition';
            if (node.hasBehaviour(timerName)) {
                let timer = node.getBehaviour(timerName);
                console.log(timer);
            }
            console.log(node.behaviours);
            //            await process.execute(null, { needsCleaning: needsCleaning, needsRepairs: needsRepairs, records: [1, 2, 3] });

        });
        and('wait a bit ', async () => {

            //          process.signal('userTask', {}); // Buy
        });

        and('User Task', async () => {
            //            expect(items.filter(i => i.element.id == 'scriptTask').length).equals(3);
            //            expect(items.filter(i => i.element.id == 'serviceTask').length).equals(3);
            //          process.signal('userTask', {}); // Buy
        });

        and('Case Complete', async () => {
            //     expect(process.status).equals('idle');

        });

        and('write log file to' + name + '.log', async () => {
            let fileName = __dirname + '/../logs/' + name + '.log';
            logger.save(fileName);
        });


    });
});





