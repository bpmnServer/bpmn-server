[bpmn-server](../README.md) › [IBPMNServer](ibpmnserver.md)

# Interface: IBPMNServer

## Hierarchy

* **IBPMNServer**

## Index

### Properties

* [configuration](ibpmnserver.md#configuration)
* [dataStore](ibpmnserver.md#datastore)
* [logger](ibpmnserver.md#logger)

### Methods

* [deleteData](ibpmnserver.md#deletedata)
* [findEventById](ibpmnserver.md#findeventbyid)
* [findEvents](ibpmnserver.md#findevents)
* [findInstances](ibpmnserver.md#findinstances)
* [findItems](ibpmnserver.md#finditems)
* [init](ibpmnserver.md#init)
* [loadDefinition](ibpmnserver.md#loaddefinition)
* [restart](ibpmnserver.md#restart)
* [shutdown](ibpmnserver.md#shutdown)

## Properties

###  configuration

• **configuration**: *any*

Defined in src/interfaces/server.ts:56

___

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/server.ts:58

___

###  logger

• **logger**: *any*

Defined in src/interfaces/server.ts:57

## Methods

###  deleteData

▸ **deleteData**(`instanceId?`: any): *Promise‹any›*

Defined in src/interfaces/server.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`instanceId?` | any |

**Returns:** *Promise‹any›*

___

###  findEventById

▸ **findEventById**(`signalId`: string): *any*

Defined in src/interfaces/server.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | string |

**Returns:** *any*

___

###  findEvents

▸ **findEvents**(`query`: any): *any*

Defined in src/interfaces/server.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *any*

___

###  findInstances

▸ **findInstances**(`query`: any, `view?`: string): *Promise‹any›*

Defined in src/interfaces/server.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`view?` | string |

**Returns:** *Promise‹any›*

___

###  findItems

▸ **findItems**(`query`: any): *Promise‹any›*

Defined in src/interfaces/server.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

___

###  init

▸ **init**(): *Promise‹void›*

Defined in src/interfaces/server.ts:59

**Returns:** *Promise‹void›*

___

###  loadDefinition

▸ **loadDefinition**(`name`: any, `source?`: any): *Promise‹[IDefinition](idefinition.md)›*

Defined in src/interfaces/server.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`source?` | any |

**Returns:** *Promise‹[IDefinition](idefinition.md)›*

___

###  restart

▸ **restart**(): *Promise‹void›*

Defined in src/interfaces/server.ts:60

**Returns:** *Promise‹void›*

___

###  shutdown

▸ **shutdown**(): *Promise‹void›*

Defined in src/interfaces/server.ts:61

**Returns:** *Promise‹void›*
