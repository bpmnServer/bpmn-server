[bpmn-server](../README.md) / Configuration

# Class: Configuration

## Implements

- [`IConfiguration`](../interfaces/IConfiguration.md)

## Table of contents

### Constructors

- [constructor](Configuration.md#constructor)

### Properties

- [apiKey](Configuration.md#apikey)
- [database](Configuration.md#database)
- [definitionsPath](Configuration.md#definitionspath)
- [logger](Configuration.md#logger)
- [sendGridAPIKey](Configuration.md#sendgridapikey)
- [templatesPath](Configuration.md#templatespath)
- [timers](Configuration.md#timers)

### Methods

- [appDelegate](Configuration.md#appdelegate)
- [cacheManager](Configuration.md#cachemanager)
- [dataStore](Configuration.md#datastore)
- [definitions](Configuration.md#definitions)
- [userService](Configuration.md#userservice)

## Constructors

### constructor

• **new Configuration**(`«destructured»`): [`Configuration`](Configuration.md)

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

[`Configuration`](Configuration.md)

#### Defined in

[common/DefaultConfiguration.ts:39](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L39)

## Properties

### apiKey

• **apiKey**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[apiKey](../interfaces/IConfiguration.md#apikey)

#### Defined in

[common/DefaultConfiguration.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L20)

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

[IConfiguration](../interfaces/IConfiguration.md).[database](../interfaces/IConfiguration.md#database)

#### Defined in

[common/DefaultConfiguration.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L15)

___

### definitionsPath

• **definitionsPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[definitionsPath](../interfaces/IConfiguration.md#definitionspath)

#### Defined in

[common/DefaultConfiguration.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L12)

___

### logger

• **logger**: [`ILogger`](../interfaces/ILogger.md)

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[logger](../interfaces/IConfiguration.md#logger)

#### Defined in

[common/DefaultConfiguration.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L19)

___

### sendGridAPIKey

• **sendGridAPIKey**: `string`

#### Defined in

[common/DefaultConfiguration.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L21)

___

### templatesPath

• **templatesPath**: `string`

#### Implementation of

[IConfiguration](../interfaces/IConfiguration.md).[templatesPath](../interfaces/IConfiguration.md#templatespath)

#### Defined in

[common/DefaultConfiguration.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L13)

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

[common/DefaultConfiguration.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L14)

## Methods

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

[common/DefaultConfiguration.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L25)

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

[common/DefaultConfiguration.ts:31](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L31)

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

[common/DefaultConfiguration.ts:28](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L28)

___

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

[common/DefaultConfiguration.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L22)

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

[IConfiguration](../interfaces/IConfiguration.md).[userService](../interfaces/IConfiguration.md#userservice)

#### Defined in

[common/DefaultConfiguration.ts:34](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L34)
