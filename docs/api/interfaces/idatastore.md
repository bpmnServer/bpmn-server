[bpmn-server](../README.md) › [IDataStore](idatastore.md)

# Interface: IDataStore

## Hierarchy

* **IDataStore**

## Implemented by

* [DataStore](../classes/datastore.md)

## Index

### Properties

* [db](idatastore.md#db)
* [dbConfiguration](idatastore.md#dbconfiguration)
* [execution](idatastore.md#execution)
* [logger](idatastore.md#logger)

### Methods

* [deleteInstances](idatastore.md#deleteinstances)
* [findInstance](idatastore.md#findinstance)
* [findInstances](idatastore.md#findinstances)
* [findItem](idatastore.md#finditem)
* [findItems](idatastore.md#finditems)
* [install](idatastore.md#install)
* [loadInstance](idatastore.md#loadinstance)
* [monitorExecution](idatastore.md#monitorexecution)
* [save](idatastore.md#save)

## Properties

###  db

• **db**: *any*

Defined in bpmnServer/src/interfaces/datastore.ts:7

___

###  dbConfiguration

• **dbConfiguration**: *any*

Defined in bpmnServer/src/interfaces/datastore.ts:6

___

###  execution

• **execution**: *[IExecution](iexecution.md)*

Defined in bpmnServer/src/interfaces/datastore.ts:9

___

###  logger

• **logger**: *any*

Defined in bpmnServer/src/interfaces/datastore.ts:8

## Methods

###  deleteInstances

▸ **deleteInstances**(`query?`: any): *Promise‹void›*

Defined in bpmnServer/src/interfaces/datastore.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`query?` | any |

**Returns:** *Promise‹void›*

___

###  findInstance

▸ **findInstance**(`query`: any, `options`: any): *Promise‹any›*

Defined in bpmnServer/src/interfaces/datastore.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`options` | any |

**Returns:** *Promise‹any›*

___

###  findInstances

▸ **findInstances**(`query`: any, `option`: "summary" | "full"): *Promise‹any›*

Defined in bpmnServer/src/interfaces/datastore.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`option` | "summary" &#124; "full" |

**Returns:** *Promise‹any›*

___

###  findItem

▸ **findItem**(`query`: any): *Promise‹any›*

Defined in bpmnServer/src/interfaces/datastore.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  findItems

▸ **findItems**(`query`: any): *Promise‹any[]›*

Defined in bpmnServer/src/interfaces/datastore.ts:22

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | any |   |

**Returns:** *Promise‹any[]›*

___

###  install

▸ **install**(): *any*

Defined in bpmnServer/src/interfaces/datastore.ts:24

**Returns:** *any*

___

###  loadInstance

▸ **loadInstance**(`instanceId`: any): *Promise‹object›*

Defined in bpmnServer/src/interfaces/datastore.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *Promise‹object›*

___

###  monitorExecution

▸ **monitorExecution**(`execution`: [IExecution](iexecution.md)): *void*

Defined in bpmnServer/src/interfaces/datastore.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [IExecution](iexecution.md) |

**Returns:** *void*

___

###  save

▸ **save**(): *Promise‹void›*

Defined in bpmnServer/src/interfaces/datastore.ts:11

**Returns:** *Promise‹void›*
