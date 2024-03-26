[bpmn-server](./api/readme.md)

# API Summary [Full Listing](./api/readme.md)

## Service Layer API

Service layer API, supporting access control has the following componets

- [engine](./api/interfaces/IAPIEngine.md) BPMN Execution Engine
- [data](./api/interfaces/IAPIData.md) Provides access to the BPMN datastore for instances
- [model](./api/interfaces/IAPIModel.md) Provides access to BPMN models

To access the service layer API:
```ts
    const api = new BPMNAPI(new BPMNServer(configuration,new Logger({ toConsole: false}),{cron:false}));

    console.log('---calling start----- ');

    let response = await api.engine.start('Leave Application', {reason:'I like it',type:'Vacation'}, SystemUser);

    console.log('---calling assign----- ');
    await api.engine.assign({ id: response.id, "items.elementId": 'Request' }, {},{}, SystemUser);

// or you can designate a specific user
    let user1 =new SecureUser({ userName: 'user1', userGroups: ['Owner', 'Others']});

    console.log('---calling invoke----- ');
    await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {duration:'20 days'}, user1);

    const items = await api.data.findItems({ id: response.id, "items.elementId": 'Request' },SecureUser.SystemUser());

```

## Other Components and Topics

- [configuration](#configuration)
- [appDelegate](#appDelegate)
- [events listener](#events)
- [Timers](timers.md)

