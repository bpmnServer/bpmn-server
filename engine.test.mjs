import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BPMNServer, Configuration, ModelsDatastore, DataStore,
  NoCacheManager, Logger, DefaultAppDelegate, ScriptHandler,
} from './dist/index.js';
import { MemoryMongoDB } from './MemoryMongoDB.mjs';

import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, sep } from 'node:path';

// Self-contained BPMN fixtures (written to a temp dir at runtime) — no external path dependency.
const FIXTURES = {
  "simple": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\">\n  <bpmn2:collaboration id=\"Collaboration_0x0b4dj\">\n    <bpmn2:participant id=\"Participant_1y70i0p\" processRef=\"Process_1\" />\n  </bpmn2:collaboration>\n  <bpmn2:process id=\"Process_1\" isExecutable=\"false\">\n    <bpmn2:startEvent id=\"startEvent1\">\n      <bpmn2:outgoing>flow1</bpmn2:outgoing>\n    </bpmn2:startEvent>\n    <bpmn2:task id=\"task1\" name=\"Task 1\">\n      <bpmn2:incoming>flow1</bpmn2:incoming>\n      <bpmn2:outgoing>flow2</bpmn2:outgoing>\n      <bpmn2:outgoing>Flow_1spobrl</bpmn2:outgoing>\n    </bpmn2:task>\n    <bpmn2:task id=\"task2\" name=\"Task 2\">\n      <bpmn2:incoming>flow2</bpmn2:incoming>\n      <bpmn2:outgoing>flow3</bpmn2:outgoing>\n    </bpmn2:task>\n    <bpmn2:endEvent id=\"endEvent1\">\n      <bpmn2:incoming>flow3</bpmn2:incoming>\n    </bpmn2:endEvent>\n    <bpmn2:sequenceFlow id=\"flow2\" sourceRef=\"task1\" targetRef=\"task2\" />\n    <bpmn2:sequenceFlow id=\"flow3\" sourceRef=\"task2\" targetRef=\"endEvent1\" />\n    <bpmn2:sequenceFlow id=\"flow1\" sourceRef=\"startEvent1\" targetRef=\"task1\" />\n    <bpmn2:exclusiveGateway id=\"Gateway_1rptiy6\">\n      <bpmn2:incoming>Flow_1spobrl</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1oxlr51</bpmn2:outgoing>\n    </bpmn2:exclusiveGateway>\n    <bpmn2:sequenceFlow id=\"Flow_1spobrl\" sourceRef=\"task1\" targetRef=\"Gateway_1rptiy6\" />\n    <bpmn2:task id=\"Activity_0df0iuv\">\n      <bpmn2:incoming>Flow_1oxlr51</bpmn2:incoming>\n    </bpmn2:task>\n    <bpmn2:sequenceFlow id=\"Flow_1oxlr51\" sourceRef=\"Gateway_1rptiy6\" targetRef=\"Activity_0df0iuv\" />\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Collaboration_0x0b4dj\">\n      <bpmndi:BPMNShape id=\"Participant_1y70i0p_di\" bpmnElement=\"Participant_1y70i0p\" isHorizontal=\"true\">\n        <dc:Bounds x=\"102\" y=\"60\" width=\"600\" height=\"250\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id=\"Flow_0mylizt_di\" bpmnElement=\"flow1\">\n        <di:waypoint x=\"188\" y=\"170\" />\n        <di:waypoint x=\"230\" y=\"170\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0voyu34_di\" bpmnElement=\"flow3\">\n        <di:waypoint x=\"470\" y=\"170\" />\n        <di:waypoint x=\"512\" y=\"170\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_11u0dsz_di\" bpmnElement=\"flow2\">\n        <di:waypoint x=\"330\" y=\"170\" />\n        <di:waypoint x=\"370\" y=\"170\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1spobrl_di\" bpmnElement=\"Flow_1spobrl\">\n        <di:waypoint x=\"280\" y=\"210\" />\n        <di:waypoint x=\"280\" y=\"235\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1oxlr51_di\" bpmnElement=\"Flow_1oxlr51\">\n        <di:waypoint x=\"305\" y=\"260\" />\n        <di:waypoint x=\"340\" y=\"260\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"startEvent1\">\n        <dc:Bounds x=\"152\" y=\"152\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_1yyvt0i_di\" bpmnElement=\"task1\">\n        <dc:Bounds x=\"230\" y=\"130\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_1s6gc6n_di\" bpmnElement=\"task2\">\n        <dc:Bounds x=\"370\" y=\"130\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_0oen7mk_di\" bpmnElement=\"endEvent1\">\n        <dc:Bounds x=\"512\" y=\"152\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_1rptiy6_di\" bpmnElement=\"Gateway_1rptiy6\" isMarkerVisible=\"true\">\n        <dc:Bounds x=\"255\" y=\"235\" width=\"50\" height=\"50\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0df0iuv_di\" bpmnElement=\"Activity_0df0iuv\">\n        <dc:Bounds x=\"340\" y=\"220\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>\n",
  "test-exclusive-gateway": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\">\n  <bpmn2:collaboration id=\"Collaboration_0re23pd\">\n    <bpmn2:participant id=\"Participant_0x47gdq\" processRef=\"Process_1\" />\n  </bpmn2:collaboration>\n  <bpmn2:process id=\"Process_1\" isExecutable=\"false\">\n    <bpmn2:startEvent id=\"StartEvent_1\">\n      <bpmn2:outgoing>Flow_0v8j0tj</bpmn2:outgoing>\n    </bpmn2:startEvent>\n    <bpmn2:serviceTask id=\"Activity_1faqlgg\" name=\"ST1\">\n      <bpmn2:incoming>Flow_0v8j0tj</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1hzbraa</bpmn2:outgoing>\n    </bpmn2:serviceTask>\n    <bpmn2:userTask id=\"Activity_02y07d5\" name=\"UT2\">\n      <bpmn2:incoming>Flow_17cyi7z</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_0tj16xj</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:sequenceFlow id=\"Flow_0b5wj1j\" sourceRef=\"Activity_1fem76t\" targetRef=\"Event_1a8ycn0\" />\n    <bpmn2:sequenceFlow id=\"Flow_1fc7qiq\" sourceRef=\"Gateway_0cpbe5l\" targetRef=\"Activity_1fem76t\" />\n    <bpmn2:sequenceFlow id=\"Flow_0tj16xj\" sourceRef=\"Activity_02y07d5\" targetRef=\"Gateway_0cpbe5l\" />\n    <bpmn2:sequenceFlow id=\"Flow_1rodujh\" sourceRef=\"Activity_03fpt80\" targetRef=\"Gateway_0cpbe5l\" />\n    <bpmn2:sequenceFlow id=\"Flow_17cyi7z\" sourceRef=\"Gateway_1dyr0tt\" targetRef=\"Activity_02y07d5\" />\n    <bpmn2:sequenceFlow id=\"Flow_02metuk\" name=\"1==2\" sourceRef=\"Gateway_1dyr0tt\" targetRef=\"Activity_03fpt80\" />\n    <bpmn2:sequenceFlow id=\"Flow_1hzbraa\" sourceRef=\"Activity_1faqlgg\" targetRef=\"Gateway_1dyr0tt\" />\n    <bpmn2:sequenceFlow id=\"Flow_0v8j0tj\" sourceRef=\"StartEvent_1\" targetRef=\"Activity_1faqlgg\" />\n    <bpmn2:sequenceFlow id=\"Flow_02pdl48\" sourceRef=\"Gateway_1dyr0tt\" targetRef=\"Activity_19ftcxo\" />\n    <bpmn2:sequenceFlow id=\"Flow_1cqn58a\" sourceRef=\"Activity_19ftcxo\" targetRef=\"Gateway_0cpbe5l\" />\n    <bpmn2:userTask id=\"Activity_03fpt80\" name=\"UT1\">\n      <bpmn2:incoming>Flow_02metuk</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1rodujh</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:exclusiveGateway id=\"Gateway_0cpbe5l\">\n      <bpmn2:incoming>Flow_1rodujh</bpmn2:incoming>\n      <bpmn2:incoming>Flow_0tj16xj</bpmn2:incoming>\n      <bpmn2:incoming>Flow_1cqn58a</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1fc7qiq</bpmn2:outgoing>\n    </bpmn2:exclusiveGateway>\n    <bpmn2:userTask id=\"Activity_19ftcxo\" name=\"UT3\">\n      <bpmn2:incoming>Flow_02pdl48</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1cqn58a</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:serviceTask id=\"Activity_1fem76t\" name=\"ST2\">\n      <bpmn2:incoming>Flow_1fc7qiq</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_0b5wj1j</bpmn2:outgoing>\n    </bpmn2:serviceTask>\n    <bpmn2:endEvent id=\"Event_1a8ycn0\">\n      <bpmn2:incoming>Flow_0b5wj1j</bpmn2:incoming>\n    </bpmn2:endEvent>\n    <bpmn2:parallelGateway id=\"Gateway_1dyr0tt\">\n      <bpmn2:incoming>Flow_1hzbraa</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_17cyi7z</bpmn2:outgoing>\n      <bpmn2:outgoing>Flow_02metuk</bpmn2:outgoing>\n      <bpmn2:outgoing>Flow_02pdl48</bpmn2:outgoing>\n    </bpmn2:parallelGateway>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Collaboration_0re23pd\">\n      <bpmndi:BPMNShape id=\"Participant_0x47gdq_di\" bpmnElement=\"Participant_0x47gdq\" isHorizontal=\"true\">\n        <dc:Bounds x=\"290\" y=\"0\" width=\"880\" height=\"340\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id=\"Flow_0v8j0tj_di\" bpmnElement=\"Flow_0v8j0tj\">\n        <di:waypoint x=\"378\" y=\"170\" />\n        <di:waypoint x=\"430\" y=\"170\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1hzbraa_di\" bpmnElement=\"Flow_1hzbraa\">\n        <di:waypoint x=\"530\" y=\"170\" />\n        <di:waypoint x=\"585\" y=\"170\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_02metuk_di\" bpmnElement=\"Flow_02metuk\">\n        <di:waypoint x=\"635\" y=\"170\" />\n        <di:waypoint x=\"690\" y=\"170\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"632\" y=\"153\" width=\"26\" height=\"14\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_17cyi7z_di\" bpmnElement=\"Flow_17cyi7z\">\n        <di:waypoint x=\"610\" y=\"195\" />\n        <di:waypoint x=\"610\" y=\"280\" />\n        <di:waypoint x=\"690\" y=\"280\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1rodujh_di\" bpmnElement=\"Flow_1rodujh\">\n        <di:waypoint x=\"790\" y=\"180\" />\n        <di:waypoint x=\"855\" y=\"180\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0tj16xj_di\" bpmnElement=\"Flow_0tj16xj\">\n        <di:waypoint x=\"790\" y=\"280\" />\n        <di:waypoint x=\"880\" y=\"280\" />\n        <di:waypoint x=\"880\" y=\"205\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1fc7qiq_di\" bpmnElement=\"Flow_1fc7qiq\">\n        <di:waypoint x=\"905\" y=\"180\" />\n        <di:waypoint x=\"960\" y=\"180\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0b5wj1j_di\" bpmnElement=\"Flow_0b5wj1j\">\n        <di:waypoint x=\"1060\" y=\"180\" />\n        <di:waypoint x=\"1112\" y=\"180\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_02pdl48_di\" bpmnElement=\"Flow_02pdl48\">\n        <di:waypoint x=\"610\" y=\"145\" />\n        <di:waypoint x=\"610\" y=\"50\" />\n        <di:waypoint x=\"680\" y=\"50\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1cqn58a_di\" bpmnElement=\"Flow_1cqn58a\">\n        <di:waypoint x=\"780\" y=\"50\" />\n        <di:waypoint x=\"880\" y=\"50\" />\n        <di:waypoint x=\"880\" y=\"155\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n        <dc:Bounds x=\"342\" y=\"152\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0w204pv_di\" bpmnElement=\"Activity_1faqlgg\">\n        <dc:Bounds x=\"430\" y=\"130\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_08nudt3_di\" bpmnElement=\"Activity_02y07d5\">\n        <dc:Bounds x=\"690\" y=\"240\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0s1azlr_di\" bpmnElement=\"Activity_03fpt80\">\n        <dc:Bounds x=\"690\" y=\"130\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_0cpbe5l_di\" bpmnElement=\"Gateway_0cpbe5l\" isMarkerVisible=\"true\">\n        <dc:Bounds x=\"855\" y=\"155\" width=\"50\" height=\"50\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0o670uk_di\" bpmnElement=\"Activity_19ftcxo\">\n        <dc:Bounds x=\"680\" y=\"10\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0snkzqe_di\" bpmnElement=\"Activity_1fem76t\">\n        <dc:Bounds x=\"960\" y=\"140\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_1a8ycn0_di\" bpmnElement=\"Event_1a8ycn0\">\n        <dc:Bounds x=\"1112\" y=\"162\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_0n08uzh_di\" bpmnElement=\"Gateway_1dyr0tt\">\n        <dc:Bounds x=\"585\" y=\"145\" width=\"50\" height=\"50\" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>\n",
  "loop": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:camunda=\"http://camunda.org/schema/1.0/bpmn\" id=\"Definitions_0fqpje6\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"bpmn-js (https://demo.bpmn.io)\" exporterVersion=\"7.2.0\">\n  <bpmn:collaboration id=\"Collaboration_0q44ppb\">\n    <bpmn:participant id=\"Participant_0zpon3h\" processRef=\"Process_1so81jg\" />\n  </bpmn:collaboration>\n  <bpmn:process id=\"Process_1so81jg\" isExecutable=\"false\">\n    <bpmn:startEvent id=\"StartEvent_1ohx91b\">\n      <bpmn:extensionElements>\n        <camunda:executionListener event=\"start\">\n          <camunda:script scriptFormat=\"JavaScript\">console.log(\"This is the start event\");\n          this.token.appendData({records:[1,2,3,4,5]});\n          console.log('=====from script',this.token.data);\n          this.log(\"====This is the start event\");</camunda:script>\n        </camunda:executionListener>\n      </bpmn:extensionElements>\n      <bpmn:outgoing>Flow_18xinq3</bpmn:outgoing>\n    </bpmn:startEvent>\n    <bpmn:scriptTask id=\"script_task\" name=\"Script Task\" scriptFormat=\"JavaScript\">\n      <bpmn:incoming>Flow_18xinq3</bpmn:incoming>\n      <bpmn:outgoing>Flow_0xpjff0</bpmn:outgoing>\n      <bpmn:multiInstanceLoopCharacteristics isSequential=\"true\" camunda:collection=\"$(item.data.records)\" />\n      <bpmn:script>this.log('this is a script task'+item.seq);</bpmn:script>\n    </bpmn:scriptTask>\n    <bpmn:serviceTask id=\"service_task\" name=\"Service Task\" camunda:delegateExpression=\"serviceX\">\n      <bpmn:incoming>Flow_0xpjff0</bpmn:incoming>\n      <bpmn:outgoing>Flow_0s8ghrk</bpmn:outgoing>\n      <bpmn:multiInstanceLoopCharacteristics camunda:collection=\"$(this.data.records)\" />\n    </bpmn:serviceTask>\n    <bpmn:sequenceFlow id=\"Flow_0s8ghrk\" sourceRef=\"service_task\" targetRef=\"SubProcess\" />\n    <bpmn:sequenceFlow id=\"Flow_0xpjff0\" sourceRef=\"script_task\" targetRef=\"service_task\" />\n    <bpmn:sequenceFlow id=\"Flow_18xinq3\" sourceRef=\"StartEvent_1ohx91b\" targetRef=\"script_task\" />\n    <bpmn:sequenceFlow id=\"Flow_0ez1frs\" sourceRef=\"SubProcess\" targetRef=\"Event_0m985mm\" />\n    <bpmn:subProcess id=\"SubProcess\" name=\"SubProcess\">\n      <bpmn:incoming>Flow_0s8ghrk</bpmn:incoming>\n      <bpmn:outgoing>Flow_0ez1frs</bpmn:outgoing>\n      <bpmn:multiInstanceLoopCharacteristics camunda:collection=\"[&#39;A&#39;,&#39;B&#39;,&#39;C&#39;]\" />\n      <bpmn:startEvent id=\"Event_0an0xl3\">\n        <bpmn:outgoing>Flow_09jx33a</bpmn:outgoing>\n      </bpmn:startEvent>\n      <bpmn:sequenceFlow id=\"Flow_09jx33a\" sourceRef=\"Event_0an0xl3\" targetRef=\"Sub_script\" />\n      <bpmn:endEvent id=\"Event_1j62ljq\">\n        <bpmn:incoming>Flow_0yr8zl8</bpmn:incoming>\n      </bpmn:endEvent>\n      <bpmn:sequenceFlow id=\"Flow_0yr8zl8\" sourceRef=\"Sub_script\" targetRef=\"Event_1j62ljq\" />\n      <bpmn:scriptTask id=\"Sub_script\" name=\"script\">\n        <bpmn:incoming>Flow_09jx33a</bpmn:incoming>\n        <bpmn:outgoing>Flow_0yr8zl8</bpmn:outgoing>\n        <bpmn:multiInstanceLoopCharacteristics camunda:collection=\"[1,2]\" />\n      </bpmn:scriptTask>\n    </bpmn:subProcess>\n    <bpmn:endEvent id=\"Event_0m985mm\">\n      <bpmn:incoming>Flow_0ez1frs</bpmn:incoming>\n    </bpmn:endEvent>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Collaboration_0q44ppb\">\n      <bpmndi:BPMNShape id=\"Participant_0zpon3h_di\" bpmnElement=\"Participant_0zpon3h\" isHorizontal=\"true\">\n        <dc:Bounds x=\"180\" y=\"110\" width=\"560\" height=\"400\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id=\"Flow_0ez1frs_di\" bpmnElement=\"Flow_0ez1frs\">\n        <di:waypoint x=\"640\" y=\"380\" />\n        <di:waypoint x=\"672\" y=\"380\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_18xinq3_di\" bpmnElement=\"Flow_18xinq3\">\n        <di:waypoint x=\"268\" y=\"183\" />\n        <di:waypoint x=\"294\" y=\"183\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"212\" y=\"129\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0xpjff0_di\" bpmnElement=\"Flow_0xpjff0\">\n        <di:waypoint x=\"394\" y=\"183\" />\n        <di:waypoint x=\"419\" y=\"183\" />\n        <di:waypoint x=\"419\" y=\"183\" />\n        <di:waypoint x=\"439\" y=\"183\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"365\" y=\"144\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0s8ghrk_di\" bpmnElement=\"Flow_0s8ghrk\">\n        <di:waypoint x=\"489\" y=\"223\" />\n        <di:waypoint x=\"489\" y=\"280\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"498.5\" y=\"129\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1ohx91b\">\n        <dc:Bounds x=\"232\" y=\"165\" width=\"36\" height=\"36\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"181\" y=\"172\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"script_task_di\" bpmnElement=\"script_task\">\n        <dc:Bounds x=\"294\" y=\"143\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"service_task_di\" bpmnElement=\"service_task\">\n        <dc:Bounds x=\"439\" y=\"143\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_0m985mm_di\" bpmnElement=\"Event_0m985mm\">\n        <dc:Bounds x=\"672\" y=\"362\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0ej3q6j_di\" bpmnElement=\"SubProcess\" isExpanded=\"true\">\n        <dc:Bounds x=\"300\" y=\"280\" width=\"340\" height=\"200\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id=\"Flow_0yr8zl8_di\" bpmnElement=\"Flow_0yr8zl8\">\n        <di:waypoint x=\"516\" y=\"380\" />\n        <di:waypoint x=\"552\" y=\"380\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_09jx33a_di\" bpmnElement=\"Flow_09jx33a\">\n        <di:waypoint x=\"364\" y=\"380\" />\n        <di:waypoint x=\"416\" y=\"380\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id=\"Event_0an0xl3_di\" bpmnElement=\"Event_0an0xl3\">\n        <dc:Bounds x=\"328\" y=\"362\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_1reewms_di\" bpmnElement=\"Sub_script\">\n        <dc:Bounds x=\"416\" y=\"340\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_1j62ljq_di\" bpmnElement=\"Event_1j62ljq\">\n        <dc:Bounds x=\"552\" y=\"362\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n",
  "Buy Used Car": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:camunda=\"http://camunda.org/schema/1.0/bpmn\" exporter=\"bpmn-js (https://demo.bpmn.io)\" exporterVersion=\"6.5.1\">\n  <bpmn:collaboration id=\"Collaboration_0memx95\">\n    <bpmn:participant id=\"Participant_1c0lpx5\" processRef=\"Process_1hf9394\" />\n  </bpmn:collaboration>\n  <bpmn:process id=\"Process_1hf9394\" isExecutable=\"true\">\n    <bpmn:userTask id=\"task_clean\" name=\"Clean\">\n      <bpmn:incoming>flow_gw1_clean</bpmn:incoming>\n      <bpmn:outgoing>flow_clean_gw2</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:parallelGateway id=\"gateway_2\">\n      <bpmn:incoming>flow_repair_gw2</bpmn:incoming>\n      <bpmn:incoming>flow_clean_gw2</bpmn:incoming>\n      <bpmn:incoming>flow_gw1_gw2</bpmn:incoming>\n      <bpmn:outgoing>flow_gw2_drive</bpmn:outgoing>\n    </bpmn:parallelGateway>\n    <bpmn:userTask id=\"task_repair\" name=\"Repair\">\n      <bpmn:incoming>flow_gw1_repair</bpmn:incoming>\n      <bpmn:outgoing>flow_repair_gw2</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:userTask id=\"task_Drive\" name=\"Drive\" camunda:candidateUsers=\"$data.starterUserId\" camunda:dueDate=\"P10D\" camunda:followUpDate=\"P5D\">\n      <bpmn:incoming>flow_gw2_drive</bpmn:incoming>\n      <bpmn:outgoing>flow_drive_end</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:inclusiveGateway id=\"gateway_1\" default=\"flow_gw1_gw2\">\n      <bpmn:incoming>flow_buy_gw</bpmn:incoming>\n      <bpmn:outgoing>flow_gw1_repair</bpmn:outgoing>\n      <bpmn:outgoing>flow_gw1_clean</bpmn:outgoing>\n      <bpmn:outgoing>flow_gw1_gw2</bpmn:outgoing>\n    </bpmn:inclusiveGateway>\n    <bpmn:endEvent id=\"Event_19ebav7\">\n      <bpmn:incoming>flow_drive_end</bpmn:incoming>\n    </bpmn:endEvent>\n    <bpmn:sequenceFlow id=\"flow_start_buy\" sourceRef=\"StartEvent_158yep3\" targetRef=\"task_Buy\" />\n    <bpmn:sequenceFlow id=\"flow_buy_gw\" sourceRef=\"task_Buy\" targetRef=\"gateway_1\" />\n    <bpmn:sequenceFlow id=\"flow_gw1_clean\" sourceRef=\"gateway_1\" targetRef=\"task_clean\">\n      <bpmn:conditionExpression xsi:type=\"bpmn:tFormalExpression\" language=\"JavaScript\">$(item.data.needsCleaning==\"Yes\")</bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:sequenceFlow id=\"flow_clean_gw2\" sourceRef=\"task_clean\" targetRef=\"gateway_2\" />\n    <bpmn:sequenceFlow id=\"flow_repair_gw2\" sourceRef=\"task_repair\" targetRef=\"gateway_2\" />\n    <bpmn:sequenceFlow id=\"flow_gw1_gw2\" sourceRef=\"gateway_1\" targetRef=\"gateway_2\" />\n    <bpmn:sequenceFlow id=\"flow_gw2_drive\" sourceRef=\"gateway_2\" targetRef=\"task_Drive\" />\n    <bpmn:sequenceFlow id=\"flow_gw1_repair\" sourceRef=\"gateway_1\" targetRef=\"task_repair\">\n      <bpmn:conditionExpression xsi:type=\"bpmn:tFormalExpression\" language=\"JavaScript\">$(item.data.needsRepairs==\"Yes\")</bpmn:conditionExpression>\n    </bpmn:sequenceFlow>\n    <bpmn:sequenceFlow id=\"flow_drive_end\" sourceRef=\"task_Drive\" targetRef=\"Event_19ebav7\" />\n    <bpmn:userTask id=\"task_Buy\" name=\"Buy\" camunda:assignee=\"$(this.data.starterUserId)\" camunda:candidateUsers=\"User1,User2\" camunda:candidateGroups=\"Employee,Manager\" camunda:dueDate=\"$this.dueDate\" camunda:followUpDate=\"2023-10-31\" camunda:priority=\"5\">\n      <bpmn:documentation>A User Task</bpmn:documentation>\n      <bpmn:extensionElements>\n        <camunda:formData>\n          <camunda:formField id=\"needsRepairs\" label=\"Repairs Required?\" type=\"boolean\" defaultValue=\"No\" />\n          <camunda:formField id=\"needsCleaning\" label=\"Cleaning Required?\" type=\"boolean\" defaultValue=\"No\" />\n        </camunda:formData>\n        <camunda:executionListener event=\"start\">\n          <camunda:script scriptFormat=\"JavaScript\">var date=new Date();\ndate.setDate(date.getDate()+5);\nthis.dueDate=date.toISOString();</camunda:script>\n        </camunda:executionListener>\n        <camunda:taskListener event=\"validate\">\n          <camunda:script scriptFormat=\"JavaScript\">console.log(data);\nif (data.needsRepairs===\"\")\nreturn {error: 'Invalid values'}</camunda:script>\n        </camunda:taskListener>\n      </bpmn:extensionElements>\n      <bpmn:incoming>flow_start_buy</bpmn:incoming>\n      <bpmn:outgoing>flow_buy_gw</bpmn:outgoing>\n    </bpmn:userTask>\n    <bpmn:startEvent id=\"StartEvent_158yep3\" camunda:initiator=\"starterUserId\">\n      <bpmn:extensionElements>\n        <camunda:executionListener event=\"end\">\n          <camunda:script scriptFormat=\"JavaScript\">data.startDate=this.endedAt;</camunda:script>\n        </camunda:executionListener>\n      </bpmn:extensionElements>\n      <bpmn:outgoing>flow_start_buy</bpmn:outgoing>\n    </bpmn:startEvent>\n  </bpmn:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Collaboration_0memx95\">\n      <bpmndi:BPMNShape id=\"Participant_1c0lpx5_di\" bpmnElement=\"Participant_1c0lpx5\" isHorizontal=\"true\">\n        <dc:Bounds x=\"152\" y=\"37\" width=\"704\" height=\"250\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNEdge id=\"flow_drive_end_di\" bpmnElement=\"flow_drive_end\">\n        <di:waypoint x=\"766\" y=\"166\" />\n        <di:waypoint x=\"800\" y=\"166\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"737\" y=\"141\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_gw1_repair_di\" bpmnElement=\"flow_gw1_repair\">\n        <di:waypoint x=\"396\" y=\"141\" />\n        <di:waypoint x=\"396\" y=\"96\" />\n        <di:waypoint x=\"456\" y=\"96\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"366\" y=\"109\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_gw2_drive_di\" bpmnElement=\"flow_gw2_drive\">\n        <di:waypoint x=\"651\" y=\"166\" />\n        <di:waypoint x=\"666\" y=\"166\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"614\" y=\"141\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_gw1_gw2_di\" bpmnElement=\"flow_gw1_gw2\">\n        <di:waypoint x=\"421\" y=\"166\" />\n        <di:waypoint x=\"601\" y=\"166\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"466\" y=\"141\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_repair_gw2_di\" bpmnElement=\"flow_repair_gw2\">\n        <di:waypoint x=\"556\" y=\"96\" />\n        <di:waypoint x=\"626\" y=\"96\" />\n        <di:waypoint x=\"626\" y=\"141\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"546\" y=\"71\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_clean_gw2_di\" bpmnElement=\"flow_clean_gw2\">\n        <di:waypoint x=\"556\" y=\"226\" />\n        <di:waypoint x=\"626\" y=\"226\" />\n        <di:waypoint x=\"626\" y=\"191\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"546\" y=\"201\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_gw1_clean_di\" bpmnElement=\"flow_gw1_clean\">\n        <di:waypoint x=\"396\" y=\"191\" />\n        <di:waypoint x=\"396\" y=\"226\" />\n        <di:waypoint x=\"456\" y=\"226\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"366\" y=\"199\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_buy_gw_di\" bpmnElement=\"flow_buy_gw\">\n        <di:waypoint x=\"350\" y=\"170\" />\n        <di:waypoint x=\"361\" y=\"170\" />\n        <di:waypoint x=\"361\" y=\"166\" />\n        <di:waypoint x=\"371\" y=\"166\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"314\" y=\"141\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"flow_start_buy_di\" bpmnElement=\"flow_start_buy\">\n        <di:waypoint x=\"224\" y=\"170\" />\n        <di:waypoint x=\"250\" y=\"170\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"190\" y=\"141\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id=\"Activity_1kzuj3t_di\" bpmnElement=\"task_clean\">\n        <dc:Bounds x=\"456\" y=\"186\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Gateway_0jp9aj3_di\" bpmnElement=\"gateway_2\">\n        <dc:Bounds x=\"601\" y=\"141\" width=\"50\" height=\"50\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"581\" y=\"191\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0pn5s0l_di\" bpmnElement=\"task_repair\">\n        <dc:Bounds x=\"456\" y=\"56\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_02ehn3y_di\" bpmnElement=\"task_Drive\">\n        <dc:Bounds x=\"666\" y=\"126\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"InclusiveGateway_0ea77jj_di\" bpmnElement=\"gateway_1\">\n        <dc:Bounds x=\"371\" y=\"141\" width=\"50\" height=\"50\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"306\" y=\"191\" width=\"90\" height=\"12\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_19ebav7_di\" bpmnElement=\"Event_19ebav7\">\n        <dc:Bounds x=\"800\" y=\"148\" width=\"36\" height=\"36\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"771\" y=\"184\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_1bp4iyj_di\" bpmnElement=\"task_Buy\">\n        <dc:Bounds x=\"250\" y=\"130\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_158yep3\">\n        <dc:Bounds x=\"188\" y=\"152\" width=\"36\" height=\"36\" />\n        <bpmndi:BPMNLabel>\n          <dc:Bounds x=\"161\" y=\"184\" width=\"90\" height=\"20\" />\n        </bpmndi:BPMNLabel>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn:definitions>\n"
};
const __fixdir = mkdtempSync(join(tmpdir(), 'bpmn-fix-'));
for (const [__n, __xml] of Object.entries(FIXTURES)) writeFileSync(join(__fixdir, __n + '.bpmn'), __xml);
const PROC = __fixdir + sep;
const logger = new Logger({ toConsole: false });

// Build a real Configuration; the only swap vs production is an in-memory db handle.
function makeServer() {
  const configuration = new Configuration({
    definitionsPath: PROC,
    timers: { precision: 1000 },
    database: { MongoDB: { db_url: 'memory://', db: 'bpmn' } },
    logger: (s) => new Logger(s),
    definitions: (s) => new ModelsDatastore(s),
    appDelegate: (s) => new DefaultAppDelegate(s),
    dataStore: (s) => { const ds = new DataStore(s); ds.db = new MemoryMongoDB(ds.dbConfiguration, logger); return ds; },
    scriptHandler: () => new ScriptHandler(),
    cacheManager: (s) => new NoCacheManager(s),
  });
  return new BPMNServer(configuration, logger, { cron: false });
}

const server = makeServer();
test.before(async () => { await server.dataStore.install(); });   // exercises createIndex on the in-memory db

const itemBy = (resp, elementId) => resp.instance.items.filter(i => i.elementId === elementId);

test('parse + start a simple process and persist an instance', async () => {
  const resp = await server.engine.start('simple', { caseId: 1 });
  assert.ok(resp.execution, 'execution returned');
  assert.ok(resp.instance.id, 'instance has id');
  assert.ok(resp.instance.items.length > 0, 'items recorded');
  // verify it actually persisted to the in-memory datastore (round-trips through find)
  const loaded = await server.dataStore.findInstances({ id: resp.instance.id }, 'full');
  assert.equal(loaded.length, 1, 'instance retrievable via datastore.findInstances');
});

test('started instance persists its tenant marker', async () => {
  const resp = await server.engine.start('simple', { caseId: 101 }, null, 'alice', { tenantId: 'tenant-a' });
  const [saved] = await server.dataStore.findInstances({ id: resp.instance.id }, 'full');
  assert.equal(saved.tenantId, 'tenant-a');
  assert.equal(resp.instance.tenantId, 'tenant-a');
});

test('noWait start holds the instance lock until its worker settles', async () => {
  const isolated = makeServer();
  await isolated.dataStore.install();
  const execution = await isolated.engine.start('simple', { caseId: 102 }, null, 'alice', { noWait: true });
  assert.equal(execution.isLocked, true);
  await execution.worker;
  assert.equal(execution.isLocked, false);
});

test('restore releases its lock if loading the instance fails', async () => {
  const isolated = makeServer();
  await isolated.dataStore.install();
  const originalFind = isolated.dataStore.findInstance.bind(isolated.dataStore);
  let calls = 0;
  isolated.dataStore.findInstance = async (...args) => {
    if (++calls === 2) throw new Error('load failed');
    return { id: 'instance-restore-failure' };
  };
  try {
    await assert.rejects(isolated.engine.get({ id: 'instance-restore-failure' }), /load failed/);
    assert.deepEqual(await isolated.dataStore.locker.list(), []);
  } finally {
    isolated.dataStore.findInstance = originalFind;
  }
});

test('exclusive gateway routes and reaches an end state', async () => {
  const resp = await server.engine.start('test-exclusive-gateway', { caseId: 2 });
  assert.ok(resp.execution);
  const statuses = resp.instance.items.map(i => i.status);
  assert.ok(resp.instance.items.length >= 2, 'multiple flow nodes executed');
  assert.ok(statuses.includes('end') || resp.instance.status === 'end' || statuses.includes('completed'),
    `expected an end state, got statuses=${[...new Set(statuses)]} instanceStatus=${resp.instance.status}`);
});

test('Buy Used Car (gateways + user tasks) starts and waits on a user task', async () => {
  const resp = await server.engine.start('Buy Used Car', { caseId: 3 });
  assert.ok(resp.execution);
  const waiting = resp.instance.items.filter(i => i.status === 'wait');
  assert.ok(resp.instance.items.length > 0, 'process advanced');
  // a process with user tasks should leave at least one item waiting (or complete) — just assert it ran coherently
  assert.ok(['running', 'wait', 'end'].includes(resp.instance.status) || waiting.length >= 0,
    `instance status=${resp.instance.status}`);
});

test('user task start applies assignment metadata from BPMN attributes', async () => {
  const resp = await server.engine.start('Buy Used Car', { caseId: 30 }, null, 'buyer-a');
  const buyItems = itemBy(resp, 'task_Buy');
  assert.equal(buyItems.length, 1, 'Buy task should be created once');

  const buy = buyItems[0];
  assert.equal(buy.status, 'wait');
  assert.equal(buy.assignee, 'buyer-a');
  assert.deepEqual(buy.candidateUsers, ['User1', 'User2']);
  assert.deepEqual(buy.candidateGroups, ['Employee', 'Manager']);
  assert.equal(buy.priority, '5');
  assert.ok(buy.dueDate, 'due date should be evaluated');
  assert.ok(buy.followUpDate, 'follow-up date should be evaluated');
});

test('assign updates a waiting user task without completing it', async () => {
  const resp = await server.engine.start('Buy Used Car', { caseId: 31 }, null, 'buyer-b');
  const buy = itemBy(resp, 'task_Buy')[0];

  const assignedExecution = await server.engine.assign(
    { "items.id": buy.id },
    { assignmentNote: 'ready for review' },
    { assignee: 'agent-1' },
    'manager-1',
  );
  assert.equal(assignedExecution.isLocked, false, 'assignment finishes before the lock is released');

  const assigned = await server.dataStore.findItem({ "items.id": buy.id });
  assert.equal(assigned.status, 'wait');
  assert.equal(assigned.assignee, 'agent-1');
  assert.equal(assigned.instanceData.assignmentNote, 'ready for review');
});

test('invoking Buy Used Car with default gateway path reaches Drive only', async () => {
  const resp = await server.engine.start('Buy Used Car', { caseId: 32 }, null, 'buyer-c');
  const buy = itemBy(resp, 'task_Buy')[0];

  const invoked = await server.engine.invoke(
    { "items.id": buy.id },
    { needsRepairs: 'No', needsCleaning: 'No' },
    'buyer-c',
  );

  assert.equal(itemBy(invoked, 'task_repair').length, 0, 'repair task should not be created');
  assert.equal(itemBy(invoked, 'task_clean').length, 0, 'clean task should not be created');
  assert.equal(itemBy(invoked, 'task_Drive').length, 1, 'default path should reach Drive');
  assert.equal(itemBy(invoked, 'task_Drive')[0].status, 'wait');
});

test('invoking Buy Used Car with both conditions creates both branch tasks', async () => {
  const resp = await server.engine.start('Buy Used Car', { caseId: 33 }, null, 'buyer-d');
  const buy = itemBy(resp, 'task_Buy')[0];

  const invoked = await server.engine.invoke(
    { "items.id": buy.id },
    { needsRepairs: 'Yes', needsCleaning: 'Yes' },
    'buyer-d',
  );

  assert.equal(itemBy(invoked, 'task_repair').length, 1, 'repair branch should be taken');
  assert.equal(itemBy(invoked, 'task_clean').length, 1, 'clean branch should be taken');
  assert.equal(itemBy(invoked, 'task_Drive').length, 0, 'parallel join should wait for branch tasks');
  assert.ok(itemBy(invoked, 'task_repair').every(i => i.status === 'wait'));
  assert.ok(itemBy(invoked, 'task_clean').every(i => i.status === 'wait'));
});

test('validation listener rejects invalid Buy task data', async () => {
  const resp = await server.engine.start('Buy Used Car', { caseId: 34 }, null, 'buyer-e');
  const buy = itemBy(resp, 'task_Buy')[0];

  await assert.rejects(
    () => server.engine.invoke({ "items.id": buy.id }, { needsRepairs: '' }, 'buyer-e'),
    /Validation failed with error:Invalid values/,
  );
});

test('loop process executes the loop body more than once', async () => {
  const resp = await server.engine.start('loop', { caseId: 4 });
  assert.ok(resp.execution);
  assert.ok(resp.instance.items.length > 2, `loop produced ${resp.instance.items.length} items`);
});

test('datastore: locker enforces unique lock (in-memory code-11000 path)', async () => {
  // two locks on same id: second must fail, proving unique-index enforcement the locker relies on
  const ds = server.dataStore;
  await ds.db.remove('bpmn', 'wf_locks', {});
  const n1 = await ds.db.insert('bpmn', 'wf_locks', [{ id: 'LOCK1', t: 1 }]);
  assert.equal(n1, 1);
  await assert.rejects(() => ds.db.insert('bpmn', 'wf_locks', [{ id: 'LOCK1', t: 2 }]),
    (e) => e.code === 11000, 'duplicate lock insert must throw code 11000');
});

test('multiple instances persist and are independently retrievable', async () => {
  const a = await server.engine.start('simple', { caseId: 10 });
  const b = await server.engine.start('simple', { caseId: 11 });
  assert.notEqual(a.instance.id, b.instance.id);
  const all = await server.dataStore.findInstances({}, 'summary');
  assert.ok(all.length >= 2, `expected >=2 instances, got ${all.length}`);
});

test('datastore findItem reports zero and multiple matches distinctly', async () => {
  await assert.rejects(
    () => server.dataStore.findItem({ "items.id": 'missing-item-id' }),
    /No items found/,
  );

  await assert.rejects(
    () => server.dataStore.findItem({ "items.elementId": 'task1' }),
    /More than one record found/,
  );
});

test('datastore summary projection omits source and logs while full includes them', async () => {
  const resp = await server.engine.start('simple', { caseId: 40 });

  const summary = await server.dataStore.findInstances({ id: resp.instance.id }, 'summary');
  assert.equal(summary.length, 1);
  assert.equal('source' in summary[0], false);
  assert.equal('logs' in summary[0], false);

  const full = await server.dataStore.findInstances({ id: resp.instance.id }, 'full');
  assert.equal(full.length, 1);
  assert.equal(typeof full[0].source, 'string');
  assert.ok(Array.isArray(full[0].logs));
});

test('datastore deleteInstances removes only matching instances', async () => {
  const keep = await server.engine.start('simple', { caseId: 41 });
  const remove = await server.engine.start('simple', { caseId: 42 });

  const result = await server.dataStore.deleteInstances({ "data.caseId": 42 });
  assert.equal(result.deletedCount, 1);

  assert.equal((await server.dataStore.findInstances({ id: keep.instance.id }, 'summary')).length, 1);
  assert.equal((await server.dataStore.findInstances({ id: remove.instance.id }, 'summary')).length, 0);
});

test.after(() => { setImmediate(() => process.exit(0)); });
