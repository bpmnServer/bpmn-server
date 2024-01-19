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

[API/API.ts:24](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L24)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:22](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L22)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:27](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L27)

## Methods

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

[API/API.ts:207](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L207)

___

### list

▸ **list**(`query`, `user`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[API/API.ts:214](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L214)

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

[API/API.ts:220](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L220)

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

[API/API.ts:224](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L224)

___

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

[API/API.ts:229](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L229)

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

[API/API.ts:234](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L234)

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

[API/API.ts:239](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L239)

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

[API/API.ts:242](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L242)

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

[API/API.ts:245](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/API/API.ts#L245)