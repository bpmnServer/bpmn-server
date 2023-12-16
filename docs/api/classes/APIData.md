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

[API/API.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L22)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L20)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L25)

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

[API/API.ts:96](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L96)

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

[API/API.ts:92](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L92)

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

[API/API.ts:87](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L87)

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

[API/API.ts:83](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L83)

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

[API/API.ts:75](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L75)
