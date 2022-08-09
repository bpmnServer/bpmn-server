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

* [acl](datastore.md#acl)
* [appDelegate](datastore.md#appdelegate)
* [cache](datastore.md#cache)
* [configuration](datastore.md#configuration)
* [cron](datastore.md#cron)
* [dataStore](datastore.md#datastore)
* [definitions](datastore.md#definitions)
* [engine](datastore.md#engine)
* [iam](datastore.md#iam)
* [listener](datastore.md#listener)
* [logger](datastore.md#logger)

### Methods

* [check](datastore.md#check)
* [convertColl](datastore.md#convertcoll)
* [convertObj](datastore.md#convertobj)
* [deleteInstances](datastore.md#deleteinstances)
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

Defined in bpmnServer/src/datastore/DataStore.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`server` | [IBPMNServer](../interfaces/ibpmnserver.md) |

**Returns:** *[DataStore](datastore.md)*

## Properties

###  db

• **db**: *any*

*Implementation of [IDataStore](../interfaces/idatastore.md).[db](../interfaces/idatastore.md#db)*

Defined in bpmnServer/src/datastore/DataStore.ts:21

___

###  dbConfiguration

• **dbConfiguration**: *any*

*Implementation of [IDataStore](../interfaces/idatastore.md).[dbConfiguration](../interfaces/idatastore.md#dbconfiguration)*

Defined in bpmnServer/src/datastore/DataStore.ts:20

___

###  execution

• **execution**: *[Execution](execution.md)*

*Implementation of [IDataStore](../interfaces/idatastore.md).[execution](../interfaces/idatastore.md#execution)*

Defined in bpmnServer/src/datastore/DataStore.ts:23

___

###  inSaving

• **inSaving**: *boolean* = false

Defined in bpmnServer/src/datastore/DataStore.ts:26

___

###  isModified

• **isModified**: *boolean* = false

Defined in bpmnServer/src/datastore/DataStore.ts:24

___

###  isRunning

• **isRunning**: *boolean* = false

Defined in bpmnServer/src/datastore/DataStore.ts:25

___

###  promises

• **promises**: *any[]* = []

Defined in bpmnServer/src/datastore/DataStore.ts:27

___

###  saveCounter

• **saveCounter**: *number* = 0

Defined in bpmnServer/src/datastore/DataStore.ts:57

___

###  server

• **server**: *any*

*Inherited from [ServerComponent](servercomponent.md).[server](servercomponent.md#server)*

Defined in bpmnServer/src/server/ServerComponent.ts:9

___

### `Static` seq

▪ **seq**: *number* = 0

Defined in bpmnServer/src/datastore/DataStore.ts:147

## Accessors

###  acl

• **get acl**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[acl](servercomponent.md#acl)*

Defined in bpmnServer/src/server/ServerComponent.ts:23

**Returns:** *any*

___

###  appDelegate

• **get appDelegate**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[appDelegate](servercomponent.md#appdelegate)*

Defined in bpmnServer/src/server/ServerComponent.ts:18

**Returns:** *any*

___

###  cache

• **get cache**(): *[CacheManager](cachemanager.md)*

*Inherited from [ServerComponent](servercomponent.md).[cache](servercomponent.md#cache)*

Defined in bpmnServer/src/server/ServerComponent.ts:17

**Returns:** *[CacheManager](cachemanager.md)*

___

###  configuration

• **get configuration**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[configuration](servercomponent.md#configuration)*

Defined in bpmnServer/src/server/ServerComponent.ts:14

**Returns:** *any*

___

###  cron

• **get cron**(): *[Cron](cron.md)*

*Inherited from [ServerComponent](servercomponent.md).[cron](servercomponent.md#cron)*

Defined in bpmnServer/src/server/ServerComponent.ts:16

**Returns:** *[Cron](cron.md)*

___

###  dataStore

• **get dataStore**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[dataStore](servercomponent.md#datastore)*

Defined in bpmnServer/src/server/ServerComponent.ts:20

**Returns:** *any*

___

###  definitions

• **get definitions**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[definitions](servercomponent.md#definitions)*

Defined in bpmnServer/src/server/ServerComponent.ts:21

**Returns:** *any*

___

###  engine

• **get engine**(): *[IEngine](../interfaces/iengine.md)*

*Inherited from [ServerComponent](servercomponent.md).[engine](servercomponent.md#engine)*

Defined in bpmnServer/src/server/ServerComponent.ts:19

**Returns:** *[IEngine](../interfaces/iengine.md)*

___

###  iam

• **get iam**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[iam](servercomponent.md#iam)*

Defined in bpmnServer/src/server/ServerComponent.ts:24

**Returns:** *any*

___

###  listener

• **get listener**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[listener](servercomponent.md#listener)*

Defined in bpmnServer/src/server/ServerComponent.ts:22

**Returns:** *any*

___

###  logger

• **get logger**(): *any*

*Inherited from [ServerComponent](servercomponent.md).[logger](servercomponent.md#logger)*

Defined in bpmnServer/src/server/ServerComponent.ts:15

**Returns:** *any*

## Methods

###  check

▸ **check**(`event`: any, `item`: any): *Promise‹number›*

Defined in bpmnServer/src/datastore/DataStore.ts:97

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`item` | any |

**Returns:** *Promise‹number›*

___

###  convertColl

▸ **convertColl**(`coll`: any, `cls`: any): *void*

Defined in bpmnServer/src/datastore/DataStore.ts:231

**Parameters:**

Name | Type |
------ | ------ |
`coll` | any |
`cls` | any |

**Returns:** *void*

___

###  convertObj

▸ **convertObj**(`obj`: any, `cls`: any): *any*

Defined in bpmnServer/src/datastore/DataStore.ts:227

**Parameters:**

Name | Type |
------ | ------ |
`obj` | any |
`cls` | any |

**Returns:** *any*

___

###  deleteInstances

▸ **deleteInstances**(`query`: any): *Promise‹any›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in bpmnServer/src/datastore/DataStore.ts:391

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findInstance

▸ **findInstance**(`query`: any, `options`: any): *Promise‹[IInstanceData](../interfaces/iinstancedata.md)›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in bpmnServer/src/datastore/DataStore.ts:206

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`options` | any |

**Returns:** *Promise‹[IInstanceData](../interfaces/iinstancedata.md)›*

___

###  findInstances

▸ **findInstances**(`query`: any, `option`: "summary" | "full" | any): *Promise‹any›*

Defined in bpmnServer/src/datastore/DataStore.ts:238

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

Defined in bpmnServer/src/datastore/DataStore.ts:196

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findItems

▸ **findItems**(`query`: any): *Promise‹any[]›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in bpmnServer/src/datastore/DataStore.ts:272

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

Defined in bpmnServer/src/datastore/DataStore.ts:404

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

___

###  loadInstance

▸ **loadInstance**(`instanceId`: any): *Promise‹object›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in bpmnServer/src/datastore/DataStore.ts:108

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *Promise‹object›*

___

###  monitorExecution

▸ **monitorExecution**(`execution`: [Execution](execution.md)): *void*

Defined in bpmnServer/src/datastore/DataStore.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |

**Returns:** *void*

___

###  save

▸ **save**(): *Promise‹void›*

*Implementation of [IDataStore](../interfaces/idatastore.md)*

Defined in bpmnServer/src/datastore/DataStore.ts:59

**Returns:** *Promise‹void›*
