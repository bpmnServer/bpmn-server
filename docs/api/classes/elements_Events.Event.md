[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Events](../modules/elements_Events.md) / Event

# Class: Event

[elements/Events](../modules/elements_Events.md).Event

## Hierarchy

- [`Node`](elements_Node.Node.md)

  ↳ **`Event`**

  ↳↳ [`StartEvent`](elements_Events.StartEvent.md)

  ↳↳ [`EndEvent`](elements_Events.EndEvent.md)

  ↳↳ [`CatchEvent`](elements_Events.CatchEvent.md)

  ↳↳ [`ThrowEvent`](elements_Events.ThrowEvent.md)

  ↳↳ [`BoundaryEvent`](elements_Events.BoundaryEvent.md)

## Table of contents

### Constructors

- [constructor](elements_Events.Event.md#constructor)

### Properties

- [assignee](elements_Events.Event.md#assignee)
- [attachedTo](elements_Events.Event.md#attachedto)
- [attachments](elements_Events.Event.md#attachments)
- [behaviours](elements_Events.Event.md#behaviours)
- [candidateGroups](elements_Events.Event.md#candidategroups)
- [candidateUsers](elements_Events.Event.md#candidateusers)
- [def](elements_Events.Event.md#def)
- [id](elements_Events.Event.md#id)
- [inbounds](elements_Events.Event.md#inbounds)
- [initiator](elements_Events.Event.md#initiator)
- [isFlow](elements_Events.Event.md#isflow)
- [lane](elements_Events.Event.md#lane)
- [messageId](elements_Events.Event.md#messageid)
- [name](elements_Events.Event.md#name)
- [outbounds](elements_Events.Event.md#outbounds)
- [process](elements_Events.Event.md#process)
- [scripts](elements_Events.Event.md#scripts)
- [signalId](elements_Events.Event.md#signalid)
- [subType](elements_Events.Event.md#subtype)
- [type](elements_Events.Event.md#type)

### Accessors

- [canBeInvoked](elements_Events.Event.md#canbeinvoked)
- [isCatching](elements_Events.Event.md#iscatching)
- [processId](elements_Events.Event.md#processid)
- [requiresWait](elements_Events.Event.md#requireswait)

### Methods

- [addBehaviour](elements_Events.Event.md#addbehaviour)
- [cancelBoundaryEvents](elements_Events.Event.md#cancelboundaryevents)
- [cancelEBG](elements_Events.Event.md#cancelebg)
- [continue](elements_Events.Event.md#continue)
- [describe](elements_Events.Event.md#describe)
- [doEvent](elements_Events.Event.md#doevent)
- [end](elements_Events.Event.md#end)
- [enter](elements_Events.Event.md#enter)
- [execute](elements_Events.Event.md#execute)
- [getBehaviour](elements_Events.Event.md#getbehaviour)
- [getInput](elements_Events.Event.md#getinput)
- [getOutbounds](elements_Events.Event.md#getoutbounds)
- [getOutput](elements_Events.Event.md#getoutput)
- [hasBehaviour](elements_Events.Event.md#hasbehaviour)
- [hasMessage](elements_Events.Event.md#hasmessage)
- [hasSignal](elements_Events.Event.md#hassignal)
- [hasTimer](elements_Events.Event.md#hastimer)
- [init](elements_Events.Event.md#init)
- [restored](elements_Events.Event.md#restored)
- [resume](elements_Events.Event.md#resume)
- [run](elements_Events.Event.md#run)
- [setInput](elements_Events.Event.md#setinput)
- [start](elements_Events.Event.md#start)
- [startBoundaryEvents](elements_Events.Event.md#startboundaryevents)
- [validate](elements_Events.Event.md#validate)

## Constructors

### constructor

• **new Event**(`id`, `process`, `type`, `def`): [`Event`](elements_Events.Event.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`Event`](elements_Events.Event.md)

#### Inherited from

[Node](elements_Node.Node.md).[constructor](elements_Node.Node.md#constructor)

#### Defined in

[src/elements/Node.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[assignee](elements_Node.Node.md#assignee)

#### Defined in

[src/elements/Node.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Node](elements_Node.Node.md).[attachedTo](elements_Node.Node.md#attachedto)

#### Defined in

[src/elements/Node.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](elements_Node.Node.md)[]

#### Inherited from

[Node](elements_Node.Node.md).[attachments](elements_Node.Node.md#attachments)

#### Defined in

[src/elements/Node.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](elements_Node.Node.md).[behaviours](elements_Node.Node.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[candidateGroups](elements_Node.Node.md#candidategroups)

#### Defined in

[src/elements/Node.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[candidateUsers](elements_Node.Node.md#candidateusers)

#### Defined in

[src/elements/Node.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L24)

___

### def

• **def**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[def](elements_Node.Node.md#def)

#### Defined in

[src/elements/Node.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[id](elements_Node.Node.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Node](elements_Node.Node.md).[inbounds](elements_Node.Node.md#inbounds)

#### Defined in

[src/elements/Node.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[initiator](elements_Node.Node.md#initiator)

#### Defined in

[src/elements/Node.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](elements_Node.Node.md).[isFlow](elements_Node.Node.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[lane](elements_Node.Node.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[messageId](elements_Node.Node.md#messageid)

#### Defined in

[src/elements/Node.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[name](elements_Node.Node.md#name)

#### Defined in

[src/elements/Node.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Node](elements_Node.Node.md).[outbounds](elements_Node.Node.md#outbounds)

#### Defined in

[src/elements/Node.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[process](elements_Node.Node.md#process)

#### Defined in

[src/elements/Node.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](elements_Node.Node.md).[scripts](elements_Node.Node.md#scripts)

#### Defined in

[src/elements/Node.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[signalId](elements_Node.Node.md#signalid)

#### Defined in

[src/elements/Node.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[subType](elements_Node.Node.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[type](elements_Node.Node.md#type)

#### Defined in

[src/elements/Element.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Node.canBeInvoked

#### Defined in

[src/elements/Events.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Events.ts#L32)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[src/elements/Node.ts:129](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L129)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[src/elements/Node.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.requiresWait

#### Defined in

[src/elements/Node.ts:122](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L122)

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

[Node](elements_Node.Node.md).[addBehaviour](elements_Node.Node.md#addbehaviour)

#### Defined in

[src/elements/Element.ts:41](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L41)

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

[Node](elements_Node.Node.md).[cancelBoundaryEvents](elements_Node.Node.md#cancelboundaryevents)

#### Defined in

[src/elements/Node.ts:239](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L239)

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

[Node](elements_Node.Node.md).[cancelEBG](elements_Node.Node.md#cancelebg)

#### Defined in

[src/elements/Node.ts:231](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L231)

___

### continue

▸ **continue**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Node](elements_Node.Node.md).[continue](elements_Node.Node.md#continue)

#### Defined in

[src/elements/Node.ts:212](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Node](elements_Node.Node.md).[describe](elements_Node.Node.md#describe)

#### Defined in

[src/elements/Node.ts:346](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L346)

___

### doEvent

▸ **doEvent**(`item`, `event`, `newStatus`): `Promise`\<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |
| `event` | [`EXECUTION_EVENT`](../enums/interfaces_Enums.EXECUTION_EVENT.md) |
| `newStatus` | [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md) |

#### Returns

`Promise`\<`any`[]\>

#### Inherited from

[Node](elements_Node.Node.md).[doEvent](elements_Node.Node.md#doevent)

#### Defined in

[src/elements/Node.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L57)

___

### end

▸ **end**(`item`, `cancel?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) | `undefined` |
| `cancel` | `Boolean` | `false` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[Node](elements_Node.Node.md).[end](elements_Node.Node.md#end)

#### Defined in

[src/elements/Events.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Events.ts#L28)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Node](elements_Node.Node.md).[enter](elements_Node.Node.md#enter)

#### Defined in

[src/elements/Node.ts:113](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L113)

___

### execute

▸ **execute**(`item`): `Promise`\<`void` \| [`wait`](../enums/interfaces_Enums.NODE_ACTION.md#wait) \| [`end`](../enums/interfaces_Enums.NODE_ACTION.md#end) \| [`error`](../enums/interfaces_Enums.NODE_ACTION.md#error) \| [`abort`](../enums/interfaces_Enums.NODE_ACTION.md#abort)\>

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways 
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void` \| [`wait`](../enums/interfaces_Enums.NODE_ACTION.md#wait) \| [`end`](../enums/interfaces_Enums.NODE_ACTION.md#end) \| [`error`](../enums/interfaces_Enums.NODE_ACTION.md#error) \| [`abort`](../enums/interfaces_Enums.NODE_ACTION.md#abort)\>

#### Inherited from

[Node](elements_Node.Node.md).[execute](elements_Node.Node.md#execute)

#### Defined in

[src/elements/Node.ts:139](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L139)

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

[Node](elements_Node.Node.md).[getBehaviour](elements_Node.Node.md#getbehaviour)

#### Defined in

[src/elements/Element.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L38)

___

### getInput

▸ **getInput**(`item`, `input`): `Promise`\<{}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |
| `input` | `any` |

#### Returns

`Promise`\<{}\>

#### Inherited from

[Node](elements_Node.Node.md).[getInput](elements_Node.Node.md#getinput)

#### Defined in

[src/elements/Node.ts:95](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L95)

___

### getOutbounds

▸ **getOutbounds**(`item`): [`Item`](engine_Item.Item.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

[`Item`](engine_Item.Item.md)[]

#### Inherited from

[Node](elements_Node.Node.md).[getOutbounds](elements_Node.Node.md#getoutbounds)

#### Defined in

[src/elements/Node.ts:315](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L315)

___

### getOutput

▸ **getOutput**(`item`): `Promise`\<{}\>

transform data using output rules
todo

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<{}\>

#### Inherited from

[Node](elements_Node.Node.md).[getOutput](elements_Node.Node.md#getoutput)

#### Defined in

[src/elements/Node.ts:109](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L109)

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

[Node](elements_Node.Node.md).[hasBehaviour](elements_Node.Node.md#hasbehaviour)

#### Defined in

[src/elements/Element.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L34)

___

### hasMessage

▸ **hasMessage**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/Events.ts:9](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Events.ts#L9)

___

### hasSignal

▸ **hasSignal**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/Events.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Events.ts#L12)

___

### hasTimer

▸ **hasTimer**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/Events.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Events.ts#L15)

___

### init

▸ **init**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Node](elements_Node.Node.md).[init](elements_Node.Node.md#init)

#### Defined in

[src/elements/Node.ts:310](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L310)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Node](elements_Node.Node.md).[restored](elements_Node.Node.md#restored)

#### Defined in

[src/elements/Element.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L24)

___

### resume

▸ **resume**(`item`): `void`

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`void`

#### Inherited from

[Node](elements_Node.Node.md).[resume](elements_Node.Node.md#resume)

#### Defined in

[src/elements/Node.ts:307](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L307)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Inherited from

[Node](elements_Node.Node.md).[run](elements_Node.Node.md#run)

#### Defined in

[src/elements/Node.ts:227](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L227)

___

### setInput

▸ **setInput**(`item`, `input`): `Promise`\<`void`\>

is Called after execution 
transform data using input rules
todo

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |
| `input` | `any` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Node](elements_Node.Node.md).[setInput](elements_Node.Node.md#setinput)

#### Defined in

[src/elements/Node.ts:85](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L85)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

using token: check if fromEventBasedGateway;	if yes cancel all other events

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Overrides

[Node](elements_Node.Node.md).[start](elements_Node.Node.md#start)

#### Defined in

[src/elements/Events.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Events.ts#L24)

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

[Node](elements_Node.Node.md).[startBoundaryEvents](elements_Node.Node.md#startboundaryevents)

#### Defined in

[src/elements/Node.ts:334](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L334)

___

### validate

▸ **validate**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Node](elements_Node.Node.md).[validate](elements_Node.Node.md#validate)

#### Defined in

[src/elements/Node.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L44)
