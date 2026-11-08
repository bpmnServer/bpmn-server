[bpmn-server](../readme.md) / InstanceLocker

# Class: InstanceLocker

The lock port over any [IDocumentStore](../interfaces/IDocumentStore.md): a lock is a document with a unique id, so the
store's unique index makes acquisition atomic across processes. Only a duplicate key means
contention; any other failure (a lost connection) is thrown, not retried as if the lock were
busy. A lock is released only by its owner, and one older than `staleAfter` is taken over.

Legacy form: `new InstanceLocker(dataStore)`, using the data store's `db` and database. The store
may be given as a function, read on each use (the data store gives its current `db`).

## Implements

- [`ILockManager`](../interfaces/ILockManager.md)

## Table of contents

### Constructors

- [constructor](InstanceLocker.md#constructor)

### Properties

- [owner](InstanceLocker.md#owner)
- [storeOf](InstanceLocker.md#storeof)
- [database](InstanceLocker.md#database)
- [collection](InstanceLocker.md#collection)
- [retryDelay](InstanceLocker.md#retrydelay)
- [maxTries](InstanceLocker.md#maxtries)
- [staleAfter](InstanceLocker.md#staleafter)
- [logger](InstanceLocker.md#logger)
- [renewing](InstanceLocker.md#renewing)
- [indexed](InstanceLocker.md#indexed)

### Accessors

- [store](InstanceLocker.md#store)

### Methods

- [defaultOwner](InstanceLocker.md#defaultowner)
- [install](InstanceLocker.md#install)
- [ensureIndex](InstanceLocker.md#ensureindex)
- [lock](InstanceLocker.md#lock)
- [try](InstanceLocker.md#try)
- [keepRenewing](InstanceLocker.md#keeprenewing)
- [stopRenewing](InstanceLocker.md#stoprenewing)
- [release](InstanceLocker.md#release)
- [claim](InstanceLocker.md#claim)
- [purgeClaims](InstanceLocker.md#purgeclaims)
- [removeStale](InstanceLocker.md#removestale)
- [delete](InstanceLocker.md#delete)
- [list](InstanceLocker.md#list)
- [delay](InstanceLocker.md#delay)

## Constructors

### constructor

• **new InstanceLocker**(`store`, `options?`): [`InstanceLocker`](InstanceLocker.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | [`IDocumentStore`](../interfaces/IDocumentStore.md) \| () => [`IDocumentStore`](../interfaces/IDocumentStore.md) \| \{ `db`: [`IDocumentStore`](../interfaces/IDocumentStore.md) ; `dbConfiguration`: \{ `db`: `string` ; `Locks_collection?`: `string`  } ; `logger?`: `any`  } |
| `options?` | `Partial`\<[`InstanceLockerOptions`](../readme.md#instancelockeroptions)\> |

#### Returns

[`InstanceLocker`](InstanceLocker.md)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:46](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L46)

## Properties

### owner

• `Readonly` **owner**: `string`

This process's identity as a lock owner.

#### Implementation of

[ILockManager](../interfaces/ILockManager.md).[owner](../interfaces/ILockManager.md#owner)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L33)

___

### storeOf

• `Private` `Readonly` **storeOf**: () => [`IDocumentStore`](../interfaces/IDocumentStore.md)

The store, read when used: a data store's `db` replaced after it was made (an in-memory one, in a test) is the one locked in.

#### Type declaration

▸ (): [`IDocumentStore`](../interfaces/IDocumentStore.md)

##### Returns

[`IDocumentStore`](../interfaces/IDocumentStore.md)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L35)

___

### database

• `Private` `Readonly` **database**: `string`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L37)

___

### collection

• `Private` `Readonly` **collection**: `string`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L38)

___

### retryDelay

• `Private` `Readonly` **retryDelay**: `number`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L39)

___

### maxTries

• `Private` `Readonly` **maxTries**: `number`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L40)

___

### staleAfter

• `Private` `Readonly` **staleAfter**: `number`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L41)

___

### logger

• `Private` `Readonly` **logger**: `any`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L42)

___

### renewing

• `Private` `Readonly` **renewing**: `Map`\<`string`, `Timeout`\>

The locks held here, each renewed until released: only a dead holder's goes stale.

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L44)

___

### indexed

• `Private` **indexed**: `Promise`\<`void`\> = `null`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L69)

## Accessors

### store

• `get` **store**(): [`IDocumentStore`](../interfaces/IDocumentStore.md)

#### Returns

[`IDocumentStore`](../interfaces/IDocumentStore.md)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L36)

## Methods

### defaultOwner

▸ **defaultOwner**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L59)

___

### install

▸ **install**(): `Promise`\<`void`\>

The unique index acquisition relies on; part of the data store's `install()`.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L65)

___

### ensureIndex

▸ **ensureIndex**(): `Promise`\<`void`\>

Makes sure of the unique index before the first lock or claim, once per locker: without it two servers could both
"acquire" an instance. A database that `install()` (npm run setup) never ran on is protected all the same. When the index
can not be made (no privilege), it may be there already, so that is tried: two inserts of one id. If both succeed nothing
excludes anyone, and locking refuses rather than pretends.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L76)

___

### lock

▸ **lock**(`id`): `Promise`\<`boolean`\>

Waits until `id` is locked by this owner, or throws once the configured tries are spent. A lock older than the stale age is taken over.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[ILockManager](../interfaces/ILockManager.md).[lock](../interfaces/ILockManager.md#lock)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:100](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L100)

___

### try

▸ **try**(`id`, `kind?`): `Promise`\<`boolean`\>

One attempt: true when acquired, false on contention; any other failure throws.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `kind` | `string` | `'lock'` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:114](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L114)

___

### keepRenewing

▸ **keepRenewing**(`id`): `void`

A running execution can outlast `staleAfter` (a long service task): its lock's time is kept fresh while it runs, or
another server would take over and both would change the instance. A holder that dies stops renewing, and its lock goes stale.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:130](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L130)

___

### stopRenewing

▸ **stopRenewing**(): `void`

No more renewals: what a holder's death is, for a test; and at shutdown.

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:141](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L141)

___

### release

▸ **release**(`id`): `Promise`\<`void`\>

Releases `id` only when this owner holds it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ILockManager](../interfaces/ILockManager.md).[release](../interfaces/ILockManager.md#release)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:146](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L146)

___

### claim

▸ **claim**(`key`): `Promise`\<`boolean`\>

Takes `key` once, without waiting: true for the one claimant, false when another (any process) holds it. Claims expire after the stale age.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[ILockManager](../interfaces/ILockManager.md).[claim](../interfaces/ILockManager.md#claim)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:153](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L153)

___

### purgeClaims

▸ **purgeClaims**(): `Promise`\<`number`\>

Removes the claims older than the stale age: what is still due after it is tried again.

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:160](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L160)

___

### removeStale

▸ **removeStale**(`id`): `Promise`\<`boolean`\>

Removes `id` when it is older than `staleAfter`; true when it did.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:166](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L166)

___

### delete

▸ **delete**(`query`): `Promise`\<\{ `deletedCount`: `number`  }\>

Removes locks matching `query`, whoever holds them: an administrator's tool.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<\{ `deletedCount`: `number`  }\>

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:173](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L173)

___

### list

▸ **list**(): `Promise`\<`any`[]\>

Every current lock, for diagnostics.

#### Returns

`Promise`\<`any`[]\>

#### Implementation of

[ILockManager](../interfaces/ILockManager.md).[list](../interfaces/ILockManager.md#list)

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:177](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L177)

___

### delay

▸ **delay**(`ms`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:181](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L181)
