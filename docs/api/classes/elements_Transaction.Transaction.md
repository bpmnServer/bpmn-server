[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Transaction](../modules/elements_Transaction.md) / Transaction

# Class: Transaction

[elements/Transaction](../modules/elements_Transaction.md).Transaction

## Hierarchy

- [`SubProcess`](elements_Tasks.SubProcess.md)

  ↳ **`Transaction`**

## Table of contents

### Constructors

- [constructor](elements_Transaction.Transaction.md#constructor)

### Properties

- [assignee](elements_Transaction.Transaction.md#assignee)
- [attachedTo](elements_Transaction.Transaction.md#attachedto)
- [attachments](elements_Transaction.Transaction.md#attachments)
- [behaviours](elements_Transaction.Transaction.md#behaviours)
- [candidateGroups](elements_Transaction.Transaction.md#candidategroups)
- [candidateUsers](elements_Transaction.Transaction.md#candidateusers)
- [childProcess](elements_Transaction.Transaction.md#childprocess)
- [def](elements_Transaction.Transaction.md#def)
- [id](elements_Transaction.Transaction.md#id)
- [inbounds](elements_Transaction.Transaction.md#inbounds)
- [initiator](elements_Transaction.Transaction.md#initiator)
- [isFlow](elements_Transaction.Transaction.md#isflow)
- [lane](elements_Transaction.Transaction.md#lane)
- [messageId](elements_Transaction.Transaction.md#messageid)
- [name](elements_Transaction.Transaction.md#name)
- [outbounds](elements_Transaction.Transaction.md#outbounds)
- [process](elements_Transaction.Transaction.md#process)
- [scripts](elements_Transaction.Transaction.md#scripts)
- [signalId](elements_Transaction.Transaction.md#signalid)
- [subType](elements_Transaction.Transaction.md#subtype)
- [type](elements_Transaction.Transaction.md#type)

### Accessors

- [canBeInvoked](elements_Transaction.Transaction.md#canbeinvoked)
- [isCatching](elements_Transaction.Transaction.md#iscatching)
- [processId](elements_Transaction.Transaction.md#processid)
- [requiresWait](elements_Transaction.Transaction.md#requireswait)

### Methods

- [addBehaviour](elements_Transaction.Transaction.md#addbehaviour)
- [cancelBoundaryEvents](elements_Transaction.Transaction.md#cancelboundaryevents)
- [cancelEBG](elements_Transaction.Transaction.md#cancelebg)
- [continue](elements_Transaction.Transaction.md#continue)
- [describe](elements_Transaction.Transaction.md#describe)
- [doEvent](elements_Transaction.Transaction.md#doevent)
- [end](elements_Transaction.Transaction.md#end)
- [enter](elements_Transaction.Transaction.md#enter)
- [execute](elements_Transaction.Transaction.md#execute)
- [getBehaviour](elements_Transaction.Transaction.md#getbehaviour)
- [getInput](elements_Transaction.Transaction.md#getinput)
- [getItems](elements_Transaction.Transaction.md#getitems)
- [getItemsForToken](elements_Transaction.Transaction.md#getitemsfortoken)
- [getNodes](elements_Transaction.Transaction.md#getnodes)
- [getOutbounds](elements_Transaction.Transaction.md#getoutbounds)
- [getOutput](elements_Transaction.Transaction.md#getoutput)
- [hasBehaviour](elements_Transaction.Transaction.md#hasbehaviour)
- [init](elements_Transaction.Transaction.md#init)
- [restored](elements_Transaction.Transaction.md#restored)
- [resume](elements_Transaction.Transaction.md#resume)
- [run](elements_Transaction.Transaction.md#run)
- [setInput](elements_Transaction.Transaction.md#setinput)
- [start](elements_Transaction.Transaction.md#start)
- [startBoundaryEvents](elements_Transaction.Transaction.md#startboundaryevents)
- [validate](elements_Transaction.Transaction.md#validate)
- [Cancel](elements_Transaction.Transaction.md#cancel)
- [Compensate](elements_Transaction.Transaction.md#compensate)

## Constructors

### constructor

• **new Transaction**(`id`, `process`, `type`, `def`): [`Transaction`](elements_Transaction.Transaction.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`Transaction`](elements_Transaction.Transaction.md)

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[constructor](elements_Tasks.SubProcess.md#constructor)

#### Defined in

[src/elements/Node.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[assignee](elements_Tasks.SubProcess.md#assignee)

#### Defined in

[src/elements/Node.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](elements_Node.Node.md)

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[attachedTo](elements_Tasks.SubProcess.md#attachedto)

#### Defined in

[src/elements/Node.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](elements_Node.Node.md)[]

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[attachments](elements_Tasks.SubProcess.md#attachments)

#### Defined in

[src/elements/Node.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[behaviours](elements_Tasks.SubProcess.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[candidateGroups](elements_Tasks.SubProcess.md#candidategroups)

#### Defined in

[src/elements/Node.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[candidateUsers](elements_Tasks.SubProcess.md#candidateusers)

#### Defined in

[src/elements/Node.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L24)

___

### childProcess

• **childProcess**: [`Process`](elements_Process.Process.md)

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[childProcess](elements_Tasks.SubProcess.md#childprocess)

#### Defined in

[src/elements/Tasks.ts:223](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Tasks.ts#L223)

___

### def

• **def**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[def](elements_Tasks.SubProcess.md#def)

#### Defined in

[src/elements/Node.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[id](elements_Tasks.SubProcess.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[inbounds](elements_Tasks.SubProcess.md#inbounds)

#### Defined in

[src/elements/Node.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[initiator](elements_Tasks.SubProcess.md#initiator)

#### Defined in

[src/elements/Node.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[isFlow](elements_Tasks.SubProcess.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[lane](elements_Tasks.SubProcess.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[messageId](elements_Tasks.SubProcess.md#messageid)

#### Defined in

[src/elements/Node.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[name](elements_Tasks.SubProcess.md#name)

#### Defined in

[src/elements/Node.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[outbounds](elements_Tasks.SubProcess.md#outbounds)

#### Defined in

[src/elements/Node.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[process](elements_Tasks.SubProcess.md#process)

#### Defined in

[src/elements/Node.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[scripts](elements_Tasks.SubProcess.md#scripts)

#### Defined in

[src/elements/Node.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[signalId](elements_Tasks.SubProcess.md#signalid)

#### Defined in

[src/elements/Node.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[subType](elements_Tasks.SubProcess.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[type](elements_Tasks.SubProcess.md#type)

#### Defined in

[src/elements/Element.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SubProcess.canBeInvoked

#### Defined in

[src/elements/Tasks.ts:225](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Tasks.ts#L225)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SubProcess.isCatching

#### Defined in

[src/elements/Node.ts:129](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L129)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

SubProcess.processId

#### Defined in

[src/elements/Node.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Overrides

SubProcess.requiresWait

#### Defined in

[src/elements/Transaction.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L15)

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

[SubProcess](elements_Tasks.SubProcess.md).[addBehaviour](elements_Tasks.SubProcess.md#addbehaviour)

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

[SubProcess](elements_Tasks.SubProcess.md).[cancelBoundaryEvents](elements_Tasks.SubProcess.md#cancelboundaryevents)

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

[SubProcess](elements_Tasks.SubProcess.md).[cancelEBG](elements_Tasks.SubProcess.md#cancelebg)

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

[SubProcess](elements_Tasks.SubProcess.md).[continue](elements_Tasks.SubProcess.md#continue)

#### Defined in

[src/elements/Node.ts:212](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[SubProcess](elements_Tasks.SubProcess.md).[describe](elements_Tasks.SubProcess.md#describe)

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

[SubProcess](elements_Tasks.SubProcess.md).[doEvent](elements_Tasks.SubProcess.md#doevent)

#### Defined in

[src/elements/Node.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L57)

___

### end

▸ **end**(`item`, `cancel?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | `any` | `undefined` |
| `cancel` | `Boolean` | `false` |

#### Returns

`Promise`\<`void`\>

#### Overrides

[SubProcess](elements_Tasks.SubProcess.md).[end](elements_Tasks.SubProcess.md#end)

#### Defined in

[src/elements/Transaction.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L17)

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

[SubProcess](elements_Tasks.SubProcess.md).[enter](elements_Tasks.SubProcess.md#enter)

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

[SubProcess](elements_Tasks.SubProcess.md).[execute](elements_Tasks.SubProcess.md#execute)

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

[SubProcess](elements_Tasks.SubProcess.md).[getBehaviour](elements_Tasks.SubProcess.md#getbehaviour)

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

[SubProcess](elements_Tasks.SubProcess.md).[getInput](elements_Tasks.SubProcess.md#getinput)

#### Defined in

[src/elements/Node.ts:95](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L95)

___

### getItems

▸ **getItems**(`item`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`[]

#### Defined in

[src/elements/Transaction.ts:92](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L92)

___

### getItemsForToken

▸ **getItemsForToken**(`token`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `token` | `any` |

#### Returns

`any`[]

#### Defined in

[src/elements/Transaction.ts:78](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L78)

___

### getNodes

▸ **getNodes**(): [`Node`](elements_Node.Node.md)[]

#### Returns

[`Node`](elements_Node.Node.md)[]

#### Defined in

[src/elements/Transaction.ts:74](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L74)

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

[SubProcess](elements_Tasks.SubProcess.md).[getOutbounds](elements_Tasks.SubProcess.md#getoutbounds)

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

[SubProcess](elements_Tasks.SubProcess.md).[getOutput](elements_Tasks.SubProcess.md#getoutput)

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

[SubProcess](elements_Tasks.SubProcess.md).[hasBehaviour](elements_Tasks.SubProcess.md#hasbehaviour)

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

[SubProcess](elements_Tasks.SubProcess.md).[init](elements_Tasks.SubProcess.md#init)

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

[SubProcess](elements_Tasks.SubProcess.md).[restored](elements_Tasks.SubProcess.md#restored)

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

[SubProcess](elements_Tasks.SubProcess.md).[resume](elements_Tasks.SubProcess.md#resume)

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

[SubProcess](elements_Tasks.SubProcess.md).[run](elements_Tasks.SubProcess.md#run)

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

[SubProcess](elements_Tasks.SubProcess.md).[setInput](elements_Tasks.SubProcess.md#setinput)

#### Defined in

[src/elements/Node.ts:85](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L85)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Overrides

[SubProcess](elements_Tasks.SubProcess.md).[start](elements_Tasks.SubProcess.md#start)

#### Defined in

[src/elements/Transaction.ts:97](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L97)

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

[SubProcess](elements_Tasks.SubProcess.md).[startBoundaryEvents](elements_Tasks.SubProcess.md#startboundaryevents)

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

[SubProcess](elements_Tasks.SubProcess.md).[validate](elements_Tasks.SubProcess.md#validate)

#### Defined in

[src/elements/Node.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L44)

___

### Cancel

▸ **Cancel**(`transaction`): `Promise`\<`void`\>

Cancel Transaction
 is called by Throw Cancel Event
 
 1.  Aborts any started items in the transaction
 2.  Compensate any completed items

#### Parameters

| Name | Type |
| :------ | :------ |
| `transaction` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/elements/Transaction.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L31)

___

### Compensate

▸ **Compensate**(`transItem`): `Promise`\<`void`\>

Compensate Transaction
 is called by Throw Compensate Event
 this is called outside of the transaction
 
 1.  Compensate any completed items

#### Parameters

| Name | Type |
| :------ | :------ |
| `transItem` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/elements/Transaction.ts:43](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Transaction.ts#L43)
