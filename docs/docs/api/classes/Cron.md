[bpmn-server](../readme.md) / Cron

# Class: Cron

The server's timers: every one it schedules is its own (cancelled by `stop()`, and by an
instance's cancellation), keyed so that a timer is scheduled once in this process.

Across processes, a timer fires once: before firing, the server claims it through the lock
port (`timer:<item>:<due>`, or `timer:process:<model>:<element>:<due>`), and an item timer
fires only while its item still waits. A server that stops leaves its timers in the store;
the others pick them up on their next re-read (`timers.pollInterval`). A claim expires after the
lock port's stale age, so a timer whose firing failed is tried again then.

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
- [stopped](Cron.md#stopped)
- [scheduled](Cron.md#scheduled)
- [poller](Cron.md#poller)
- [counters](Cron.md#counters)
- [server](Cron.md#server)

### Accessors

- [pending](Cron.md#pending)
- [configuration](Cron.md#configuration)
- [logger](Cron.md#logger)
- [cron](Cron.md#cron)
- [cache](Cron.md#cache)
- [appDelegate](Cron.md#appdelegate)
- [engine](Cron.md#engine)
- [dataStore](Cron.md#datastore)
- [lockManager](Cron.md#lockmanager)
- [definitions](Cron.md#definitions)
- [listener](Cron.md#listener)
- [scriptHandler](Cron.md#scripthandler)

### Methods

- [timerScheduled](Cron.md#timerscheduled)
- [timerEnded](Cron.md#timerended)
- [start](Cron.md#start)
- [stop](Cron.md#stop)
- [startTimers](Cron.md#starttimers)
- [checkTimers](Cron.md#checktimers)
- [scheduleItemTimer](Cron.md#scheduleitemtimer)
- [cancelInstance](Cron.md#cancelinstance)
- [scheduleItem](Cron.md#scheduleitem)
- [itemTimerExpired](Cron.md#itemtimerexpired)
- [processTimerExpired](Cron.md#processtimerexpired)
- [scheduleProcess](Cron.md#scheduleprocess)
- [schedule](Cron.md#schedule)
- [fireClaimed](Cron.md#fireclaimed)
- [report](Cron.md#report)
- [time](Cron.md#time)
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

[packages/bpmn-server/src/server/ServerComponent.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L11)

## Properties

### timersStarted

• `Private` **timersStarted**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L27)

___

### stopped

• `Private` **stopped**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L28)

___

### scheduled

• `Private` `Readonly` **scheduled**: `Map`\<`string`, `Scheduled`\>

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L29)

___

### poller

• `Private` **poller**: `Timeout` = `null`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L30)

___

### counters

• `Readonly` **counters**: `Object`

Timers this server scheduled and fired: its own counters.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `scheduled` | `number` |
| `fired` | `number` |
| `skipped` | `number` |
| `failed` | `number` |

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L32)

___

### server

• **server**: `any`

#### Inherited from

[ServerComponent](ServerComponent.md).[server](ServerComponent.md#server)

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L10)

## Accessors

### pending

• `get` **pending**(): `number`

How many timers are scheduled now.

#### Returns

`number`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L59)

___

### configuration

• `get` **configuration**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.configuration

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L15)

___

### logger

• `get` **logger**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.logger

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L16)

___

### cron

• `get` **cron**(): [`Cron`](Cron.md)

#### Returns

[`Cron`](Cron.md)

#### Inherited from

ServerComponent.cron

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L17)

___

### cache

• `get` **cache**(): [`ICacheManager`](../interfaces/ICacheManager.md)

#### Returns

[`ICacheManager`](../interfaces/ICacheManager.md)

#### Inherited from

ServerComponent.cache

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L18)

___

### appDelegate

• `get` **appDelegate**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.appDelegate

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L19)

___

### engine

• `get` **engine**(): [`IEngine`](../interfaces/IEngine.md)

#### Returns

[`IEngine`](../interfaces/IEngine.md)

#### Inherited from

ServerComponent.engine

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L20)

___

### dataStore

• `get` **dataStore**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.dataStore

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L21)

___

### lockManager

• `get` **lockManager**(): `any`

The lock port: the configuration's, else the data store's.

#### Returns

`any`

#### Inherited from

ServerComponent.lockManager

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L23)

___

### definitions

• `get` **definitions**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.definitions

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L24)

___

### listener

• `get` **listener**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.listener

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L25)

___

### scriptHandler

• `get` **scriptHandler**(): `any`

#### Returns

`any`

#### Inherited from

ServerComponent.scriptHandler

#### Defined in

[packages/bpmn-server/src/server/ServerComponent.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/ServerComponent.ts#L26)

## Methods

### timerScheduled

▸ **timerScheduled**(`timeDue`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `timeDue` | `any` |

#### Returns

`void`

**`Deprecated`**

The counters are the server's (`cron.counters`); kept for callers of the earlier form.

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L35)

___

### timerEnded

▸ **timerEnded**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

**`Deprecated`**

See [timerScheduled](Cron.md#timerscheduled).

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L37)

___

### start

▸ **start**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/ICron.md).[start](../interfaces/ICron.md#start)

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L39)

___

### stop

▸ **stop**(): `void`

Cancels every timer this server owns, and its re-reads.

#### Returns

`void`

#### Implementation of

[ICron](../interfaces/ICron.md).[stop](../interfaces/ICron.md#stop)

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L50)

___

### startTimers

▸ **startTimers**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/ICron.md).[startTimers](../interfaces/ICron.md#starttimers)

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L61)

___

### checkTimers

▸ **checkTimers**(`duration?`): `Promise`\<`void`\>

Schedules every waiting timer item in the store that this server has not scheduled yet: recovery at start, and the periodic re-read.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `duration` | `number` | `0` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ICron](../interfaces/ICron.md).[checkTimers](../interfaces/ICron.md#checktimers)

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:81](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L81)

___

### scheduleItemTimer

▸ **scheduleItemTimer**(`item`, `onDue`): `void`

Schedules a timer item's `onDue` (the Timer behaviour's own firing), claimed first, unless this server has already scheduled it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `Object` |
| `item.id` | `string` |
| `item.timeDue` | `any` |
| `item.instanceId?` | `string` |
| `onDue` | () => `Promise`\<`void`\> |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:96](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L96)

___

### cancelInstance

▸ **cancelInstance**(`instanceId`): `void`

Cancels the timers of one instance (its cancellation).

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:101](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L101)

___

### scheduleItem

▸ **scheduleItem**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:107](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L107)

___

### itemTimerExpired

▸ **itemTimerExpired**(`entry`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:112](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L112)

___

### processTimerExpired

▸ **processTimerExpired**(`event`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:129](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L129)

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

[packages/bpmn-server/src/server/Cron.ts:135](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L135)

___

### schedule

▸ **schedule**(`key`, `delayMs`, `instanceId`, `fire`): `void`

One timer, owned by this server, once per key; a delay longer than `setTimeout` takes is waited out in steps.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `delayMs` | `number` |
| `instanceId` | `string` |
| `fire` | () => `Promise`\<`void`\> |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:147](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L147)

___

### fireClaimed

▸ **fireClaimed**(`claim`, `fire`): `Promise`\<`void`\>

Fires `fire` when this server wins the claim on `claim`; otherwise another server has fired, or is firing, it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `claim` | `string` |
| `fire` | () => `Promise`\<`void`\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:161](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L161)

___

### report

▸ **report**(`error`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:171](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L171)

___

### time

▸ **time**(`value`): `number`

A due time as milliseconds: stored as a number, a Date, or (by a JSON store) an ISO string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`number`

#### Defined in

[packages/bpmn-server/src/server/Cron.ts:176](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L176)

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

[packages/bpmn-server/src/server/Cron.ts:181](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L181)

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

[packages/bpmn-server/src/server/Cron.ts:200](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/Cron.ts#L200)
