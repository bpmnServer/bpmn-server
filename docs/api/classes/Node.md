[bpmn-server](../API.md) / Node

# Class: Node

## Hierarchy

- [`Element`](Element.md)

  ↳ **`Node`**

  ↳↳ [`UserTask`](UserTask.md)

  ↳↳ [`ScriptTask`](ScriptTask.md)

  ↳↳ [`ServiceTask`](ServiceTask.md)

  ↳↳ [`ReceiveTask`](ReceiveTask.md)

  ↳↳ [`SubProcess`](SubProcess.md)

  ↳↳ [`CallActivity`](CallActivity.md)

  ↳↳ [`Event`](Event.md)

  ↳↳ [`Gateway`](Gateway.md)

## Table of contents

### Constructors

- [constructor](Node.md#constructor)

### Properties

- [id](Node.md#id)
- [type](Node.md#type)
- [subType](Node.md#subtype)
- [behaviours](Node.md#behaviours)
- [isFlow](Node.md#isflow)
- [lane](Node.md#lane)
- [name](Node.md#name)
- [process](Node.md#process)
- [def](Node.md#def)
- [outbounds](Node.md#outbounds)
- [inbounds](Node.md#inbounds)
- [attachments](Node.md#attachments)
- [attachedTo](Node.md#attachedto)
- [messageId](Node.md#messageid)
- [signalId](Node.md#signalid)
- [initiator](Node.md#initiator)
- [assignee](Node.md#assignee)
- [candidateGroups](Node.md#candidategroups)
- [candidateUsers](Node.md#candidateusers)
- [scripts](Node.md#scripts)

### Accessors

- [processId](Node.md#processid)
- [requiresWait](Node.md#requireswait)
- [canBeInvoked](Node.md#canbeinvoked)
- [isCatching](Node.md#iscatching)

### Methods

- [restored](Node.md#restored)
- [hasBehaviour](Node.md#hasbehaviour)
- [getBehaviour](Node.md#getbehaviour)
- [addBehaviour](Node.md#addbehaviour)
- [validate](Node.md#validate)
- [doEvent](Node.md#doevent)
- [setInput](Node.md#setinput)
- [getInput](Node.md#getinput)
- [getOutput](Node.md#getoutput)
- [enter](Node.md#enter)
- [execute](Node.md#execute)
- [continue](Node.md#continue)
- [start](Node.md#start)
- [run](Node.md#run)
- [cancelEBG](Node.md#cancelebg)
- [cancelBoundaryEvents](Node.md#cancelboundaryevents)
- [end](Node.md#end)
- [resume](Node.md#resume)
- [init](Node.md#init)
- [getOutbounds](Node.md#getoutbounds)
- [startBoundaryEvents](Node.md#startboundaryevents)
- [describe](Node.md#describe)

## Constructors

### constructor

• **new Node**(`id`, `process`, `type`, `def`): [`Node`](Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`Node`](Node.md)

#### Overrides

[Element](Element.md).[constructor](Element.md#constructor)

#### Defined in

[elements/Node.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L31)

## Properties

### id

• **id**: `any`

#### Inherited from

[Element](Element.md).[id](Element.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Element](Element.md).[type](Element.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Element](Element.md).[subType](Element.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Element](Element.md).[behaviours](Element.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Element](Element.md).[isFlow](Element.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Element](Element.md).[lane](Element.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Overrides

[Element](Element.md).[name](Element.md#name)

#### Defined in

[elements/Node.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L12)

___

### process

• **process**: `any`

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L13)

___

### def

• **def**: `any`

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L14)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L15)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L16)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L17)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L18)

___

### messageId

• **messageId**: `any`

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L19)

___

### signalId

• **signalId**: `any`

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L20)

___

### initiator

• **initiator**: `any`

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L21)

___

### assignee

• **assignee**: `any`

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L22)

___

### candidateGroups

• **candidateGroups**: `any`

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L24)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L25)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/Node.ts:122](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L122)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/Node.ts:127](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L127)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/Node.ts:129](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L129)

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

[Element](Element.md).[restored](Element.md#restored)

#### Defined in

[elements/Element.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L24)

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

[Element](Element.md).[hasBehaviour](Element.md#hasbehaviour)

#### Defined in

[elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L34)

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

[Element](Element.md).[getBehaviour](Element.md#getbehaviour)

#### Defined in

[elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L38)

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

[Element](Element.md).[addBehaviour](Element.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Element.ts#L41)

___

### validate

▸ **validate**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Node.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L44)

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

#### Defined in

[elements/Node.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L57)

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

#### Defined in

[elements/Node.ts:85](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L85)

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

#### Defined in

[elements/Node.ts:95](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L95)

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

#### Defined in

[elements/Node.ts:109](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L109)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Defined in

[elements/Node.ts:113](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L113)

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

#### Defined in

[elements/Node.ts:139](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L139)

___

### continue

▸ **continue**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Element](Element.md).[continue](Element.md#continue)

#### Defined in

[elements/Node.ts:212](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L212)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Defined in

[elements/Node.ts:217](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L217)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Defined in

[elements/Node.ts:227](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L227)

___

### cancelEBG

▸ **cancelEBG**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Node.ts:231](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L231)

___

### cancelBoundaryEvents

▸ **cancelBoundaryEvents**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Node.ts:239](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L239)

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

#### Defined in

[elements/Node.ts:272](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L272)

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

#### Overrides

[Element](Element.md).[resume](Element.md#resume)

#### Defined in

[elements/Node.ts:307](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L307)

___

### init

▸ **init**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`void`

#### Defined in

[elements/Node.ts:310](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L310)

___

### getOutbounds

▸ **getOutbounds**(`item`): [`Item`](Item.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

[`Item`](Item.md)[]

#### Defined in

[elements/Node.ts:315](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L315)

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

#### Defined in

[elements/Node.ts:334](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L334)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Element](Element.md).[describe](Element.md#describe)

#### Defined in

[elements/Node.ts:346](https://github.com/bpmnServer/bpmn-server/blob/2a5d20f/src/elements/Node.ts#L346)
