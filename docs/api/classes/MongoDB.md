[bpmn-server](../readme.md) / MongoDB

# Class: MongoDB

## Table of contents

### Constructors

- [constructor](MongoDB.md#constructor)

### Properties

- [client](MongoDB.md#client)
- [dbConfig](MongoDB.md#dbconfig)
- [logger](MongoDB.md#logger)

### Methods

- [getClient](MongoDB.md#getclient)
- [find](MongoDB.md#find)
- [createIndex](MongoDB.md#createindex)
- [insert](MongoDB.md#insert)
- [update](MongoDB.md#update)
- [update2](MongoDB.md#update2)
- [remove](MongoDB.md#remove)
- [removeById](MongoDB.md#removebyid)
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

[datastore/MongoDB.ts:22](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L22)

## Properties

### client

• **client**: `any`

#### Defined in

[datastore/MongoDB.ts:19](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L19)

___

### dbConfig

• **dbConfig**: `any`

#### Defined in

[datastore/MongoDB.ts:20](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L20)

___

### logger

• **logger**: `any`

#### Defined in

[datastore/MongoDB.ts:21](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L21)

## Methods

### getClient

▸ **getClient**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[datastore/MongoDB.ts:26](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L26)

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

[datastore/MongoDB.ts:33](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L33)

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

[datastore/MongoDB.ts:59](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L59)

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

[datastore/MongoDB.ts:84](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L84)

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

[datastore/MongoDB.ts:109](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L109)

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

[datastore/MongoDB.ts:131](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L131)

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

[datastore/MongoDB.ts:154](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L154)

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

[datastore/MongoDB.ts:182](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L182)

___

### connect

▸ **connect**(): `Promise`\<`unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[datastore/MongoDB.ts:210](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/datastore/MongoDB.ts#L210)
