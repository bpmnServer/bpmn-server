## Invocation

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
## Execution Behaviour:

### Synchrouns Execution:
The default behaviour is that engine.starts will execute the process in sequence specified in a synchronous fashion and returns control in one of these cases:

  1. Process has completed or Aborted; this happens when all active tokens come to completions
  2. All active tokens( threads) come to completion or wait state like in case of User Input, timers or Send Message

### Async Execution Options

#### Listener

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

#### NoWait option
optional parameter to start to return the instance itself, 

```js

// this will return immediatly

let worker = server.engine.start(name, data, {noWait: true }); 

// this will wait till next wait
let executionContext = await worker;

```

#### AsyncBefore/After

camunda:asyncBefore or camuna:asyncAfter can be specified at any node, the engine will return control on the specified nodes

## Execution
Process Execution is performed based on BPMN 2.0 standards providing access to the following components to participate:
- Event Listener
- Scripts
- Services
- AppDelegate

## context.response Object

`context.response` Object provides communication between your logic and the Engine as follows:

| variable         | description           | 
| -----------------|--------------------------------------| 
| action	        | the action to be taken after element execution |
| input	            | input values for the service| 
| output	        | input values for the service| 
| messageMatchingKey| input values for the service| 
| signalMatchingKey	| input values for the service| 
| errorCode         | error code as defined in BPMN | 
| escalationCode    | escalation code as defined in BPMN| 

### action values:
-   Continue (default)
-   Error
-   Terminate




