[bpmn-server](../README.md) / IAPIModel

# Interface: IAPIModel

## Table of contents

### Methods

- [delete](IAPIModel.md#delete)
- [export](IAPIModel.md#export)
- [findEvents](IAPIModel.md#findevents)
- [findStartEvents](IAPIModel.md#findstartevents)
- [getSource](IAPIModel.md#getsource)
- [list](IAPIModel.md#list)
- [load](IAPIModel.md#load)
- [rename](IAPIModel.md#rename)
- [save](IAPIModel.md#save)

## Methods

### delete

▸ **delete**(`name`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:72](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-72)

___

### export

▸ **export**(`query`, `folder`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:76](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-76)

___

### findEvents

▸ **findEvents**(`query`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:70](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-70)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:71](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-71)

___

### getSource

▸ **getSource**(`name`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:74](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-74)

___

### list

▸ **list**(`user`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[API/API.ts:69](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-69)

___

### load

▸ **load**(`name`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:75](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-75)

___

### rename

▸ **rename**(`name`, `newName`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user` | [`ISecureUser`](ISecureUser.md) |

#### Returns

`any`

#### Defined in

[API/API.ts:73](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-73)

___

### save

▸ **save**(`name`, `source`, `svg`, `user`): `any`

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

[API/API.ts:68](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/API.ts#lines-68)
