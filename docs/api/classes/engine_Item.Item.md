[bpmn-server](../README.md) / [Exports](../modules.md) / [engine/Item](../modules/engine_Item.md) / Item

# Class: Item

[engine/Item](../modules/engine_Item.md).Item

## Implements

- [`IItem`](../interfaces/interfaces_engine.IItem.md)

## Table of contents

### Constructors

- [constructor](engine_Item.Item.md#constructor)

### Properties

- [assignee](engine_Item.Item.md#assignee)
- [candidateGroups](engine_Item.Item.md#candidategroups)
- [candidateUsers](engine_Item.Item.md#candidateusers)
- [dueDate](engine_Item.Item.md#duedate)
- [element](engine_Item.Item.md#element)
- [endedAt](engine_Item.Item.md#endedat)
- [followUpDate](engine_Item.Item.md#followupdate)
- [id](engine_Item.Item.md#id)
- [input](engine_Item.Item.md#input)
- [instanceId](engine_Item.Item.md#instanceid)
- [itemKey](engine_Item.Item.md#itemkey)
- [messageId](engine_Item.Item.md#messageid)
- [output](engine_Item.Item.md#output)
- [priority](engine_Item.Item.md#priority)
- [seq](engine_Item.Item.md#seq)
- [signalId](engine_Item.Item.md#signalid)
- [startedAt](engine_Item.Item.md#startedat)
- [status](engine_Item.Item.md#status)
- [timeDue](engine_Item.Item.md#timedue)
- [timerCount](engine_Item.Item.md#timercount)
- [token](engine_Item.Item.md#token)
- [userName](engine_Item.Item.md#username)
- [vars](engine_Item.Item.md#vars)

### Accessors

- [context](engine_Item.Item.md#context)
- [data](engine_Item.Item.md#data)
- [elementId](engine_Item.Item.md#elementid)
- [name](engine_Item.Item.md#name)
- [node](engine_Item.Item.md#node)
- [options](engine_Item.Item.md#options)
- [tokenId](engine_Item.Item.md#tokenid)
- [type](engine_Item.Item.md#type)

### Methods

- [log](engine_Item.Item.md#log)
- [save](engine_Item.Item.md#save)
- [setData](engine_Item.Item.md#setdata)
- [load](engine_Item.Item.md#load)

## Constructors

### constructor

• **new Item**(`element`, `token`, `status?`): [`Item`](engine_Item.Item.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `element` | `any` | `undefined` |
| `token` | `any` | `undefined` |
| `status` | [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md) | `ITEM_STATUS.start` |

#### Returns

[`Item`](engine_Item.Item.md)

#### Defined in

[src/engine/Item.ts:55](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L55)

## Properties

### assignee

• **assignee**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[assignee](../interfaces/interfaces_engine.IItem.md#assignee)

#### Defined in

[src/engine/Item.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L20)

___

### candidateGroups

• **candidateGroups**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[candidateGroups](../interfaces/interfaces_engine.IItem.md#candidategroups)

#### Defined in

[src/engine/Item.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L21)

___

### candidateUsers

• **candidateUsers**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[candidateUsers](../interfaces/interfaces_engine.IItem.md#candidateusers)

#### Defined in

[src/engine/Item.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L22)

___

### dueDate

• **dueDate**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[dueDate](../interfaces/interfaces_engine.IItem.md#duedate)

#### Defined in

[src/engine/Item.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L23)

___

### element

• **element**: [`Element`](elements_Element.Element.md)

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[element](../interfaces/interfaces_engine.IItem.md#element)

#### Defined in

[src/engine/Item.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L10)

___

### endedAt

• **endedAt**: `any` = `null`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[endedAt](../interfaces/interfaces_engine.IItem.md#endedat)

#### Defined in

[src/engine/Item.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L15)

___

### followUpDate

• **followUpDate**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[followUpDate](../interfaces/interfaces_engine.IItem.md#followupdate)

#### Defined in

[src/engine/Item.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L24)

___

### id

• **id**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[id](../interfaces/interfaces_engine.IItem.md#id)

#### Defined in

[src/engine/Item.ts:8](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L8)

___

### input

• **input**: `Object` = `{}`

#### Defined in

[src/engine/Item.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L17)

___

### instanceId

• **instanceId**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[instanceId](../interfaces/interfaces_engine.IItem.md#instanceid)

#### Defined in

[src/engine/Item.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L16)

___

### itemKey

• **itemKey**: `string`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[itemKey](../interfaces/interfaces_engine.IItem.md#itemkey)

#### Defined in

[src/engine/Item.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L9)

___

### messageId

• **messageId**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[messageId](../interfaces/interfaces_engine.IItem.md#messageid)

#### Defined in

[src/engine/Item.ts:52](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L52)

___

### output

• **output**: `Object` = `{}`

#### Defined in

[src/engine/Item.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L18)

___

### priority

• **priority**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[priority](../interfaces/interfaces_engine.IItem.md#priority)

#### Defined in

[src/engine/Item.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L25)

___

### seq

• **seq**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[seq](../interfaces/interfaces_engine.IItem.md#seq)

#### Defined in

[src/engine/Item.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L12)

___

### signalId

• **signalId**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[signalId](../interfaces/interfaces_engine.IItem.md#signalid)

#### Defined in

[src/engine/Item.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L53)

___

### startedAt

• **startedAt**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[startedAt](../interfaces/interfaces_engine.IItem.md#startedat)

#### Defined in

[src/engine/Item.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L14)

___

### status

• **status**: [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md)

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[status](../interfaces/interfaces_engine.IItem.md#status)

#### Defined in

[src/engine/Item.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L28)

___

### timeDue

• **timeDue**: `Date`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[timeDue](../interfaces/interfaces_engine.IItem.md#timedue)

#### Defined in

[src/engine/Item.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L49)

___

### timerCount

• **timerCount**: `any`

#### Defined in

[src/engine/Item.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L50)

___

### token

• **token**: [`Token`](engine_Token.Token.md)

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[token](../interfaces/interfaces_engine.IItem.md#token)

#### Defined in

[src/engine/Item.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L11)

___

### userName

• **userName**: `any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[userName](../interfaces/interfaces_engine.IItem.md#username)

#### Defined in

[src/engine/Item.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L13)

___

### vars

• **vars**: `Object` = `{}`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[vars](../interfaces/interfaces_engine.IItem.md#vars)

#### Defined in

[src/engine/Item.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L19)

## Accessors

### context

• `get` **context**(): [`IExecution`](../interfaces/interfaces_engine.IExecution.md)

#### Returns

[`IExecution`](../interfaces/interfaces_engine.IExecution.md)

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[context](../interfaces/interfaces_engine.IItem.md#context)

#### Defined in

[src/engine/Item.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L34)

___

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Defined in

[src/engine/Item.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L30)

• `set` **data**(`val`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`void`

#### Defined in

[src/engine/Item.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L31)

___

### elementId

• `get` **elementId**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[elementId](../interfaces/interfaces_engine.IItem.md#elementid)

#### Defined in

[src/engine/Item.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L35)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[name](../interfaces/interfaces_engine.IItem.md#name)

#### Defined in

[src/engine/Item.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L36)

___

### node

• `get` **node**(): [`Node`](elements_Node.Node.md)

#### Returns

[`Node`](elements_Node.Node.md)

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[node](../interfaces/interfaces_engine.IItem.md#node)

#### Defined in

[src/engine/Item.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L45)

___

### options

• `get` **options**(): `any`

#### Returns

`any`

#### Defined in

[src/engine/Item.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L33)

___

### tokenId

• `get` **tokenId**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[tokenId](../interfaces/interfaces_engine.IItem.md#tokenid)

#### Defined in

[src/engine/Item.ts:39](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L39)

___

### type

• `get` **type**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/interfaces_engine.IItem.md).[type](../interfaces/interfaces_engine.IItem.md#type)

#### Defined in

[src/engine/Item.ts:42](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L42)

## Methods

### log

▸ **log**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Defined in

[src/engine/Item.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L29)

___

### save

▸ **save**(): [`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)

#### Returns

[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)

#### Defined in

[src/engine/Item.ts:64](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L64)

___

### setData

▸ **setData**(`val`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`void`

#### Defined in

[src/engine/Item.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L32)

___

### load

▸ **load**(`execution`, `dataObject`, `token`): [`Item`](engine_Item.Item.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](engine_Execution.Execution.md) |
| `dataObject` | [`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md) |
| `token` | `any` |

#### Returns

[`Item`](engine_Item.Item.md)

#### Defined in

[src/engine/Item.ts:80](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Item.ts#L80)
