[bpmn-server](../README.md) / [Exports](../modules.md) / [engine/Model](../modules/engine_Model.md) / Query

# Class: Query

[engine/Model](../modules/engine_Model.md).Query

## Table of contents

### Constructors

- [constructor](engine_Model.Query.md#constructor)

### Properties

- [\_data](engine_Model.Query.md#_data)
- [\_instanceData](engine_Model.Query.md#_instancedata)
- [\_instanceEndedAt](engine_Model.Query.md#_instanceendedat)
- [\_instanceId](engine_Model.Query.md#_instanceid)
- [\_instanceName](engine_Model.Query.md#_instancename)
- [\_instanceParentNodeId](engine_Model.Query.md#_instanceparentnodeid)
- [\_instanceSaved](engine_Model.Query.md#_instancesaved)
- [\_instanceSource](engine_Model.Query.md#_instancesource)
- [\_instanceStartedAt](engine_Model.Query.md#_instancestartedat)
- [\_instanceStatus](engine_Model.Query.md#_instancestatus)
- [\_itemElementId](engine_Model.Query.md#_itemelementid)
- [\_itemEndedAt](engine_Model.Query.md#_itemendedat)
- [\_itemId](engine_Model.Query.md#_itemid)
- [\_itemKey](engine_Model.Query.md#_itemkey)
- [\_itemName](engine_Model.Query.md#_itemname)
- [\_itemSeq](engine_Model.Query.md#_itemseq)
- [\_itemStartedAt](engine_Model.Query.md#_itemstartedat)
- [\_itemStatus](engine_Model.Query.md#_itemstatus)
- [\_itemTokenId](engine_Model.Query.md#_itemtokenid)
- [\_itemType](engine_Model.Query.md#_itemtype)

### Methods

- [data](engine_Model.Query.md#data)
- [instanceId](engine_Model.Query.md#instanceid)
- [instanceName](engine_Model.Query.md#instancename)
- [instanceStatus](engine_Model.Query.md#instancestatus)
- [itemElementId](engine_Model.Query.md#itemelementid)
- [itemId](engine_Model.Query.md#itemid)
- [itemName](engine_Model.Query.md#itemname)
- [itemStatus](engine_Model.Query.md#itemstatus)

## Constructors

### constructor

• **new Query**(`«destructured»?`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data?` | `any` |
| › `instanceEndedAt?` | `any` |
| › `instanceId?` | `any` |
| › `instanceName?` | `any` |
| › `instanceSaved?` | `any` |
| › `instanceStartedAt?` | `any` |
| › `instanceStatus?` | [`EXECUTION_STATUS`](../enums/interfaces_Enums.EXECUTION_STATUS.md) |
| › `itemElementId?` | `any` |
| › `itemEndedAt?` | `any` |
| › `itemId?` | `any` |
| › `itemKey?` | `any` |
| › `itemName?` | `any` |
| › `itemSeq?` | `any` |
| › `itemStartedAt?` | `any` |
| › `itemStatus?` | [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md) |
| › `itemTokenId?` | `any` |
| › `itemType?` | [`BPMN_TYPE`](../enums/interfaces_Enums.BPMN_TYPE.md) |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:118](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L118)

## Properties

### \_data

• `Private` **\_data**: `any`

#### Defined in

[src/engine/Model.ts:106](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L106)

___

### \_instanceData

• `Private` **\_instanceData**: `any`

#### Defined in

[src/engine/Model.ts:103](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L103)

___

### \_instanceEndedAt

• `Private` **\_instanceEndedAt**: `any`

#### Defined in

[src/engine/Model.ts:101](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L101)

___

### \_instanceId

• `Private` **\_instanceId**: `any`

#### Defined in

[src/engine/Model.ts:97](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L97)

___

### \_instanceName

• `Private` **\_instanceName**: `any`

#### Defined in

[src/engine/Model.ts:98](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L98)

___

### \_instanceParentNodeId

• `Private` **\_instanceParentNodeId**: `any`

#### Defined in

[src/engine/Model.ts:105](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L105)

___

### \_instanceSaved

• `Private` **\_instanceSaved**: `any`

#### Defined in

[src/engine/Model.ts:102](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L102)

___

### \_instanceSource

• `Private` **\_instanceSource**: `any`

#### Defined in

[src/engine/Model.ts:104](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L104)

___

### \_instanceStartedAt

• `Private` **\_instanceStartedAt**: `any`

#### Defined in

[src/engine/Model.ts:100](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L100)

___

### \_instanceStatus

• `Private` **\_instanceStatus**: [`EXECUTION_STATUS`](../enums/interfaces_Enums.EXECUTION_STATUS.md)

#### Defined in

[src/engine/Model.ts:99](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L99)

___

### \_itemElementId

• `Private` **\_itemElementId**: `any`

#### Defined in

[src/engine/Model.ts:116](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L116)

___

### \_itemEndedAt

• `Private` **\_itemEndedAt**: `any`

#### Defined in

[src/engine/Model.ts:114](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L114)

___

### \_itemId

• `Private` **\_itemId**: `any`

#### Defined in

[src/engine/Model.ts:107](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L107)

___

### \_itemKey

• `Private` **\_itemKey**: `any`

#### Defined in

[src/engine/Model.ts:109](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L109)

___

### \_itemName

• `Private` **\_itemName**: `any`

#### Defined in

[src/engine/Model.ts:110](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L110)

___

### \_itemSeq

• `Private` **\_itemSeq**: `any`

#### Defined in

[src/engine/Model.ts:108](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L108)

___

### \_itemStartedAt

• `Private` **\_itemStartedAt**: `any`

#### Defined in

[src/engine/Model.ts:113](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L113)

___

### \_itemStatus

• `Private` **\_itemStatus**: [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md)

#### Defined in

[src/engine/Model.ts:112](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L112)

___

### \_itemTokenId

• `Private` **\_itemTokenId**: `any`

#### Defined in

[src/engine/Model.ts:115](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L115)

___

### \_itemType

• `Private` **\_itemType**: [`BPMN_TYPE`](../enums/interfaces_Enums.BPMN_TYPE.md)

#### Defined in

[src/engine/Model.ts:111](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L111)

## Methods

### data

▸ **data**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:163](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L163)

___

### instanceId

▸ **instanceId**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:160](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L160)

___

### instanceName

▸ **instanceName**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:161](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L161)

___

### instanceStatus

▸ **instanceStatus**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | [`EXECUTION_STATUS`](../enums/interfaces_Enums.EXECUTION_STATUS.md) |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:162](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L162)

___

### itemElementId

▸ **itemElementId**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:167](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L167)

___

### itemId

▸ **itemId**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:164](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L164)

___

### itemName

▸ **itemName**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:165](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L165)

___

### itemStatus

▸ **itemStatus**(`val`): [`Query`](engine_Model.Query.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md) |

#### Returns

[`Query`](engine_Model.Query.md)

#### Defined in

[src/engine/Model.ts:166](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Model.ts#L166)
