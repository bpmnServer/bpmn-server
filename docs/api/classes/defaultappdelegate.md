[bpmn-server](../README.md) / DefaultAppDelegate

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

- [executionEvent](DefaultAppDelegate.md#executionevent)
- [executionStarted](DefaultAppDelegate.md#executionstarted)
- [getServicesProvider](DefaultAppDelegate.md#getservicesprovider)
- [issueMessage](DefaultAppDelegate.md#issuemessage)
- [issueSignal](DefaultAppDelegate.md#issuesignal)
- [messageThrown](DefaultAppDelegate.md#messagethrown)
- [sendEmail](DefaultAppDelegate.md#sendemail)
- [serviceCalled](DefaultAppDelegate.md#servicecalled)
- [signalThrown](DefaultAppDelegate.md#signalthrown)
- [startUp](DefaultAppDelegate.md#startup)

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

[engine/DefaultAppDelegate.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-11)

## Properties

### server

• **server**: `any`

#### Defined in

[engine/DefaultAppDelegate.ts:8](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-8)

## Accessors

### moddleOptions

• `get` **moddleOptions**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `prefix` | `string` |
| `types` | (\{ `extends`: `string`[] ; `isAbstract`: `boolean` = true; `name`: `string` = "Task"; `properties`: \{ `isAttr`: `boolean` = true; `name`: `string` = "result"; `type`: `string` = "String" }[] ; `superClass?`: `undefined`  } \| \{ `extends?`: `undefined` ; `isAbstract?`: `undefined` = true; `name`: `string` = "Output"; `properties?`: `undefined` ; `superClass`: `string`[]  })[] |
| `uri` | `string` |
| `xml` | \{ `tagAlias`: `string` = "lowerCase" } |
| `xml.tagAlias` | `string` |

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[moddleOptions](../interfaces/IAppDelegate.md#moddleoptions)

#### Defined in

[engine/DefaultAppDelegate.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-29)

## Methods

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

[engine/DefaultAppDelegate.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-35)

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

[engine/DefaultAppDelegate.ts:32](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-32)

___

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

[engine/DefaultAppDelegate.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-18)

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

[engine/DefaultAppDelegate.ts:64](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-64)

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

[engine/DefaultAppDelegate.ts:67](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-67)

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

[engine/DefaultAppDelegate.ts:46](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-46)

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

[engine/DefaultAppDelegate.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-25)

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

[engine/DefaultAppDelegate.ts:82](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-82)

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

[engine/DefaultAppDelegate.ts:70](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-70)

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

[engine/DefaultAppDelegate.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/engine/DefaultAppDelegate.ts#lines-22)
