[bpmn-server](../readme.md) / Configuration

# Class: Configuration

## Implements

- [`IConfiguration`](../interfaces/IConfiguration.md)

## Table of contents

### Constructors

- [constructor](Configuration.md#constructor)

### Properties

- [definitionsPath](Configuration.md#definitionspath)
- [templatesPath](Configuration.md#templatespath)
- [timers](Configuration.md#timers)
- [database](Configuration.md#database)
- [logger](Configuration.md#logger)
- [apiKey](Configuration.md#apikey)
- [sendGridAPIKey](Configuration.md#sendgridapikey)

### Methods

- [definitions](Configuration.md#definitions)
- [appDelegate](Configuration.md#appdelegate)
- [dataStore](Configuration.md#datastore)
- [cacheManager](Configuration.md#cachemanager)

## Constructors

### constructor

• **new Configuration**(`«destructured»`): [`Configuration`](Configuration.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `definitionsPath` | `any` |
| › `templatesPath` | `any` |
| › `timers` | `any` |
| › `database` | `any` |
| › `apiKey` | `any` |
| › `logger` | `any` |
| › `definitions` | `any` |
| › `appDelegate` | `any` |
| › `dataStore` | `any` |
| › `cacheManager` | `any` |

#### Returns

[`Configuration`](Configuration.md)

#### Defined in

[common/DefaultConfiguration.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L36)

## Properties

### definitionsPath

• **definitionsPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[definitionsPath](../interfaces/IConfiguration.md#definitionspath)

#### Defined in

[common/DefaultConfiguration.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L12)

___

### templatesPath

• **templatesPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[templatesPath](../interfaces/IConfiguration.md#templatespath)

#### Defined in

[common/DefaultConfiguration.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L13)

___

### timers

• **timers**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `forceTimersDelay` | `number` |
| `precision` | `number` |

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[timers](../interfaces/IConfiguration.md#timers)

#### Defined in

[common/DefaultConfiguration.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L14)

___

### database

• **database**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MongoDB` | \{ `db_url`: `string` ; `db`: `string`  } |
| `MongoDB.db_url` | `string` |
| `MongoDB.db` | `string` |
| `loopbackRepositories?` | `any` |

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[database](../interfaces/IConfiguration.md#database)

#### Defined in

[common/DefaultConfiguration.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L15)

___

### logger

• **logger**: [`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[logger](../interfaces/IConfiguration.md#logger)

#### Defined in

[common/DefaultConfiguration.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L19)

___

### apiKey

• **apiKey**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[apiKey](../interfaces/IConfiguration.md#apikey)

#### Defined in

[common/DefaultConfiguration.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L20)

___

### sendGridAPIKey

• **sendGridAPIKey**: `string`

#### Defined in

[common/DefaultConfiguration.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L21)

## Methods

### definitions

▸ **definitions**(`server`): [`ModelsDatastore`](ModelsDatastore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`ModelsDatastore`](ModelsDatastore.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[definitions](../interfaces/IConfiguration.md#definitions)

#### Defined in

[common/DefaultConfiguration.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L22)

___

### appDelegate

▸ **appDelegate**(`server`): [`IAppDelegate`](../interfaces/IAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAppDelegate`](../interfaces/IAppDelegate.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[appDelegate](../interfaces/IConfiguration.md#appdelegate)

#### Defined in

[common/DefaultConfiguration.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L25)

___

### dataStore

▸ **dataStore**(`server`): [`DataStore`](DataStore.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`DataStore`](DataStore.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[dataStore](../interfaces/IConfiguration.md#datastore)

#### Defined in

[common/DefaultConfiguration.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L28)

___

### cacheManager

▸ **cacheManager**(`server`): [`NoCacheManager`](NoCacheManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`NoCacheManager`](NoCacheManager.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[cacheManager](../interfaces/IConfiguration.md#cachemanager)

#### Defined in

[common/DefaultConfiguration.ts:31](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L31)
