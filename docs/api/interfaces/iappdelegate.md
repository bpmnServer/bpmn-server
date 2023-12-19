[bpmn-server](../README.md) / IAppDelegate

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

- [executionStarted](IAppDelegate.md#executionstarted)
- [getServicesProvider](IAppDelegate.md#getservicesprovider)
- [issueMessage](IAppDelegate.md#issuemessage)
- [issueSignal](IAppDelegate.md#issuesignal)
- [messageThrown](IAppDelegate.md#messagethrown)
- [sendEmail](IAppDelegate.md#sendemail)
- [serviceCalled](IAppDelegate.md#servicecalled)
- [signalThrown](IAppDelegate.md#signalthrown)
- [startUp](IAppDelegate.md#startup)

## Properties

### moddleOptions

• **moddleOptions**: `any`

#### Defined in

[interfaces/common.ts:73](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-73)

## Methods

### executionStarted

▸ **executionStarted**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:76](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-76)

___

### getServicesProvider

▸ **getServicesProvider**(`IExecution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `IExecution` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/common.ts:74](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-74)

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

[interfaces/common.ts:87](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-87)

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

[interfaces/common.ts:88](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-88)

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

[interfaces/common.ts:78](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-78)

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

[interfaces/common.ts:75](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-75)

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

[interfaces/common.ts:94](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-94)

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

[interfaces/common.ts:79](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-79)

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

[interfaces/common.ts:77](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/common.ts#lines-77)
