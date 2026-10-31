/*
import { Execution } from 'bpmn-server';
import { MyAppDelegate } from './appDelegate';
import { homedir } from 'os';
const FS = require('fs');
import { EventEmitter } from 'events';
import { DataStore } from 'bpmn-server';

const Logger = require('bpmn-server');

const logger = new Logger.Logger({ toConsole: true});
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
        <bpmn:timeDuration xsi:type="bpmn:tExpression">PT20S</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
    </bpmn:intermediateCatchEvent>
    <bpmn:sequenceFlow id="Flow_07jc6tg" sourceRef="StartEvent_09in9bz" targetRef="Activity_03i6maz" />
    <bpmn:sequenceFlow id="Flow_1sg7v2d" sourceRef="Activity_03i6maz" targetRef="Event_w_timer" />
    <bpmn:sequenceFlow id="Flow_1nku8og" sourceRef="Event_w_timer" targetRef="end_event" />
  </bpmn:process>
</bpmn:definitions>
`;



test();
const data = {
    caseId: 6543,
    task1: { requiresCleaning: true, requiresRepairs: true },
    loop1: [
        { clientId: 101, name: 'ABC' },
        { clientId: 102, name: 'IBC' },
        { clientId: 103, name: 'NBC' }],
    subprocess_1:
        { to:'ap@abc.com' , messageBody: 'hi' , output: null}
};

async function test() {
    //build objects
    //let def = await moddle.getDefinition(source);
    //console.log('1 ------------------------------------------');
    let listener = new EventEmitter();
    let process = new Execution('test',source);
    process.name = 'Tester';
    let ds = new DataStore(logger);
    ds.monitorExecution(process);

    console.log('2 ------------------------------------------');
    listener.on('all', function (event, object) {
        if (object.constructor.name == 'Item')
            console.log('EVENT ' + event + " " + object.constructor.name + ' id: ' + object.element.id);
        else
            console.log('EVENT ' + event + " " + object.constructor.name + ' id: ' + object.id);
    });

    let needsRepairs = true;
    let needsCleaning = true;

    let result=await process.execute(null, { needsCleaning: needsCleaning, needsRepairs: needsRepairs , records : [1,2,3] });

    console.log("Returned from execute");
    console.log(result);

   // report(process);

    let state = process.getState();

    FS.writeFile('state.txt', JSON.stringify(state), function (err) {
        if (err) throw err;
    });
    console.log('restoring..');
    Execution.restore(state, new MyAppDelegate(logger), logger);

//    await delay(5000, 'test');
    return;
    process.signal('task_Buy', {}); // Buy

    state = process.getState();

    process = await Execution.restore(state,new MyAppDelegate(logger), logger);


    if (needsRepairs)
        process.signal('task_repair', {});    // Clean
    if (needsRepairs)
        process.signal('task_clean', {});    // Clean
    process.signal('task_Drive', {});

    console.log('----------');
    process.tokens.forEach(t => {
        console.log('-- token ' + t.id);
        t.path.forEach(p => {
            console.log('path:' + p);
        });
    });
    console.log('---------- BYE');

    return;
}
function report(execution) {

    console.log('Status:' + execution.status);
    execution.tokens.forEach(token => {
        console.log(`token: ${token.id} - ${token.status} - current: ${token.currentNode.id}`);
    });

    
    execution.getItems().forEach(i => {
        console.log(`#: ${i.id} -T# ${i.token.id} Id - ${i.element.id} Type: ${i.element.type} status: ${i.status} start ${i.started} end ${i.ended} `);
    });


}
async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}
*/