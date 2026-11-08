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
- [historyTimeToLive](BpmnModelData.md#historytimetolive)
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

[packages/bpmn-server/src/datastore/ModelsData.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L14)

## Properties

### name

• **name**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[name](../interfaces/IBpmnModelData.md#name)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsData.ts:7](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L7)

___

### source

• **source**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[source](../interfaces/IBpmnModelData.md#source)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsData.ts:8](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L8)

___

### svg

• **svg**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[svg](../interfaces/IBpmnModelData.md#svg)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsData.ts:9](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L9)

___

### processes

• **processes**: [`IProcessData`](../interfaces/IProcessData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[processes](../interfaces/IBpmnModelData.md#processes)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsData.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L10)

___

### events

• **events**: [`IEventData`](../interfaces/IEventData.md)[]

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[events](../interfaces/IBpmnModelData.md#events)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsData.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L11)

___

### historyTimeToLive

• **historyTimeToLive**: `any`

#### Defined in

[packages/bpmn-server/src/datastore/ModelsData.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L12)

___

### saved

• **saved**: `any`

#### Implementation of

[IBpmnModelData](../interfaces/IBpmnModelData.md).[saved](../interfaces/IBpmnModelData.md#saved)

#### Defined in

[packages/bpmn-server/src/datastore/ModelsData.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L13)

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

[packages/bpmn-server/src/datastore/ModelsData.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/ModelsData.ts#L26)
