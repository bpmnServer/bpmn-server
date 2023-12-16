[bpmn-server](../README.md) / BusinessRuleTask

# Class: BusinessRuleTask

foo[method]();
     
     await this.token.appDelegate[serviceName](data);
     
     
     service signature:
             output= service (input,context)

## Hierarchy

- [`ServiceTask`](ServiceTask.md)

  ↳ **`BusinessRuleTask`**

## Table of contents

### Constructors

- [constructor](BusinessRuleTask.md#constructor)

### Properties

- [assignee](BusinessRuleTask.md#assignee)
- [attachedTo](BusinessRuleTask.md#attachedto)
- [attachments](BusinessRuleTask.md#attachments)
- [behaviours](BusinessRuleTask.md#behaviours)
- [def](BusinessRuleTask.md#def)
- [id](BusinessRuleTask.md#id)
- [inbounds](BusinessRuleTask.md#inbounds)
- [initiator](BusinessRuleTask.md#initiator)
- [isFlow](BusinessRuleTask.md#isflow)
- [lane](BusinessRuleTask.md#lane)
- [messageId](BusinessRuleTask.md#messageid)
- [name](BusinessRuleTask.md#name)
- [outbounds](BusinessRuleTask.md#outbounds)
- [process](BusinessRuleTask.md#process)
- [scripts](BusinessRuleTask.md#scripts)
- [signalId](BusinessRuleTask.md#signalid)
- [subType](BusinessRuleTask.md#subtype)
- [type](BusinessRuleTask.md#type)

### Accessors

- [canBeInvoked](BusinessRuleTask.md#canbeinvoked)
- [isCatching](BusinessRuleTask.md#iscatching)
- [processId](BusinessRuleTask.md#processid)
- [requiresWait](BusinessRuleTask.md#requireswait)
- [serviceName](BusinessRuleTask.md#servicename)

### Methods

- [addBehaviour](BusinessRuleTask.md#addbehaviour)
- [cancelBoundaryEvents](BusinessRuleTask.md#cancelboundaryevents)
- [cancelEBG](BusinessRuleTask.md#cancelebg)
- [continue](BusinessRuleTask.md#continue)
- [describe](BusinessRuleTask.md#describe)
- [doEvent](BusinessRuleTask.md#doevent)
- [end](BusinessRuleTask.md#end)
- [enter](BusinessRuleTask.md#enter)
- [execute](BusinessRuleTask.md#execute)
- [getBehaviour](BusinessRuleTask.md#getbehaviour)
- [getInput](BusinessRuleTask.md#getinput)
- [getOutbounds](BusinessRuleTask.md#getoutbounds)
- [getOutput](BusinessRuleTask.md#getoutput)
- [hasBehaviour](BusinessRuleTask.md#hasbehaviour)
- [init](BusinessRuleTask.md#init)
- [restored](BusinessRuleTask.md#restored)
- [resume](BusinessRuleTask.md#resume)
- [run](BusinessRuleTask.md#run)
- [setInput](BusinessRuleTask.md#setinput)
- [start](BusinessRuleTask.md#start)
- [startBoundaryEvents](BusinessRuleTask.md#startboundaryevents)
- [validate](BusinessRuleTask.md#validate)

## Constructors

### constructor

• **new BusinessRuleTask**(`id`, `process`, `type`, `def`): [`BusinessRuleTask`](BusinessRuleTask.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`BusinessRuleTask`](BusinessRuleTask.md)

#### Inherited from

[ServiceTask](ServiceTask.md).[constructor](ServiceTask.md#constructor)

#### Defined in

[elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L29)

## Properties

### assignee

• **assignee**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[assignee](ServiceTask.md#assignee)

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Inherited from

[ServiceTask](ServiceTask.md).[attachedTo](ServiceTask.md#attachedto)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[attachments](ServiceTask.md#attachments)

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[behaviours](ServiceTask.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L17)

___

### def

• **def**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[def](ServiceTask.md#def)

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[id](ServiceTask.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[inbounds](ServiceTask.md#inbounds)

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[initiator](ServiceTask.md#initiator)

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[ServiceTask](ServiceTask.md).[isFlow](ServiceTask.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[lane](ServiceTask.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[messageId](ServiceTask.md#messageid)

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[name](ServiceTask.md#name)

#### Defined in

[elements/Node.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Inherited from

[ServiceTask](ServiceTask.md).[outbounds](ServiceTask.md#outbounds)

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[process](ServiceTask.md#process)

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Inherited from

[ServiceTask](ServiceTask.md).[scripts](ServiceTask.md#scripts)

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L23)

___

### signalId

• **signalId**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[signalId](ServiceTask.md#signalid)

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[subType](ServiceTask.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[ServiceTask](ServiceTask.md).[type](ServiceTask.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.canBeInvoked

#### Defined in

[elements/Node.ts:123](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L123)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.isCatching

#### Defined in

[elements/Node.ts:125](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L125)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.processId

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L24)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Inherited from

ServiceTask.requiresWait

#### Defined in

[elements/Node.ts:118](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L118)

___

### serviceName

• `get` **serviceName**(): `any`

#### Returns

`any`

#### Inherited from

ServiceTask.serviceName

#### Defined in

[elements/Tasks.ts:41](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L41)

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

[elements/Element.ts:39](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L39)

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

[elements/Node.ts:235](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L235)

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

[elements/Node.ts:227](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L227)

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

[elements/Node.ts:208](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L208)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[ServiceTask](ServiceTask.md).[describe](ServiceTask.md#describe)

#### Defined in

[elements/Tasks.ts:95](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L95)

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

[elements/Node.ts:53](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L53)

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

[elements/Node.ts:268](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L268)

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

[elements/Node.ts:109](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L109)

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

[elements/Node.ts:135](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L135)

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

[elements/Element.ts:36](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L36)

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

[elements/Node.ts:91](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L91)

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

[elements/Node.ts:311](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L311)

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

[elements/Node.ts:105](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L105)

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

[elements/Element.ts:32](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L32)

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

[elements/Node.ts:306](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L306)

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

[elements/Element.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L22)

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

[elements/Node.ts:303](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L303)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Overrides

[ServiceTask](ServiceTask.md).[run](ServiceTask.md#run)

#### Defined in

[elements/Tasks.ts:104](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Tasks.ts#L104)

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

[elements/Node.ts:81](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L81)

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

[elements/Node.ts:213](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L213)

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

[elements/Node.ts:330](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L330)

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

[elements/Node.ts:42](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L42)
