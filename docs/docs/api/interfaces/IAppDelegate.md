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
- [loadDataObject](IAppDelegate.md#loaddataobject)
- [verifyModel](IAppDelegate.md#verifymodel)

## Properties

### moddleOptions

• **moddleOptions**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:143](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L143)

## Methods

### getServicesProvider

▸ **getServicesProvider**(`execution`): [`IServiceProvider`](IServiceProvider.md) \| `Promise`\<[`IServiceProvider`](IServiceProvider.md)\>

Get the service task handlers, default to `this`, so you can add handlers on this class directly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](IExecution.md) |

#### Returns

[`IServiceProvider`](IServiceProvider.md) \| `Promise`\<[`IServiceProvider`](IServiceProvider.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:147](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L147)

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

[packages/bpmn-server/src/interfaces/common.ts:148](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L148)

___

### executionStarted

▸ **executionStarted**(`execution`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](IExecution.md) |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:149](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L149)

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

[packages/bpmn-server/src/interfaces/common.ts:150](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L150)

___

### messageThrown

▸ **messageThrown**(`signalId`, `data`, `messageMatchingKey`, `item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `string` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:151](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L151)

___

### signalThrown

▸ **signalThrown**(`signalId`, `data`, `messageMatchingKey`, `item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `string` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`IItem`](IItem.md) |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:152](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L152)

___

### issueMessage

▸ **issueMessage**(`messageId`, `data`): `any`

is called when an event throws a message that can not be answered by another process

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:160](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L160)

___

### issueSignal

▸ **issueSignal**(`messageId`, `data`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageId` | `string` |
| `data` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:161](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L161)

___

### serviceCalled

▸ **serviceCalled**(`input`, `execution`, `item`): `unknown`

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Record`\<`string`, `unknown`\> |
| `execution` | [`IExecution`](IExecution.md) |
| `item` | [`IItem`](IItem.md) |

#### Returns

`unknown`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:167](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L167)

___

### loadDataObject

▸ **loadDataObject**(`name`, `item`): `unknown`

Optional. Loads a data object of the model (a BPMN data object or data store, by its name) when an element
connected to it runs (a data association, either way, e.g. a start event or a service task). The value is
put in the instance data under the name (`data.client`) and saved with the instance like any data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the data object's name |
| `item` | [`IItem`](IItem.md) | the running item: its element, token and the instance data (item.data) |

#### Returns

`unknown`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:176](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L176)

___

### verifyModel

▸ **verifyModel**(`model`): [`IAppModelIssue`](IAppModelIssue.md)[] \| `Promise`\<[`IAppModelIssue`](IAppModelIssue.md)[]\>

Optional. The application's own checks on a model, run by verifyModel (the model editor's check, the
import checks, `bpmn-server verify` with a server) after its own, on a model the engine could load.
Returns issues in verifyModel's form; `severity` defaults to 'error'. Called without a running execution.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `model` | `Object` | the model's name, its XML and the loaded Definition |
| `model.name` | `string` | - |
| `model.source` | `string` | - |
| `model.definition` | `any` | - |

#### Returns

[`IAppModelIssue`](IAppModelIssue.md)[] \| `Promise`\<[`IAppModelIssue`](IAppModelIssue.md)[]\>

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:185](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L185)
