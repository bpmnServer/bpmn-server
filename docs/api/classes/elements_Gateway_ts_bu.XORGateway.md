[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Gateway.ts.bu](../modules/elements_Gateway_ts_bu.md) / XORGateway

# Class: XORGateway

[elements/Gateway.ts.bu](../modules/elements_Gateway_ts_bu.md).XORGateway

ExclusiveGatway:
     outbounds:  only 1 
     inbound:    only 1 -

## Hierarchy

- [`Gateway`](elements_Gateway_ts_bu.Gateway.md)

  ↳ **`XORGateway`**

## Table of contents

### Constructors

- [constructor](elements_Gateway_ts_bu.XORGateway.md#constructor)

### Properties

- [assignee](elements_Gateway_ts_bu.XORGateway.md#assignee)
- [attachedTo](elements_Gateway_ts_bu.XORGateway.md#attachedto)
- [attachments](elements_Gateway_ts_bu.XORGateway.md#attachments)
- [behaviours](elements_Gateway_ts_bu.XORGateway.md#behaviours)
- [candidateGroups](elements_Gateway_ts_bu.XORGateway.md#candidategroups)
- [candidateUsers](elements_Gateway_ts_bu.XORGateway.md#candidateusers)
- [def](elements_Gateway_ts_bu.XORGateway.md#def)
- [id](elements_Gateway_ts_bu.XORGateway.md#id)
- [inbounds](elements_Gateway_ts_bu.XORGateway.md#inbounds)
- [initiator](elements_Gateway_ts_bu.XORGateway.md#initiator)
- [isFlow](elements_Gateway_ts_bu.XORGateway.md#isflow)
- [lane](elements_Gateway_ts_bu.XORGateway.md#lane)
- [messageId](elements_Gateway_ts_bu.XORGateway.md#messageid)
- [name](elements_Gateway_ts_bu.XORGateway.md#name)
- [outbounds](elements_Gateway_ts_bu.XORGateway.md#outbounds)
- [process](elements_Gateway_ts_bu.XORGateway.md#process)
- [scripts](elements_Gateway_ts_bu.XORGateway.md#scripts)
- [signalId](elements_Gateway_ts_bu.XORGateway.md#signalid)
- [subType](elements_Gateway_ts_bu.XORGateway.md#subtype)
- [type](elements_Gateway_ts_bu.XORGateway.md#type)

### Accessors

- [canBeInvoked](elements_Gateway_ts_bu.XORGateway.md#canbeinvoked)
- [isCatching](elements_Gateway_ts_bu.XORGateway.md#iscatching)
- [processId](elements_Gateway_ts_bu.XORGateway.md#processid)
- [requiresWait](elements_Gateway_ts_bu.XORGateway.md#requireswait)

### Methods

- [addBehaviour](elements_Gateway_ts_bu.XORGateway.md#addbehaviour)
- [analyzeConvergeFlows](elements_Gateway_ts_bu.XORGateway.md#analyzeconvergeflows)
- [cancelBoundaryEvents](elements_Gateway_ts_bu.XORGateway.md#cancelboundaryevents)
- [cancelEBG](elements_Gateway_ts_bu.XORGateway.md#cancelebg)
- [continue](elements_Gateway_ts_bu.XORGateway.md#continue)
- [converge](elements_Gateway_ts_bu.XORGateway.md#converge)
- [describe](elements_Gateway_ts_bu.XORGateway.md#describe)
- [doEvent](elements_Gateway_ts_bu.XORGateway.md#doevent)
- [end](elements_Gateway_ts_bu.XORGateway.md#end)
- [enter](elements_Gateway_ts_bu.XORGateway.md#enter)
- [execute](elements_Gateway_ts_bu.XORGateway.md#execute)
- [findActiveFlows](elements_Gateway_ts_bu.XORGateway.md#findactiveflows)
- [getBehaviour](elements_Gateway_ts_bu.XORGateway.md#getbehaviour)
- [getInput](elements_Gateway_ts_bu.XORGateway.md#getinput)
- [getOutbounds](elements_Gateway_ts_bu.XORGateway.md#getoutbounds)
- [getOutput](elements_Gateway_ts_bu.XORGateway.md#getoutput)
- [hasBehaviour](elements_Gateway_ts_bu.XORGateway.md#hasbehaviour)
- [init](elements_Gateway_ts_bu.XORGateway.md#init)
- [restored](elements_Gateway_ts_bu.XORGateway.md#restored)
- [resume](elements_Gateway_ts_bu.XORGateway.md#resume)
- [run](elements_Gateway_ts_bu.XORGateway.md#run)
- [setInput](elements_Gateway_ts_bu.XORGateway.md#setinput)
- [start](elements_Gateway_ts_bu.XORGateway.md#start)
- [startBoundaryEvents](elements_Gateway_ts_bu.XORGateway.md#startboundaryevents)
- [validate](elements_Gateway_ts_bu.XORGateway.md#validate)

## Constructors

### constructor

• **new XORGateway**(`id`, `process`, `type`, `def`): [`XORGateway`](elements_Gateway_ts_bu.XORGateway.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`XORGateway`](elements_Gateway_ts_bu.XORGateway.md)

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[constructor](elements_Gateway_ts_bu.Gateway.md#constructor)

#### Defined in

[src/elements/Node.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[assignee](elements_Gateway_ts_bu.Gateway.md#assignee)

#### Defined in

[src/elements/Node.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[attachedTo](elements_Gateway_ts_bu.Gateway.md#attachedto)

#### Defined in

[src/elements/Node.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](elements_Node.Node.md)[]

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[attachments](elements_Gateway_ts_bu.Gateway.md#attachments)

#### Defined in

[src/elements/Node.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[behaviours](elements_Gateway_ts_bu.Gateway.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[candidateGroups](elements_Gateway_ts_bu.Gateway.md#candidategroups)

#### Defined in

[src/elements/Node.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[candidateUsers](elements_Gateway_ts_bu.Gateway.md#candidateusers)

#### Defined in

[src/elements/Node.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L24)

___

### def

• **def**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[def](elements_Gateway_ts_bu.Gateway.md#def)

#### Defined in

[src/elements/Node.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[id](elements_Gateway_ts_bu.Gateway.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[inbounds](elements_Gateway_ts_bu.Gateway.md#inbounds)

#### Defined in

[src/elements/Node.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[initiator](elements_Gateway_ts_bu.Gateway.md#initiator)

#### Defined in

[src/elements/Node.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[isFlow](elements_Gateway_ts_bu.Gateway.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[lane](elements_Gateway_ts_bu.Gateway.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[messageId](elements_Gateway_ts_bu.Gateway.md#messageid)

#### Defined in

[src/elements/Node.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[name](elements_Gateway_ts_bu.Gateway.md#name)

#### Defined in

[src/elements/Node.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[outbounds](elements_Gateway_ts_bu.Gateway.md#outbounds)

#### Defined in

[src/elements/Node.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[process](elements_Gateway_ts_bu.Gateway.md#process)

#### Defined in

[src/elements/Node.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[scripts](elements_Gateway_ts_bu.Gateway.md#scripts)

#### Defined in

[src/elements/Node.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[signalId](elements_Gateway_ts_bu.Gateway.md#signalid)

#### Defined in

[src/elements/Node.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[subType](elements_Gateway_ts_bu.Gateway.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[type](elements_Gateway_ts_bu.Gateway.md#type)

#### Defined in

[src/elements/Element.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L14)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[addBehaviour](elements_Gateway_ts_bu.Gateway.md#addbehaviour)

#### Defined in

[src/elements/Element.ts:41](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L41)

___

### analyzeConvergeFlows

▸ **analyzeConvergeFlows**(`item`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](engine_Item.Item.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `activeFlows` | `any`[] |
| `pendingFlows` | `any`[] |
| `pendingTokens` | [`Token`](engine_Token.Token.md)[] |
| `waitingTokens` | [`Token`](engine_Token.Token.md)[] |

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[analyzeConvergeFlows](elements_Gateway_ts_bu.Gateway.md#analyzeconvergeflows)

#### Defined in

[src/elements/Gateway.ts.bu.ts:152](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts.bu.ts#L152)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[cancelBoundaryEvents](elements_Gateway_ts_bu.Gateway.md#cancelboundaryevents)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[cancelEBG](elements_Gateway_ts_bu.Gateway.md#cancelebg)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[continue](elements_Gateway_ts_bu.Gateway.md#continue)

#### Defined in

[src/elements/Node.ts:212](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L212)

___

### converge

▸ **converge**(`item`, `waitingTokens`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `waitingTokens` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[converge](elements_Gateway_ts_bu.Gateway.md#converge)

#### Defined in

[src/elements/Gateway.ts.bu.ts:319](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts.bu.ts#L319)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[describe](elements_Gateway_ts_bu.Gateway.md#describe)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[doEvent](elements_Gateway_ts_bu.Gateway.md#doevent)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[end](elements_Gateway_ts_bu.Gateway.md#end)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[enter](elements_Gateway_ts_bu.Gateway.md#enter)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[execute](elements_Gateway_ts_bu.Gateway.md#execute)

#### Defined in

[src/elements/Node.ts:139](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L139)

___

### findActiveFlows

▸ **findActiveFlows**(`token`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | [`Token`](engine_Token.Token.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `pendingTokens` | `any`[] |
| `waitingTokens` | `any`[] |

#### Inherited from

[Gateway](elements_Gateway_ts_bu.Gateway.md).[findActiveFlows](elements_Gateway_ts_bu.Gateway.md#findactiveflows)

#### Defined in

[src/elements/Gateway.ts.bu.ts:68](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts.bu.ts#L68)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[getBehaviour](elements_Gateway_ts_bu.Gateway.md#getbehaviour)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[getInput](elements_Gateway_ts_bu.Gateway.md#getinput)

#### Defined in

[src/elements/Node.ts:95](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L95)

___

### getOutbounds

▸ **getOutbounds**(`item`): [`Item`](engine_Item.Item.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

[`Item`](engine_Item.Item.md)[]

#### Overrides

[Gateway](elements_Gateway_ts_bu.Gateway.md).[getOutbounds](elements_Gateway_ts_bu.Gateway.md#getoutbounds)

#### Defined in

[src/elements/Gateway.ts.bu.ts:390](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts.bu.ts#L390)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[getOutput](elements_Gateway_ts_bu.Gateway.md#getoutput)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[hasBehaviour](elements_Gateway_ts_bu.Gateway.md#hasbehaviour)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[init](elements_Gateway_ts_bu.Gateway.md#init)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[restored](elements_Gateway_ts_bu.Gateway.md#restored)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[resume](elements_Gateway_ts_bu.Gateway.md#resume)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[run](elements_Gateway_ts_bu.Gateway.md#run)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[setInput](elements_Gateway_ts_bu.Gateway.md#setinput)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[start](elements_Gateway_ts_bu.Gateway.md#start)

#### Defined in

[src/elements/Gateway.ts.bu.ts:276](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Gateway.ts.bu.ts#L276)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[startBoundaryEvents](elements_Gateway_ts_bu.Gateway.md#startboundaryevents)

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

[Gateway](elements_Gateway_ts_bu.Gateway.md).[validate](elements_Gateway_ts_bu.Gateway.md#validate)

#### Defined in

[src/elements/Node.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L44)
