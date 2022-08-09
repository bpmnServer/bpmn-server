[bpmn-server](../README.md) › [BaseRepository](baserepository.md)

# Class: BaseRepository ‹**T**›

find assigned Items for userId
 find assigned Items for userGroup
 find authorized Items

## Type parameters

▪ **T**

## Hierarchy

* **BaseRepository**

## Index

### Constructors

* [constructor](baserepository.md#constructor)

### Properties

* [cls](baserepository.md#cls)
* [coll](baserepository.md#coll)
* [db](baserepository.md#db)
* [dbname](baserepository.md#dbname)

### Methods

* [delete](baserepository.md#delete)
* [find](baserepository.md#find)
* [findOne](baserepository.md#findone)
* [insert](baserepository.md#insert)
* [update](baserepository.md#update)

## Constructors

###  constructor

\+ **new BaseRepository**(`server`: any, `cls`: any, `coll`: any): *[BaseRepository](baserepository.md)*

Defined in bpmnServer/src/acl/Repository.ts:21

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`server` | any | - |
`cls` | any | - |
`coll` | any | null |

**Returns:** *[BaseRepository](baserepository.md)*

## Properties

###  cls

• **cls**: *any*

Defined in bpmnServer/src/acl/Repository.ts:21

___

###  coll

• **coll**: *any*

Defined in bpmnServer/src/acl/Repository.ts:20

___

###  db

• **db**: *any*

Defined in bpmnServer/src/acl/Repository.ts:18

___

###  dbname

• **dbname**: *any*

Defined in bpmnServer/src/acl/Repository.ts:19

## Methods

###  delete

▸ **delete**(`query`: any): *Promise‹any›*

Defined in bpmnServer/src/acl/Repository.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  find

▸ **find**(`query`: any): *Promise‹T[]›*

Defined in bpmnServer/src/acl/Repository.ts:76

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹T[]›*

___

###  findOne

▸ **findOne**(`query`: any): *Promise‹T›*

Defined in bpmnServer/src/acl/Repository.ts:87

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹T›*

___

###  insert

▸ **insert**(`objects`: T[]): *Promise‹any›*

Defined in bpmnServer/src/acl/Repository.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`objects` | T[] |

**Returns:** *Promise‹any›*

___

###  update

▸ **update**(`query`: any, `updateObject`: any): *Promise‹any›*

Defined in bpmnServer/src/acl/Repository.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`updateObject` | any |

**Returns:** *Promise‹any›*
