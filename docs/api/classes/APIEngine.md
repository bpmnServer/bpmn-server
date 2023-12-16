[bpmn-server](../README.md) / APIEngine

# Class: APIEngine

## Hierarchy

- `APIComponent`

  ↳ **`APIEngine`**

## Implements

- `IEngineAPI`

## Table of contents

### Constructors

- [constructor](APIEngine.md#constructor)

### Properties

- [api](APIEngine.md#api)

### Accessors

- [server](APIEngine.md#server)

### Methods

- [assign](APIEngine.md#assign)
- [invoke](APIEngine.md#invoke)
- [start](APIEngine.md#start)
- [startEvent](APIEngine.md#startevent)
- [throwMessage](APIEngine.md#throwmessage)
- [throwSignal](APIEngine.md#throwsignal)

## Constructors

### constructor

• **new APIEngine**(`api`): [`APIEngine`](APIEngine.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `api` | `any` |

#### Returns

[`APIEngine`](APIEngine.md)

#### Inherited from

APIComponent.constructor

#### Defined in

[API/API.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L22)

## Properties

### api

• **api**: [`BPMNAPI`](BPMNAPI.md)

#### Inherited from

APIComponent.api

#### Defined in

[API/API.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L20)

## Accessors

### server

• `get` **server**(): [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Returns

[`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Inherited from

APIComponent.server

#### Defined in

[API/API.ts:25](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L25)

## Methods

### assign

▸ **assign**(`query`, `data`, `assignment`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `any` |
| `assignment` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

IEngineAPI.assign

#### Defined in

[API/API.ts:60](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L60)

___

### invoke

▸ **invoke**(`query`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

IEngineAPI.invoke

#### Defined in

[API/API.ts:55](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L55)

___

### start

▸ **start**(`name`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

IEngineAPI.start

#### Defined in

[API/API.ts:51](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L51)

___

### startEvent

▸ **startEvent**(`query`, `elementId`, `data?`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `elementId` | `any` |
| `data` | `Object` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

IEngineAPI.startEvent

#### Defined in

[API/API.ts:70](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L70)

___

### throwMessage

▸ **throwMessage**(`messageId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<[`IExecution`](../interfaces/IExecution.md)\>

#### Implementation of

IEngineAPI.throwMessage

#### Defined in

[API/API.ts:64](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L64)

___

### throwSignal

▸ **throwSignal**(`signalId`, `data`, `messageMatchingKey`, `user`, `options?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `user` | [`ISecureUser`](../interfaces/ISecureUser.md) |
| `options` | `Object` |

#### Returns

`Promise`\<`any`\>

#### Implementation of

IEngineAPI.throwSignal

#### Defined in

[API/API.ts:67](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/API.ts#L67)
