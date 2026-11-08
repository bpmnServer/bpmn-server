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

[packages/bpmn-server/src/API/API.ts:200](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L200)

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

[packages/bpmn-server/src/API/API.ts:207](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L207)

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

[packages/bpmn-server/src/API/API.ts:211](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L211)

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

[packages/bpmn-server/src/API/API.ts:216](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L216)

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

[packages/bpmn-server/src/API/API.ts:221](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L221)

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

[packages/bpmn-server/src/API/API.ts:226](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L226)

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

[packages/bpmn-server/src/API/API.ts:230](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L230)

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

[packages/bpmn-server/src/API/API.ts:234](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L234)

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

[packages/bpmn-server/src/API/API.ts:238](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L238)

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

[packages/bpmn-server/src/API/API.ts:242](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/API.ts#L242)
