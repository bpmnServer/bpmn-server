[bpmn-server](../readme.md) / Cron

# Class: Cron

super class for various objects that are part of the server

## Hierarchy

- [`ServerComponent`](ServerComponent.md)

  ↳ **`Cron`**

## Implements

- [`ICron`](../interfaces/ICron.md)

## Table of contents

### Constructors

- [constructor](Cron.md#constructor)

### Properties

- [timersStarted](Cron.md#timersstarted)
- [checkingTimers](Cron.md#checkingtimers)
- [timersFired](Cron.md#timersfired)
- [server](Cron.md#server)

### Accessors

- [configuration](Cron.md#configuration)
- [logger](Cron.md#logger)
- [cron](Cron.md#cron)
- [cache](Cron.md#cache)
- [appDelegate](Cron.md#appdelegate)
- [engine](Cron.md#engine)
- [dataStore](Cron.md#datastore)
- [definitions](Cron.md#definitions)
- [listener](Cron.md#listener)

### Methods

- [timerScheduled](Cron.md#timerscheduled)
- [timerEnded](Cron.md#timerended)
- [checkTimers](Cron.md#checktimers)
- [start](Cron.md#start)
- [startTimers](Cron.md#starttimers)
- [itemTimerExpired](Cron.md#itemtimerexpired)
- [processTimerExpired](Cron.md#processtimerexpired)
- [scheduleProcess](Cron.md#scheduleprocess)
- [scheduleItem](Cron.md#scheduleitem)
- [checkCron](Cron.md#checkcron)
- [timeDue](Cron.md#timedue)

## Constructors

### constructor

• **new Cron**(`server`): [`Cron`](Cron.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |

#### Returns

[`Cron`](Cron.md)

#### Inherited from

[ServerComponent](ServerComponent.md).[constructor](ServerComponent.md#constructor)

#### Defined in

[server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L10)

## Properties

### timersStarted

▪ `Static` `Private` **timersStarted**: `boolean` = `false`

#### Defined in

[server/Cron.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L15)

___

### checkingTimers

▪ `Static` `Private` **checkingTimers**: `boolean` = `false`

#### Defined in

[server/Cron.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L16)

___

### timersFired

▪ `Static` `Private` **timersFired**: `number` = `0`

#### Defined in

[server/Cron.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L17)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[server/ServerComponent.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L9)

## Accessors

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[server/ServerComponent.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L14)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L15)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L16)

___

### cache

• `get` **cache**(): [`CacheManager`](CacheManager.md)

#### Returns

[`CacheManager`](CacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L17)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L18)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L19)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L20)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L21)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[server/ServerComponent.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/ServerComponent.ts#L22)

## Methods

### timerScheduled

▸ **timerScheduled**(`timeDue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeDue` | `any` |

#### Returns

`void`

#### Defined in

[server/Cron.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L19)

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

[server/Cron.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L22)

___

### checkTimers

▸ **checkTimers**(`duration?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `duration` | `number` | `0` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/ICron.md).[checkTimers](../interfaces/ICron.md#checktimers)

#### Defined in

[server/Cron.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L26)

___

### start

▸ **start**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/ICron.md).[start](../interfaces/ICron.md#start)

#### Defined in

[server/Cron.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L29)

___

### startTimers

▸ **startTimers**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/ICron.md).[startTimers](../interfaces/ICron.md#starttimers)

#### Defined in

[server/Cron.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L32)

___

### itemTimerExpired

▸ **itemTimerExpired**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/Cron.ts:89](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L89)

___

### processTimerExpired

▸ **processTimerExpired**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[server/Cron.ts:93](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L93)

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

[server/Cron.ts:105](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L105)

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

[server/Cron.ts:118](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L118)

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

[server/Cron.ts:128](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L128)

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

[server/Cron.ts:147](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/server/Cron.ts#L147)
