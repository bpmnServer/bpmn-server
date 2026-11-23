[bpmn-server](../readme.md) / Transaction

# Class: Transaction

## Hierarchy

- [`SubProcess`](SubProcess.md)

  ↳ **`Transaction`**

## Table of contents

### Constructors

- [constructor](Transaction.md#constructor)

### Properties

- [id](Transaction.md#id)
- [type](Transaction.md#type)
- [subType](Transaction.md#subtype)
- [behaviours](Transaction.md#behaviours)
- [isFlow](Transaction.md#isflow)
- [lane](Transaction.md#lane)
- [name](Transaction.md#name)
- [process](Transaction.md#process)
- [def](Transaction.md#def)
- [outbounds](Transaction.md#outbounds)
- [inbounds](Transaction.md#inbounds)
- [attachments](Transaction.md#attachments)
- [attachedTo](Transaction.md#attachedto)
- [messageId](Transaction.md#messageid)
- [signalId](Transaction.md#signalid)
- [initiator](Transaction.md#initiator)
- [assignee](Transaction.md#assignee)
- [candidateGroups](Transaction.md#candidategroups)
- [candidateUsers](Transaction.md#candidateusers)
- [scripts](Transaction.md#scripts)
- [childProcess](Transaction.md#childprocess)

### Accessors

- [processId](Transaction.md#processid)
- [loopDefinition](Transaction.md#loopdefinition)
- [isCatching](Transaction.md#iscatching)
- [dataObjectNames](Transaction.md#dataobjectnames)
- [exceptionsAsErrors](Transaction.md#exceptionsaserrors)
- [canBeInvoked](Transaction.md#canbeinvoked)
- [requiresWait](Transaction.md#requireswait)
- [isTransaction](Transaction.md#istransaction)

### Methods

- [restored](Transaction.md#restored)
- [hasBehaviour](Transaction.md#hasbehaviour)
- [getBehaviour](Transaction.md#getbehaviour)
- [addBehaviour](Transaction.md#addbehaviour)
- [validate](Transaction.md#validate)
- [doEvent](Transaction.md#doevent)
- [setInput](Transaction.md#setinput)
- [getInput](Transaction.md#getinput)
- [getOutput](Transaction.md#getoutput)
- [enter](Transaction.md#enter)
- [loadDataObjects](Transaction.md#loaddataobjects)
- [execute](Transaction.md#execute)
- [perform](Transaction.md#perform)
- [failed](Transaction.md#failed)
- [continue](Transaction.md#continue)
- [run](Transaction.md#run)
- [cancelEBG](Transaction.md#cancelebg)
- [cancelBoundaryEvents](Transaction.md#cancelboundaryevents)
- [getBoundaryEventItems](Transaction.md#getboundaryeventitems)
- [resume](Transaction.md#resume)
- [init](Transaction.md#init)
- [getOutbounds](Transaction.md#getoutbounds)
- [startBoundaryEvents](Transaction.md#startboundaryevents)
- [describe](Transaction.md#describe)
- [end](Transaction.md#end)
- [Cancel](Transaction.md#cancel)
- [Compensate](Transaction.md#compensate)
- [getNodes](Transaction.md#getnodes)
- [getItemsForToken](Transaction.md#getitemsfortoken)
- [getItems](Transaction.md#getitems)
- [start](Transaction.md#start)

## Constructors

### constructor

• **new Transaction**(`id`, `process`, `type`, `def`): [`Transaction`](Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`Transaction`](Transaction.md)

#### Inherited from

[SubProcess](SubProcess.md).[constructor](SubProcess.md#constructor)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L37)

## Properties

### id

• **id**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[id](SubProcess.md#id)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[type](SubProcess.md#type)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[subType](SubProcess.md#subtype)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[SubProcess](SubProcess.md).[behaviours](SubProcess.md#behaviours)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[SubProcess](SubProcess.md).[isFlow](SubProcess.md#isflow)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[lane](SubProcess.md#lane)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L19)

___

### name

• **name**: `string` = `''`

#### Inherited from

[SubProcess](SubProcess.md).[name](SubProcess.md#name)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L18)

___

### process

• **process**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[process](SubProcess.md#process)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L19)

___

### def

• **def**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[def](SubProcess.md#def)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L20)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[SubProcess](SubProcess.md).[outbounds](SubProcess.md#outbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L21)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[SubProcess](SubProcess.md).[inbounds](SubProcess.md#inbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L22)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[SubProcess](SubProcess.md).[attachments](SubProcess.md#attachments)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L23)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[SubProcess](SubProcess.md).[attachedTo](SubProcess.md#attachedto)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L24)

___

### messageId

• **messageId**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[messageId](SubProcess.md#messageid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[signalId](SubProcess.md#signalid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L26)

___

### initiator

• **initiator**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[initiator](SubProcess.md#initiator)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L27)

___

### assignee

• **assignee**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[assignee](SubProcess.md#assignee)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L28)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[candidateGroups](SubProcess.md#candidategroups)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L29)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[candidateUsers](SubProcess.md#candidateusers)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L30)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[SubProcess](SubProcess.md).[scripts](SubProcess.md#scripts)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L31)

___

### childProcess

• **childProcess**: [`Process`](Process.md)

#### Inherited from

[SubProcess](SubProcess.md).[childProcess](SubProcess.md#childprocess)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:339](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L339)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

SubProcess.processId

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L32)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

SubProcess.loopDefinition

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:168](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L168)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SubProcess.isCatching

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

SubProcess.dataObjectNames

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:186](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L186)

___

### exceptionsAsErrors

• `get` **exceptionsAsErrors**(): `boolean`

`owf:exceptionsAsErrors="true"` (or the old `camunda:` name): an exception of the task's work is raised as a BPMN error.

#### Returns

`boolean`

#### Inherited from

SubProcess.exceptionsAsErrors

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:321](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L321)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SubProcess.canBeInvoked

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:341](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L341)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

SubProcess.requiresWait

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L15)

___

### isTransaction

• `get` **isTransaction**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L22)

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

[SubProcess](SubProcess.md).[restored](SubProcess.md#restored)

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

[SubProcess](SubProcess.md).[hasBehaviour](SubProcess.md#hasbehaviour)

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

[SubProcess](SubProcess.md).[getBehaviour](SubProcess.md#getbehaviour)

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

[SubProcess](SubProcess.md).[addBehaviour](SubProcess.md#addbehaviour)

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

[SubProcess](SubProcess.md).[validate](SubProcess.md#validate)

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

[SubProcess](SubProcess.md).[doEvent](SubProcess.md#doevent)

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

[SubProcess](SubProcess.md).[setInput](SubProcess.md#setinput)

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

[SubProcess](SubProcess.md).[getInput](SubProcess.md#getinput)

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

[SubProcess](SubProcess.md).[getOutput](SubProcess.md#getoutput)

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

[SubProcess](SubProcess.md).[enter](SubProcess.md#enter)

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

[SubProcess](SubProcess.md).[loadDataObjects](SubProcess.md#loaddataobjects)

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

[SubProcess](SubProcess.md).[execute](SubProcess.md#execute)

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

[SubProcess](SubProcess.md).[perform](SubProcess.md#perform)

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

[SubProcess](SubProcess.md).[failed](SubProcess.md#failed)

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

[SubProcess](SubProcess.md).[continue](SubProcess.md#continue)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:359](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L359)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Inherited from

[SubProcess](SubProcess.md).[run](SubProcess.md#run)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:374](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L374)

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

[SubProcess](SubProcess.md).[cancelEBG](SubProcess.md#cancelebg)

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

[SubProcess](SubProcess.md).[cancelBoundaryEvents](SubProcess.md#cancelboundaryevents)

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

[SubProcess](SubProcess.md).[getBoundaryEventItems](SubProcess.md#getboundaryeventitems)

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

[SubProcess](SubProcess.md).[resume](SubProcess.md#resume)

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

[SubProcess](SubProcess.md).[init](SubProcess.md#init)

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

[SubProcess](SubProcess.md).[getOutbounds](SubProcess.md#getoutbounds)

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

[SubProcess](SubProcess.md).[startBoundaryEvents](SubProcess.md#startboundaryevents)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:552](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L552)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[SubProcess](SubProcess.md).[describe](SubProcess.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:571](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L571)

___

### end

▸ **end**(`item`, `cancel?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | `any` | `undefined` |
| `cancel` | `Boolean` | `false` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SubProcess](SubProcess.md).[end](SubProcess.md#end)

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L17)

___

### Cancel

▸ **Cancel**(`transaction`): `Promise`\<`void`\>

Cancel Transaction
 is called by Throw Cancel Event
 
 1.  Aborts any started items in the transaction
 2.  Compensate any completed items

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L32)

___

### Compensate

▸ **Compensate**(`transItem`): `Promise`\<`void`\>

Compensate Transaction
 is called by Throw Compensate Event
 this is called outside of the transaction
 
 1.  Compensate any completed items

#### Parameters

| Name | Type |
| :------ | :------ |
| `transItem` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L45)

___

### getNodes

▸ **getNodes**(): [`Node`](Node.md)[]

#### Returns

[`Node`](Node.md)[]

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:87](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L87)

___

### getItemsForToken

▸ **getItemsForToken**(`token`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `any` |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:91](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L91)

___

### getItems

▸ **getItems**(`item`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:105](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L105)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Overrides

[SubProcess](SubProcess.md).[start](SubProcess.md#start)

#### Defined in

[packages/bpmn-server/src/elements/Transaction.ts:110](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Transaction.ts#L110)
