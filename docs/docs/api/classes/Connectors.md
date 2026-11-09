[bpmn-server](../readme.md) / Connectors

# Class: Connectors

## Table of contents

### Constructors

- [constructor](Connectors.md#constructor)

### Properties

- [compiled](Connectors.md#compiled)
- [server](Connectors.md#server)

### Accessors

- [settings](Connectors.md#settings)
- [store](Connectors.md#store)
- [database](Connectors.md#database)

### Methods

- [compile](Connectors.md#compile)
- [install](Connectors.md#install)
- [list](Connectors.md#list)
- [get](Connectors.md#get)
- [operations](Connectors.md#operations)
- [document](Connectors.md#document)
- [backup](Connectors.md#backup)
- [load](Connectors.md#load)
- [upgrade](Connectors.md#upgrade)
- [required](Connectors.md#required)
- [withoutSecret](Connectors.md#withoutsecret)
- [add](Connectors.md#add)
- [update](Connectors.md#update)
- [refresh](Connectors.md#refresh)
- [openapiOf](Connectors.md#openapiof)
- [remove](Connectors.md#remove)
- [setKey](Connectors.md#setkey)
- [clearKey](Connectors.md#clearkey)
- [authScheme](Connectors.md#authscheme)
- [fromScheme](Connectors.md#fromscheme)
- [test](Connectors.md#test)
- [call](Connectors.md#call)
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

[packages/bpmn-server/src/connectors/Connectors.ts:108](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L108)

## Properties

### compiled

• `Private` `Readonly` **compiled**: `Map`\<`string`, \{ `stamp`: `string` ; `document`: `any` ; `operations`: `Map`\<`string`, [`Operation`](../interfaces/Operation.md)\>  }\>

each connector's document and operations, read once and kept until the document changes

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:106](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L106)

___

### server

• `Private` `Readonly` **server**: [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:108](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L108)

## Accessors

### settings

• `get` **settings**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:121](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L121)

___

### store

• `get` **store**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:122](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L122)

___

### database

• `get` **database**(): `any`

The logical database, as the data store has it (ignored by single-database stores). A MongoDB configuration
without a `db` leaves it undefined: MongoDB then uses the database its URL names.

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:127](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L127)

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

[packages/bpmn-server/src/connectors/Connectors.ts:111](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L111)

___

### install

▸ **install**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:129](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L129)

___

### list

▸ **list**(): `Promise`\<[`Connector`](../interfaces/Connector.md)[]\>

Every connector, without its key.

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)[]\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:136](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L136)

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

[packages/bpmn-server/src/connectors/Connectors.ts:142](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L142)

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

[packages/bpmn-server/src/connectors/Connectors.ts:148](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L148)

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

[packages/bpmn-server/src/connectors/Connectors.ts:155](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L155)

___

### backup

▸ **backup**(): `Promise`\<`Record`\<`string`, `any`[]\>\>

Every connector as stored (keys encrypted): for a backup.

#### Returns

`Promise`\<`Record`\<`string`, `any`[]\>\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:160](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L160)

___

### load

▸ **load**(`id`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:164](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L164)

___

### upgrade

▸ **upgrade**(`connector`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

A connector stored before documents were packed (openapi.document): packed now, and saved so.

#### Parameters

| Name | Type |
| :------ | :------ |
| `connector` | `any` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:170](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L170)

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

[packages/bpmn-server/src/connectors/Connectors.ts:180](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L180)

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

[packages/bpmn-server/src/connectors/Connectors.ts:187](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L187)

___

### add

▸ **add**(`input`, `userName?`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Adds a connector from its OpenAPI document (given, or fetched from `source`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ConnectorInput`](../interfaces/ConnectorInput.md) |
| `userName?` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:201](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L201)

___

### update

▸ **update**(`id`, `patch`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Changes a connector's name, description, base URL, operations, groups, enabled, timeout or retries.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `patch` | `Partial`\<`Pick`\<[`Connector`](../interfaces/Connector.md), ``"name"`` \| ``"timeout"`` \| ``"description"`` \| ``"baseUrl"`` \| ``"operations"`` \| ``"groups"`` \| ``"enabled"`` \| ``"retries"``\>\> |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:230](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L230)

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

[packages/bpmn-server/src/connectors/Connectors.ts:246](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L246)

___

### openapiOf

▸ **openapiOf**(`document`, `source?`): `Object`

What is stored of a document: where it came from, its version and title, and itself packed.

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
| `packed` | `string` |
| `bytes` | `number` |

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:261](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L261)

___

### remove

▸ **remove**(`id`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:266](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L266)

___

### setKey

▸ **setKey**(`id`, `key`, `how?`, `userName?`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Sets (or replaces) the connector's authorization key, stored encrypted. `how` is a securitySchemes name of the
document, or a scheme given here; none: the document's only scheme. For basic, the key is `user:password`.

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

[packages/bpmn-server/src/connectors/Connectors.ts:276](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L276)

___

### clearKey

▸ **clearKey**(`id`): `Promise`\<[`Connector`](../interfaces/Connector.md)\>

Removes the connector's key: its calls go without authorization.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<[`Connector`](../interfaces/Connector.md)\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:289](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L289)

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

[packages/bpmn-server/src/connectors/Connectors.ts:296](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L296)

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

[packages/bpmn-server/src/connectors/Connectors.ts:318](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L318)

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

[packages/bpmn-server/src/connectors/Connectors.ts:326](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L326)

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

[packages/bpmn-server/src/connectors/Connectors.ts:349](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L349)

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

[packages/bpmn-server/src/connectors/Connectors.ts:393](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L393)

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

[packages/bpmn-server/src/connectors/Connectors.ts:399](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L399)

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

[packages/bpmn-server/src/connectors/Connectors.ts:462](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L462)

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

[packages/bpmn-server/src/connectors/Connectors.ts:481](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L481)

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

[packages/bpmn-server/src/connectors/Connectors.ts:496](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L496)

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

[packages/bpmn-server/src/connectors/Connectors.ts:511](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L511)
