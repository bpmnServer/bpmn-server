[bpmn-server](../README.md) / [Exports](../modules.md) / [common/DefaultConfiguration](../modules/common_DefaultConfiguration.md) / Configuration

# Class: Configuration

[common/DefaultConfiguration](../modules/common_DefaultConfiguration.md).Configuration

## Implements

- [`IConfiguration`](../interfaces/interfaces_common.IConfiguration.md)

## Table of contents

### Constructors

- [constructor](common_DefaultConfiguration.Configuration.md#constructor)

### Properties

- [apiKey](common_DefaultConfiguration.Configuration.md#apikey)
- [database](common_DefaultConfiguration.Configuration.md#database)
- [definitionsPath](common_DefaultConfiguration.Configuration.md#definitionspath)
- [logger](common_DefaultConfiguration.Configuration.md#logger)
- [sendGridAPIKey](common_DefaultConfiguration.Configuration.md#sendgridapikey)
- [templatesPath](common_DefaultConfiguration.Configuration.md#templatespath)
- [timers](common_DefaultConfiguration.Configuration.md#timers)

### Methods

- [appDelegate](common_DefaultConfiguration.Configuration.md#appdelegate)
- [cacheManager](common_DefaultConfiguration.Configuration.md#cachemanager)
- [dataStore](common_DefaultConfiguration.Configuration.md#datastore)
- [definitions](common_DefaultConfiguration.Configuration.md#definitions)
- [userService](common_DefaultConfiguration.Configuration.md#userservice)

## Constructors

### constructor

• **new Configuration**(`«destructured»`): [`Configuration`](common_DefaultConfiguration.Configuration.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `apiKey` | `any` |
| › `appDelegate` | `any` |
| › `cacheManager` | `any` |
| › `dataStore` | `any` |
| › `database` | `any` |
| › `definitions` | `any` |
| › `definitionsPath` | `any` |
| › `logger` | `any` |
| › `templatesPath` | `any` |
| › `timers` | `any` |
| › `userService` | `any` |

#### Returns

[`Configuration`](common_DefaultConfiguration.Configuration.md)

#### Defined in

[src/common/DefaultConfiguration.ts:39](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L39)

## Properties

### apiKey

• **apiKey**: `string`

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[apiKey](../interfaces/interfaces_common.IConfiguration.md#apikey)

#### Defined in

[src/common/DefaultConfiguration.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L20)

___

### database

• **database**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MongoDB` | \{ `db`: `string` ; `db_url`: `string`  } |
| `MongoDB.db` | `string` |
| `MongoDB.db_url` | `string` |
| `loopbackRepositories?` | `any` |

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[database](../interfaces/interfaces_common.IConfiguration.md#database)

#### Defined in

[src/common/DefaultConfiguration.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L15)

___

### definitionsPath

• **definitionsPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[definitionsPath](../interfaces/interfaces_common.IConfiguration.md#definitionspath)

#### Defined in

[src/common/DefaultConfiguration.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L12)

___

### logger

• **logger**: [`ILogger`](../interfaces/interfaces_common.ILogger.md)

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[logger](../interfaces/interfaces_common.IConfiguration.md#logger)

#### Defined in

[src/common/DefaultConfiguration.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L19)

___

### sendGridAPIKey

• **sendGridAPIKey**: `string`

#### Defined in

[src/common/DefaultConfiguration.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L21)

___

### templatesPath

• **templatesPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[templatesPath](../interfaces/interfaces_common.IConfiguration.md#templatespath)

#### Defined in

[src/common/DefaultConfiguration.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L13)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forceTimersDelay` | `number` |
| `precision` | `number` |

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[timers](../interfaces/interfaces_common.IConfiguration.md#timers)

#### Defined in

[src/common/DefaultConfiguration.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L14)

## Methods

### appDelegate

▸ **appDelegate**(`server`): [`IAppDelegate`](../interfaces/interfaces_common.IAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAppDelegate`](../interfaces/interfaces_common.IAppDelegate.md)

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[appDelegate](../interfaces/interfaces_common.IConfiguration.md#appdelegate)

#### Defined in

[src/common/DefaultConfiguration.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L25)

___

### cacheManager

▸ **cacheManager**(`server`): [`NoCacheManager`](server_CacheManager.NoCacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`NoCacheManager`](server_CacheManager.NoCacheManager.md)

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[cacheManager](../interfaces/interfaces_common.IConfiguration.md#cachemanager)

#### Defined in

[src/common/DefaultConfiguration.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L31)

___

### dataStore

▸ **dataStore**(`server`): [`DataStore`](datastore_DataStore.DataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`DataStore`](datastore_DataStore.DataStore.md)

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[dataStore](../interfaces/interfaces_common.IConfiguration.md#datastore)

#### Defined in

[src/common/DefaultConfiguration.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L28)

___

### definitions

▸ **definitions**(`server`): [`ModelsDatastore`](datastore_ModelsDatastore.ModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ModelsDatastore`](datastore_ModelsDatastore.ModelsDatastore.md)

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[definitions](../interfaces/interfaces_common.IConfiguration.md#definitions)

#### Defined in

[src/common/DefaultConfiguration.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L22)

___

### userService

▸ **userService**(`server`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

`any`

#### Implementation of

[IConfiguration](../interfaces/interfaces_common.IConfiguration.md).[userService](../interfaces/interfaces_common.IConfiguration.md#userservice)

#### Defined in

[src/common/DefaultConfiguration.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/DefaultConfiguration.ts#L34)
