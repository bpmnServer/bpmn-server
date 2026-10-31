[bpmn-server](../readme.md) / XORGateway

# Class: XORGateway

ExclusiveGatway:
     outbounds:  only 1 
     inbound:    only 1 -

## Hierarchy

- [`Gateway`](Gateway.md)

  ↳ **`XORGateway`**

## Table of contents

### Constructors

- [constructor](XORGateway.md#constructor)

### Properties

- [id](XORGateway.md#id)
- [type](XORGateway.md#type)
- [subType](XORGateway.md#subtype)
- [behaviours](XORGateway.md#behaviours)
- [isFlow](XORGateway.md#isflow)
- [lane](XORGateway.md#lane)
- [name](XORGateway.md#name)
- [process](XORGateway.md#process)
- [def](XORGateway.md#def)
- [outbounds](XORGateway.md#outbounds)
- [inbounds](XORGateway.md#inbounds)
- [attachments](XORGateway.md#attachments)
- [attachedTo](XORGateway.md#attachedto)
- [messageId](XORGateway.md#messageid)
- [signalId](XORGateway.md#signalid)
- [initiator](XORGateway.md#initiator)
- [assignee](XORGateway.md#assignee)
- [candidateGroups](XORGateway.md#candidategroups)
- [candidateUsers](XORGateway.md#candidateusers)
- [scripts](XORGateway.md#scripts)

### Accessors

- [processId](XORGateway.md#processid)
- [requiresWait](XORGateway.md#requireswait)
- [canBeInvoked](XORGateway.md#canbeinvoked)
- [loopDefinition](XORGateway.md#loopdefinition)
- [isCatching](XORGateway.md#iscatching)

### Methods

- [restored](XORGateway.md#restored)
- [hasBehaviour](XORGateway.md#hasbehaviour)
- [getBehaviour](XORGateway.md#getbehaviour)
- [addBehaviour](XORGateway.md#addbehaviour)
- [getPotentialPath](XORGateway.md#getpotentialpath)
- [canReach](XORGateway.md#canreach)
- [getRelatedTokens](XORGateway.md#getrelatedtokens)
- [analyzeConvergingTokens](XORGateway.md#analyzeconvergingtokens)
- [start](XORGateway.md#start)
- [getOutbounds](XORGateway.md#getoutbounds)
- [validate](XORGateway.md#validate)
- [doEvent](XORGateway.md#doevent)
- [setInput](XORGateway.md#setinput)
- [getInput](XORGateway.md#getinput)
- [getOutput](XORGateway.md#getoutput)
- [enter](XORGateway.md#enter)
- [execute](XORGateway.md#execute)
- [continue](XORGateway.md#continue)
- [run](XORGateway.md#run)
- [cancelEBG](XORGateway.md#cancelebg)
- [cancelBoundaryEvents](XORGateway.md#cancelboundaryevents)
- [end](XORGateway.md#end)
- [resume](XORGateway.md#resume)
- [init](XORGateway.md#init)
- [startBoundaryEvents](XORGateway.md#startboundaryevents)
- [describe](XORGateway.md#describe)

## Constructors

### constructor

• **new XORGateway**(`id`, `process`, `type`, `def`): [`XORGateway`](XORGateway.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`XORGateway`](XORGateway.md)

#### Inherited from

[Gateway](Gateway.md).[constructor](Gateway.md#constructor)

#### Defined in

[elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L32)

## Properties

### id

• **id**: `any`

#### Inherited from

[Gateway](Gateway.md).[id](Gateway.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Gateway](Gateway.md).[type](Gateway.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Gateway](Gateway.md).[subType](Gateway.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](Gateway.md).[behaviours](Gateway.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Gateway](Gateway.md).[isFlow](Gateway.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Gateway](Gateway.md).[lane](Gateway.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Gateway](Gateway.md).[name](Gateway.md#name)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L13)

___

### process

• **process**: `any`

#### Inherited from

[Gateway](Gateway.md).[process](Gateway.md#process)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L14)

___

### def

• **def**: `any`

#### Inherited from

[Gateway](Gateway.md).[def](Gateway.md#def)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L15)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Gateway](Gateway.md).[outbounds](Gateway.md#outbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L16)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Gateway](Gateway.md).[inbounds](Gateway.md#inbounds)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L17)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Gateway](Gateway.md).[attachments](Gateway.md#attachments)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L18)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Gateway](Gateway.md).[attachedTo](Gateway.md#attachedto)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Gateway](Gateway.md).[messageId](Gateway.md#messageid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L20)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Gateway](Gateway.md).[signalId](Gateway.md#signalid)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L21)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Gateway](Gateway.md).[initiator](Gateway.md#initiator)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L22)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Gateway](Gateway.md).[assignee](Gateway.md#assignee)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L23)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Gateway](Gateway.md).[candidateGroups](Gateway.md#candidategroups)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L24)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Gateway](Gateway.md).[candidateUsers](Gateway.md#candidateusers)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L25)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](Gateway.md).[scripts](Gateway.md#scripts)

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L26)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Gateway.processId

#### Defined in

[elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L27)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.requiresWait

#### Defined in

[elements/Node.ts:131](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L131)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.canBeInvoked

#### Defined in

[elements/Node.ts:136](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L136)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

Gateway.loopDefinition

#### Defined in

[elements/Node.ts:138](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L138)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.isCatching

#### Defined in

[elements/Node.ts:142](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L142)

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

[Gateway](Gateway.md).[restored](Gateway.md#restored)

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

[Gateway](Gateway.md).[hasBehaviour](Gateway.md#hasbehaviour)

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

[Gateway](Gateway.md).[getBehaviour](Gateway.md#getbehaviour)

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

[Gateway](Gateway.md).[addBehaviour](Gateway.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L41)

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

[elements/Gateway.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Gateway.ts#L64)

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

[elements/Gateway.ts:78](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Gateway.ts#L78)

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

[elements/Gateway.ts:88](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Gateway.ts#L88)

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

[elements/Gateway.ts:120](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Gateway.ts#L120)

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

[elements/Gateway.ts:149](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Gateway.ts#L149)

___

### getOutbounds

▸ **getOutbounds**(`item`): [`Item`](Item.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

[`Item`](Item.md)[]

#### Overrides

[Gateway](Gateway.md).[getOutbounds](Gateway.md#getoutbounds)

#### Defined in

[elements/Gateway.ts:249](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Gateway.ts#L249)

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

[Gateway](Gateway.md).[doEvent](Gateway.md#doevent)

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

[Gateway](Gateway.md).[setInput](Gateway.md#setinput)

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

[Gateway](Gateway.md).[getInput](Gateway.md#getinput)

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

[Gateway](Gateway.md).[getOutput](Gateway.md#getoutput)

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

[Gateway](Gateway.md).[enter](Gateway.md#enter)

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

[Gateway](Gateway.md).[execute](Gateway.md#execute)

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

[Gateway](Gateway.md).[continue](Gateway.md#continue)

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

[Gateway](Gateway.md).[run](Gateway.md#run)

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

[Gateway](Gateway.md).[cancelEBG](Gateway.md#cancelebg)

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

[Gateway](Gateway.md).[cancelBoundaryEvents](Gateway.md#cancelboundaryevents)

#### Defined in

[elements/Node.ts:259](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L259)

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

[elements/Node.ts:294](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L294)

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

[Gateway](Gateway.md).[init](Gateway.md#init)

#### Defined in

[elements/Node.ts:339](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L339)

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

[elements/Node.ts:363](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L363)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Gateway](Gateway.md).[describe](Gateway.md#describe)

#### Defined in

[elements/Node.ts:374](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L374)
