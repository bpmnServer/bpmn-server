[bpmn-server](../readme.md) / IAPIModel

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

[API/API.ts:122](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L122)

___

### list

▸ **list**(`query`, `user`): `Promise`\<`string`[]\>

list all models authorized to the user

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[API/API.ts:126](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L126)

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

[API/API.ts:131](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L131)

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

[API/API.ts:136](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L136)

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

[API/API.ts:141](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L141)

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

[API/API.ts:145](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L145)

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

[API/API.ts:149](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L149)

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

[API/API.ts:153](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L153)

___

### export

▸ **export**(`query`, `folder`, `user`): `any`

Exports the specified models based on a query to a folder

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:157](https://github.com/bpmnServer/bpmn-server/blob/a424360/src/API/API.ts#L157)
