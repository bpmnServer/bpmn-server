const fs = require('fs');

const source =  file = fs.readFileSync('../../WebApp/processes/invoice.bpmn',
    { encoding: 'utf8', flag: 'r' });

const source2 = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:collaboration id="Collaboration_1vzc4e2">
    <bpmn2:participant id="Participant_1g6enp2" name="Account Payable" processRef="Process_1" />
    <bpmn2:participant id="Participant_1e7gk8x" name="Manager" processRef="Process_0t314on" />
    <bpmn2:messageFlow id="MessageFlow_18tfm5f" sourceRef="task_cancelInvoice" targetRef="IntermediateCatchEvent_1xr94uz" />
  </bpmn2:collaboration>
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_0wntki2">
      <bpmn2:outgoing>SequenceFlow_129vlnl</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:userTask id="task_issueInvoice" name="Issue Invoice">
      <bpmn2:incoming>SequenceFlow_129vlnl</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_1nmqrtq</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:sequenceFlow id="SequenceFlow_129vlnl" sourceRef="StartEvent_0wntki2" targetRef="task_issueInvoice" />
    <bpmn2:sequenceFlow id="SequenceFlow_1nmqrtq" sourceRef="task_issueInvoice" targetRef="ExclusiveGateway_04dgpye" />
    <bpmn2:eventBasedGateway id="ExclusiveGateway_04dgpye">
      <bpmn2:incoming>SequenceFlow_1nmqrtq</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_147bbuq</bpmn2:outgoing>
      <bpmn2:outgoing>SequenceFlow_1ucmquu</bpmn2:outgoing>
      <bpmn2:outgoing>SequenceFlow_0dq5qq6</bpmn2:outgoing>
    </bpmn2:eventBasedGateway>
    <bpmn2:sequenceFlow id="SequenceFlow_147bbuq" sourceRef="ExclusiveGateway_04dgpye" targetRef="receiveTask_payment" />
    <bpmn2:sequenceFlow id="SequenceFlow_1ucmquu" sourceRef="ExclusiveGateway_04dgpye" targetRef="event_timer">
      <bpmn2:conditionExpression xsi:type="bpmn:tExpression">
        <![CDATA[(this.reminderCounter < 3)]]>
      </bpmn2:conditionExpression>
    </bpmn2:sequenceFlow>
    <bpmn2:sequenceFlow id="sequence_timer_reminder" sourceRef="event_timer" targetRef="task_reminder" />
    <bpmn2:sequenceFlow id="SequenceFlow_1ml8g8q" sourceRef="receiveTask_payment" targetRef="EndEvent_0sxnxfz" />
    <bpmn2:sequenceFlow id="SequenceFlow_0dq5qq6" sourceRef="ExclusiveGateway_04dgpye" targetRef="IntermediateCatchEvent_1xr94uz" />
    <bpmn2:intermediateCatchEvent id="IntermediateCatchEvent_1xr94uz" name="Cancel by Admin">
      <bpmn2:incoming>SequenceFlow_0dq5qq6</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_0karre6</bpmn2:outgoing>
      <bpmn2:messageEventDefinition />
    </bpmn2:intermediateCatchEvent>
    <bpmn2:sequenceFlow id="SequenceFlow_0karre6" sourceRef="IntermediateCatchEvent_1xr94uz" targetRef="EndEvent_0ypa03q" />
    <bpmn2:endEvent id="EndEvent_0ypa03q">
      <bpmn2:incoming>SequenceFlow_0karre6</bpmn2:incoming>
      <bpmn2:terminateEventDefinition />
    </bpmn2:endEvent>
    <bpmn2:intermediateCatchEvent id="event_timer" name="30 days later">
      <bpmn2:incoming>SequenceFlow_1ucmquu</bpmn2:incoming>
      <bpmn2:outgoing>sequence_timer_reminder</bpmn2:outgoing>

      <bpmn2:timerEventDefinition id="TimerEventDefinition_07xu06a">
        <bpmn2:timeDuration xsi:type="bpmn2:tExpression">PT2S</bpmn2:timeDuration>
      </bpmn2:timerEventDefinition>

    </bpmn2:intermediateCatchEvent>
    <bpmn2:sendTask id="task_reminder" name="Issue Reminder">
    <script>
      <![CDATA[
            this.token.log('testing from the inside Issue Reminder ');
      ]]>
    </script>
      <bpmn2:incoming>sequence_timer_reminder</bpmn2:incoming>
    </bpmn2:sendTask>
    <bpmn2:receiveTask id="receiveTask_payment" name="Got Payment">
      <bpmn2:incoming>SequenceFlow_147bbuq</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_1ml8g8q</bpmn2:outgoing>
    </bpmn2:receiveTask>
    <bpmn2:endEvent id="EndEvent_0sxnxfz">
      <bpmn2:incoming>SequenceFlow_1ml8g8q</bpmn2:incoming>
    </bpmn2:endEvent>
  </bpmn2:process>
  <bpmn2:process id="Process_0t314on">
    <bpmn2:sequenceFlow id="SequenceFlow_1vs4h9e" sourceRef="StartEvent_0loa7qt" targetRef="task_cancelInvoice" />
    <bpmn2:sequenceFlow id="SequenceFlow_0yw5wjo" sourceRef="task_cancelInvoice" targetRef="IntermediateThrowEvent_0vasq6m" />
    <bpmn2:startEvent id="StartEvent_0loa7qt">
      <bpmn2:outgoing>SequenceFlow_1vs4h9e</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:userTask id="task_cancelInvoice" name="Cancel Invoice">
      <bpmn2:incoming>SequenceFlow_1vs4h9e</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_0yw5wjo</bpmn2:outgoing>
    </bpmn2:userTask>
    <bpmn2:endEvent id="IntermediateThrowEvent_0vasq6m">
      <bpmn2:incoming>SequenceFlow_0yw5wjo</bpmn2:incoming>
    </bpmn2:endEvent>
  </bpmn2:process>
</bpmn2:definitions>
`;

module.exports = { source };