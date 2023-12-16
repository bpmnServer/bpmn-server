[bpmn-server](../README.md) / APIModel

# Class: APIModel

## Hierarchy

- `APIComponent`

  ↳ **`APIModel`**

## Table of contents

### Constructors

- [constructor](APIModel.md#constructor)

### Properties

- [api](APIModel.md#api)

### Accessors

- [server](APIModel.md#server)

### Methods

- [delete](APIModel.md#delete)
- [export](APIModel.md#export)
- [findEvents](APIModel.md#findevents)
- [findStartEvents](APIModel.md#findstartevents)
- [getSource](APIModel.md#getsource)
- [list](APIModel.md#list)
- [load](APIModel.md#load)
- [rename](APIModel.md#rename)
- [save](APIModel.md#save)

## Constructors

### constructor

• **new APIModel**(`api`): [`APIModel`](APIModel.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIModel`](APIModel.md)

#### Inherited from

APIComponent.constructor

#### Defined in

[API/API.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L22)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L20)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L25)

## Methods

### delete

▸ **delete**(`name`, `user`): `Promise`\<``false`` \| `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<``false`` \| `void`\>

#### Defined in

[API/API.ts:126](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L126)

___

### export

▸ **export**(`query`, `folder`, `user`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[API/API.ts:142](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L142)

___

### findEvents

▸ **findEvents**(`query`, `user`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[API/API.ts:117](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L117)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[API/API.ts:121](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L121)

___

### getSource

▸ **getSource**(`name`, `user`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`\>

#### Defined in

[API/API.ts:136](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L136)

___

### list

▸ **list**(`user`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[API/API.ts:110](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L110)

___

### load

▸ **load**(`name`, `user`): `Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Defined in

[API/API.ts:139](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L139)

___

### rename

▸ **rename**(`name`, `newName`, `user`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[API/API.ts:131](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L131)

___

### save

▸ **save**(`name`, `source`, `svg`, `user`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[API/API.ts:103](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L103)
