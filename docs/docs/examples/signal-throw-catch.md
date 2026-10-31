
# Throwing and Cathcing Signals

## Signals vs Messages

Messages are directed toward a specific recipient node, Signals however are **broadcast** to all potential listeners.

Both Messages and Signals can include correlation keys, called **MessageKeys** to specify specific scope

Therefore, Signals are best used for events that may affect multiple processes or multiple nodes.

## Defining Signals Catch Events

In this example, we will demonstrate how can two seperate processes communicate through **Signals**

P.S. To define a Signal or a Message in the on-line modeler you need to click '+' to create the Signal first.

![Using Modeler](../../images/signal-model1.png) 

In this Process we have 3 User Tasks (Task 1,2,3).
Each of the above Tasks have a **Boundary Event** of type `Signal Catch Event`. Boundary Events start with the parent Task, and wait to be invoked.
These events are:
- Intrrupting; meaning then invoked they will cancel the parent Task
- Have a SignalId **Cancel_All**

![Using Modeler](../../images/signal-model2.png) 

## Throw the Signal 

The simplest way to invoke a Signal is through a **Throw Signal Event**
In the above example, we add a User Task **Cancel ?**, when Invoked by User, It with Throw the Signal **Cancel_All**, this will cause all waiting User Tasks to be cancelled.

Another Way to Throw the Signal is using TypeScript Code as follows:
```ts

    let instances = await api.engine.throwSignal('Cancel_All',{},{"data.caseId":1001},user);

```
Here is the full code sample:
```ts
import { configuration } from './';
import { BPMNServer,BPMNAPI, Logger, SecureUser } from './';

const logger = new Logger({ toConsole: false});
const server = new BPMNServer(configuration, logger, { cron: false });
const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:['admin']});


testSignal();

async function testSignal() {

    let name = 'signal';
    console.log('starting ',name);
    //  delete existing cases
    await api.data.deleteInstances({caseId:1001},user);

    //  start the process
    let response = await api.engine.start(name, {caseId:1001},user);
    report(response.instance);

    console.log('--------------------');

    // throw the signal - once only     - should be caught by 3 items
    //  we restrict the signal to only one particualr caseId:1001

    let instances = await api.engine.throwSignal('Cancel_All',{},{"data.caseId":1001},user);
    
    console.log(`sigal was caught by ${instances.length} items`);

    for(let  i=0;i<instances.length;i++){
        let item=await api.data.findItem({"items.id":instances[i].itemId},user);
        console.log(`-Item  ${item.elementId} - ${item.status}  was invoked by the signal`);
    }

}
function report(instance) {
    var item1 = instance.items.forEach(item => {
        console.log(`- ${item.elementId} - ${item.status} `);
    })
}


```