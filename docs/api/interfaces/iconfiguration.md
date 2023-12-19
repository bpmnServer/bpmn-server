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

[interfaces/common.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-23)

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

[interfaces/common.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-15)

___

### definitionsPath

• **definitionsPath**: `string`

#### Defined in

[interfaces/common.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-9)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Defined in

[interfaces/common.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-24)

___

### templatesPath

• **templatesPath**: `string`

#### Defined in

[interfaces/common.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-10)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forceTimersDelay` | `number` |
| `precision` | `number` |

#### Defined in

[interfaces/common.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-11)

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

[interfaces/common.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-26)

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

[interfaces/common.ts:28](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-28)

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

[interfaces/common.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-27)

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

[interfaces/common.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-25)

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

[interfaces/common.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-29)
