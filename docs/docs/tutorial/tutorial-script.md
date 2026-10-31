# Tutorial: Executing the Tutorial from NodeJs
## Prepare a Script
Let us create a TypeScript (or JavaScript if you prefer) file named 'leave.ts'
```ts
// Configuration is the entry point to Application; defining your setup and customization
import { configuration } from './';

// import the objects we need from 'bpmn-server'
import { BPMNServer,BPMNAPI, SecureUser } from 'bpmn-server';
```

let us get Server and API objects:
```ts
const server = new BPMNServer(configuration); 
const api = new BPMNAPI(server);
```
start a function 'leave()':
```ts
leave();


async function leave() {
}
```
It needs to be `async` functions since we will be making many async calls to the server with 'await' statement.

Since this is a script, a secure one, we will simulate a user or get user info from a secure app.

```ts
        let user1 = new SecureUser({userName:'user1',userGroups:['Employee']});
```
Assign a caseId:

```ts
        let caseId =1052;
        
        let response;
    
        console.log('-------------------');
```
## Start the workflow:
we use [api.engine.start](../api/interfaces/IAPIEngine.md/#start)
```ts
        console.log('Starting a Leave Application');

        // syntax: ▸ start(name, data?, user?, options?): Promise<IExecution>
        let response = await api.engine.start('Leave Application',{caseId} ,user1);
```
Let us analyse response:
```ts
        
        console.log(
                'instance',response.instance.id,
                'status:',response.instance.status,
                'items:',response.instance.items.length);

        response.instance.items.forEach(item=>{
            console.log('   item:',item.seq,item.elementId,'status:',item.status,'assignee:',item.assignee?? '');
        });
```
results:
```
instance 964a2048-d37c-4a1d-805b-159fc1438872 status: running items: 3
   item: 0 StartEvent_1 status: end assignee:
   item: 1 Flow_0xa1hl7 status: end assignee:
   item: 2 Request status: wait assignee: user1
```
## Invoke Request Task        
we use [api.engine.invoke](../api/interfaces/IAPIEngine.md/#invoke)
```ts
        // syntax: ▸ invoke(query, data?, user?, options?): Promise<IExecution>

        response = await api.engine.invoke({ "id": response.instance.id, "items.elementId": 'Request'},
            {   RequestReason:"Feels Like it",
                LeaveType:"Sick",
                StartDate:"2024-05-16",
                EndDate:"2024-05-22"},
            user1);

        console.log('---------------------------- after Request ');

        response.instance.items.forEach(item=>{
            console.log('   item:',item.seq,item.elementId,'status:',item.status,'assignee:',item.assignee?? '');
        });
```
Results:
```
---------------------------- after Request 
   item: 0 StartEvent_1 status: end assignee: -
   item: 1 Flow_0xa1hl7 status: end assignee: -
   item: 2 Request status: end assignee: user1
   item: 3 Flow_1ig8mx7 status: end assignee: -
   item: 4 Approve status: wait assignee: manager1
   item: 5 timer-event status: wait assignee: -
```
## Simulate a Manager user
```ts

    let manager1 = new SecureUser({userName:'manager1',userGroups:['Manager']});
```
Let us find out the pending Tasks for our user:
We use [api.data.findItems](../api/interfaces/IAPIData.md/#finditems)
```ts
    // syntax: ▸ findItems(query, user?): Promise<IItemData[]>
    let list=await api.data.findItems(
        {   "items.status": 'wait',         // items that have a status of wait
            "items.type":'bpmn:UserTask' }, // and of type UserTask
        manager1    // user: used to filter scope and security
        );
        
        list.forEach(item=>{
                console.log('findItems: item: ',item.elementId,'model',item.processName,'caseId',item.data.caseId,
                'started:',item.startedAt.toISOString().split('T')[0]);

        });    
   
```
results:
```
findItems: item:  Approve model Leave Application caseId 1062 started: 2024-05-10
```
## Invoke Approve Task

```ts        
        response = await api.engine.invoke(
            { "id": response.instance.id, "items.elementId": 'Approve'}, // query
            {   approval:"A" },     // data
            manager1);

        console.log('---------------------------- after Approve ');

        response.instance.items.forEach(item=>{
            console.log('   item:',item.seq,item.elementId,'status:',item.status,'assignee:',item.assignee?? '');
        });
```
Results:
```
---------------------------- after Approve 
   item: 0 StartEvent_1 status: end assignee: -
   item: 1 Flow_0xa1hl7 status: end assignee: -
   item: 2 Request status: end assignee: user1
   item: 3 Flow_1ig8mx7 status: end assignee: -
   item: 4 Approve status: end assignee: manager1
   item: 5 timer-event status: end assignee: -
   item: 6 Flow_1my72g7 status: end assignee: -
   item: 7 Gateway_1kqewfd status: end assignee: -
   item: 10 Flow_1ufmnuh status: end assignee: -
   item: 11 Activity_1rx1txe status: end assignee: -
   item: 12 Flow_1un6mui status: end assignee: -
   item: 13 Event_1qg3mz1 status: end assignee: -
```
```ts
    return;
    
    }
```

