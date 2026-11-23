[bpmn-server](../readme.md) / Connectors

# Class: Connectors

## Table of contents

### Constructors

- [constructor](Connectors.md#constructor)

### Properties

- [compiled](Connectors.md#compiled)
- [files](Connectors.md#files)
- [server](Connectors.md#server)
- [looseChecked](Connectors.md#loosechecked)

### Accessors

- [settings](Connectors.md#settings)
- [store](Connectors.md#store)
- [database](Connectors.md#database)
- [modelsFolder](Connectors.md#modelsfolder)
- [folder](Connectors.md#folder)

### Methods

- [compile](Connectors.md#compile)
- [fileOf](Connectors.md#fileof)
- [moveLoose](Connectors.md#moveloose)
- [readDefinition](Connectors.md#readdefinition)
- [writeDefinition](Connectors.md#writedefinition)
- [fileIds](Connectors.md#fileids)
- [stateOf](Connectors.md#stateof)
- [setState](Connectors.md#setstate)
- [install](Connectors.md#install)
- [list](Connectors.md#list)
- [get](Connectors.md#get)
- [operations](Connectors.md#operations)
- [document](Connectors.md#document)
- [backup](Connectors.md#backup)
- [load](Connectors.md#load)
- [writeOut](Connectors.md#writeout)
- [required](Connectors.md#required)
- [withoutSecret](Connectors.md#withoutsecret)
- [add](Connectors.md#add)
- [update](Connectors.md#update)
- [refresh](Connectors.md#refresh)
- [openapiOf](Connectors.md#openapiof)
- [remove](Connectors.md#remove)
- [removeFile](Connectors.md#removefile)
- [forget](Connectors.md#forget)
- [setKey](Connectors.md#setkey)
- [setScheme](Connectors.md#setscheme)
- [storeKey](Connectors.md#storekey)
- [clearKey](Connectors.md#clearkey)
- [clearScheme](Connectors.md#clearscheme)
- [forgetKey](Connectors.md#forgetkey)
- [authScheme](Connectors.md#authscheme)
- [fromScheme](Connectors.md#fromscheme)
- [test](Connectors.md#test)
- [call](Connectors.md#call)
- [exampleAnswer](Connectors.md#exampleanswer)
- [checkTesting](Connectors.md#checktesting)
- [backoff](Connectors.md#backoff)
- [buildRequest](Connectors.md#buildrequest)
- [readBody](Connectors.md#readbody)
- [readDocument](Connectors.md#readdocument)
- [checkBaseUrl](Connectors.md#checkbaseurl)
- [checkHost](Connectors.md#checkhost)

## Constructors

### constructor

• **new Connectors**(`server`): [`Connectors`](Connectors.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`Connectors`](Connectors.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:143](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L143)

## Properties

### compiled

• `Private` `Readonly` **compiled**: `Map`\<`string`, \{ `stamp`: `string` ; `document`: `any` ; `operations`: `Map`\<`string`, [`Operation`](../interfaces/Operation.md)\>  }\>

each connector's document and operations, read once and kept until the document changes

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:139](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L139)

___

### files

• `Private` `Readonly` **files**: `Map`\<`string`, \{ `stamp`: `string` ; `definition`: `any`  }\>

each file as last read, kept while it is the same (its time and size)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:141](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L141)

___

### server

• `Private` `Readonly` **server**: [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:143](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L143)

___

### looseChecked

• `Private` **looseChecked**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:171](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L171)

## Accessors

### settings

• `get` **settings**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:156](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L156)

___

### store

• `get` **store**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:157](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L157)

___

### database

• `get` **database**(): `any`

The logical database, as the data store has it (ignored by single-database stores). A MongoDB configuration
without a `db` leaves it undefined: MongoDB then uses the database its URL names.

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:162](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L162)

___

### modelsFolder

• `get` **modelsFolder**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:166](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L166)

___

### folder

• `get` **folder**(): `string`

The connectors' folder, in the models folder.

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:168](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L168)

## Methods

### compile

▸ **compile**(`connector`): `Object`

The connector's document and operations, from the cache while the document is the same.

#### Parameters

| Name | Type |
| :------ | :------ |
| `connector` | [`Connector`](../interfaces/Connector.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `stamp` | `string` |
| `document` | `any` |
| `operations` | `Map`\<`string`, [`Operation`](../interfaces/Operation.md)\> |

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:146](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L146)

___

### fileOf

▸ **fileOf**(`id`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:169](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L169)

___

### moveLoose

▸ **moveLoose**(): `void`

Connector files beside the models (where 3.7 wrote them at first) moved into the connectors folder: at a list,
and before the first read. One already in the folder is kept; the other is left where it is, and said so.

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:176](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L176)

___

### readDefinition

▸ **readDefinition**(`id`): `any`

A connector's definition from its file, or undefined; read again only when the file changed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:194](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L194)

___

### writeDefinition

▸ **writeDefinition**(`definition`): `void`

Writes a connector's definition to its file (as the models are written: by the server, into its folder).

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:212](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L212)

___

### fileIds

▸ **fileIds**(): `string`[]

The ids of the connectors' files.

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:220](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L220)

___

### stateOf

▸ **stateOf**(`id`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:228](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L228)

___

### setState

▸ **setState**(`id`, `set`, `unset?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `set` | `Record`\<`string`, `any`\> |
| `unset?` | `Record`\<`string`, `string`\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:233](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L233)

___

### install

▸ **install**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:237](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L237)

___

### list

▸ **list**(): `Promise`\<[`Connector`](../interfaces/Connector.md)[]\>

Every connector, without its key.

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)[]\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:246](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L246)

___

### get

▸ **get**(`id`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

One connector, without its key; undefined when there is none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:258](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L258)

___

### operations

▸ **operations**(`id`): `Promise`\<[`Operation`](../interfaces/Operation.md) & \{ `enabled`: `boolean`  }[]\>

A connector's operations: every one the document has, and whether designers may use it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Operation`](../interfaces/Operation.md) & \{ `enabled`: `boolean`  }[]\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:264](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L264)

___

### document

▸ **document**(`id`): `Promise`\<`any`\>

A connector's OpenAPI document, as it was read.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:271](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L271)

___

### backup

▸ **backup**(): `Promise`\<`Record`\<`string`, `any`[]\>\>

What this server keeps of its connectors (keys encrypted, tests): for a backup. The files are the models'.

#### Returns

`Promise`\<`Record`\<`string`, `any`[]\>\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:276](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L276)

___

### load

▸ **load**(`id`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

A connector: its file, with this server's key and test. One kept whole in the collection is written out first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:281](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L281)

___

### writeOut

▸ **writeOut**(`kept`): `Promise`\<\{ `definition`: `any` ; `state`: `ServerState`  }\>

A connector kept whole in the collection (3.6): its definition to its file; its key and test stay, alone.

#### Parameters

| Name | Type |
| :------ | :------ |
| `kept` | `any` |

#### Returns

`Promise`\<\{ `definition`: `any` ; `state`: `ServerState`  }\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:293](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L293)

___

### required

▸ **required**(`id`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:310](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L310)

___

### withoutSecret

▸ **withoutSecret**(`connector`): [`Connector`](../interfaces/Connector.md)

What callers see: no key, and the document only described (`document(id)` reads it).

#### Parameters

| Name | Type |
| :------ | :------ |
| `connector` | [`Connector`](../interfaces/Connector.md) |

#### Returns

[`Connector`](../interfaces/Connector.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:317](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L317)

___

### add

▸ **add**(`input`, `userName?`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Adds a connector from its OpenAPI document (given, or fetched from `source`): its file in the models folder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ConnectorInput`](../interfaces/ConnectorInput.md) |
| `userName?` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:331](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L331)

___

### update

▸ **update**(`id`, `patch`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Changes a connector's name, description, base URL, operations, groups, enabled, timeout or retries.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `patch` | `Partial`\<`Pick`\<[`Connector`](../interfaces/Connector.md), ``"name"`` \| ``"timeout"`` \| ``"description"`` \| ``"baseUrl"`` \| ``"operations"`` \| ``"groups"`` \| ``"enabled"`` \| ``"retries"`` \| ``"testing"``\>\> |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:360](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L360)

___

### refresh

▸ **refresh**(`id`, `document?`): `Promise`\<\{ `added`: `string`[] ; `removed`: `string`[]  }\>

Reads the document again (from its source, or the one given): operations it no longer has are dropped,
new ones are enabled. Returns what changed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `document?` | `string` \| `object` |

#### Returns

`Promise`\<\{ `added`: `string`[] ; `removed`: `string`[]  }\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:378](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L378)

___

### openapiOf

▸ **openapiOf**(`document`, `source?`): `Object`

What is kept of a document: where it came from, its version and title, and itself, as JSON.

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `any` |
| `source?` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `source?` | `string` |
| `version` | `string` |
| `title?` | `string` |
| `fetchedAt` | `string` |
| `bytes` | `number` |
| `document?` | `any` |

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:389](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L389)

___

### remove

▸ **remove**(`id`): `Promise`\<`boolean`\>

Removes a connector: its file, and this server's key and test. Its halves: `removeFile`, `forget`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:394](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L394)

___

### removeFile

▸ **removeFile**(`id`): `boolean`

The connector's file gone (model access's).

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:401](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L401)

___

### forget

▸ **forget**(`id`): `Promise`\<`boolean`\>

This server's key and test for the connector gone (the engine's).

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:413](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L413)

___

### setKey

▸ **setKey**(`id`, `key`, `how?`, `userName?`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Sets (or replaces) the connector's authorization key, stored encrypted with this server. `how` is a securitySchemes
name of the document, or a scheme given here; none: the document's only scheme. For basic, the key is
`user:password`. Its two halves, for when the engine is elsewhere: `setScheme` (the file: model access) and
`storeKey` (this server's key: the engine).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `key` | `string` | `undefined` |
| `how` | `string` \| `Omit`\<[`ConnectorAuth`](../interfaces/ConnectorAuth.md), ``"secret"`` \| ``"last4"`` \| ``"setAt"`` \| ``"setBy"``\> | `undefined` |
| `userName?` | `string` | `undefined` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:424](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L424)

___

### setScheme

▸ **setScheme**(`id`, `how?`, `key?`): `Promise`\<[`ConnectorAuth`](../interfaces/ConnectorAuth.md)\>

How the connector's key is sent, into its file (written only when it changes); the key, when given, checked against it.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `undefined` |
| `how` | `string` \| `Omit`\<[`ConnectorAuth`](../interfaces/ConnectorAuth.md), ``"secret"`` \| ``"last4"`` \| ``"setAt"`` \| ``"setBy"``\> | `undefined` |
| `key?` | `string` | `undefined` |

#### Returns

`Promise`\<[`ConnectorAuth`](../interfaces/ConnectorAuth.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:430](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L430)

___

### storeKey

▸ **storeKey**(`id`, `key`, `userName?`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

This server's key for the connector, stored encrypted (SECRETS_KEY): the engine's, where the calls are made.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `key` | `string` |
| `userName?` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:444](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L444)

___

### clearKey

▸ **clearKey**(`id`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Removes the connector's key: its calls go without authorization. Its halves: `clearScheme`, `forgetKey`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:453](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L453)

___

### clearScheme

▸ **clearScheme**(`id`): `Promise`\<`void`\>

No scheme in the connector's file.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:459](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L459)

___

### forgetKey

▸ **forgetKey**(`id`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

This server's key for the connector, gone.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:466](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L466)

___

### authScheme

▸ **authScheme**(`connector`, `how`): [`ConnectorAuth`](../interfaces/ConnectorAuth.md)

How a key is sent: from the document's securitySchemes (by name, or its only one), or as given.

#### Parameters

| Name | Type |
| :------ | :------ |
| `connector` | [`Connector`](../interfaces/Connector.md) |
| `how` | `any` |

#### Returns

[`ConnectorAuth`](../interfaces/ConnectorAuth.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:473](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L473)

___

### fromScheme

▸ **fromScheme**(`scheme`): [`ConnectorAuth`](../interfaces/ConnectorAuth.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `scheme` | `any` |

#### Returns

[`ConnectorAuth`](../interfaces/ConnectorAuth.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:495](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L495)

___

### test

▸ **test**(`id`, `operationId?`, `input?`): `Promise`\<\{ `at`: `string` ; `operation`: `string` ; `ok`: `boolean` ; `status?`: `number` ; `message?`: `string`  }\>

Tests the connection: calls an operation (none named: a GET that needs no input) with the inputs given, and keeps the answer.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `operationId?` | `string` |
| `input` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<\{ `at`: `string` ; `operation`: `string` ; `ok`: `boolean` ; `status?`: `number` ; `message?`: `string`  }\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:503](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L503)

___

### call

▸ **call**(`ref`, `input?`, `options?`): `Promise`\<[`CallResult`](../interfaces/CallResult.md)\>

Calls `<connector>/<operationId>` with the inputs: the operation's parameters by name, the JSON body as `body`
or its fields as `body.<field>`. Answers { status, output }; a status other than 2xx throws a ConnectorError.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `string` |
| `input` | `Record`\<`string`, `any`\> |
| `options` | `Object` |
| `options.signal?` | `AbortSignal` |
| `options.test?` | `boolean` |
| `options.log?` | (`line`: `string`) => `void` |

#### Returns

`Promise`\<[`CallResult`](../interfaces/CallResult.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:526](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L526)

___

### exampleAnswer

▸ **exampleAnswer**(`connector`, `op`, `ref`, `input`, `log?`): [`CallResult`](../interfaces/CallResult.md)

An operation's answer outside production, with no call: the connector's own answer for it (testing.answers),
else its document's example of its first success response, else one made from that response's schema.

#### Parameters

| Name | Type |
| :------ | :------ |
| `connector` | [`Connector`](../interfaces/Connector.md) |
| `op` | [`Operation`](../interfaces/Operation.md) |
| `ref` | `string` |
| `input` | `Record`\<`string`, `any`\> |
| `log?` | (`line`: `string`) => `void` |

#### Returns

[`CallResult`](../interfaces/CallResult.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:579](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L579)

___

### checkTesting

▸ **checkTesting**(`testing`): [`ConnectorTesting`](../interfaces/ConnectorTesting.md)

A connector's testing, checked: its answer one of real, examples, sandbox; a sandbox's address an http(s) URL.

#### Parameters

| Name | Type |
| :------ | :------ |
| `testing` | `any` |

#### Returns

[`ConnectorTesting`](../interfaces/ConnectorTesting.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:602](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L602)

___

### backoff

▸ **backoff**(`attempt`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `attempt` | `number` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:617](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L617)

___

### buildRequest

▸ **buildRequest**(`connector`, `op`, `input`): `Object`

The request: the base URL joined with the operation's path, its parameters in place, the body, the key.

#### Parameters

| Name | Type |
| :------ | :------ |
| `connector` | [`Connector`](../interfaces/Connector.md) |
| `op` | [`Operation`](../interfaces/Operation.md) |
| `input` | `Record`\<`string`, `any`\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `headers` | `Record`\<`string`, `string`\> |
| `body` | `string` |
| `logUrl` | `string` |

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:623](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L623)

___

### readBody

▸ **readBody**(`response`, `ref`): `Promise`\<`any`\>

The body: JSON when it is, else text; refused past the size limit.

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | `Response` |
| `ref` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:686](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L686)

___

### readDocument

▸ **readDocument**(`input`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Object` |
| `input.id` | `string` |
| `input.source?` | `string` |
| `input.document?` | `string` \| `object` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:705](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L705)

___

### checkBaseUrl

▸ **checkBaseUrl**(`value`, `source?`): `string`

An http(s) URL on an allowed host; a relative server URL is read against the document's URL.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `source?` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:720](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L720)

___

### checkHost

▸ **checkHost**(`url`): `void`

CONNECTORS_ALLOW_HOSTS (a comma list; *.example.com for its subdomains), when set, limits the hosts.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `URL` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:735](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L735)
