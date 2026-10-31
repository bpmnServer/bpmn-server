[bpmn-server](../readme.md) / BPMNAPI

# Class: BPMNAPI

root object to api

 to create:

 api=new BPMNAPI(new BPMNServer(...));

 to use:

 api.engine  to access engine functions (start,invoke..)
 api.data    to access dataStore functions (find.. delete)
 api.model   to access Model functions (list,save,export..)

 api cli:
 >api engine start       --name 'Buy Used Car'   --data caseId 1003
 >api engine invoke      --query name 'Buy Used Car' items.status wait name 'Buy'     --data carModel 'Mazda 3'
 >api data   findItems   --query name 'Buy Used Car' items.status wait
 >api model  list

## Table of contents

### Constructors

- [constructor](BPMNAPI.md#constructor)

### Properties

- [server](BPMNAPI.md#server)
- [engine](BPMNAPI.md#engine)
- [data](BPMNAPI.md#data)
- [model](BPMNAPI.md#model)
- [defaultUser](BPMNAPI.md#defaultuser)

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

[API/API.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L34)

## Properties

### server

• **server**: [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Defined in

[API/API.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L28)

___

### engine

• **engine**: [`APIEngine`](APIEngine.md)

#### Defined in

[API/API.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L29)

___

### data

• **data**: [`APIData`](APIData.md)

#### Defined in

[API/API.ts:30](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L30)

___

### model

• **model**: [`APIModel`](APIModel.md)

#### Defined in

[API/API.ts:31](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L31)

___

### defaultUser

• **defaultUser**: [`ISecureUser`](../interfaces/ISecureUser.md)

#### Defined in

[API/API.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L32)
