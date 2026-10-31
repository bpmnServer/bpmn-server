[bpmn-server](../readme.md) / StartEvent

# Class: StartEvent

## Hierarchy

- [`Event`](Event.md)

  ↳ **`StartEvent`**

## Table of contents

### Constructors

- [constructor](StartEvent.md#constructor)

### Properties

- [id](StartEvent.md#id)
- [type](StartEvent.md#type)
- [subType](StartEvent.md#subtype)
- [behaviours](StartEvent.md#behaviours)
- [isFlow](StartEvent.md#isflow)
- [lane](StartEvent.md#lane)
- [name](StartEvent.md#name)
- [process](StartEvent.md#process)
- [def](StartEvent.md#def)
- [outbounds](StartEvent.md#outbounds)
- [inbounds](StartEvent.md#inbounds)
- [attachments](StartEvent.md#attachments)
- [attachedTo](StartEvent.md#attachedto)
- [messageId](StartEvent.md#messageid)
- [signalId](StartEvent.md#signalid)
- [initiator](StartEvent.md#initiator)
- [assignee](StartEvent.md#assignee)
- [candidateGroups](StartEvent.md#candidategroups)
- [candidateUsers](StartEvent.md#candidateusers)
- [scripts](StartEvent.md#scripts)

### Accessors

- [canBeInvoked](StartEvent.md#canbeinvoked)
- [isCatching](StartEvent.md#iscatching)
- [processId](StartEvent.md#processid)
- [requiresWait](StartEvent.md#requireswait)
- [loopDefinition](StartEvent.md#loopdefinition)

### Methods

- [restored](StartEvent.md#restored)
- [hasBehaviour](StartEvent.md#hasbehaviour)
- [getBehaviour](StartEvent.md#getbehaviour)
- [addBehaviour](StartEvent.md#addbehaviour)
- [hasMessage](StartEvent.md#hasmessage)
- [hasSignal](StartEvent.md#hassignal)
- [hasTimer](StartEvent.md#hastimer)
- [end](StartEvent.md#end)
- [terminate](StartEvent.md#terminate)
- [start](StartEvent.md#start)
- [validate](StartEvent.md#validate)
- [doEvent](StartEvent.md#doevent)
- [setInput](StartEvent.md#setinput)
- [getInput](StartEvent.md#getinput)
- [getOutput](StartEvent.md#getoutput)
- [enter](StartEvent.md#enter)
- [execute](StartEvent.md#execute)
- [continue](StartEvent.md#continue)
- [run](StartEvent.md#run)
- [cancelEBG](StartEvent.md#cancelebg)
- [cancelBoundaryEvents](StartEvent.md#cancelboundaryevents)
- [resume](StartEvent.md#resume)
- [init](StartEvent.md#init)
- [getOutbounds](StartEvent.md#getoutbounds)
- [startBoundaryEvents](StartEvent.md#startboundaryevents)
- [describe](StartEvent.md#describe)

## Constructors

### constructor

• **new StartEvent**(`id`, `process`, `type`, `def`): [`StartEvent`](StartEvent.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`StartEvent`](StartEvent.md)

#### Overrides

[Event](Event.md).[constructor](Event.md#constructor)

#### Defined in

[elements/Events.ts:156](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L156)

## Properties

### id

• **id**: `any`

#### Inherited from

[Event](Event.md).[id](Event.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Event](Event.md).[type](Event.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Event](Event.md).[subType](Event.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Event](Event.md).[behaviours](Event.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Event](Event.md).[isFlow](Event.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Event](Event.md).[lane](Event.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Event](Event.md).[name](Event.md#name)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L13)

___

### process

• **process**: `any`

#### Inherited from

[Event](Event.md).[process](Event.md#process)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L14)

___

### def

• **def**: `any`

#### Inherited from

[Event](Event.md).[def](Event.md#def)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L15)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Event](Event.md).[outbounds](Event.md#outbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L16)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Event](Event.md).[inbounds](Event.md#inbounds)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L17)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Event](Event.md).[attachments](Event.md#attachments)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L18)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Event](Event.md).[attachedTo](Event.md#attachedto)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Event](Event.md).[messageId](Event.md#messageid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L20)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Event](Event.md).[signalId](Event.md#signalid)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L21)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Event](Event.md).[initiator](Event.md#initiator)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L22)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Event](Event.md).[assignee](Event.md#assignee)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L23)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Event](Event.md).[candidateGroups](Event.md#candidategroups)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L24)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Event](Event.md).[candidateUsers](Event.md#candidateusers)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L25)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Event](Event.md).[scripts](Event.md#scripts)

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L26)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Event.canBeInvoked

#### Defined in

[elements/Events.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L32)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Overrides

Event.isCatching

#### Defined in

[elements/Events.ts:173](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L173)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Event.processId

#### Defined in

[elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L27)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Event.requiresWait

#### Defined in

[elements/Node.ts:131](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L131)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

Event.loopDefinition

#### Defined in

[elements/Node.ts:138](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L138)

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

[Event](Event.md).[hasBehaviour](Event.md#hasbehaviour)

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

[Event](Event.md).[getBehaviour](Event.md#getbehaviour)

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

[Event](Event.md).[addBehaviour](Event.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L41)

___

### hasMessage

▸ **hasMessage**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasMessage](Event.md#hasmessage)

#### Defined in

[elements/Events.ts:9](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L9)

___

### hasSignal

▸ **hasSignal**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasSignal](Event.md#hassignal)

#### Defined in

[elements/Events.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L12)

___

### hasTimer

▸ **hasTimer**(): `any`

#### Returns

`any`

#### Inherited from

[Event](Event.md).[hasTimer](Event.md#hastimer)

#### Defined in

[elements/Events.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L15)

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

[elements/Events.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L28)

___

### terminate

▸ **terminate**(`item`): `Promise`\<`void`\>

is called by 
 -   boundaryEvent (intrupting)
 -   Error,Cancel Event
 -   End event (abort)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `item` | `any` | the curremt event item |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Event](Event.md).[terminate](Event.md#terminate)

#### Defined in

[elements/Events.ts:43](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L43)

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

[elements/Events.ts:164](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Events.ts#L164)

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

[Event](Event.md).[doEvent](Event.md#doevent)

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

[Event](Event.md).[setInput](Event.md#setinput)

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

[Event](Event.md).[getInput](Event.md#getinput)

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

[Event](Event.md).[getOutput](Event.md#getoutput)

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

[Event](Event.md).[enter](Event.md#enter)

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

[Event](Event.md).[execute](Event.md#execute)

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

[Event](Event.md).[continue](Event.md#continue)

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

[Event](Event.md).[run](Event.md#run)

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

[Event](Event.md).[cancelEBG](Event.md#cancelebg)

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

[Event](Event.md).[cancelBoundaryEvents](Event.md#cancelboundaryevents)

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

[Event](Event.md).[resume](Event.md#resume)

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

[Event](Event.md).[init](Event.md#init)

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

[Event](Event.md).[getOutbounds](Event.md#getoutbounds)

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

[Event](Event.md).[startBoundaryEvents](Event.md#startboundaryevents)

#### Defined in

[elements/Node.ts:363](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L363)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Event](Event.md).[describe](Event.md#describe)

#### Defined in

[elements/Node.ts:374](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L374)
