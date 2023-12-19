[bpmn-server](../README.md) / IAPIData

# Interface: IAPIData

## Table of contents

### Methods

- [deleteInstances](IAPIData.md#deleteinstances)
- [findInstances](IAPIData.md#findinstances)
- [findItem](IAPIData.md#finditem)
- [findItems](IAPIData.md#finditems)
- [getPendingUserTasks](IAPIData.md#getpendingusertasks)

## Methods

### deleteInstances

▸ **deleteInstances**(`query`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:64](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-64)

___

### findInstances

▸ **findInstances**(`query`, `user`, `options`): `Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |
| `options` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

#### Defined in

[API/API.ts:63](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-63)

___

### findItem

▸ **findItem**(`query`, `user`): `Promise`\<[`IItemData`](IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)\>

#### Defined in

[API/API.ts:62](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-62)

___

### findItems

▸ **findItems**(`query`, `user`): `Promise`\<[`IItemData`](IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)[]\>

#### Defined in

[API/API.ts:61](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-61)

___

### getPendingUserTasks

▸ **getPendingUserTasks**(`query`, `user`): `Promise`\<[`IItemData`](IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)[]\>

#### Defined in

[API/API.ts:60](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-60)
