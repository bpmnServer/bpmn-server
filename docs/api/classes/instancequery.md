[bpmn-server](../README.md) › [InstanceQuery](instancequery.md)

# Class: InstanceQuery

## Hierarchy

* **InstanceQuery**

## Index

### Constructors

* [constructor](instancequery.md#constructor)

### Properties

* [_data](instancequery.md#_data)
* [_endedAt](instancequery.md#_endedat)
* [_id](instancequery.md#_id)
* [_name](instancequery.md#_name)
* [_parentNodeId](instancequery.md#_parentnodeid)
* [_saved](instancequery.md#_saved)
* [_source](instancequery.md#_source)
* [_startedAt](instancequery.md#_startedat)
* [_status](instancequery.md#_status)
* [items](instancequery.md#items)

### Methods

* [id](instancequery.md#id)
* [name](instancequery.md#name)

## Constructors

###  constructor

\+ **new InstanceQuery**(`__namedParameters`: object): *[InstanceQuery](instancequery.md)*

Defined in bpmnServer/src/engine/Model.ts:172

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`data` | any | null |
`endedAt` | any | null |
`id` | any | null |
`items` | [ItemQuery](itemquery.md)‹› | new ItemQuery() |
`name` | any | null |
`saved` | any | null |
`startedAt` | any | null |
`status` | [EXECUTION_STATUS](../enums/execution_status.md) | null |

**Returns:** *[InstanceQuery](instancequery.md)*

## Properties

###  _data

• **_data**: *any*

Defined in bpmnServer/src/engine/Model.ts:169

___

###  _endedAt

• **_endedAt**: *any*

Defined in bpmnServer/src/engine/Model.ts:167

___

###  _id

• **_id**: *any*

Defined in bpmnServer/src/engine/Model.ts:163

___

###  _name

• **_name**: *any*

Defined in bpmnServer/src/engine/Model.ts:164

___

###  _parentNodeId

• **_parentNodeId**: *any*

Defined in bpmnServer/src/engine/Model.ts:172

___

###  _saved

• **_saved**: *any*

Defined in bpmnServer/src/engine/Model.ts:168

___

###  _source

• **_source**: *any*

Defined in bpmnServer/src/engine/Model.ts:171

___

###  _startedAt

• **_startedAt**: *any*

Defined in bpmnServer/src/engine/Model.ts:166

___

###  _status

• **_status**: *[EXECUTION_STATUS](../enums/execution_status.md)*

Defined in bpmnServer/src/engine/Model.ts:165

___

###  items

• **items**: *[ItemQuery](itemquery.md)* = new ItemQuery()

Defined in bpmnServer/src/engine/Model.ts:170

## Methods

###  id

▸ **id**(`val`: any): *[InstanceQuery](instancequery.md)*

Defined in bpmnServer/src/engine/Model.ts:188

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[InstanceQuery](instancequery.md)*

___

###  name

▸ **name**(`val`: any): *[InstanceQuery](instancequery.md)*

Defined in bpmnServer/src/engine/Model.ts:189

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[InstanceQuery](instancequery.md)*
