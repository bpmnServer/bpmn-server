[bpmn-server](../README.md) / APIData

# Class: APIData

## Hierarchy

- `APIComponent`

  ↳ **`APIData`**

## Table of contents

### Constructors

- [constructor](APIData.md#constructor)

### Properties

- [api](APIData.md#api)

### Accessors

- [server](APIData.md#server)

### Methods

- [deleteInstances](APIData.md#deleteinstances)
- [findInstances](APIData.md#findinstances)
- [findItem](APIData.md#finditem)
- [findItems](APIData.md#finditems)
- [getPendingUserTasks](APIData.md#getpendingusertasks)

## Constructors

### constructor

• **new APIData**(`api`): [`APIData`](APIData.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIData`](APIData.md)

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

### deleteInstances

▸ **deleteInstances**(`query`, `user`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[API/API.ts:128](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-128)

___

### findInstances

▸ **findInstances**(`query`, `user`, `options`): `Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Defined in

[API/API.ts:124](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-124)

___

### findItem

▸ **findItem**(`query`, `user`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Defined in

[API/API.ts:119](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-119)

___

### findItems

▸ **findItems**(`query`, `user`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Defined in

[API/API.ts:115](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-115)

___

### getPendingUserTasks

▸ **getPendingUserTasks**(`query`, `user`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Defined in

[API/API.ts:107](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-107)
