# Table of Contents
- [instance Data](#instance-data) 
- [Data Scope](#data-scope) 
- [Query on Data](#query-on-data) 
- [input/Ooutput Data](#input-output-data) 


# Instance Data
Instance Data can be manipulated in several ways:

## As Input to Engine calls

```javascript

    const input={ model: 'Thunderbird', needsRepairs: false, needsCleaning: false };
    response = await engine.invoke({items: { id: itemId } }, input );

```

## Expressions
    keeping in mind that the bpmn definition defines conditional flow as such:

```javascript

    <bpmn:sequenceFlow id="flow_gw1_clean" sourceRef="gateway_1" targetRef="task_clean">
      <bpmn:conditionExpression xsi:type="bpmn:tExpression"><![CDATA[
      (this.needsCleaning=="Yes")
      ]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>

```

## Part of Script and Service Task
```javascript

    <bpmn2:scriptTask id="task_reminder" name="Issue Reminder">
      <bpmn2:incoming>SequenceFlow_1h10gv4</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_0cokf0m</bpmn2:outgoing>
      <bpmn2:script><![CDATA[
            let data = this.token.data;
            console.log("sending a reminder scirpt");
            console.log(data);
            
            if (typeof data.reminderCounter === 'undefined') {
              data['reminderCounter']=0;
            }            
            
            data['reminderCounter']=data['reminderCounter']+1;
            this.token.log('testing from the inside: ');
      ]]></bpmn2:script>
    </bpmn2:scriptTask>

```

## AppDelegate

   Similar to Script and Service AppDelegate can manupilate Instance data, however AppDelegate are stateless.

## Script Extensions

Script Extensions are supported in release 1.1 and later, allowing you to add a script to any node.

In this example we are adding a script to bpmn:startEvent

```javascript

    <bpmn:startEvent id="StartEvent_1ohx91b">
      <bpmn:extensionElements>
        <camunda:script event="start"><![CDATA[
        console.log("This is the start event");
          this.applyInput({records:[1,2,3]});
          console.log(this.data);
          console.log("This is the start event");]]></camunda:script>
      </bpmn:extensionElements>
      <bpmn:outgoing>Flow_18xinq3</bpmn:outgoing>
    </bpmn:startEvent>
    
```
# Data Scope

The entire execution will have one data scope object, shared among all nodes except SubProcess and Loops (Multi-instances), 
each will have own item part of the data object

![Image description](Data_BuyUsedCar.png)

However, for SubProcess and Loop elements a seperate scope 

![Image description](Data_Scripts_Services_model.png)
![Image description](Data_Scripts_Services.png)

# Query on Data
For Details on Query see [Data Query](./api-summary#data-query) 
# Input-Output Data
