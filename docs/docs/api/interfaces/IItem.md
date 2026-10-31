[bpmn-server](../readme.md) / IItem

# Interface: IItem

## Hierarchy

- [`IItemData`](IItemData.md)

  ↳ **`IItem`**

## Implemented by

- [`Item`](../classes/Item.md)

## Table of contents

### Properties

- [id](IItem.md#id)
- [itemKey](IItem.md#itemkey)
- [elementId](IItem.md#elementid)
- [name](IItem.md#name)
- [type](IItem.md#type)
- [instanceId](IItem.md#instanceid)
- [processName](IItem.md#processname)
- [tokenId](IItem.md#tokenid)
- [userName](IItem.md#username)
- [startedAt](IItem.md#startedat)
- [endedAt](IItem.md#endedat)
- [seq](IItem.md#seq)
- [timeDue](IItem.md#timedue)
- [status](IItem.md#status)
- [messageId](IItem.md#messageid)
- [signalId](IItem.md#signalid)
- [vars](IItem.md#vars)
- [assignee](IItem.md#assignee)
- [candidateGroups](IItem.md#candidategroups)
- [candidateUsers](IItem.md#candidateusers)
- [dueDate](IItem.md#duedate)
- [followUpDate](IItem.md#followupdate)
- [priority](IItem.md#priority)
- [element](IItem.md#element)
- [token](IItem.md#token)
- [context](IItem.md#context)
- [node](IItem.md#node)

## Properties

### id

• **id**: `string`

#### Inherited from

[IItemData](IItemData.md).[id](IItemData.md#id)

#### Defined in

[interfaces/DataObjects.ts:4](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L4)

___

### itemKey

• **itemKey**: `string`

#### Inherited from

[IItemData](IItemData.md).[itemKey](IItemData.md#itemkey)

#### Defined in

[interfaces/DataObjects.ts:5](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L5)

___

### elementId

• **elementId**: `string`

#### Inherited from

[IItemData](IItemData.md).[elementId](IItemData.md#elementid)

#### Defined in

[interfaces/DataObjects.ts:6](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L6)

___

### name

• **name**: `string`

#### Inherited from

[IItemData](IItemData.md).[name](IItemData.md#name)

#### Defined in

[interfaces/DataObjects.ts:7](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L7)

___

### type

• **type**: `string`

#### Inherited from

[IItemData](IItemData.md).[type](IItemData.md#type)

#### Defined in

[interfaces/DataObjects.ts:8](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L8)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

[IItemData](IItemData.md).[instanceId](IItemData.md#instanceid)

#### Defined in

[interfaces/DataObjects.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L9)

___

### processName

• `Optional` **processName**: `string`

#### Inherited from

[IItemData](IItemData.md).[processName](IItemData.md#processname)

#### Defined in

[interfaces/DataObjects.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L10)

___

### tokenId

• **tokenId**: `any`

#### Inherited from

[IItemData](IItemData.md).[tokenId](IItemData.md#tokenid)

#### Defined in

[interfaces/DataObjects.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L11)

___

### userName

• **userName**: `any`

#### Inherited from

[IItemData](IItemData.md).[userName](IItemData.md#username)

#### Defined in

[interfaces/DataObjects.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L12)

___

### startedAt

• **startedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[startedAt](IItemData.md#startedat)

#### Defined in

[interfaces/DataObjects.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L13)

___

### endedAt

• **endedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[endedAt](IItemData.md#endedat)

#### Defined in

[interfaces/DataObjects.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L14)

___

### seq

• **seq**: `any`

#### Inherited from

[IItemData](IItemData.md).[seq](IItemData.md#seq)

#### Defined in

[interfaces/DataObjects.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L15)

___

### timeDue

• **timeDue**: `Date`

#### Inherited from

[IItemData](IItemData.md).[timeDue](IItemData.md#timedue)

#### Defined in

[interfaces/DataObjects.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L16)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Inherited from

[IItemData](IItemData.md).[status](IItemData.md#status)

#### Defined in

[interfaces/DataObjects.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L17)

___

### messageId

• **messageId**: `any`

#### Inherited from

[IItemData](IItemData.md).[messageId](IItemData.md#messageid)

#### Defined in

[interfaces/DataObjects.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L19)

___

### signalId

• **signalId**: `any`

#### Inherited from

[IItemData](IItemData.md).[signalId](IItemData.md#signalid)

#### Defined in

[interfaces/DataObjects.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L20)

___

### vars

• **vars**: `any`

#### Inherited from

[IItemData](IItemData.md).[vars](IItemData.md#vars)

#### Defined in

[interfaces/DataObjects.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L21)

___

### assignee

• **assignee**: `any`

#### Inherited from

[IItemData](IItemData.md).[assignee](IItemData.md#assignee)

#### Defined in

[interfaces/DataObjects.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L22)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateGroups](IItemData.md#candidategroups)

#### Defined in

[interfaces/DataObjects.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateUsers](IItemData.md#candidateusers)

#### Defined in

[interfaces/DataObjects.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L24)

___

### dueDate

• **dueDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[dueDate](IItemData.md#duedate)

#### Defined in

[interfaces/DataObjects.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L25)

___

### followUpDate

• **followUpDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[followUpDate](IItemData.md#followupdate)

#### Defined in

[interfaces/DataObjects.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L26)

___

### priority

• **priority**: `any`

#### Inherited from

[IItemData](IItemData.md).[priority](IItemData.md#priority)

#### Defined in

[interfaces/DataObjects.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/DataObjects.ts#L27)

___

### element

• **element**: [`Element`](../classes/Element.md)

#### Defined in

[interfaces/engine.ts:143](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L143)

___

### token

• **token**: [`Token`](../classes/Token.md)

#### Defined in

[interfaces/engine.ts:144](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L144)

___

### context

• **context**: [`IExecution`](IExecution.md)

#### Defined in

[interfaces/engine.ts:145](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L145)

___

### node

• **node**: [`Node`](../classes/Node.md)

#### Defined in

[interfaces/engine.ts:146](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L146)
