[bpmn-server](../readme.md) / AdHocSubProcess

# Class: AdHocSubProcess

ad hoc behaviour:
 on `start of subprocess`:
     all nodes without in-flow will be started; user-tasks, timers, script/service tasks etc.
 on `end of subprocess`:
     all nodes that didn't finish, will be terminated
 To `end subprocess`:
 1.  any node can have flow to `end-event`
 2.  model can have an Exclusive-Gateway to terminate the subprocess at particular point
 3   a signal or message can be sent by a script

## Hierarchy

- [`Node`](Node.md)

  ↳ **`AdHocSubProcess`**

## Table of contents

### Constructors

- [constructor](AdHocSubProcess.md#constructor)

### Properties

- [id](AdHocSubProcess.md#id)
- [type](AdHocSubProcess.md#type)
- [subType](AdHocSubProcess.md#subtype)
- [behaviours](AdHocSubProcess.md#behaviours)
- [isFlow](AdHocSubProcess.md#isflow)
- [lane](AdHocSubProcess.md#lane)
- [name](AdHocSubProcess.md#name)
- [process](AdHocSubProcess.md#process)
- [def](AdHocSubProcess.md#def)
- [outbounds](AdHocSubProcess.md#outbounds)
- [inbounds](AdHocSubProcess.md#inbounds)
- [attachments](AdHocSubProcess.md#attachments)
- [attachedTo](AdHocSubProcess.md#attachedto)
- [messageId](AdHocSubProcess.md#messageid)
- [signalId](AdHocSubProcess.md#signalid)
- [initiator](AdHocSubProcess.md#initiator)
- [assignee](AdHocSubProcess.md#assignee)
- [candidateGroups](AdHocSubProcess.md#candidategroups)
- [candidateUsers](AdHocSubProcess.md#candidateusers)
- [scripts](AdHocSubProcess.md#scripts)
- [childProcess](AdHocSubProcess.md#childprocess)

### Accessors

- [processId](AdHocSubProcess.md#processid)
- [loopDefinition](AdHocSubProcess.md#loopdefinition)
- [isCatching](AdHocSubProcess.md#iscatching)
- [dataObjectNames](AdHocSubProcess.md#dataobjectnames)
- [exceptionsAsErrors](AdHocSubProcess.md#exceptionsaserrors)
- [requiresWait](AdHocSubProcess.md#requireswait)
- [canBeInvoked](AdHocSubProcess.md#canbeinvoked)

### Methods

- [restored](AdHocSubProcess.md#restored)
- [hasBehaviour](AdHocSubProcess.md#hasbehaviour)
- [getBehaviour](AdHocSubProcess.md#getbehaviour)
- [addBehaviour](AdHocSubProcess.md#addbehaviour)
- [validate](AdHocSubProcess.md#validate)
- [doEvent](AdHocSubProcess.md#doevent)
- [setInput](AdHocSubProcess.md#setinput)
- [getInput](AdHocSubProcess.md#getinput)
- [getOutput](AdHocSubProcess.md#getoutput)
- [enter](AdHocSubProcess.md#enter)
- [loadDataObjects](AdHocSubProcess.md#loaddataobjects)
- [execute](AdHocSubProcess.md#execute)
- [perform](AdHocSubProcess.md#perform)
- [failed](AdHocSubProcess.md#failed)
- [continue](AdHocSubProcess.md#continue)
- [cancelEBG](AdHocSubProcess.md#cancelebg)
- [cancelBoundaryEvents](AdHocSubProcess.md#cancelboundaryevents)
- [getBoundaryEventItems](AdHocSubProcess.md#getboundaryeventitems)
- [resume](AdHocSubProcess.md#resume)
- [init](AdHocSubProcess.md#init)
- [getOutbounds](AdHocSubProcess.md#getoutbounds)
- [startBoundaryEvents](AdHocSubProcess.md#startboundaryevents)
- [describe](AdHocSubProcess.md#describe)
- [start](AdHocSubProcess.md#start)
- [adHocTokenEnded](AdHocSubProcess.md#adhoctokenended)
- [end](AdHocSubProcess.md#end)
- [getAdHocNodes](AdHocSubProcess.md#getadhocnodes)
- [run](AdHocSubProcess.md#run)

## Constructors

### constructor

• **new AdHocSubProcess**(`id`, `process`, `type`, `def`): [`AdHocSubProcess`](AdHocSubProcess.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`AdHocSubProcess`](AdHocSubProcess.md)

#### Inherited from

[Node](Node.md).[constructor](Node.md#constructor)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L37)

## Properties

### id

• **id**: `any`

#### Inherited from

[Node](Node.md).[id](Node.md#id)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Node](Node.md).[type](Node.md#type)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](Node.md).[subType](Node.md#subtype)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[behaviours](Node.md#behaviours)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](Node.md).[isFlow](Node.md#isflow)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](Node.md).[lane](Node.md#lane)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L19)

___

### name

• **name**: `string` = `''`

#### Inherited from

[Node](Node.md).[name](Node.md#name)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L18)

___

### process

• **process**: `any`

#### Inherited from

[Node](Node.md).[process](Node.md#process)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L19)

___

### def

• **def**: `any`

#### Inherited from

[Node](Node.md).[def](Node.md#def)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L20)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[outbounds](Node.md#outbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L21)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[inbounds](Node.md#inbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L22)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Node](Node.md).[attachments](Node.md#attachments)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L23)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Node](Node.md).[attachedTo](Node.md#attachedto)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L24)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](Node.md).[messageId](Node.md#messageid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](Node.md).[signalId](Node.md#signalid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L26)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](Node.md).[initiator](Node.md#initiator)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L27)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Node](Node.md).[assignee](Node.md#assignee)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L28)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](Node.md).[candidateGroups](Node.md#candidategroups)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L29)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](Node.md).[candidateUsers](Node.md#candidateusers)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L30)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[scripts](Node.md#scripts)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L31)

___

### childProcess

• **childProcess**: [`Process`](Process.md)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:405](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L405)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L32)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

Node.loopDefinition

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:168](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L168)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

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

Node.dataObjectNames

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:186](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L186)

___

### exceptionsAsErrors

• `get` **exceptionsAsErrors**(): `boolean`

`owf:exceptionsAsErrors="true"` (or the old `camunda:` name): an exception of the task's work is raised as a BPMN error.

#### Returns

`boolean`

#### Inherited from

Node.exceptionsAsErrors

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:321](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L321)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.requiresWait

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:406](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L406)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:407](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L407)

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

[Node](Node.md).[restored](Node.md#restored)

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

[Node](Node.md).[hasBehaviour](Node.md#hasbehaviour)

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

[Node](Node.md).[getBehaviour](Node.md#getbehaviour)

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

[Node](Node.md).[addBehaviour](Node.md#addbehaviour)

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

[Node](Node.md).[validate](Node.md#validate)

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

[Node](Node.md).[doEvent](Node.md#doevent)

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

[Node](Node.md).[setInput](Node.md#setinput)

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

[Node](Node.md).[getInput](Node.md#getinput)

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

[Node](Node.md).[getOutput](Node.md#getoutput)

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

[Node](Node.md).[enter](Node.md#enter)

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

[Node](Node.md).[loadDataObjects](Node.md#loaddataobjects)

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

[Node](Node.md).[execute](Node.md#execute)

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

[Node](Node.md).[perform](Node.md#perform)

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

[Node](Node.md).[failed](Node.md#failed)

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

[Node](Node.md).[continue](Node.md#continue)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:359](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L359)

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

[Node](Node.md).[cancelEBG](Node.md#cancelebg)

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

[Node](Node.md).[cancelBoundaryEvents](Node.md#cancelboundaryevents)

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

[Node](Node.md).[getBoundaryEventItems](Node.md#getboundaryeventitems)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:424](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L424)

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

[Node](Node.md).[resume](Node.md#resume)

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

[Node](Node.md).[init](Node.md#init)

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

[Node](Node.md).[getOutbounds](Node.md#getoutbounds)

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

[Node](Node.md).[startBoundaryEvents](Node.md#startboundaryevents)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:552](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L552)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Node](Node.md).[describe](Node.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:571](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L571)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

Offers every activity without an incoming flow at once, each on its own token. The ad hoc sub-process
completes when all of them are done, when one reaches an end event, or when its completionCondition holds
after one is done (adHocTokenEnded).

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Overrides

[Node](Node.md).[start](Node.md#start)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:414](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L414)

___

### adHocTokenEnded

▸ **adHocTokenEnded**(`item`, `ended`): `Promise`\<`void`\>

An activity's token ended (not cancelled): complete the ad hoc sub-process when it is done.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `ended` | [`Token`](Token.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:435](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L435)

___

### end

▸ **end**(`item`, `cancel`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `cancel` | `any` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Node](Node.md).[end](Node.md#end)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:455](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L455)

___

### getAdHocNodes

▸ **getAdHocNodes**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:458](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L458)

___

### run

▸ **run**(`item`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`any`\>

#### Overrides

[Node](Node.md).[run](Node.md#run)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:476](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L476)
