[bpmn-server](../README.md) / [Exports](../modules.md) / [datastore/ModelsData](../modules/datastore_ModelsData.md) / BpmnModelData

# Class: BpmnModelData

[datastore/ModelsData](../modules/datastore_ModelsData.md).BpmnModelData

## Implements

- [`IBpmnModelData`](../interfaces/interfaces_DataObjects.IBpmnModelData.md)

## Table of contents

### Constructors

- [constructor](datastore_ModelsData.BpmnModelData.md#constructor)

### Properties

- [events](datastore_ModelsData.BpmnModelData.md#events)
- [name](datastore_ModelsData.BpmnModelData.md#name)
- [processes](datastore_ModelsData.BpmnModelData.md#processes)
- [saved](datastore_ModelsData.BpmnModelData.md#saved)
- [source](datastore_ModelsData.BpmnModelData.md#source)
- [svg](datastore_ModelsData.BpmnModelData.md#svg)

### Methods

- [parse](datastore_ModelsData.BpmnModelData.md#parse)

## Constructors

### constructor

• **new BpmnModelData**(`name`, `source`, `svg`, `processes`, `events`): [`BpmnModelData`](datastore_ModelsData.BpmnModelData.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `processes` | `any` |
| `events` | `any` |

#### Returns

[`BpmnModelData`](datastore_ModelsData.BpmnModelData.md)

#### Defined in

[src/datastore/ModelsData.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L18)

## Properties

### events

• **events**: [`IEventData`](../interfaces/interfaces_DataObjects.IEventData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/interfaces_DataObjects.IBpmnModelData.md).[events](../interfaces/interfaces_DataObjects.IBpmnModelData.md#events)

#### Defined in

[src/datastore/ModelsData.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L16)

___

### name

• **name**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/interfaces_DataObjects.IBpmnModelData.md).[name](../interfaces/interfaces_DataObjects.IBpmnModelData.md#name)

#### Defined in

[src/datastore/ModelsData.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L12)

___

### processes

• **processes**: [`IProcessData`](../interfaces/interfaces_DataObjects.IProcessData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/interfaces_DataObjects.IBpmnModelData.md).[processes](../interfaces/interfaces_DataObjects.IBpmnModelData.md#processes)

#### Defined in

[src/datastore/ModelsData.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L15)

___

### saved

• **saved**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/interfaces_DataObjects.IBpmnModelData.md).[saved](../interfaces/interfaces_DataObjects.IBpmnModelData.md#saved)

#### Defined in

[src/datastore/ModelsData.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L17)

___

### source

• **source**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/interfaces_DataObjects.IBpmnModelData.md).[source](../interfaces/interfaces_DataObjects.IBpmnModelData.md#source)

#### Defined in

[src/datastore/ModelsData.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L13)

___

### svg

• **svg**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/interfaces_DataObjects.IBpmnModelData.md).[svg](../interfaces/interfaces_DataObjects.IBpmnModelData.md#svg)

#### Defined in

[src/datastore/ModelsData.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L14)

## Methods

### parse

▸ **parse**(`definition`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`Definition`](elements_Definition.Definition.md) |

#### Returns

`void`

#### Defined in

[src/datastore/ModelsData.ts:30](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/ModelsData.ts#L30)
