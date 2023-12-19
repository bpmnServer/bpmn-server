[bpmn-server](../README.md) / BpmnModelData

# Class: BpmnModelData

## Implements

- [`IBpmnModelData`](../interfaces/IBpmnModelData.md)

## Table of contents

### Constructors

- [constructor](BpmnModelData.md#constructor)

### Properties

- [events](BpmnModelData.md#events)
- [name](BpmnModelData.md#name)
- [processes](BpmnModelData.md#processes)
- [saved](BpmnModelData.md#saved)
- [source](BpmnModelData.md#source)
- [svg](BpmnModelData.md#svg)

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

[datastore/ModelsData.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-18)

## Properties

### events

• **events**: [`IEventData`](../interfaces/IEventData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[events](../interfaces/IBpmnModelData.md#events)

#### Defined in

[datastore/ModelsData.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-16)

___

### name

• **name**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[name](../interfaces/IBpmnModelData.md#name)

#### Defined in

[datastore/ModelsData.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-12)

___

### processes

• **processes**: [`IProcessData`](../interfaces/IProcessData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[processes](../interfaces/IBpmnModelData.md#processes)

#### Defined in

[datastore/ModelsData.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-15)

___

### saved

• **saved**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[saved](../interfaces/IBpmnModelData.md#saved)

#### Defined in

[datastore/ModelsData.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-17)

___

### source

• **source**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[source](../interfaces/IBpmnModelData.md#source)

#### Defined in

[datastore/ModelsData.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-13)

___

### svg

• **svg**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[svg](../interfaces/IBpmnModelData.md#svg)

#### Defined in

[datastore/ModelsData.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-14)

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

[datastore/ModelsData.ts:30](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/ModelsData.ts#lines-30)
