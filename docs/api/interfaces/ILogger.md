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

[interfaces/common.ts:49](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L49)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/common.ts:54](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L54)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Defined in

[interfaces/common.ts:55](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L55)

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

[interfaces/common.ts:56](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L56)

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

[interfaces/common.ts:57](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L57)

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

[interfaces/common.ts:58](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L58)

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

[interfaces/common.ts:59](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L59)

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

[interfaces/common.ts:60](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L60)

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

[interfaces/common.ts:61](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/interfaces/common.ts#L61)
