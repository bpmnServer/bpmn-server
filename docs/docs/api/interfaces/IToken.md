[bpmn-server](../readme.md) / IToken

# Interface: IToken

## Implemented by

- [`Token`](../classes/Token.md)

## Table of contents

### Properties

- [id](IToken.md#id)
- [type](IToken.md#type)
- [execution](IToken.md#execution)
- [dataPath](IToken.md#datapath)
- [startNodeId](IToken.md#startnodeid)
- [parentToken](IToken.md#parenttoken)
- [originItem](IToken.md#originitem)
- [path](IToken.md#path)
- [loop](IToken.md#loop)
- [currentNode](IToken.md#currentnode)
- [processId](IToken.md#processid)
- [status](IToken.md#status)
- [data](IToken.md#data)
- [currentItem](IToken.md#currentitem)
- [lastItem](IToken.md#lastitem)
- [firstItem](IToken.md#firstitem)
- [childrenTokens](IToken.md#childrentokens)

### Methods

- [save](IToken.md#save)
- [resume](IToken.md#resume)
- [stop](IToken.md#stop)
- [processError](IToken.md#processerror)
- [processEscalation](IToken.md#processescalation)
- [processCancel](IToken.md#processcancel)
- [restored](IToken.md#restored)
- [getChildrenTokens](IToken.md#getchildrentokens)
- [preExecute](IToken.md#preexecute)
- [preNext](IToken.md#prenext)
- [execute](IToken.md#execute)
- [appendData](IToken.md#appenddata)
- [terminate](IToken.md#terminate)
- [signal](IToken.md#signal)
- [getFullPath](IToken.md#getfullpath)
- [end](IToken.md#end)
- [goNext](IToken.md#gonext)
- [getSubProcessToken](IToken.md#getsubprocesstoken)
- [log](IToken.md#log)
- [info](IToken.md#info)
- [error](IToken.md#error)

## Properties

### id

• **id**: `any`

#### Defined in

[interfaces/engine.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L10)

___

### type

• **type**: `any`

#### Defined in

[interfaces/engine.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L11)

___

### execution

• **execution**: [`IExecution`](IExecution.md)

#### Defined in

[interfaces/engine.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L12)

___

### dataPath

• **dataPath**: `string`

#### Defined in

[interfaces/engine.ts:13](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L13)

___

### startNodeId

• **startNodeId**: `any`

#### Defined in

[interfaces/engine.ts:14](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L14)

___

### parentToken

• `Optional` **parentToken**: [`IToken`](IToken.md)

#### Defined in

[interfaces/engine.ts:15](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L15)

___

### originItem

• **originItem**: [`IItem`](IItem.md)

#### Defined in

[interfaces/engine.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L17)

___

### path

• **path**: [`IItem`](IItem.md)[]

#### Defined in

[interfaces/engine.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L18)

___

### loop

• **loop**: `any`

#### Defined in

[interfaces/engine.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L19)

___

### currentNode

• **currentNode**: `any`

#### Defined in

[interfaces/engine.ts:20](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L20)

___

### processId

• **processId**: `any`

#### Defined in

[interfaces/engine.ts:21](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L21)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md)

#### Defined in

[interfaces/engine.ts:22](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L22)

___

### data

• **data**: `any`

#### Defined in

[interfaces/engine.ts:23](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L23)

___

### currentItem

• **currentItem**: [`IItem`](IItem.md)

#### Defined in

[interfaces/engine.ts:24](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L24)

___

### lastItem

• **lastItem**: [`IItem`](IItem.md)

#### Defined in

[interfaces/engine.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L25)

___

### firstItem

• **firstItem**: [`Item`](../classes/Item.md)

#### Defined in

[interfaces/engine.ts:26](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L26)

___

### childrenTokens

• **childrenTokens**: [`Token`](../classes/Token.md)[]

#### Defined in

[interfaces/engine.ts:27](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L27)

## Methods

### save

▸ **save**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `type` | `any` |
| `status` | [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md) |
| `dataPath` | `string` |
| `loopId` | `any` |
| `parentToken` | `any` |
| `originItem` | `any` |
| `startNodeId` | `any` |
| `currentNode` | `any` |

#### Defined in

[interfaces/engine.ts:29](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L29)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L40)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:41](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L41)

___

### processError

▸ **processError**(`errorCode`, `callingEvent`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | `any` |
| `callingEvent` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/engine.ts:43](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L43)

___

### processEscalation

▸ **processEscalation**(`escalationCode`, `callingEvent`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `escalationCode` | `any` |
| `callingEvent` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/engine.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L44)

___

### processCancel

▸ **processCancel**(`callingEvent`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callingEvent` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/engine.ts:45](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L45)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:48](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L48)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Defined in

[interfaces/engine.ts:49](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L49)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[interfaces/engine.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L50)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[interfaces/engine.ts:51](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L51)

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

[interfaces/engine.ts:55](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L55)

___

### appendData

▸ **appendData**(`inputData`, `item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |
| `item` | [`IItem`](IItem.md) |

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:56](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L56)

___

### terminate

▸ **terminate**(): `void`

is called by Gateways to cancel current token

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:61](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L61)

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

[interfaces/engine.ts:62](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L62)

___

### getFullPath

▸ **getFullPath**(`fullPath?`): [`Item`](../classes/Item.md)[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `fullPath?` | `any` |

#### Returns

[`Item`](../classes/Item.md)[]

#### Defined in

[interfaces/engine.ts:63](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L63)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L64)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:65](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L65)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`IToken`](IToken.md)

#### Returns

[`IToken`](IToken.md)

#### Defined in

[interfaces/engine.ts:66](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L66)

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

[interfaces/engine.ts:67](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L67)

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

[interfaces/engine.ts:68](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L68)

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

[interfaces/engine.ts:69](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/engine.ts#L69)
