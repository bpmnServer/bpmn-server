[bpmn-server](../README.md) / [Exports](../modules.md) / [datastore/MongoDB](../modules/datastore_MongoDB.md) / MongoDB

# Class: MongoDB

[datastore/MongoDB](../modules/datastore_MongoDB.md).MongoDB

## Table of contents

### Constructors

- [constructor](datastore_MongoDB.MongoDB.md#constructor)

### Properties

- [client](datastore_MongoDB.MongoDB.md#client)
- [dbConfig](datastore_MongoDB.MongoDB.md#dbconfig)
- [logger](datastore_MongoDB.MongoDB.md#logger)

### Methods

- [connect](datastore_MongoDB.MongoDB.md#connect)
- [createIndex](datastore_MongoDB.MongoDB.md#createindex)
- [find](datastore_MongoDB.MongoDB.md#find)
- [getClient](datastore_MongoDB.MongoDB.md#getclient)
- [insert](datastore_MongoDB.MongoDB.md#insert)
- [remove](datastore_MongoDB.MongoDB.md#remove)
- [removeById](datastore_MongoDB.MongoDB.md#removebyid)
- [update](datastore_MongoDB.MongoDB.md#update)
- [update2](datastore_MongoDB.MongoDB.md#update2)

## Constructors

### constructor

• **new MongoDB**(`dbConfig`, `logger`): [`MongoDB`](datastore_MongoDB.MongoDB.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbConfig` | `any` |
| `logger` | `any` |

#### Returns

[`MongoDB`](datastore_MongoDB.MongoDB.md)

#### Defined in

[src/datastore/MongoDB.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L22)

## Properties

### client

• **client**: `any`

#### Defined in

[src/datastore/MongoDB.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L19)

___

### dbConfig

• **dbConfig**: `any`

#### Defined in

[src/datastore/MongoDB.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L20)

___

### logger

• **logger**: `any`

#### Defined in

[src/datastore/MongoDB.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L21)

## Methods

### connect

▸ **connect**(): `Promise`\<`unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:210](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L210)

___

### createIndex

▸ **createIndex**(`dbName`, `collName`, `index`, `unique?`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `index` | `any` |
| `unique` | `Object` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:59](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L59)

___

### find

▸ **find**(`dbName`, `collName`, `qry`, `projection?`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `dbName` | `any` | `undefined` |
| `collName` | `any` | `undefined` |
| `qry` | `any` | `undefined` |
| `projection` | `any` | `null` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L33)

___

### getClient

▸ **getClient**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/datastore/MongoDB.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L26)

___

### insert

▸ **insert**(`dbName`, `collName`, `docs`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `docs` | `any` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:84](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L84)

___

### remove

▸ **remove**(`dbName`, `collName`, `query`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `query` | `any` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:154](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L154)

___

### removeById

▸ **removeById**(`dbName`, `collName`, `id`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `id` | `any` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:182](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L182)

___

### update

▸ **update**(`dbName`, `collName`, `query`, `updateObject`, `options?`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `query` | `any` |
| `updateObject` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:109](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L109)

___

### update2

▸ **update2**(`dbName`, `collName`, `query`, `updateObject`, `options?`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbName` | `any` |
| `collName` | `any` |
| `query` | `any` |
| `updateObject` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[src/datastore/MongoDB.ts:131](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/datastore/MongoDB.ts#L131)
