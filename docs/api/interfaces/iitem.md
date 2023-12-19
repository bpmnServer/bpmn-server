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

[interfaces/DataObjects.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-22)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateGroups](IItemData.md#candidategroups)

#### Defined in

[interfaces/DataObjects.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateUsers](IItemData.md#candidateusers)

#### Defined in

[interfaces/DataObjects.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-24)

___

### context

• **context**: [`IExecution`](IExecution.md)

#### Defined in

[interfaces/engine.ts:138](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-138)

___

### dueDate

• **dueDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[dueDate](IItemData.md#duedate)

#### Defined in

[interfaces/DataObjects.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-25)

___

### element

• **element**: [`Element`](../classes/Element.md)

#### Defined in

[interfaces/engine.ts:136](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-136)

___

### elementId

• **elementId**: `string`

#### Inherited from

[IItemData](IItemData.md).[elementId](IItemData.md#elementid)

#### Defined in

[interfaces/DataObjects.ts:6](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-6)

___

### endedAt

• **endedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[endedAt](IItemData.md#endedat)

#### Defined in

[interfaces/DataObjects.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-14)

___

### followUpDate

• **followUpDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[followUpDate](IItemData.md#followupdate)

#### Defined in

[interfaces/DataObjects.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-26)

___

### id

• **id**: `string`

#### Inherited from

[IItemData](IItemData.md).[id](IItemData.md#id)

#### Defined in

[interfaces/DataObjects.ts:4](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-4)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

[IItemData](IItemData.md).[instanceId](IItemData.md#instanceid)

#### Defined in

[interfaces/DataObjects.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-9)

___

### itemKey

• **itemKey**: `string`

#### Inherited from

[IItemData](IItemData.md).[itemKey](IItemData.md#itemkey)

#### Defined in

[interfaces/DataObjects.ts:5](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-5)

___

### messageId

• **messageId**: `any`

#### Inherited from

[IItemData](IItemData.md).[messageId](IItemData.md#messageid)

#### Defined in

[interfaces/DataObjects.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-19)

___

### name

• **name**: `string`

#### Inherited from

[IItemData](IItemData.md).[name](IItemData.md#name)

#### Defined in

[interfaces/DataObjects.ts:7](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-7)

___

### node

• **node**: [`Node`](../classes/Node.md)

#### Defined in

[interfaces/engine.ts:139](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-139)

___

### priority

• **priority**: `any`

#### Inherited from

[IItemData](IItemData.md).[priority](IItemData.md#priority)

#### Defined in

[interfaces/DataObjects.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-27)

___

### processName

• `Optional` **processName**: `string`

#### Inherited from

[IItemData](IItemData.md).[processName](IItemData.md#processname)

#### Defined in

[interfaces/DataObjects.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-10)

___

### seq

• **seq**: `any`

#### Inherited from

[IItemData](IItemData.md).[seq](IItemData.md#seq)

#### Defined in

[interfaces/DataObjects.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-15)

___

### signalId

• **signalId**: `any`

#### Inherited from

[IItemData](IItemData.md).[signalId](IItemData.md#signalid)

#### Defined in

[interfaces/DataObjects.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-20)

___

### startedAt

• **startedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[startedAt](IItemData.md#startedat)

#### Defined in

[interfaces/DataObjects.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-13)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Inherited from

[IItemData](IItemData.md).[status](IItemData.md#status)

#### Defined in

[interfaces/DataObjects.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-17)

___

### timeDue

• **timeDue**: `Date`

#### Inherited from

[IItemData](IItemData.md).[timeDue](IItemData.md#timedue)

#### Defined in

[interfaces/DataObjects.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-16)

___

### token

• **token**: [`Token`](../classes/Token.md)

#### Defined in

[interfaces/engine.ts:137](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-137)

___

### tokenId

• **tokenId**: `any`

#### Inherited from

[IItemData](IItemData.md).[tokenId](IItemData.md#tokenid)

#### Defined in

[interfaces/DataObjects.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-11)

___

### type

• **type**: `string`

#### Inherited from

[IItemData](IItemData.md).[type](IItemData.md#type)

#### Defined in

[interfaces/DataObjects.ts:8](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-8)

___

### userName

• **userName**: `any`

#### Inherited from

[IItemData](IItemData.md).[userName](IItemData.md#username)

#### Defined in

[interfaces/DataObjects.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-12)

___

### vars

• **vars**: `any`

#### Inherited from

[IItemData](IItemData.md).[vars](IItemData.md#vars)

#### Defined in

[interfaces/DataObjects.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/DataObjects.ts#lines-21)
