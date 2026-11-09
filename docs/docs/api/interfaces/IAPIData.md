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

[packages/bpmn-server/src/API/API.ts:172](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L172)

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

[packages/bpmn-server/src/API/API.ts:176](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L176)

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

[packages/bpmn-server/src/API/API.ts:177](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L177)

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

[packages/bpmn-server/src/API/API.ts:181](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L181)

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

[packages/bpmn-server/src/API/API.ts:185](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L185)
