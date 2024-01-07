[bpmn-server](../readme.md) / CatchEvent

# Class: CatchEvent

## Hierarchy

- [`Event`](Event.md)

  ↳ **`CatchEvent`**

## Table of contents

### Constructors

- [constructor](CatchEvent.md#constructor)

### Properties

- [id](CatchEvent.md#id)
- [type](CatchEvent.md#type)
- [subType](CatchEvent.md#subtype)
- [behaviours](CatchEvent.md#behaviours)
- [isFlow](CatchEvent.md#isflow)
- [lane](CatchEvent.md#lane)
- [name](CatchEvent.md#name)
- [process](CatchEvent.md#process)
- [def](CatchEvent.md#def)
- [outbounds](CatchEvent.md#outbounds)
- [inbounds](CatchEvent.md#inbounds)
- [attachments](CatchEvent.md#attachments)
- [attachedTo](CatchEvent.md#attachedto)
- [messageId](CatchEvent.md#messageid)
- [signalId](CatchEvent.md#signalid)
- [initiator](CatchEvent.md#initiator)
- [assignee](CatchEvent.md#assignee)
- [candidateGroups](CatchEvent.md#candidategroups)
- [candidateUsers](CatchEvent.md#candidateusers)
- [scripts](CatchEvent.md#scripts)

### Accessors

- [isCatching](CatchEvent.md#iscatching)
- [requiresWait](CatchEvent.md#requireswait)
- [canBeInvoked](CatchEvent.md#canbeinvoked)
- [processId](CatchEvent.md#processid)

### Methods

- [restored](CatchEvent.md#restored)
- [hasBehaviour](CatchEvent.md#hasbehaviour)
- [getBehaviour](CatchEvent.md#getbehaviour)
- [addBehaviour](CatchEvent.md#addbehaviour)
- [hasMessage](CatchEvent.md#hasmessage)
- [hasSignal](CatchEvent.md#hassignal)
- [hasTimer](CatchEvent.md#hastimer)
- [end](CatchEvent.md#end)
- [start](CatchEvent.md#start)
- [validate](CatchEvent.md#validate)
- [doEvent](CatchEvent.md#doevent)
- [setInput](CatchEvent.md#setinput)
- [getInput](CatchEvent.md#getinput)
- [getOutput](CatchEvent.md#getoutput)
- [enter](CatchEvent.md#enter)
- [execute](CatchEvent.md#execute)
- [continue](CatchEvent.md#continue)
- [run](CatchEvent.md#run)
- [cancelEBG](CatchEvent.md#cancelebg)
- [cancelBoundaryEvents](CatchEvent.md#cancelboundaryevents)
- [resume](CatchEvent.md#resume)
- [init](CatchEvent.md#init)
- [getOutbounds](CatchEvent.md#getoutbounds)
- [startBoundaryEvents](CatchEvent.md#startboundaryevents)
- [describe](CatchEvent.md#describe)

## Constructors

### constructor

• **new CatchEvent**(`id`, `process`, `type`, `def`): [`CatchEvent`](CatchEvent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`CatchEvent`](CatchEvent.md)

#### Inherited from

[Event](Event.md).[constructor](Event.md#constructor)

#### Defined in

[elements/Node.ts:31](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L31)

## Properties

### id

• **id**: `any`

#### Inherited from

[Event](Event.md).[id](Event.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Event](Event.md).[type](Event.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Event](Event.md).[subType](Event.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Event](Event.md).[behaviours](Event.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Event](Event.md).[isFlow](Event.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Event](Event.md).[lane](Event.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Event](Event.md).[name](Event.md#name)

#### Defined in

[elements/Node.ts:12](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L12)

___

### process

• **process**: `any`

#### Inherited from

[Event](Event.md).[process](Event.md#process)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L13)

___

### def

• **def**: `any`

#### Inherited from

[Event](Event.md).[def](Event.md#def)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L14)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Event](Event.md).[outbounds](Event.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L15)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Event](Event.md).[inbounds](Event.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L16)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Event](Event.md).[attachments](Event.md#attachments)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L17)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Event](Event.md).[attachedTo](Event.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L18)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Event](Event.md).[messageId](Event.md#messageid)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L19)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Event](Event.md).[signalId](Event.md#signalid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L20)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Event](Event.md).[initiator](Event.md#initiator)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L21)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Event](Event.md).[assignee](Event.md#assignee)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L22)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Event](Event.md).[candidateGroups](Event.md#candidategroups)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Event](Event.md).[candidateUsers](Event.md#candidateusers)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L24)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Event](Event.md).[scripts](Event.md#scripts)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L25)

## Accessors

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Overrides

Event.isCatching

#### Defined in

[elements/Events.ts:38](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L38)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

Event.requiresWait

#### Defined in

[elements/Events.ts:40](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L40)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Overrides

Event.canBeInvoked

#### Defined in

[elements/Events.ts:43](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L43)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Event.processId

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L26)

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

[Event](Event.md).[restored](Event.md#restored)

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

[Event](Event.md).[hasBehaviour](Event.md#hasbehaviour)

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

[Event](Event.md).[getBehaviour](Event.md#getbehaviour)

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

[Event](Event.md).[addBehaviour](Event.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Element.ts#L41)

___

### hasMessage

▸ **hasMessage**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasMessage](Event.md#hasmessage)

#### Defined in

[elements/Events.ts:9](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L9)

___

### hasSignal

▸ **hasSignal**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasSignal](Event.md#hassignal)

#### Defined in

[elements/Events.ts:12](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L12)

___

### hasTimer

▸ **hasTimer**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasTimer](Event.md#hastimer)

#### Defined in

[elements/Events.ts:15](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L15)

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

[Event](Event.md).[end](Event.md#end)

#### Defined in

[elements/Events.ts:28](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L28)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

using token: check if fromEventBasedGateway;	if yes cancel all other events

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Overrides

[Event](Event.md).[start](Event.md#start)

#### Defined in

[elements/Events.ts:47](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Events.ts#L47)

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

[Event](Event.md).[validate](Event.md#validate)

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

[Event](Event.md).[doEvent](Event.md#doevent)

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

[Event](Event.md).[setInput](Event.md#setinput)

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

[Event](Event.md).[getInput](Event.md#getinput)

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

[Event](Event.md).[getOutput](Event.md#getoutput)

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

[Event](Event.md).[enter](Event.md#enter)

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

[Event](Event.md).[execute](Event.md#execute)

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

[Event](Event.md).[continue](Event.md#continue)

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

[Event](Event.md).[run](Event.md#run)

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

[Event](Event.md).[cancelEBG](Event.md#cancelebg)

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

[Event](Event.md).[cancelBoundaryEvents](Event.md#cancelboundaryevents)

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

[Event](Event.md).[resume](Event.md#resume)

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

[Event](Event.md).[init](Event.md#init)

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

[Event](Event.md).[getOutbounds](Event.md#getoutbounds)

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

[Event](Event.md).[startBoundaryEvents](Event.md#startboundaryevents)

#### Defined in

[elements/Node.ts:334](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L334)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Event](Event.md).[describe](Event.md#describe)

#### Defined in

[elements/Node.ts:346](https://github.com/bpmnServer/bpmn-server/blob/6f144fc/src/elements/Node.ts#L346)
