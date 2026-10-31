[bpmn-server](../readme.md) / Item

# Class: Item

## Implements

- [`IItem`](../interfaces/IItem.md)

## Table of contents

### Constructors

- [constructor](Item.md#constructor)

### Properties

- [id](Item.md#id)
- [itemKey](Item.md#itemkey)
- [element](Item.md#element)
- [token](Item.md#token)
- [seq](Item.md#seq)
- [userName](Item.md#username)
- [startedAt](Item.md#startedat)
- [endedAt](Item.md#endedat)
- [instanceId](Item.md#instanceid)
- [input](Item.md#input)
- [output](Item.md#output)
- [vars](Item.md#vars)
- [assignee](Item.md#assignee)
- [candidateGroups](Item.md#candidategroups)
- [candidateUsers](Item.md#candidateusers)
- [dueDate](Item.md#duedate)
- [followUpDate](Item.md#followupdate)
- [priority](Item.md#priority)
- [status](Item.md#status)
- [timeDue](Item.md#timedue)
- [timerCount](Item.md#timercount)
- [messageId](Item.md#messageid)
- [signalId](Item.md#signalid)

### Accessors

- [data](Item.md#data)
- [options](Item.md#options)
- [context](Item.md#context)
- [elementId](Item.md#elementid)
- [name](Item.md#name)
- [tokenId](Item.md#tokenid)
- [type](Item.md#type)
- [node](Item.md#node)

### Methods

- [log](Item.md#log)
- [setData](Item.md#setdata)
- [save](Item.md#save)
- [load](Item.md#load)

## Constructors

### constructor

• **new Item**(`element`, `token`, `status?`): [`Item`](Item.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `element` | `any` | `undefined` |
| `token` | `any` | `undefined` |
| `status` | [`ITEM_STATUS`](../enums/ITEM_STATUS.md) | `ITEM_STATUS.start` |

#### Returns

[`Item`](Item.md)

#### Defined in

[engine/Item.ts:55](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L55)

## Properties

### id

• **id**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[id](../interfaces/IItem.md#id)

#### Defined in

[engine/Item.ts:8](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L8)

___

### itemKey

• **itemKey**: `string`

#### Implementation of

[IItem](../interfaces/IItem.md).[itemKey](../interfaces/IItem.md#itemkey)

#### Defined in

[engine/Item.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L9)

___

### element

• **element**: [`Element`](Element.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[element](../interfaces/IItem.md#element)

#### Defined in

[engine/Item.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L10)

___

### token

• **token**: [`Token`](Token.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[token](../interfaces/IItem.md#token)

#### Defined in

[engine/Item.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L11)

___

### seq

• **seq**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[seq](../interfaces/IItem.md#seq)

#### Defined in

[engine/Item.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L12)

___

### userName

• **userName**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[userName](../interfaces/IItem.md#username)

#### Defined in

[engine/Item.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L13)

___

### startedAt

• **startedAt**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[startedAt](../interfaces/IItem.md#startedat)

#### Defined in

[engine/Item.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L14)

___

### endedAt

• **endedAt**: `any` = `null`

#### Implementation of

[IItem](../interfaces/IItem.md).[endedAt](../interfaces/IItem.md#endedat)

#### Defined in

[engine/Item.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L15)

___

### instanceId

• **instanceId**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[instanceId](../interfaces/IItem.md#instanceid)

#### Defined in

[engine/Item.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L16)

___

### input

• **input**: `Object` = `{}`

#### Defined in

[engine/Item.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L17)

___

### output

• **output**: `Object` = `{}`

#### Defined in

[engine/Item.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L18)

___

### vars

• **vars**: `Object` = `{}`

#### Implementation of

[IItem](../interfaces/IItem.md).[vars](../interfaces/IItem.md#vars)

#### Defined in

[engine/Item.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L19)

___

### assignee

• **assignee**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[assignee](../interfaces/IItem.md#assignee)

#### Defined in

[engine/Item.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L20)

___

### candidateGroups

• **candidateGroups**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[candidateGroups](../interfaces/IItem.md#candidategroups)

#### Defined in

[engine/Item.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L21)

___

### candidateUsers

• **candidateUsers**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[candidateUsers](../interfaces/IItem.md#candidateusers)

#### Defined in

[engine/Item.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L22)

___

### dueDate

• **dueDate**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[dueDate](../interfaces/IItem.md#duedate)

#### Defined in

[engine/Item.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L23)

___

### followUpDate

• **followUpDate**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[followUpDate](../interfaces/IItem.md#followupdate)

#### Defined in

[engine/Item.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L24)

___

### priority

• **priority**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[priority](../interfaces/IItem.md#priority)

#### Defined in

[engine/Item.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L25)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[status](../interfaces/IItem.md#status)

#### Defined in

[engine/Item.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L28)

___

### timeDue

• **timeDue**: `Date`

#### Implementation of

[IItem](../interfaces/IItem.md).[timeDue](../interfaces/IItem.md#timedue)

#### Defined in

[engine/Item.ts:49](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L49)

___

### timerCount

• **timerCount**: `any`

#### Defined in

[engine/Item.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L50)

___

### messageId

• **messageId**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[messageId](../interfaces/IItem.md#messageid)

#### Defined in

[engine/Item.ts:52](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L52)

___

### signalId

• **signalId**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[signalId](../interfaces/IItem.md#signalid)

#### Defined in

[engine/Item.ts:53](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L53)

## Accessors

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Defined in

[engine/Item.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L30)

• `set` **data**(`val`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`void`

#### Defined in

[engine/Item.ts:31](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L31)

___

### options

• `get` **options**(): `any`

#### Returns

`any`

#### Defined in

[engine/Item.ts:33](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L33)

___

### context

• `get` **context**(): [`IExecution`](../interfaces/IExecution.md)

#### Returns

[`IExecution`](../interfaces/IExecution.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[context](../interfaces/IItem.md#context)

#### Defined in

[engine/Item.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L34)

___

### elementId

• `get` **elementId**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[elementId](../interfaces/IItem.md#elementid)

#### Defined in

[engine/Item.ts:35](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L35)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[name](../interfaces/IItem.md#name)

#### Defined in

[engine/Item.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L36)

___

### tokenId

• `get` **tokenId**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[tokenId](../interfaces/IItem.md#tokenid)

#### Defined in

[engine/Item.ts:39](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L39)

___

### type

• `get` **type**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[type](../interfaces/IItem.md#type)

#### Defined in

[engine/Item.ts:42](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L42)

___

### node

• `get` **node**(): [`Node`](Node.md)

#### Returns

[`Node`](Node.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[node](../interfaces/IItem.md#node)

#### Defined in

[engine/Item.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L45)

## Methods

### log

▸ **log**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Defined in

[engine/Item.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L29)

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

[engine/Item.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L32)

___

### save

▸ **save**(): [`IItemData`](../interfaces/IItemData.md)

#### Returns

[`IItemData`](../interfaces/IItemData.md)

#### Defined in

[engine/Item.ts:67](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L67)

___

### load

▸ **load**(`execution`, `dataObject`, `token`): [`Item`](Item.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](Execution.md) |
| `dataObject` | [`IItemData`](../interfaces/IItemData.md) |
| `token` | `any` |

#### Returns

[`Item`](Item.md)

#### Defined in

[engine/Item.ts:83](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Item.ts#L83)
