[bpmn-server](../readme.md) / ItemObject

# Class: ItemObject

as stroed in MongoDB

## Implements

- [`IItemData`](../interfaces/IItemData.md)

## Table of contents

### Constructors

- [constructor](ItemObject.md#constructor)

### Properties

- [id](ItemObject.md#id)
- [seq](ItemObject.md#seq)
- [itemKey](ItemObject.md#itemkey)
- [name](ItemObject.md#name)
- [type](ItemObject.md#type)
- [status](ItemObject.md#status)
- [userName](ItemObject.md#username)
- [startedAt](ItemObject.md#startedat)
- [endedAt](ItemObject.md#endedat)
- [tokenId](ItemObject.md#tokenid)
- [elementId](ItemObject.md#elementid)
- [instanceId](ItemObject.md#instanceid)
- [processName](ItemObject.md#processname)
- [timeDue](ItemObject.md#timedue)
- [data](ItemObject.md#data)
- [vars](ItemObject.md#vars)
- [output](ItemObject.md#output)
- [messageId](ItemObject.md#messageid)
- [signalId](ItemObject.md#signalid)
- [assignee](ItemObject.md#assignee)
- [candidateGroups](ItemObject.md#candidategroups)
- [candidateUsers](ItemObject.md#candidateusers)
- [dueDate](ItemObject.md#duedate)
- [followUpDate](ItemObject.md#followupdate)
- [priority](ItemObject.md#priority)

## Constructors

### constructor

• **new ItemObject**(): [`ItemObject`](ItemObject.md)

#### Returns

[`ItemObject`](ItemObject.md)

## Properties

### id

• **id**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[id](../interfaces/IItemData.md#id)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L32)

___

### seq

• **seq**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[seq](../interfaces/IItemData.md#seq)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L33)

___

### itemKey

• **itemKey**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[itemKey](../interfaces/IItemData.md#itemkey)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L34)

___

### name

• **name**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[name](../interfaces/IItemData.md#name)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L35)

___

### type

• **type**: [`BPMN_TYPE`](../enums/BPMN_TYPE.md)

#### Implementation of

[IItemData](../interfaces/IItemData.md).[type](../interfaces/IItemData.md#type)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L36)

___

### status

• **status**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Implementation of

[IItemData](../interfaces/IItemData.md).[status](../interfaces/IItemData.md#status)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L37)

___

### userName

• **userName**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[userName](../interfaces/IItemData.md#username)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L38)

___

### startedAt

• **startedAt**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[startedAt](../interfaces/IItemData.md#startedat)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L39)

___

### endedAt

• **endedAt**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[endedAt](../interfaces/IItemData.md#endedat)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L40)

___

### tokenId

• **tokenId**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[tokenId](../interfaces/IItemData.md#tokenid)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L42)

___

### elementId

• **elementId**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[elementId](../interfaces/IItemData.md#elementid)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L43)

___

### instanceId

• **instanceId**: `any`

retrieved from findObjects

#### Implementation of

[IItemData](../interfaces/IItemData.md).[instanceId](../interfaces/IItemData.md#instanceid)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:47](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L47)

___

### processName

• **processName**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[processName](../interfaces/IItemData.md#processname)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:48](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L48)

___

### timeDue

• **timeDue**: `Date`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[timeDue](../interfaces/IItemData.md#timedue)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:49](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L49)

___

### data

• **data**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[data](../interfaces/IItemData.md#data)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L50)

___

### vars

• **vars**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[vars](../interfaces/IItemData.md#vars)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L51)

___

### output

• **output**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[output](../interfaces/IItemData.md#output)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:52](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L52)

___

### messageId

• **messageId**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[messageId](../interfaces/IItemData.md#messageid)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L53)

___

### signalId

• **signalId**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[signalId](../interfaces/IItemData.md#signalid)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L54)

___

### assignee

• **assignee**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[assignee](../interfaces/IItemData.md#assignee)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L55)

___

### candidateGroups

• **candidateGroups**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[candidateGroups](../interfaces/IItemData.md#candidategroups)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L56)

___

### candidateUsers

• **candidateUsers**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[candidateUsers](../interfaces/IItemData.md#candidateusers)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L57)

___

### dueDate

• **dueDate**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[dueDate](../interfaces/IItemData.md#duedate)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L58)

___

### followUpDate

• **followUpDate**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[followUpDate](../interfaces/IItemData.md#followupdate)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L59)

___

### priority

• **priority**: `any`

#### Implementation of

[IItemData](../interfaces/IItemData.md).[priority](../interfaces/IItemData.md#priority)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Model.ts#L60)
