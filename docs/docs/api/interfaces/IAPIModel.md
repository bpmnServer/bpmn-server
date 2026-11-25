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

[packages/bpmn-server/src/API/API.ts:254](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L254)

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

[packages/bpmn-server/src/API/API.ts:261](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L261)

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

[packages/bpmn-server/src/API/API.ts:265](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L265)

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

[packages/bpmn-server/src/API/API.ts:270](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L270)

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

[packages/bpmn-server/src/API/API.ts:275](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L275)

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

[packages/bpmn-server/src/API/API.ts:280](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L280)

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

[packages/bpmn-server/src/API/API.ts:284](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L284)

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

[packages/bpmn-server/src/API/API.ts:288](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L288)

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

[packages/bpmn-server/src/API/API.ts:292](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L292)

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

[packages/bpmn-server/src/API/API.ts:296](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L296)
