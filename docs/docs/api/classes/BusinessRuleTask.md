[bpmn-server](../readme.md) / BusinessRuleTask

# Class: BusinessRuleTask

Evaluates the decision camunda:decisionRef names, in the models folder: the file `<ref>.dmn.xml`, or a decision
with that id. Its inputs are read from the instance data and the task's input parameters (which take precedence);
the result is the task's output, saved in the data by output parameters or camunda:resultVariable, shaped by
camunda:mapDecisionResult (singleEntry, singleResult, collectEntries or resultList) when that is set.

## Hierarchy

- [`ServiceTask`](ServiceTask.md)

  ↳ **`BusinessRuleTask`**

## Table of contents

### Constructors

- [constructor](BusinessRuleTask.md#constructor)

### Properties

- [id](BusinessRuleTask.md#id)
- [type](BusinessRuleTask.md#type)
- [subType](BusinessRuleTask.md#subtype)
- [behaviours](BusinessRuleTask.md#behaviours)
- [isFlow](BusinessRuleTask.md#isflow)
- [lane](BusinessRuleTask.md#lane)
- [name](BusinessRuleTask.md#name)
- [process](BusinessRuleTask.md#process)
- [def](BusinessRuleTask.md#def)
- [outbounds](BusinessRuleTask.md#outbounds)
- [inbounds](BusinessRuleTask.md#inbounds)
- [attachments](BusinessRuleTask.md#attachments)
- [attachedTo](BusinessRuleTask.md#attachedto)
- [messageId](BusinessRuleTask.md#messageid)
- [signalId](BusinessRuleTask.md#signalid)
- [initiator](BusinessRuleTask.md#initiator)
- [assignee](BusinessRuleTask.md#assignee)
- [candidateGroups](BusinessRuleTask.md#candidategroups)
- [candidateUsers](BusinessRuleTask.md#candidateusers)
- [scripts](BusinessRuleTask.md#scripts)

### Accessors

- [processId](BusinessRuleTask.md#processid)
- [requiresWait](BusinessRuleTask.md#requireswait)
- [canBeInvoked](BusinessRuleTask.md#canbeinvoked)
- [loopDefinition](BusinessRuleTask.md#loopdefinition)
- [isCatching](BusinessRuleTask.md#iscatching)
- [dataObjectNames](BusinessRuleTask.md#dataobjectnames)
- [exceptionsAsErrors](BusinessRuleTask.md#exceptionsaserrors)
- [serviceName](BusinessRuleTask.md#servicename)
- [connector](BusinessRuleTask.md#connector)
- [decisionRef](BusinessRuleTask.md#decisionref)
- [resultVariable](BusinessRuleTask.md#resultvariable)
- [mapDecisionResult](BusinessRuleTask.md#mapdecisionresult)

### Methods

- [restored](BusinessRuleTask.md#restored)
- [hasBehaviour](BusinessRuleTask.md#hasbehaviour)
- [getBehaviour](BusinessRuleTask.md#getbehaviour)
- [addBehaviour](BusinessRuleTask.md#addbehaviour)
- [validate](BusinessRuleTask.md#validate)
- [doEvent](BusinessRuleTask.md#doevent)
- [setInput](BusinessRuleTask.md#setinput)
- [getInput](BusinessRuleTask.md#getinput)
- [getOutput](BusinessRuleTask.md#getoutput)
- [enter](BusinessRuleTask.md#enter)
- [loadDataObjects](BusinessRuleTask.md#loaddataobjects)
- [execute](BusinessRuleTask.md#execute)
- [perform](BusinessRuleTask.md#perform)
- [failed](BusinessRuleTask.md#failed)
- [continue](BusinessRuleTask.md#continue)
- [start](BusinessRuleTask.md#start)
- [cancelEBG](BusinessRuleTask.md#cancelebg)
- [cancelBoundaryEvents](BusinessRuleTask.md#cancelboundaryevents)
- [getBoundaryEventItems](BusinessRuleTask.md#getboundaryeventitems)
- [end](BusinessRuleTask.md#end)
- [resume](BusinessRuleTask.md#resume)
- [init](BusinessRuleTask.md#init)
- [getOutbounds](BusinessRuleTask.md#getoutbounds)
- [startBoundaryEvents](BusinessRuleTask.md#startboundaryevents)
- [runConnector](BusinessRuleTask.md#runconnector)
- [run](BusinessRuleTask.md#run)
- [mapResult](BusinessRuleTask.md#mapresult)
- [describe](BusinessRuleTask.md#describe)

## Constructors

### constructor

• **new BusinessRuleTask**(`id`, `process`, `type`, `def`): [`BusinessRuleTask`](BusinessRuleTask.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`BusinessRuleTask`](BusinessRuleTask.md)

#### Inherited from

[ServiceTask](ServiceTask.md).[constructor](ServiceTask.md#constructor)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L37)

## Properties

### id

• **id**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[id](ServiceTask.md#id)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[type](ServiceTask.md#type)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[subType](ServiceTask.md#subtype)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[behaviours](ServiceTask.md#behaviours)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[ServiceTask](ServiceTask.md).[isFlow](ServiceTask.md#isflow)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[lane](ServiceTask.md#lane)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L19)

___

### name

• **name**: `string` = `''`

#### Inherited from

[ServiceTask](ServiceTask.md).[name](ServiceTask.md#name)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L18)

___

### process

• **process**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[process](ServiceTask.md#process)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L19)

___

### def

• **def**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[def](ServiceTask.md#def)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L20)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[outbounds](ServiceTask.md#outbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L21)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[inbounds](ServiceTask.md#inbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L22)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[attachments](ServiceTask.md#attachments)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L23)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[ServiceTask](ServiceTask.md).[attachedTo](ServiceTask.md#attachedto)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L24)

___

### messageId

• **messageId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[messageId](ServiceTask.md#messageid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[signalId](ServiceTask.md#signalid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L26)

___

### initiator

• **initiator**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[initiator](ServiceTask.md#initiator)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L27)

___

### assignee

• **assignee**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[assignee](ServiceTask.md#assignee)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L28)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[candidateGroups](ServiceTask.md#candidategroups)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L29)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[candidateUsers](ServiceTask.md#candidateusers)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L30)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[scripts](ServiceTask.md#scripts)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L31)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.processId

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L32)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.requiresWait

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:161](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L161)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.canBeInvoked

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:166](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L166)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.loopDefinition

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:168](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L168)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.isCatching

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:172](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L172)

___

### dataObjectNames

• `get` **dataObjectNames**(): `string`[]

The data objects connected to this element by a data association, either way: their names, as the diagram
shows them (the reference's name, else the data object's or data store's, else its id).

#### Returns

`string`[]

#### Inherited from

ServiceTask.dataObjectNames

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:186](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L186)

___

### exceptionsAsErrors

• `get` **exceptionsAsErrors**(): `boolean`

`owf:exceptionsAsErrors="true"` (or the old `camunda:` name): an exception of the task's work is raised as a BPMN error.

#### Returns

`boolean`

#### Inherited from

ServiceTask.exceptionsAsErrors

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:321](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L321)

___

### serviceName

• `get` **serviceName**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.serviceName

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:53](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L53)

___

### connector

• `get` **connector**(): `ConnectorBehaviour`

The task's camunda:connector, when it calls a connector instead of a service.

#### Returns

`ConnectorBehaviour`

#### Inherited from

ServiceTask.connector

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L63)

___

### decisionRef

• `get` **decisionRef**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:205](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L205)

___

### resultVariable

• `get` **resultVariable**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:206](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L206)

___

### mapDecisionResult

• `get` **mapDecisionResult**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:207](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L207)

## Methods

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[ServiceTask](ServiceTask.md).[restored](ServiceTask.md#restored)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L24)

___

### hasBehaviour

▸ **hasBehaviour**(`name`): `boolean`

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`boolean`

#### Inherited from

[ServiceTask](ServiceTask.md).[hasBehaviour](ServiceTask.md#hasbehaviour)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L34)

___

### getBehaviour

▸ **getBehaviour**(`name`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`any`

#### Inherited from

[ServiceTask](ServiceTask.md).[getBehaviour](ServiceTask.md#getbehaviour)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L38)

___

### addBehaviour

▸ **addBehaviour**(`nane`, `behavriour`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nane` | `any` |
| `behavriour` | `any` |

#### Returns

`void`

#### Inherited from

[ServiceTask](ServiceTask.md).[addBehaviour](ServiceTask.md#addbehaviour)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L41)

___

### validate

▸ **validate**(`item`, `form?`): `Promise`\<`void`\>

The validate event's scripts; and, when a task is completed (`form`: the data sent, and the case's before it), its
form's rules (elements/FormRules.ts). On completion, a rule broken or a script's `{ error }` refuses it:
FormInvalidError (FORM_INVALID), before anything is saved. Otherwise (an assignment) a script's error is an
execution error, as it always was.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `form?` | `Object` |
| `form.sent` | `Record`\<`string`, `any`\> |
| `form.current` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[validate](ServiceTask.md#validate)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L57)

___

### doEvent

▸ **doEvent**(`item`, `event`, `newStatus?`, `eventDetails?`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | [`Item`](Item.md) | `undefined` |
| `event` | [`EXECUTION_EVENT`](../enums/EXECUTION_EVENT.md) | `undefined` |
| `newStatus` | [`ITEM_STATUS`](../enums/ITEM_STATUS.md) | `null` |
| `eventDetails` | `Object` | `{}` |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

[ServiceTask](ServiceTask.md).[doEvent](ServiceTask.md#doevent)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L86)

___

### setInput

▸ **setInput**(`item`, `input`): `Promise`\<`void`\>

is Called after execution 
transform data using input rules
todo

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `input` | `any` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[setInput](ServiceTask.md#setinput)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:124](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L124)

___

### getInput

▸ **getInput**(`item`, `input`): `Promise`\<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `input` | `any` |

#### Returns

`Promise`\<{}\>

#### Inherited from

[ServiceTask](ServiceTask.md).[getInput](ServiceTask.md#getinput)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:134](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L134)

___

### getOutput

▸ **getOutput**(`item`): `Promise`\<{}\>

transform data using output rules
todo

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<{}\>

#### Inherited from

[ServiceTask](ServiceTask.md).[getOutput](ServiceTask.md#getoutput)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:148](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L148)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[ServiceTask](ServiceTask.md).[enter](ServiceTask.md#enter)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:152](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L152)

___

### loadDataObjects

▸ **loadDataObjects**(`item`): `Promise`\<`void`\>

Load the element's data objects into the instance data (appDelegate.loadDataObject), where they are saved
with the instance: `data.client` for a data object 'client'. They load each time the element runs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[loadDataObjects](ServiceTask.md#loaddataobjects)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:203](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L203)

___

### execute

▸ **execute**(`item`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[execute](ServiceTask.md#execute)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:219](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L219)

___

### perform

▸ **perform**(`item`): `Promise`\<`any`\>

Steps 4 and 5 of execute: the work (run), then on. Also a failed item's retry (Token.retry): the work again.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[perform](ServiceTask.md#perform)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:285](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L285)

___

### failed

▸ **failed**(`item`, `error`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

The task's work threw. With exceptionsAsErrors and an error event that catches it (by the exception's code,
else its name; an error event with no code catches any), it is raised there as a BPMN error and the task
ends. Otherwise the item's status is `error`, with the message, saved so the instance shows it and the item
can be retried (engine.retry), and the exception is thrown to the caller as before.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `error` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Inherited from

[ServiceTask](ServiceTask.md).[failed](ServiceTask.md#failed)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:330](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L330)

___

### continue

▸ **continue**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[continue](ServiceTask.md#continue)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:359](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L359)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Inherited from

[ServiceTask](ServiceTask.md).[start](ServiceTask.md#start)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:364](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L364)

___

### cancelEBG

▸ **cancelEBG**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[cancelEBG](ServiceTask.md#cancelebg)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:378](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L378)

___

### cancelBoundaryEvents

▸ **cancelBoundaryEvents**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[cancelBoundaryEvents](ServiceTask.md#cancelboundaryevents)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:386](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L386)

___

### getBoundaryEventItems

▸ **getBoundaryEventItems**(`item`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`[]

#### Inherited from

[ServiceTask](ServiceTask.md).[getBoundaryEventItems](ServiceTask.md#getboundaryeventitems)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:424](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L424)

___

### end

▸ **end**(`item`, `cancel?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | [`Item`](Item.md) | `undefined` |
| `cancel` | `Boolean` | `false` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[end](ServiceTask.md#end)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:462](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L462)

___

### resume

▸ **resume**(`item`): `void`

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[ServiceTask](ServiceTask.md).[resume](ServiceTask.md#resume)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:511](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L511)

___

### init

▸ **init**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Inherited from

[ServiceTask](ServiceTask.md).[init](ServiceTask.md#init)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:514](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L514)

___

### getOutbounds

▸ **getOutbounds**(`item`): `Promise`\<[`Item`](Item.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`Item`](Item.md)[]\>

#### Inherited from

[ServiceTask](ServiceTask.md).[getOutbounds](ServiceTask.md#getoutbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:519](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L519)

___

### startBoundaryEvents

▸ **startBoundaryEvents**(`item`, `token`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `token` | `any` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[startBoundaryEvents](ServiceTask.md#startboundaryevents)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:552](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L552)

___

### runConnector

▸ **runConnector**(`item`, `connector`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

A connector's operation called with the connector's inputs; the response is the output. A status other than
2xx raises the BPMN error HTTP_<status> (a boundary error event catches it), as a service's bpmnError does.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `connector` | `ConnectorBehaviour` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Inherited from

[ServiceTask](ServiceTask.md).[runConnector](ServiceTask.md#runconnector)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L71)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Overrides

[ServiceTask](ServiceTask.md).[run](ServiceTask.md#run)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:209](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L209)

___

### mapResult

▸ **mapResult**(`result`): `any`

The result as camunda:mapDecisionResult asks for it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:233](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L233)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[ServiceTask](ServiceTask.md).[describe](ServiceTask.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:250](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L250)
