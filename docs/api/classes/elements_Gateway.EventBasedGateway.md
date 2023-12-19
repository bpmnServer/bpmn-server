[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Gateway](../modules/elements_Gateway.md) / EventBasedGateway

# Class: EventBasedGateway

[elements/Gateway](../modules/elements_Gateway.md).EventBasedGateway

trick here is once one event is met all others must be cancelled

How will I know?
     when one of my events is fired shoudl I subscribe to the event or get directly notified?

## Hierarchy

- [`Gateway`](elements_Gateway.Gateway.md)

  ↳ **`EventBasedGateway`**

## Table of contents

### Constructors

- [constructor](elements_Gateway.EventBasedGateway.md#constructor)

### Properties

- [assignee](elements_Gateway.EventBasedGateway.md#assignee)
- [attachedTo](elements_Gateway.EventBasedGateway.md#attachedto)
- [attachments](elements_Gateway.EventBasedGateway.md#attachments)
- [behaviours](elements_Gateway.EventBasedGateway.md#behaviours)
- [candidateGroups](elements_Gateway.EventBasedGateway.md#candidategroups)
- [candidateUsers](elements_Gateway.EventBasedGateway.md#candidateusers)
- [def](elements_Gateway.EventBasedGateway.md#def)
- [id](elements_Gateway.EventBasedGateway.md#id)
- [inbounds](elements_Gateway.EventBasedGateway.md#inbounds)
- [initiator](elements_Gateway.EventBasedGateway.md#initiator)
- [isFlow](elements_Gateway.EventBasedGateway.md#isflow)
- [lane](elements_Gateway.EventBasedGateway.md#lane)
- [listener](elements_Gateway.EventBasedGateway.md#listener)
- [messageId](elements_Gateway.EventBasedGateway.md#messageid)
- [name](elements_Gateway.EventBasedGateway.md#name)
- [outbounds](elements_Gateway.EventBasedGateway.md#outbounds)
- [process](elements_Gateway.EventBasedGateway.md#process)
- [scripts](elements_Gateway.EventBasedGateway.md#scripts)
- [signalId](elements_Gateway.EventBasedGateway.md#signalid)
- [subType](elements_Gateway.EventBasedGateway.md#subtype)
- [type](elements_Gateway.EventBasedGateway.md#type)
- [working](elements_Gateway.EventBasedGateway.md#working)

### Accessors

- [canBeInvoked](elements_Gateway.EventBasedGateway.md#canbeinvoked)
- [isCatching](elements_Gateway.EventBasedGateway.md#iscatching)
- [processId](elements_Gateway.EventBasedGateway.md#processid)
- [requiresWait](elements_Gateway.EventBasedGateway.md#requireswait)

### Methods

- [addBehaviour](elements_Gateway.EventBasedGateway.md#addbehaviour)
- [analyzeConvergingTokens](elements_Gateway.EventBasedGateway.md#analyzeconvergingtokens)
- [canReach](elements_Gateway.EventBasedGateway.md#canreach)
- [cancelAllBranched](elements_Gateway.EventBasedGateway.md#cancelallbranched)
- [cancelBoundaryEvents](elements_Gateway.EventBasedGateway.md#cancelboundaryevents)
- [cancelEBG](elements_Gateway.EventBasedGateway.md#cancelebg)
- [continue](elements_Gateway.EventBasedGateway.md#continue)
- [describe](elements_Gateway.EventBasedGateway.md#describe)
- [doEvent](elements_Gateway.EventBasedGateway.md#doevent)
- [end](elements_Gateway.EventBasedGateway.md#end)
- [enter](elements_Gateway.EventBasedGateway.md#enter)
- [execute](elements_Gateway.EventBasedGateway.md#execute)
- [getBehaviour](elements_Gateway.EventBasedGateway.md#getbehaviour)
- [getInput](elements_Gateway.EventBasedGateway.md#getinput)
- [getOutbounds](elements_Gateway.EventBasedGateway.md#getoutbounds)
- [getOutput](elements_Gateway.EventBasedGateway.md#getoutput)
- [getPotentialPath](elements_Gateway.EventBasedGateway.md#getpotentialpath)
- [getRelatedTokens](elements_Gateway.EventBasedGateway.md#getrelatedtokens)
- [hasBehaviour](elements_Gateway.EventBasedGateway.md#hasbehaviour)
- [init](elements_Gateway.EventBasedGateway.md#init)
- [restored](elements_Gateway.EventBasedGateway.md#restored)
- [resume](elements_Gateway.EventBasedGateway.md#resume)
- [run](elements_Gateway.EventBasedGateway.md#run)
- [setInput](elements_Gateway.EventBasedGateway.md#setinput)
- [start](elements_Gateway.EventBasedGateway.md#start)
- [startBoundaryEvents](elements_Gateway.EventBasedGateway.md#startboundaryevents)
- [validate](elements_Gateway.EventBasedGateway.md#validate)

## Constructors

### constructor

• **new EventBasedGateway**(`id`, `process`, `type`, `def`): [`EventBasedGateway`](elements_Gateway.EventBasedGateway.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`EventBasedGateway`](elements_Gateway.EventBasedGateway.md)

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[constructor](elements_Gateway.Gateway.md#constructor)

#### Defined in

[src/elements/Node.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[assignee](elements_Gateway.Gateway.md#assignee)

#### Defined in

[src/elements/Node.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[attachedTo](elements_Gateway.Gateway.md#attachedto)

#### Defined in

[src/elements/Node.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](elements_Node.Node.md)[]

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[attachments](elements_Gateway.Gateway.md#attachments)

#### Defined in

[src/elements/Node.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[behaviours](elements_Gateway.Gateway.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[candidateGroups](elements_Gateway.Gateway.md#candidategroups)

#### Defined in

[src/elements/Node.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[candidateUsers](elements_Gateway.Gateway.md#candidateusers)

#### Defined in

[src/elements/Node.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L24)

___

### def

• **def**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[def](elements_Gateway.Gateway.md#def)

#### Defined in

[src/elements/Node.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[id](elements_Gateway.Gateway.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[inbounds](elements_Gateway.Gateway.md#inbounds)

#### Defined in

[src/elements/Node.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[initiator](elements_Gateway.Gateway.md#initiator)

#### Defined in

[src/elements/Node.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[isFlow](elements_Gateway.Gateway.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[lane](elements_Gateway.Gateway.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### listener

• **listener**: `any`

#### Defined in

[src/elements/Gateway.ts:267](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L267)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[messageId](elements_Gateway.Gateway.md#messageid)

#### Defined in

[src/elements/Node.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[name](elements_Gateway.Gateway.md#name)

#### Defined in

[src/elements/Node.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[outbounds](elements_Gateway.Gateway.md#outbounds)

#### Defined in

[src/elements/Node.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[process](elements_Gateway.Gateway.md#process)

#### Defined in

[src/elements/Node.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[scripts](elements_Gateway.Gateway.md#scripts)

#### Defined in

[src/elements/Node.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[signalId](elements_Gateway.Gateway.md#signalid)

#### Defined in

[src/elements/Node.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[subType](elements_Gateway.Gateway.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[type](elements_Gateway.Gateway.md#type)

#### Defined in

[src/elements/Element.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L14)

___

### working

• **working**: `boolean` = `false`

#### Defined in

[src/elements/Gateway.ts:266](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L266)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.canBeInvoked

#### Defined in

[src/elements/Node.ts:127](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L127)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.isCatching

#### Defined in

[src/elements/Node.ts:129](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L129)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Gateway.processId

#### Defined in

[src/elements/Node.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.requiresWait

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

[Gateway](elements_Gateway.Gateway.md).[addBehaviour](elements_Gateway.Gateway.md#addbehaviour)

#### Defined in

[src/elements/Element.ts:41](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L41)

___

### analyzeConvergingTokens

▸ **analyzeConvergingTokens**(`item`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `pendingTokens` | [`Token`](engine_Token.Token.md)[] |
| `waitingTokens` | [`Token`](engine_Token.Token.md)[] |

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[analyzeConvergingTokens](elements_Gateway.Gateway.md#analyzeconvergingtokens)

#### Defined in

[src/elements/Gateway.ts:120](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L120)

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

[Gateway](elements_Gateway.Gateway.md).[canReach](elements_Gateway.Gateway.md#canreach)

#### Defined in

[src/elements/Gateway.ts:78](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L78)

___

### cancelAllBranched

▸ **cancelAllBranched**(`endingItem`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `endingItem` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/elements/Gateway.ts:275](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L275)

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

[Gateway](elements_Gateway.Gateway.md).[cancelBoundaryEvents](elements_Gateway.Gateway.md#cancelboundaryevents)

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

[Gateway](elements_Gateway.Gateway.md).[cancelEBG](elements_Gateway.Gateway.md#cancelebg)

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

[Gateway](elements_Gateway.Gateway.md).[continue](elements_Gateway.Gateway.md#continue)

#### Defined in

[src/elements/Node.ts:212](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[describe](elements_Gateway.Gateway.md#describe)

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

[Gateway](elements_Gateway.Gateway.md).[doEvent](elements_Gateway.Gateway.md#doevent)

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

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[end](elements_Gateway.Gateway.md#end)

#### Defined in

[src/elements/Node.ts:272](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L272)

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

[Gateway](elements_Gateway.Gateway.md).[enter](elements_Gateway.Gateway.md#enter)

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

[Gateway](elements_Gateway.Gateway.md).[execute](elements_Gateway.Gateway.md#execute)

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

[Gateway](elements_Gateway.Gateway.md).[getBehaviour](elements_Gateway.Gateway.md#getbehaviour)

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

[Gateway](elements_Gateway.Gateway.md).[getInput](elements_Gateway.Gateway.md#getinput)

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

[Gateway](elements_Gateway.Gateway.md).[getOutbounds](elements_Gateway.Gateway.md#getoutbounds)

#### Defined in

[src/elements/Gateway.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L34)

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

[Gateway](elements_Gateway.Gateway.md).[getOutput](elements_Gateway.Gateway.md#getoutput)

#### Defined in

[src/elements/Node.ts:109](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L109)

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

[Gateway](elements_Gateway.Gateway.md).[getPotentialPath](elements_Gateway.Gateway.md#getpotentialpath)

#### Defined in

[src/elements/Gateway.ts:64](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L64)

___

### getRelatedTokens

▸ **getRelatedTokens**(`item`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`any`[]

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[getRelatedTokens](elements_Gateway.Gateway.md#getrelatedtokens)

#### Defined in

[src/elements/Gateway.ts:88](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L88)

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

[Gateway](elements_Gateway.Gateway.md).[hasBehaviour](elements_Gateway.Gateway.md#hasbehaviour)

#### Defined in

[src/elements/Element.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L34)

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

[Gateway](elements_Gateway.Gateway.md).[init](elements_Gateway.Gateway.md#init)

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

#### Overrides

[Gateway](elements_Gateway.Gateway.md).[restored](elements_Gateway.Gateway.md#restored)

#### Defined in

[src/elements/Gateway.ts:269](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L269)

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

[Gateway](elements_Gateway.Gateway.md).[resume](elements_Gateway.Gateway.md#resume)

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

#### Overrides

[Gateway](elements_Gateway.Gateway.md).[run](elements_Gateway.Gateway.md#run)

#### Defined in

[src/elements/Gateway.ts:272](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L272)

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

[Gateway](elements_Gateway.Gateway.md).[setInput](elements_Gateway.Gateway.md#setinput)

#### Defined in

[src/elements/Node.ts:85](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L85)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Inherited from

[Gateway](elements_Gateway.Gateway.md).[start](elements_Gateway.Gateway.md#start)

#### Defined in

[src/elements/Gateway.ts:149](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts#L149)

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

[Gateway](elements_Gateway.Gateway.md).[startBoundaryEvents](elements_Gateway.Gateway.md#startboundaryevents)

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

[Gateway](elements_Gateway.Gateway.md).[validate](elements_Gateway.Gateway.md#validate)

#### Defined in

[src/elements/Node.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L44)
