[bpmn-server](../readme.md) / SubProcess

# Class: SubProcess

## Hierarchy

- [`Node`](Node.md)

  ↳ **`SubProcess`**

  ↳↳ [`Transaction`](Transaction.md)

## Table of contents

### Constructors

- [constructor](SubProcess.md#constructor)

### Properties

- [id](SubProcess.md#id)
- [type](SubProcess.md#type)
- [subType](SubProcess.md#subtype)
- [behaviours](SubProcess.md#behaviours)
- [isFlow](SubProcess.md#isflow)
- [lane](SubProcess.md#lane)
- [name](SubProcess.md#name)
- [process](SubProcess.md#process)
- [def](SubProcess.md#def)
- [outbounds](SubProcess.md#outbounds)
- [inbounds](SubProcess.md#inbounds)
- [attachments](SubProcess.md#attachments)
- [attachedTo](SubProcess.md#attachedto)
- [messageId](SubProcess.md#messageid)
- [signalId](SubProcess.md#signalid)
- [initiator](SubProcess.md#initiator)
- [assignee](SubProcess.md#assignee)
- [candidateGroups](SubProcess.md#candidategroups)
- [candidateUsers](SubProcess.md#candidateusers)
- [scripts](SubProcess.md#scripts)
- [childProcess](SubProcess.md#childprocess)

### Accessors

- [processId](SubProcess.md#processid)
- [isCatching](SubProcess.md#iscatching)
- [requiresWait](SubProcess.md#requireswait)
- [canBeInvoked](SubProcess.md#canbeinvoked)

### Methods

- [restored](SubProcess.md#restored)
- [hasBehaviour](SubProcess.md#hasbehaviour)
- [getBehaviour](SubProcess.md#getbehaviour)
- [addBehaviour](SubProcess.md#addbehaviour)
- [validate](SubProcess.md#validate)
- [doEvent](SubProcess.md#doevent)
- [setInput](SubProcess.md#setinput)
- [getInput](SubProcess.md#getinput)
- [getOutput](SubProcess.md#getoutput)
- [enter](SubProcess.md#enter)
- [execute](SubProcess.md#execute)
- [continue](SubProcess.md#continue)
- [run](SubProcess.md#run)
- [cancelEBG](SubProcess.md#cancelebg)
- [cancelBoundaryEvents](SubProcess.md#cancelboundaryevents)
- [end](SubProcess.md#end)
- [resume](SubProcess.md#resume)
- [init](SubProcess.md#init)
- [getOutbounds](SubProcess.md#getoutbounds)
- [startBoundaryEvents](SubProcess.md#startboundaryevents)
- [describe](SubProcess.md#describe)
- [start](SubProcess.md#start)

## Constructors

### constructor

• **new SubProcess**(`id`, `process`, `type`, `def`): [`SubProcess`](SubProcess.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`SubProcess`](SubProcess.md)

#### Inherited from

[Node](Node.md).[constructor](Node.md#constructor)

#### Defined in

[elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L32)

## Properties

### id

• **id**: `any`

#### Inherited from

[Node](Node.md).[id](Node.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Node](Node.md).[type](Node.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](Node.md).[subType](Node.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[behaviours](Node.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](Node.md).[isFlow](Node.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](Node.md).[lane](Node.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Node](Node.md).[name](Node.md#name)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L13)

___

### process

• **process**: `any`

#### Inherited from

[Node](Node.md).[process](Node.md#process)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L14)

___

### def

• **def**: `any`

#### Inherited from

[Node](Node.md).[def](Node.md#def)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L15)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[outbounds](Node.md#outbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L16)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Node](Node.md).[inbounds](Node.md#inbounds)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L17)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Node](Node.md).[attachments](Node.md#attachments)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L18)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Node](Node.md).[attachedTo](Node.md#attachedto)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](Node.md).[messageId](Node.md#messageid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L20)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](Node.md).[signalId](Node.md#signalid)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L21)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](Node.md).[initiator](Node.md#initiator)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L22)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Node](Node.md).[assignee](Node.md#assignee)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L23)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](Node.md).[candidateGroups](Node.md#candidategroups)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L24)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](Node.md).[candidateUsers](Node.md#candidateusers)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L25)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](Node.md).[scripts](Node.md#scripts)

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L26)

___

### childProcess

• **childProcess**: [`Process`](Process.md)

#### Defined in

[elements/Tasks.ts:224](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Tasks.ts#L224)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L27)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[elements/Node.ts:130](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L130)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.requiresWait

#### Defined in

[elements/Tasks.ts:225](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Tasks.ts#L225)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[elements/Tasks.ts:226](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Tasks.ts#L226)

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

[elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L24)

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

[elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L34)

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

[elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L38)

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

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Element.ts#L41)

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

[elements/Node.ts:45](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L45)

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

[elements/Node.ts:58](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L58)

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

[elements/Node.ts:86](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L86)

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

[elements/Node.ts:96](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L96)

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

[elements/Node.ts:110](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L110)

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

[elements/Node.ts:114](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L114)

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

[elements/Node.ts:140](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L140)

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

[elements/Node.ts:213](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L213)

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

[elements/Node.ts:228](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L228)

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

[elements/Node.ts:232](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L232)

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

[elements/Node.ts:240](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L240)

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

[elements/Node.ts:273](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L273)

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

[elements/Node.ts:308](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L308)

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

[elements/Node.ts:311](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L311)

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

[elements/Node.ts:316](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L316)

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

[elements/Node.ts:335](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L335)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Node](Node.md).[describe](Node.md#describe)

#### Defined in

[elements/Node.ts:346](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Node.ts#L346)

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

[elements/Tasks.ts:228](https://github.com/bpmnServer/bpmn-server/blob/4a25965/src/elements/Tasks.ts#L228)
