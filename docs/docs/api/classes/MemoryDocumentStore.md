[bpmn-server](../readme.md) / MemoryDocumentStore

# Class: MemoryDocumentStore

An [IDocumentStore](../interfaces/IDocumentStore.md) in memory: for tests, and for a standalone engine that keeps nothing
across restarts. Documents are copied in and out, so callers never share state with the store;
unique indexes are enforced as MongoDB does. One instance may be shared by several servers to
stand for one database they all use.

## Implements

- [`IDocumentStore`](../interfaces/IDocumentStore.md)

## Table of contents

### Constructors

- [constructor](MemoryDocumentStore.md#constructor)

### Properties

- [collections](MemoryDocumentStore.md#collections)
- [uniqueIndexes](MemoryDocumentStore.md#uniqueindexes)

### Methods

- [name](MemoryDocumentStore.md#name)
- [docs](MemoryDocumentStore.md#docs)
- [find](MemoryDocumentStore.md#find)
- [count](MemoryDocumentStore.md#count)
- [insert](MemoryDocumentStore.md#insert)
- [update](MemoryDocumentStore.md#update)
- [remove](MemoryDocumentStore.md#remove)
- [createIndex](MemoryDocumentStore.md#createindex)
- [close](MemoryDocumentStore.md#close)
- [assertUnique](MemoryDocumentStore.md#assertunique)

## Constructors

### constructor

• **new MemoryDocumentStore**(): [`MemoryDocumentStore`](MemoryDocumentStore.md)

#### Returns

[`MemoryDocumentStore`](MemoryDocumentStore.md)

## Properties

### collections

• `Private` `Readonly` **collections**: `Map`\<`string`, `any`[]\>

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L13)

___

### uniqueIndexes

• `Private` `Readonly` **uniqueIndexes**: `Map`\<`string`, `string`[][]\>

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L14)

## Methods

### name

▸ **name**(`database`, `collection`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L16)

___

### docs

▸ **docs**(`database`, `collection`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L17)

___

### find

▸ **find**(`database`, `collection`, `query`, `projection?`, `sort?`): `Promise`\<`any`[]\>

Documents of `collection` matching `query`, projected and sorted. `database` names the logical database (MongoDB's db name; ignored by single-database adapters).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `database` | `string` | `undefined` |
| `collection` | `string` | `undefined` |
| `query` | [`StorageQuery`](../readme.md#storagequery) | `undefined` |
| `projection` | `Record`\<`string`, `any`\> | `null` |
| `sort` | `Record`\<`string`, ``-1`` \| ``1``\> | `null` |

#### Returns

`Promise`\<`any`[]\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[find](../interfaces/IDocumentStore.md#find)

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L23)

___

### count

▸ **count**(`database`, `collection`, `query`): `Promise`\<`number`\>

How many documents of `collection` match `query`. Optional: without it, callers count what [find](../interfaces/IDocumentStore.md#find) returns.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `query` | [`StorageQuery`](../readme.md#storagequery) |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[count](../interfaces/IDocumentStore.md#count)

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L28)

___

### insert

▸ **insert**(`database`, `collection`, `documents`): `Promise`\<`number`\>

Inserts all of `documents`, or none: a unique-index conflict throws a [DuplicateKeyError](DuplicateKeyError.md); any other failure throws as it is. Returns how many were inserted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `documents` | `any`[] |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[insert](../interfaces/IDocumentStore.md#insert)

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L32)

___

### update

▸ **update**(`database`, `collection`, `query`, `update`, `options?`): `Promise`\<`number`\>

Updates the first document matching `query` (`$set` fields, or replaces it); `{ upsert: true }` inserts when none matches. Returns how many were modified.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `query` | [`StorageQuery`](../readme.md#storagequery) |
| `update` | `Record`\<`string`, `any`\> |
| `options` | `Object` |
| `options.upsert?` | `boolean` |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[update](../interfaces/IDocumentStore.md#update)

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L40)

___

### remove

▸ **remove**(`database`, `collection`, `query`): `Promise`\<\{ `deletedCount`: `number`  }\>

Removes every document matching `query`; returns `{ deletedCount }`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `query` | [`StorageQuery`](../readme.md#storagequery) |

#### Returns

`Promise`\<\{ `deletedCount`: `number`  }\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[remove](../interfaces/IDocumentStore.md#remove)

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L54)

___

### createIndex

▸ **createIndex**(`database`, `collection`, `index`, `options?`): `Promise`\<`string`\>

Declares an index; `{ unique: true }` makes [insert](../interfaces/IDocumentStore.md#insert) refuse a second document with the same values. Idempotent.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `index` | `Record`\<`string`, ``-1`` \| ``1``\> |
| `options` | `Object` |
| `options.unique?` | `boolean` |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[createIndex](../interfaces/IDocumentStore.md#createindex)

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L61)

___

### close

▸ **close**(): `Promise`\<`void`\>

Releases connections. Idempotent.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[close](../interfaces/IDocumentStore.md#close)

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:73](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L73)

___

### assertUnique

▸ **assertUnique**(`database`, `collection`, `others`, `doc`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `others` | `any`[] |
| `doc` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/datastore/MemoryDocumentStore.ts:75](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MemoryDocumentStore.ts#L75)
