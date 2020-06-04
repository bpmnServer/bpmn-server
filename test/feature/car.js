const { BPMNServer , Execution , DefaultHandler , Logger } = require("../../");

const logger = new Logger({ toConsole: false });



const source = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions 
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:camunda="http://camunda.org/schema/1.0/bpmn" 
    exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.5.1">
  <bpmn:collaboration id="Collaboration_0memx95">
    <bpmn:participant id="Participant_1c0lpx5" processRef="Process_1hf9394" />
  </bpmn:collaboration>
  <bpmn:process id="Process_1hf9394" isExecutable="true">
    <bpmn:startEvent id="StartEvent_158yep3">
      <bpmn:outgoing>flow_start_buy</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="task_Buy" name="Buy">
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="repairsRequired" label="Repairs Required?" type="boolean" />
          <camunda:formField id="cleaningRequired" label="Cleaning Required?" type="boolean" />
        </camunda:formData>
      </bpmn:extensionElements>
      <bpmn:incoming>flow_start_buy</bpmn:incoming>
      <bpmn:outgoing>flow_buy_gateway</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="task_clean" name="Clean">
      <bpmn:incoming>flow_gateway_clean</bpmn:incoming>
      <bpmn:outgoing>flow_clean_gateway</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:parallelGateway id="gateway_2">
      <bpmn:incoming>flow_repair_gateway</bpmn:incoming>
      <bpmn:incoming>flow_clean_gateway</bpmn:incoming>
      <bpmn:outgoing>flow_gateway_drive</bpmn:outgoing>
    </bpmn:parallelGateway>
    <bpmn:endEvent id="Event_19ebav7">
      <bpmn:incoming>flow_drive_end</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:userTask id="task_repair" name="Repair">
      <bpmn:incoming>flow_gateway_repair</bpmn:incoming>
      <bpmn:outgoing>flow_repair_gateway</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="flow_start_buy" sourceRef="StartEvent_158yep3" targetRef="task_Buy" />
    <bpmn:sequenceFlow id="flow_buy_gateway" sourceRef="task_Buy" targetRef="gateway_1" />
    <bpmn:sequenceFlow id="flow_gateway_repair" sourceRef="gateway_1" targetRef="task_repair">
      <bpmn:conditionExpression>(this.needsRepairs==true)</bpmn:conditionExpression>
    </bpmn:sequenceFlow >
    <bpmn:sequenceFlow id="flow_gateway_clean" sourceRef="gateway_1" targetRef="task_clean">
      <bpmn:conditionExpression>(this.needsCleaning==true)</bpmn:conditionExpression>
    </bpmn:sequenceFlow >
    <bpmn:sequenceFlow id="flow_repair_gateway" sourceRef="task_repair" targetRef="gateway_2" />
    <bpmn:sequenceFlow id="flow_clean_gateway" sourceRef="task_clean" targetRef="gateway_2" />
    <bpmn:sequenceFlow id="flow_gateway_drive" sourceRef="gateway_2" targetRef="task_Drive" />
    <bpmn:sequenceFlow id="flow_drive_end" sourceRef="task_Drive" targetRef="Event_19ebav7" />
    <bpmn:userTask id="task_Drive" name="Drive">
      <bpmn:incoming>flow_gateway_drive</bpmn:incoming>
      <bpmn:outgoing>flow_drive_end</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:inclusiveGateway id="gateway_1">
      <bpmn:incoming>flow_buy_gateway</bpmn:incoming>
      <bpmn:outgoing>flow_gateway_repair</bpmn:outgoing>
      <bpmn:outgoing>flow_gateway_clean</bpmn:outgoing>
    </bpmn:inclusiveGateway>
  </bpmn:process>
</bpmn:definitions>
`;

//=-=-=-==============================

let name = 'Buy Used Car';
let process;
let needsRepairs = true;
let needsCleaning = true;

Feature('Buy Used Car', () => {
  Scenario('All path', () => {
    Given('a bpmn source with one user task', () => {
       // server = new BPMNServer.BPMNServer(config);
        process = new Execution(name, source, new DefaultHandler(logger),logger);
        
    });

    When('a process defintion is executed', async () => {

        await process.execute(null, { needsCleaning: needsCleaning, needsRepairs: needsRepairs });

    });

      Then('check for output to have engine', () => {
//          expect(execution).to.have.property('engine');
    });
      
       and('Buy the car', async () => {
          process.signal('task_Buy', {}); // Buy
       });


      and('Restore the Process', async () => {
          let state = process.getState();
          process = await Execution.restore(state, new DefaultHandler(logger), logger);
      });


      and('Clean it', async () => {

          if (needsCleaning)
              process.signal('task_clean', {});    // Clean
      });
      
      and('Repair it', async () => {
          if (needsRepairs)
              process.signal('task_repair', {});    // Clean
      }); 
      and('Drive it 1', async () => {
          process.signal('task_Drive', {});

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

