[bpmn-server](../API.md) / IAPIModel

# Interface: IAPIModel

common parameters:

- query:      MongoDB query to locate the target instance or item

- user:       an instance of ISecureUser object

## Table of contents

### Methods

- [save](IAPIModel.md#save)
- [list](IAPIModel.md#list)
- [findEvents](IAPIModel.md#findevents)
- [findStartEvents](IAPIModel.md#findstartevents)
- [delete](IAPIModel.md#delete)
- [rename](IAPIModel.md#rename)
- [getSource](IAPIModel.md#getsource)
- [load](IAPIModel.md#load)
- [export](IAPIModel.md#export)

## Methods

### save

▸ **save**(`name`, `source`, `svg`, `user`): `any`

save a model to the modelStore

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:113](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L113)

___

### list

▸ **list**(`user`): `Promise`\<`string`[]\>

list all models authorized to the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[API/API.ts:117](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L117)

___

### findEvents

▸ **findEvents**(`query`, `user`): `any`

returns Model Events (like timers) for authorized to the user and based on specifid query

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:122](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L122)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user`): `any`

returns Model Start Events for authorized to the user and based on specifid query

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:127](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L127)

___

### delete

▸ **delete**(`name`, `user`): `any`

delete the specified model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:132](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L132)

___

### rename

▸ **rename**(`name`, `newName`, `user`): `any`

delete the specified model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:136](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L136)

___

### getSource

▸ **getSource**(`name`, `user`): `any`

returns the bpmn (xml) for the model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:140](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L140)

___

### load

▸ **load**(`name`, `user`): `any`

load a model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:144](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L144)

___

### export

▸ **export**(`query`, `folder`, `user`): `any`

export the specified models based on a query to a folder

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:148](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/API/API.ts#L148)
