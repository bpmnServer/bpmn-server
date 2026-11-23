[bpmn-server](../readme.md) / APIData

# Class: APIData

## Hierarchy

- `APIComponent`

  ↳ **`APIData`**

## Table of contents

### Constructors

- [constructor](APIData.md#constructor)

### Properties

- [api](APIData.md#api)

### Accessors

- [server](APIData.md#server)
- [filters](APIData.md#filters)

### Methods

- [getUser](APIData.md#getuser)
- [qualify](APIData.md#qualify)
- [can](APIData.md#can)
- [targets](APIData.md#targets)
- [qualifyQuery](APIData.md#qualifyquery)
- [getPendingUserTasks](APIData.md#getpendingusertasks)
- [findItems](APIData.md#finditems)
- [findItem](APIData.md#finditem)
- [findInstances](APIData.md#findinstances)
- [deleteInstances](APIData.md#deleteinstances)

## Constructors

### constructor

• **new APIData**(`api`): [`APIData`](APIData.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIData`](APIData.md)

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

### qualifyQuery

▸ **qualifyQuery**(`kind`, `query`, `user?`): `Promise`\<`any`\>

A query narrowed to what this user may see, as the API's reads narrow theirs (pre-query).

#### Parameters

| Name | Type |
| :------ | :------ |
| `kind` | ``"items"`` \| ``"instances"`` \| ``"startEvents"`` |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:367](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L367)

___

### getPendingUserTasks

▸ **getPendingUserTasks**(`query`, `user?`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:370](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L370)

___

### findItems

▸ **findItems**(`query`, `user?`, `options?`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

`lean`: without the instances' data (for lists): see IDataStore.findItems.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options?` | `Object` |
| `options.lean?` | `boolean` |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:379](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L379)

___

### findItem

▸ **findItem**(`query`, `user?`): `Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IItemData`](../interfaces/IItemData.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:384](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L384)

___

### findInstances

▸ **findInstances**(`query`, `user?`, `options?`): `Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options?` | `any` |

#### Returns

`Promise`\<[`IInstanceData`](../interfaces/IInstanceData.md)[]\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:390](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L390)

___

### deleteInstances

▸ **deleteInstances**(`query`, `user?`): `Promise`\<\{ `deletedCount`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<\{ `deletedCount`: `number`  }\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:397](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L397)
