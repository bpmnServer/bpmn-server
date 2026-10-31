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

[engine/DefaultAppDelegate.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L11)

## Properties

### server

• **server**: `any`

#### Defined in

[engine/DefaultAppDelegate.ts:8](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L8)

## Accessors

### moddleOptions

• `get` **moddleOptions**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `uri` | `string` |
| `prefix` | `string` |
| `xml` | \{ `tagAlias`: `string` = "lowerCase" } |
| `xml.tagAlias` | `string` |
| `types` | (\{ `name`: `string` = "Task"; `isAbstract`: `boolean` = true; `extends`: `string`[] ; `properties`: \{ `name`: `string` = "result"; `isAttr`: `boolean` = true; `type`: `string` = "String" }[] ; `superClass?`: `undefined`  } \| \{ `isAbstract?`: `undefined` = true; `extends?`: `undefined` ; `properties?`: `undefined` ; `name`: `string` = "Output"; `superClass`: `string`[]  })[] |

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[moddleOptions](../interfaces/IAppDelegate.md#moddleoptions)

#### Defined in

[engine/DefaultAppDelegate.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L29)

## Methods

### getServicesProvider

▸ **getServicesProvider**(`context`): `Promise`\<[`DefaultAppDelegate`](DefaultAppDelegate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |

#### Returns

`Promise`\<[`DefaultAppDelegate`](DefaultAppDelegate.md)\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[getServicesProvider](../interfaces/IAppDelegate.md#getservicesprovider)

#### Defined in

[engine/DefaultAppDelegate.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L18)

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

[engine/DefaultAppDelegate.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L22)

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

[engine/DefaultAppDelegate.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L25)

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

[engine/DefaultAppDelegate.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L32)

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

[engine/DefaultAppDelegate.ts:35](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L35)

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

[engine/DefaultAppDelegate.ts:46](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L46)

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

[engine/DefaultAppDelegate.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L64)

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

[engine/DefaultAppDelegate.ts:67](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L67)

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

[engine/DefaultAppDelegate.ts:70](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L70)

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

[engine/DefaultAppDelegate.ts:82](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/DefaultAppDelegate.ts#L82)
