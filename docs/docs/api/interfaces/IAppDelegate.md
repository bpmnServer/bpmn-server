[bpmn-server](../readme.md) / IAppDelegate

# Interface: IAppDelegate

Application Delegate Object to respond to various events and services:
 
 1.  receive all events from workflow
 2.  receive service calls
 3.  receive message and signal calls 
 4.  execute scripts

## Implemented by

- [`DefaultAppDelegate`](../classes/DefaultAppDelegate.md)

## Table of contents

### Properties

- [moddleOptions](IAppDelegate.md#moddleoptions)

### Methods

- [getServicesProvider](IAppDelegate.md#getservicesprovider)
- [sendEmail](IAppDelegate.md#sendemail)
- [executionStarted](IAppDelegate.md#executionstarted)
- [startUp](IAppDelegate.md#startup)
- [messageThrown](IAppDelegate.md#messagethrown)
- [signalThrown](IAppDelegate.md#signalthrown)
- [issueMessage](IAppDelegate.md#issuemessage)
- [issueSignal](IAppDelegate.md#issuesignal)
- [serviceCalled](IAppDelegate.md#servicecalled)

## Properties

### moddleOptions

• **moddleOptions**: `any`

#### Defined in

[interfaces/common.ts:81](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L81)

## Methods

### getServicesProvider

▸ **getServicesProvider**(`IExecution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `IExecution` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:82](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L82)

___

### sendEmail

▸ **sendEmail**(`to`, `msg`, `body`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `any` |
| `msg` | `any` |
| `body` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:83](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L83)

___

### executionStarted

▸ **executionStarted**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:84](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L84)

___

### startUp

▸ **startUp**(`options`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:85](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L85)

___

### messageThrown

▸ **messageThrown**(`signalId`, `data`, `messageMatchingKey`, `item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:86](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L86)

___

### signalThrown

▸ **signalThrown**(`signalId`, `data`, `messageMatchingKey`, `item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `any` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:87](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L87)

___

### issueMessage

▸ **issueMessage**(`messageId`, `data`): `any`

is called when an event throws a message that can not be answered by another process

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:95](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L95)

___

### issueSignal

▸ **issueSignal**(`messageId`, `data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `any` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:96](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L96)

___

### serviceCalled

▸ **serviceCalled**(`serviceName`, `data`, `item`): `any`

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serviceName` | `any` |
| `data` | `any` |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:102](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/common.ts#L102)
