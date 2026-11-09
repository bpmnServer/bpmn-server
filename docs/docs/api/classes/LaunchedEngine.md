[bpmn-server](../readme.md) / LaunchedEngine

# Class: LaunchedEngine

The engine, from outside it: what it can be asked (engineCalls), each answering data.

## Table of contents

### Constructors

- [constructor](LaunchedEngine.md#constructor)

### Properties

- [#call](LaunchedEngine.md##call)

### Accessors

- [running](LaunchedEngine.md#running)

### Methods

- [#ask](LaunchedEngine.md##ask)
- [start](LaunchedEngine.md#start)
- [get](LaunchedEngine.md#get)
- [cancel](LaunchedEngine.md#cancel)
- [retry](LaunchedEngine.md#retry)
- [restart](LaunchedEngine.md#restart)
- [invoke](LaunchedEngine.md#invoke)
- [assign](LaunchedEngine.md#assign)
- [startEvent](LaunchedEngine.md#startevent)
- [throwMessage](LaunchedEngine.md#throwmessage)
- [throwSignal](LaunchedEngine.md#throwsignal)
- [deleteInstances](LaunchedEngine.md#deleteinstances)
- [tagInstance](LaunchedEngine.md#taginstance)
- [upgrade](LaunchedEngine.md#upgrade)
- [upgradeRunning](LaunchedEngine.md#upgraderunning)
- [invokeDecision](LaunchedEngine.md#invokedecision)
- [facts](LaunchedEngine.md#facts)
- [checkModel](LaunchedEngine.md#checkmodel)
- [call](LaunchedEngine.md#call)
- [live](LaunchedEngine.md#live)
- [status](LaunchedEngine.md#status)

## Constructors

### constructor

• **new LaunchedEngine**(`call`): [`LaunchedEngine`](LaunchedEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `call` | `EngineCall` |

#### Returns

[`LaunchedEngine`](LaunchedEngine.md)

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L53)

## Properties

### #call

• `Private` **#call**: `EngineCall`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L51)

## Accessors

### running

• `get` **running**(): `boolean`

Whether there is an engine to ask.

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L56)

## Methods

### #ask

▸ **#ask**(`method`, `args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L58)

___

### start

▸ **start**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L63)

___

### get

▸ **get**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:64](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L64)

___

### cancel

▸ **cancel**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L65)

___

### retry

▸ **retry**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:66](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L66)

___

### restart

▸ **restart**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L67)

___

### invoke

▸ **invoke**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:68](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L68)

___

### assign

▸ **assign**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L69)

___

### startEvent

▸ **startEvent**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:70](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L70)

___

### throwMessage

▸ **throwMessage**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:71](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L71)

___

### throwSignal

▸ **throwSignal**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:72](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L72)

___

### deleteInstances

▸ **deleteInstances**(`query`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:73](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L73)

___

### tagInstance

▸ **tagInstance**(`instanceId`, `tag`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `instanceId` | `string` |
| `tag` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:74](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L74)

___

### upgrade

▸ **upgrade**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:75](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L75)

___

### upgradeRunning

▸ **upgradeRunning**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L76)

___

### invokeDecision

▸ **invokeDecision**(`...args`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:77](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L77)

___

### facts

▸ **facts**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:78](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L78)

___

### checkModel

▸ **checkModel**(`name`, `source`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `source` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L79)

___

### call

▸ **call**(`method`, `...args`): `Promise`\<`any`\>

A call added to the engine's (`calls` of launch, and of startEngineService where the engine is).

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `...args` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:81](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L81)

___

### live

▸ **live**(): `Promise`\<`any`[]\>

What is being run now; nothing when no engine is running.

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:84](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L84)

___

### status

▸ **status**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:85](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/LaunchedServer.ts#L85)
