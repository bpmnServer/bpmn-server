[bpmn-server](../README.md) / IToken

# Interface: IToken

## Implemented by

- [`Token`](../classes/Token.md)

## Table of contents

### Properties

- [childrenTokens](IToken.md#childrentokens)
- [currentItem](IToken.md#currentitem)
- [currentNode](IToken.md#currentnode)
- [data](IToken.md#data)
- [dataPath](IToken.md#datapath)
- [execution](IToken.md#execution)
- [firstItem](IToken.md#firstitem)
- [id](IToken.md#id)
- [lastItem](IToken.md#lastitem)
- [loop](IToken.md#loop)
- [originItem](IToken.md#originitem)
- [parentToken](IToken.md#parenttoken)
- [path](IToken.md#path)
- [processId](IToken.md#processid)
- [startNodeId](IToken.md#startnodeid)
- [status](IToken.md#status)
- [type](IToken.md#type)

### Methods

- [appendData](IToken.md#appenddata)
- [end](IToken.md#end)
- [error](IToken.md#error)
- [execute](IToken.md#execute)
- [getChildrenTokens](IToken.md#getchildrentokens)
- [getFullPath](IToken.md#getfullpath)
- [getSubProcessToken](IToken.md#getsubprocesstoken)
- [goNext](IToken.md#gonext)
- [info](IToken.md#info)
- [log](IToken.md#log)
- [preExecute](IToken.md#preexecute)
- [preNext](IToken.md#prenext)
- [processError](IToken.md#processerror)
- [restored](IToken.md#restored)
- [resume](IToken.md#resume)
- [save](IToken.md#save)
- [signal](IToken.md#signal)
- [stop](IToken.md#stop)
- [terminate](IToken.md#terminate)

## Properties

### childrenTokens

• **childrenTokens**: [`Token`](../classes/Token.md)[]

#### Defined in

[interfaces/engine.ts:27](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-27)

___

### currentItem

• **currentItem**: [`IItem`](IItem.md)

#### Defined in

[interfaces/engine.ts:24](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-24)

___

### currentNode

• **currentNode**: `any`

#### Defined in

[interfaces/engine.ts:20](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-20)

___

### data

• **data**: `any`

#### Defined in

[interfaces/engine.ts:23](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-23)

___

### dataPath

• **dataPath**: `string`

#### Defined in

[interfaces/engine.ts:13](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-13)

___

### execution

• **execution**: [`IExecution`](IExecution.md)

#### Defined in

[interfaces/engine.ts:12](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-12)

___

### firstItem

• **firstItem**: [`Item`](../classes/Item.md)

#### Defined in

[interfaces/engine.ts:26](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-26)

___

### id

• **id**: `any`

#### Defined in

[interfaces/engine.ts:10](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-10)

___

### lastItem

• **lastItem**: [`IItem`](IItem.md)

#### Defined in

[interfaces/engine.ts:25](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-25)

___

### loop

• **loop**: `any`

#### Defined in

[interfaces/engine.ts:19](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-19)

___

### originItem

• **originItem**: [`IItem`](IItem.md)

#### Defined in

[interfaces/engine.ts:17](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-17)

___

### parentToken

• `Optional` **parentToken**: [`IToken`](IToken.md)

#### Defined in

[interfaces/engine.ts:15](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-15)

___

### path

• **path**: [`IItem`](IItem.md)[]

#### Defined in

[interfaces/engine.ts:18](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-18)

___

### processId

• **processId**: `any`

#### Defined in

[interfaces/engine.ts:21](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-21)

___

### startNodeId

• **startNodeId**: `any`

#### Defined in

[interfaces/engine.ts:14](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-14)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md)

#### Defined in

[interfaces/engine.ts:22](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-22)

___

### type

• **type**: `any`

#### Defined in

[interfaces/engine.ts:11](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-11)

## Methods

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

[interfaces/engine.ts:51](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-51)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:59](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-59)

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

[interfaces/engine.ts:64](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-64)

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

[interfaces/engine.ts:50](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-50)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Defined in

[interfaces/engine.ts:44](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-44)

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

[interfaces/engine.ts:58](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-58)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`IToken`](IToken.md)

#### Returns

[`IToken`](IToken.md)

#### Defined in

[interfaces/engine.ts:61](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-61)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[interfaces/engine.ts:60](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-60)

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

[interfaces/engine.ts:63](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-63)

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

[interfaces/engine.ts:62](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-62)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[interfaces/engine.ts:45](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-45)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[interfaces/engine.ts:46](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-46)

___

### processError

▸ **processError**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/engine.ts:42](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-42)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:43](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-43)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:40](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-40)

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
| `status` | [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md) |
| `type` | `any` |

#### Defined in

[interfaces/engine.ts:29](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-29)

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

[interfaces/engine.ts:57](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-57)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:41](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-41)

___

### terminate

▸ **terminate**(): `void`

is called by Gateways to cancel current token

#### Returns

`void`

#### Defined in

[interfaces/engine.ts:56](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/engine.ts#lines-56)
