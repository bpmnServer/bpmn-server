[bpmn-server](../readme.md) / ILogger

# Interface: ILogger

A logging tool to take various message for monitoring and debugging

it can also keep the message in memory till saved later through saveToFile
msgs can be cleared by the clean method

## Implemented by

- [`Logger`](../classes/Logger.md)

## Table of contents

### Methods

- [setOptions](ILogger.md#setoptions)
- [clear](ILogger.md#clear)
- [get](ILogger.md#get)
- [debug](ILogger.md#debug)
- [warn](ILogger.md#warn)
- [log](ILogger.md#log)
- [error](ILogger.md#error)
- [reportError](ILogger.md#reporterror)
- [save](ILogger.md#save)

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

#### Defined in

[interfaces/common.ts:57](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L57)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/common.ts:62](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L62)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Defined in

[interfaces/common.ts:63](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L63)

___

### debug

▸ **debug**(`...message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any` |

#### Returns

`void`

#### Defined in

[interfaces/common.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L64)

___

### warn

▸ **warn**(`...message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any` |

#### Returns

`void`

#### Defined in

[interfaces/common.ts:65](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L65)

___

### log

▸ **log**(`...message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any` |

#### Returns

`void`

#### Defined in

[interfaces/common.ts:66](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L66)

___

### error

▸ **error**(`err`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `any` |

#### Returns

`void`

#### Defined in

[interfaces/common.ts:67](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L67)

___

### reportError

▸ **reportError**(`err`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `any` |

#### Returns

`void`

#### Defined in

[interfaces/common.ts:68](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L68)

___

### save

▸ **save**(`filename`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filename` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/common.ts:69](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L69)
