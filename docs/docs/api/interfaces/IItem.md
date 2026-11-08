[bpmn-server](../readme.md) / IItem

# Interface: IItem

## Hierarchy

- [`IItemData`](IItemData.md)

  ↳ **`IItem`**

## Implemented by

- [`Item`](../classes/Item.md)

## Table of contents

### Properties

- [timerCount](IItem.md#timercount)
- [timerRepeat](IItem.md#timerrepeat)
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
- [statusDetails](IItem.md#statusdetails)
- [data](IItem.md#data)
- [messageId](IItem.md#messageid)
- [signalId](IItem.md#signalid)
- [vars](IItem.md#vars)
- [output](IItem.md#output)
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

### timerCount

• `Optional` **timerCount**: `number`

a repeating timer: which firing this is, from 0, and how many there are to be

#### Inherited from

[IItemData](IItemData.md).[timerCount](IItemData.md#timercount)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:5](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L5)

___

### timerRepeat

• `Optional` **timerRepeat**: `string` \| `number`

#### Inherited from

[IItemData](IItemData.md).[timerRepeat](IItemData.md#timerrepeat)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:6](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L6)

___

### id

• **id**: `string`

#### Inherited from

[IItemData](IItemData.md).[id](IItemData.md#id)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:7](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L7)

___

### itemKey

• **itemKey**: `string`

#### Inherited from

[IItemData](IItemData.md).[itemKey](IItemData.md#itemkey)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:8](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L8)

___

### elementId

• **elementId**: `string`

#### Inherited from

[IItemData](IItemData.md).[elementId](IItemData.md#elementid)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:9](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L9)

___

### name

• **name**: `string`

#### Inherited from

[IItemData](IItemData.md).[name](IItemData.md#name)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L10)

___

### type

• **type**: `string`

#### Inherited from

[IItemData](IItemData.md).[type](IItemData.md#type)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L11)

___

### instanceId

• **instanceId**: `string`

#### Inherited from

[IItemData](IItemData.md).[instanceId](IItemData.md#instanceid)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L12)

___

### processName

• `Optional` **processName**: `string`

#### Inherited from

[IItemData](IItemData.md).[processName](IItemData.md#processname)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L13)

___

### tokenId

• **tokenId**: `any`

#### Inherited from

[IItemData](IItemData.md).[tokenId](IItemData.md#tokenid)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L14)

___

### userName

• **userName**: `any`

#### Inherited from

[IItemData](IItemData.md).[userName](IItemData.md#username)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L15)

___

### startedAt

• **startedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[startedAt](IItemData.md#startedat)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L16)

___

### endedAt

• **endedAt**: `any`

#### Inherited from

[IItemData](IItemData.md).[endedAt](IItemData.md#endedat)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L17)

___

### seq

• **seq**: `any`

#### Inherited from

[IItemData](IItemData.md).[seq](IItemData.md#seq)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L18)

___

### timeDue

• **timeDue**: `Date`

#### Inherited from

[IItemData](IItemData.md).[timeDue](IItemData.md#timedue)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L19)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Inherited from

[IItemData](IItemData.md).[status](IItemData.md#status)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L20)

___

### statusDetails

• `Optional` **statusDetails**: `object`

#### Inherited from

[IItemData](IItemData.md).[statusDetails](IItemData.md#statusdetails)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L21)

___

### data

• `Optional` **data**: `any`

#### Inherited from

[IItemData](IItemData.md).[data](IItemData.md#data)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L22)

___

### messageId

• **messageId**: `any`

#### Inherited from

[IItemData](IItemData.md).[messageId](IItemData.md#messageid)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L23)

___

### signalId

• **signalId**: `any`

#### Inherited from

[IItemData](IItemData.md).[signalId](IItemData.md#signalid)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L24)

___

### vars

• **vars**: `any`

#### Inherited from

[IItemData](IItemData.md).[vars](IItemData.md#vars)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L25)

___

### output

• **output**: `any`

#### Inherited from

[IItemData](IItemData.md).[output](IItemData.md#output)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L26)

___

### assignee

• **assignee**: `any`

#### Inherited from

[IItemData](IItemData.md).[assignee](IItemData.md#assignee)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L27)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateGroups](IItemData.md#candidategroups)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L28)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[IItemData](IItemData.md).[candidateUsers](IItemData.md#candidateusers)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L29)

___

### dueDate

• **dueDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[dueDate](IItemData.md#duedate)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L30)

___

### followUpDate

• **followUpDate**: `any`

#### Inherited from

[IItemData](IItemData.md).[followUpDate](IItemData.md#followupdate)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L31)

___

### priority

• **priority**: `any`

#### Inherited from

[IItemData](IItemData.md).[priority](IItemData.md#priority)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L32)

___

### element

• **element**: [`Element`](../classes/Element.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:176](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L176)

___

### token

• **token**: [`Token`](../classes/Token.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:177](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L177)

___

### context

• **context**: [`IExecution`](IExecution.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:178](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L178)

___

### node

• **node**: [`Node`](../classes/Node.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:179](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L179)
