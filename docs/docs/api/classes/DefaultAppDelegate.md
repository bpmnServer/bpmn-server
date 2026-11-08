[bpmn-server](../readme.md) / DefaultAppDelegate

# Class: DefaultAppDelegate

Application Delegate Object to respond to various events and services:
 
 1.  receive all events from workflow
 2.  receive service calls
 3.  receive message and signal calls 
 4.  execute scripts

## Implements

- [`IAppDelegate`](../interfaces/IAppDelegate.md)

## Table of contents

### Constructors

- [constructor](DefaultAppDelegate.md#constructor)

### Properties

- [server](DefaultAppDelegate.md#server)

### Accessors

- [moddleOptions](DefaultAppDelegate.md#moddleoptions)

### Methods

- [getServicesProvider](DefaultAppDelegate.md#getservicesprovider)
- [startUp](DefaultAppDelegate.md#startup)
- [sendEmail](DefaultAppDelegate.md#sendemail)
- [executionStarted](DefaultAppDelegate.md#executionstarted)
- [executionEvent](DefaultAppDelegate.md#executionevent)
- [messageThrown](DefaultAppDelegate.md#messagethrown)
- [issueMessage](DefaultAppDelegate.md#issuemessage)
- [issueSignal](DefaultAppDelegate.md#issuesignal)
- [signalThrown](DefaultAppDelegate.md#signalthrown)
- [serviceCalled](DefaultAppDelegate.md#servicecalled)

## Constructors

### constructor

• **new DefaultAppDelegate**(`server`): [`DefaultAppDelegate`](DefaultAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`DefaultAppDelegate`](DefaultAppDelegate.md)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:10](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L10)

## Properties

### server

• **server**: `any`

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:7](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L7)

## Accessors

### moddleOptions

• `get` **moddleOptions**(): `any`

#### Returns

`any`

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[moddleOptions](../interfaces/IAppDelegate.md#moddleoptions)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L30)

## Methods

### getServicesProvider

▸ **getServicesProvider**(`context`): `Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

Get the service task handlers, default to `this`, so you can add handlers on this class directly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |

#### Returns

`Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[getServicesProvider](../interfaces/IAppDelegate.md#getservicesprovider)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L18)

___

### startUp

▸ **startUp**(`options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`void`

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[startUp](../interfaces/IAppDelegate.md#startup)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L22)

___

### sendEmail

▸ **sendEmail**(`to`, `msg`, `body`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `any` |
| `msg` | `any` |
| `body` | `any` |

#### Returns

`void`

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[sendEmail](../interfaces/IAppDelegate.md#sendemail)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L26)

___

### executionStarted

▸ **executionStarted**(`execution`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/IExecution.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[executionStarted](../interfaces/IAppDelegate.md#executionstarted)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L34)

___

### executionEvent

▸ **executionEvent**(`context`, `event`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |
| `event` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L38)

___

### messageThrown

▸ **messageThrown**(`messageId`, `data`, `messageMatchingKey`, `item`): `Promise`\<`void`\>

is called when a event throws a message

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[messageThrown](../interfaces/IAppDelegate.md#messagethrown)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L50)

___

### issueMessage

▸ **issueMessage**(`messageId`, `data`): `Promise`\<`void`\>

is called when an event throws a message that can not be answered by another process

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[issueMessage](../interfaces/IAppDelegate.md#issuemessage)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:68](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L68)

___

### issueSignal

▸ **issueSignal**(`signalId`, `data`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[issueSignal](../interfaces/IAppDelegate.md#issuesignal)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:71](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L71)

___

### signalThrown

▸ **signalThrown**(`signalId`, `data`, `messageMatchingKey`, `item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[signalThrown](../interfaces/IAppDelegate.md#signalthrown)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:74](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L74)

___

### serviceCalled

▸ **serviceCalled**(`serviceName`, `data`, `item`): `Promise`\<`void`\>

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `any` |
| `data` | `any` |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[serviceCalled](../interfaces/IAppDelegate.md#servicecalled)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:86](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L86)
