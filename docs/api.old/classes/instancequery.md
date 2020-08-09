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

Defined in src/engine/Model.ts:164

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

Defined in src/engine/Model.ts:161

___

###  _endedAt

• **_endedAt**: *any*

Defined in src/engine/Model.ts:159

___

###  _id

• **_id**: *any*

Defined in src/engine/Model.ts:155

___

###  _name

• **_name**: *any*

Defined in src/engine/Model.ts:156

___

###  _parentNodeId

• **_parentNodeId**: *any*

Defined in src/engine/Model.ts:164

___

###  _saved

• **_saved**: *any*

Defined in src/engine/Model.ts:160

___

###  _source

• **_source**: *any*

Defined in src/engine/Model.ts:163

___

###  _startedAt

• **_startedAt**: *any*

Defined in src/engine/Model.ts:158

___

###  _status

• **_status**: *[EXECUTION_STATUS](../enums/execution_status.md)*

Defined in src/engine/Model.ts:157

___

###  items

• **items**: *[ItemQuery](itemquery.md)* = new ItemQuery()

Defined in src/engine/Model.ts:162

## Methods

###  id

▸ **id**(`val`: any): *[InstanceQuery](instancequery.md)*

Defined in src/engine/Model.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[InstanceQuery](instancequery.md)*

___

###  name

▸ **name**(`val`: any): *[InstanceQuery](instancequery.md)*

Defined in src/engine/Model.ts:181

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[InstanceQuery](instancequery.md)*
