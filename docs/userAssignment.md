# Security 


<div id="docs" style="display: block;"> 
<table>
<tbody>
<tr>
<th colspan="5">Leave Application - Relevant Nodes specifications</th>
</tr>
<tr>
<th>id</th>
<th>name</th>
<th>type/feature</th>
<th>details</th>
<th>explanation</th>
</tr>
<tr>
<td>StartEvent_1</td>
<td></td>
<td>bpmn:StartEvent</td>
<td></td>
</tr>
<tr>
<td> </td><td></td>
<td>Initiator</td>
<td>requester</td>
<td>user name that has started the process is saved in `data.requester`</td>
</tr>
<tr>
<td> </td>
<td></td>
</tr>
<tr>
<td>Request</td>
<td>Request</td>
<td>bpmn:UserTask</td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>assignee</td>
<td>$(this.data.requester)</td><td>Only the user that started the request can invoke it</td>
</tr>
<tr>
<td>Approve</td>
<td>Approve</td>
<td>bpmn:UserTask</td>
<td></td>
</tr>
<tr>
<td></td>
<td></td>
<td>script on start </td>
<td>this.assignee=appServices.getSupervisor(item.userName);</td><td>Only the supervisor can perform this task `approval`</td>

</tr>
<tr>
<td>timer-event</td>
<td></td>
<td>bpmn:BoundaryEvent</td>
<td></td>
</tr>

<tr>
<td></td>
<td></td>
<td>timer</td>
<td>Cycle:R3P2D</td><td>Reminder is issued 2 days after Request completion date</td>
</tr>

<tr>
<td>Activity_1escddn</td>
<td>Reminder</td>
<td>bpmn:ScriptTask</td>
<td>/* issue notification here */</td><td>Issue a reminder notification</td>
</tr>
</tbody>
</table>
</div>

# User Identification and Authentication

BPMNServer does not provide user identification and authentication component, but relies on the calling application to authenticate the user.

Remote calls rely on apiKey to be passed along with the userId

### Web
```ts

    const user1 =new SecureUser({ userName: 'user1', userGroups: ['Owner', 'Others']});


    await api.engine.start(modelName,data,{},user1,options);  

``` 

### WebAPI/REST

    Since WebAPP is already authenticated by **APIKey** is trusted to pass user object

```ts

    // get api-key from header
    // url/engine/start

    await api.engine.start(processName,data,user,options);  

``` 
## Using BPMNClient as a service

```ts

    const client= new BPMNClient(url,apiKey);
    // userId is passed here bypassing authentication, assuming user is already authenticated
    
    // await server.engine.start(processName,data,startNode,userId,options);  
    let response = await server.engine.start('Buy Used Car', { caseId: 1050 },null,'user1');

    //await  server.engine.invoke(query, data, userId);

    response = await server.engine.invoke({id: response.id , "items.elementId": 'task_Buy' },{},'user1');

```
## Access Control Rules

### Task Assignee (Camunda Extension)

#### Defining Process Initiator
You can define the variable name for the instance initiator 

![BPMN Editor Initiator](images/initiator.PNG)

This will assign the userId of that started the process
```
    console.log(data.starterUserId)
```

### BPMN Editor

![BPMN Editor Assignee](images/Assignee1.PNG)

At the start of the userTask the designer values are evaluated into the instance item.

These fields can accept the following:
- A string value
- JavaScript expression `$(this.data.requester)`
- JavaScript Async function call `#(services.getSupervisorUser(this.data.requester))`

The last calls a services function:
```ts
class MyServices {
    
    async getSupervisorUser(input, context) {
        return input+'Supervisor';
    }
```

![image](https://github.com/ralphhanna/bpmn-server/assets/11893416/88299e86-dd9d-4fb0-9324-9209904ef881)

For example: variable data.dueDate is copied into item.dueDate 

## Pool as a role

BPMNServer allows you to define pools and using the pool name as userGroup

## Manual Assignment

An application can prove a UI to allow users to assign tasks to others, this can be done throught the 'assign' method:

```

    const assignment = {assignee: 'user3', candidateUsers: ['user4','user5'],dueDate: new Date()};
    const newData={var1:650};


    response = await server.engine.assign({id: response.id , "items.elementId": 'task_Buy' },newData,userId,assignment);
```

## Searching for Assignment Data

To search for specific items for a particular user or group:

```

    var res = await server.dataStore.findItems(
        {
            "items.status": "wait", "items.elementId": "task_Buy",
            "$or": [
                {"items.candidateUsers":"user5"},
                {"items.candidateGroups":"group1"},
                {"items.candidateGroups":"group2"},
                ]

        }
    );
```

The above will return all items Buy Tasks in wait state assigned to 'user5' or 'group1' or 'group2'

If you have selected to enforce Security Rules, the above will by automatically done for you.
