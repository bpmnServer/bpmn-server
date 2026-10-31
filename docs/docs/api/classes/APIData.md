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

- [getUser](APIData.md#getuser)
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

[API/API.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L44)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:42](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L42)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:47](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L47)

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

[API/API.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L50)

___

### getPendingUserTasks

▸ **getPendingUserTasks**(`query`, `user?`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Defined in

[API/API.ts:251](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L251)

___

### findItems

▸ **findItems**(`query`, `user?`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Defined in

[API/API.ts:259](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L259)

___

### findItem

▸ **findItem**(`query`, `user?`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Defined in

[API/API.ts:264](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L264)

___

### findInstances

▸ **findInstances**(`query`, `user?`, `options?`): `Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options?` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Defined in

[API/API.ts:270](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L270)

___

### deleteInstances

▸ **deleteInstances**(`query`, `user?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[API/API.ts:275](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/API.ts#L275)
