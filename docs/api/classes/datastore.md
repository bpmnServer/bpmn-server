[bpmn-server](../README.md) › [DataStore](datastore.md)

# Class: DataStore

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **DataStore**

## Index

### Constructors

* [constructor](datastore.md#constructor)

### Properties

* [db](datastore.md#db)
* [dbConfiguration](datastore.md#dbconfiguration)
* [execution](datastore.md#execution)
* [inSaving](datastore.md#insaving)
* [isModified](datastore.md#ismodified)
* [isRunning](datastore.md#isrunning)
* [promises](datastore.md#promises)
* [saveCounter](datastore.md#savecounter)
* [server](datastore.md#server)
* [seq](datastore.md#static-seq)

### Accessors

* [appDelegate](datastore.md#appdelegate)
* [cache](datastore.md#cache)
* [configuration](datastore.md#configuration)
* [cron](datastore.md#cron)
* [dataStore](datastore.md#datastore)
* [definitions](datastore.md#definitions)
* [engine](datastore.md#engine)
* [eventsRegistry](datastore.md#eventsregistry)
* [logger](datastore.md#logger)

### Methods

* [addEvent](datastore.md#addevent)
* [check](datastore.md#check)
* [deleteData](datastore.md#deletedata)
* [deleteEvents](datastore.md#deleteevents)
* [findEvents](datastore.md#findevents)
* [findInstance](datastore.md#findinstance)
* [findInstances](datastore.md#findinstances)
* [findItem](datastore.md#finditem)
* [findItems](datastore.md#finditems)
* [loadInstance](datastore.md#loadinstance)
* [monitorExecution](datastore.md#monitorexecution)
* [save](datastore.md#save)

## Constructors

###  constructor

\+ **new DataStore**(`server`: [BPMNServer](bpmnserver.md)): *[DataStore](datastore.md)*

*Overrides [Cron](cron.md).[constructor](cron.md#constructor)*

Defined in src/server/DataStore.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[DataStore](datastore.md)*

## Properties

###  db

• **db**: *any*

Defined in src/server/DataStore.ts:33

___

###  dbConfiguration

• **dbConfiguration**: *any*

Defined in src/server/DataStore.ts:32

___

###  execution

• **execution**: *[Execution](execution.md)*

Defined in src/server/DataStore.ts:36

___

###  inSaving

• **inSaving**: *boolean* = false

Defined in src/server/DataStore.ts:39

___

###  isModified

• **isModified**: *boolean* = false

Defined in src/server/DataStore.ts:37

___

###  isRunning

• **isRunning**: *boolean* = false

Defined in src/server/DataStore.ts:38

___

###  promises

• **promises**: *any[]* = []

Defined in src/server/DataStore.ts:40

___

###  saveCounter

• **saveCounter**: *number* = 0

Defined in src/server/DataStore.ts:70

___

###  server

• **server**: *any*

*Inherited from [Cron](cron.md).[server](cron.md#server)*

Defined in src/server/ServerContext.ts:11

___

### `Static` seq

▪ **seq**: *number* = 0

Defined in src/server/DataStore.ts:155

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [Cron](cron.md).[appDelegate](cron.md#appdelegate)*

Defined in src/server/ServerContext.ts:23

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [Cron](cron.md).[cache](cron.md#cache)*

Defined in src/server/ServerContext.ts:21

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [Cron](cron.md).[configuration](cron.md#configuration)*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [Cron](cron.md).[cron](cron.md#cron)*

Defined in src/server/ServerContext.ts:20

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [Cron](cron.md).[dataStore](cron.md#datastore)*

Defined in src/server/ServerContext.ts:17

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [Cron](cron.md).[definitions](cron.md#definitions)*

Defined in src/server/ServerContext.ts:22

**Returns:** *any*

___

###  engine

• **get engine**(): *[Engine](engine.md)*

*Inherited from [Cron](cron.md).[engine](cron.md#engine)*

Defined in src/server/ServerContext.ts:19

**Returns:** *[Engine](engine.md)*

___

###  eventsRegistry

• **get eventsRegistry**(): *any*

*Inherited from [Cron](cron.md).[eventsRegistry](cron.md#eventsregistry)*

Defined in src/server/ServerContext.ts:18

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

*Inherited from [Cron](cron.md).[logger](cron.md#logger)*

Defined in src/server/ServerContext.ts:16

**Returns:** *any*

## Methods

###  addEvent

▸ **addEvent**(`eventData`: any): *Promise‹any›*

Defined in src/server/DataStore.ts:332

**Parameters:**

Name | Type |
------ | ------ |
`eventData` | any |

**Returns:** *Promise‹any›*

___

###  check

▸ **check**(`event`: any, `item`: any): *Promise‹void›*

Defined in src/server/DataStore.ts:106

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`item` | any |

**Returns:** *Promise‹void›*

___

###  deleteData

▸ **deleteData**(`instanceId`: any): *Promise‹void›*

Defined in src/server/DataStore.ts:318

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`instanceId` | any | null |

**Returns:** *Promise‹void›*

___

###  deleteEvents

▸ **deleteEvents**(`query`: any): *Promise‹any›*

Defined in src/server/DataStore.ts:339

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹any›*

Defined in src/server/DataStore.ts:335

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findInstance

▸ **findInstance**(`query`: any, `options`: any): *Promise‹any›*

Defined in src/server/DataStore.ts:208

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`options` | any |

**Returns:** *Promise‹any›*

___

###  findInstances

▸ **findInstances**(`query`: any, `option`: "summary" | "full" | any): *Promise‹any›*

Defined in src/server/DataStore.ts:219

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | - |
`option` | "summary" &#124; "full" &#124; any | "summary" |

**Returns:** *Promise‹any›*

___

###  findItem

▸ **findItem**(`query`: any): *Promise‹any›*

Defined in src/server/DataStore.ts:198

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findItems

▸ **findItems**(`query`: any): *Promise‹any[]›*

Defined in src/server/DataStore.ts:243

scenario:
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
message			{ items: { messageId: nameofmessage, key: value } {}
status			{ items: {status: 'wait' } }
custom: { query: query, projection: projection }

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | any |   |

**Returns:** *Promise‹any[]›*

___

###  loadInstance

▸ **loadInstance**(`instanceId`: any): *Promise‹object›*

Defined in src/server/DataStore.ts:116

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *Promise‹object›*

___

###  monitorExecution

▸ **monitorExecution**(`execution`: [Execution](execution.md)): *void*

Defined in src/server/DataStore.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |

**Returns:** *void*

___

###  save

▸ **save**(): *Promise‹void›*

Defined in src/server/DataStore.ts:71

**Returns:** *Promise‹void›*
