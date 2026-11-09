[bpmn-server](../readme.md) / BPMNAdminAPI

# Class: BPMNAdminAPI

Privileged API used by deployment and model-management tooling.
Runtime integrations should receive BPMNAPI so they cannot mutate models.

## Hierarchy

- [`BPMNAPI`](BPMNAPI.md)

  ↳ **`BPMNAdminAPI`**

## Table of contents

### Constructors

- [constructor](BPMNAdminAPI.md#constructor)

### Properties

- [server](BPMNAdminAPI.md#server)
- [engine](BPMNAdminAPI.md#engine)
- [data](BPMNAdminAPI.md#data)
- [model](BPMNAdminAPI.md#model)

## Constructors

### constructor

• **new BPMNAdminAPI**(`server`): [`BPMNAdminAPI`](BPMNAdminAPI.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`BPMNAdminAPI`](BPMNAdminAPI.md)

#### Overrides

[BPMNAPI](BPMNAPI.md).[constructor](BPMNAPI.md#constructor)

#### Defined in

[packages/bpmn-server/src/API/API.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L55)

## Properties

### server

• **server**: [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

[BPMNAPI](BPMNAPI.md).[server](BPMNAPI.md#server)

#### Defined in

[packages/bpmn-server/src/API/API.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L34)

___

### engine

• **engine**: [`APIEngine`](APIEngine.md)

#### Inherited from

[BPMNAPI](BPMNAPI.md).[engine](BPMNAPI.md#engine)

#### Defined in

[packages/bpmn-server/src/API/API.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L35)

___

### data

• **data**: [`APIData`](APIData.md)

#### Inherited from

[BPMNAPI](BPMNAPI.md).[data](BPMNAPI.md#data)

#### Defined in

[packages/bpmn-server/src/API/API.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L36)

___

### model

• **model**: [`APIModel`](APIModel.md)

Read-only: changing models needs BPMNAdminAPI.

#### Overrides

[BPMNAPI](BPMNAPI.md).[model](BPMNAPI.md#model)

#### Defined in

[packages/bpmn-server/src/API/API.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L53)
