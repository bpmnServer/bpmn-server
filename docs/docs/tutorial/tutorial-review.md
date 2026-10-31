# Tutorial Review

## Let us examine the completed workflow

![Login](./Leave%20Instance%20Details.png)

## Now Let us see the Design Details:

### Capture Initiator UserId:   `Start Event` - `initiator`
```
    initiator	    requester
```
![Login](./design%20initiator.png)

The above will the instance data element `data.requester` to the userName, this will be used later.

### Designate the `assignee` of the `Request Task`
```
	assignee    	$(this.data.requester)
```
![Login](./design%20-%20requester.png)

We now copy the `data.requester` into `item.assignee`, this will restrict access only to user that started the workflow.

### Designate the `assignee` of `Approve Task`

```
	assignee	    #(appServices.getSupervisorUser(this.data.requester))
```
![Login](./design%20-%20approve.png)

In this case, the approver user is in a database collection 'usersManager', so we need to write some TS code to retrieve this info.
Notice `#` to indicate async call, this is requires db call.
```ts
    async getSupervisorUser(userName, context) {
        console.log('getSupervisorUser for:',userName);


        let ds=this.appDelegate.server.dataStore;
        const dburl=ds.dbConfiguration.db; // process.env.MONGO_DB_URL;

        const db=ds.dataStore.db;

        // collection structure: {employee,manager}
        
        let list=await db.find(dburl,'usersManager',{employee:userName});
        let manager;
        if (list.length>0)
            manager=list[0]['manager'];
        
        return manager;
    }

```

## Model documentation

Below is the full documentation of the model:

![Login](./model%20docs.png)







