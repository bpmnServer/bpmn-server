[bpmn-server](../README.md) › [Item](item.md)

# Class: Item

## Hierarchy

* **Item**

## Implements

* [IItem](../interfaces/iitem.md)

## Index

### Constructors

* [constructor](item.md#constructor)

### Properties

* [_dbAction](item.md#_dbaction)
* [_endedAt](item.md#_endedat)
* [_status](item.md#_status)
* [element](item.md#element)
* [id](item.md#id)
* [itemKey](item.md#itemkey)
* [messageId](item.md#messageid)
* [seq](item.md#seq)
* [signalId](item.md#signalid)
* [startedAt](item.md#startedat)
* [timeDue](item.md#timedue)
* [token](item.md#token)

### Accessors

* [context](item.md#context)
* [data](item.md#data)
* [elementId](item.md#elementid)
* [endedAt](item.md#endedat)
* [name](item.md#name)
* [node](item.md#node)
* [status](item.md#status)
* [tokenId](item.md#tokenid)
* [type](item.md#type)

### Methods

* [save](item.md#save)
* [load](item.md#static-load)

## Constructors

###  constructor

\+ **new Item**(`element`: any, `token`: any, `status`: [ITEM_STATUS](../enums/item_status.md)): *[Item](item.md)*

Defined in src/engine/Item.ts:55

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`element` | any | - |
`token` | any | - |
`status` | [ITEM_STATUS](../enums/item_status.md) | ITEM_STATUS.start |

**Returns:** *[Item](item.md)*

## Properties

###  _dbAction

• **_dbAction**: *"add" | "update" | null* = null

Defined in src/engine/Item.ts:55

___

###  _endedAt

• **_endedAt**: *any* = null

Defined in src/engine/Item.ts:16

___

###  _status

• **_status**: *[ITEM_STATUS](../enums/item_status.md)*

Defined in src/engine/Item.ts:25

___

###  element

• **element**: *[Element](element.md)*

*Implementation of [IItem](../interfaces/iitem.md).[element](../interfaces/iitem.md#element)*

Defined in src/engine/Item.ts:12

___

###  id

• **id**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[id](../interfaces/iitem.md#id)*

Defined in src/engine/Item.ts:10

___

###  itemKey

• **itemKey**: *string*

*Implementation of [IItem](../interfaces/iitem.md).[itemKey](../interfaces/iitem.md#itemkey)*

Defined in src/engine/Item.ts:11

___

###  messageId

• **messageId**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[messageId](../interfaces/iitem.md#messageid)*

Defined in src/engine/Item.ts:52

___

###  seq

• **seq**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[seq](../interfaces/iitem.md#seq)*

Defined in src/engine/Item.ts:14

___

###  signalId

• **signalId**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[signalId](../interfaces/iitem.md#signalid)*

Defined in src/engine/Item.ts:53

___

###  startedAt

• **startedAt**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[startedAt](../interfaces/iitem.md#startedat)*

Defined in src/engine/Item.ts:15

___

###  timeDue

• **timeDue**: *Date*

*Implementation of [IItem](../interfaces/iitem.md).[timeDue](../interfaces/iitem.md#timedue)*

Defined in src/engine/Item.ts:51

___

###  token

• **token**: *[Token](token.md)*

*Implementation of [IItem](../interfaces/iitem.md).[token](../interfaces/iitem.md#token)*

Defined in src/engine/Item.ts:13

## Accessors

###  context

• **get context**(): *[IExecutionContext](../interfaces/iexecutioncontext.md)*

Defined in src/engine/Item.ts:36

**Returns:** *[IExecutionContext](../interfaces/iexecutioncontext.md)*

___

###  data

• **get data**(): *any*

Defined in src/engine/Item.ts:34

**Returns:** *any*

• **set data**(`val`: any): *void*

Defined in src/engine/Item.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *void*

___

###  elementId

• **get elementId**(): *any*

Defined in src/engine/Item.ts:37

**Returns:** *any*

___

###  endedAt

• **get endedAt**(): *any*

Defined in src/engine/Item.ts:17

**Returns:** *any*

• **set endedAt**(`val`: any): *void*

Defined in src/engine/Item.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *void*

___

###  name

• **get name**(): *any*

Defined in src/engine/Item.ts:38

**Returns:** *any*

___

###  node

• **get node**(): *[Node](node.md)*

Defined in src/engine/Item.ts:47

**Returns:** *[Node](node.md)*

___

###  status

• **get status**(): *[ITEM_STATUS](../enums/item_status.md)*

Defined in src/engine/Item.ts:26

**Returns:** *[ITEM_STATUS](../enums/item_status.md)*

• **set status**(`val`: [ITEM_STATUS](../enums/item_status.md)): *void*

Defined in src/engine/Item.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`val` | [ITEM_STATUS](../enums/item_status.md) |

**Returns:** *void*

___

###  tokenId

• **get tokenId**(): *any*

Defined in src/engine/Item.ts:41

**Returns:** *any*

___

###  type

• **get type**(): *any*

Defined in src/engine/Item.ts:44

**Returns:** *any*

## Methods

###  save

▸ **save**(): *[IItemData](../interfaces/iitemdata.md)*

Defined in src/engine/Item.ts:65

**Returns:** *[IItemData](../interfaces/iitemdata.md)*

___

### `Static` load

▸ **load**(`execution`: [Execution](execution.md), `dataObject`: [IItemData](../interfaces/iitemdata.md), `token`: any): *[Item](item.md)‹›*

Defined in src/engine/Item.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |
`dataObject` | [IItemData](../interfaces/iitemdata.md) |
`token` | any |

**Returns:** *[Item](item.md)‹›*
