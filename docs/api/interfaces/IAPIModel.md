[bpmn-server](../readme.md) / IAPIModel

# Interface: IAPIModel

common parameters:

- query:      MongoDB query to locate the target instance or item

- user:       an instance of ISecureUser object

## Table of contents

### Methods

- [get](IAPIModel.md#get)
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

### get

▸ **get**(`query`, `user`): `Promise`\<`object`[]\>

retrieve Model data

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<`object`[]\>

#### Defined in

[API/API.ts:173](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L173)

___

### save

▸ **save**(`name`, `source`, `svg`, `user?`): `any`

save a model to the modelStore

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:180](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L180)

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

[API/API.ts:184](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L184)

___

### findEvents

▸ **findEvents**(`query`, `user?`): `any`

returns Model Events (like timers) for authorized to the user and based on specifid query

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:189](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L189)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user?`): `any`

returns Model Start Events for authorized to the user and based on specifid query

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:194](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L194)

___

### delete

▸ **delete**(`name`, `user?`): `any`

delete the specified model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:199](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L199)

___

### rename

▸ **rename**(`name`, `newName`, `user?`): `any`

delete the specified model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:203](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L203)

___

### getSource

▸ **getSource**(`name`, `user?`): `any`

returns the bpmn (xml) for the model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:207](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L207)

___

### load

▸ **load**(`name`, `user?`): `any`

load a model

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:211](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L211)

___

### export

▸ **export**(`query`, `folder`, `user?`): `any`

Exports the specified models based on a query to a folder

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user?` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:215](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L215)
