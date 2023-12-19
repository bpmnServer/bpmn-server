[bpmn-server](../README.md) / ILogger

# Interface: ILogger

A logging tool to take various message for monitoring and debugging

it can also keep the message in memory till saved later through saveToFile
msgs can be cleared by the clean method

## Implemented by

- [`Logger`](../classes/Logger.md)

## Table of contents

### Methods

- [clear](ILogger.md#clear)
- [debug](ILogger.md#debug)
- [error](ILogger.md#error)
- [get](ILogger.md#get)
- [log](ILogger.md#log)
- [reportError](ILogger.md#reporterror)
- [save](ILogger.md#save)
- [setOptions](ILogger.md#setoptions)
- [warn](ILogger.md#warn)

## Methods

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/common.ts:54](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-54)

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

[interfaces/common.ts:56](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-56)

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

[interfaces/common.ts:59](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-59)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Defined in

[interfaces/common.ts:55](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-55)

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

[interfaces/common.ts:58](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-58)

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

[interfaces/common.ts:60](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-60)

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

[interfaces/common.ts:61](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-61)

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

#### Defined in

[interfaces/common.ts:49](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-49)

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

[interfaces/common.ts:57](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-57)
