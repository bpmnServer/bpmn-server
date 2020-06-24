[bpmn-server](../README.md) › [DataStore](datastore.md)

# Class: DataStore

## Hierarchy

* [ServerComponent](servercomponent.md)

  ↳ **DataStore**

## Implements

* [IDataStore](../interfaces/idatastore.md)

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
* [logger](datastore.md#logger)

### Methods

* [addEvent](datastore.md#addevent)
* [check](datastore.md#check)
* [deleteEvents](datastore.md#deleteevents)
* [deleteInstances](datastore.md#deleteinstances)
* [findEvents](datastore.md#findevents)
* [findInstance](datastore.md#findinstance)
* [findInstances](datastore.md#findinstances)
* [findItem](datastore.md#finditem)
* [findItems](datastore.md#finditems)
* [install](datastore.md#install)
* [loadInstance](datastore.md#loadinstance)
* [monitorExecution](datastore.md#monitorexecution)
* [save](datastore.md#save)

## Constructors

###  constructor

\+ **new DataStore**(`server`: [IBPMNServer](../interfaces/ibpmnserver.md)): *[DataStore](datastore.md)*

*Overrides [ServerComponent](servercomponent.md).[constructor](servercomponent.md#constructor)*

Defined in src/datastore/DataStore.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[DataStore](datastore.md)*

## Properties

###  db

• **db**: *any*

*Implementation of [IDataStore](../interfaces/idatastore.md).[db](../interfaces/idatastore.md#db)*

Defined in src/datastore/DataStore.ts:19

___

###  dbConfiguration

• **dbConfiguration**: *any*

*Implementation of [IDataStore](../interfaces/idatastore.md).[dbConfiguration](../interfaces/idatastore.md#dbconfiguration)*

Defined in src/datastore/DataStore.ts:18

___

###  execution

• **execution**: *[Execution](execution.md)*

*Implementation of [IDataStore](../interfaces/idatastore.md).[execution](../interfaces/idatastore.md#execution)*

Defined in src/datastore/DataStore.ts:21

___

###  inSaving

• **inSaving**: *boolean* = false

Defined in src/datastore/DataStore.ts:24

___

###  isModified

• **isModified**: *boolean* = false

Defined in src/datastore/DataStore.ts:22

___

###  isRunning

• **isRunning**: *boolean* = false

Defined in src/datastore/DataStore.ts:23

___

###  promises

• **promises**: *any[]* = []

Defined in src/datastore/DataStore.ts:25

___

###  saveCounter

• **saveCounter**: *number* = 0

Defined in src/datastore/DataStore.ts:55

___

###  server

• **server**: *any*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in src/server/ServerContext.ts:9

___

### `Static` seq

▪ **seq**: *number* = 0

Defined in src/datastore/DataStore.ts:140

## Accessors

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[appDelegate](servercomponent.md#appdelegate)*

Defined in src/server/ServerContext.ts:20

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[cache](servercomponent.md#cache)*

Defined in src/server/ServerContext.ts:18

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[configuration](servercomponent.md#configuration)*

Defined in src/server/ServerContext.ts:13

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[cron](servercomponent.md#cron)*

Defined in src/server/ServerContext.ts:17

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in src/server/ServerContext.ts:15

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[definitions](servercomponent.md#definitions)*

Defined in src/server/ServerContext.ts:19

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

*Inherited from [ServerComponent](servercomponent.md).[engine](servercomponent.md#engine)*

Defined in src/server/ServerContext.ts:16

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  logger

• **get logger**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in src/server/ServerContext.ts:14

**Returns:** *any*

## Methods

###  addEvent

▸ **addEvent**(`eventData`: any): *Promise‹any›*

Defined in src/datastore/DataStore.ts:362

**Parameters:**

Name | Type |
------ | ------ |
`eventData` | any |

**Returns:** *Promise‹any›*

___

###  check

▸ **check**(`event`: any, `item`: any): *Promise‹void›*

Defined in src/datastore/DataStore.ts:91

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`item` | any |

**Returns:** *Promise‹void›*

___

###  deleteEvents

▸ **deleteEvents**(`query`: any): *Promise‹any›*

Defined in src/datastore/DataStore.ts:369

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  deleteInstances

▸ **deleteInstances**(`query`: any): *Promise‹any›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in src/datastore/DataStore.ts:355

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹any›*

Defined in src/datastore/DataStore.ts:365

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findInstance

▸ **findInstance**(`query`: any, `options`: any): *Promise‹any›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in src/datastore/DataStore.ts:193

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`options` | any |

**Returns:** *Promise‹any›*

___

###  findInstances

▸ **findInstances**(`query`: any, `option`: "summary" | "full" | any): *Promise‹any›*

Defined in src/datastore/DataStore.ts:204

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | - |
`option` | "summary" &#124; "full" &#124; any | "summary" |

**Returns:** *Promise‹any›*

___

###  findItem

▸ **findItem**(`query`: any): *Promise‹any›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in src/datastore/DataStore.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findItems

▸ **findItems**(`query`: any): *Promise‹any[]›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in src/datastore/DataStore.ts:238

scenario:
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
message			{ items: { messageId: nameofmessage, key: value } {}
status			{ items: {status: 'wait' } }
custom: { query: query, projection: projection }

New approach:
just like MongoDB
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

###  install

▸ **install**(): *Promise‹any›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in src/datastore/DataStore.ts:380

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

___

###  loadInstance

▸ **loadInstance**(`instanceId`: any): *Promise‹object›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in src/datastore/DataStore.ts:101

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *Promise‹object›*

___

###  monitorExecution

▸ **monitorExecution**(`execution`: [Execution](execution.md)): *void*

Defined in src/datastore/DataStore.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |

**Returns:** *void*

___

###  save

▸ **save**(): *Promise‹void›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in src/datastore/DataStore.ts:56

**Returns:** *Promise‹void›*
