[bpmn-server](../readme.md) / INode

# Interface: INode

## Hierarchy

- [`IElement`](IElement.md)

  ↳ **`INode`**

## Table of contents

### Properties

- [id](INode.md#id)
- [type](INode.md#type)
- [lane](INode.md#lane)
- [behaviours](INode.md#behaviours)
- [name](INode.md#name)
- [processId](INode.md#processid)
- [def](INode.md#def)
- [outbounds](INode.md#outbounds)
- [inbounds](INode.md#inbounds)

### Methods

- [describe](INode.md#describe)
- [restored](INode.md#restored)
- [hasBehaviour](INode.md#hasbehaviour)
- [getBehaviour](INode.md#getbehaviour)
- [addBehaviour](INode.md#addbehaviour)
- [doEvent](INode.md#doevent)
- [enter](INode.md#enter)
- [requiresWait](INode.md#requireswait)
- [canBeInvoked](INode.md#canbeinvoked)
- [execute](INode.md#execute)
- [continue](INode.md#continue)
- [start](INode.md#start)
- [run](INode.md#run)
- [end](INode.md#end)
- [resume](INode.md#resume)
- [init](INode.md#init)
- [getOutbounds](INode.md#getoutbounds)

## Properties

### id

• **id**: `any`

#### Inherited from

[IElement](IElement.md).[id](IElement.md#id)

#### Defined in

[interfaces/elements.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L21)

___

### type

• **type**: `any`

#### Inherited from

[IElement](IElement.md).[type](IElement.md#type)

#### Defined in

[interfaces/elements.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L22)

___

### lane

• **lane**: `any`

#### Inherited from

[IElement](IElement.md).[lane](IElement.md#lane)

#### Defined in

[interfaces/elements.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L24)

___

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[IElement](IElement.md).[behaviours](IElement.md#behaviours)

#### Defined in

[interfaces/elements.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L25)

___

### name

• **name**: `any`

#### Overrides

[IElement](IElement.md).[name](IElement.md#name)

#### Defined in

[interfaces/elements.ts:42](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L42)

___

### processId

• **processId**: `any`

#### Defined in

[interfaces/elements.ts:43](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L43)

___

### def

• **def**: `any`

#### Defined in

[interfaces/elements.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L44)

___

### outbounds

• **outbounds**: `any`[]

#### Defined in

[interfaces/elements.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L45)

___

### inbounds

• **inbounds**: `any`[]

#### Defined in

[interfaces/elements.ts:46](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L46)

## Methods

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[IElement](IElement.md).[describe](IElement.md#describe)

#### Defined in

[interfaces/elements.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L27)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](IElement.md).[restored](IElement.md#restored)

#### Defined in

[interfaces/elements.ts:28](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L28)

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

[IElement](IElement.md).[hasBehaviour](IElement.md#hasbehaviour)

#### Defined in

[interfaces/elements.ts:34](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L34)

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

[IElement](IElement.md).[getBehaviour](IElement.md#getbehaviour)

#### Defined in

[interfaces/elements.ts:35](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L35)

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

[IElement](IElement.md).[addBehaviour](IElement.md#addbehaviour)

#### Defined in

[interfaces/elements.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L36)

___

### doEvent

▸ **doEvent**(`item`, `event`, `newStatus`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |
| `event` | [`EXECUTION_EVENT`](../enums/EXECUTION_EVENT.md) |
| `newStatus` | [`ITEM_STATUS`](../enums/ITEM_STATUS.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/elements.ts:47](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L47)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Defined in

[interfaces/elements.ts:48](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L48)

___

### requiresWait

▸ **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Defined in

[interfaces/elements.ts:49](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L49)

___

### canBeInvoked

▸ **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Defined in

[interfaces/elements.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L50)

___

### execute

▸ **execute**(`item`): `Promise`\<`void` \| [`wait`](../enums/NODE_ACTION.md#wait) \| [`error`](../enums/NODE_ACTION.md#error) \| [`abort`](../enums/NODE_ACTION.md#abort)\>

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`Promise`\<`void` \| [`wait`](../enums/NODE_ACTION.md#wait) \| [`error`](../enums/NODE_ACTION.md#error) \| [`abort`](../enums/NODE_ACTION.md#abort)\>

#### Defined in

[interfaces/elements.ts:60](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L60)

___

### continue

▸ **continue**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[IElement](IElement.md).[continue](IElement.md#continue)

#### Defined in

[interfaces/elements.ts:61](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L61)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Defined in

[interfaces/elements.ts:62](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L62)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/NODE_ACTION.md)\>

#### Defined in

[interfaces/elements.ts:63](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L63)

___

### end

▸ **end**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/elements.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L64)

___

### resume

▸ **resume**(`item`): `void`

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Overrides

[IElement](IElement.md).[resume](IElement.md#resume)

#### Defined in

[interfaces/elements.ts:70](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L70)

___

### init

▸ **init**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Defined in

[interfaces/elements.ts:71](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L71)

___

### getOutbounds

▸ **getOutbounds**(`item`): [`IItem`](IItem.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](IItem.md) |

#### Returns

[`IItem`](IItem.md)[]

#### Defined in

[interfaces/elements.ts:72](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/elements.ts#L72)
