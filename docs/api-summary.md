[bpmn-server](./api/README.md)

# API Summary  [Full Listing](./api-index.md)
## Table of Contents
| Component | [engine](#engine)| [definitions](#definitions)  | [dataStore](#datastore)  | [cache](#cache) | [cron](#cron)|
| ---------- | --- |:-------------:| -----| ----------|---------- | 
| Topic		| Query | [configuration](#configuration)	| [appDelegate](#appDelegate) |	[events listener](#events) | [Enumerations](#enumerations) |


## engine:

The execution Engine , processes an BPMN definition - [Engine](api/classes/Engine.md)

| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **start** | name, input 	 | [ExecutionResponse](api/classes/executionresponse.md) | - Start a new Process execution |
| **invoke**| [itemQuery](#item-query) ,input |	[ExecutionResponse](api/classes/executionresponse.md) | Invoke an already started Item (waiting)  |
| **signal**|signalId,input| [ExecutionResponse](api/classes/executionresponse.md) | Issue a signal or message|
| **get**|[instanceQuery](#instance-query) |		[Instance](api/interfaces/iinstancedata.md) | Get an already running or idle Instance |

examples:
```javascript
    let response: ExecutionResponse;
    let data = {};

    //  engine
    response = await bpmn.engine.start('SubProcess');
    response = await bpmn.engine.invoke(itemQuery, data);
    response = await bpmn.engine.signal(signalId, data);
    response = await bpmn.engine.startEvent(instanceQuery, 'elementId', data);
    response = await bpmn.engine.get(instanceQuery);
```

## definitions
Manages BPMN defintions - [Definitions](api/classes/modelsdatastore.md)

| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
|		list	|- |	string[] |
|		load	| name|	definition |

## datastore
Saves and retrievs Instances Data - [DataStore](api/classes/datastore.md)

| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **findInstances** | [instanceQuery](#instance-query) 	 | [Instance[]](api/interfaces/iinstancedata.md) | |
| **findItems**| [itemQuery](#item-query)|	[Item[]](api/interfaces/iitemdata.md) | |


## cache
Caches running instances for performance - [CacheManager](api/classes/cachemanager.md)

		list		id[]
		get			instance
		remove
		clear
		restart

## cron
Manages background tasks, primarly timers - [Cron](api/classes/cron.md)

		start
		check
		stop

# Other Objects

## Item Query 
```javascript
       and('find items by item id only', async () => {

            query = { items: { id: item.id } };
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });

        });
        and('find items by instance and item elemetnId ', async () => {
            query = {
                instance: { id: response.execution.id },
                items: { elementId: item.elementId }
            };

            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });

        });
        and('find items by caseId and item elemetnId ', async () => {
            query = {
                instance: {
                    data: { caseId: caseId } },
                items: { elementId: item.elementId }
            };
            console.log(items);
            items = await server.dataStore.findItems(query);
            checkItem(items, { id: item.id });

        });


        and('check for items "wait" ', async () => {
            query = { items: { status: 'wait' } };
            items = await server.dataStore.findItems(query);
            checkItem(items, { status: 'wait' });
        });

```

## Instance Query
```javascript
       and('find instance by instance id only', async () => {

            query = { id: response.execution.id };
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id });

        });

        and('find instance by itemd id ', async () => {

            query = {
                items: { id: item.id  }};
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id });

        });


        and('find instance by caseId', async () => {

            query = {
                data: { caseId: caseId }};
            instances = await server.dataStore.findInstances(query);
            checkInstance(instances, { id: response.execution.id  });

        });

```
- configuration

- AppDelegate

- Event Listener

## Enumerations

* [BPMN_TYPE](api/enums/bpmn_type.md)
* [EXECUTION_EVENT](api/enums/execution_event.md)
* [EXECUTION_STATUS](api/enums/execution_status.md)
* [ITEM_STATUS](api/enums/item_status.md)
* [Behaviour_names](api/README.md#const-behaviour_names)
