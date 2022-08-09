Access Control Layer
=========

# Purpose

# Architecture

# Initialization
## CLI

```javascript

    const server = new BPMNServer(configuration, logger, { cron: false });

    const userKey = await server.acl.login("user1", 'password');

    const response= conn.engine.start(startNodeId,data,userkYe);
``` 

## Web
```javascript

    // 1. server startup:

    const server = new BPMNServer(configuration, logger, { cron: false });

    // 2. at login:
    const userKey = await server.acl.login("user1", 'password');
    request.session.userKey=userKey;

    // 3. at calls

    await conn.engine.start(startNodeId,data,request.session.userKey);  

``` 

## API/REST

```javascript

    // 1. server startup:

    const server = new BPMNServer(configuration, logger, { cron: false });

    // 2. at login:
    const userKey = await server.acl.login("user1", 'password');
    // save in the header

    // 3. at calls
    // get userKey from header

    const response=await conn.engine.start(startNodeId,data,userKey);  

``` 
## BPMN as a service

Every Client Account has a unique URL and an APIKey
All HTTP calls must include apiKey in the header or as a parameter
```javascript

    // 1. server startup:
    const server=new BPMNServer(configuration);


    const definition = server.definitions.import(bpmnFile,name);
    https://url/definitions/import/<name>

   //or
    const definition = server.definitions.load(name);
    https://url/definitions/load/<name>
    definition.describe();

    https://url/definitions/describe/<name>

    
    let response=await server.engine.start(definitionName,startNodeId,data);  

    https://url/engine/start
    and body as follows:
```json
    { "name": "Buy Used Car",
      "startNodeId": "Buy",
      "data": {"caseId": 3030, "claim": "abc"}
      "userId": "johnSmith"
    }
```
    const itemId=await connection.dataStore.find({..});

    https://url/datastore/find/<query>

    response=await server.engine.invoke(itemId,data);  

    https://url/engine/invoke/<itemId>/<data>

``` 

# User Identification and Authentication

BPMNServer provides a simple user identification and authentication tool not inteded for production purposes but only for demonstration purposes only.

## User DataStore

To add a User
```javascript
    const server = new BPMNServer(configuration, logger, { cron: false });
    const userInfo = { user: 'system', apiKey: '123' };

        const user = new User();

        user.userId = 'jsmith';
        user.name = 'John Smith';
        user.email = 'JohnSmith@sample.com';
        user.userGroups = ['admin','manager'];
        user.password = 'password';

        await User.Repository().insert([user]);
    
```
## User Authentication

```javascript

    const server = new BPMNServer(configuration, logger, { cron: false });

    const userKey = await server.acl.login("user1", 'password');


    let response: Execution =await server.engine.start(
        'Buy Used Car', // Process Name
        { caseId: 1050 } // data
        , null           // startNode: null is default
        ,userKey);
```

# Access Rules

**Authorize** [User](#user) to perform [Action]() on [Element]()

evaluated on request;
	- isAuthorized(user,action,object): true/false
	- getAccessList(user,action): list of objects
	- getAuthorizedUsers(action,object): list of users

**Designate** [User]() as [Actor]() 

- Evaluated at specified Event; creates an [Involvement]()

**Assign** [User]() to [Object]()

- Evaluated at Start Event; creates an [Assignment]()

**Notify** [User]() on [Event]() for [Object]() using [Template]()

- Evaluated at Event; creates a [Notification]()

```json
{
  "accessRules": [
    {
      "type": "DesignateRule",
      "id": "1",
      "event": "process.start",
      "user": "$current",
      "assignActor": "owner"
    },
    {
      "type": "AuthorizeRule",
      "id": "2",
      "event": "process.start",
      "userGroup": "Admin",
      "privilege": "View"
    },
    {
      "type": "AuthorizeRule",
      "id": "3",
      "event": "start",
      "actor": "owner",
      "privilege": "Perform",
      "element": "task_Buy"
    },
    {
      "type": "NotifyRule",
      "id": "4",
      "event": "wait",
      "actor": "owner",
      "element": "task_Buy",
      "template": "test"
    },
    {
      "type": "NotifyRule",
      "id": "5",
      "event": "end",
      "user": "user1",
      "element": "task_Buy",
      "template": "test"
    },
    {
      "type": "AssignRule",
      "id": "6",
      "event": "start",
      "actor": "owner",
      "element": "task_Buy"
    },
    {
      "type": "AssignRule",
      "id": "7",
      "event": "start",
      "userGroup": "cleaner",
      "element": "task_Clean"
    } ,
    {
      "type": "AssignRule",
      "id": "8",
      "event": "start",
      "userGroup": "driver",
      "element": "task_Drive"
    }
  ]
}
```
### AccessRules Internal Design
 
 - are define as Json file
 - are loaded with definition is loaded?? more work here??
 - are evaluated at the specified event
 - they add objects to the running instance
   - Assignment
   - Authorization
   - Involvement
   - Notification
 - If notification is immediate; is queued to be issued 
 - If notification is delay; it queued by Cron job

## Object Model 
### Access Rule
- Type
- User spec
- Object
- Event
- Action
- Actor
### Assignment
  - User
  - User Group
  - Object
### Notification
## User
- A specific User
- A User Group
- A Query 
- An Actor
- The current user

## Action
- Process
  - Start
- Instance
  - Cancel
  - Monitor
  - View
- Item
  - View
  - Edit
  - Perform
  - Take
  - Release
  - Assign
 
# Assignment
- Every Process define a set of Actors
- specific user or group can be assigned to an Instance as a specific Actor
- An Assignment is when 
  - A User perform an Action on the Instance [Assignment_rule]
  - An authorized User can create Assignment [Assign] or remove an Assignment [Release]
  - Custom Logic add an Assignment



