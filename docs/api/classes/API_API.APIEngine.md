[bpmn-server](../README.md) / [Exports](../modules.md) / [API/API](../modules/API_API.md) / APIEngine

# Class: APIEngine

[API/API](../modules/API_API.md).APIEngine

## Hierarchy

- `APIComponent`

  ↳ **`APIEngine`**

## Implements

- `IEngineAPI`

## Table of contents

### Constructors

- [constructor](API_API.APIEngine.md#constructor)

### Properties

- [api](API_API.APIEngine.md#api)

### Accessors

- [server](API_API.APIEngine.md#server)

### Methods

- [assign](API_API.APIEngine.md#assign)
- [invoke](API_API.APIEngine.md#invoke)
- [start](API_API.APIEngine.md#start)
- [startEvent](API_API.APIEngine.md#startevent)
- [throwMessage](API_API.APIEngine.md#throwmessage)
- [throwSignal](API_API.APIEngine.md#throwsignal)

## Constructors

### constructor

• **new APIEngine**(`api`): [`APIEngine`](API_API.APIEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIEngine`](API_API.APIEngine.md)

#### Inherited from

APIComponent.constructor

#### Defined in

[src/API/API.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L24)

## Properties

### api

• **api**: [`BPMNAPI`](API_API.BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[src/API/API.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L22)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/interfaces_server.IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[src/API/API.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L27)

## Methods

### assign

▸ **assign**(`query`, `data`, `assignment`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `any` |
| `assignment` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

IEngineAPI.assign

#### Defined in

[src/API/API.ts:62](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L62)

___

### invoke

▸ **invoke**(`query`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

IEngineAPI.invoke

#### Defined in

[src/API/API.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L57)

___

### start

▸ **start**(`name`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

IEngineAPI.start

#### Defined in

[src/API/API.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L53)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `elementId` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

IEngineAPI.startEvent

#### Defined in

[src/API/API.ts:72](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L72)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/interfaces_engine.IExecution.md)\>

#### Implementation of

IEngineAPI.throwMessage

#### Defined in

[src/API/API.ts:66](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L66)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

IEngineAPI.throwSignal

#### Defined in

[src/API/API.ts:69](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/API.ts#L69)
