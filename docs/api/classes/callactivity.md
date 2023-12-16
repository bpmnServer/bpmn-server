[bpmn-server](../README.md) / CallActivity

# Class: CallActivity

<callActivity id="callCheckCreditProcess" name="Check credit" calledElement="checkCreditProcess" />

the called process need to call me back when done.

 Scenario
     a process 'D1' element 'E' is a 'CallActivity' calling Definition 'D2'
steps:

     1.  Item 'E': item start: start event is fired to prepare for input
     2.  Item 'E': item start: executing the call process passing input
     3.  If Process 'D2' is completed immediatly
             we continue, skip next steps
 *     4.  Process 'D1' goes on a wait state
     5.  When the process 'D2' is completed it calls 'executionEnded'
     6.  We continue with Item:Invoke 
     7.  event 'end' is fired to handle output of the process

## Hierarchy

- [`Node`](Node.md)

  ↳ **`CallActivity`**

## Table of contents

### Constructors

- [constructor](CallActivity.md#constructor)

### Properties

- [assignee](CallActivity.md#assignee)
- [attachedTo](CallActivity.md#attachedto)
- [attachments](CallActivity.md#attachments)
- [behaviours](CallActivity.md#behaviours)
- [def](CallActivity.md#def)
- [id](CallActivity.md#id)
- [inbounds](CallActivity.md#inbounds)
- [initiator](CallActivity.md#initiator)
- [isFlow](CallActivity.md#isflow)
- [lane](CallActivity.md#lane)
- [messageId](CallActivity.md#messageid)
- [name](CallActivity.md#name)
- [outbounds](CallActivity.md#outbounds)
- [process](CallActivity.md#process)
- [scripts](CallActivity.md#scripts)
- [signalId](CallActivity.md#signalid)
- [subType](CallActivity.md#subtype)
- [type](CallActivity.md#type)

### Accessors

- [calledElement](CallActivity.md#calledelement)
- [canBeInvoked](CallActivity.md#canbeinvoked)
- [isCatching](CallActivity.md#iscatching)
- [processId](CallActivity.md#processid)
- [requiresWait](CallActivity.md#requireswait)

### Methods

- [addBehaviour](CallActivity.md#addbehaviour)
- [cancelBoundaryEvents](CallActivity.md#cancelboundaryevents)
- [cancelEBG](CallActivity.md#cancelebg)
- [continue](CallActivity.md#continue)
- [describe](CallActivity.md#describe)
- [doEvent](CallActivity.md#doevent)
- [end](CallActivity.md#end)
- [enter](CallActivity.md#enter)
- [execute](CallActivity.md#execute)
- [getBehaviour](CallActivity.md#getbehaviour)
- [getInput](CallActivity.md#getinput)
- [getOutbounds](CallActivity.md#getoutbounds)
- [getOutput](CallActivity.md#getoutput)
- [hasBehaviour](CallActivity.md#hasbehaviour)
- [init](CallActivity.md#init)
- [restored](CallActivity.md#restored)
- [resume](CallActivity.md#resume)
- [run](CallActivity.md#run)
- [setInput](CallActivity.md#setinput)
- [start](CallActivity.md#start)
- [startBoundaryEvents](CallActivity.md#startboundaryevents)
- [validate](CallActivity.md#validate)
- [executionEnded](CallActivity.md#executionended)

## Constructors

### constructor

• **new CallActivity**(`id`, `process`, `type`, `def`): [`CallActivity`](CallActivity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`CallActivity`](CallActivity.md)

#### Inherited from

[Node](Node.md).[constructor](Node.md#constructor)

#### Defined in

[elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L29)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Node](Node.md).[assignee](Node.md#assignee)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Node](Node.md).[attachedTo](Node.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Node](Node.md).[attachments](Node.md#attachments)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[behaviours](Node.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L17)

___

### def

• **def**: `any`

#### Inherited from

[Node](Node.md).[def](Node.md#def)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[Node](Node.md).[id](Node.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[inbounds](Node.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](Node.md).[initiator](Node.md#initiator)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](Node.md).[isFlow](Node.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](Node.md).[lane](Node.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](Node.md).[messageId](Node.md#messageid)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Node](Node.md).[name](Node.md#name)

#### Defined in

[elements/Node.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[outbounds](Node.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[Node](Node.md).[process](Node.md#process)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[scripts](Node.md#scripts)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L23)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](Node.md).[signalId](Node.md#signalid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](Node.md).[subType](Node.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[Node](Node.md).[type](Node.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L14)

## Accessors

### calledElement

• `get` **calledElement**(): `any`

#### Returns

`any`

#### Defined in

[elements/Tasks.ts:257](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L257)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[elements/Tasks.ts:262](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L262)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[elements/Node.ts:125](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L125)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L24)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.requiresWait

#### Defined in

[elements/Tasks.ts:261](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L261)

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

[elements/Element.ts:39](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L39)

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

[elements/Node.ts:235](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L235)

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

[elements/Node.ts:227](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L227)

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

[elements/Node.ts:208](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L208)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[Node](Node.md).[describe](Node.md#describe)

#### Defined in

[elements/Element.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L21)

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

[elements/Node.ts:53](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L53)

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

[Node](Node.md).[end](Node.md#end)

#### Defined in

[elements/Node.ts:268](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L268)

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

[elements/Node.ts:109](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L109)

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

[elements/Node.ts:135](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L135)

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

[elements/Element.ts:36](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L36)

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

[elements/Node.ts:91](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L91)

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

[elements/Node.ts:311](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L311)

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

[elements/Node.ts:105](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L105)

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

[elements/Element.ts:32](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L32)

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

[elements/Node.ts:306](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L306)

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

[elements/Element.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L22)

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

[elements/Node.ts:303](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L303)

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

[elements/Node.ts:223](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L223)

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

[elements/Node.ts:81](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L81)

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

[Node](Node.md).[start](Node.md#start)

#### Defined in

[elements/Tasks.ts:270](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L270)

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

[elements/Node.ts:330](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L330)

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

[elements/Node.ts:42](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L42)

___

### executionEnded

▸ **executionEnded**(`execution`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`IExecution`](../interfaces/IExecution.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Tasks.ts:264](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L264)
