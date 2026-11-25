[bpmn-server](../readme.md) / APIEngine

# Class: APIEngine

## Hierarchy

- `APIComponent`

  ↳ **`APIEngine`**

## Implements

- [`IAPIEngine`](../interfaces/IAPIEngine.md)

## Table of contents

### Constructors

- [constructor](APIEngine.md#constructor)

### Properties

- [api](APIEngine.md#api)

### Accessors

- [server](APIEngine.md#server)
- [filters](APIEngine.md#filters)

### Methods

- [getUser](APIEngine.md#getuser)
- [qualify](APIEngine.md#qualify)
- [can](APIEngine.md#can)
- [targets](APIEngine.md#targets)
- [start](APIEngine.md#start)
- [invoke](APIEngine.md#invoke)
- [assign](APIEngine.md#assign)
- [throwMessage](APIEngine.md#throwmessage)
- [throwSignal](APIEngine.md#throwsignal)
- [startEvent](APIEngine.md#startevent)
- [retry](APIEngine.md#retry)
- [restart](APIEngine.md#restart)
- [upgrade](APIEngine.md#upgrade)

## Constructors

### constructor

• **new APIEngine**(`api`): [`APIEngine`](APIEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIEngine`](APIEngine.md)

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

### start

▸ **start**(`name`, `data?`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

start a new Instance of specified model

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `any` | name of the model to start. |
| `data` | `Object` | - |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) | user object {} |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) | - |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[start](../interfaces/IAPIEngine.md#start)

#### Defined in

[packages/bpmn-server/src/API/API.ts:302](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L302)

___

### invoke

▸ **invoke**(`query`, `data?`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

continue with the execution of a particular item that is in a wait state, typically a user task

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `Object` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[invoke](../interfaces/IAPIEngine.md#invoke)

#### Defined in

[packages/bpmn-server/src/API/API.ts:308](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L308)

___

### assign

▸ **assign**(`query`, `data`, `assignment`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

provide assignment data to a user task
Also, updates item data

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `any` |
| `assignment` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[assign](../interfaces/IAPIEngine.md#assign)

#### Defined in

[packages/bpmn-server/src/API/API.ts:316](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L316)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

throw a message with an id, system will identify receiving item

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[throwMessage](../interfaces/IAPIEngine.md#throwmessage)

#### Defined in

[packages/bpmn-server/src/API/API.ts:328](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L328)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user?`, `options?`): `Promise`\<`any`\>

throw a signal with an id, system will identify receiving item(s)

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<`any`\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[throwSignal](../interfaces/IAPIEngine.md#throwsignal)

#### Defined in

[packages/bpmn-server/src/API/API.ts:334](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L334)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data?`, `user?`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

start a second event node (in a subprocess) for a running instance

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `elementId` | `any` |
| `data` | `Object` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | [`IEngineOptions`](../interfaces/IEngineOptions.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[startEvent](../interfaces/IAPIEngine.md#startevent)

#### Defined in

[packages/bpmn-server/src/API/API.ts:338](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L338)

___

### retry

▸ **retry**(`itemQuery`, `user?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

Runs a failed item's work again (its status `error`), and the instance on from it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemQuery` | `any` |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Defined in

[packages/bpmn-server/src/API/API.ts:348](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L348)

___

### restart

▸ **restart**(`itemQuery`, `data`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

restarting an already completed instance at a particular node
this function requires `dataStore.enableSavePoints` to be true in configuration.ts
this add a savePoint for each item, allowing you to select that item to restore it

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemQuery` | `any` | Query to find a single item |
| `data` | `any` | - |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) | - |
| `options` | `Object` | - |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[restart](../interfaces/IAPIEngine.md#restart)

#### Defined in

[packages/bpmn-server/src/API/API.ts:352](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L352)

___

### upgrade

▸ **upgrade**(`model`, `afterNodeIds`, `user?`): `Promise`\<`string`[] \| \{ `errors`: `any`  }\>

upgrade running instances with the latest revised bpmn model
default behaviour is that running instances will retain the model at start
However, this routine will upgrade already started instances with the revised model

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `model` | `any` | Model Name |
| `afterNodeIds` | `any` | list of nodeIds, to check if already started, don't apply the upgrade |
| `user?` | [`ISecureUser`](../interfaces/ISecureUser.md) | - |

#### Returns

`Promise`\<`string`[] \| \{ `errors`: `any`  }\>

#### Implementation of

[IAPIEngine](../interfaces/IAPIEngine.md).[upgrade](../interfaces/IAPIEngine.md#upgrade)

#### Defined in

[packages/bpmn-server/src/API/API.ts:359](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/API.ts#L359)
