## Introductory Examples
- [Buy Used Car - Using WebApp ](./examples/BuyCar-Web.md)
- [Buy Used Car - Using API](./examples/BuyCar-Server.md)
- [Gateway](./examples/gateway.md)
- [Event Based Gateway ](./examples/gateway.md)
- [Boundary Events](./examples/boundary-events.md)

## Invocation Summary

To Invoke a process from your code:

```javascript
    const { configuration }  = require('../configuration.js');
    const { BPMNServer, Logger } = require('bpmn-server');

    const logger = new Logger({ toConsole: true });

    const server = new BPMNServer(configuration, logger);

    let response = await server.engine.start('Buy Used Car');

    const items = response.items.filter(item => {
        return (item.status == 'wait');
    });

    items.forEach(item => {
        console.log(`  waiting for <${item.name}> -<${item.elementId}> id: <${item.id}> `);
    });
    const itemId = items[0].id;

    console.log(`Invoking Buy id: <${itemId}>`);

    const input={ model: 'Thunderbird', needsRepairs: false, needsCleaning: false };
    response = await engine.invoke({items: { id: itemId } }, input );

    console.log("Ready to drive");

```
### Async Execution
```js
    const logger = new Logger({ toConsole: false });

    const listener = new EventEmitter();

    listener.on('all', function ({ context, event, }) {
        let msg = '';
        if (context.instance.id)
            msg = ' instanceId: ' + context.instance.id;
        if (context.item)
            msg += ' Item: ' + context.item.elementId + " itemId: "+ context.item.id;
        console.log('---Event: -->' + event + msg );
    });

    const server = new BPMNServer(configuration, logger, { cron: false });

    // notice no await for next line
    server.engine.start('serviceTask', { v1: 1, v2: 2 }, listener);
```
In the above example; engine.start return immediatly, but a listener keep track of all event 

## Process Definitions Examples

### Service Task
In Process definition (.bpmn file), use `implementation` attribute to define name of JavaScript/TypeScript Method to perform the Task:
```js
    <bpmn:serviceTask id="serviceTask" name="Service Task" implementation="service1">
    ...
    </bpmn:serviceTask>
```

```js 
class MyAppDelegate extends DefaultAppDelegate{

    // for services that are not defined
    async serviceCalled(item) {
        
    }
    async service1(item) {
        seq++;
        await delay(3000 -(seq * 100) , 'test');
        item.log("SERVICE 1" + item.token.currentNode.id);
    }
}

```
### Script Task
```js
    <bpmn:scriptTask id="scriptTask" name="Script Task">
      <bpmn:script><![CDATA[

        this.log('testing from the inside: '+this.data.loopKey);

        ]]></bpmn:script>
    ..
    </bpmn:scriptTask>
```


### Conditional Flow
```js
      <bpmn:conditionExpression xsi:type="bpmn:tExpression"><![CDATA[
      (this.needsCleaning=="Yes")
      ]]>
</bpmn:conditionExpression>
    </bpmn:sequenceFlow>    

```
### Input Fields
```js
    <bpmn:userTask id="task_Buy" name="Buy">
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="needsRepairs" label="Repairs Required?" type="boolean" />
          <camunda:formField id="needsCleaning" label="Cleaning Required?" type="boolean" />
        </camunda:formData>
      </bpmn:extensionElements>
        ...
    </bpmn:userTask>    

```
### Multiple Start Event

![Image description](./examples/invoice-start.png)

When a definition/process has multiple start node, you need to specify the start node when starting the process:

From the Web UI:

![Image description](./examples/invoice-start-prompt.png)

From API:
```js
    
    response = await server.engine.start('invoice', 
        { reminderCounter: 0, caseId: caseId}, null, 'StartEvent_AP');
```
### Script Extensions

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


### Timer Event
```js
    <bpmn:intermediateCatchEvent id="Event_timer">
      <bpmn:incoming>Flow_1sg7v2d</bpmn:incoming>
      <bpmn:outgoing>Flow_1nku8og</bpmn:outgoing>
      <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
        <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
    </bpmn:intermediateCatchEvent>
```
More on [timers](./timers)
### Multi-instances Tasks

```js
    <bpmn:scriptTask id="scriptTask" name="Script Task">
      <bpmn:incoming>Flow_159xzcz</bpmn:incoming>
      <bpmn:outgoing>Flow_0t7z2os</bpmn:outgoing>
      <bpmn:multiInstanceLoopCharacteristics isSequential="true" camunda:collection="(this.records)" />
      <bpmn:script><![CDATA[this.token.log('testing from the inside: '+this.token.data.loopKey);]]></bpmn:script>
    </bpmn:scriptTask>
```
For Multi-instance data handling [see](./data)
### SubProcess
```js
```
### Call Process
```js
    <bpmn:callActivity id="activity_call" name="Call Task" calledElement="loop">
    ...
    </bpmn:callActivity>

```
In the above example 'loop' is the name of process to be called.
### Message Flow
```js
```

### Throwing and Cathcing Messages
In this example, we will demonstrate how can two seperate processes communicate through "Messages"

#### 1 Throw a message with data
When a process throw a message, bpmn-server checks if there is another process that can catch this message before dispatching it to AppDelegate.

```js
    <bpmn2:intermediateThrowEvent id="throw_msg1" name="msg1">
      <bpmn2:messageEventDefinition id="messageEventDef1" messageRef="Msg1" />
      <bpmn2:extensionElements>
        <camunda:script event="transformOutput"><![CDATA[
        this.context.response.output={caseId: this.token.data.caseId};
        this.context.response.messageMatchingKey={'data.caseId': this.token.data.caseId };
        ]]></camunda:script>
      </bpmn2:extensionElements>
      ...
    </bpmn2:intermediateThrowEvent>
```
The above will through a messsage as follows:
- Message Id:             `Msg1`
- Message Output:         `caseId: <someValue>`

#### 2 Catch a message with data
The second process defines a start event to catch the message `Msg1`
```js
    <bpmn2:startEvent id="StartEvent_1w66wpl" name="msg1">
      ...
      <bpmn2:messageEventDefinition id="messageEventDef4" messageRef="Msg1" />
    </bpmn2:startEvent>

```
Therefore, the system will create a new instance of the second process and assign the Message output data, namely, the caseId

#### 3 Throw a message with data and a Key

In addition, the second process sends a confirmation message `Confirm1` to the first process
```js
    <bpmn2:intermediateThrowEvent id="throw_confirm1" name="confirm1">
      <bpmn2:messageEventDefinition id="messageEventDef2" messageRef="Confirm1" />
      <bpmn2:extensionElements>
        <camunda:script event="transformOutput"><![CDATA[
        this.context.response.output={confirm: true};
        this.context.response.messageMatchingKey={'data.caseId': this.token.data.caseId };
        ]]></camunda:script>
      </bpmn2:extensionElements>
        ...
    </bpmn2:intermediateThrowEvent>
```

Howerver, the challenge here is that make sure the message is sent to the specific instance, that is where the Matching key is used
- Message Id:             `Confirm1`
- Message Output:         `confirm: true`
- Message Matching Keyt:   'data.caseId': this.token.data.caseId 

```js
```

![Image description](./examples/msg-throw-catch.png)

### Input and Output Data Handling

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
AppDelegate.ts has a service:

```js
    async add({ v1, v2 }) {
        console.log("Add Service");
        console.log(v1, v2);
        return v1 + v2;
    }
```
    To test the above:
```js
    const server = new BPMNServer(configuration, logger, { cron: false });
    let response = await server.engine.start('serviceTask', { v1: 1, v2: 2 });
    console.log(response.instance.data)
```
Output:
{ v1: 1, v2: 2, result: 3 }

