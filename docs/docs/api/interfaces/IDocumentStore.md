[bpmn-server](../readme.md) / IDocumentStore

# Interface: IDocumentStore

## Implemented by

- [`MemoryDocumentStore`](../classes/MemoryDocumentStore.md)
- [`MongoDB`](../classes/MongoDB.md)
- [`SqliteDocumentStore`](../classes/SqliteDocumentStore.md)

## Table of contents

### Methods

- [find](IDocumentStore.md#find)
- [count](IDocumentStore.md#count)
- [insert](IDocumentStore.md#insert)
- [update](IDocumentStore.md#update)
- [remove](IDocumentStore.md#remove)
- [createIndex](IDocumentStore.md#createindex)
- [close](IDocumentStore.md#close)

## Methods

### find

▸ **find**(`database`, `collection`, `query`, `projection?`, `sort?`): `Promise`\<`any`[]\>

Documents of `collection` matching `query`, projected and sorted. `database` names the logical database (MongoDB's db name; ignored by single-database adapters).

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `query` | [`StorageQuery`](../readme.md#storagequery) |
| `projection?` | `Record`\<`string`, `any`\> |
| `sort?` | `Record`\<`string`, ``-1`` \| ``1``\> |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L18)

___

### count

▸ **count**(`database`, `collection`, `query`): `Promise`\<`number`\>

How many documents of `collection` match `query`. Optional: without it, callers count what [find](IDocumentStore.md#find) returns.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `query` | [`StorageQuery`](../readme.md#storagequery) |

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L20)

___

### insert

▸ **insert**(`database`, `collection`, `documents`): `Promise`\<`number`\>

Inserts all of `documents`, or none: a unique-index conflict throws a [DuplicateKeyError](../classes/DuplicateKeyError.md); any other failure throws as it is. Returns how many were inserted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `documents` | `any`[] |

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L22)

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
| `options?` | `Object` |
| `options.upsert?` | `boolean` |

#### Returns

`Promise`\<`number`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L24)

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

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L26)

___

### createIndex

▸ **createIndex**(`database`, `collection`, `index`, `options?`): `Promise`\<`string`\>

Declares an index; `{ unique: true }` makes [insert](IDocumentStore.md#insert) refuse a second document with the same values. Idempotent.

#### Parameters

| Name | Type |
| :------ | :------ |
| `database` | `string` |
| `collection` | `string` |
| `index` | `Record`\<`string`, ``-1`` \| ``1``\> |
| `options?` | `Object` |
| `options.unique?` | `boolean` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L28)

___

### close

▸ **close**(): `Promise`\<`void`\>

Releases connections. Idempotent.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L30)
