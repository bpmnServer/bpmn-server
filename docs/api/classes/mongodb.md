[bpmn-server](../README.md) › [MongoDB](mongodb.md)

# Class: MongoDB

## Hierarchy

* **MongoDB**

## Index

### Constructors

* [constructor](mongodb.md#constructor)

### Properties

* [client](mongodb.md#client)
* [dbConfig](mongodb.md#dbconfig)
* [logger](mongodb.md#logger)

### Methods

* [connect](mongodb.md#connect)
* [createIndex](mongodb.md#createindex)
* [find](mongodb.md#find)
* [getClient](mongodb.md#getclient)
* [insert](mongodb.md#insert)
* [remove](mongodb.md#remove)
* [removeById](mongodb.md#removebyid)
* [update](mongodb.md#update)
* [update2](mongodb.md#update2)

## Constructors

###  constructor

\+ **new MongoDB**(`dbConfig`: any, `logger`: any): *[MongoDB](mongodb.md)*

Defined in bpmnServer/src/datastore/MongoDB.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`dbConfig` | any |
`logger` | any |

**Returns:** *[MongoDB](mongodb.md)*

## Properties

###  client

• **client**: *any*

Defined in bpmnServer/src/datastore/MongoDB.ts:19

___

###  dbConfig

• **dbConfig**: *any*

Defined in bpmnServer/src/datastore/MongoDB.ts:20

___

###  logger

• **logger**: *any*

Defined in bpmnServer/src/datastore/MongoDB.ts:21

## Methods

###  connect

▸ **connect**(): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:208

**Returns:** *Promise‹unknown›*

___

###  createIndex

▸ **createIndex**(`dbName`: any, `collName`: any, `index`: any, `unique`: object): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:59

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`index` | any | - |
`unique` | object | {} |

**Returns:** *Promise‹unknown›*

___

###  find

▸ **find**(`dbName`: any, `collName`: any, `qry`: any, `projection`: any): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:33

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`qry` | any | - |
`projection` | any | null |

**Returns:** *Promise‹unknown›*

___

###  getClient

▸ **getClient**(): *Promise‹any›*

Defined in bpmnServer/src/datastore/MongoDB.ts:26

**Returns:** *Promise‹any›*

___

###  insert

▸ **insert**(`dbName`: any, `collName`: any, `docs`: any): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | any |
`collName` | any |
`docs` | any |

**Returns:** *Promise‹unknown›*

___

###  remove

▸ **remove**(`dbName`: any, `collName`: any, `query`: any): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | any |
`collName` | any |
`query` | any |

**Returns:** *Promise‹unknown›*

___

###  removeById

▸ **removeById**(`dbName`: any, `collName`: any, `id`: any): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | any |
`collName` | any |
`id` | any |

**Returns:** *Promise‹unknown›*

___

###  update

▸ **update**(`dbName`: any, `collName`: any, `query`: any, `updateObject`: any, `options`: object): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:107

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`query` | any | - |
`updateObject` | any | - |
`options` | object | {} |

**Returns:** *Promise‹unknown›*

___

###  update2

▸ **update2**(`dbName`: any, `collName`: any, `query`: any, `updateObject`: any, `options`: object): *Promise‹unknown›*

Defined in bpmnServer/src/datastore/MongoDB.ts:129

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`query` | any | - |
`updateObject` | any | - |
`options` | object | {} |

**Returns:** *Promise‹unknown›*
