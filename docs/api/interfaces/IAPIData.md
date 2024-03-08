[bpmn-server](../readme.md) / IAPIData

# Interface: IAPIData

## Table of contents

### Methods

- [getPendingUserTasks](IAPIData.md#getpendingusertasks)
- [findItems](IAPIData.md#finditems)
- [findItem](IAPIData.md#finditem)
- [findInstances](IAPIData.md#findinstances)
- [deleteInstances](IAPIData.md#deleteinstances)

## Methods

### getPendingUserTasks

▸ **getPendingUserTasks**(`query`, `user`): `Promise`\<[`IItemData`](IItemData.md)[]\>

returns list of `User Tasks` that the user has access to

to get assigned tasks for a user

```ts
api.data.getPendingUserTasks({"item.assignee":user.userName});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)[]\>

#### Defined in

[API/API.ts:145](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L145)

___

### findItems

▸ **findItems**(`query`, `user?`): `Promise`\<[`IItemData`](IItemData.md)[]\>

returns list of `item`s

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)[]\>

#### Defined in

[API/API.ts:149](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L149)

___

### findItem

▸ **findItem**(`query`, `user?`): `Promise`\<[`IItemData`](IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](IItemData.md)\>

#### Defined in

[API/API.ts:150](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L150)

___

### findInstances

▸ **findInstances**(`query`, `user?`, `options?`): `Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

returns list of `instance`s

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |
| `options?` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](IInstanceData.md)[]\>

#### Defined in

[API/API.ts:154](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L154)

___

### deleteInstances

▸ **deleteInstances**(`query`, `user?`): `any`

deletes the `instance`s

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:158](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L158)
