[bpmn-server](../readme.md) / BpmnModelData

# Class: BpmnModelData

## Implements

- [`IBpmnModelData`](../interfaces/IBpmnModelData.md)

## Table of contents

### Constructors

- [constructor](BpmnModelData.md#constructor)

### Properties

- [name](BpmnModelData.md#name)
- [source](BpmnModelData.md#source)
- [svg](BpmnModelData.md#svg)
- [processes](BpmnModelData.md#processes)
- [events](BpmnModelData.md#events)
- [saved](BpmnModelData.md#saved)

### Methods

- [parse](BpmnModelData.md#parse)

## Constructors

### constructor

• **new BpmnModelData**(`name`, `source`, `svg`, `processes`, `events`): [`BpmnModelData`](BpmnModelData.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `processes` | `any` |
| `events` | `any` |

#### Returns

[`BpmnModelData`](BpmnModelData.md)

#### Defined in

[datastore/ModelsData.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L18)

## Properties

### name

• **name**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[name](../interfaces/IBpmnModelData.md#name)

#### Defined in

[datastore/ModelsData.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L12)

___

### source

• **source**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[source](../interfaces/IBpmnModelData.md#source)

#### Defined in

[datastore/ModelsData.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L13)

___

### svg

• **svg**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[svg](../interfaces/IBpmnModelData.md#svg)

#### Defined in

[datastore/ModelsData.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L14)

___

### processes

• **processes**: [`IProcessData`](../interfaces/IProcessData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[processes](../interfaces/IBpmnModelData.md#processes)

#### Defined in

[datastore/ModelsData.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L15)

___

### events

• **events**: [`IEventData`](../interfaces/IEventData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[events](../interfaces/IBpmnModelData.md#events)

#### Defined in

[datastore/ModelsData.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L16)

___

### saved

• **saved**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[saved](../interfaces/IBpmnModelData.md#saved)

#### Defined in

[datastore/ModelsData.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L17)

## Methods

### parse

▸ **parse**(`definition`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`Definition`](Definition.md) |

#### Returns

`void`

#### Defined in

[datastore/ModelsData.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/ModelsData.ts#L30)
