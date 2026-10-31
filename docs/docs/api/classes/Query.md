[bpmn-server](../readme.md) / Query

# Class: Query

## Table of contents

### Constructors

- [constructor](Query.md#constructor)

### Properties

- [\_instanceId](Query.md#_instanceid)
- [\_instanceName](Query.md#_instancename)
- [\_instanceStatus](Query.md#_instancestatus)
- [\_instanceStartedAt](Query.md#_instancestartedat)
- [\_instanceEndedAt](Query.md#_instanceendedat)
- [\_instanceSaved](Query.md#_instancesaved)
- [\_instanceData](Query.md#_instancedata)
- [\_instanceSource](Query.md#_instancesource)
- [\_instanceParentNodeId](Query.md#_instanceparentnodeid)
- [\_data](Query.md#_data)
- [\_itemId](Query.md#_itemid)
- [\_itemSeq](Query.md#_itemseq)
- [\_itemKey](Query.md#_itemkey)
- [\_itemName](Query.md#_itemname)
- [\_itemType](Query.md#_itemtype)
- [\_itemStatus](Query.md#_itemstatus)
- [\_itemStartedAt](Query.md#_itemstartedat)
- [\_itemEndedAt](Query.md#_itemendedat)
- [\_itemTokenId](Query.md#_itemtokenid)
- [\_itemElementId](Query.md#_itemelementid)

### Methods

- [instanceId](Query.md#instanceid)
- [instanceName](Query.md#instancename)
- [instanceStatus](Query.md#instancestatus)
- [data](Query.md#data)
- [itemId](Query.md#itemid)
- [itemName](Query.md#itemname)
- [itemStatus](Query.md#itemstatus)
- [itemElementId](Query.md#itemelementid)

## Constructors

### constructor

• **new Query**(`«destructured»?`): [`Query`](Query.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `{}` |
| › `instanceId?` | `any` | `null` |
| › `instanceName?` | `any` | `null` |
| › `instanceStatus?` | [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md) | `null` |
| › `instanceStartedAt?` | `any` | `null` |
| › `instanceEndedAt?` | `any` | `null` |
| › `instanceSaved?` | `any` | `null` |
| › `data?` | `any` | `null` |
| › `itemId?` | `any` | `null` |
| › `itemSeq?` | `any` | `null` |
| › `itemKey?` | `any` | `null` |
| › `itemName?` | `any` | `null` |
| › `itemType?` | [`BPMN_TYPE`](../enums/BPMN_TYPE.md) | `null` |
| › `itemStatus?` | [`ITEM_STATUS`](../enums/ITEM_STATUS.md) | `null` |
| › `itemStartedAt?` | `any` | `null` |
| › `itemEndedAt?` | `any` | `null` |
| › `itemTokenId?` | `any` | `null` |
| › `itemElementId?` | `any` | `null` |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:113](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L113)

## Properties

### \_instanceId

• `Private` **\_instanceId**: `any`

#### Defined in

[engine/Model.ts:92](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L92)

___

### \_instanceName

• `Private` **\_instanceName**: `any`

#### Defined in

[engine/Model.ts:93](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L93)

___

### \_instanceStatus

• `Private` **\_instanceStatus**: [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Defined in

[engine/Model.ts:94](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L94)

___

### \_instanceStartedAt

• `Private` **\_instanceStartedAt**: `any`

#### Defined in

[engine/Model.ts:95](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L95)

___

### \_instanceEndedAt

• `Private` **\_instanceEndedAt**: `any`

#### Defined in

[engine/Model.ts:96](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L96)

___

### \_instanceSaved

• `Private` **\_instanceSaved**: `any`

#### Defined in

[engine/Model.ts:97](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L97)

___

### \_instanceData

• `Private` **\_instanceData**: `any`

#### Defined in

[engine/Model.ts:98](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L98)

___

### \_instanceSource

• `Private` **\_instanceSource**: `any`

#### Defined in

[engine/Model.ts:99](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L99)

___

### \_instanceParentNodeId

• `Private` **\_instanceParentNodeId**: `any`

#### Defined in

[engine/Model.ts:100](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L100)

___

### \_data

• `Private` **\_data**: `any`

#### Defined in

[engine/Model.ts:101](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L101)

___

### \_itemId

• `Private` **\_itemId**: `any`

#### Defined in

[engine/Model.ts:102](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L102)

___

### \_itemSeq

• `Private` **\_itemSeq**: `any`

#### Defined in

[engine/Model.ts:103](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L103)

___

### \_itemKey

• `Private` **\_itemKey**: `any`

#### Defined in

[engine/Model.ts:104](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L104)

___

### \_itemName

• `Private` **\_itemName**: `any`

#### Defined in

[engine/Model.ts:105](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L105)

___

### \_itemType

• `Private` **\_itemType**: [`BPMN_TYPE`](../enums/BPMN_TYPE.md)

#### Defined in

[engine/Model.ts:106](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L106)

___

### \_itemStatus

• `Private` **\_itemStatus**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Defined in

[engine/Model.ts:107](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L107)

___

### \_itemStartedAt

• `Private` **\_itemStartedAt**: `any`

#### Defined in

[engine/Model.ts:108](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L108)

___

### \_itemEndedAt

• `Private` **\_itemEndedAt**: `any`

#### Defined in

[engine/Model.ts:109](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L109)

___

### \_itemTokenId

• `Private` **\_itemTokenId**: `any`

#### Defined in

[engine/Model.ts:110](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L110)

___

### \_itemElementId

• `Private` **\_itemElementId**: `any`

#### Defined in

[engine/Model.ts:111](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L111)

## Methods

### instanceId

▸ **instanceId**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:155](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L155)

___

### instanceName

▸ **instanceName**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:156](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L156)

___

### instanceStatus

▸ **instanceStatus**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md) |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:157](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L157)

___

### data

▸ **data**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:158](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L158)

___

### itemId

▸ **itemId**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:159](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L159)

___

### itemName

▸ **itemName**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:160](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L160)

___

### itemStatus

▸ **itemStatus**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | [`ITEM_STATUS`](../enums/ITEM_STATUS.md) |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:161](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L161)

___

### itemElementId

▸ **itemElementId**(`val`): [`Query`](Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](Query.md)

#### Defined in

[engine/Model.ts:162](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Model.ts#L162)
