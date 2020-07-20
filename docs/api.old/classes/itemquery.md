[bpmn-server](../README.md) › [ItemQuery](itemquery.md)

# Class: ItemQuery

## Hierarchy

* **ItemQuery**

## Index

### Constructors

* [constructor](itemquery.md#constructor)

### Properties

* [_elementId](itemquery.md#_elementid)
* [_endedAt](itemquery.md#_endedat)
* [_id](itemquery.md#_id)
* [_itemKey](itemquery.md#_itemkey)
* [_name](itemquery.md#_name)
* [_seq](itemquery.md#_seq)
* [_startedAt](itemquery.md#_startedat)
* [_status](itemquery.md#_status)
* [_tokenId](itemquery.md#_tokenid)
* [_type](itemquery.md#_type)

### Methods

* [id](itemquery.md#id)
* [name](itemquery.md#name)
* [status](itemquery.md#status)

## Constructors

###  constructor

\+ **new ItemQuery**(`__namedParameters`: object): *[ItemQuery](itemquery.md)*

Defined in src/engine/Model.ts:193

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`elementId` | any | null |
`endedAt` | any | null |
`id` | any | null |
`itemKey` | any | null |
`name` | any | null |
`seq` | any | null |
`startedAt` | any | null |
`status` | [ITEM_STATUS](../enums/item_status.md) | null |
`tokenId` | any | null |
`type` | [BPMN_TYPE](../enums/bpmn_type.md) | null |

**Returns:** *[ItemQuery](itemquery.md)*

## Properties

###  _elementId

• **_elementId**: *any*

Defined in src/engine/Model.ts:193

___

###  _endedAt

• **_endedAt**: *any*

Defined in src/engine/Model.ts:191

___

###  _id

• **_id**: *any*

Defined in src/engine/Model.ts:184

___

###  _itemKey

• **_itemKey**: *any*

Defined in src/engine/Model.ts:186

___

###  _name

• **_name**: *any*

Defined in src/engine/Model.ts:187

___

###  _seq

• **_seq**: *any*

Defined in src/engine/Model.ts:185

___

###  _startedAt

• **_startedAt**: *any*

Defined in src/engine/Model.ts:190

___

###  _status

• **_status**: *[ITEM_STATUS](../enums/item_status.md)*

Defined in src/engine/Model.ts:189

___

###  _tokenId

• **_tokenId**: *any*

Defined in src/engine/Model.ts:192

___

###  _type

• **_type**: *[BPMN_TYPE](../enums/bpmn_type.md)*

Defined in src/engine/Model.ts:188

## Methods

###  id

▸ **id**(`val`: any): *this*

Defined in src/engine/Model.ts:218

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*

___

###  name

▸ **name**(`val`: any): *this*

Defined in src/engine/Model.ts:219

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*

___

###  status

▸ **status**(`val`: any): *this*

Defined in src/engine/Model.ts:220

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*
