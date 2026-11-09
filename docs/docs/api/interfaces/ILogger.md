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

[packages/bpmn-server/src/interfaces/common.ts:108](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L108)

___

### clear

▸ **clear**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:113](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L113)

___

### get

▸ **get**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:114](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L114)

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

[packages/bpmn-server/src/interfaces/common.ts:115](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L115)

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

[packages/bpmn-server/src/interfaces/common.ts:116](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L116)

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

[packages/bpmn-server/src/interfaces/common.ts:117](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L117)

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

[packages/bpmn-server/src/interfaces/common.ts:119](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L119)

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

[packages/bpmn-server/src/interfaces/common.ts:120](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L120)

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

[packages/bpmn-server/src/interfaces/common.ts:121](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L121)

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

[packages/bpmn-server/src/interfaces/common.ts:122](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L122)

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

[packages/bpmn-server/src/interfaces/common.ts:123](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L123)
