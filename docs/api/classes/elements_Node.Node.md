[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Node](../modules/elements_Node.md) / Node

# Class: Node

[elements/Node](../modules/elements_Node.md).Node

## Hierarchy

- [`Element`](elements_Element.Element.md)

  ↳ **`Node`**

  ↳↳ [`Event`](elements_Events.Event.md)

  ↳↳ [`Gateway`](elements_Gateway.Gateway.md)

  ↳↳ [`Gateway`](elements_Gateway_ts_bu.Gateway.md)

  ↳↳ [`UserTask`](elements_Tasks.UserTask.md)

  ↳↳ [`ScriptTask`](elements_Tasks.ScriptTask.md)

  ↳↳ [`ServiceTask`](elements_Tasks.ServiceTask.md)

  ↳↳ [`ReceiveTask`](elements_Tasks.ReceiveTask.md)

  ↳↳ [`SubProcess`](elements_Tasks.SubProcess.md)

  ↳↳ [`CallActivity`](elements_Tasks.CallActivity.md)

## Table of contents

### Constructors

- [constructor](elements_Node.Node.md#constructor)

### Properties

- [assignee](elements_Node.Node.md#assignee)
- [attachedTo](elements_Node.Node.md#attachedto)
- [attachments](elements_Node.Node.md#attachments)
- [behaviours](elements_Node.Node.md#behaviours)
- [candidateGroups](elements_Node.Node.md#candidategroups)
- [candidateUsers](elements_Node.Node.md#candidateusers)
- [def](elements_Node.Node.md#def)
- [id](elements_Node.Node.md#id)
- [inbounds](elements_Node.Node.md#inbounds)
- [initiator](elements_Node.Node.md#initiator)
- [isFlow](elements_Node.Node.md#isflow)
- [lane](elements_Node.Node.md#lane)
- [messageId](elements_Node.Node.md#messageid)
- [name](elements_Node.Node.md#name)
- [outbounds](elements_Node.Node.md#outbounds)
- [process](elements_Node.Node.md#process)
- [scripts](elements_Node.Node.md#scripts)
- [signalId](elements_Node.Node.md#signalid)
- [subType](elements_Node.Node.md#subtype)
- [type](elements_Node.Node.md#type)

### Accessors

- [canBeInvoked](elements_Node.Node.md#canbeinvoked)
- [isCatching](elements_Node.Node.md#iscatching)
- [processId](elements_Node.Node.md#processid)
- [requiresWait](elements_Node.Node.md#requireswait)

### Methods

- [addBehaviour](elements_Node.Node.md#addbehaviour)
- [cancelBoundaryEvents](elements_Node.Node.md#cancelboundaryevents)
- [cancelEBG](elements_Node.Node.md#cancelebg)
- [continue](elements_Node.Node.md#continue)
- [describe](elements_Node.Node.md#describe)
- [doEvent](elements_Node.Node.md#doevent)
- [end](elements_Node.Node.md#end)
- [enter](elements_Node.Node.md#enter)
- [execute](elements_Node.Node.md#execute)
- [getBehaviour](elements_Node.Node.md#getbehaviour)
- [getInput](elements_Node.Node.md#getinput)
- [getOutbounds](elements_Node.Node.md#getoutbounds)
- [getOutput](elements_Node.Node.md#getoutput)
- [hasBehaviour](elements_Node.Node.md#hasbehaviour)
- [init](elements_Node.Node.md#init)
- [restored](elements_Node.Node.md#restored)
- [resume](elements_Node.Node.md#resume)
- [run](elements_Node.Node.md#run)
- [setInput](elements_Node.Node.md#setinput)
- [start](elements_Node.Node.md#start)
- [startBoundaryEvents](elements_Node.Node.md#startboundaryevents)
- [validate](elements_Node.Node.md#validate)

## Constructors

### constructor

• **new Node**(`id`, `process`, `type`, `def`): [`Node`](elements_Node.Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`Node`](elements_Node.Node.md)

#### Overrides

[Element](elements_Element.Element.md).[constructor](elements_Element.Element.md#constructor)

#### Defined in

[src/elements/Node.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L31)

## Properties

### assignee

• **assignee**: `any`

#### Defined in

[src/elements/Node.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](elements_Node.Node.md)

#### Defined in

[src/elements/Node.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](elements_Node.Node.md)[]

#### Defined in

[src/elements/Node.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Element](elements_Element.Element.md).[behaviours](elements_Element.Element.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Defined in

[src/elements/Node.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Defined in

[src/elements/Node.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L24)

___

### def

• **def**: `any`

#### Defined in

[src/elements/Node.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[Element](elements_Element.Element.md).[id](elements_Element.Element.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Defined in

[src/elements/Node.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Defined in

[src/elements/Node.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Element](elements_Element.Element.md).[isFlow](elements_Element.Element.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Element](elements_Element.Element.md).[lane](elements_Element.Element.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Defined in

[src/elements/Node.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Overrides

[Element](elements_Element.Element.md).[name](elements_Element.Element.md#name)

#### Defined in

[src/elements/Node.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Defined in

[src/elements/Node.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Defined in

[src/elements/Node.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[src/elements/Node.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Defined in

[src/elements/Node.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[Element](elements_Element.Element.md).[subType](elements_Element.Element.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[Element](elements_Element.Element.md).[type](elements_Element.Element.md#type)

#### Defined in

[src/elements/Element.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/Node.ts:127](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L127)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/elements/Node.ts:129](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L129)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/Node.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

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

[Element](elements_Element.Element.md).[addBehaviour](elements_Element.Element.md#addbehaviour)

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

#### Overrides

[Element](elements_Element.Element.md).[continue](elements_Element.Element.md#continue)

#### Defined in

[src/elements/Node.ts:212](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Element](elements_Element.Element.md).[describe](elements_Element.Element.md#describe)

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

[Element](elements_Element.Element.md).[getBehaviour](elements_Element.Element.md#getbehaviour)

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

[Element](elements_Element.Element.md).[hasBehaviour](elements_Element.Element.md#hasbehaviour)

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

[Element](elements_Element.Element.md).[restored](elements_Element.Element.md#restored)

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

#### Overrides

[Element](elements_Element.Element.md).[resume](elements_Element.Element.md#resume)

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

#### Defined in

[src/elements/Node.ts:217](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L217)

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

#### Defined in

[src/elements/Node.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L44)
