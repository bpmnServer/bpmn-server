[bpmn-server](../README.md) / [Exports](../modules.md) / [engine/DefaultAppDelegate](../modules/engine_DefaultAppDelegate.md) / DefaultAppDelegate

# Class: DefaultAppDelegate

[engine/DefaultAppDelegate](../modules/engine_DefaultAppDelegate.md).DefaultAppDelegate

Application Delegate Object to respond to various events and services:
 
 1.  receive all events from workflow
 2.  receive service calls
 3.  receive message and signal calls 
 4.  execute scripts

## Implements

- [`IAppDelegate`](../interfaces/interfaces_common.IAppDelegate.md)

## Table of contents

### Constructors

- [constructor](engine_DefaultAppDelegate.DefaultAppDelegate.md#constructor)

### Properties

- [server](engine_DefaultAppDelegate.DefaultAppDelegate.md#server)

### Accessors

- [moddleOptions](engine_DefaultAppDelegate.DefaultAppDelegate.md#moddleoptions)

### Methods

- [executionEvent](engine_DefaultAppDelegate.DefaultAppDelegate.md#executionevent)
- [executionStarted](engine_DefaultAppDelegate.DefaultAppDelegate.md#executionstarted)
- [getServicesProvider](engine_DefaultAppDelegate.DefaultAppDelegate.md#getservicesprovider)
- [issueMessage](engine_DefaultAppDelegate.DefaultAppDelegate.md#issuemessage)
- [issueSignal](engine_DefaultAppDelegate.DefaultAppDelegate.md#issuesignal)
- [messageThrown](engine_DefaultAppDelegate.DefaultAppDelegate.md#messagethrown)
- [sendEmail](engine_DefaultAppDelegate.DefaultAppDelegate.md#sendemail)
- [serviceCalled](engine_DefaultAppDelegate.DefaultAppDelegate.md#servicecalled)
- [signalThrown](engine_DefaultAppDelegate.DefaultAppDelegate.md#signalthrown)
- [startUp](engine_DefaultAppDelegate.DefaultAppDelegate.md#startup)

## Constructors

### constructor

• **new DefaultAppDelegate**(`server`): [`DefaultAppDelegate`](engine_DefaultAppDelegate.DefaultAppDelegate.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`DefaultAppDelegate`](engine_DefaultAppDelegate.DefaultAppDelegate.md)

#### Defined in

[src/engine/DefaultAppDelegate.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L11)

## Properties

### server

• **server**: `any`

#### Defined in

[src/engine/DefaultAppDelegate.ts:8](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L8)

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

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[moddleOptions](../interfaces/interfaces_common.IAppDelegate.md#moddleoptions)

#### Defined in

[src/engine/DefaultAppDelegate.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L29)

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

[src/engine/DefaultAppDelegate.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L35)

___

### executionStarted

▸ **executionStarted**(`execution`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/interfaces_engine.IExecution.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[executionStarted](../interfaces/interfaces_common.IAppDelegate.md#executionstarted)

#### Defined in

[src/engine/DefaultAppDelegate.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L32)

___

### getServicesProvider

▸ **getServicesProvider**(`context`): `Promise`\<[`DefaultAppDelegate`](engine_DefaultAppDelegate.DefaultAppDelegate.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |

#### Returns

`Promise`\<[`DefaultAppDelegate`](engine_DefaultAppDelegate.DefaultAppDelegate.md)\>

#### Implementation of

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[getServicesProvider](../interfaces/interfaces_common.IAppDelegate.md#getservicesprovider)

#### Defined in

[src/engine/DefaultAppDelegate.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L18)

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

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[issueMessage](../interfaces/interfaces_common.IAppDelegate.md#issuemessage)

#### Defined in

[src/engine/DefaultAppDelegate.ts:64](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L64)

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

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[issueSignal](../interfaces/interfaces_common.IAppDelegate.md#issuesignal)

#### Defined in

[src/engine/DefaultAppDelegate.ts:67](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L67)

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
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[messageThrown](../interfaces/interfaces_common.IAppDelegate.md#messagethrown)

#### Defined in

[src/engine/DefaultAppDelegate.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L46)

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

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[sendEmail](../interfaces/interfaces_common.IAppDelegate.md#sendemail)

#### Defined in

[src/engine/DefaultAppDelegate.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L25)

___

### serviceCalled

▸ **serviceCalled**(`serviceName`, `data`, `item`): `Promise`\<`void`\>

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `any` |
| `data` | `any` |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[serviceCalled](../interfaces/interfaces_common.IAppDelegate.md#servicecalled)

#### Defined in

[src/engine/DefaultAppDelegate.ts:82](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L82)

___

### signalThrown

▸ **signalThrown**(`signalId`, `data`, `messageMatchingKey`, `item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[signalThrown](../interfaces/interfaces_common.IAppDelegate.md#signalthrown)

#### Defined in

[src/engine/DefaultAppDelegate.ts:70](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L70)

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

[IAppDelegate](../interfaces/interfaces_common.IAppDelegate.md).[startUp](../interfaces/interfaces_common.IAppDelegate.md#startup)

#### Defined in

[src/engine/DefaultAppDelegate.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/DefaultAppDelegate.ts#L22)
