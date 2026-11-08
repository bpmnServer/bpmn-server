[bpmn-server](../readme.md) / APIModel

# Class: APIModel

Changing models: deployment and model-management tooling only (BPMNAdminAPI).

## Hierarchy

- [`APIModelReader`](APIModelReader.md)

  ↳ **`APIModel`**

## Table of contents

### Constructors

- [constructor](APIModel.md#constructor)

### Properties

- [api](APIModel.md#api)

### Accessors

- [server](APIModel.md#server)

### Methods

- [getUser](APIModel.md#getuser)
- [get](APIModel.md#get)
- [list](APIModel.md#list)
- [findEvents](APIModel.md#findevents)
- [findStartEvents](APIModel.md#findstartevents)
- [getSource](APIModel.md#getsource)
- [load](APIModel.md#load)
- [verifyModel](APIModel.md#verifymodel)
- [save](APIModel.md#save)
- [delete](APIModel.md#delete)
- [rename](APIModel.md#rename)
- [export](APIModel.md#export)

## Constructors

### constructor

• **new APIModel**(`api`): [`APIModel`](APIModel.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIModel`](APIModel.md)

#### Inherited from

[APIModelReader](APIModelReader.md).[constructor](APIModelReader.md#constructor)

#### Defined in

[packages/bpmn-server/src/API/API.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L63)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

[APIModelReader](APIModelReader.md).[api](APIModelReader.md#api)

#### Defined in

[packages/bpmn-server/src/API/API.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L61)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIModelReader.server

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

[APIModelReader](APIModelReader.md).[getUser](APIModelReader.md#getuser)

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

#### Inherited from

[APIModelReader](APIModelReader.md).[get](APIModelReader.md#get)

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

#### Inherited from

[APIModelReader](APIModelReader.md).[list](APIModelReader.md#list)

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

#### Inherited from

[APIModelReader](APIModelReader.md).[findEvents](APIModelReader.md#findevents)

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

#### Inherited from

[APIModelReader](APIModelReader.md).[findStartEvents](APIModelReader.md#findstartevents)

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

#### Inherited from

[APIModelReader](APIModelReader.md).[getSource](APIModelReader.md#getsource)

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

#### Inherited from

[APIModelReader](APIModelReader.md).[load](APIModelReader.md#load)

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

#### Inherited from

[APIModelReader](APIModelReader.md).[verifyModel](APIModelReader.md#verifymodel)

#### Defined in

[packages/bpmn-server/src/API/API.ts:373](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L373)

___

### save

▸ **save**(`name`, `source`, `svg`, `user?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:396](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L396)

___

### delete

▸ **delete**(`name`, `user?`): `Promise`\<``false`` \| `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<``false`` \| `void`\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:403](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L403)

___

### rename

▸ **rename**(`name`, `newName`, `user?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:409](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L409)

___

### export

▸ **export**(`query`, `folder`, `user?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:415](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L415)
