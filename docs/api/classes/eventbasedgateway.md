[bpmn-server](../README.md) / EventBasedGateway

# Class: EventBasedGateway

trick here is once one event is met all others must be cancelled

How will I know?
     when one of my events is fired shoudl I subscribe to the event or get directly notified?

## Hierarchy

- [`Gateway`](Gateway.md)

  ↳ **`EventBasedGateway`**

## Table of contents

### Constructors

- [constructor](EventBasedGateway.md#constructor)

### Properties

- [assignee](EventBasedGateway.md#assignee)
- [attachedTo](EventBasedGateway.md#attachedto)
- [attachments](EventBasedGateway.md#attachments)
- [behaviours](EventBasedGateway.md#behaviours)
- [candidateGroups](EventBasedGateway.md#candidategroups)
- [candidateUsers](EventBasedGateway.md#candidateusers)
- [def](EventBasedGateway.md#def)
- [id](EventBasedGateway.md#id)
- [inbounds](EventBasedGateway.md#inbounds)
- [initiator](EventBasedGateway.md#initiator)
- [isFlow](EventBasedGateway.md#isflow)
- [lane](EventBasedGateway.md#lane)
- [listener](EventBasedGateway.md#listener)
- [messageId](EventBasedGateway.md#messageid)
- [name](EventBasedGateway.md#name)
- [outbounds](EventBasedGateway.md#outbounds)
- [process](EventBasedGateway.md#process)
- [scripts](EventBasedGateway.md#scripts)
- [signalId](EventBasedGateway.md#signalid)
- [subType](EventBasedGateway.md#subtype)
- [type](EventBasedGateway.md#type)
- [working](EventBasedGateway.md#working)

### Accessors

- [canBeInvoked](EventBasedGateway.md#canbeinvoked)
- [isCatching](EventBasedGateway.md#iscatching)
- [processId](EventBasedGateway.md#processid)
- [requiresWait](EventBasedGateway.md#requireswait)

### Methods

- [addBehaviour](EventBasedGateway.md#addbehaviour)
- [analyzeConvergingTokens](EventBasedGateway.md#analyzeconvergingtokens)
- [canReach](EventBasedGateway.md#canreach)
- [cancelAllBranched](EventBasedGateway.md#cancelallbranched)
- [cancelBoundaryEvents](EventBasedGateway.md#cancelboundaryevents)
- [cancelEBG](EventBasedGateway.md#cancelebg)
- [continue](EventBasedGateway.md#continue)
- [describe](EventBasedGateway.md#describe)
- [doEvent](EventBasedGateway.md#doevent)
- [end](EventBasedGateway.md#end)
- [enter](EventBasedGateway.md#enter)
- [execute](EventBasedGateway.md#execute)
- [getBehaviour](EventBasedGateway.md#getbehaviour)
- [getInput](EventBasedGateway.md#getinput)
- [getOutbounds](EventBasedGateway.md#getoutbounds)
- [getOutput](EventBasedGateway.md#getoutput)
- [getPotentialPath](EventBasedGateway.md#getpotentialpath)
- [getRelatedTokens](EventBasedGateway.md#getrelatedtokens)
- [hasBehaviour](EventBasedGateway.md#hasbehaviour)
- [init](EventBasedGateway.md#init)
- [restored](EventBasedGateway.md#restored)
- [resume](EventBasedGateway.md#resume)
- [run](EventBasedGateway.md#run)
- [setInput](EventBasedGateway.md#setinput)
- [start](EventBasedGateway.md#start)
- [startBoundaryEvents](EventBasedGateway.md#startboundaryevents)
- [validate](EventBasedGateway.md#validate)

## Constructors

### constructor

• **new EventBasedGateway**(`id`, `process`, `type`, `def`): [`EventBasedGateway`](EventBasedGateway.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`EventBasedGateway`](EventBasedGateway.md)

#### Inherited from

[Gateway](Gateway.md).[constructor](Gateway.md#constructor)

#### Defined in

[elements/Node.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Gateway](Gateway.md).[assignee](Gateway.md#assignee)

#### Defined in

[elements/Node.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-22)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Gateway](Gateway.md).[attachedTo](Gateway.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-18)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Gateway](Gateway.md).[attachments](Gateway.md#attachments)

#### Defined in

[elements/Node.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](Gateway.md).[behaviours](Gateway.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Gateway](Gateway.md).[candidateGroups](Gateway.md#candidategroups)

#### Defined in

[elements/Node.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Gateway](Gateway.md).[candidateUsers](Gateway.md#candidateusers)

#### Defined in

[elements/Node.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-24)

___

### def

• **def**: `any`

#### Inherited from

[Gateway](Gateway.md).[def](Gateway.md#def)

#### Defined in

[elements/Node.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-14)

___

### id

• **id**: `any`

#### Inherited from

[Gateway](Gateway.md).[id](Gateway.md#id)

#### Defined in

[elements/Element.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-13)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Gateway](Gateway.md).[inbounds](Gateway.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Gateway](Gateway.md).[initiator](Gateway.md#initiator)

#### Defined in

[elements/Node.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Gateway](Gateway.md).[isFlow](Gateway.md#isflow)

#### Defined in

[elements/Element.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-18)

___

### lane

• **lane**: `any`

#### Inherited from

[Gateway](Gateway.md).[lane](Gateway.md#lane)

#### Defined in

[elements/Element.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-19)

___

### listener

• **listener**: `any`

#### Defined in

[elements/Gateway.ts:267](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-267)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Gateway](Gateway.md).[messageId](Gateway.md#messageid)

#### Defined in

[elements/Node.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-19)

___

### name

• **name**: `any`

#### Inherited from

[Gateway](Gateway.md).[name](Gateway.md#name)

#### Defined in

[elements/Node.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-12)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Gateway](Gateway.md).[outbounds](Gateway.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-15)

___

### process

• **process**: `any`

#### Inherited from

[Gateway](Gateway.md).[process](Gateway.md#process)

#### Defined in

[elements/Node.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](Gateway.md).[scripts](Gateway.md#scripts)

#### Defined in

[elements/Node.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Gateway](Gateway.md).[signalId](Gateway.md#signalid)

#### Defined in

[elements/Node.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-20)

___

### subType

• **subType**: `any`

#### Inherited from

[Gateway](Gateway.md).[subType](Gateway.md#subtype)

#### Defined in

[elements/Element.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-15)

___

### type

• **type**: `any`

#### Inherited from

[Gateway](Gateway.md).[type](Gateway.md#type)

#### Defined in

[elements/Element.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-14)

___

### working

• **working**: `boolean` = `false`

#### Defined in

[elements/Gateway.ts:266](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-266)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.canBeInvoked

#### Defined in

[elements/Node.ts:127](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-127)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.isCatching

#### Defined in

[elements/Node.ts:129](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-129)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Gateway.processId

#### Defined in

[elements/Node.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.requiresWait

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

[Gateway](Gateway.md).[addBehaviour](Gateway.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-41)

___

### analyzeConvergingTokens

▸ **analyzeConvergingTokens**(`item`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `pendingTokens` | [`Token`](Token.md)[] |
| `waitingTokens` | [`Token`](Token.md)[] |

#### Inherited from

[Gateway](Gateway.md).[analyzeConvergingTokens](Gateway.md#analyzeconvergingtokens)

#### Defined in

[elements/Gateway.ts:120](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-120)

___

### canReach

▸ **canReach**(`node`, `target`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `any` |
| `target` | `any` |

#### Returns

`any`

#### Inherited from

[Gateway](Gateway.md).[canReach](Gateway.md#canreach)

#### Defined in

[elements/Gateway.ts:78](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-78)

___

### cancelAllBranched

▸ **cancelAllBranched**(`endingItem`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `endingItem` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[elements/Gateway.ts:275](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-275)

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

[Gateway](Gateway.md).[cancelBoundaryEvents](Gateway.md#cancelboundaryevents)

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

[Gateway](Gateway.md).[cancelEBG](Gateway.md#cancelebg)

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

[Gateway](Gateway.md).[continue](Gateway.md#continue)

#### Defined in

[elements/Node.ts:212](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Gateway](Gateway.md).[describe](Gateway.md#describe)

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

[Gateway](Gateway.md).[doEvent](Gateway.md#doevent)

#### Defined in

[elements/Node.ts:57](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-57)

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

[Gateway](Gateway.md).[end](Gateway.md#end)

#### Defined in

[elements/Node.ts:272](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-272)

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

[Gateway](Gateway.md).[enter](Gateway.md#enter)

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

[Gateway](Gateway.md).[execute](Gateway.md#execute)

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

[Gateway](Gateway.md).[getBehaviour](Gateway.md#getbehaviour)

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

[Gateway](Gateway.md).[getInput](Gateway.md#getinput)

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

[Gateway](Gateway.md).[getOutbounds](Gateway.md#getoutbounds)

#### Defined in

[elements/Gateway.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-34)

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

[Gateway](Gateway.md).[getOutput](Gateway.md#getoutput)

#### Defined in

[elements/Node.ts:109](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-109)

___

### getPotentialPath

▸ **getPotentialPath**(`node`, `path?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `node` | `any` | `undefined` |
| `path` | `any` | `null` |

#### Returns

`any`

#### Inherited from

[Gateway](Gateway.md).[getPotentialPath](Gateway.md#getpotentialpath)

#### Defined in

[elements/Gateway.ts:64](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-64)

___

### getRelatedTokens

▸ **getRelatedTokens**(`item`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`any`[]

#### Inherited from

[Gateway](Gateway.md).[getRelatedTokens](Gateway.md#getrelatedtokens)

#### Defined in

[elements/Gateway.ts:88](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-88)

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

[Gateway](Gateway.md).[hasBehaviour](Gateway.md#hasbehaviour)

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

[Gateway](Gateway.md).[init](Gateway.md#init)

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

#### Overrides

[Gateway](Gateway.md).[restored](Gateway.md#restored)

#### Defined in

[elements/Gateway.ts:269](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-269)

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

[Gateway](Gateway.md).[resume](Gateway.md#resume)

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

#### Overrides

[Gateway](Gateway.md).[run](Gateway.md#run)

#### Defined in

[elements/Gateway.ts:272](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-272)

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

[Gateway](Gateway.md).[setInput](Gateway.md#setinput)

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

#### Inherited from

[Gateway](Gateway.md).[start](Gateway.md#start)

#### Defined in

[elements/Gateway.ts:149](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Gateway.ts#lines-149)

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

[Gateway](Gateway.md).[startBoundaryEvents](Gateway.md#startboundaryevents)

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

[Gateway](Gateway.md).[validate](Gateway.md#validate)

#### Defined in

[elements/Node.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-44)