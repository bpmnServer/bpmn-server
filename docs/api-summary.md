[bpmn-server](./api/README.md)

# API Summary [Full Listing](./api/modules.md)

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

The execution Engine , processes an BPMN definition - [Engine](api/classes/server_Engine.Engine.md)

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

Manages BPMN defintions - [Definitions](api/classes/elements_Definition.Definition.md)

| Method | parameters | return     | description |
| ------ | :--------: | ---------- | ----------- |
| list   |     -      | string[]   |
| load   |    name    | definition |

## datastore

Saves and retrievs Instances Data - [DataStore](api/classes/datastore_DataStore.DataStore.md)

| Method            |                   parameters                   | return                                        | description |
| ----------------- | :--------------------------------------------: | --------------------------------------------- | ----------- |
| **findInstances** | [instanceQuery](./dataQuery.md#instance-query) | [Instance[]](api/interfaces/interfaces_DataObjects.IInstanceData.md) |             |
| **findItems**     |     [itemQuery](./dataQuery.md#item-query)     | [Item[]](api/interfaces/interfaces_DataObjects.IItemData.md)         |             |

## cache

Caches running instances for performance - [CacheManager](api/modules/server_CacheManager.md)

```
list		id[]
get			instance
remove
clear
restart
```

## cron

Manages background tasks, primarly timers - [Cron](api/modules/server_Cron.md)

```
start
check
stop
```

- configuration
- AppDelegate
- Event Listener
- Data

## Enumerations

- [BPMN_TYPE](api/enums/interfaces_Enums.BPMN_TYPE.md)
- [EXECUTION_EVENT](api/enums/interfaces_Enums.BPMN_TYPE.md)
- [EXECUTION_STATUS](api/enums/interfaces_Enums.EXECUTION_STATUS.md)
- [ITEM_STATUS](api/enums/interfaces_Enums.ITEM_STATUS.md)
- [Behaviour_names](api/modules/elements_behaviours_BehaviourLoader.md#behaviour_names)
