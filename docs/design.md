Release 2.0 Design Changes
Release 2.0 contains major changes that require some design attention, this document will list those changes.
## Overal Architecture

### New API
The New AP supports Security as described below
### Changes to Front-end
- Move configuration.ts and appDelegate.ts to WorkflowApp sub-folder
- New AppUtils class; to provide common functions to all process
- Moved application Services to AppServices.ts - to contain Services called by ServiceTasks
- Added Sample UserAccess folder (for demo purposes only) to perform user management
## Data Handling
## User Management and Security

1. `bpmnServer` (npm package) is a backend only, is passed user information in the API
2. bpmn model will define assignee, candidateUsers, candidateUserGroups, they can be string or JS expressions
3. The Application front-end is concerned with managing users authentication and user info (UserName,Groups,Tenant)
```js
       let user1 =new SecureUser({ userName: 'user1', userGroups: ['Owner', 'Others']});
       let response = await api.engine.start('Vacation Request', {reason:'I like it',type:'Vacation'}, user1);
``` 
4. `bpmnServer` will enforce security rules based on the current user (passed by 3)
5. Application fron-end need to pass the implementation of `userService' 
   - `userService` is used for user notification and product installation
6. Demo Application(Express or NestJS) , provides a complete implementation of users management using Passport and MongoDB
7. Please See Tutorial of how it is all put togother

## Handling Access Control

Here is a typical flow of a Process:

1. User1 will `Start` Process `Request Vacation`
2. System will store the initiator as `item.data.requester='User1'` 
3. Since Task Request has `assignee=item.data.requester` only `User1` can invoke this task
4. Once Task Request is completed by User1 , Task Approve will be created.
5. `Task Approve` Need to be assigned to the requester supervisor
    A Javascript event trigger on `start' will determine the supervisor userName and assign it the task
```js
    item.assignee=appServices.getSupervisor(item.data.requester);
```
    Assuming appServices class contain such an async method that my call MongoDB
    Alternatively; in the model editor 
        `assignee` field `$(appServices.getSupervisor(this.data.requester))`

7. To `Notify` the supervisor user, a JS trigger will invoke `notify` function

### Filtering data for Security:
```js
    let pending = await bpmnAPI.data.findItems({ "items.status": 'wait', "items.type": 'bpmn:UserTask' }, user); 
```
or
```js
    let pending = await bpmnAPI.data.getPendingTasks({}, user); 

```
will return all pending tasks that the user is **AUTHORIZED TO SEE** 
To See only Tasks Assigned to User
```js
    let pending = await bpmnAPI.data.getPendingTasks({'items.assignee':user.userName},user); 
```
or you can use filter for the items to check `item.assignee`



