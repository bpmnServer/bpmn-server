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

### Methods

- [setOptions](Logger.md#setoptions)
- [msg](Logger.md#msg)
- [clear](Logger.md#clear)
- [get](Logger.md#get)
- [info](Logger.md#info)
- [debug](Logger.md#debug)
- [warn](Logger.md#warn)
- [log](Logger.md#log)
- [toString](Logger.md#tostring)
- [reportError](Logger.md#reporterror)
- [error](Logger.md#error)
- [save](Logger.md#save)

## Constructors

### constructor

• **new Logger**(`«destructured»`): [`Logger`](Logger.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `undefined` |
| › `toConsole` | `boolean` | `true` |
| › `toFile` | `string` | `''` |
| › `callback` | `any` | `null` |

#### Returns

[`Logger`](Logger.md)

#### Defined in

[common/Logger.ts:14](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L14)

## Properties

### debugMsgs

• **debugMsgs**: `any`[] = `[]`

#### Defined in

[common/Logger.ts:9](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L9)

___

### toConsole

• **toConsole**: `boolean` = `true`

#### Defined in

[common/Logger.ts:10](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L10)

___

### toFile

• **toFile**: `any` = `null`

#### Defined in

[common/Logger.ts:11](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L11)

___

### callback

• **callback**: `any` = `null`

#### Defined in

[common/Logger.ts:12](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L12)

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

[common/Logger.ts:17](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L17)

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

[common/Logger.ts:23](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L23)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/ILogger.md).[clear](../interfaces/ILogger.md#clear)

#### Defined in

[common/Logger.ts:36](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L36)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ILogger](../interfaces/ILogger.md).[get](../interfaces/ILogger.md#get)

#### Defined in

[common/Logger.ts:40](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L40)

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

[common/Logger.ts:44](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L44)

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

[ILogger](../interfaces/ILogger.md).[debug](../interfaces/ILogger.md#debug)

#### Defined in

[common/Logger.ts:47](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L47)

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

[ILogger](../interfaces/ILogger.md).[warn](../interfaces/ILogger.md#warn)

#### Defined in

[common/Logger.ts:51](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L51)

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

[ILogger](../interfaces/ILogger.md).[log](../interfaces/ILogger.md#log)

#### Defined in

[common/Logger.ts:54](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L54)

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

[common/Logger.ts:57](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L57)

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

[common/Logger.ts:77](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L77)

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

[common/Logger.ts:94](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L94)

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

[ILogger](../interfaces/ILogger.md).[save](../interfaces/ILogger.md#save)

#### Defined in

[common/Logger.ts:97](https://github.com/bpmnServer/bpmn-server/blob/76c4fe0/src/common/Logger.ts#L97)
