import { BPMNServer, DefaultAppDelegate, Logger } from '..';
import { configuration } from './';

/* here is what is working:
1)   works fine get event and script
       <bpmn:extensionElements>
       <camunda:script event="start"><![CDATA[this.token.log('testing from the inside: '+this.token.data.loopKey);]]></camunda:script>
     </bpmn:extensionElements>

    but modeler removes the script:
  
 2) works halfway 
        "name": "Triggers",
        "isAbstract": true,
        "extends": ["bpmn:BaseElement"],
        "properties": [
            {
                "name": "trigger",
                "type": "String",
            }
                    ]
        },
 *
     <js:trigger js:event="start"><![CDATA[this.token.log('testing from the inside: '+this.token.data.loopKey);]]></js:trigger>

but return only script body not the event??

 * 
 */

const camundaOptions = require('../resources/camunda.json');
const jsOptions = require('../resources/js.json');

console.log(camundaOptions);

const BpmnModdle = require('bpmn-moddle');

const moddleOptions = getOptions();
console.log(moddleOptions);
//const moddle = new BpmnModdle({ });
const moddle = new BpmnModdle({ moddleOptions});
//const moddle = new BpmnModdle({ camundaOptions});
const source = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
xmlns:camunda="http://camunda.org/schema/1.0/bpmn" 
id="Definitions_1nlhb7m" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="7.2.0">
  <bpmn:collaboration id="Collaboration_0wk2w5j">
    <bpmn:participant id="Participant_0u9at2e" processRef="Process_0aa7grp" />
  </bpmn:collaboration>
  <bpmn:process id="Process_0aa7grp" isExecutable="false">

    <bpmn:startEvent id="StartEvent_1qdp6qp">


      <bpmn:extensionElements>
       <camunda:script event="start"><![CDATA[this.token.log('testing from the inside: '+this.token.data.loopKey);]]></camunda:script>
     </bpmn:extensionElements>
      <bpmn:outgoing>Flow_0wric3t</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:callActivity id="activity_call" name="Call Task" calledElement="loop">
      <bpmn:incoming>Flow_0wric3t</bpmn:incoming>
      <bpmn:outgoing>Flow_0irf9tz</bpmn:outgoing>
      <bpmn:dataOutputAssociation id="DataOutputAssociation_0g58m6u">
      <bpmn:targetRef>DataStoreReference_1y9ia5x</bpmn:targetRef>
            </bpmn:dataOutputAssociation>
      <bpmn:extensionElements>
       <camunda:script event="start"><![CDATA[this.token.log('testing from the inside: '+this.token.data.loopKey);]]></camunda:script>
     </bpmn:extensionElements>
    </bpmn:callActivity>
    <bpmn:dataObjectReference id="DataObjectReference_1kt7ciu" dataObjectRef="DataObject_0x9s7my" />
    <bpmn:dataObject id="DataObject_0x9s7my" />
    <bpmn:dataStoreReference id="DataStoreReference_1y9ia5x" />
    <bpmn:endEvent id="Event_1wxl4bq">
      <bpmn:incoming>Flow_0qasnf8</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:scriptTask id="Activity_1g1uoam" name="Task 2">
      <bpmn:incoming>Flow_0irf9tz</bpmn:incoming>
      <bpmn:outgoing>Flow_0qasnf8</bpmn:outgoing>
      <bpmn:property id="Property_0x7oczt" name="__targetRef_placeholder" />
      <bpmn:dataInputAssociation id="DataInputAssociation_01oj5d6">
        <bpmn:sourceRef>DataObjectReference_1kt7ciu</bpmn:sourceRef>
        <bpmn:targetRef>Property_0x7oczt</bpmn:targetRef>
      </bpmn:dataInputAssociation>
    </bpmn:scriptTask>
    <bpmn:sequenceFlow id="Flow_0wric3t" sourceRef="StartEvent_1qdp6qp" targetRef="activity_call" />
    <bpmn:sequenceFlow id="Flow_0irf9tz" sourceRef="activity_call" targetRef="Activity_1g1uoam" />
    <bpmn:sequenceFlow id="Flow_0qasnf8" sourceRef="Activity_1g1uoam" targetRef="Event_1wxl4bq" />
  </bpmn:process>
 </bpmn:definitions>
`;


//=-=-=-==============================
test();
async function test() {
    const result = await moddle.fromXML(source);
    console.log(result);

    const element = result.elementsById.activity_call;
    console.log(element);
    if (element.extensionElements && element.extensionElements.values) {
        element.extensionElements.values.forEach(val => {
            console.log(val);
        });
    }
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
function getOptions() {

let moddleOptions =
{
    "name": "Node bpmn-engine",
    "uri": "http://paed01.github.io/bpmn-engine/schema/2017/08/bpmn",
    "prefix": "js",
    "xml": {
        "tagAlias": "lowerCase"
    },
    "types": [
        {
        "name": "Triggers",
        "isAbstract": true,
        "extends": ["bpmn:BaseElement"],
        "properties": [
            {
                "name": "trigger",
                "type": "String",
            }
                    ]
        },
        {
        "name": "Task",
        "isAbstract": true,
        "extends": [ "bpmn:Task"],
        "properties": [
            {
                "name": "result",
                "isAttr": true,
                "type": "String"
            }
                    ]
        }, {
        "name": "Output",
        "superClass": ["Element"]
        }, {
        "name": "Collectable",
        "isAbstract": true,
        "extends": ["bpmn:MultiInstanceLoopCharacteristics"],
        "properties": [
            {
                "name": "collection",
                "isAttr": true,
                "type": "String"
            },
            {
                "name": "elementVariable",
                "isAttr": true,
                "type": "String"
            }
        ]
        }, {
        "name": "FormSupported",
        "isAbstract": true,
        "extends": [
            "bpmn:StartEvent",
            "bpmn:UserTask"
        ],
        "properties": [
            {
                "name": "formKey",
                "isAttr": true,
                "type": "String"
            }
        ]
    }]
};

    return moddleOptions;
}
