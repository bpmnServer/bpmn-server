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
- [execute](AdHocSubProcess.md#execute)
- [continue](AdHocSubProcess.md#continue)
- [cancelEBG](AdHocSubProcess.md#cancelebg)
- [cancelBoundaryEvents](AdHocSubProcess.md#cancelboundaryevents)
- [resume](AdHocSubProcess.md#resume)
- [init](AdHocSubProcess.md#init)
- [getOutbounds](AdHocSubProcess.md#getoutbounds)
- [startBoundaryEvents](AdHocSubProcess.md#startboundaryevents)
- [describe](AdHocSubProcess.md#describe)
- [start](AdHocSubProcess.md#start)
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

[elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L32)

## Properties

### id

• **id**: `any`

#### Inherited from

[Node](Node.md).[id](Node.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Node](Node.md).[type](Node.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](Node.md).[subType](Node.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[behaviours](Node.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](Node.md).[isFlow](Node.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](Node.md).[lane](Node.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Node](Node.md).[name](Node.md#name)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L13)

___

### process

• **process**: `any`

#### Inherited from

[Node](Node.md).[process](Node.md#process)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L14)

___

### def

• **def**: `any`

#### Inherited from

[Node](Node.md).[def](Node.md#def)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L15)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[outbounds](Node.md#outbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L16)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[inbounds](Node.md#inbounds)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L17)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Node](Node.md).[attachments](Node.md#attachments)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L18)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Node](Node.md).[attachedTo](Node.md#attachedto)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](Node.md).[messageId](Node.md#messageid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L20)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](Node.md).[signalId](Node.md#signalid)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L21)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](Node.md).[initiator](Node.md#initiator)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L22)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Node](Node.md).[assignee](Node.md#assignee)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L23)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](Node.md).[candidateGroups](Node.md#candidategroups)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L24)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](Node.md).[candidateUsers](Node.md#candidateusers)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L25)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[scripts](Node.md#scripts)

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L26)

___

### childProcess

• **childProcess**: [`Process`](Process.md)

#### Defined in

[elements/Tasks.ts:287](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L287)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L27)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

Node.loopDefinition

#### Defined in

[elements/Node.ts:138](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L138)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[elements/Node.ts:142](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L142)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.requiresWait

#### Defined in

[elements/Tasks.ts:288](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L288)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[elements/Tasks.ts:289](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L289)

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

[elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L24)

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

[elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L34)

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

[elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L38)

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

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L41)

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

[elements/Node.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L45)

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

[elements/Node.ts:58](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L58)

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

[elements/Node.ts:94](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L94)

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

[elements/Node.ts:104](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L104)

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

[elements/Node.ts:118](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L118)

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

[elements/Node.ts:122](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L122)

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

[elements/Node.ts:152](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L152)

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

[elements/Node.ts:232](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L232)

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

[elements/Node.ts:251](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L251)

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

[elements/Node.ts:259](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L259)

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

[elements/Node.ts:336](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L336)

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

[elements/Node.ts:339](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L339)

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

[elements/Node.ts:344](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L344)

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

[elements/Node.ts:363](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L363)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Node](Node.md).[describe](Node.md#describe)

#### Defined in

[elements/Node.ts:374](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L374)

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

[elements/Tasks.ts:291](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L291)

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

[elements/Tasks.ts:329](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L329)

___

### getAdHocNodes

▸ **getAdHocNodes**(): `any`[]

#### Returns

`any`[]

#### Defined in

[elements/Tasks.ts:338](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L338)

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

[elements/Tasks.ts:356](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L356)
