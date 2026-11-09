[bpmn-server](../readme.md) / UserTask

# Class: UserTask

## Hierarchy

- [`Node`](Node.md)

  ↳ **`UserTask`**

## Table of contents

### Constructors

- [constructor](UserTask.md#constructor)

### Properties

- [id](UserTask.md#id)
- [type](UserTask.md#type)
- [subType](UserTask.md#subtype)
- [behaviours](UserTask.md#behaviours)
- [isFlow](UserTask.md#isflow)
- [lane](UserTask.md#lane)
- [name](UserTask.md#name)
- [process](UserTask.md#process)
- [def](UserTask.md#def)
- [outbounds](UserTask.md#outbounds)
- [inbounds](UserTask.md#inbounds)
- [attachments](UserTask.md#attachments)
- [attachedTo](UserTask.md#attachedto)
- [messageId](UserTask.md#messageid)
- [signalId](UserTask.md#signalid)
- [initiator](UserTask.md#initiator)
- [assignee](UserTask.md#assignee)
- [candidateGroups](UserTask.md#candidategroups)
- [candidateUsers](UserTask.md#candidateusers)
- [scripts](UserTask.md#scripts)

### Accessors

- [processId](UserTask.md#processid)
- [loopDefinition](UserTask.md#loopdefinition)
- [isCatching](UserTask.md#iscatching)
- [dataObjectNames](UserTask.md#dataobjectnames)
- [exceptionsAsErrors](UserTask.md#exceptionsaserrors)
- [requiresWait](UserTask.md#requireswait)
- [canBeInvoked](UserTask.md#canbeinvoked)

### Methods

- [restored](UserTask.md#restored)
- [hasBehaviour](UserTask.md#hasbehaviour)
- [getBehaviour](UserTask.md#getbehaviour)
- [addBehaviour](UserTask.md#addbehaviour)
- [validate](UserTask.md#validate)
- [doEvent](UserTask.md#doevent)
- [setInput](UserTask.md#setinput)
- [getInput](UserTask.md#getinput)
- [getOutput](UserTask.md#getoutput)
- [enter](UserTask.md#enter)
- [loadDataObjects](UserTask.md#loaddataobjects)
- [execute](UserTask.md#execute)
- [perform](UserTask.md#perform)
- [failed](UserTask.md#failed)
- [continue](UserTask.md#continue)
- [run](UserTask.md#run)
- [cancelEBG](UserTask.md#cancelebg)
- [cancelBoundaryEvents](UserTask.md#cancelboundaryevents)
- [getBoundaryEventItems](UserTask.md#getboundaryeventitems)
- [resume](UserTask.md#resume)
- [init](UserTask.md#init)
- [getOutbounds](UserTask.md#getoutbounds)
- [startBoundaryEvents](UserTask.md#startboundaryevents)
- [end](UserTask.md#end)
- [start](UserTask.md#start)
- [setAssignVal](UserTask.md#setassignval)
- [describe](UserTask.md#describe)

## Constructors

### constructor

• **new UserTask**(`id`, `process`, `type`, `def`): [`UserTask`](UserTask.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`UserTask`](UserTask.md)

#### Inherited from

[Node](Node.md).[constructor](Node.md#constructor)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L34)

## Properties

### id

• **id**: `any`

#### Inherited from

[Node](Node.md).[id](Node.md#id)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Node](Node.md).[type](Node.md#type)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](Node.md).[subType](Node.md#subtype)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[behaviours](Node.md#behaviours)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](Node.md).[isFlow](Node.md#isflow)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](Node.md).[lane](Node.md#lane)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L19)

___

### name

• **name**: `string` = `''`

#### Inherited from

[Node](Node.md).[name](Node.md#name)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[Node](Node.md).[process](Node.md#process)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L16)

___

### def

• **def**: `any`

#### Inherited from

[Node](Node.md).[def](Node.md#def)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L17)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[outbounds](Node.md#outbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L18)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[inbounds](Node.md#inbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L19)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Node](Node.md).[attachments](Node.md#attachments)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L20)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Node](Node.md).[attachedTo](Node.md#attachedto)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L21)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](Node.md).[messageId](Node.md#messageid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L22)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](Node.md).[signalId](Node.md#signalid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L23)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](Node.md).[initiator](Node.md#initiator)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L24)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Node](Node.md).[assignee](Node.md#assignee)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L25)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](Node.md).[candidateGroups](Node.md#candidategroups)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L26)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](Node.md).[candidateUsers](Node.md#candidateusers)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L27)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[scripts](Node.md#scripts)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L28)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L29)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

Node.loopDefinition

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:143](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L143)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:147](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L147)

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

[packages/bpmn-server/src/elements/Node.ts:161](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L161)

___

### exceptionsAsErrors

• `get` **exceptionsAsErrors**(): `boolean`

`camunda:exceptionsAsErrors="true"`: an exception of the task's work is raised as a BPMN error.

#### Returns

`boolean`

#### Inherited from

Node.exceptionsAsErrors

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:296](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L296)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.requiresWait

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:335](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Tasks.ts#L335)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:336](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Tasks.ts#L336)

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

[packages/bpmn-server/src/elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L24)

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

[packages/bpmn-server/src/elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L34)

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

[packages/bpmn-server/src/elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L38)

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

[packages/bpmn-server/src/elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Element.ts#L41)

___

### validate

▸ **validate**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Node](Node.md).[validate](Node.md#validate)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:48](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L48)

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

[packages/bpmn-server/src/elements/Node.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L61)

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

[packages/bpmn-server/src/elements/Node.ts:99](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L99)

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

[packages/bpmn-server/src/elements/Node.ts:109](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L109)

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

[packages/bpmn-server/src/elements/Node.ts:123](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L123)

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

[packages/bpmn-server/src/elements/Node.ts:127](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L127)

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

[packages/bpmn-server/src/elements/Node.ts:178](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L178)

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

[packages/bpmn-server/src/elements/Node.ts:194](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L194)

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

[packages/bpmn-server/src/elements/Node.ts:260](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L260)

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

[packages/bpmn-server/src/elements/Node.ts:305](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L305)

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

[packages/bpmn-server/src/elements/Node.ts:334](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L334)

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

[Node](Node.md).[run](Node.md#run)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:349](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L349)

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

[packages/bpmn-server/src/elements/Node.ts:353](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L353)

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

[packages/bpmn-server/src/elements/Node.ts:361](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L361)

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

[packages/bpmn-server/src/elements/Node.ts:399](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L399)

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

[packages/bpmn-server/src/elements/Node.ts:486](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L486)

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

[packages/bpmn-server/src/elements/Node.ts:489](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L489)

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

[packages/bpmn-server/src/elements/Node.ts:494](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L494)

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

[packages/bpmn-server/src/elements/Node.ts:527](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Node.ts#L527)

___

### end

▸ **end**(`item`, `cancel?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | [`Item`](Item.md) | `undefined` |
| `cancel` | `boolean` | `false` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Node](Node.md).[end](Node.md#end)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:272](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Tasks.ts#L272)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Overrides

[Node](Node.md).[start](Node.md#start)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:276](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Tasks.ts#L276)

___

### setAssignVal

▸ **setAssignVal**(`item`, `attr`, `dateFormat?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | `any` | `undefined` |
| `attr` | `any` | `undefined` |
| `dateFormat` | `boolean` | `false` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:297](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Tasks.ts#L297)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Node](Node.md).[describe](Node.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:324](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Tasks.ts#L324)
