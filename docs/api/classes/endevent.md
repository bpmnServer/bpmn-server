[bpmn-server](../README.md) / EndEvent

# Class: EndEvent

## Hierarchy

- [`Event`](Event.md)

  ↳ **`EndEvent`**

## Table of contents

### Constructors

- [constructor](EndEvent.md#constructor)

### Properties

- [assignee](EndEvent.md#assignee)
- [attachedTo](EndEvent.md#attachedto)
- [attachments](EndEvent.md#attachments)
- [behaviours](EndEvent.md#behaviours)
- [candidateGroups](EndEvent.md#candidategroups)
- [candidateUsers](EndEvent.md#candidateusers)
- [def](EndEvent.md#def)
- [id](EndEvent.md#id)
- [inbounds](EndEvent.md#inbounds)
- [initiator](EndEvent.md#initiator)
- [isFlow](EndEvent.md#isflow)
- [lane](EndEvent.md#lane)
- [messageId](EndEvent.md#messageid)
- [name](EndEvent.md#name)
- [outbounds](EndEvent.md#outbounds)
- [process](EndEvent.md#process)
- [scripts](EndEvent.md#scripts)
- [signalId](EndEvent.md#signalid)
- [subType](EndEvent.md#subtype)
- [type](EndEvent.md#type)

### Accessors

- [canBeInvoked](EndEvent.md#canbeinvoked)
- [isCatching](EndEvent.md#iscatching)
- [processId](EndEvent.md#processid)
- [requiresWait](EndEvent.md#requireswait)

### Methods

- [addBehaviour](EndEvent.md#addbehaviour)
- [cancelBoundaryEvents](EndEvent.md#cancelboundaryevents)
- [cancelEBG](EndEvent.md#cancelebg)
- [continue](EndEvent.md#continue)
- [describe](EndEvent.md#describe)
- [doEvent](EndEvent.md#doevent)
- [end](EndEvent.md#end)
- [enter](EndEvent.md#enter)
- [execute](EndEvent.md#execute)
- [getBehaviour](EndEvent.md#getbehaviour)
- [getInput](EndEvent.md#getinput)
- [getOutbounds](EndEvent.md#getoutbounds)
- [getOutput](EndEvent.md#getoutput)
- [hasBehaviour](EndEvent.md#hasbehaviour)
- [hasMessage](EndEvent.md#hasmessage)
- [hasSignal](EndEvent.md#hassignal)
- [hasTimer](EndEvent.md#hastimer)
- [init](EndEvent.md#init)
- [restored](EndEvent.md#restored)
- [resume](EndEvent.md#resume)
- [run](EndEvent.md#run)
- [setInput](EndEvent.md#setinput)
- [start](EndEvent.md#start)
- [startBoundaryEvents](EndEvent.md#startboundaryevents)
- [validate](EndEvent.md#validate)

## Constructors

### constructor

• **new EndEvent**(`id`, `process`, `type`, `def`): [`EndEvent`](EndEvent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`EndEvent`](EndEvent.md)

#### Inherited from

[Event](Event.md).[constructor](Event.md#constructor)

#### Defined in

[elements/Node.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Event](Event.md).[assignee](Event.md#assignee)

#### Defined in

[elements/Node.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-22)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Event](Event.md).[attachedTo](Event.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-18)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Event](Event.md).[attachments](Event.md#attachments)

#### Defined in

[elements/Node.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Event](Event.md).[behaviours](Event.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Event](Event.md).[candidateGroups](Event.md#candidategroups)

#### Defined in

[elements/Node.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Event](Event.md).[candidateUsers](Event.md#candidateusers)

#### Defined in

[elements/Node.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-24)

___

### def

• **def**: `any`

#### Inherited from

[Event](Event.md).[def](Event.md#def)

#### Defined in

[elements/Node.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-14)

___

### id

• **id**: `any`

#### Inherited from

[Event](Event.md).[id](Event.md#id)

#### Defined in

[elements/Element.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-13)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Event](Event.md).[inbounds](Event.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Event](Event.md).[initiator](Event.md#initiator)

#### Defined in

[elements/Node.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Event](Event.md).[isFlow](Event.md#isflow)

#### Defined in

[elements/Element.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-18)

___

### lane

• **lane**: `any`

#### Inherited from

[Event](Event.md).[lane](Event.md#lane)

#### Defined in

[elements/Element.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Event](Event.md).[messageId](Event.md#messageid)

#### Defined in

[elements/Node.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-19)

___

### name

• **name**: `any`

#### Inherited from

[Event](Event.md).[name](Event.md#name)

#### Defined in

[elements/Node.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-12)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Event](Event.md).[outbounds](Event.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-15)

___

### process

• **process**: `any`

#### Inherited from

[Event](Event.md).[process](Event.md#process)

#### Defined in

[elements/Node.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Event](Event.md).[scripts](Event.md#scripts)

#### Defined in

[elements/Node.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Event](Event.md).[signalId](Event.md#signalid)

#### Defined in

[elements/Node.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-20)

___

### subType

• **subType**: `any`

#### Inherited from

[Event](Event.md).[subType](Event.md#subtype)

#### Defined in

[elements/Element.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-15)

___

### type

• **type**: `any`

#### Inherited from

[Event](Event.md).[type](Event.md#type)

#### Defined in

[elements/Element.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Event.canBeInvoked

#### Defined in

[elements/Events.ts:32](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Events.ts#lines-32)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Overrides

Event.isCatching

#### Defined in

[elements/Events.ts:113](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Events.ts#lines-113)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Event.processId

#### Defined in

[elements/Node.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Event.requiresWait

#### Defined in

[elements/Node.ts:122](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-122)

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

[Event](Event.md).[addBehaviour](Event.md#addbehaviour)

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

[Event](Event.md).[cancelBoundaryEvents](Event.md#cancelboundaryevents)

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

[Event](Event.md).[cancelEBG](Event.md#cancelebg)

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

[Event](Event.md).[continue](Event.md#continue)

#### Defined in

[elements/Node.ts:212](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Event](Event.md).[describe](Event.md#describe)

#### Defined in

[elements/Node.ts:346](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-346)

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

[Event](Event.md).[end](Event.md#end)

#### Defined in

[elements/Events.ts:114](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Events.ts#lines-114)

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

[Event](Event.md).[execute](Event.md#execute)

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

[Event](Event.md).[getBehaviour](Event.md#getbehaviour)

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

[Event](Event.md).[getInput](Event.md#getinput)

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

[Event](Event.md).[getOutbounds](Event.md#getoutbounds)

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

[Event](Event.md).[getOutput](Event.md#getoutput)

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

[Event](Event.md).[hasBehaviour](Event.md#hasbehaviour)

#### Defined in

[elements/Element.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-34)

___

### hasMessage

▸ **hasMessage**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasMessage](Event.md#hasmessage)

#### Defined in

[elements/Events.ts:9](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Events.ts#lines-9)

___

### hasSignal

▸ **hasSignal**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasSignal](Event.md#hassignal)

#### Defined in

[elements/Events.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Events.ts#lines-12)

___

### hasTimer

▸ **hasTimer**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasTimer](Event.md#hastimer)

#### Defined in

[elements/Events.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Events.ts#lines-15)

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

[Event](Event.md).[restored](Event.md#restored)

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

[Event](Event.md).[resume](Event.md#resume)

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

[Event](Event.md).[run](Event.md#run)

#### Defined in

[elements/Node.ts:227](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-227)

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

[elements/Node.ts:85](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-85)

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

#### Inherited from

[Event](Event.md).[start](Event.md#start)

#### Defined in

[elements/Events.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Events.ts#lines-24)

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

[Event](Event.md).[validate](Event.md#validate)

#### Defined in

[elements/Node.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-44)