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
- [isCatching](UserTask.md#iscatching)
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
- [execute](UserTask.md#execute)
- [continue](UserTask.md#continue)
- [run](UserTask.md#run)
- [cancelEBG](UserTask.md#cancelebg)
- [cancelBoundaryEvents](UserTask.md#cancelboundaryevents)
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

[elements/Node.ts:31](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L31)

## Properties

### id

• **id**: `any`

#### Inherited from

[Node](Node.md).[id](Node.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Node](Node.md).[type](Node.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](Node.md).[subType](Node.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[behaviours](Node.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](Node.md).[isFlow](Node.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](Node.md).[lane](Node.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Node](Node.md).[name](Node.md#name)

#### Defined in

[elements/Node.ts:12](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L12)

___

### process

• **process**: `any`

#### Inherited from

[Node](Node.md).[process](Node.md#process)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L13)

___

### def

• **def**: `any`

#### Inherited from

[Node](Node.md).[def](Node.md#def)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L14)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[outbounds](Node.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L15)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[inbounds](Node.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L16)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Node](Node.md).[attachments](Node.md#attachments)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L17)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Node](Node.md).[attachedTo](Node.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L18)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](Node.md).[messageId](Node.md#messageid)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L19)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](Node.md).[signalId](Node.md#signalid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L20)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](Node.md).[initiator](Node.md#initiator)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L21)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Node](Node.md).[assignee](Node.md#assignee)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L22)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](Node.md).[candidateGroups](Node.md#candidategroups)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](Node.md).[candidateUsers](Node.md#candidateusers)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L24)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[scripts](Node.md#scripts)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L25)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L26)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[elements/Node.ts:129](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L129)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.requiresWait

#### Defined in

[elements/Tasks.ts:213](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Tasks.ts#L213)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[elements/Tasks.ts:214](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Tasks.ts#L214)

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

[elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L24)

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

[elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L34)

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

[elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L38)

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

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L41)

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

[elements/Node.ts:44](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L44)

___

### doEvent

▸ **doEvent**(`item`, `event`, `newStatus`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `event` | [`EXECUTION_EVENT`](../enums/EXECUTION_EVENT.md) |
| `newStatus` | [`ITEM_STATUS`](../enums/ITEM_STATUS.md) |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

[Node](Node.md).[doEvent](Node.md#doevent)

#### Defined in

[elements/Node.ts:57](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L57)

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

[elements/Node.ts:85](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L85)

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

[elements/Node.ts:95](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L95)

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

[elements/Node.ts:109](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L109)

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

[elements/Node.ts:113](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L113)

___

### execute

▸ **execute**(`item`): `Promise`\<`void` \| [`wait`](../enums/NODE_ACTION.md#wait) \| [`end`](../enums/NODE_ACTION.md#end) \| [`error`](../enums/NODE_ACTION.md#error) \| [`abort`](../enums/NODE_ACTION.md#abort)\>

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways 
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void` \| [`wait`](../enums/NODE_ACTION.md#wait) \| [`end`](../enums/NODE_ACTION.md#end) \| [`error`](../enums/NODE_ACTION.md#error) \| [`abort`](../enums/NODE_ACTION.md#abort)\>

#### Inherited from

[Node](Node.md).[execute](Node.md#execute)

#### Defined in

[elements/Node.ts:139](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L139)

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

[elements/Node.ts:212](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L212)

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

[elements/Node.ts:227](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L227)

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

[elements/Node.ts:231](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L231)

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

[elements/Node.ts:239](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L239)

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

[elements/Node.ts:307](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L307)

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

[elements/Node.ts:310](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L310)

___

### getOutbounds

▸ **getOutbounds**(`item`): [`Item`](Item.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

[`Item`](Item.md)[]

#### Inherited from

[Node](Node.md).[getOutbounds](Node.md#getoutbounds)

#### Defined in

[elements/Node.ts:315](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L315)

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

[elements/Node.ts:334](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L334)

___

### end

▸ **end**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Node](Node.md).[end](Node.md#end)

#### Defined in

[elements/Tasks.ts:149](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Tasks.ts#L149)

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

[elements/Tasks.ts:153](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Tasks.ts#L153)

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

[elements/Tasks.ts:174](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Tasks.ts#L174)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Node](Node.md).[describe](Node.md#describe)

#### Defined in

[elements/Tasks.ts:202](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Tasks.ts#L202)