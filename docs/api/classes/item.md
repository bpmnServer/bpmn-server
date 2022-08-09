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
* [assignments](item.md#assignments)
* [authorizations](item.md#authorizations)
* [element](item.md#element)
* [id](item.md#id)
* [itemKey](item.md#itemkey)
* [messageId](item.md#messageid)
* [notifications](item.md#notifications)
* [seq](item.md#seq)
* [signalId](item.md#signalid)
* [startedAt](item.md#startedat)
* [timeDue](item.md#timedue)
* [token](item.md#token)
* [userId](item.md#userid)

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

* [log](item.md#log)
* [save](item.md#save)
* [load](item.md#static-load)

## Constructors

###  constructor

\+ **new Item**(`element`: any, `token`: any, `status`: [ITEM_STATUS](../enums/item_status.md)): *[Item](item.md)*

Defined in bpmnServer/src/engine/Item.ts:61

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

Defined in bpmnServer/src/engine/Item.ts:61

___

###  _endedAt

• **_endedAt**: *any* = null

Defined in bpmnServer/src/engine/Item.ts:16

___

###  _status

• **_status**: *[ITEM_STATUS](../enums/item_status.md)*

Defined in bpmnServer/src/engine/Item.ts:30

___

###  assignments

• **assignments**: *any[]* = []

*Implementation of [IItem](../interfaces/iitem.md).[assignments](../interfaces/iitem.md#assignments)*

Defined in bpmnServer/src/engine/Item.ts:17

___

###  authorizations

• **authorizations**: *any[]* = []

*Implementation of [IItem](../interfaces/iitem.md).[authorizations](../interfaces/iitem.md#authorizations)*

Defined in bpmnServer/src/engine/Item.ts:18

___

###  element

• **element**: *[Element](element.md)*

*Implementation of [IItem](../interfaces/iitem.md).[element](../interfaces/iitem.md#element)*

Defined in bpmnServer/src/engine/Item.ts:11

___

###  id

• **id**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[id](../interfaces/iitem.md#id)*

Defined in bpmnServer/src/engine/Item.ts:9

___

###  itemKey

• **itemKey**: *string*

*Implementation of [IItem](../interfaces/iitem.md).[itemKey](../interfaces/iitem.md#itemkey)*

Defined in bpmnServer/src/engine/Item.ts:10

___

###  messageId

• **messageId**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[messageId](../interfaces/iitem.md#messageid)*

Defined in bpmnServer/src/engine/Item.ts:58

___

###  notifications

• **notifications**: *any[]* = []

*Implementation of [IItem](../interfaces/iitem.md).[notifications](../interfaces/iitem.md#notifications)*

Defined in bpmnServer/src/engine/Item.ts:19

___

###  seq

• **seq**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[seq](../interfaces/iitem.md#seq)*

Defined in bpmnServer/src/engine/Item.ts:13

___

###  signalId

• **signalId**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[signalId](../interfaces/iitem.md#signalid)*

Defined in bpmnServer/src/engine/Item.ts:59

___

###  startedAt

• **startedAt**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[startedAt](../interfaces/iitem.md#startedat)*

Defined in bpmnServer/src/engine/Item.ts:15

___

###  timeDue

• **timeDue**: *Date*

*Implementation of [IItem](../interfaces/iitem.md).[timeDue](../interfaces/iitem.md#timedue)*

Defined in bpmnServer/src/engine/Item.ts:57

___

###  token

• **token**: *[Token](token.md)*

*Implementation of [IItem](../interfaces/iitem.md).[token](../interfaces/iitem.md#token)*

Defined in bpmnServer/src/engine/Item.ts:12

___

###  userId

• **userId**: *any*

*Implementation of [IItem](../interfaces/iitem.md).[userId](../interfaces/iitem.md#userid)*

Defined in bpmnServer/src/engine/Item.ts:14

## Accessors

###  context

• **get context**(): *[IExecution](../interfaces/iexecution.md)*

Defined in bpmnServer/src/engine/Item.ts:42

**Returns:** *[IExecution](../interfaces/iexecution.md)*

___

###  data

• **get data**(): *any*

Defined in bpmnServer/src/engine/Item.ts:40

**Returns:** *any*

• **set data**(`val`: any): *void*

Defined in bpmnServer/src/engine/Item.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *void*

___

###  elementId

• **get elementId**(): *any*

Defined in bpmnServer/src/engine/Item.ts:43

**Returns:** *any*

___

###  endedAt

• **get endedAt**(): *any*

Defined in bpmnServer/src/engine/Item.ts:22

**Returns:** *any*

• **set endedAt**(`val`: any): *void*

Defined in bpmnServer/src/engine/Item.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *void*

___

###  name

• **get name**(): *any*

Defined in bpmnServer/src/engine/Item.ts:44

**Returns:** *any*

___

###  node

• **get node**(): *[Node](node.md)*

Defined in bpmnServer/src/engine/Item.ts:53

**Returns:** *[Node](node.md)*

___

###  status

• **get status**(): *[ITEM_STATUS](../enums/item_status.md)*

Defined in bpmnServer/src/engine/Item.ts:31

**Returns:** *[ITEM_STATUS](../enums/item_status.md)*

• **set status**(`val`: [ITEM_STATUS](../enums/item_status.md)): *void*

Defined in bpmnServer/src/engine/Item.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`val` | [ITEM_STATUS](../enums/item_status.md) |

**Returns:** *void*

___

###  tokenId

• **get tokenId**(): *any*

Defined in bpmnServer/src/engine/Item.ts:47

**Returns:** *any*

___

###  type

• **get type**(): *any*

Defined in bpmnServer/src/engine/Item.ts:50

**Returns:** *any*

## Methods

###  log

▸ **log**(`msg`: any): *void*

Defined in bpmnServer/src/engine/Item.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  save

▸ **save**(): *[IItemData](../interfaces/iitemdata.md)*

Defined in bpmnServer/src/engine/Item.ts:74

**Returns:** *[IItemData](../interfaces/iitemdata.md)*

___

### `Static` load

▸ **load**(`execution`: [Execution](execution.md), `dataObject`: [IItemData](../interfaces/iitemdata.md), `token`: any): *[Item](item.md)‹›*

Defined in bpmnServer/src/engine/Item.ts:84

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |
`dataObject` | [IItemData](../interfaces/iitemdata.md) |
`token` | any |

**Returns:** *[Item](item.md)‹›*
