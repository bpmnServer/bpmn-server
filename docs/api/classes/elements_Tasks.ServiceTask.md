[bpmn-server](../README.md) / [Exports](../modules.md) / [elements/Tasks](../modules/elements_Tasks.md) / ServiceTask

# Class: ServiceTask

[elements/Tasks](../modules/elements_Tasks.md).ServiceTask

foo[method]();
     
     await this.token.appDelegate[serviceName](data);
     
     
     service signature:
             output= service (input,context)

## Hierarchy

- [`Node`](elements_Node.Node.md)

  ↳ **`ServiceTask`**

  ↳↳ [`BusinessRuleTask`](elements_Tasks.BusinessRuleTask.md)

  ↳↳ [`SendTask`](elements_Tasks.SendTask.md)

## Table of contents

### Constructors

- [constructor](elements_Tasks.ServiceTask.md#constructor)

### Properties

- [assignee](elements_Tasks.ServiceTask.md#assignee)
- [attachedTo](elements_Tasks.ServiceTask.md#attachedto)
- [attachments](elements_Tasks.ServiceTask.md#attachments)
- [behaviours](elements_Tasks.ServiceTask.md#behaviours)
- [candidateGroups](elements_Tasks.ServiceTask.md#candidategroups)
- [candidateUsers](elements_Tasks.ServiceTask.md#candidateusers)
- [def](elements_Tasks.ServiceTask.md#def)
- [id](elements_Tasks.ServiceTask.md#id)
- [inbounds](elements_Tasks.ServiceTask.md#inbounds)
- [initiator](elements_Tasks.ServiceTask.md#initiator)
- [isFlow](elements_Tasks.ServiceTask.md#isflow)
- [lane](elements_Tasks.ServiceTask.md#lane)
- [messageId](elements_Tasks.ServiceTask.md#messageid)
- [name](elements_Tasks.ServiceTask.md#name)
- [outbounds](elements_Tasks.ServiceTask.md#outbounds)
- [process](elements_Tasks.ServiceTask.md#process)
- [scripts](elements_Tasks.ServiceTask.md#scripts)
- [signalId](elements_Tasks.ServiceTask.md#signalid)
- [subType](elements_Tasks.ServiceTask.md#subtype)
- [type](elements_Tasks.ServiceTask.md#type)

### Accessors

- [canBeInvoked](elements_Tasks.ServiceTask.md#canbeinvoked)
- [isCatching](elements_Tasks.ServiceTask.md#iscatching)
- [processId](elements_Tasks.ServiceTask.md#processid)
- [requiresWait](elements_Tasks.ServiceTask.md#requireswait)
- [serviceName](elements_Tasks.ServiceTask.md#servicename)

### Methods

- [addBehaviour](elements_Tasks.ServiceTask.md#addbehaviour)
- [cancelBoundaryEvents](elements_Tasks.ServiceTask.md#cancelboundaryevents)
- [cancelEBG](elements_Tasks.ServiceTask.md#cancelebg)
- [continue](elements_Tasks.ServiceTask.md#continue)
- [describe](elements_Tasks.ServiceTask.md#describe)
- [doEvent](elements_Tasks.ServiceTask.md#doevent)
- [end](elements_Tasks.ServiceTask.md#end)
- [enter](elements_Tasks.ServiceTask.md#enter)
- [execute](elements_Tasks.ServiceTask.md#execute)
- [getBehaviour](elements_Tasks.ServiceTask.md#getbehaviour)
- [getInput](elements_Tasks.ServiceTask.md#getinput)
- [getOutbounds](elements_Tasks.ServiceTask.md#getoutbounds)
- [getOutput](elements_Tasks.ServiceTask.md#getoutput)
- [hasBehaviour](elements_Tasks.ServiceTask.md#hasbehaviour)
- [init](elements_Tasks.ServiceTask.md#init)
- [restored](elements_Tasks.ServiceTask.md#restored)
- [resume](elements_Tasks.ServiceTask.md#resume)
- [run](elements_Tasks.ServiceTask.md#run)
- [setInput](elements_Tasks.ServiceTask.md#setinput)
- [start](elements_Tasks.ServiceTask.md#start)
- [startBoundaryEvents](elements_Tasks.ServiceTask.md#startboundaryevents)
- [validate](elements_Tasks.ServiceTask.md#validate)

## Constructors

### constructor

• **new ServiceTask**(`id`, `process`, `type`, `def`): [`ServiceTask`](elements_Tasks.ServiceTask.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`ServiceTask`](elements_Tasks.ServiceTask.md)

#### Inherited from

[Node](elements_Node.Node.md).[constructor](elements_Node.Node.md#constructor)

#### Defined in

[src/elements/Node.ts:31](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[assignee](elements_Node.Node.md#assignee)

#### Defined in

[src/elements/Node.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](elements_Node.Node.md)

#### Inherited from

[Node](elements_Node.Node.md).[attachedTo](elements_Node.Node.md#attachedto)

#### Defined in

[src/elements/Node.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](elements_Node.Node.md)[]

#### Inherited from

[Node](elements_Node.Node.md).[attachments](elements_Node.Node.md#attachments)

#### Defined in

[src/elements/Node.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](elements_Node.Node.md).[behaviours](elements_Node.Node.md#behaviours)

#### Defined in

[src/elements/Element.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[candidateGroups](elements_Node.Node.md#candidategroups)

#### Defined in

[src/elements/Node.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[candidateUsers](elements_Node.Node.md#candidateusers)

#### Defined in

[src/elements/Node.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L24)

___

### def

• **def**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[def](elements_Node.Node.md#def)

#### Defined in

[src/elements/Node.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[id](elements_Node.Node.md#id)

#### Defined in

[src/elements/Element.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Node](elements_Node.Node.md).[inbounds](elements_Node.Node.md#inbounds)

#### Defined in

[src/elements/Node.ts:16](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[initiator](elements_Node.Node.md#initiator)

#### Defined in

[src/elements/Node.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Node](elements_Node.Node.md).[isFlow](elements_Node.Node.md#isflow)

#### Defined in

[src/elements/Element.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[lane](elements_Node.Node.md#lane)

#### Defined in

[src/elements/Element.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[messageId](elements_Node.Node.md#messageid)

#### Defined in

[src/elements/Node.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[name](elements_Node.Node.md#name)

#### Defined in

[src/elements/Node.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](elements_Flow.Flow.md)[]

#### Inherited from

[Node](elements_Node.Node.md).[outbounds](elements_Node.Node.md#outbounds)

#### Defined in

[src/elements/Node.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[process](elements_Node.Node.md#process)

#### Defined in

[src/elements/Node.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[Node](elements_Node.Node.md).[scripts](elements_Node.Node.md#scripts)

#### Defined in

[src/elements/Node.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[signalId](elements_Node.Node.md#signalid)

#### Defined in

[src/elements/Node.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[subType](elements_Node.Node.md#subtype)

#### Defined in

[src/elements/Element.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[Node](elements_Node.Node.md).[type](elements_Node.Node.md#type)

#### Defined in

[src/elements/Element.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Element.ts#L14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.canBeInvoked

#### Defined in

[src/elements/Node.ts:127](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L127)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.isCatching

#### Defined in

[src/elements/Node.ts:129](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L129)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

Node.processId

#### Defined in

[src/elements/Node.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

Node.requiresWait

#### Defined in

[src/elements/Node.ts:122](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L122)

___

### serviceName

• `get` **serviceName**(): `any`

#### Returns

`any`

#### Defined in

[src/elements/Tasks.ts:37](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Tasks.ts#L37)

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

[Node](elements_Node.Node.md).[addBehaviour](elements_Node.Node.md#addbehaviour)

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

[Node](elements_Node.Node.md).[cancelBoundaryEvents](elements_Node.Node.md#cancelboundaryevents)

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

[Node](elements_Node.Node.md).[cancelEBG](elements_Node.Node.md#cancelebg)

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

[Node](elements_Node.Node.md).[continue](elements_Node.Node.md#continue)

#### Defined in

[src/elements/Node.ts:212](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Overrides

[Node](elements_Node.Node.md).[describe](elements_Node.Node.md#describe)

#### Defined in

[src/elements/Tasks.ts:93](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Tasks.ts#L93)

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

[Node](elements_Node.Node.md).[doEvent](elements_Node.Node.md#doevent)

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

[Node](elements_Node.Node.md).[end](elements_Node.Node.md#end)

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

[Node](elements_Node.Node.md).[enter](elements_Node.Node.md#enter)

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

[Node](elements_Node.Node.md).[execute](elements_Node.Node.md#execute)

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

[Node](elements_Node.Node.md).[getBehaviour](elements_Node.Node.md#getbehaviour)

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

[Node](elements_Node.Node.md).[getInput](elements_Node.Node.md#getinput)

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

[Node](elements_Node.Node.md).[getOutbounds](elements_Node.Node.md#getoutbounds)

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

[Node](elements_Node.Node.md).[getOutput](elements_Node.Node.md#getoutput)

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

[Node](elements_Node.Node.md).[hasBehaviour](elements_Node.Node.md#hasbehaviour)

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

[Node](elements_Node.Node.md).[init](elements_Node.Node.md#init)

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

[Node](elements_Node.Node.md).[restored](elements_Node.Node.md#restored)

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

[Node](elements_Node.Node.md).[resume](elements_Node.Node.md#resume)

#### Defined in

[src/elements/Node.ts:307](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L307)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Overrides

[Node](elements_Node.Node.md).[run](elements_Node.Node.md#run)

#### Defined in

[src/elements/Tasks.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Tasks.ts#L46)

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

[Node](elements_Node.Node.md).[setInput](elements_Node.Node.md#setinput)

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

[Node](elements_Node.Node.md).[start](elements_Node.Node.md#start)

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

#### Inherited from

[Node](elements_Node.Node.md).[startBoundaryEvents](elements_Node.Node.md#startboundaryevents)

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

[Node](elements_Node.Node.md).[validate](elements_Node.Node.md#validate)

#### Defined in

[src/elements/Node.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/elements/Node.ts#L44)