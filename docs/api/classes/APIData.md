[bpmn-server](../readme.md) / APIData

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

- [getPendingUserTasks](APIData.md#getpendingusertasks)
- [findItems](APIData.md#finditems)
- [findItem](APIData.md#finditem)
- [findInstances](APIData.md#findinstances)
- [deleteInstances](APIData.md#deleteinstances)

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

[API/API.ts:24](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L24)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:22](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L22)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:27](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L27)

## Methods

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

[API/API.ts:179](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L179)

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

[API/API.ts:187](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L187)

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

[API/API.ts:191](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L191)

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

[API/API.ts:196](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L196)

___

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

[API/API.ts:200](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/API/API.ts#L200)
