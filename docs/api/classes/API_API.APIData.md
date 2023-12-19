[bpmn-server](../README.md) / [Exports](../modules.md) / [API/API](../modules/API_API.md) / APIData

# Class: APIData

[API/API](../modules/API_API.md).APIData

## Hierarchy

- `APIComponent`

  ↳ **`APIData`**

## Table of contents

### Constructors

- [constructor](API_API.APIData.md#constructor)

### Properties

- [api](API_API.APIData.md#api)

### Accessors

- [server](API_API.APIData.md#server)

### Methods

- [deleteInstances](API_API.APIData.md#deleteinstances)
- [findInstances](API_API.APIData.md#findinstances)
- [findItem](API_API.APIData.md#finditem)
- [findItems](API_API.APIData.md#finditems)
- [getPendingUserTasks](API_API.APIData.md#getpendingusertasks)

## Constructors

### constructor

• **new APIData**(`api`): [`APIData`](API_API.APIData.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIData`](API_API.APIData.md)

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

### deleteInstances

▸ **deleteInstances**(`query`, `user`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/API/API.ts:98](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L98)

___

### findInstances

▸ **findInstances**(`query`, `user`, `options`): `Promise`\<[`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |
| `options` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/interfaces_DataObjects.IInstanceData.md)[]\>

#### Defined in

[src/API/API.ts:94](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L94)

___

### findItem

▸ **findItem**(`query`, `user`): `Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)\>

#### Defined in

[src/API/API.ts:89](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L89)

___

### findItems

▸ **findItems**(`query`, `user`): `Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)[]\>

#### Defined in

[src/API/API.ts:85](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L85)

___

### getPendingUserTasks

▸ **getPendingUserTasks**(`query`, `user`): `Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/interfaces_DataObjects.IItemData.md)[]\>

#### Defined in

[src/API/API.ts:77](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L77)
