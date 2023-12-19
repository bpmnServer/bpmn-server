[bpmn-server](../README.md) / MongoDB

# Class: MongoDB

## Table of contents

### Constructors

- [constructor](MongoDB.md#constructor)

### Properties

- [client](MongoDB.md#client)
- [dbConfig](MongoDB.md#dbconfig)
- [logger](MongoDB.md#logger)

### Methods

- [connect](MongoDB.md#connect)
- [createIndex](MongoDB.md#createindex)
- [find](MongoDB.md#find)
- [getClient](MongoDB.md#getclient)
- [insert](MongoDB.md#insert)
- [remove](MongoDB.md#remove)
- [removeById](MongoDB.md#removebyid)
- [update](MongoDB.md#update)
- [update2](MongoDB.md#update2)

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

[datastore/MongoDB.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-22)

## Properties

### client

• **client**: `any`

#### Defined in

[datastore/MongoDB.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-19)

___

### dbConfig

• **dbConfig**: `any`

#### Defined in

[datastore/MongoDB.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-20)

___

### logger

• **logger**: `any`

#### Defined in

[datastore/MongoDB.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-21)

## Methods

### connect

▸ **connect**(): `Promise`\<`unknown`\>

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[datastore/MongoDB.ts:210](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-210)

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

[datastore/MongoDB.ts:59](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-59)

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

[datastore/MongoDB.ts:33](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-33)

___

### getClient

▸ **getClient**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[datastore/MongoDB.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-26)

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

[datastore/MongoDB.ts:84](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-84)

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

[datastore/MongoDB.ts:154](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-154)

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

[datastore/MongoDB.ts:182](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-182)

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

[datastore/MongoDB.ts:109](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-109)

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

[datastore/MongoDB.ts:131](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/datastore/MongoDB.ts#lines-131)
