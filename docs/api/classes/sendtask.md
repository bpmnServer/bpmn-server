[bpmn-server](../README.md) / SendTask

# Class: SendTask

foo[method]();
     
     await this.token.appDelegate[serviceName](data);
     
     
     service signature:
             output= service (input,context)

## Hierarchy

- [`ServiceTask`](ServiceTask.md)

  ↳ **`SendTask`**

## Table of contents

### Constructors

- [constructor](SendTask.md#constructor)

### Properties

- [assignee](SendTask.md#assignee)
- [attachedTo](SendTask.md#attachedto)
- [attachments](SendTask.md#attachments)
- [behaviours](SendTask.md#behaviours)
- [candidateGroups](SendTask.md#candidategroups)
- [candidateUsers](SendTask.md#candidateusers)
- [def](SendTask.md#def)
- [id](SendTask.md#id)
- [inbounds](SendTask.md#inbounds)
- [initiator](SendTask.md#initiator)
- [isFlow](SendTask.md#isflow)
- [lane](SendTask.md#lane)
- [messageId](SendTask.md#messageid)
- [name](SendTask.md#name)
- [outbounds](SendTask.md#outbounds)
- [process](SendTask.md#process)
- [scripts](SendTask.md#scripts)
- [signalId](SendTask.md#signalid)
- [subType](SendTask.md#subtype)
- [type](SendTask.md#type)

### Accessors

- [canBeInvoked](SendTask.md#canbeinvoked)
- [isCatching](SendTask.md#iscatching)
- [processId](SendTask.md#processid)
- [requiresWait](SendTask.md#requireswait)
- [serviceName](SendTask.md#servicename)

### Methods

- [addBehaviour](SendTask.md#addbehaviour)
- [cancelBoundaryEvents](SendTask.md#cancelboundaryevents)
- [cancelEBG](SendTask.md#cancelebg)
- [continue](SendTask.md#continue)
- [describe](SendTask.md#describe)
- [doEvent](SendTask.md#doevent)
- [end](SendTask.md#end)
- [enter](SendTask.md#enter)
- [execute](SendTask.md#execute)
- [getBehaviour](SendTask.md#getbehaviour)
- [getInput](SendTask.md#getinput)
- [getOutbounds](SendTask.md#getoutbounds)
- [getOutput](SendTask.md#getoutput)
- [hasBehaviour](SendTask.md#hasbehaviour)
- [init](SendTask.md#init)
- [restored](SendTask.md#restored)
- [resume](SendTask.md#resume)
- [run](SendTask.md#run)
- [setInput](SendTask.md#setinput)
- [start](SendTask.md#start)
- [startBoundaryEvents](SendTask.md#startboundaryevents)
- [validate](SendTask.md#validate)

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

[elements/Node.ts:31](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-31)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[assignee](ServiceTask.md#assignee)

#### Defined in

[elements/Node.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-22)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[ServiceTask](ServiceTask.md).[attachedTo](ServiceTask.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-18)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[attachments](ServiceTask.md#attachments)

#### Defined in

[elements/Node.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[behaviours](ServiceTask.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-17)

___

### candidateGroups

• **candidateGroups**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[candidateGroups](ServiceTask.md#candidategroups)

#### Defined in

[elements/Node.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-23)

___

### candidateUsers

• **candidateUsers**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[candidateUsers](ServiceTask.md#candidateusers)

#### Defined in

[elements/Node.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-24)

___

### def

• **def**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[def](ServiceTask.md#def)

#### Defined in

[elements/Node.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-14)

___

### id

• **id**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[id](ServiceTask.md#id)

#### Defined in

[elements/Element.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-13)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[inbounds](ServiceTask.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[initiator](ServiceTask.md#initiator)

#### Defined in

[elements/Node.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[ServiceTask](ServiceTask.md).[isFlow](ServiceTask.md#isflow)

#### Defined in

[elements/Element.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-18)

___

### lane

• **lane**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[lane](ServiceTask.md#lane)

#### Defined in

[elements/Element.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[messageId](ServiceTask.md#messageid)

#### Defined in

[elements/Node.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-19)

___

### name

• **name**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[name](ServiceTask.md#name)

#### Defined in

[elements/Node.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-12)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[outbounds](ServiceTask.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-15)

___

### process

• **process**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[process](ServiceTask.md#process)

#### Defined in

[elements/Node.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[scripts](ServiceTask.md#scripts)

#### Defined in

[elements/Node.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-25)

___

### signalId

• **signalId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[signalId](ServiceTask.md#signalid)

#### Defined in

[elements/Node.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-20)

___

### subType

• **subType**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[subType](ServiceTask.md#subtype)

#### Defined in

[elements/Element.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-15)

___

### type

• **type**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[type](ServiceTask.md#type)

#### Defined in

[elements/Element.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.canBeInvoked

#### Defined in

[elements/Node.ts:127](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-127)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Overrides

ServiceTask.isCatching

#### Defined in

[elements/Tasks.ts:134](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-134)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.processId

#### Defined in

[elements/Node.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-26)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.requiresWait

#### Defined in

[elements/Node.ts:122](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-122)

___

### serviceName

• `get` **serviceName**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.serviceName

#### Defined in

[elements/Tasks.ts:37](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-37)

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

[ServiceTask](ServiceTask.md).[addBehaviour](ServiceTask.md#addbehaviour)

#### Defined in

[elements/Element.ts:41](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-41)

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

[ServiceTask](ServiceTask.md).[cancelEBG](ServiceTask.md#cancelebg)

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

[ServiceTask](ServiceTask.md).[continue](ServiceTask.md#continue)

#### Defined in

[elements/Node.ts:212](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-212)

___

### describe

▸ **describe**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[ServiceTask](ServiceTask.md).[describe](ServiceTask.md#describe)

#### Defined in

[elements/Tasks.ts:93](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-93)

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

[ServiceTask](ServiceTask.md).[doEvent](ServiceTask.md#doevent)

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

[ServiceTask](ServiceTask.md).[end](ServiceTask.md#end)

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

[ServiceTask](ServiceTask.md).[enter](ServiceTask.md#enter)

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

[ServiceTask](ServiceTask.md).[execute](ServiceTask.md#execute)

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

[ServiceTask](ServiceTask.md).[getBehaviour](ServiceTask.md#getbehaviour)

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

[ServiceTask](ServiceTask.md).[getInput](ServiceTask.md#getinput)

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

[ServiceTask](ServiceTask.md).[getOutbounds](ServiceTask.md#getoutbounds)

#### Defined in

[elements/Node.ts:315](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-315)

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

[elements/Node.ts:109](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-109)

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

[ServiceTask](ServiceTask.md).[init](ServiceTask.md#init)

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

#### Inherited from

[ServiceTask](ServiceTask.md).[restored](ServiceTask.md#restored)

#### Defined in

[elements/Element.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Element.ts#lines-24)

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

[elements/Node.ts:307](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-307)

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

[elements/Tasks.ts:46](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Tasks.ts#lines-46)

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

[ServiceTask](ServiceTask.md).[start](ServiceTask.md#start)

#### Defined in

[elements/Node.ts:217](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-217)

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

[ServiceTask](ServiceTask.md).[validate](ServiceTask.md#validate)

#### Defined in

[elements/Node.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/elements/Node.ts#lines-44)
