[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/engine](../modules/interfaces_engine.md) / IItem

# Interface: IItem

[interfaces/engine](../modules/interfaces_engine.md).IItem

## Hierarchy

- [`IItemData`](interfaces_DataObjects.IItemData.md)

  ↳ **`IItem`**

## Implemented by

- [`Item`](../classes/engine_Item.Item.md)

## Table of contents

### Properties

- [assignee](interfaces_engine.IItem.md#assignee)
- [candidateGroups](interfaces_engine.IItem.md#candidategroups)
- [candidateUsers](interfaces_engine.IItem.md#candidateusers)
- [context](interfaces_engine.IItem.md#context)
- [dueDate](interfaces_engine.IItem.md#duedate)
- [element](interfaces_engine.IItem.md#element)
- [elementId](interfaces_engine.IItem.md#elementid)
- [endedAt](interfaces_engine.IItem.md#endedat)
- [followUpDate](interfaces_engine.IItem.md#followupdate)
- [id](interfaces_engine.IItem.md#id)
- [instanceId](interfaces_engine.IItem.md#instanceid)
- [itemKey](interfaces_engine.IItem.md#itemkey)
- [messageId](interfaces_engine.IItem.md#messageid)
- [name](interfaces_engine.IItem.md#name)
- [node](interfaces_engine.IItem.md#node)
- [priority](interfaces_engine.IItem.md#priority)
- [processName](interfaces_engine.IItem.md#processname)
- [seq](interfaces_engine.IItem.md#seq)
- [signalId](interfaces_engine.IItem.md#signalid)
- [startedAt](interfaces_engine.IItem.md#startedat)
- [status](interfaces_engine.IItem.md#status)
- [timeDue](interfaces_engine.IItem.md#timedue)
- [token](interfaces_engine.IItem.md#token)
- [tokenId](interfaces_engine.IItem.md#tokenid)
- [type](interfaces_engine.IItem.md#type)
- [userName](interfaces_engine.IItem.md#username)
- [vars](interfaces_engine.IItem.md#vars)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[assignee](interfaces_DataObjects.IItemData.md#assignee)

#### Defined in

[src/interfaces/DataObjects.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L22)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[candidateGroups](interfaces_DataObjects.IItemData.md#candidategroups)

#### Defined in

[src/interfaces/DataObjects.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[candidateUsers](interfaces_DataObjects.IItemData.md#candidateusers)

#### Defined in

[src/interfaces/DataObjects.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L24)

___

### context

• **context**: [`IExecution`](interfaces_engine.IExecution.md)

#### Defined in

[src/interfaces/engine.ts:138](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L138)

___

### dueDate

• **dueDate**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[dueDate](interfaces_DataObjects.IItemData.md#duedate)

#### Defined in

[src/interfaces/DataObjects.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L25)

___

### element

• **element**: [`Element`](../classes/elements_Element.Element.md)

#### Defined in

[src/interfaces/engine.ts:136](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L136)

___

### elementId

• **elementId**: `string`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[elementId](interfaces_DataObjects.IItemData.md#elementid)

#### Defined in

[src/interfaces/DataObjects.ts:6](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L6)

___

### endedAt

• **endedAt**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[endedAt](interfaces_DataObjects.IItemData.md#endedat)

#### Defined in

[src/interfaces/DataObjects.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L14)

___

### followUpDate

• **followUpDate**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[followUpDate](interfaces_DataObjects.IItemData.md#followupdate)

#### Defined in

[src/interfaces/DataObjects.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L26)

___

### id

• **id**: `string`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[id](interfaces_DataObjects.IItemData.md#id)

#### Defined in

[src/interfaces/DataObjects.ts:4](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L4)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[instanceId](interfaces_DataObjects.IItemData.md#instanceid)

#### Defined in

[src/interfaces/DataObjects.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L9)

___

### itemKey

• **itemKey**: `string`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[itemKey](interfaces_DataObjects.IItemData.md#itemkey)

#### Defined in

[src/interfaces/DataObjects.ts:5](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L5)

___

### messageId

• **messageId**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[messageId](interfaces_DataObjects.IItemData.md#messageid)

#### Defined in

[src/interfaces/DataObjects.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L19)

___

### name

• **name**: `string`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[name](interfaces_DataObjects.IItemData.md#name)

#### Defined in

[src/interfaces/DataObjects.ts:7](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L7)

___

### node

• **node**: [`Node`](../classes/elements_Node.Node.md)

#### Defined in

[src/interfaces/engine.ts:139](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L139)

___

### priority

• **priority**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[priority](interfaces_DataObjects.IItemData.md#priority)

#### Defined in

[src/interfaces/DataObjects.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L27)

___

### processName

• `Optional` **processName**: `string`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[processName](interfaces_DataObjects.IItemData.md#processname)

#### Defined in

[src/interfaces/DataObjects.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L10)

___

### seq

• **seq**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[seq](interfaces_DataObjects.IItemData.md#seq)

#### Defined in

[src/interfaces/DataObjects.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L15)

___

### signalId

• **signalId**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[signalId](interfaces_DataObjects.IItemData.md#signalid)

#### Defined in

[src/interfaces/DataObjects.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L20)

___

### startedAt

• **startedAt**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[startedAt](interfaces_DataObjects.IItemData.md#startedat)

#### Defined in

[src/interfaces/DataObjects.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L13)

___

### status

• **status**: [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md)

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[status](interfaces_DataObjects.IItemData.md#status)

#### Defined in

[src/interfaces/DataObjects.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L17)

___

### timeDue

• **timeDue**: `Date`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[timeDue](interfaces_DataObjects.IItemData.md#timedue)

#### Defined in

[src/interfaces/DataObjects.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L16)

___

### token

• **token**: [`Token`](../classes/engine_Token.Token.md)

#### Defined in

[src/interfaces/engine.ts:137](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L137)

___

### tokenId

• **tokenId**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[tokenId](interfaces_DataObjects.IItemData.md#tokenid)

#### Defined in

[src/interfaces/DataObjects.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L11)

___

### type

• **type**: `string`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[type](interfaces_DataObjects.IItemData.md#type)

#### Defined in

[src/interfaces/DataObjects.ts:8](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L8)

___

### userName

• **userName**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[userName](interfaces_DataObjects.IItemData.md#username)

#### Defined in

[src/interfaces/DataObjects.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L12)

___

### vars

• **vars**: `any`

#### Inherited from

[IItemData](interfaces_DataObjects.IItemData.md).[vars](interfaces_DataObjects.IItemData.md#vars)

#### Defined in

[src/interfaces/DataObjects.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/DataObjects.ts#L21)
