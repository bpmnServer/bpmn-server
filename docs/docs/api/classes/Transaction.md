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
- [execute](Transaction.md#execute)
- [continue](Transaction.md#continue)
- [run](Transaction.md#run)
- [cancelEBG](Transaction.md#cancelebg)
- [cancelBoundaryEvents](Transaction.md#cancelboundaryevents)
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

[elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L32)

## Properties

### id

• **id**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[id](SubProcess.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[type](SubProcess.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[subType](SubProcess.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[SubProcess](SubProcess.md).[behaviours](SubProcess.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[SubProcess](SubProcess.md).[isFlow](SubProcess.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[lane](SubProcess.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[name](SubProcess.md#name)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L13)

___

### process

• **process**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[process](SubProcess.md#process)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L14)

___

### def

• **def**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[def](SubProcess.md#def)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L15)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[SubProcess](SubProcess.md).[outbounds](SubProcess.md#outbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L16)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[SubProcess](SubProcess.md).[inbounds](SubProcess.md#inbounds)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L17)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[SubProcess](SubProcess.md).[attachments](SubProcess.md#attachments)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L18)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[SubProcess](SubProcess.md).[attachedTo](SubProcess.md#attachedto)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[messageId](SubProcess.md#messageid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L20)

___

### signalId

• **signalId**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[signalId](SubProcess.md#signalid)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L21)

___

### initiator

• **initiator**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[initiator](SubProcess.md#initiator)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L22)

___

### assignee

• **assignee**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[assignee](SubProcess.md#assignee)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L23)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[candidateGroups](SubProcess.md#candidategroups)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L24)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[SubProcess](SubProcess.md).[candidateUsers](SubProcess.md#candidateusers)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L25)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[SubProcess](SubProcess.md).[scripts](SubProcess.md#scripts)

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L26)

___

### childProcess

• **childProcess**: [`Process`](Process.md)

#### Inherited from

[SubProcess](SubProcess.md).[childProcess](SubProcess.md#childprocess)

#### Defined in

[elements/Tasks.ts:238](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L238)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

SubProcess.processId

#### Defined in

[elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L27)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

SubProcess.loopDefinition

#### Defined in

[elements/Node.ts:138](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L138)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SubProcess.isCatching

#### Defined in

[elements/Node.ts:142](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L142)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SubProcess.canBeInvoked

#### Defined in

[elements/Tasks.ts:240](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L240)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

SubProcess.requiresWait

#### Defined in

[elements/Transaction.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L15)

___

### isTransaction

• `get` **isTransaction**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/Transaction.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L22)

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

[SubProcess](SubProcess.md).[hasBehaviour](SubProcess.md#hasbehaviour)

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

[SubProcess](SubProcess.md).[getBehaviour](SubProcess.md#getbehaviour)

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

[SubProcess](SubProcess.md).[addBehaviour](SubProcess.md#addbehaviour)

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

[SubProcess](SubProcess.md).[validate](SubProcess.md#validate)

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

[SubProcess](SubProcess.md).[doEvent](SubProcess.md#doevent)

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

[SubProcess](SubProcess.md).[setInput](SubProcess.md#setinput)

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

[SubProcess](SubProcess.md).[getInput](SubProcess.md#getinput)

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

[SubProcess](SubProcess.md).[getOutput](SubProcess.md#getoutput)

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

[SubProcess](SubProcess.md).[enter](SubProcess.md#enter)

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

[SubProcess](SubProcess.md).[execute](SubProcess.md#execute)

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

[SubProcess](SubProcess.md).[continue](SubProcess.md#continue)

#### Defined in

[elements/Node.ts:232](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L232)

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

[elements/Node.ts:247](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L247)

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

[SubProcess](SubProcess.md).[cancelBoundaryEvents](SubProcess.md#cancelboundaryevents)

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

[SubProcess](SubProcess.md).[resume](SubProcess.md#resume)

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

[SubProcess](SubProcess.md).[init](SubProcess.md#init)

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

[SubProcess](SubProcess.md).[getOutbounds](SubProcess.md#getoutbounds)

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

[SubProcess](SubProcess.md).[startBoundaryEvents](SubProcess.md#startboundaryevents)

#### Defined in

[elements/Node.ts:363](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L363)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[SubProcess](SubProcess.md).[describe](SubProcess.md#describe)

#### Defined in

[elements/Node.ts:374](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L374)

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

[elements/Transaction.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L17)

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

[elements/Transaction.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L32)

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

[elements/Transaction.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L45)

___

### getNodes

▸ **getNodes**(): [`Node`](Node.md)[]

#### Returns

[`Node`](Node.md)[]

#### Defined in

[elements/Transaction.ts:87](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L87)

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

[elements/Transaction.ts:91](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L91)

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

[elements/Transaction.ts:105](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L105)

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

[elements/Transaction.ts:110](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Transaction.ts#L110)
