[bpmn-server](../readme.md) / Logger

# Class: Logger

A logging tool to take various message for monitoring and debugging

it can also keep the message in memory till saved later through saveToFile
msgs can be cleared by the clean method

## Implements

- [`ILogger`](../interfaces/ILogger.md)

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Properties

- [debugMsgs](Logger.md#debugmsgs)
- [toConsole](Logger.md#toconsole)
- [toFile](Logger.md#tofile)
- [callback](Logger.md#callback)
- [level](Logger.md#level)
- [keepMessages](Logger.md#keepmessages)

### Methods

- [setOptions](Logger.md#setoptions)
- [msg](Logger.md#msg)
- [clear](Logger.md#clear)
- [get](Logger.md#get)
- [info](Logger.md#info)
- [decision](Logger.md#decision)
- [debug](Logger.md#debug)
- [warn](Logger.md#warn)
- [log](Logger.md#log)
- [logS](Logger.md#logs)
- [logE](Logger.md#loge)
- [toString](Logger.md#tostring)
- [reportError](Logger.md#reporterror)
- [error](Logger.md#error)
- [save](Logger.md#save)
- [saveForInstance](Logger.md#saveforinstance)

## Constructors

### constructor

• **new Logger**(`«destructured»?`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `{}` |
| › `toConsole?` | `boolean` | `true` |
| › `toFile?` | `string` | `''` |
| › `callback?` | `any` | `null` |
| › `keepMessages?` | `boolean` | `undefined` |

#### Returns

[`Logger`](Logger.md)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L17)

## Properties

### debugMsgs

• **debugMsgs**: `any`[] = `[]`

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:9](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L9)

___

### toConsole

• **toConsole**: `boolean` = `true`

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L10)

___

### toFile

• **toFile**: `any` = `null`

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L11)

___

### callback

• **callback**: `any` = `null`

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L12)

___

### level

• **level**: `number` = `0`

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L13)

___

### keepMessages

• **keepMessages**: `boolean` = `false`

Keep the messages in memory for `get()` and `save()`; without it nothing accumulates (it grew with every step a server ran).

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L15)

## Methods

### setOptions

▸ **setOptions**(`«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `toConsole` | `any` |
| › `toFile` | `any` |
| › `callback` | `any` |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/ILogger.md).[setOptions](../interfaces/ILogger.md#setoptions)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L22)

___

### msg

▸ **msg**(`message`, `type?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `message` | `any` | `undefined` |
| `type` | `string` | `'log'` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L28)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/ILogger.md).[clear](../interfaces/ILogger.md#clear)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L45)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ILogger](../interfaces/ILogger.md).[get](../interfaces/ILogger.md#get)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:49](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L49)

___

### info

▸ **info**(`...message`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L53)

___

### decision

▸ **decision**(`...message`): `Object`

Why the engine took a path, in words: a condition and its values, a default flow, a gateway waiting.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Implementation of

[ILogger](../interfaces/ILogger.md).[decision](../interfaces/ILogger.md#decision)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L57)

___

### debug

▸ **debug**(`...message`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Implementation of

[ILogger](../interfaces/ILogger.md).[debug](../interfaces/ILogger.md#debug)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L60)

___

### warn

▸ **warn**(`...message`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Implementation of

[ILogger](../interfaces/ILogger.md).[warn](../interfaces/ILogger.md#warn)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:64](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L64)

___

### log

▸ **log**(`...message`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Implementation of

[ILogger](../interfaces/ILogger.md).[log](../interfaces/ILogger.md#log)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L67)

___

### logS

▸ **logS**(`...message`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:70](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L70)

___

### logE

▸ **logE**(`...message`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any`[] |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `date` | `Date` |
| `message` | `any` |
| `type` | `string` |
| `level` | `number` |

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L76)

___

### toString

▸ **toString**(`...args`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:81](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L81)

___

### reportError

▸ **reportError**(`err`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `any` |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/ILogger.md).[reportError](../interfaces/ILogger.md#reporterror)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:113](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L113)

___

### error

▸ **error**(`err`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `any` |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/ILogger.md).[error](../interfaces/ILogger.md#error)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:132](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L132)

___

### save

▸ **save**(`filename`, `flag?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `filename` | `any` | `undefined` |
| `flag` | `string` | `'w'` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ILogger](../interfaces/ILogger.md).[save](../interfaces/ILogger.md#save)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:135](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L135)

___

### saveForInstance

▸ **saveForInstance**(`instanceId`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ILogger](../interfaces/ILogger.md).[saveForInstance](../interfaces/ILogger.md#saveforinstance)

#### Defined in

[packages/bpmn-server/src/common/Logger.ts:167](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/Logger.ts#L167)
