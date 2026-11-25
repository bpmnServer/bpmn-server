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
- [decision](ILogger.md#decision)
- [error](ILogger.md#error)
- [reportError](ILogger.md#reporterror)
- [save](ILogger.md#save)
- [saveForInstance](ILogger.md#saveforinstance)

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

[packages/bpmn-server/src/interfaces/common.ts:130](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L130)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:135](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L135)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:136](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L136)

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

[packages/bpmn-server/src/interfaces/common.ts:137](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L137)

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

[packages/bpmn-server/src/interfaces/common.ts:138](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L138)

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

[packages/bpmn-server/src/interfaces/common.ts:139](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L139)

___

### decision

▸ **decision**(`...message`): `any`

Why the engine took a path (an instance log entry of type 'decision'); optional for older loggers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...message` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:141](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L141)

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

[packages/bpmn-server/src/interfaces/common.ts:142](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L142)

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

[packages/bpmn-server/src/interfaces/common.ts:143](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L143)

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

[packages/bpmn-server/src/interfaces/common.ts:144](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L144)

___

### saveForInstance

▸ **saveForInstance**(`instanceId`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:145](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L145)
