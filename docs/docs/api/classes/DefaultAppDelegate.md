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
- [appVarsClass](DefaultAppDelegate.md#appvarsclass)
- [appServicesClass](DefaultAppDelegate.md#appservicesclass)

### Accessors

- [moddleOptions](DefaultAppDelegate.md#moddleoptions)

### Methods

- [getAppVars](DefaultAppDelegate.md#getappvars)
- [describe](DefaultAppDelegate.md#describe)
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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L20)

## Properties

### server

• **server**: `any`

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:10](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L10)

___

### appVarsClass

• `Optional` **appVarsClass**: (`context`: `any`) => `any`

The application's variables (docs/design/app-contract.md §2.1): a class whose methods are the names an expression
reads as appVars.<name>, made for each evaluation from its context. None: appVars is empty.

#### Type declaration

• **new appVarsClass**(`context`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |

##### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L15)

___

### appServicesClass

• `Optional` **appServicesClass**: (`context`: `any`) => `any`

The application's functions, as a class (appServices.<method>): its method names, for checks without a context.

#### Type declaration

• **new appServicesClass**(`context`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |

##### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L17)

## Accessors

### moddleOptions

• `get` **moddleOptions**(): `any`

#### Returns

`any`

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[moddleOptions](../interfaces/IAppDelegate.md#moddleoptions)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:55](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L55)

## Methods

### getAppVars

▸ **getAppVars**(`context`): `any`

The variables for one evaluation (appVars.<name>): the variables class, made from its context.

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L29)

___

### describe

▸ **describe**(): [`IAppContract`](../interfaces/IAppContract.md)

The application's contract, its declarative part (docs/design/app-contract.md): its app-contract.json (the
configuration's appContract, else the working folder's), or null when it has none. An application may build it
in code instead.

#### Returns

[`IAppContract`](../interfaces/IAppContract.md)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L38)

___

### getServicesProvider

▸ **getServicesProvider**(`context`): `Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

`context`: the call's (docs/design/context-object.md), added in 3.7.5; the execution, as before, first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `any` |

#### Returns

`Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[getServicesProvider](../interfaces/IAppDelegate.md#getservicesprovider)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:43](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L43)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:47](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L47)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L51)

___

### executionStarted

▸ **executionStarted**(`execution`): `Promise`\<`void`\>

`context`: the process's (docs/design/context-object.md), added in 3.7.5.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/IExecution.md) |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IAppDelegate](../interfaces/IAppDelegate.md).[executionStarted](../interfaces/IAppDelegate.md#executionstarted)

#### Defined in

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L59)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L63)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L75)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:93](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L93)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:96](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L96)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:99](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L99)

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

[packages/bpmn-server/src/engine/DefaultAppDelegate.ts:113](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DefaultAppDelegate.ts#L113)
