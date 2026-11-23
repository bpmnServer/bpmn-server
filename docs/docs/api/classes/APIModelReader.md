[bpmn-server](../readme.md) / APIModelReader

# Class: APIModelReader

Reading models: what runtime clients need to offer and run processes (the processes a user may
start, documentation, task forms, diagrams). Scoped to the principal's tenant (modelsOwner).

## Hierarchy

- `APIComponent`

  ↳ **`APIModelReader`**

  ↳↳ [`APIModel`](APIModel.md)

## Table of contents

### Constructors

- [constructor](APIModelReader.md#constructor)

### Properties

- [api](APIModelReader.md#api)

### Accessors

- [server](APIModelReader.md#server)
- [filters](APIModelReader.md#filters)

### Methods

- [getUser](APIModelReader.md#getuser)
- [qualify](APIModelReader.md#qualify)
- [can](APIModelReader.md#can)
- [targets](APIModelReader.md#targets)
- [get](APIModelReader.md#get)
- [list](APIModelReader.md#list)
- [findEvents](APIModelReader.md#findevents)
- [findStartEvents](APIModelReader.md#findstartevents)
- [getSource](APIModelReader.md#getsource)
- [load](APIModelReader.md#load)
- [verifyModel](APIModelReader.md#verifymodel)

## Constructors

### constructor

• **new APIModelReader**(`api`): [`APIModelReader`](APIModelReader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIModelReader`](APIModelReader.md)

#### Inherited from

APIComponent.constructor

#### Defined in

[packages/bpmn-server/src/API/API.ts:65](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L65)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[packages/bpmn-server/src/API/API.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L63)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[packages/bpmn-server/src/API/API.ts:68](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L68)

___

### filters

• `get` **filters**(): [`IQueryFilter`](../interfaces/IQueryFilter.md)[]

What the add-ons narrow a user's queries by (the Assignment add-on: the tasks offered to them). A server that says
nothing of add-ons (no registrations, no configuration's addOns): undefined, so the user's own narrowing applies,
as before; nothing is opened by not knowing.

#### Returns

[`IQueryFilter`](../interfaces/IQueryFilter.md)[]

#### Inherited from

APIComponent.filters

#### Defined in

[packages/bpmn-server/src/API/API.ts:76](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L76)

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

[packages/bpmn-server/src/API/API.ts:80](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L80)

___

### qualify

▸ **qualify**(`kind`, `user`, `query`): `Promise`\<`any`\>

A query narrowed to what this user may see (docs/design/context-object.md): their tenant's (SecureUser), then
`pre-query`, its listeners' conditions all holding. No listener (the policies' add-ons off, a server from before
add-ons): the user's own built-in narrowing, the tasks offered to them. Not narrowed for an administrator.

#### Parameters

| Name | Type |
| :------ | :------ |
| `kind` | ``"items"`` \| ``"instances"`` \| ``"startEvents"`` \| ``"deleteInstances"`` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `query` | `any` |

#### Returns

`Promise`\<`any`\>

#### Inherited from

APIComponent.qualify

#### Defined in

[packages/bpmn-server/src/API/API.ts:90](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L90)

___

### can

▸ **can**(`action`, `user`, `on?`): `Promise`\<`boolean`\>

Whether this user may do this (the one check of each action: canStart, canInvoke, canAssign, canRestart,
canFireEvent, canModifyModel, canDeleteModel): the user's own rule, then `pre-action`, whose listeners may refuse
by throwing (the error is the caller's). No listener: the built-in rules only.

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `string` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `on` | `Object` |
| `on.item?` | `any` |
| `on.instance?` | `any` |
| `on.element?` | `any` |
| `on.model?` | `string` |
| `on.input?` | `any` |
| `on.assignment?` | `any` |

#### Returns

`Promise`\<`boolean`\>

#### Inherited from

APIComponent.can

#### Defined in

[packages/bpmn-server/src/API/API.ts:110](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L110)

___

### targets

▸ **targets**(`query`): `Promise`\<\{ `item`: `any` ; `instance`: `any`  }[]\>

The waiting items a query finds, each with its case (what a pre-action decides on); none when nothing listens.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<\{ `item`: `any` ; `instance`: `any`  }[]\>

#### Inherited from

APIComponent.targets

#### Defined in

[packages/bpmn-server/src/API/API.ts:119](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L119)

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

[packages/bpmn-server/src/API/API.ts:410](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L410)

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

[packages/bpmn-server/src/API/API.ts:417](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L417)

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

[packages/bpmn-server/src/API/API.ts:424](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L424)

___

### findStartEvents

▸ **findStartEvents**(`query`, `user?`): `Promise`\<`any`[]\>

Start events the principal may use: candidate starter users/groups apply.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:429](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L429)

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

[packages/bpmn-server/src/API/API.ts:436](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L436)

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

[packages/bpmn-server/src/API/API.ts:440](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L440)

___

### verifyModel

▸ **verifyModel**(`nameOrSource`, `user?`): `Promise`\<[`IModelVerification`](../interfaces/IModelVerification.md)\>

Checks a model for errors and likely mistakes without running it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameOrSource` | `string` | a saved model's name, or BPMN XML |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) | - |

#### Returns

`Promise`\<[`IModelVerification`](../interfaces/IModelVerification.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:448](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L448)
