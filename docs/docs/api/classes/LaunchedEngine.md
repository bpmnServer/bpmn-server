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
- [releaseLocks](LaunchedEngine.md#releaselocks)
- [claim](LaunchedEngine.md#claim)
- [releaseClaim](LaunchedEngine.md#releaseclaim)
- [install](LaunchedEngine.md#install)
- [modelSaved](LaunchedEngine.md#modelsaved)
- [modelRemoved](LaunchedEngine.md#modelremoved)
- [modelRenamed](LaunchedEngine.md#modelrenamed)
- [setConnectorKey](LaunchedEngine.md#setconnectorkey)
- [clearConnectorKey](LaunchedEngine.md#clearconnectorkey)
- [connectorRemoved](LaunchedEngine.md#connectorremoved)
- [testConnector](LaunchedEngine.md#testconnector)
- [upgrade](LaunchedEngine.md#upgrade)
- [upgradeRunning](LaunchedEngine.md#upgraderunning)
- [invokeDecision](LaunchedEngine.md#invokedecision)
- [formChoices](LaunchedEngine.md#formchoices)
- [facts](LaunchedEngine.md#facts)
- [instanceLabels](LaunchedEngine.md#instancelabels)
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

[packages/bpmn-server/src/server/LaunchedServer.ts:53](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L53)

## Properties

### #call

• `Private` **#call**: `EngineCall`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L51)

## Accessors

### running

• `get` **running**(): `boolean`

Whether there is an engine to ask.

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L56)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:58](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L58)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L63)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:64](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L64)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:65](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L65)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:66](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L66)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:67](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L67)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:68](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L68)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:69](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L69)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:70](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L70)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L71)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L72)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:73](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L73)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:74](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L74)

___

### releaseLocks

▸ **releaseLocks**(`id?`): `Promise`\<`boolean`\>

Releases one instance's lock (its id), or every lock: an administrator's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id?` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:76](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L76)

___

### claim

▸ **claim**(`key`): `Promise`\<`boolean`\>

Claims a key for a moment (a task being claimed): whether this caller has it; releaseClaim gives it back.

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:78](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L78)

___

### releaseClaim

▸ **releaseClaim**(`key`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:79](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L79)

___

### install

▸ **install**(`options?`): `Promise`\<`any`\>

The engine's stores set up: their indexes (at setup, at start).

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Object` |
| `options.rebuild?` | `boolean` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:81](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L81)

___

### modelSaved

▸ **modelSaved**(`name`): `Promise`\<`any`\>

The engine's index of the models, told what changed in their files.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:83](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L83)

___

### modelRemoved

▸ **modelRemoved**(`name`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:84](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L84)

___

### modelRenamed

▸ **modelRenamed**(`name`, `newName`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `newName` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:85](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L85)

___

### setConnectorKey

▸ **setConnectorKey**(`id`, `key`, `userName?`): `Promise`\<`any`\>

A connector's key for this server, stored encrypted by the engine (SECRETS_KEY is the engine's).

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `key` | `string` |
| `userName?` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:87](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L87)

___

### clearConnectorKey

▸ **clearConnectorKey**(`id`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:88](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L88)

___

### connectorRemoved

▸ **connectorRemoved**(`id`): `Promise`\<`any`\>

A connector's file removed by the host: its key and test go, where the engine keeps them.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:90](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L90)

___

### testConnector

▸ **testConnector**(`id`, `operationId?`, `input?`): `Promise`\<`any`\>

A connector's connection tested, from the engine, which makes its calls; the result kept there.

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `operationId?` | `string` |
| `input` | `Object` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:92](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L92)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:93](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L93)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L94)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:95](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L95)

___

### formChoices

▸ **formChoices**(`processName`, `elementId`, `fieldId`, `criteria?`, `context?`): `Promise`\<`any`\>

A form field's choices, from the source its list or lookup names: the engine's, where the code and keys are.

#### Parameters

| Name | Type |
| :------ | :------ |
| `processName` | `string` |
| `elementId` | `string` |
| `fieldId` | `string` |
| `criteria` | `Object` |
| `context` | `Object` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:97](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L97)

___

### facts

▸ **facts**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:98](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L98)

___

### instanceLabels

▸ **instanceLabels**(`instances`): `Promise`\<`any`\>

Cases' labels by the application's instanceLabel hook, in the engine where its code is (#295).

#### Parameters

| Name | Type |
| :------ | :------ |
| `instances` | `any`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:100](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L100)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:101](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L101)

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

[packages/bpmn-server/src/server/LaunchedServer.ts:103](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L103)

___

### live

▸ **live**(): `Promise`\<`any`[]\>

What is being run now; nothing when no engine is running.

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:106](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L106)

___

### status

▸ **status**(): `Promise`\<`any`\>

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/server/LaunchedServer.ts:107](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/LaunchedServer.ts#L107)
