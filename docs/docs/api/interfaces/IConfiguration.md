[bpmn-server](../readme.md) / IConfiguration

# Interface: IConfiguration

## Implemented by

- [`Configuration`](../classes/Configuration.md)

## Table of contents

### Properties

- [definitionsPath](IConfiguration.md#definitionspath)
- [templatesPath](IConfiguration.md#templatespath)
- [timers](IConfiguration.md#timers)
- [database](IConfiguration.md#database)
- [apiKey](IConfiguration.md#apikey)
- [logger](IConfiguration.md#logger)

### Methods

- [definitions](IConfiguration.md#definitions)
- [appDelegate](IConfiguration.md#appdelegate)
- [dataStore](IConfiguration.md#datastore)
- [cacheManager](IConfiguration.md#cachemanager)

## Properties

### definitionsPath

• **definitionsPath**: `string`

#### Defined in

[interfaces/common.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L9)

___

### templatesPath

• **templatesPath**: `string`

#### Defined in

[interfaces/common.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L10)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forceTimersDelay` | `number` |
| `precision` | `number` |

#### Defined in

[interfaces/common.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L11)

___

### database

• **database**: `IMongoDBDatabaseConfiguration` \| `ISQLiteDatabaseConfiguration`

#### Defined in

[interfaces/common.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L15)

___

### apiKey

• **apiKey**: `string`

#### Defined in

[interfaces/common.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L16)

___

### logger

• **logger**: [`ILogger`](ILogger.md)

#### Defined in

[interfaces/common.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L17)

## Methods

### definitions

▸ **definitions**(`server`): [`IModelsDatastore`](IModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IModelsDatastore`](IModelsDatastore.md)

#### Defined in

[interfaces/common.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L18)

___

### appDelegate

▸ **appDelegate**(`server`): [`IAppDelegate`](IAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAppDelegate`](IAppDelegate.md)

#### Defined in

[interfaces/common.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L19)

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

[interfaces/common.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L20)

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

[interfaces/common.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L21)
