[bpmn-server](../readme.md) / APIModel

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

- [getUser](APIModel.md#getuser)
- [get](APIModel.md#get)
- [save](APIModel.md#save)
- [list](APIModel.md#list)
- [findEvents](APIModel.md#findevents)
- [findStartEvents](APIModel.md#findstartevents)
- [delete](APIModel.md#delete)
- [rename](APIModel.md#rename)
- [getSource](APIModel.md#getsource)
- [load](APIModel.md#load)
- [export](APIModel.md#export)

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

[API/API.ts:44](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L44)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:42](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L42)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:47](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L47)

## Methods

### getUser

▸ **getUser**(`user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `any` |

#### Returns

`any`

#### Inherited from

APIComponent.getUser

#### Defined in

[API/API.ts:50](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L50)

___

### get

▸ **get**(`query`, `user`): `Promise`\<`object`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`object`[]\>

#### Defined in

[API/API.ts:284](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L284)

___

### save

▸ **save**(`name`, `source`, `svg`, `user?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `source` | `any` |
| `svg` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[API/API.ts:295](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L295)

___

### list

▸ **list**(`query`, `user?`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[API/API.ts:303](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L303)

___

### findEvents

▸ **findEvents**(`query`, `user?`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[API/API.ts:310](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L310)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user?`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[API/API.ts:315](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L315)

___

### delete

▸ **delete**(`name`, `user?`): `Promise`\<``false`` \| `void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<``false`` \| `void`\>

#### Defined in

[API/API.ts:322](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L322)

___

### rename

▸ **rename**(`name`, `newName`, `user?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `newName` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[API/API.ts:327](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L327)

___

### getSource

▸ **getSource**(`name`, `user?`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`\>

#### Defined in

[API/API.ts:334](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L334)

___

### load

▸ **load**(`name`, `user?`): `Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IDefinition`](../interfaces/IDefinition.md)\>

#### Defined in

[API/API.ts:337](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L337)

___

### export

▸ **export**(`query`, `folder`, `user?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `folder` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[API/API.ts:340](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/API/API.ts#L340)
