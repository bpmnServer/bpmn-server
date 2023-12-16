[bpmn-server](../README.md) / Node

# Class: Node

## Hierarchy

- [`Element`](Element.md)

  ↳ **`Node`**

  ↳↳ [`UserTask`](UserTask.md)

  ↳↳ [`ScriptTask`](ScriptTask.md)

  ↳↳ [`ServiceTask`](ServiceTask.md)

  ↳↳ [`ReceiveTask`](ReceiveTask.md)

  ↳↳ [`SubProcess`](SubProcess.md)

  ↳↳ [`CallActivity`](CallActivity.md)

  ↳↳ [`Event`](Event.md)

  ↳↳ [`Gateway`](Gateway.md)

## Table of contents

### Constructors

- [constructor](Node.md#constructor)

### Properties

- [assignee](Node.md#assignee)
- [attachedTo](Node.md#attachedto)
- [attachments](Node.md#attachments)
- [behaviours](Node.md#behaviours)
- [def](Node.md#def)
- [id](Node.md#id)
- [inbounds](Node.md#inbounds)
- [initiator](Node.md#initiator)
- [isFlow](Node.md#isflow)
- [lane](Node.md#lane)
- [messageId](Node.md#messageid)
- [name](Node.md#name)
- [outbounds](Node.md#outbounds)
- [process](Node.md#process)
- [scripts](Node.md#scripts)
- [signalId](Node.md#signalid)
- [subType](Node.md#subtype)
- [type](Node.md#type)

### Accessors

- [canBeInvoked](Node.md#canbeinvoked)
- [isCatching](Node.md#iscatching)
- [processId](Node.md#processid)
- [requiresWait](Node.md#requireswait)

### Methods

- [addBehaviour](Node.md#addbehaviour)
- [cancelBoundaryEvents](Node.md#cancelboundaryevents)
- [cancelEBG](Node.md#cancelebg)
- [continue](Node.md#continue)
- [describe](Node.md#describe)
- [doEvent](Node.md#doevent)
- [end](Node.md#end)
- [enter](Node.md#enter)
- [execute](Node.md#execute)
- [getBehaviour](Node.md#getbehaviour)
- [getInput](Node.md#getinput)
- [getOutbounds](Node.md#getoutbounds)
- [getOutput](Node.md#getoutput)
- [hasBehaviour](Node.md#hasbehaviour)
- [init](Node.md#init)
- [restored](Node.md#restored)
- [resume](Node.md#resume)
- [run](Node.md#run)
- [setInput](Node.md#setinput)
- [start](Node.md#start)
- [startBoundaryEvents](Node.md#startboundaryevents)
- [validate](Node.md#validate)

## Constructors

### constructor

• **new Node**(`id`, `process`, `type`, `def`): [`Node`](Node.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `process` | `any` |
| `type` | `any` |
| `def` | `any` |

#### Returns

[`Node`](Node.md)

#### Overrides

[Element](Element.md).[constructor](Element.md#constructor)

#### Defined in

[elements/Node.ts:29](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L29)

## Properties

### assignee

• **assignee**: `any`

#### Defined in

[elements/Node.ts:22](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L22)

___

### attachedTo

• **attachedTo**: [`Node`](Node.md)

#### Defined in

[elements/Node.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L18)

___

### attachments

• **attachments**: [`Node`](Node.md)[]

#### Defined in

[elements/Node.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L17)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[Element](Element.md).[behaviours](Element.md#behaviours)

#### Defined in

[elements/Element.ts:17](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L17)

___

### def

• **def**: `any`

#### Defined in

[elements/Node.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L14)

___

### id

• **id**: `any`

#### Inherited from

[Element](Element.md).[id](Element.md#id)

#### Defined in

[elements/Element.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L13)

___

### inbounds

• **inbounds**: [`Flow`](Flow.md)[]

#### Defined in

[elements/Node.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L16)

___

### initiator

• **initiator**: `any`

#### Defined in

[elements/Node.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L21)

___

### isFlow

• **isFlow**: `boolean` = `false`

#### Inherited from

[Element](Element.md).[isFlow](Element.md#isflow)

#### Defined in

[elements/Element.ts:18](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L18)

___

### lane

• **lane**: `any`

#### Inherited from

[Element](Element.md).[lane](Element.md#lane)

#### Defined in

[elements/Element.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L19)

___

### messageId

• **messageId**: `any`

#### Defined in

[elements/Node.ts:19](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L19)

___

### name

• **name**: `any`

#### Overrides

[Element](Element.md).[name](Element.md#name)

#### Defined in

[elements/Node.ts:12](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L12)

___

### outbounds

• **outbounds**: [`Flow`](Flow.md)[]

#### Defined in

[elements/Node.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L15)

___

### process

• **process**: `any`

#### Defined in

[elements/Node.ts:13](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L13)

___

### scripts

• **scripts**: `Map`\<`any`, `any`\>

#### Defined in

[elements/Node.ts:23](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L23)

___

### signalId

• **signalId**: `any`

#### Defined in

[elements/Node.ts:20](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L20)

___

### subType

• **subType**: `any`

#### Inherited from

[Element](Element.md).[subType](Element.md#subtype)

#### Defined in

[elements/Element.ts:15](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L15)

___

### type

• **type**: `any`

#### Inherited from

[Element](Element.md).[type](Element.md#type)

#### Defined in

[elements/Element.ts:14](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L14)

## Accessors

### canBeInvoked

• `get` **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/Node.ts:123](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L123)

___

### isCatching

• `get` **isCatching**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/Node.ts:125](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L125)

___

### processId

• `get` **processId**(): `any`

#### Returns

`any`

#### Defined in

[elements/Node.ts:24](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L24)

___

### requiresWait

• `get` **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Defined in

[elements/Node.ts:118](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L118)

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

[Element](Element.md).[addBehaviour](Element.md#addbehaviour)

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

#### Overrides

[Element](Element.md).[continue](Element.md#continue)

#### Defined in

[elements/Node.ts:208](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L208)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[Element](Element.md).[describe](Element.md#describe)

#### Defined in

[elements/Element.ts:21](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Element.ts#L21)

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

[Element](Element.md).[getBehaviour](Element.md#getbehaviour)

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

[Element](Element.md).[hasBehaviour](Element.md#hasbehaviour)

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

[Element](Element.md).[restored](Element.md#restored)

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

#### Overrides

[Element](Element.md).[resume](Element.md#resume)

#### Defined in

[elements/Node.ts:303](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L303)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Defined in

[elements/Node.ts:223](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L223)

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

#### Defined in

[elements/Node.ts:42](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/Node.ts#L42)
