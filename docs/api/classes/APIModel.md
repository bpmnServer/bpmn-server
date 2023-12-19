[bpmn-server](../README.md) / APIModel

# Class: APIModel

## Hierarchy

- `APIComponent`

  ↳ **`APIModel`**

## Table of contents

### Constructors

- [constructor](APIModel.md#constructor)

### Properties

- [api](APIModel.md#api)

### Accessors

- [server](APIModel.md#server)

### Methods

- [delete](APIModel.md#delete)
- [export](APIModel.md#export)
- [findEvents](APIModel.md#findevents)
- [findStartEvents](APIModel.md#findstartevents)
- [getSource](APIModel.md#getsource)
- [list](APIModel.md#list)
- [load](APIModel.md#load)
- [rename](APIModel.md#rename)
- [save](APIModel.md#save)

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

APIComponent.constructor

#### Defined in

[API/API.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-24)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-22)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-27)

## Methods

### delete

▸ **delete**(`name`, `user`): `Promise`\<``false`` \| `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<``false`` \| `void`\>

#### Defined in

[API/API.ts:158](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-158)

___

### export

▸ **export**(`query`, `folder`, `user`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[API/API.ts:174](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-174)

___

### findEvents

▸ **findEvents**(`query`, `user`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[API/API.ts:149](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-149)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[API/API.ts:153](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-153)

___

### getSource

▸ **getSource**(`name`, `user`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`\>

#### Defined in

[API/API.ts:168](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-168)

___

### list

▸ **list**(`user`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[API/API.ts:142](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-142)

___

### load

▸ **load**(`name`, `user`): `Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Defined in

[API/API.ts:171](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-171)

___

### rename

▸ **rename**(`name`, `newName`, `user`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[API/API.ts:163](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-163)

___

### save

▸ **save**(`name`, `source`, `svg`, `user`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[API/API.ts:135](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-135)
