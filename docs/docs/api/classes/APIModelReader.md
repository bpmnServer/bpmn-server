[bpmn-server](../readme.md) / APIModelReader

# Class: APIModelReader

Reading models: what runtime clients need to offer and run processes (the processes a user may
start, documentation, task forms, diagrams). Scoped to the principal's tenant (modelsOwner).

## Hierarchy

- `APIComponent`

  ↳ **`APIModelReader`**

  ↳↳ [`APIModel`](APIModel.md)

## Table of contents

### Constructors

- [constructor](APIModelReader.md#constructor)

### Properties

- [api](APIModelReader.md#api)

### Accessors

- [server](APIModelReader.md#server)

### Methods

- [getUser](APIModelReader.md#getuser)
- [get](APIModelReader.md#get)
- [list](APIModelReader.md#list)
- [findEvents](APIModelReader.md#findevents)
- [findStartEvents](APIModelReader.md#findstartevents)
- [getSource](APIModelReader.md#getsource)
- [load](APIModelReader.md#load)
- [verifyModel](APIModelReader.md#verifymodel)

## Constructors

### constructor

• **new APIModelReader**(`api`): [`APIModelReader`](APIModelReader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIModelReader`](APIModelReader.md)

#### Inherited from

APIComponent.constructor

#### Defined in

[packages/bpmn-server/src/API/API.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L63)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[packages/bpmn-server/src/API/API.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L61)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[packages/bpmn-server/src/API/API.ts:66](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L66)

## Methods

### getUser

▸ **getUser**(`user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `any` |

#### Returns

`any`

#### Inherited from

APIComponent.getUser

#### Defined in

[packages/bpmn-server/src/API/API.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L69)

___

### get

▸ **get**(`query`, `user`): `Promise`\<`object`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`object`[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:335](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L335)

___

### list

▸ **list**(`query`, `user?`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:342](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L342)

___

### findEvents

▸ **findEvents**(`query`, `user?`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:349](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L349)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user?`): `Promise`\<`any`[]\>

Start events the principal may use: candidate starter users/groups apply.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:354](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L354)

___

### getSource

▸ **getSource**(`name`, `user?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:361](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L361)

___

### load

▸ **load**(`name`, `user?`): `Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:365](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L365)

___

### verifyModel

▸ **verifyModel**(`nameOrSource`, `user?`): `Promise`\<[`IModelVerification`](../interfaces/IModelVerification.md)\>

Checks a model for errors and likely mistakes without running it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameOrSource` | `string` | a saved model's name, or BPMN XML |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) | - |

#### Returns

`Promise`\<[`IModelVerification`](../interfaces/IModelVerification.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:373](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L373)
