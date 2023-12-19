[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/engine](../modules/interfaces_engine.md) / IToken

# Interface: IToken

[interfaces/engine](../modules/interfaces_engine.md).IToken

## Implemented by

- [`Token`](../classes/engine_Token.Token.md)

## Table of contents

### Properties

- [childrenTokens](interfaces_engine.IToken.md#childrentokens)
- [currentItem](interfaces_engine.IToken.md#currentitem)
- [currentNode](interfaces_engine.IToken.md#currentnode)
- [data](interfaces_engine.IToken.md#data)
- [dataPath](interfaces_engine.IToken.md#datapath)
- [execution](interfaces_engine.IToken.md#execution)
- [firstItem](interfaces_engine.IToken.md#firstitem)
- [id](interfaces_engine.IToken.md#id)
- [lastItem](interfaces_engine.IToken.md#lastitem)
- [loop](interfaces_engine.IToken.md#loop)
- [originItem](interfaces_engine.IToken.md#originitem)
- [parentToken](interfaces_engine.IToken.md#parenttoken)
- [path](interfaces_engine.IToken.md#path)
- [processId](interfaces_engine.IToken.md#processid)
- [startNodeId](interfaces_engine.IToken.md#startnodeid)
- [status](interfaces_engine.IToken.md#status)
- [type](interfaces_engine.IToken.md#type)

### Methods

- [appendData](interfaces_engine.IToken.md#appenddata)
- [end](interfaces_engine.IToken.md#end)
- [error](interfaces_engine.IToken.md#error)
- [execute](interfaces_engine.IToken.md#execute)
- [getChildrenTokens](interfaces_engine.IToken.md#getchildrentokens)
- [getFullPath](interfaces_engine.IToken.md#getfullpath)
- [getSubProcessToken](interfaces_engine.IToken.md#getsubprocesstoken)
- [goNext](interfaces_engine.IToken.md#gonext)
- [info](interfaces_engine.IToken.md#info)
- [log](interfaces_engine.IToken.md#log)
- [preExecute](interfaces_engine.IToken.md#preexecute)
- [preNext](interfaces_engine.IToken.md#prenext)
- [processError](interfaces_engine.IToken.md#processerror)
- [restored](interfaces_engine.IToken.md#restored)
- [resume](interfaces_engine.IToken.md#resume)
- [save](interfaces_engine.IToken.md#save)
- [signal](interfaces_engine.IToken.md#signal)
- [stop](interfaces_engine.IToken.md#stop)
- [terminate](interfaces_engine.IToken.md#terminate)

## Properties

### childrenTokens

• **childrenTokens**: [`Token`](../classes/engine_Token.Token.md)[]

#### Defined in

[src/interfaces/engine.ts:27](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L27)

___

### currentItem

• **currentItem**: [`IItem`](interfaces_engine.IItem.md)

#### Defined in

[src/interfaces/engine.ts:24](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L24)

___

### currentNode

• **currentNode**: `any`

#### Defined in

[src/interfaces/engine.ts:20](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L20)

___

### data

• **data**: `any`

#### Defined in

[src/interfaces/engine.ts:23](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L23)

___

### dataPath

• **dataPath**: `string`

#### Defined in

[src/interfaces/engine.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L13)

___

### execution

• **execution**: [`IExecution`](interfaces_engine.IExecution.md)

#### Defined in

[src/interfaces/engine.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L12)

___

### firstItem

• **firstItem**: [`Item`](../classes/engine_Item.Item.md)

#### Defined in

[src/interfaces/engine.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L26)

___

### id

• **id**: `any`

#### Defined in

[src/interfaces/engine.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L10)

___

### lastItem

• **lastItem**: [`IItem`](interfaces_engine.IItem.md)

#### Defined in

[src/interfaces/engine.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L25)

___

### loop

• **loop**: `any`

#### Defined in

[src/interfaces/engine.ts:19](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L19)

___

### originItem

• **originItem**: [`IItem`](interfaces_engine.IItem.md)

#### Defined in

[src/interfaces/engine.ts:17](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L17)

___

### parentToken

• `Optional` **parentToken**: [`IToken`](interfaces_engine.IToken.md)

#### Defined in

[src/interfaces/engine.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L15)

___

### path

• **path**: [`IItem`](interfaces_engine.IItem.md)[]

#### Defined in

[src/interfaces/engine.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L18)

___

### processId

• **processId**: `any`

#### Defined in

[src/interfaces/engine.ts:21](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L21)

___

### startNodeId

• **startNodeId**: `any`

#### Defined in

[src/interfaces/engine.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L14)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/interfaces_Enums.TOKEN_STATUS.md)

#### Defined in

[src/interfaces/engine.ts:22](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L22)

___

### type

• **type**: `any`

#### Defined in

[src/interfaces/engine.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L11)

## Methods

### appendData

▸ **appendData**(`inputData`, `item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |
| `item` | [`IItem`](interfaces_engine.IItem.md) |

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:51](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L51)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/interfaces/engine.ts:59](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L59)

___

### error

▸ **error**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:64](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L64)

___

### execute

▸ **execute**(`inputData`): `Promise`\<`any`\>

this is the primary exectuion method for a token

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/interfaces/engine.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L50)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Defined in

[src/interfaces/engine.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L44)

___

### getFullPath

▸ **getFullPath**(`fullPath?`): [`Item`](../classes/engine_Item.Item.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `fullPath?` | `any` |

#### Returns

[`Item`](../classes/engine_Item.Item.md)[]

#### Defined in

[src/interfaces/engine.ts:58](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L58)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`IToken`](interfaces_engine.IToken.md)

#### Returns

[`IToken`](interfaces_engine.IToken.md)

#### Defined in

[src/interfaces/engine.ts:61](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L61)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/interfaces/engine.ts:60](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L60)

___

### info

▸ **info**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any` |

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:63](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L63)

___

### log

▸ **log**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any` |

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:62](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L62)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/interfaces/engine.ts:45](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L45)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/interfaces/engine.ts:46](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L46)

___

### processError

▸ **processError**(): `any`

#### Returns

`any`

#### Defined in

[src/interfaces/engine.ts:42](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L42)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:43](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L43)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:40](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L40)

___

### save

▸ **save**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `currentNode` | `any` |
| `dataPath` | `string` |
| `id` | `any` |
| `loopId` | `any` |
| `originItem` | `any` |
| `parentToken` | `any` |
| `startNodeId` | `any` |
| `status` | [`TOKEN_STATUS`](../enums/interfaces_Enums.TOKEN_STATUS.md) |
| `type` | `any` |

#### Defined in

[src/interfaces/engine.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L29)

___

### signal

▸ **signal**(`data`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/interfaces/engine.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L57)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:41](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L41)

___

### terminate

▸ **terminate**(): `void`

is called by Gateways to cancel current token

#### Returns

`void`

#### Defined in

[src/interfaces/engine.ts:56](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/engine.ts#L56)
