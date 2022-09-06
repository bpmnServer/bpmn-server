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

   Similar to Script and Service AppDelegate can manupilate Instance data.

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

# Query on Data
You can use Instance data as part of your query for Instances or Items
For Details on Query see [Data Query](./api-summary#data-query) 

# Input-Output Data

Input and output is used in the following scenarios:
- Subprocess (input/output)
- Service Tasks (input/output)
- Call Tasks (input/output)
- Throw Message/Signal (input)
- Catch Message/Signal (output)

## Input/Output using Scripts

| variable | description |
|--|--|
| **item.data** | refers to Instance Data or the token data for multi-instance tokens |
| **item.input** | refers to input variable into the called task/event |
| **item.output** |  is the output of the called task/event |

```xml
    <bpmn2:serviceTask id="Activity_00ticbc" name="Add 2 Using scripts" implementation="add" camunda:delegateExpression="add">
        <bpmn2:extensionElements>
        <camunda:executionListener event="start">
          <camunda:script scriptFormat="JavaScript">

            item.input.v1=33;
            item.input.v2=25;

          </camunda:script>
        </camunda:executionListener>
        <camunda:executionListener event="end">
          <camunda:script scriptFormat="JavaScript">
            
            item.data.result2= item.output + 100;

          </camunda:script>
        </camunda:executionListener>
      </bpmn2:extensionElements>

```

## Input/Output using Camunda Extension of Input/Output Parameter

```xml
    <bpmn2:serviceTask id="Task_0xh2iwa" name="service1" implementation="service1">
      <bpmn2:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="repeat">item.data.count</camunda:inputParameter>
          <camunda:outputParameter name="sequence">this.output.seq</camunda:outputParameter>
          <camunda:outputParameter name="returnText">'out text:'+this.output.text</camunda:outputParameter>
        </camunda:inputOutput>
      </bpmn2:extensionElements>

```
* parameter name is the name of variable
* value is a JavaScript expression
    


| Scenario | before call | caller Syntax| after call|
|--|--|--|--|--|
|  Throw Msg| parameters.var1= '123';<br />output.var1 | throw(msg,parameters)| - | 
|  Catch Msg| - | catch(msg,parameters)| data.var1= parameters.var1;|
|  Call Process| parameters.var1= '123';  | result=call(parameters)|data.var1= result.var1; |
|  Service Call | parameters.var1= '123';  | result=call(parameters)| data.var1= result.var1;|
|  Start Event| -| start(parameters)| data.var1= parameters.var1;<br /> data.var1=input.var1;|

* Call
 specs:

        input:
            var1    ->  data.myVar1
            var2    ->  5

        output:
            scenario 1:
            result  ->  <nothing>
            scenario 2:
            result  ->  output.result

  on-entry:
        context.input.var1= 51;

  on-run:
        context.output=call fun(context.input)
  
  on-exit:

        scenario 1:
        data.result  = context.output;
        scenario 2:
        data.result  = context.output.result;

* Throw

    specs:
        
    output:

            caseId  ->  data.caseId
    
    on-entry:
       
         context.output.caseId= data.caseId;

    on-call:

        throw (signal,context.output)

* Catch

    specs:  none 

    start trigger:

            data.caseId=input.caseId;

* Start

    specs:  none 

    start trigger:

            data.caseId=input.caseId;


