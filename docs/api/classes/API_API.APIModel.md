[bpmn-server](../README.md) / [Exports](../modules.md) / [API/API](../modules/API_API.md) / APIModel

# Class: APIModel

[API/API](../modules/API_API.md).APIModel

## Hierarchy

- `APIComponent`

  ↳ **`APIModel`**

## Table of contents

### Constructors

- [constructor](API_API.APIModel.md#constructor)

### Properties

- [api](API_API.APIModel.md#api)

### Accessors

- [server](API_API.APIModel.md#server)

### Methods

- [delete](API_API.APIModel.md#delete)
- [export](API_API.APIModel.md#export)
- [findEvents](API_API.APIModel.md#findevents)
- [findStartEvents](API_API.APIModel.md#findstartevents)
- [getSource](API_API.APIModel.md#getsource)
- [list](API_API.APIModel.md#list)
- [load](API_API.APIModel.md#load)
- [rename](API_API.APIModel.md#rename)
- [save](API_API.APIModel.md#save)

## Constructors

### constructor

• **new APIModel**(`api`): [`APIModel`](API_API.APIModel.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIModel`](API_API.APIModel.md)

#### Inherited from

APIComponent.constructor

#### Defined in

[src/API/API.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L24)

## Properties

### api

• **api**: [`BPMNAPI`](API_API.BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[src/API/API.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L22)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[src/API/API.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L27)

## Methods

### delete

▸ **delete**(`name`, `user`): `Promise`\<``false`` \| `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<``false`` \| `void`\>

#### Defined in

[src/API/API.ts:128](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L128)

___

### export

▸ **export**(`query`, `folder`, `user`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/API/API.ts:144](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L144)

___

### findEvents

▸ **findEvents**(`query`, `user`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[src/API/API.ts:119](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L119)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[src/API/API.ts:123](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L123)

___

### getSource

▸ **getSource**(`name`, `user`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`string`\>

#### Defined in

[src/API/API.ts:138](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L138)

___

### list

▸ **list**(`user`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[src/API/API.ts:112](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L112)

___

### load

▸ **load**(`name`, `user`): `Promise`\<[`IDefinition`](../interfaces/interfaces_elements.IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<[`IDefinition`](../interfaces/interfaces_elements.IDefinition.md)\>

#### Defined in

[src/API/API.ts:141](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L141)

___

### rename

▸ **rename**(`name`, `newName`, `user`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/API/API.ts:133](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L133)

___

### save

▸ **save**(`name`, `source`, `svg`, `user`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/API/API.ts:105](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L105)
