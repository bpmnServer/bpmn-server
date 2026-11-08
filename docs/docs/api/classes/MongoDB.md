[bpmn-server](../readme.md) / MongoDB

# Class: MongoDB

The MongoDB adapter of the storage port: one client, opened on first use, closed by `close()`.

## Implements

- [`IDocumentStore`](../interfaces/IDocumentStore.md)

## Table of contents

### Constructors

- [constructor](MongoDB.md#constructor)

### Properties

- [client](MongoDB.md#client)
- [connecting](MongoDB.md#connecting)
- [dbConfig](MongoDB.md#dbconfig)
- [logger](MongoDB.md#logger)
- [operation](MongoDB.md#operation)

### Methods

- [profilerStart](MongoDB.md#profilerstart)
- [profilerEnd](MongoDB.md#profilerend)
- [getClient](MongoDB.md#getclient)
- [find](MongoDB.md#find)
- [count](MongoDB.md#count)
- [createIndex](MongoDB.md#createindex)
- [insert](MongoDB.md#insert)
- [update](MongoDB.md#update)
- [remove](MongoDB.md#remove)
- [removeById](MongoDB.md#removebyid)
- [close](MongoDB.md#close)
- [connect](MongoDB.md#connect)

## Constructors

### constructor

• **new MongoDB**(`dbConfig`, `logger`): [`MongoDB`](MongoDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbConfig` | `any` |
| `logger` | `any` |

#### Returns

[`MongoDB`](MongoDB.md)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L35)

## Properties

### client

• **client**: `MongoClient` = `null`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L29)

___

### connecting

• `Private` **connecting**: `Promise`\<`MongoClient`\> = `null`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L30)

___

### dbConfig

• **dbConfig**: `any`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L31)

___

### logger

• **logger**: `any`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L32)

___

### operation

• **operation**: `string`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L33)

## Methods

### profilerStart

▸ **profilerStart**(`operation`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `operation` | `string` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L40)

___

### profilerEnd

▸ **profilerEnd**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L45)

___

### getClient

▸ **getClient**(): `Promise`\<`MongoClient`\>

#### Returns

`Promise`\<`MongoClient`\>

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:49](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L49)

___

### find

▸ **find**(`dbName`, `collName`, `qry`, `projection?`, `sort?`): `Promise`\<`WithId`\<`Document`\>[]\>

Documents of `collection` matching `query`, projected and sorted. `database` names the logical database (MongoDB's db name; ignored by single-database adapters).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dbName` | `any` | `undefined` |
| `collName` | `any` | `undefined` |
| `qry` | `any` | `undefined` |
| `projection` | `any` | `null` |
| `sort` | `any` | `null` |

#### Returns

`Promise`\<`WithId`\<`Document`\>[]\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[find](../interfaces/IDocumentStore.md#find)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L56)

___

### count

▸ **count**(`dbName`, `collName`, `qry`): `Promise`\<`number`\>

How many documents of `collection` match `query`. Optional: without it, callers count what [find](../interfaces/IDocumentStore.md#find) returns.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `qry` | `any` |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[count](../interfaces/IDocumentStore.md#count)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:72](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L72)

___

### createIndex

▸ **createIndex**(`dbName`, `collName`, `index`, `unique?`): `Promise`\<`string`\>

Declares an index; `{ unique: true }` makes [insert](../interfaces/IDocumentStore.md#insert) refuse a second document with the same values. Idempotent.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `index` | `any` |
| `unique` | `any` |

#### Returns

`Promise`\<`string`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[createIndex](../interfaces/IDocumentStore.md#createindex)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:83](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L83)

___

### insert

▸ **insert**(`dbName`, `collName`, `docs`): `Promise`\<`number`\>

Inserts all of `documents`, or none: a unique-index conflict throws a [DuplicateKeyError](DuplicateKeyError.md); any other failure throws as it is. Returns how many were inserted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `docs` | `any` |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[insert](../interfaces/IDocumentStore.md#insert)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:101](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L101)

___

### update

▸ **update**(`dbName`, `collName`, `query`, `updateObject`, `options?`): `Promise`\<`number`\>

Updates the first document matching `query` (`$set` fields, or replaces it); `{ upsert: true }` inserts when none matches. Returns how many were modified.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `query` | `any` |
| `updateObject` | `any` |
| `options` | `any` |

#### Returns

`Promise`\<`number`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[update](../interfaces/IDocumentStore.md#update)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:117](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L117)

___

### remove

▸ **remove**(`dbName`, `collName`, `query`): `Promise`\<`DeleteResult`\>

Removes every document matching `query`; returns `{ deletedCount }`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `query` | `any` |

#### Returns

`Promise`\<`DeleteResult`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[remove](../interfaces/IDocumentStore.md#remove)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:131](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L131)

___

### removeById

▸ **removeById**(`dbName`, `collName`, `id`): `Promise`\<`DeleteResult`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `id` | `any` |

#### Returns

`Promise`\<`DeleteResult`\>

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:149](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L149)

___

### close

▸ **close**(): `Promise`\<`void`\>

Releases connections. Idempotent.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IDocumentStore](../interfaces/IDocumentStore.md).[close](../interfaces/IDocumentStore.md#close)

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:163](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L163)

___

### connect

▸ **connect**(): `Promise`\<`MongoClient`\>

#### Returns

`Promise`\<`MongoClient`\>

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:170](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L170)
