[bpmn-server](./api/README.md)

# API Summary  [Full Listing](./api-index.md)
## Server Components
- [engine](#engine) BPMN Execution Engine
- [definitions](#definitions) 
- [dataStore](#datastore)
- [cache](#cache) 
- [cron](#cron)

## Other Components and Topics 
- [Data Query](./dataQuery.md) 
- [configuration](#configuration)	
- [appDelegate](#appDelegate) 
- [events listener](#events) 
- [Data Variables and input/output](./data.md) 
- [Timers](./timers.md) 

## engine:

The execution Engine , processes an BPMN definition - [Engine](api/classes/engine.md)

| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **start** | name, input 	 | [ExecutionContext](api/classes/executioncontext.md) | - Start a new Process execution |
| **invoke**| [itemQuery](./dataQuery.md#item-query) ,input |	[ExecutionContext](api/classes/executioncontext.md) | Invoke an already started Item (waiting)  |
| **signal**|signalId,input| [ExecutionContext](api/classes/executioncontext.md) | Issue a signal or message|
| **get**|[instanceQuery](./dataQuery.md#instance-query) |		[Instance](api/interfaces/iinstancedata.md) | Get an already running or idle Instance |

examples:
```javascript
    let response: executioncontext;
    let data = {};

    //  engine
    response = await bpmn.engine.start('SubProcess');
    response = await bpmn.engine.invoke(itemQuery, data);
    response = await bpmn.engine.signal(signalId, data);
    response = await bpmn.engine.startEvent(instanceQuery, 'elementId', data);
    response = await bpmn.engine.get(instanceQuery);
```

## definitions
Manages BPMN defintions - [Definitions](api/classes/modelsdatastoredb.md)

| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
|		list	|- |	string[] |
|		load	| name|	definition |

## datastore
Saves and retrievs Instances Data - [DataStore](api/classes/datastore.md)

| Method| parameters           | return  | description |
| ------------- |:-------------:| -----| ----------|
| **findInstances** | [instanceQuery](./dataQuery.md#instance-query) 	 | [Instance[]](api/interfaces/iinstancedata.md) | |
| **findItems**| [itemQuery](./dataQuery.md#item-query)|	[Item[]](api/interfaces/iitemdata.md) | |


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
```
- configuration

- AppDelegate

- Event Listener

- Data

## Enumerations

* [BPMN_TYPE](api/enums/bpmn_type.md)
* [EXECUTION_EVENT](api/enums/execution_event.md)
* [EXECUTION_STATUS](api/enums/execution_status.md)
* [ITEM_STATUS](api/enums/item_status.md)
* [Behaviour_names](api/README.md#const-behaviour_names)
