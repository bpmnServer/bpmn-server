[bpmn-server](../readme.md) / SqliteDocumentStore

# Class: SqliteDocumentStore

An [IDocumentStore](../interfaces/IDocumentStore.md) on a SQLite file (Node's built-in `node:sqlite`, Node 22.5 or later): no database
server, for small installs, demos and desktop use. Several servers may share one file.

One table per collection, `(_id TEXT PRIMARY KEY, doc TEXT)`, the document as JSON. A query's plain
equalities (`id`, `name`, `items.id`, ...) narrow the rows in SQL; [DocumentQuery](DocumentQuery.md) then decides, so
queries mean exactly what they mean on the in-memory store. Unique indexes are SQLite expression indexes
(a document with none of an index's fields is not in it, as on the in-memory store); other indexes are
not needed by that pre-filter and are not made. Writes run in `BEGIN IMMEDIATE` transactions, the file
in WAL mode, so one writer at a time and readers never blocked.

`database` (MongoDB's database name) is ignored: the file is the database.

## Implements

- [`IDocumentStore`](../interfaces/IDocumentStore.md)

## Table of contents

### Constructors

- [constructor](SqliteDocumentStore.md#constructor)

### Properties

- [db](SqliteDocumentStore.md#db)
- [tables](SqliteDocumentStore.md#tables)
- [filename](SqliteDocumentStore.md#filename)
- [options](SqliteDocumentStore.md#options)

### Methods

- [open](SqliteDocumentStore.md#open)
- [table](SqliteDocumentStore.md#table)
- [write](SqliteDocumentStore.md#write)
- [prefilter](SqliteDocumentStore.md#prefilter)
- [matching](SqliteDocumentStore.md#matching)
- [run](SqliteDocumentStore.md#run)
- [find](SqliteDocumentStore.md#find)
- [count](SqliteDocumentStore.md#count)
- [insert](SqliteDocumentStore.md#insert)
- [update](SqliteDocumentStore.md#update)
- [remove](SqliteDocumentStore.md#remove)
- [createIndex](SqliteDocumentStore.md#createindex)
- [close](SqliteDocumentStore.md#close)

## Constructors

### constructor

• **new SqliteDocumentStore**(`filename`, `options?`): [`SqliteDocumentStore`](SqliteDocumentStore.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filename` | `string` | the database file (made when missing), or `:memory:` |
| `options` | [`SqliteOptions`](../interfaces/SqliteOptions.md) | - |

#### Returns

[`SqliteDocumentStore`](SqliteDocumentStore.md)

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:47](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L47)

## Properties

### db

• `Private` **db**: `any` = `null`

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L43)

___

### tables

• `Private` `Readonly` **tables**: `Set`\<`string`\>

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L44)

___

### filename

• `Readonly` **filename**: `string`

the database file (made when missing), or `:memory:`

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:47](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L47)

___

### options

• `Private` `Readonly` **options**: [`SqliteOptions`](../interfaces/SqliteOptions.md) = `{}`

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:47](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L47)

## Methods

### open

▸ **open**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:49](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L49)

___

### table

▸ **table**(`collection`): `string`

The collection's table, made on first use.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L69)

___

### write

▸ **write**\<`T`\>(`fn`): `T`

Runs `fn` in a write transaction: all of it, or none.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `fn` | () => `T` |

#### Returns

`T`

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L79)

___

### prefilter

▸ **prefilter**(`query`): `Object`

SQL that keeps every row the query may match (a superset), from its plain equalities on strings and
numbers at a path of one or two parts; a value that is an array or an object (a date) is kept for
[DocumentQuery](DocumentQuery.md) to decide.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | [`StorageQuery`](../readme.md#storagequery) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `where` | `string` |
| `params` | `any`[] |

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:98](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L98)

___

### matching

▸ **matching**(`collection`, `query`): \{ `_id`: `string` ; `doc`: `any`  }[]

The rows matching `query`, in insertion order, as documents.

#### Parameters

| Name | Type |
| :------ | :------ |
| `collection` | `string` |
| `query` | [`StorageQuery`](../readme.md#storagequery) |

#### Returns

\{ `_id`: `string` ; `doc`: `any`  }[]

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:120](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L120)

___

### run

▸ **run**(`sql`, `params`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sql` | `string` |
| `params` | `any`[] |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:131](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L131)

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

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:142](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L142)

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

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:147](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L147)

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

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:153](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L153)

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

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:164](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L164)

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

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:181](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L181)

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

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:193](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L193)

___

### close

▸ **close**(): `Promise`\<`void`\>

Releases connections. Idempotent.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[close](../interfaces/IDocumentStore.md#close)

#### Defined in

[packages/bpmn-server/src/datastore/SqliteDocumentStore.ts:205](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/SqliteDocumentStore.ts#L205)
