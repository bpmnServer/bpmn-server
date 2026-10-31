[bpmn-server](../readme.md) / SendTask

# Class: SendTask

```ts
     foo[method]();
     
     await this.token.appDelegate[serviceName](data);
     
     
     service signature:
             output= service (input,context)
```

## Hierarchy

- [`ServiceTask`](ServiceTask.md)

  ↳ **`SendTask`**

## Table of contents

### Constructors

- [constructor](SendTask.md#constructor)

### Properties

- [id](SendTask.md#id)
- [type](SendTask.md#type)
- [subType](SendTask.md#subtype)
- [behaviours](SendTask.md#behaviours)
- [isFlow](SendTask.md#isflow)
- [lane](SendTask.md#lane)
- [name](SendTask.md#name)
- [process](SendTask.md#process)
- [def](SendTask.md#def)
- [outbounds](SendTask.md#outbounds)
- [inbounds](SendTask.md#inbounds)
- [attachments](SendTask.md#attachments)
- [attachedTo](SendTask.md#attachedto)
- [messageId](SendTask.md#messageid)
- [signalId](SendTask.md#signalid)
- [initiator](SendTask.md#initiator)
- [assignee](SendTask.md#assignee)
- [candidateGroups](SendTask.md#candidategroups)
- [candidateUsers](SendTask.md#candidateusers)
- [scripts](SendTask.md#scripts)

### Accessors

- [processId](SendTask.md#processid)
- [requiresWait](SendTask.md#requireswait)
- [canBeInvoked](SendTask.md#canbeinvoked)
- [loopDefinition](SendTask.md#loopdefinition)
- [serviceName](SendTask.md#servicename)
- [isCatching](SendTask.md#iscatching)

### Methods

- [restored](SendTask.md#restored)
- [hasBehaviour](SendTask.md#hasbehaviour)
- [getBehaviour](SendTask.md#getbehaviour)
- [addBehaviour](SendTask.md#addbehaviour)
- [validate](SendTask.md#validate)
- [doEvent](SendTask.md#doevent)
- [setInput](SendTask.md#setinput)
- [getInput](SendTask.md#getinput)
- [getOutput](SendTask.md#getoutput)
- [enter](SendTask.md#enter)
- [execute](SendTask.md#execute)
- [continue](SendTask.md#continue)
- [start](SendTask.md#start)
- [cancelEBG](SendTask.md#cancelebg)
- [cancelBoundaryEvents](SendTask.md#cancelboundaryevents)
- [end](SendTask.md#end)
- [resume](SendTask.md#resume)
- [init](SendTask.md#init)
- [getOutbounds](SendTask.md#getoutbounds)
- [startBoundaryEvents](SendTask.md#startboundaryevents)
- [run](SendTask.md#run)
- [describe](SendTask.md#describe)

## Constructors

### constructor

• **new SendTask**(`id`, `process`, `type`, `def`): [`SendTask`](SendTask.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`SendTask`](SendTask.md)

#### Inherited from

[ServiceTask](ServiceTask.md).[constructor](ServiceTask.md#constructor)

#### Defined in

[elements/Node.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L32)

## Properties

### id

• **id**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[id](ServiceTask.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L13)

___

### type

• **type**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[type](ServiceTask.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L14)

___

### subType

• **subType**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[subType](ServiceTask.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L15)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[behaviours](ServiceTask.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L17)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[ServiceTask](ServiceTask.md).[isFlow](ServiceTask.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[lane](ServiceTask.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[name](ServiceTask.md#name)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L13)

___

### process

• **process**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[process](ServiceTask.md#process)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L14)

___

### def

• **def**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[def](ServiceTask.md#def)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L15)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[outbounds](ServiceTask.md#outbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L16)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[inbounds](ServiceTask.md#inbounds)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L17)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[attachments](ServiceTask.md#attachments)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L18)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[ServiceTask](ServiceTask.md).[attachedTo](ServiceTask.md#attachedto)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[messageId](ServiceTask.md#messageid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L20)

___

### signalId

• **signalId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[signalId](ServiceTask.md#signalid)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L21)

___

### initiator

• **initiator**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[initiator](ServiceTask.md#initiator)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L22)

___

### assignee

• **assignee**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[assignee](ServiceTask.md#assignee)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L23)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[candidateGroups](ServiceTask.md#candidategroups)

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L24)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[candidateUsers](ServiceTask.md#candidateusers)

#### Defined in

[elements/Node.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L25)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[scripts](ServiceTask.md#scripts)

#### Defined in

[elements/Node.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L26)

## Accessors

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.processId

#### Defined in

[elements/Node.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L27)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.requiresWait

#### Defined in

[elements/Node.ts:131](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L131)

___

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.canBeInvoked

#### Defined in

[elements/Node.ts:136](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L136)

___

### loopDefinition

• `get` **loopDefinition**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.loopDefinition

#### Defined in

[elements/Node.ts:138](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L138)

___

### serviceName

• `get` **serviceName**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.serviceName

#### Defined in

[elements/Tasks.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L44)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Overrides

ServiceTask.isCatching

#### Defined in

[elements/Tasks.ts:149](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L149)

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

[ServiceTask](ServiceTask.md).[restored](ServiceTask.md#restored)

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

[ServiceTask](ServiceTask.md).[hasBehaviour](ServiceTask.md#hasbehaviour)

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

[ServiceTask](ServiceTask.md).[getBehaviour](ServiceTask.md#getbehaviour)

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

[ServiceTask](ServiceTask.md).[addBehaviour](ServiceTask.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Element.ts#L41)

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

[ServiceTask](ServiceTask.md).[validate](ServiceTask.md#validate)

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

[ServiceTask](ServiceTask.md).[doEvent](ServiceTask.md#doevent)

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

[ServiceTask](ServiceTask.md).[setInput](ServiceTask.md#setinput)

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

[ServiceTask](ServiceTask.md).[getInput](ServiceTask.md#getinput)

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

[ServiceTask](ServiceTask.md).[getOutput](ServiceTask.md#getoutput)

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

[ServiceTask](ServiceTask.md).[enter](ServiceTask.md#enter)

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

[ServiceTask](ServiceTask.md).[execute](ServiceTask.md#execute)

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

[ServiceTask](ServiceTask.md).[continue](ServiceTask.md#continue)

#### Defined in

[elements/Node.ts:232](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L232)

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

[ServiceTask](ServiceTask.md).[start](ServiceTask.md#start)

#### Defined in

[elements/Node.ts:237](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L237)

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

[ServiceTask](ServiceTask.md).[cancelEBG](ServiceTask.md#cancelebg)

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

[ServiceTask](ServiceTask.md).[cancelBoundaryEvents](ServiceTask.md#cancelboundaryevents)

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

[ServiceTask](ServiceTask.md).[end](ServiceTask.md#end)

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

[ServiceTask](ServiceTask.md).[resume](ServiceTask.md#resume)

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

[ServiceTask](ServiceTask.md).[init](ServiceTask.md#init)

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

[ServiceTask](ServiceTask.md).[getOutbounds](ServiceTask.md#getoutbounds)

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

[ServiceTask](ServiceTask.md).[startBoundaryEvents](ServiceTask.md#startboundaryevents)

#### Defined in

[elements/Node.ts:363](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Node.ts#L363)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Inherited from

[ServiceTask](ServiceTask.md).[run](ServiceTask.md#run)

#### Defined in

[elements/Tasks.ts:53](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L53)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[ServiceTask](ServiceTask.md).[describe](ServiceTask.md#describe)

#### Defined in

[elements/Tasks.ts:108](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/Tasks.ts#L108)
