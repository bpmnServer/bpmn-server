# Table of Contents
- [instance Data](#instance-data) 
- [Data Scope](#data-scope) 
- [Query on Data](#query-on-data) 
- [input/Output Data](#input-output-data) 


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

The entire execution will have one data scope object, shared among all nodes, except the following will have own item part of the data object
  - SubProcess 
  - and Loops (Multi-instances)


![Image description](./Data_BuyUsedCar.PNG)

However, for SubProcess and Loop elements a seperate scope 

![Image description](./Data_Scripts_Services_model.PNG)
![Image description](./Data_Scripts_Services.PNG)

## Accessing data outside your scoe
TOCOME
# Query on Data
You can use Instance data as part of your query for Instances or Items
For Details on Query see [Data Query](./api-summary#data-query) 

# Input-Output Data

Input and output is used in the following scenarios:
- Subprocess
- Service Tasks
- Call Tasks
- Message Events
- Signal Events

Default behaviour is all instance data is passed as an input and all output data is saved or added to the instance data.

But you can modify this behaviour by specifying Input and Output variables;

## Using TransformOutput/TransformInput Events
TransformOutput script when specified it generate an output object of all output variables
This output object is defined as `this.context.response.output`

Similarly, you used TransformInput event to return `this.context.response.input`

The sequence is as follows:

  1.    Event:TransformOutput is called; script set `context.response.output`
  2.    System will invoke the Service
        a.    Passing `context.response.output` to the Service as in input
        b.    System will save Service results as `context.response.input`
  3.    Event:TransformInput is called; script will convert data from `context.response.input`
    

```js
    <bpmn2:serviceTask id="Task_1gpov6r" name="add" implementation="add">
      
      <bpmn2:extensionElements>
        <camunda:script event="transformOutput"><![CDATA[
        this.context.response.output={v1: this.data.v1 , v2: this.data.v2};
        ]]></camunda:script>
        <camunda:script event="transformInput"><![CDATA[
        this.data.result=this.context.response.input;
        ]]></camunda:script>
      </bpmn2:extensionElements>
      
      <bpmn2:incoming>SequenceFlow_0cr3d6e</bpmn2:incoming>
      <bpmn2:outgoing>SequenceFlow_1kdq5qw</bpmn2:outgoing>
    </bpmn2:serviceTask>
```
