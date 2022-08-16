Access Control Layer
=========

# Purpose

# Architecture

# Initialization
## User Login

    const userKey = await server.iam.login("user1", 'password');

    let user = server.iam.getCurrentUser(userKey);

## CLI

```javascript

    const server = new BPMNServer(configuration, logger, { cron: false });

    const userKey = await server.acl.login("user1", 'password');
    const options={};
    const response= conn.engine.start(startNodeId,data,options,userKey);
``` 

## Web
```javascript

    // 1. server startup:

    const server = new BPMNServer(configuration, logger, { cron: false });

    // 2. at login:
    const userKey = await server.acl.login("user1", 'password');
    request.session.userKey=userKey;

    // 3. at calls

    await server.engine.start(startNodeId,data,{},request.session.userKey);  

``` 

## WebAPI/REST

    Since WebAPP is already authenticated by **APIKey** is trusted to pass user object

```javascript

    // get api-key from header
    // url/engine/start

    await server.engine.start(startNodeId,data,{},{userId:'user1'});  

``` 
## BPMN as a service

```javascript

    const client= new BPMNClient(url,apiKey);
    await client.engine.start(startNodeId,data);  
```
## User Identification and Authentication

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

```json
   [
    { Authorize: {group:'public', toPerform: 'Execute', on: 'start'}},
    { Designate: {user: currentUser, as : 'Owner'} , 
        at:{ element: 'start', event:'start'}},
    { Authorize: {actor:'Owner', toPerform: 'Execute', on: ['Buy','Drive'],}},
    { Assign: {group:'Cleaners', toPerform: 'Execute', on:'Clean',}},
    { Assign: {group:'Mechanics', toPerform: 'Execute', on:'Repair',}},
    { Notify: {actor:'Owner'   },
        at: {element: 'Drive', event:' start'}
        delayed: { min: 15 , cancelOn: 'end' }
   ]
```

**Authorize** is evaluated on request:

	- isAuthorized(user,action,object): true/false
	- getAccessList(user,action): list of objects
	- getAuthorizedUsers(action,object): list of users

**Designate** is evaluated at specified Event; creates an [Involvement]()

**Assign** is evaluated at Start Event; creates an [Assignment]()

**Notify** is evaluated at specified Event; creates a [Notification]()


### AccessRules Internal Design
 
 - are define as Json file
 - are loaded with definition is loaded
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



