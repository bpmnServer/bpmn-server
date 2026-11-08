[bpmn-server](../readme.md) / BPMNAPI

# Class: BPMNAPI

root object to api

 to create:

 api=new BPMNAPI(new BPMNServer(...));

 to use:

 api.engine  to access engine functions (start,invoke..)
 api.data    to access dataStore functions (find.. delete)
 api.model   to read models (list, start events, source, verify)

 Changing models (save, delete, rename) is available only through BPMNAdminAPI.

 api cli:
 >api engine start       --name 'Buy Used Car'   --data caseId 1003
 >api engine invoke      --query name 'Buy Used Car' items.status wait name 'Buy'     --data carModel 'Mazda 3'
 >api data   findItems   --query name 'Buy Used Car' items.status wait

## Hierarchy

- **`BPMNAPI`**

  ↳ [`BPMNAdminAPI`](BPMNAdminAPI.md)

## Table of contents

### Constructors

- [constructor](BPMNAPI.md#constructor)

### Properties

- [server](BPMNAPI.md#server)
- [engine](BPMNAPI.md#engine)
- [data](BPMNAPI.md#data)
- [model](BPMNAPI.md#model)

## Constructors

### constructor

• **new BPMNAPI**(`server`): [`BPMNAPI`](BPMNAPI.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`BPMNAPI`](BPMNAPI.md)

#### Defined in

[packages/bpmn-server/src/API/API.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L40)

## Properties

### server

• **server**: [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Defined in

[packages/bpmn-server/src/API/API.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L34)

___

### engine

• **engine**: [`APIEngine`](APIEngine.md)

#### Defined in

[packages/bpmn-server/src/API/API.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L35)

___

### data

• **data**: [`APIData`](APIData.md)

#### Defined in

[packages/bpmn-server/src/API/API.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L36)

___

### model

• **model**: [`APIModelReader`](APIModelReader.md)

Read-only: changing models needs BPMNAdminAPI.

#### Defined in

[packages/bpmn-server/src/API/API.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L38)
