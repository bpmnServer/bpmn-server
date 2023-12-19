[bpmn-server](../README.md) / [Exports](../modules.md) / [common/Logger](../modules/common_Logger.md) / Logger

# Class: Logger

[common/Logger](../modules/common_Logger.md).Logger

A logging tool to take various message for monitoring and debugging

it can also keep the message in memory till saved later through saveToFile
msgs can be cleared by the clean method

## Implements

- [`ILogger`](../interfaces/interfaces_common.ILogger.md)

## Table of contents

### Constructors

- [constructor](common_Logger.Logger.md#constructor)

### Properties

- [callback](common_Logger.Logger.md#callback)
- [debugMsgs](common_Logger.Logger.md#debugmsgs)
- [toConsole](common_Logger.Logger.md#toconsole)
- [toFile](common_Logger.Logger.md#tofile)

### Methods

- [clear](common_Logger.Logger.md#clear)
- [debug](common_Logger.Logger.md#debug)
- [error](common_Logger.Logger.md#error)
- [get](common_Logger.Logger.md#get)
- [info](common_Logger.Logger.md#info)
- [log](common_Logger.Logger.md#log)
- [msg](common_Logger.Logger.md#msg)
- [reportError](common_Logger.Logger.md#reporterror)
- [save](common_Logger.Logger.md#save)
- [setOptions](common_Logger.Logger.md#setoptions)
- [toString](common_Logger.Logger.md#tostring)
- [warn](common_Logger.Logger.md#warn)

## Constructors

### constructor

• **new Logger**(`«destructured»`): [`Logger`](common_Logger.Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `callback` | `any` |
| › `toConsole` | `boolean` |
| › `toFile` | `string` |

#### Returns

[`Logger`](common_Logger.Logger.md)

#### Defined in

[src/common/Logger.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L14)

## Properties

### callback

• **callback**: `any` = `null`

#### Defined in

[src/common/Logger.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L12)

___

### debugMsgs

• **debugMsgs**: `any`[] = `[]`

#### Defined in

[src/common/Logger.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L9)

___

### toConsole

• **toConsole**: `boolean` = `true`

#### Defined in

[src/common/Logger.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L10)

___

### toFile

• **toFile**: `any` = `null`

#### Defined in

[src/common/Logger.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L11)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/interfaces_common.ILogger.md).[clear](../interfaces/interfaces_common.ILogger.md#clear)

#### Defined in

[src/common/Logger.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L36)

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

#### Implementation of

[ILogger](../interfaces/interfaces_common.ILogger.md).[debug](../interfaces/interfaces_common.ILogger.md#debug)

#### Defined in

[src/common/Logger.ts:47](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L47)

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

[ILogger](../interfaces/interfaces_common.ILogger.md).[error](../interfaces/interfaces_common.ILogger.md#error)

#### Defined in

[src/common/Logger.ts:94](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L94)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ILogger](../interfaces/interfaces_common.ILogger.md).[get](../interfaces/interfaces_common.ILogger.md#get)

#### Defined in

[src/common/Logger.ts:40](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L40)

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

#### Defined in

[src/common/Logger.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L44)

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

#### Implementation of

[ILogger](../interfaces/interfaces_common.ILogger.md).[log](../interfaces/interfaces_common.ILogger.md#log)

#### Defined in

[src/common/Logger.ts:54](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L54)

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

#### Defined in

[src/common/Logger.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L23)

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

[ILogger](../interfaces/interfaces_common.ILogger.md).[reportError](../interfaces/interfaces_common.ILogger.md#reporterror)

#### Defined in

[src/common/Logger.ts:77](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L77)

___

### save

▸ **save**(`filename`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ILogger](../interfaces/interfaces_common.ILogger.md).[save](../interfaces/interfaces_common.ILogger.md#save)

#### Defined in

[src/common/Logger.ts:97](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L97)

___

### setOptions

▸ **setOptions**(`«destructured»`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `callback` | `any` |
| › `toConsole` | `any` |
| › `toFile` | `any` |

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/interfaces_common.ILogger.md).[setOptions](../interfaces/interfaces_common.ILogger.md#setoptions)

#### Defined in

[src/common/Logger.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L17)

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

[src/common/Logger.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L57)

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

#### Implementation of

[ILogger](../interfaces/interfaces_common.ILogger.md).[warn](../interfaces/interfaces_common.ILogger.md#warn)

#### Defined in

[src/common/Logger.ts:51](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/common/Logger.ts#L51)
