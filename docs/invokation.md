# Invoking Workflow Scenarios

## Invoking Workflow Using WebApp

Since workflow require a User Interface, a web-app is required as front-end to interact with user providing at least:
- Selection of Workflows to Start
- Show outstanding Tasks
- Show recent Tasks

[see Demo of WebApp ](./examples/BuyCar-Web.md)

## Invoking Proccess through API

To Invoke a process from your code:

API provides a security layer on top of the engine,See [Security](./security.md) for more details.


```ts
    const api = new BPMNAPI(new BPMNServer(configuration,new Logger({ toConsole: false}),{cron:false}));

    let response=await api.engine.start('Leave Request',{type:'Vacation'},SystemUser);

    let instanceId=response.instance.id;

    console.log('Invoking Buy');

    response = await api.engine.invoke({instanceId , elementId: 'task_Buy' },
        { model: 'Thunderbird', needsRepairs: false, needsCleaning: false },SystemUser);

```
The above code uses `SystemUser`, to define another user:
```
    const user1 =new SecureUser({ userName: 'user1', userGroups: ['Owner', 'Others']});
    
```
In real applications, you get userName and userGroups from you application UserAccess. 

## [Invoking Remotely Using WebServices](./examples/BuyCar-Remote.md)

NPM package 'bpmn-client' provide access to bpmn-server using remotely using webServices
```ts

const { BPMNServer } = require('bpmn-client');

test();

async function test() {

    const client = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

    let response = await client.engine.start('Buy Used Car');
``` 

### Async Execution

The default behaviour is that `engine.start` and `engine.invoke` will execute the process in sequence specified in a synchronous fashion and returns control in one of these cases:

  1. Process has completed or Aborted; this happens when all active tokens come to completions
  2. All active tokens( threads) come to completion or **wait** state like in case of User Input, timers or Send Message

However, if you change this behaviour, so the engine execution return without waiting.

```ts
    const api = new BPMNAPI(new BPMNServer(configuration,new Logger({ toConsole: false}),{cron:false}));

    console.log('starting serviceTask');
    let response=await api.engine.start('serviceTask', { v1: 1, v2: 2 }, SystemUser, {noWait:true});

    let instanceId=response.instance.id;

    console.log('immediate response id',response.instance.id);
```
In the above example; engine.start return immediatly, but other nodes will continue to execute 
```js
starting serviceTask
immediate response id d7df99ab-f0b5-4fdf-8ac3-2701d0bf9b79
 add service start: { v1: 1, v2: 2 }
Add Service 5 3
Add Service 33 25
delaying ... 5000
delayed is done.
appDelegate service1 is now complete input: { repeat: '100', inputVar2: undefined } output: 1 item.data { v1: 1, v2: 2, result: 8, result2: 158 }
 service1 end: { v1: 1, v2: 2, result: 8, result2: 158 }
```
