[bpmn-server](../README.md) / IItem

# Interface: IItem

## Hierarchy

- [`IItemData`](IItemData.md)

  ↳ **`IItem`**

## Implemented by

- [`Item`](../classes/Item.md)

## Table of contents

### Properties

- [assignee](IItem.md#assignee)
- [candidateGroups](IItem.md#candidategroups)
- [candidateUsers](IItem.md#candidateusers)
- [context](IItem.md#context)
- [dueDate](IItem.md#duedate)
- [element](IItem.md#element)
- [elementId](IItem.md#elementid)
- [endedAt](IItem.md#endedat)
- [followUpDate](IItem.md#followupdate)
- [id](IItem.md#id)
- [instanceId](IItem.md#instanceid)
- [itemKey](IItem.md#itemkey)
- [messageId](IItem.md#messageid)
- [name](IItem.md#name)
- [node](IItem.md#node)
- [priority](IItem.md#priority)
- [processName](IItem.md#processname)
- [seq](IItem.md#seq)
- [signalId](IItem.md#signalid)
- [startedAt](IItem.md#startedat)
- [status](IItem.md#status)
- [timeDue](IItem.md#timedue)
- [token](IItem.md#token)
- [tokenId](IItem.md#tokenid)
- [type](IItem.md#type)
- [userName](IItem.md#username)
- [vars](IItem.md#vars)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[IItemData](IItemData.md).[assignee](IItemData.md#assignee)

#### Defined in

[interfaces/DataObjects.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L22)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateGroups](IItemData.md#candidategroups)

#### Defined in

[interfaces/DataObjects.ts:23](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateUsers](IItemData.md#candidateusers)

#### Defined in

[interfaces/DataObjects.ts:24](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L24)

___

### context

• **context**: [`IExecution`](IExecution.md)

#### Defined in

[interfaces/engine.ts:136](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/engine.ts#L136)

___

### dueDate

• **dueDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[dueDate](IItemData.md#duedate)

#### Defined in

[interfaces/DataObjects.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L25)

___

### element

• **element**: [`Element`](../classes/Element.md)

#### Defined in

[interfaces/engine.ts:134](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/engine.ts#L134)

___

### elementId

• **elementId**: `string`

#### Inherited from

[IItemData](IItemData.md).[elementId](IItemData.md#elementid)

#### Defined in

[interfaces/DataObjects.ts:6](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L6)

___

### endedAt

• **endedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[endedAt](IItemData.md#endedat)

#### Defined in

[interfaces/DataObjects.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L14)

___

### followUpDate

• **followUpDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[followUpDate](IItemData.md#followupdate)

#### Defined in

[interfaces/DataObjects.ts:26](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L26)

___

### id

• **id**: `string`

#### Inherited from

[IItemData](IItemData.md).[id](IItemData.md#id)

#### Defined in

[interfaces/DataObjects.ts:4](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L4)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

[IItemData](IItemData.md).[instanceId](IItemData.md#instanceid)

#### Defined in

[interfaces/DataObjects.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L9)

___

### itemKey

• **itemKey**: `string`

#### Inherited from

[IItemData](IItemData.md).[itemKey](IItemData.md#itemkey)

#### Defined in

[interfaces/DataObjects.ts:5](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L5)

___

### messageId

• **messageId**: `any`

#### Inherited from

[IItemData](IItemData.md).[messageId](IItemData.md#messageid)

#### Defined in

[interfaces/DataObjects.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L19)

___

### name

• **name**: `string`

#### Inherited from

[IItemData](IItemData.md).[name](IItemData.md#name)

#### Defined in

[interfaces/DataObjects.ts:7](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L7)

___

### node

• **node**: [`Node`](../classes/Node.md)

#### Defined in

[interfaces/engine.ts:137](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/engine.ts#L137)

___

### priority

• **priority**: `any`

#### Inherited from

[IItemData](IItemData.md).[priority](IItemData.md#priority)

#### Defined in

[interfaces/DataObjects.ts:27](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L27)

___

### processName

• `Optional` **processName**: `string`

#### Inherited from

[IItemData](IItemData.md).[processName](IItemData.md#processname)

#### Defined in

[interfaces/DataObjects.ts:10](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L10)

___

### seq

• **seq**: `any`

#### Inherited from

[IItemData](IItemData.md).[seq](IItemData.md#seq)

#### Defined in

[interfaces/DataObjects.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L15)

___

### signalId

• **signalId**: `any`

#### Inherited from

[IItemData](IItemData.md).[signalId](IItemData.md#signalid)

#### Defined in

[interfaces/DataObjects.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L20)

___

### startedAt

• **startedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[startedAt](IItemData.md#startedat)

#### Defined in

[interfaces/DataObjects.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L13)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Inherited from

[IItemData](IItemData.md).[status](IItemData.md#status)

#### Defined in

[interfaces/DataObjects.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L17)

___

### timeDue

• **timeDue**: `Date`

#### Inherited from

[IItemData](IItemData.md).[timeDue](IItemData.md#timedue)

#### Defined in

[interfaces/DataObjects.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L16)

___

### token

• **token**: [`Token`](../classes/Token.md)

#### Defined in

[interfaces/engine.ts:135](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/engine.ts#L135)

___

### tokenId

• **tokenId**: `any`

#### Inherited from

[IItemData](IItemData.md).[tokenId](IItemData.md#tokenid)

#### Defined in

[interfaces/DataObjects.ts:11](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L11)

___

### type

• **type**: `string`

#### Inherited from

[IItemData](IItemData.md).[type](IItemData.md#type)

#### Defined in

[interfaces/DataObjects.ts:8](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L8)

___

### userName

• **userName**: `any`

#### Inherited from

[IItemData](IItemData.md).[userName](IItemData.md#username)

#### Defined in

[interfaces/DataObjects.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L12)

___

### vars

• **vars**: `any`

#### Inherited from

[IItemData](IItemData.md).[vars](IItemData.md#vars)

#### Defined in

[interfaces/DataObjects.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/DataObjects.ts#L21)
