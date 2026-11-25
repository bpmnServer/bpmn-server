[bpmn-server](../readme.md) / EventBasedGateway

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

- [id](EventBasedGateway.md#id)
- [type](EventBasedGateway.md#type)
- [subType](EventBasedGateway.md#subtype)
- [behaviours](EventBasedGateway.md#behaviours)
- [isFlow](EventBasedGateway.md#isflow)
- [lane](EventBasedGateway.md#lane)
- [working](EventBasedGateway.md#working)
- [listener](EventBasedGateway.md#listener)
- [name](EventBasedGateway.md#name)
- [process](EventBasedGateway.md#process)
- [def](EventBasedGateway.md#def)
- [outbounds](EventBasedGateway.md#outbounds)
- [inbounds](EventBasedGateway.md#inbounds)
- [attachments](EventBasedGateway.md#attachments)
- [attachedTo](EventBasedGateway.md#attachedto)
- [messageId](EventBasedGateway.md#messageid)
- [signalId](EventBasedGateway.md#signalid)
- [initiator](EventBasedGateway.md#initiator)
- [assignee](EventBasedGateway.md#assignee)
- [candidateGroups](EventBasedGateway.md#candidategroups)
- [candidateUsers](EventBasedGateway.md#candidateusers)
- [scripts](EventBasedGateway.md#scripts)

### Accessors

- [processId](EventBasedGateway.md#processid)
- [requiresWait](EventBasedGateway.md#requireswait)
- [canBeInvoked](EventBasedGateway.md#canbeinvoked)
- [loopDefinition](EventBasedGateway.md#loopdefinition)
- [isCatching](EventBasedGateway.md#iscatching)
- [dataObjectNames](EventBasedGateway.md#dataobjectnames)
- [exceptionsAsErrors](EventBasedGateway.md#exceptionsaserrors)

### Methods

- [hasBehaviour](EventBasedGateway.md#hasbehaviour)
- [getBehaviour](EventBasedGateway.md#getbehaviour)
- [addBehaviour](EventBasedGateway.md#addbehaviour)
- [getOutbounds](EventBasedGateway.md#getoutbounds)
- [choose](EventBasedGateway.md#choose)
- [explain](EventBasedGateway.md#explain)
- [flowsThatHold](EventBasedGateway.md#flowsthathold)
- [getPotentialPath](EventBasedGateway.md#getpotentialpath)
- [canReach](EventBasedGateway.md#canreach)
- [getRelatedTokens](EventBasedGateway.md#getrelatedtokens)
- [analyzeConvergingTokens](EventBasedGateway.md#analyzeconvergingtokens)
- [start](EventBasedGateway.md#start)
- [restored](EventBasedGateway.md#restored)
- [run](EventBasedGateway.md#run)
- [cancelAllBranched](EventBasedGateway.md#cancelallbranched)
- [validate](EventBasedGateway.md#validate)
- [doEvent](EventBasedGateway.md#doevent)
- [setInput](EventBasedGateway.md#setinput)
- [getInput](EventBasedGateway.md#getinput)
- [getOutput](EventBasedGateway.md#getoutput)
- [enter](EventBasedGateway.md#enter)
- [loadDataObjects](EventBasedGateway.md#loaddataobjects)
- [execute](EventBasedGateway.md#execute)
- [perform](EventBasedGateway.md#perform)
- [failed](EventBasedGateway.md#failed)
- [continue](EventBasedGateway.md#continue)
- [cancelEBG](EventBasedGateway.md#cancelebg)
- [cancelBoundaryEvents](EventBasedGateway.md#cancelboundaryevents)
- [getBoundaryEventItems](EventBasedGateway.md#getboundaryeventitems)
- [end](EventBasedGateway.md#end)
- [resume](EventBasedGateway.md#resume)
- [init](EventBasedGateway.md#init)
- [startBoundaryEvents](EventBasedGateway.md#startboundaryevents)
- [describe](EventBasedGateway.md#describe)

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

[packages/bpmn-server/src/elements/Node.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L37)

## Properties

### id

• **id**: `any`

#### Inherited from

[Gateway](Gateway.md).[id](Gateway.md#id)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[Gateway](Gateway.md).[type](Gateway.md#type)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[Gateway](Gateway.md).[subType](Gateway.md#subtype)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](Gateway.md).[behaviours](Gateway.md#behaviours)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Gateway](Gateway.md).[isFlow](Gateway.md#isflow)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Gateway](Gateway.md).[lane](Gateway.md#lane)

#### Defined in

[packages/bpmn-server/src/elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L19)

___

### working

• **working**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/elements/Gateway.ts:351](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L351)

___

### listener

• **listener**: `any`

#### Defined in

[packages/bpmn-server/src/elements/Gateway.ts:352](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L352)

___

### name

• **name**: `string` = `''`

#### Inherited from

[Gateway](Gateway.md).[name](Gateway.md#name)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L18)

___

### process

• **process**: `any`

#### Inherited from

[Gateway](Gateway.md).[process](Gateway.md#process)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L19)

___

### def

• **def**: `any`

#### Inherited from

[Gateway](Gateway.md).[def](Gateway.md#def)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L20)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Gateway](Gateway.md).[outbounds](Gateway.md#outbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L21)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[Gateway](Gateway.md).[inbounds](Gateway.md#inbounds)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L22)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[Gateway](Gateway.md).[attachments](Gateway.md#attachments)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L23)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[Gateway](Gateway.md).[attachedTo](Gateway.md#attachedto)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L24)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Gateway](Gateway.md).[messageId](Gateway.md#messageid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Gateway](Gateway.md).[signalId](Gateway.md#signalid)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L26)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Gateway](Gateway.md).[initiator](Gateway.md#initiator)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L27)

___

### assignee

• **assignee**: `any`

#### Inherited from

[Gateway](Gateway.md).[assignee](Gateway.md#assignee)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L28)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Gateway](Gateway.md).[candidateGroups](Gateway.md#candidategroups)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L29)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Gateway](Gateway.md).[candidateUsers](Gateway.md#candidateusers)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L30)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Gateway](Gateway.md).[scripts](Gateway.md#scripts)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L31)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Gateway.processId

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L32)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.requiresWait

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:161](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L161)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.canBeInvoked

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:166](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L166)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

Gateway.loopDefinition

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:168](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L168)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Gateway.isCatching

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:172](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L172)

___

### dataObjectNames

• `get` **dataObjectNames**(): `string`[]

The data objects connected to this element by a data association, either way: their names, as the diagram
shows them (the reference's name, else the data object's or data store's, else its id).

#### Returns

`string`[]

#### Inherited from

Gateway.dataObjectNames

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:186](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L186)

___

### exceptionsAsErrors

• `get` **exceptionsAsErrors**(): `boolean`

`owf:exceptionsAsErrors="true"` (or the old `camunda:` name): an exception of the task's work is raised as a BPMN error.

#### Returns

`boolean`

#### Inherited from

Gateway.exceptionsAsErrors

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:321](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L321)

## Methods

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

[packages/bpmn-server/src/elements/Element.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L34)

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

[packages/bpmn-server/src/elements/Element.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L38)

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

[packages/bpmn-server/src/elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Element.ts#L41)

___

### getOutbounds

▸ **getOutbounds**(`item`): `Promise`\<[`Item`](Item.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`Item`](Item.md)[]\>

#### Inherited from

[Gateway](Gateway.md).[getOutbounds](Gateway.md#getoutbounds)

#### Defined in

[packages/bpmn-server/src/elements/Gateway.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L36)

___

### choose

▸ **choose**(`held`, `item`): [`Item`](Item.md)[]

Which of its flows the gateway takes, of those that hold (an exclusive gateway: one).

#### Parameters

| Name | Type |
| :------ | :------ |
| `held` | [`Item`](Item.md)[] |
| `item` | [`Item`](Item.md) |

#### Returns

[`Item`](Item.md)[]

#### Inherited from

[Gateway](Gateway.md).[choose](Gateway.md#choose)

#### Defined in

[packages/bpmn-server/src/elements/Gateway.ts:44](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L44)

___

### explain

▸ **explain**(`item`, `held`, `chosen`): `void`

The decision in words, for the instance's log: the flows taken and why, for a gateway that chooses.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `held` | [`Item`](Item.md)[] |
| `chosen` | [`Item`](Item.md)[] |

#### Returns

`void`

#### Inherited from

[Gateway](Gateway.md).[explain](Gateway.md#explain)

#### Defined in

[packages/bpmn-server/src/elements/Gateway.ts:49](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L49)

___

### flowsThatHold

▸ **flowsThatHold**(`item`): `Promise`\<[`Item`](Item.md)[]\>

The outgoing flows whose conditions hold; the default flow when none does.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`Item`](Item.md)[]\>

#### Inherited from

[Gateway](Gateway.md).[flowsThatHold](Gateway.md#flowsthathold)

#### Defined in

[packages/bpmn-server/src/elements/Gateway.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L71)

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

[packages/bpmn-server/src/elements/Gateway.ts:101](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L101)

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

[packages/bpmn-server/src/elements/Gateway.ts:115](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L115)

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

[packages/bpmn-server/src/elements/Gateway.ts:125](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L125)

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

[packages/bpmn-server/src/elements/Gateway.ts:170](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L170)

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

[packages/bpmn-server/src/elements/Gateway.ts:199](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L199)

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

[packages/bpmn-server/src/elements/Gateway.ts:354](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L354)

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

[packages/bpmn-server/src/elements/Gateway.ts:357](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L357)

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

[packages/bpmn-server/src/elements/Gateway.ts:360](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Gateway.ts#L360)

___

### validate

▸ **validate**(`item`, `form?`): `Promise`\<`void`\>

The validate event's scripts; and, when a task is completed (`form`: the data sent, and the case's before it), its
form's rules (elements/FormRules.ts). On completion, a rule broken or a script's `{ error }` refuses it:
FormInvalidError (FORM_INVALID), before anything is saved. Otherwise (an assignment) a script's error is an
execution error, as it always was.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `form?` | `Object` |
| `form.sent` | `Record`\<`string`, `any`\> |
| `form.current` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Gateway](Gateway.md).[validate](Gateway.md#validate)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L57)

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

[packages/bpmn-server/src/elements/Node.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L86)

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

[packages/bpmn-server/src/elements/Node.ts:124](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L124)

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

[packages/bpmn-server/src/elements/Node.ts:134](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L134)

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

[packages/bpmn-server/src/elements/Node.ts:148](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L148)

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

[packages/bpmn-server/src/elements/Node.ts:152](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L152)

___

### loadDataObjects

▸ **loadDataObjects**(`item`): `Promise`\<`void`\>

Load the element's data objects into the instance data (appDelegate.loadDataObject), where they are saved
with the instance: `data.client` for a data object 'client'. They load each time the element runs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[Gateway](Gateway.md).[loadDataObjects](Gateway.md#loaddataobjects)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:203](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L203)

___

### execute

▸ **execute**(`item`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[Gateway](Gateway.md).[execute](Gateway.md#execute)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:219](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L219)

___

### perform

▸ **perform**(`item`): `Promise`\<`any`\>

Steps 4 and 5 of execute: the work (run), then on. Also a failed item's retry (Token.retry): the work again.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`any`\>

#### Inherited from

[Gateway](Gateway.md).[perform](Gateway.md#perform)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:285](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L285)

___

### failed

▸ **failed**(`item`, `error`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

The task's work threw. With exceptionsAsErrors and an error event that catches it (by the exception's code,
else its name; an error event with no code catches any), it is raised there as a BPMN error and the task
ends. Otherwise the item's status is `error`, with the message, saved so the instance shows it and the item
can be retried (engine.retry), and the exception is thrown to the caller as before.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |
| `error` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Inherited from

[Gateway](Gateway.md).[failed](Gateway.md#failed)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:330](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L330)

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

[packages/bpmn-server/src/elements/Node.ts:359](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L359)

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

[packages/bpmn-server/src/elements/Node.ts:378](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L378)

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

[packages/bpmn-server/src/elements/Node.ts:386](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L386)

___

### getBoundaryEventItems

▸ **getBoundaryEventItems**(`item`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`[]

#### Inherited from

[Gateway](Gateway.md).[getBoundaryEventItems](Gateway.md#getboundaryeventitems)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:424](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L424)

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

[packages/bpmn-server/src/elements/Node.ts:462](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L462)

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

[packages/bpmn-server/src/elements/Node.ts:511](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L511)

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

[packages/bpmn-server/src/elements/Node.ts:514](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L514)

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

[packages/bpmn-server/src/elements/Node.ts:552](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L552)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[Gateway](Gateway.md).[describe](Gateway.md#describe)

#### Defined in

[packages/bpmn-server/src/elements/Node.ts:571](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Node.ts#L571)
