[bpmn-server](../README.md) / UserTask

# Class: UserTask

## Hierarchy

- [`Node`](Node.md)

  ↳ **`UserTask`**

## Table of contents

### Constructors

- [constructor](UserTask.md#constructor)

### Properties

- [assignee](UserTask.md#assignee)
- [attachedTo](UserTask.md#attachedto)
- [attachments](UserTask.md#attachments)
- [behaviours](UserTask.md#behaviours)
- [candidateGroups](UserTask.md#candidategroups)
- [candidateUsers](UserTask.md#candidateusers)
- [def](UserTask.md#def)
- [id](UserTask.md#id)
- [inbounds](UserTask.md#inbounds)
- [initiator](UserTask.md#initiator)
- [isFlow](UserTask.md#isflow)
- [lane](UserTask.md#lane)
- [messageId](UserTask.md#messageid)
- [name](UserTask.md#name)
- [outbounds](UserTask.md#outbounds)
- [process](UserTask.md#process)
- [scripts](UserTask.md#scripts)
- [signalId](UserTask.md#signalid)
- [subType](UserTask.md#subtype)
- [type](UserTask.md#type)

### Accessors

- [canBeInvoked](UserTask.md#canbeinvoked)
- [isCatching](UserTask.md#iscatching)
- [processId](UserTask.md#processid)
- [requiresWait](UserTask.md#requireswait)

### Methods

- [addBehaviour](UserTask.md#addbehaviour)
- [cancelBoundaryEvents](UserTask.md#cancelboundaryevents)
- [cancelEBG](UserTask.md#cancelebg)
- [continue](UserTask.md#continue)
- [describe](UserTask.md#describe)
- [doEvent](UserTask.md#doevent)
- [end](UserTask.md#end)
- [enter](UserTask.md#enter)
- [execute](UserTask.md#execute)
- [getBehaviour](UserTask.md#getbehaviour)
- [getInput](UserTask.md#getinput)
- [getOutbounds](UserTask.md#getoutbounds)
- [getOutput](UserTask.md#getoutput)
- [hasBehaviour](UserTask.md#hasbehaviour)
- [init](UserTask.md#init)
- [restored](UserTask.md#restored)
- [resume](UserTask.md#resume)
- [run](UserTask.md#run)
- [setAssignVal](UserTask.md#setassignval)
- [setInput](UserTask.md#setinput)
- [start](UserTask.md#start)
- [startBoundaryEvents](UserTask.md#startboundaryevents)
- [validate](UserTask.md#validate)

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

[elements/Node.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Node](Node.md).[assignee](Node.md#assignee)

#### Defined in

[elements/Node.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-22)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Node](Node.md).[attachedTo](Node.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-18)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Node](Node.md).[attachments](Node.md#attachments)

#### Defined in

[elements/Node.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[behaviours](Node.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](Node.md).[candidateGroups](Node.md#candidategroups)

#### Defined in

[elements/Node.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](Node.md).[candidateUsers](Node.md#candidateusers)

#### Defined in

[elements/Node.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-24)

___

### def

• **def**: `any`

#### Inherited from

[Node](Node.md).[def](Node.md#def)

#### Defined in

[elements/Node.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-14)

___

### id

• **id**: `any`

#### Inherited from

[Node](Node.md).[id](Node.md#id)

#### Defined in

[elements/Element.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-13)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[inbounds](Node.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](Node.md).[initiator](Node.md#initiator)

#### Defined in

[elements/Node.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](Node.md).[isFlow](Node.md#isflow)

#### Defined in

[elements/Element.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](Node.md).[lane](Node.md#lane)

#### Defined in

[elements/Element.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](Node.md).[messageId](Node.md#messageid)

#### Defined in

[elements/Node.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-19)

___

### name

• **name**: `any`

#### Inherited from

[Node](Node.md).[name](Node.md#name)

#### Defined in

[elements/Node.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-12)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[outbounds](Node.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-15)

___

### process

• **process**: `any`

#### Inherited from

[Node](Node.md).[process](Node.md#process)

#### Defined in

[elements/Node.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[scripts](Node.md#scripts)

#### Defined in

[elements/Node.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](Node.md).[signalId](Node.md#signalid)

#### Defined in

[elements/Node.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-20)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](Node.md).[subType](Node.md#subtype)

#### Defined in

[elements/Element.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-15)

___

### type

• **type**: `any`

#### Inherited from

[Node](Node.md).[type](Node.md#type)

#### Defined in

[elements/Element.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[elements/Tasks.ts:213](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-213)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[elements/Node.ts:129](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-129)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[elements/Node.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.requiresWait

#### Defined in

[elements/Tasks.ts:212](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-212)

## Methods

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

[elements/Element.ts:41](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-41)

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

[elements/Node.ts:239](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-239)

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

[elements/Node.ts:231](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-231)

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

[elements/Node.ts:212](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Node](Node.md).[describe](Node.md#describe)

#### Defined in

[elements/Tasks.ts:201](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-201)

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

[elements/Node.ts:57](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-57)

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

[elements/Tasks.ts:148](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-148)

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

[elements/Node.ts:113](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-113)

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

[elements/Node.ts:139](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-139)

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

[elements/Element.ts:38](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-38)

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

[elements/Node.ts:95](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-95)

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

[elements/Node.ts:315](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-315)

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

[elements/Node.ts:109](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-109)

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

[elements/Element.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-34)

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

[elements/Node.ts:310](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-310)

___

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

[elements/Element.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-24)

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

[elements/Node.ts:307](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-307)

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

[elements/Node.ts:227](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-227)

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

[elements/Tasks.ts:173](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-173)

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

[elements/Node.ts:85](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-85)

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

[elements/Tasks.ts:152](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-152)

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

[elements/Node.ts:334](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-334)

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

[elements/Node.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-44)
