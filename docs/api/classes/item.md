[bpmn-server](../README.md) / Item

# Class: Item

## Implements

- [`IItem`](../interfaces/IItem.md)

## Table of contents

### Constructors

- [constructor](Item.md#constructor)

### Properties

- [assignee](Item.md#assignee)
- [candidateGroups](Item.md#candidategroups)
- [candidateUsers](Item.md#candidateusers)
- [dueDate](Item.md#duedate)
- [element](Item.md#element)
- [endedAt](Item.md#endedat)
- [followUpDate](Item.md#followupdate)
- [id](Item.md#id)
- [input](Item.md#input)
- [instanceId](Item.md#instanceid)
- [itemKey](Item.md#itemkey)
- [messageId](Item.md#messageid)
- [output](Item.md#output)
- [priority](Item.md#priority)
- [seq](Item.md#seq)
- [signalId](Item.md#signalid)
- [startedAt](Item.md#startedat)
- [status](Item.md#status)
- [timeDue](Item.md#timedue)
- [timerCount](Item.md#timercount)
- [token](Item.md#token)
- [userName](Item.md#username)
- [vars](Item.md#vars)

### Accessors

- [context](Item.md#context)
- [data](Item.md#data)
- [elementId](Item.md#elementid)
- [name](Item.md#name)
- [node](Item.md#node)
- [options](Item.md#options)
- [tokenId](Item.md#tokenid)
- [type](Item.md#type)

### Methods

- [log](Item.md#log)
- [save](Item.md#save)
- [setData](Item.md#setdata)
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

[engine/Item.ts:55](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-55)

## Properties

### assignee

• **assignee**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[assignee](../interfaces/IItem.md#assignee)

#### Defined in

[engine/Item.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-20)

___

### candidateGroups

• **candidateGroups**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[candidateGroups](../interfaces/IItem.md#candidategroups)

#### Defined in

[engine/Item.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-21)

___

### candidateUsers

• **candidateUsers**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[candidateUsers](../interfaces/IItem.md#candidateusers)

#### Defined in

[engine/Item.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-22)

___

### dueDate

• **dueDate**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[dueDate](../interfaces/IItem.md#duedate)

#### Defined in

[engine/Item.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-23)

___

### element

• **element**: [`Element`](Element.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[element](../interfaces/IItem.md#element)

#### Defined in

[engine/Item.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-10)

___

### endedAt

• **endedAt**: `any` = `null`

#### Implementation of

[IItem](../interfaces/IItem.md).[endedAt](../interfaces/IItem.md#endedat)

#### Defined in

[engine/Item.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-15)

___

### followUpDate

• **followUpDate**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[followUpDate](../interfaces/IItem.md#followupdate)

#### Defined in

[engine/Item.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-24)

___

### id

• **id**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[id](../interfaces/IItem.md#id)

#### Defined in

[engine/Item.ts:8](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-8)

___

### input

• **input**: `Object` = `{}`

#### Defined in

[engine/Item.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-17)

___

### instanceId

• **instanceId**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[instanceId](../interfaces/IItem.md#instanceid)

#### Defined in

[engine/Item.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-16)

___

### itemKey

• **itemKey**: `string`

#### Implementation of

[IItem](../interfaces/IItem.md).[itemKey](../interfaces/IItem.md#itemkey)

#### Defined in

[engine/Item.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-9)

___

### messageId

• **messageId**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[messageId](../interfaces/IItem.md#messageid)

#### Defined in

[engine/Item.ts:52](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-52)

___

### output

• **output**: `Object` = `{}`

#### Defined in

[engine/Item.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-18)

___

### priority

• **priority**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[priority](../interfaces/IItem.md#priority)

#### Defined in

[engine/Item.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-25)

___

### seq

• **seq**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[seq](../interfaces/IItem.md#seq)

#### Defined in

[engine/Item.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-12)

___

### signalId

• **signalId**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[signalId](../interfaces/IItem.md#signalid)

#### Defined in

[engine/Item.ts:53](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-53)

___

### startedAt

• **startedAt**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[startedAt](../interfaces/IItem.md#startedat)

#### Defined in

[engine/Item.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-14)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[status](../interfaces/IItem.md#status)

#### Defined in

[engine/Item.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-28)

___

### timeDue

• **timeDue**: `Date`

#### Implementation of

[IItem](../interfaces/IItem.md).[timeDue](../interfaces/IItem.md#timedue)

#### Defined in

[engine/Item.ts:49](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-49)

___

### timerCount

• **timerCount**: `any`

#### Defined in

[engine/Item.ts:50](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-50)

___

### token

• **token**: [`Token`](Token.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[token](../interfaces/IItem.md#token)

#### Defined in

[engine/Item.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-11)

___

### userName

• **userName**: `any`

#### Implementation of

[IItem](../interfaces/IItem.md).[userName](../interfaces/IItem.md#username)

#### Defined in

[engine/Item.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-13)

___

### vars

• **vars**: `Object` = `{}`

#### Implementation of

[IItem](../interfaces/IItem.md).[vars](../interfaces/IItem.md#vars)

#### Defined in

[engine/Item.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-19)

## Accessors

### context

• `get` **context**(): [`IExecution`](../interfaces/IExecution.md)

#### Returns

[`IExecution`](../interfaces/IExecution.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[context](../interfaces/IItem.md#context)

#### Defined in

[engine/Item.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-34)

___

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Defined in

[engine/Item.ts:30](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-30)

• `set` **data**(`val`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

`void`

#### Defined in

[engine/Item.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-31)

___

### elementId

• `get` **elementId**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[elementId](../interfaces/IItem.md#elementid)

#### Defined in

[engine/Item.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-35)

___

### name

• `get` **name**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[name](../interfaces/IItem.md#name)

#### Defined in

[engine/Item.ts:36](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-36)

___

### node

• `get` **node**(): [`Node`](Node.md)

#### Returns

[`Node`](Node.md)

#### Implementation of

[IItem](../interfaces/IItem.md).[node](../interfaces/IItem.md#node)

#### Defined in

[engine/Item.ts:45](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-45)

___

### options

• `get` **options**(): `any`

#### Returns

`any`

#### Defined in

[engine/Item.ts:33](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-33)

___

### tokenId

• `get` **tokenId**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[tokenId](../interfaces/IItem.md#tokenid)

#### Defined in

[engine/Item.ts:39](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-39)

___

### type

• `get` **type**(): `any`

#### Returns

`any`

#### Implementation of

[IItem](../interfaces/IItem.md).[type](../interfaces/IItem.md#type)

#### Defined in

[engine/Item.ts:42](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-42)

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

[engine/Item.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-29)

___

### save

▸ **save**(): [`IItemData`](../interfaces/IItemData.md)

#### Returns

[`IItemData`](../interfaces/IItemData.md)

#### Defined in

[engine/Item.ts:64](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-64)

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

[engine/Item.ts:32](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-32)

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

[engine/Item.ts:80](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/Item.ts#lines-80)
