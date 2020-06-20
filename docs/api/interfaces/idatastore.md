[bpmn-server](../README.md) › [IDataStore](idatastore.md)

# Interface: IDataStore

## Hierarchy

* **IDataStore**

## Index

### Properties

* [db](idatastore.md#db)
* [dbConfiguration](idatastore.md#dbconfiguration)
* [execution](idatastore.md#execution)
* [inSaving](idatastore.md#insaving)
* [isModified](idatastore.md#ismodified)
* [isRunning](idatastore.md#isrunning)
* [logger](idatastore.md#logger)
* [promises](idatastore.md#promises)
* [saveCounter](idatastore.md#savecounter)

### Methods

* [check](idatastore.md#check)
* [deleteData](idatastore.md#deletedata)
* [findInstance](idatastore.md#findinstance)
* [findInstances](idatastore.md#findinstances)
* [findItem](idatastore.md#finditem)
* [findItems](idatastore.md#finditems)
* [loadInstance](idatastore.md#loadinstance)
* [monitorExecution](idatastore.md#monitorexecution)
* [save](idatastore.md#save)
* [saveInstance](idatastore.md#saveinstance)
* [setListener](idatastore.md#setlistener)

## Properties

###  db

• **db**: *any*

Defined in src/interfaces/server.ts:7

___

###  dbConfiguration

• **dbConfiguration**: *any*

Defined in src/interfaces/server.ts:6

___

###  execution

• **execution**: *[IExecution](iexecution.md)*

Defined in src/interfaces/server.ts:9

___

###  inSaving

• **inSaving**: *boolean*

Defined in src/interfaces/server.ts:12

___

###  isModified

• **isModified**: *boolean*

Defined in src/interfaces/server.ts:10

___

###  isRunning

• **isRunning**: *boolean*

Defined in src/interfaces/server.ts:11

___

###  logger

• **logger**: *any*

Defined in src/interfaces/server.ts:8

___

###  promises

• **promises**: *any[]*

Defined in src/interfaces/server.ts:13

___

###  saveCounter

• **saveCounter**: *number*

Defined in src/interfaces/server.ts:16

## Methods

###  check

▸ **check**(): *Promise‹void›*

Defined in src/interfaces/server.ts:18

**Returns:** *Promise‹void›*

___

###  deleteData

▸ **deleteData**(`instanceId?`: any): *Promise‹void›*

Defined in src/interfaces/server.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`instanceId?` | any |

**Returns:** *Promise‹void›*

___

###  findInstance

▸ **findInstance**(`query`: any, `options`: any): *Promise‹any›*

Defined in src/interfaces/server.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`options` | any |

**Returns:** *Promise‹any›*

___

###  findInstances

▸ **findInstances**(`query`: any, `option`: "summary" | "full"): *Promise‹any›*

Defined in src/interfaces/server.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`option` | "summary" &#124; "full" |

**Returns:** *Promise‹any›*

___

###  findItem

▸ **findItem**(`query`: any): *Promise‹any›*

Defined in src/interfaces/server.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findItems

▸ **findItems**(`query`: any): *Promise‹any[]›*

Defined in src/interfaces/server.ts:39

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

Defined in src/interfaces/server.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *Promise‹object›*

___

###  monitorExecution

▸ **monitorExecution**(`execution`: [IExecution](iexecution.md)): *void*

Defined in src/interfaces/server.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecution](iexecution.md) |

**Returns:** *void*

___

###  save

▸ **save**(): *Promise‹void›*

Defined in src/interfaces/server.ts:17

**Returns:** *Promise‹void›*

___

###  saveInstance

▸ **saveInstance**(`instance`: any, `items`: any): *Promise‹void›*

Defined in src/interfaces/server.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`instance` | any |
`items` | any |

**Returns:** *Promise‹void›*

___

###  setListener

▸ **setListener**(`listener`: any): *void*

Defined in src/interfaces/server.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`listener` | any |

**Returns:** *void*
