[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/common](../modules/interfaces_common.md) / IConfiguration

# Interface: IConfiguration

[interfaces/common](../modules/interfaces_common.md).IConfiguration

## Implemented by

- [`Configuration`](../classes/common_DefaultConfiguration.Configuration.md)

## Table of contents

### Properties

- [apiKey](interfaces_common.IConfiguration.md#apikey)
- [database](interfaces_common.IConfiguration.md#database)
- [definitionsPath](interfaces_common.IConfiguration.md#definitionspath)
- [logger](interfaces_common.IConfiguration.md#logger)
- [templatesPath](interfaces_common.IConfiguration.md#templatespath)
- [timers](interfaces_common.IConfiguration.md#timers)

### Methods

- [appDelegate](interfaces_common.IConfiguration.md#appdelegate)
- [cacheManager](interfaces_common.IConfiguration.md#cachemanager)
- [dataStore](interfaces_common.IConfiguration.md#datastore)
- [definitions](interfaces_common.IConfiguration.md#definitions)
- [userService](interfaces_common.IConfiguration.md#userservice)

## Properties

### apiKey

• **apiKey**: `string`

#### Defined in

[src/interfaces/common.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L23)

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

#### Defined in

[src/interfaces/common.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L15)

___

### definitionsPath

• **definitionsPath**: `string`

#### Defined in

[src/interfaces/common.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L9)

___

### logger

• **logger**: [`ILogger`](interfaces_common.ILogger.md)

#### Defined in

[src/interfaces/common.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L24)

___

### templatesPath

• **templatesPath**: `string`

#### Defined in

[src/interfaces/common.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L10)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forceTimersDelay` | `number` |
| `precision` | `number` |

#### Defined in

[src/interfaces/common.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L11)

## Methods

### appDelegate

▸ **appDelegate**(`server`): [`IAppDelegate`](interfaces_common.IAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAppDelegate`](interfaces_common.IAppDelegate.md)

#### Defined in

[src/interfaces/common.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L26)

___

### cacheManager

▸ **cacheManager**(`server`): [`ICacheManager`](interfaces_server.ICacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ICacheManager`](interfaces_server.ICacheManager.md)

#### Defined in

[src/interfaces/common.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L28)

___

### dataStore

▸ **dataStore**(`server`): [`IDataStore`](interfaces_datastore.IDataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IDataStore`](interfaces_datastore.IDataStore.md)

#### Defined in

[src/interfaces/common.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L27)

___

### definitions

▸ **definitions**(`server`): [`IModelsDatastore`](interfaces_datastore.IModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IModelsDatastore`](interfaces_datastore.IModelsDatastore.md)

#### Defined in

[src/interfaces/common.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L25)

___

### userService

▸ **userService**(`server`): [`IUserService`](interfaces_User.IUserService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IUserService`](interfaces_User.IUserService.md)

#### Defined in

[src/interfaces/common.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/common.ts#L29)
