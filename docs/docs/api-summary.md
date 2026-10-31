[bpmn-server](./api/readme.md)

# API Summary [Full Listing](./api/readme.md)

## Service Layer API

Service layer API, supporting access control has the following componets

- [engine](./api/interfaces/IAPIEngine.md) BPMN Execution Engine: `start`, `invoke`, `assign`, `throwMessage`,
  `throwSignal`, `startEvent`, `restart`, `upgrade`
- [data](./api/interfaces/IAPIData.md) Provides access to the BPMN datastore for instances: `findItems`, `findItem`,
  `findInstances`, `getPendingUserTasks`, `deleteInstances`
- [model](./api/interfaces/IAPIModel.md) Reads BPMN models: `get`, `list`, `findEvents`, `findStartEvents`,
  `getSource`, `load`, [`verifyModel`](verify.md)

`BPMNAPI` is the runtime API: it runs processes and reads models. `BPMNAdminAPI` adds the model changes
(`model.save`, `delete`, `rename`, `export`); give it only to deployment and model administration.

Every call takes the user it runs for; see [Security](security.md).

To access the service layer API:
```ts
    const server = await BPMNServer.create(configuration, new Logger({ toConsole: false }), { cron: false });
    const api = new BPMNAPI(server);

    console.log('---calling start----- ');

    let response = await api.engine.start('Leave Application', {reason:'I like it',type:'Vacation'}, SystemUser);

    console.log('---calling assign----- ');
    await api.engine.assign({ id: response.id, "items.elementId": 'Request' }, {},{}, SystemUser);

// or you can designate a specific user
    let user1 =new SecureUser({ userName: 'user1', userGroups: ['Owner', 'Others']});

    console.log('---calling invoke----- ');
    await api.engine.invoke({ id: response.id, "items.elementId": 'Request' }, {duration:'20 days'}, user1);

    const items = await api.data.findItems({ id: response.id, "items.elementId": 'Request' }, SystemUser);

```

## Other Components and Topics

- [configuration](#configuration)
- [appDelegate](#appDelegate)
- [events listener](#events)
- [Timers](timers.md)

