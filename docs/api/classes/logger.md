[bpmn-server](../README.md) / Logger

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

- [callback](Logger.md#callback)
- [debugMsgs](Logger.md#debugmsgs)
- [toConsole](Logger.md#toconsole)
- [toFile](Logger.md#tofile)

### Methods

- [clear](Logger.md#clear)
- [debug](Logger.md#debug)
- [error](Logger.md#error)
- [get](Logger.md#get)
- [info](Logger.md#info)
- [log](Logger.md#log)
- [msg](Logger.md#msg)
- [reportError](Logger.md#reporterror)
- [save](Logger.md#save)
- [setOptions](Logger.md#setoptions)
- [toString](Logger.md#tostring)
- [warn](Logger.md#warn)

## Constructors

### constructor

• **new Logger**(`«destructured»`): [`Logger`](Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `callback` | `any` |
| › `toConsole` | `boolean` |
| › `toFile` | `string` |

#### Returns

[`Logger`](Logger.md)

#### Defined in

[common/Logger.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-14)

## Properties

### callback

• **callback**: `any` = `null`

#### Defined in

[common/Logger.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-12)

___

### debugMsgs

• **debugMsgs**: `any`[] = `[]`

#### Defined in

[common/Logger.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-9)

___

### toConsole

• **toConsole**: `boolean` = `true`

#### Defined in

[common/Logger.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-10)

___

### toFile

• **toFile**: `any` = `null`

#### Defined in

[common/Logger.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-11)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Implementation of

[ILogger](../interfaces/ILogger.md).[clear](../interfaces/ILogger.md#clear)

#### Defined in

[common/Logger.ts:36](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-36)

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

[common/Logger.ts:47](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-47)

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

[common/Logger.ts:94](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-94)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[ILogger](../interfaces/ILogger.md).[get](../interfaces/ILogger.md#get)

#### Defined in

[common/Logger.ts:40](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-40)

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

[common/Logger.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-44)

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

[common/Logger.ts:54](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-54)

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

[common/Logger.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-23)

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

[common/Logger.ts:77](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-77)

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

[common/Logger.ts:97](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-97)

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

[ILogger](../interfaces/ILogger.md).[setOptions](../interfaces/ILogger.md#setoptions)

#### Defined in

[common/Logger.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-17)

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

[common/Logger.ts:57](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-57)

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

[common/Logger.ts:51](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/common/Logger.ts#lines-51)
