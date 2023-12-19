[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/elements](../modules/interfaces_elements.md) / INode

# Interface: INode

[interfaces/elements](../modules/interfaces_elements.md).INode

## Hierarchy

- [`IElement`](interfaces_elements.IElement.md)

  ↳ **`INode`**

## Table of contents

### Properties

- [behaviours](interfaces_elements.INode.md#behaviours)
- [def](interfaces_elements.INode.md#def)
- [id](interfaces_elements.INode.md#id)
- [inbounds](interfaces_elements.INode.md#inbounds)
- [lane](interfaces_elements.INode.md#lane)
- [name](interfaces_elements.INode.md#name)
- [outbounds](interfaces_elements.INode.md#outbounds)
- [processId](interfaces_elements.INode.md#processid)
- [type](interfaces_elements.INode.md#type)

### Methods

- [addBehaviour](interfaces_elements.INode.md#addbehaviour)
- [canBeInvoked](interfaces_elements.INode.md#canbeinvoked)
- [continue](interfaces_elements.INode.md#continue)
- [describe](interfaces_elements.INode.md#describe)
- [doEvent](interfaces_elements.INode.md#doevent)
- [end](interfaces_elements.INode.md#end)
- [enter](interfaces_elements.INode.md#enter)
- [execute](interfaces_elements.INode.md#execute)
- [getBehaviour](interfaces_elements.INode.md#getbehaviour)
- [getOutbounds](interfaces_elements.INode.md#getoutbounds)
- [hasBehaviour](interfaces_elements.INode.md#hasbehaviour)
- [init](interfaces_elements.INode.md#init)
- [requiresWait](interfaces_elements.INode.md#requireswait)
- [restored](interfaces_elements.INode.md#restored)
- [resume](interfaces_elements.INode.md#resume)
- [run](interfaces_elements.INode.md#run)
- [start](interfaces_elements.INode.md#start)

## Properties

### behaviours

• **behaviours**: `Map`\<`any`, `any`\>

#### Inherited from

[IElement](interfaces_elements.IElement.md).[behaviours](interfaces_elements.IElement.md#behaviours)

#### Defined in

[src/interfaces/elements.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L25)

___

### def

• **def**: `any`

#### Defined in

[src/interfaces/elements.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L44)

___

### id

• **id**: `any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[id](interfaces_elements.IElement.md#id)

#### Defined in

[src/interfaces/elements.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L21)

___

### inbounds

• **inbounds**: `any`[]

#### Defined in

[src/interfaces/elements.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L46)

___

### lane

• **lane**: `any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[lane](interfaces_elements.IElement.md#lane)

#### Defined in

[src/interfaces/elements.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L24)

___

### name

• **name**: `any`

#### Overrides

[IElement](interfaces_elements.IElement.md).[name](interfaces_elements.IElement.md#name)

#### Defined in

[src/interfaces/elements.ts:42](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L42)

___

### outbounds

• **outbounds**: `any`[]

#### Defined in

[src/interfaces/elements.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L45)

___

### processId

• **processId**: `any`

#### Defined in

[src/interfaces/elements.ts:43](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L43)

___

### type

• **type**: `any`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[type](interfaces_elements.IElement.md#type)

#### Defined in

[src/interfaces/elements.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L22)

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

[IElement](interfaces_elements.IElement.md).[addBehaviour](interfaces_elements.IElement.md#addbehaviour)

#### Defined in

[src/interfaces/elements.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L36)

___

### canBeInvoked

▸ **canBeInvoked**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/interfaces/elements.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L50)

___

### continue

▸ **continue**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[IElement](interfaces_elements.IElement.md).[continue](interfaces_elements.IElement.md#continue)

#### Defined in

[src/interfaces/elements.ts:61](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L61)

___

### describe

▸ **describe**(): `string`[][]

#### Returns

`string`[][]

#### Inherited from

[IElement](interfaces_elements.IElement.md).[describe](interfaces_elements.IElement.md#describe)

#### Defined in

[src/interfaces/elements.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L27)

___

### doEvent

▸ **doEvent**(`item`, `event`, `newStatus`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |
| `event` | [`EXECUTION_EVENT`](../enums/interfaces_Enums.EXECUTION_EVENT.md) |
| `newStatus` | [`ITEM_STATUS`](../enums/interfaces_Enums.ITEM_STATUS.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/interfaces/elements.ts:47](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L47)

___

### end

▸ **end**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/interfaces/elements.ts:64](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L64)

___

### enter

▸ **enter**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Defined in

[src/interfaces/elements.ts:48](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L48)

___

### execute

▸ **execute**(`item`): `Promise`\<`void` \| [`wait`](../enums/interfaces_Enums.NODE_ACTION.md#wait) \| [`error`](../enums/interfaces_Enums.NODE_ACTION.md#error) \| [`abort`](../enums/interfaces_Enums.NODE_ACTION.md#abort)\>

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`Promise`\<`void` \| [`wait`](../enums/interfaces_Enums.NODE_ACTION.md#wait) \| [`error`](../enums/interfaces_Enums.NODE_ACTION.md#error) \| [`abort`](../enums/interfaces_Enums.NODE_ACTION.md#abort)\>

#### Defined in

[src/interfaces/elements.ts:60](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L60)

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

[IElement](interfaces_elements.IElement.md).[getBehaviour](interfaces_elements.IElement.md#getbehaviour)

#### Defined in

[src/interfaces/elements.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L35)

___

### getOutbounds

▸ **getOutbounds**(`item`): [`IItem`](interfaces_engine.IItem.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

[`IItem`](interfaces_engine.IItem.md)[]

#### Defined in

[src/interfaces/elements.ts:72](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L72)

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

[IElement](interfaces_elements.IElement.md).[hasBehaviour](interfaces_elements.IElement.md#hasbehaviour)

#### Defined in

[src/interfaces/elements.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L34)

___

### init

▸ **init**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Defined in

[src/interfaces/elements.ts:71](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L71)

___

### requiresWait

▸ **requiresWait**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/interfaces/elements.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L49)

___

### restored

▸ **restored**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Inherited from

[IElement](interfaces_elements.IElement.md).[restored](interfaces_elements.IElement.md#restored)

#### Defined in

[src/interfaces/elements.ts:28](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L28)

___

### resume

▸ **resume**(`item`): `void`

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Overrides

[IElement](interfaces_elements.IElement.md).[resume](interfaces_elements.IElement.md#resume)

#### Defined in

[src/interfaces/elements.ts:70](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L70)

___

### run

▸ **run**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Defined in

[src/interfaces/elements.ts:63](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L63)

___

### start

▸ **start**(`item`): `Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`Promise`\<[`NODE_ACTION`](../enums/interfaces_Enums.NODE_ACTION.md)\>

#### Defined in

[src/interfaces/elements.ts:62](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/elements.ts#L62)
