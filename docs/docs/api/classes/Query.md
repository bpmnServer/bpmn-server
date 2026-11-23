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

[packages/bpmn-server/src/engine/Model.ts:105](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L105)

## Properties

### \_instanceId

• `Private` **\_instanceId**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:84](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L84)

___

### \_instanceName

• `Private` **\_instanceName**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:85](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L85)

___

### \_instanceStatus

• `Private` **\_instanceStatus**: [`EXECUTION_STATUS`](../enums/EXECUTION_STATUS.md)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L86)

___

### \_instanceStartedAt

• `Private` **\_instanceStartedAt**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:87](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L87)

___

### \_instanceEndedAt

• `Private` **\_instanceEndedAt**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:88](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L88)

___

### \_instanceSaved

• `Private` **\_instanceSaved**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:89](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L89)

___

### \_instanceData

• `Private` **\_instanceData**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:90](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L90)

___

### \_instanceSource

• `Private` **\_instanceSource**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:91](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L91)

___

### \_instanceParentNodeId

• `Private` **\_instanceParentNodeId**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:92](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L92)

___

### \_data

• `Private` **\_data**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:93](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L93)

___

### \_itemId

• `Private` **\_itemId**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L94)

___

### \_itemSeq

• `Private` **\_itemSeq**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:95](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L95)

___

### \_itemKey

• `Private` **\_itemKey**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:96](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L96)

___

### \_itemName

• `Private` **\_itemName**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:97](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L97)

___

### \_itemType

• `Private` **\_itemType**: [`BPMN_TYPE`](../enums/BPMN_TYPE.md)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:98](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L98)

___

### \_itemStatus

• `Private` **\_itemStatus**: [`ITEM_STATUS`](../enums/ITEM_STATUS.md)

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:99](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L99)

___

### \_itemStartedAt

• `Private` **\_itemStartedAt**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:100](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L100)

___

### \_itemEndedAt

• `Private` **\_itemEndedAt**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:101](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L101)

___

### \_itemTokenId

• `Private` **\_itemTokenId**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:102](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L102)

___

### \_itemElementId

• `Private` **\_itemElementId**: `any`

#### Defined in

[packages/bpmn-server/src/engine/Model.ts:103](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L103)

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

[packages/bpmn-server/src/engine/Model.ts:147](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L147)

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

[packages/bpmn-server/src/engine/Model.ts:148](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L148)

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

[packages/bpmn-server/src/engine/Model.ts:149](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L149)

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

[packages/bpmn-server/src/engine/Model.ts:150](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L150)

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

[packages/bpmn-server/src/engine/Model.ts:151](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L151)

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

[packages/bpmn-server/src/engine/Model.ts:152](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L152)

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

[packages/bpmn-server/src/engine/Model.ts:153](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L153)

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

[packages/bpmn-server/src/engine/Model.ts:154](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Model.ts#L154)
