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
- [decisionContext](IAppDelegate.md#decisioncontext)
- [notify](IAppDelegate.md#notify)
- [verifyModel](IAppDelegate.md#verifymodel)
- [instanceLabel](IAppDelegate.md#instancelabel)

## Properties

### moddleOptions

• **moddleOptions**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:165](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L165)

## Methods

### getServicesProvider

▸ **getServicesProvider**(`execution`, `context?`): [`IServiceProvider`](IServiceProvider.md) \| `Promise`\<[`IServiceProvider`](IServiceProvider.md)\>

`context`: the call's (docs/design/context-object.md), added in 3.7.5; the execution, as before, first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](IExecution.md) |
| `context?` | `any` |

#### Returns

[`IServiceProvider`](IServiceProvider.md) \| `Promise`\<[`IServiceProvider`](IServiceProvider.md)\>

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:170](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L170)

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

[packages/bpmn-server/src/interfaces/common.ts:171](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L171)

___

### executionStarted

▸ **executionStarted**(`execution`, `context?`): `any`

`context`: the process's (docs/design/context-object.md), added in 3.7.5.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](IExecution.md) |
| `context?` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:173](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L173)

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

[packages/bpmn-server/src/interfaces/common.ts:174](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L174)

___

### messageThrown

▸ **messageThrown**(`signalId`, `data`, `messageMatchingKey`, `item`, `context?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `string` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`IItem`](IItem.md) |
| `context?` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:175](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L175)

___

### signalThrown

▸ **signalThrown**(`signalId`, `data`, `messageMatchingKey`, `item`, `context?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signalId` | `string` |
| `data` | `any` |
| `messageMatchingKey` | `any` |
| `item` | [`IItem`](IItem.md) |
| `context?` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:176](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L176)

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

[packages/bpmn-server/src/interfaces/common.ts:184](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L184)

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

[packages/bpmn-server/src/interfaces/common.ts:185](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L185)

___

### serviceCalled

▸ **serviceCalled**(`input`, `execution`, `item`, `context?`): `unknown`

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `Record`\<`string`, `unknown`\> |
| `execution` | [`IExecution`](IExecution.md) |
| `item` | [`IItem`](IItem.md) |
| `context?` | `any` |

#### Returns

`unknown`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:191](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L191)

___

### loadDataObject

▸ **loadDataObject**(`name`, `item`, `context?`): `unknown`

Optional. Loads a data object of the model (a BPMN data object or data store, by its name) when an element
connected to it runs (a data association, either way, e.g. a start event or a service task). The value is
put in the instance data under the name (`data.client`) and saved with the instance like any data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | the data object's name |
| `item` | [`IItem`](IItem.md) | the running item: its element, token and the instance data (item.data) |
| `context?` | `any` | - |

#### Returns

`unknown`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:200](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L200)

___

### decisionContext

▸ **decisionContext**(`context`, `about`): `void` \| `Record`\<`string`, `any`\> \| `Promise`\<`void` \| `Record`\<`string`, `any`\>\>

Optional. The application's facts for a decision table (a business rule task's decision, an assignment policy,
a security policy: engine/DecisionContext.ts), before it is evaluated: what it returns is added to what the
table reads (`{ managerOf: true }`; `userGroups`, the user's groups when only the application knows them). Called
for each decision, a security policy's once per case and task it decides on; keep it quick. A failure is
logged, and the table decides without the application's facts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | `Record`\<`string`, `any`\> | what the table reads so far (docs/design/expressions.md): the data's fields, the task's prepared inputs, data, user, actors, task, decision, item, instance, appServices |
| `about` | `Object` | what is deciding (kind: decision, assignment or security; name), for whom, on what case and task |
| `about.kind` | ``"decision"`` \| ``"assignment"`` \| ``"security"`` | - |
| `about.name?` | `string` | - |
| `about.user` | `Object` | - |
| `about.user.userName?` | `string` | - |
| `about.user.userGroups?` | `string`[] | - |
| `about.instance?` | `any` | - |
| `about.task?` | `string` | - |

#### Returns

`void` \| `Record`\<`string`, `any`\> \| `Promise`\<`void` \| `Record`\<`string`, `any`\>\>

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:213](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L213)

___

### notify

▸ **notify**(`notification`): `void` \| `Promise`\<`void`\>

Optional. Delivers a notification a notification policy decided on (addons/notification/NotificationPolicy.ts,
docs/design/notification-policies.md): whom (`to`: user names and groups), `subject`, `message`, `channel`.
It is kept in wf_notifications either way; not called for a test run's instance, nor with NOTIFICATIONS=record.
A failure is kept with the notification and said in the Rationale; the process goes on.

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | `Object` |
| `notification.id` | `string` |
| `notification.instanceId` | `string` |
| `notification.event` | `string` |
| `notification.to` | `string`[] |
| `notification.subject` | `string` |
| `notification.message` | `string` |
| `notification.channel?` | `string` |

#### Returns

`void` \| `Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:221](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L221)

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

[packages/bpmn-server/src/interfaces/common.ts:230](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L230)

___

### instanceLabel

▸ **instanceLabel**(`instance`): `string` \| `Promise`\<`string`\>

Optional. A case's label, for a model that has no camunda:label of its own (addons/labels/Labels.ts): computed in
code when it is shown. Undefined: the default, `<model> #<caseId>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |

#### Returns

`string` \| `Promise`\<`string`\>

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:236](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L236)
