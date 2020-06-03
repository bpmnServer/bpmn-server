const { BPMNServer, Execution, DataStore, DefaultHandler, Logger } = require("bpmn-server");

const config = require("../configuration.js").configuration;

const logger = new Logger({ toConsole: false });

const source = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1cbql69" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1">
  <bpmn:collaboration id="Collaboration_0t2r4h0">
    <bpmn:participant id="Participant_0jf4n5b" processRef="Process_0jvadxd" />
  </bpmn:collaboration>
  <bpmn:process id="Process_0jvadxd" isExecutable="true">
    <bpmn:startEvent id="StartEvent_09in9bz" name="start">
      <bpmn:outgoing>Flow_07jc6tg</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_03i6maz" name="Activity Task">
      <bpmn:incoming>Flow_07jc6tg</bpmn:incoming>
      <bpmn:outgoing>Flow_1sg7v2d</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="end_event" name="end">
      <bpmn:incoming>Flow_1nku8og</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:intermediateCatchEvent id="Event_w_timer">
      <bpmn:incoming>Flow_1sg7v2d</bpmn:incoming>
      <bpmn:outgoing>Flow_1nku8og</bpmn:outgoing>
      <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
        <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
    </bpmn:intermediateCatchEvent>
    <bpmn:sequenceFlow id="Flow_07jc6tg" sourceRef="StartEvent_09in9bz" targetRef="Activity_03i6maz" />
    <bpmn:sequenceFlow id="Flow_1sg7v2d" sourceRef="Activity_03i6maz" targetRef="Event_w_timer" />
    <bpmn:sequenceFlow id="Flow_1nku8og" sourceRef="Event_w_timer" targetRef="end_event" />
  </bpmn:process>
</bpmn:definitions>
`;




//=-=-=-==============================

let name = 'TimerSample';
let process;
let needsRepairs = true;
let needsCleaning = true;
let items;

Feature('TimerSample', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task', () => {
       
        process = new Execution(name,source, new DefaultHandler(logger),logger);
        
    });

    When('a process defintion is executed', async () => {

        await process.execute(null, { needsCleaning: needsCleaning, needsRepairs: needsRepairs, records: [1, 2, 3] });

    });
      and('wait a bit ', async () => {
          await delay(2500, 'test');
          process.report();
          items = process.getItems();

          //          process.signal('userTask', {}); // Buy
      });

      and('Case Complete', async () => {
         expect(process.status).equals('end');
      });


      and('write log file to' + name + '.log', async () => {
          let fileName = __dirname + '/../logs/' + name + '.log';
          logger.save(fileName);
      });


  });
}); 


async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}