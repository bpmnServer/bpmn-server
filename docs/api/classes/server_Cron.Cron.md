[bpmn-server](../README.md) / [Exports](../modules.md) / [server/Cron](../modules/server_Cron.md) / Cron

# Class: Cron

[server/Cron](../modules/server_Cron.md).Cron

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](server_ServerComponent.ServerComponent.md)

  ↳ **`Cron`**

## Implements

- [`ICron`](../interfaces/interfaces_server.ICron.md)

## Table of contents

### Constructors

- [constructor](server_Cron.Cron.md#constructor)

### Properties

- [server](server_Cron.Cron.md#server)
- [checkingTimers](server_Cron.Cron.md#checkingtimers)
- [timersFired](server_Cron.Cron.md#timersfired)
- [timersStarted](server_Cron.Cron.md#timersstarted)

### Accessors

- [appDelegate](server_Cron.Cron.md#appdelegate)
- [cache](server_Cron.Cron.md#cache)
- [configuration](server_Cron.Cron.md#configuration)
- [cron](server_Cron.Cron.md#cron)
- [dataStore](server_Cron.Cron.md#datastore)
- [definitions](server_Cron.Cron.md#definitions)
- [engine](server_Cron.Cron.md#engine)
- [listener](server_Cron.Cron.md#listener)
- [logger](server_Cron.Cron.md#logger)

### Methods

- [checkTimers](server_Cron.Cron.md#checktimers)
- [itemTimerExpired](server_Cron.Cron.md#itemtimerexpired)
- [processTimerExpired](server_Cron.Cron.md#processtimerexpired)
- [scheduleItem](server_Cron.Cron.md#scheduleitem)
- [scheduleProcess](server_Cron.Cron.md#scheduleprocess)
- [start](server_Cron.Cron.md#start)
- [startTimers](server_Cron.Cron.md#starttimers)
- [checkCron](server_Cron.Cron.md#checkcron)
- [timeDue](server_Cron.Cron.md#timedue)
- [timerEnded](server_Cron.Cron.md#timerended)
- [timerScheduled](server_Cron.Cron.md#timerscheduled)

## Constructors

### constructor

• **new Cron**(`server`): [`Cron`](server_Cron.Cron.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md) |

#### Returns

[`Cron`](server_Cron.Cron.md)

#### Inherited from

[ServerComponent](server_ServerComponent.ServerComponent.md).[constructor](server_ServerComponent.ServerComponent.md#constructor)

#### Defined in

[src/server/ServerComponent.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L10)

## Properties

### server

• **server**: `any`

#### Inherited from

[ServerComponent](server_ServerComponent.ServerComponent.md).[server](server_ServerComponent.ServerComponent.md#server)

#### Defined in

[src/server/ServerComponent.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L9)

___

### checkingTimers

▪ `Static` `Private` **checkingTimers**: `boolean` = `false`

#### Defined in

[src/server/Cron.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L16)

___

### timersFired

▪ `Static` `Private` **timersFired**: `number` = `0`

#### Defined in

[src/server/Cron.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L17)

___

### timersStarted

▪ `Static` `Private` **timersStarted**: `boolean` = `false`

#### Defined in

[src/server/Cron.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L15)

## Accessors

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[src/server/ServerComponent.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L18)

___

### cache

• `get` **cache**(): [`CacheManager`](server_CacheManager.CacheManager.md)

#### Returns

[`CacheManager`](server_CacheManager.CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[src/server/ServerComponent.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L17)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[src/server/ServerComponent.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L14)

___

### cron

• `get` **cron**(): [`Cron`](server_Cron.Cron.md)

#### Returns

[`Cron`](server_Cron.Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[src/server/ServerComponent.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L16)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[src/server/ServerComponent.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[src/server/ServerComponent.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L21)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Returns

[`IEngine`](../interfaces/interfaces_server.IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[src/server/ServerComponent.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L19)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[src/server/ServerComponent.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L22)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[src/server/ServerComponent.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/ServerComponent.ts#L15)

## Methods

### checkTimers

▸ **checkTimers**(`duration?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `duration` | `number` | `0` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/interfaces_server.ICron.md).[checkTimers](../interfaces/interfaces_server.ICron.md#checktimers)

#### Defined in

[src/server/Cron.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L26)

___

### itemTimerExpired

▸ **itemTimerExpired**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/server/Cron.ts:89](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L89)

___

### processTimerExpired

▸ **processTimerExpired**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/server/Cron.ts:93](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L93)

___

### scheduleItem

▸ **scheduleItem**(`entry`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `any` |

#### Returns

`void`

#### Defined in

[src/server/Cron.ts:118](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L118)

___

### scheduleProcess

▸ **scheduleProcess**(`entry`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `any` |

#### Returns

`void`

#### Defined in

[src/server/Cron.ts:105](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L105)

___

### start

▸ **start**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/interfaces_server.ICron.md).[start](../interfaces/interfaces_server.ICron.md#start)

#### Defined in

[src/server/Cron.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L29)

___

### startTimers

▸ **startTimers**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/interfaces_server.ICron.md).[startTimers](../interfaces/interfaces_server.ICron.md#starttimers)

#### Defined in

[src/server/Cron.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L32)

___

### checkCron

▸ **checkCron**(`expression`, `referenceDateTime`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | `any` |
| `referenceDateTime` | `any` |

#### Returns

`number`

#### Defined in

[src/server/Cron.ts:128](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L128)

___

### timeDue

▸ **timeDue**(`expression`, `referenceDateTime`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | `any` |
| `referenceDateTime` | `any` |

#### Returns

`any`

#### Defined in

[src/server/Cron.ts:147](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L147)

___

### timerEnded

▸ **timerEnded**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Defined in

[src/server/Cron.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L22)

___

### timerScheduled

▸ **timerScheduled**(`timeDue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeDue` | `any` |

#### Returns

`void`

#### Defined in

[src/server/Cron.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Cron.ts#L19)
