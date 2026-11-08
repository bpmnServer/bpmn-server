[bpmn-server](../readme.md) / IItemData

# Interface: IItemData

## Hierarchy

- **`IItemData`**

  ↳ [`IItem`](IItem.md)

## Implemented by

- [`ItemObject`](../classes/ItemObject.md)

## Table of contents

### Properties

- [timerCount](IItemData.md#timercount)
- [timerRepeat](IItemData.md#timerrepeat)
- [id](IItemData.md#id)
- [itemKey](IItemData.md#itemkey)
- [elementId](IItemData.md#elementid)
- [name](IItemData.md#name)
- [type](IItemData.md#type)
- [instanceId](IItemData.md#instanceid)
- [processName](IItemData.md#processname)
- [tokenId](IItemData.md#tokenid)
- [userName](IItemData.md#username)
- [startedAt](IItemData.md#startedat)
- [endedAt](IItemData.md#endedat)
- [seq](IItemData.md#seq)
- [timeDue](IItemData.md#timedue)
- [status](IItemData.md#status)
- [statusDetails](IItemData.md#statusdetails)
- [data](IItemData.md#data)
- [messageId](IItemData.md#messageid)
- [signalId](IItemData.md#signalid)
- [vars](IItemData.md#vars)
- [output](IItemData.md#output)
- [assignee](IItemData.md#assignee)
- [candidateGroups](IItemData.md#candidategroups)
- [candidateUsers](IItemData.md#candidateusers)
- [dueDate](IItemData.md#duedate)
- [followUpDate](IItemData.md#followupdate)
- [priority](IItemData.md#priority)

## Properties

### timerCount

• `Optional` **timerCount**: `number`

a repeating timer: which firing this is, from 0, and how many there are to be

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:5](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L5)

___

### timerRepeat

• `Optional` **timerRepeat**: `string` \| `number`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:6](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L6)

___

### id

• **id**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:7](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L7)

___

### itemKey

• **itemKey**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:8](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L8)

___

### elementId

• **elementId**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:9](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L9)

___

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L10)

___

### type

• **type**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L11)

___

### instanceId

• **instanceId**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L12)

___

### processName

• `Optional` **processName**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L13)

___

### tokenId

• **tokenId**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L14)

___

### userName

• **userName**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L15)

___

### startedAt

• **startedAt**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L16)

___

### endedAt

• **endedAt**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L17)

___

### seq

• **seq**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L18)

___

### timeDue

• **timeDue**: `Date`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L19)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L20)

___

### statusDetails

• `Optional` **statusDetails**: `object`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L21)

___

### data

• `Optional` **data**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L22)

___

### messageId

• **messageId**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L23)

___

### signalId

• **signalId**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L24)

___

### vars

• **vars**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L25)

___

### output

• **output**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L26)

___

### assignee

• **assignee**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L27)

___

### candidateGroups

• **candidateGroups**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L28)

___

### candidateUsers

• **candidateUsers**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L29)

___

### dueDate

• **dueDate**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L30)

___

### followUpDate

• **followUpDate**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L31)

___

### priority

• **priority**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/DataObjects.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/DataObjects.ts#L32)
