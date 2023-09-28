Access Control Layer
=========

# Purpose

ACL provides additional features to BPMN including:
- User Authentication, ensuring the identity of the users
- Access Control, restricting access to authorized users 
- Task Assignment, assigning User Tasks to specific users or groups
- Notification, notifying users or group of specific events

# Initialization

BPMNServer provides a simple user identification and authentication tool not inteded for production purposes but only for demonstration purposes only.
You can add your own library implementing two interfaces:
```
interface IIAM {
    login(userId, password);
    getRemoteUser(userId); 
    getCurrentUser(key): IUser;
    getUser(userId): Promise<IUser>;
    getUsersForGroup(userGroup): Promise<IUser[]>;
    addUser(userId, name, email, userGroups, password): Promise<IUser>;

}

interface IACL {
    listener: EventEmitter;
    canPerform(operation, object);
}

```
You need to change configuration.ts to implement your own library
```
var configuration = new Configuration(
	{
        // ... other parameters here
		IAM: function (server) {
			return new MyIAM(server);
		},
		ACL: function (server) {
			return new MyACL(server);
        }

```

## User Identification and Authentication

BPMNServer provides a simple user identification and authentication tool not inteded for production purposes but only for demonstration purposes only.

### Adding Users

```
    const server = new BPMNServer(configuration, logger, { cron: false });

    await server.iam.addUser('user1','user1','user1@hotmail.com',['admin'],'password');
```
### User DataStore

    const userRepo = User.Repository(server);
    await userRepo.delete({});
    let cUsers = await userRepo.find({});

## User Authentication

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
## Using BPMNClient as a service

```javascript

    const client= new BPMNClient(url,apiKey);
    // userId is passed here bypassing authentication, assuming user is already authenticated
    await client.engine.start(startNodeId,data,userId);  
```

# Task Assignee (Camunda Extension)


### Defining Process Initiator
You can define the variable name for the instance initiator 

![BPMN Editor Initiator](initiator.png)

This will assign the userId of that started the process
```
    console.log(data.starterUserId)
```

## BPMN Editor

![BPMN Editor Assignee](assignee1.png)

Date can be one of the following:
      - an instance variable $(data.Task1_dueDate)
      - $(fromStart('5d'))
      - $(fromStartOf('task1','10h'))
      - $(fromEndOf('task1','10h'))
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



