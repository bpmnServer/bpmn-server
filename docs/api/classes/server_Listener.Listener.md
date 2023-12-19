[bpmn-server](../README.md) / [Exports](../modules.md) / [server/Listener](../modules/server_Listener.md) / Listener

# Class: Listener

[server/Listener](../modules/server_Listener.md).Listener

## Hierarchy

- `EventEmitter`

  ↳ **`Listener`**

## Table of contents

### Constructors

- [constructor](server_Listener.Listener.md#constructor)

### Properties

- [captureRejectionSymbol](server_Listener.Listener.md#capturerejectionsymbol)
- [captureRejections](server_Listener.Listener.md#capturerejections)
- [defaultMaxListeners](server_Listener.Listener.md#defaultmaxlisteners)
- [errorMonitor](server_Listener.Listener.md#errormonitor)

### Methods

- [addListener](server_Listener.Listener.md#addlistener)
- [delegateEvent](server_Listener.Listener.md#delegateevent)
- [doEvent](server_Listener.Listener.md#doevent)
- [emit](server_Listener.Listener.md#emit)
- [eventNames](server_Listener.Listener.md#eventnames)
- [getMaxListeners](server_Listener.Listener.md#getmaxlisteners)
- [listenerCount](server_Listener.Listener.md#listenercount)
- [listeners](server_Listener.Listener.md#listeners)
- [off](server_Listener.Listener.md#off)
- [on](server_Listener.Listener.md#on)
- [once](server_Listener.Listener.md#once)
- [prependListener](server_Listener.Listener.md#prependlistener)
- [prependOnceListener](server_Listener.Listener.md#prependoncelistener)
- [rawListeners](server_Listener.Listener.md#rawlisteners)
- [removeAllListeners](server_Listener.Listener.md#removealllisteners)
- [removeListener](server_Listener.Listener.md#removelistener)
- [setMaxListeners](server_Listener.Listener.md#setmaxlisteners)
- [listenerCount](server_Listener.Listener.md#listenercount-1)
- [on](server_Listener.Listener.md#on-1)
- [once](server_Listener.Listener.md#once-1)

## Constructors

### constructor

• **new Listener**(): [`Listener`](server_Listener.Listener.md)

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.constructor

#### Defined in

node_modules/@types/node/events.d.ts:11

## Properties

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](server_Listener.Listener.md#capturerejectionsymbol)

#### Inherited from

EventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:30

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

EventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:36

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:37

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](server_Listener.Listener.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

EventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:29

## Methods

### addListener

▸ **addListener**(`event`, `listener`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/globals.d.ts:730

___

### delegateEvent

▸ **delegateEvent**(`event`, `execution`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |
| `execution` | [`IExecution`](../interfaces/interfaces_engine.IExecution.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/server/Listener.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Listener.ts#L12)

___

### doEvent

▸ **doEvent**(`event`, `execution`, `item?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `event` | `any` | `undefined` |
| `execution` | `any` | `undefined` |
| `item` | `any` | `null` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/server/Listener.ts:6](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/server/Listener.ts#L6)

___

### emit

▸ **emit**(`event`, `...args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/globals.d.ts:740

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:745

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:737

___

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/globals.d.ts:741

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:738

___

### off

▸ **off**(`event`, `listener`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/globals.d.ts:734

___

### on

▸ **on**(`event`, `listener`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/globals.d.ts:731

___

### once

▸ **once**(`event`, `listener`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/globals.d.ts:732

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/globals.d.ts:743

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/globals.d.ts:744

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:739

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:735

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/globals.d.ts:733

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`Listener`](server_Listener.Listener.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`Listener`](server_Listener.Listener.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:736

___

### listenerCount

▸ **listenerCount**(`emitter`, `event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

**`Deprecated`**

since v4.0.0

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:18

___

### on

▸ **on**(`emitter`, `event`): `AsyncIterableIterator`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` |

#### Returns

`AsyncIterableIterator`\<`any`\>

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:15

___

### once

▸ **once**(`emitter`, `event`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:13

▸ **once**(`emitter`, `event`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:14
