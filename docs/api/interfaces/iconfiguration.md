[bpmn-server](../README.md) / IConfiguration

# Interface: IConfiguration

## Implemented by

- [`Configuration`](../classes/Configuration.md)

## Table of contents

### Properties

- [apiKey](IConfiguration.md#apikey)
- [database](IConfiguration.md#database)
- [definitionsPath](IConfiguration.md#definitionspath)
- [logger](IConfiguration.md#logger)
- [templatesPath](IConfiguration.md#templatespath)
- [timers](IConfiguration.md#timers)

### Methods

- [appDelegate](IConfiguration.md#appdelegate)
- [cacheManager](IConfiguration.md#cachemanager)
- [dataStore](IConfiguration.md#datastore)
- [definitions](IConfiguration.md#definitions)
- [userService](IConfiguration.md#userservice)

## Properties

### apiKey

• **apiKey**: `string`

#### Defined in

[interfaces/common.ts:23](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L23)

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

[interfaces/common.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L15)

___

### definitionsPath

• **definitionsPath**: `string`

#### Defined in

[interfaces/common.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L9)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Defined in

[interfaces/common.ts:24](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L24)

___

### templatesPath

• **templatesPath**: `string`

#### Defined in

[interfaces/common.ts:10](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L10)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forceTimersDelay` | `number` |
| `precision` | `number` |

#### Defined in

[interfaces/common.ts:11](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L11)

## Methods

### appDelegate

▸ **appDelegate**(`server`): [`IAppDelegate`](IAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAppDelegate`](IAppDelegate.md)

#### Defined in

[interfaces/common.ts:26](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L26)

___

### cacheManager

▸ **cacheManager**(`server`): [`ICacheManager`](ICacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ICacheManager`](ICacheManager.md)

#### Defined in

[interfaces/common.ts:28](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L28)

___

### dataStore

▸ **dataStore**(`server`): [`IDataStore`](IDataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IDataStore`](IDataStore.md)

#### Defined in

[interfaces/common.ts:27](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L27)

___

### definitions

▸ **definitions**(`server`): [`IModelsDatastore`](IModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IModelsDatastore`](IModelsDatastore.md)

#### Defined in

[interfaces/common.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L25)

___

### userService

▸ **userService**(`server`): [`IUserService`](IUserService.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IUserService`](IUserService.md)

#### Defined in

[interfaces/common.ts:29](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/common.ts#L29)
