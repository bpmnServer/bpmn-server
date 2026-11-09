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
- [itemsKey](IToken.md#itemskey)

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

[packages/bpmn-server/src/interfaces/engine.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L23)

___

### type

• **type**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L24)

___

### execution

• **execution**: [`IExecution`](IExecution.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L25)

___

### dataPath

• **dataPath**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:26](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L26)

___

### startNodeId

• **startNodeId**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L27)

___

### parentToken

• `Optional` **parentToken**: [`IToken`](IToken.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:28](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L28)

___

### originItem

• **originItem**: [`IItem`](IItem.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:30](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L30)

___

### path

• **path**: [`IItem`](IItem.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:31](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L31)

___

### loop

• **loop**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L32)

___

### currentNode

• **currentNode**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:33](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L33)

___

### processId

• **processId**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L34)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L35)

___

### data

• **data**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:36](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L36)

___

### currentItem

• **currentItem**: [`IItem`](IItem.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L37)

___

### lastItem

• **lastItem**: [`IItem`](IItem.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:38](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L38)

___

### firstItem

• **firstItem**: [`Item`](../classes/Item.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L39)

___

### childrenTokens

• **childrenTokens**: [`Token`](../classes/Token.md)[]

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L40)

___

### itemsKey

• **itemsKey**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L41)

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

[packages/bpmn-server/src/interfaces/engine.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L43)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L54)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L55)

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

[packages/bpmn-server/src/interfaces/engine.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L57)

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

[packages/bpmn-server/src/interfaces/engine.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L58)

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

[packages/bpmn-server/src/interfaces/engine.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L59)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:62](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L62)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L63)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:64](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L64)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L65)

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

[packages/bpmn-server/src/interfaces/engine.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L69)

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

[packages/bpmn-server/src/interfaces/engine.ts:70](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L70)

___

### terminate

▸ **terminate**(): `void`

is called by Gateways to cancel current token

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:75](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L75)

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

[packages/bpmn-server/src/interfaces/engine.ts:76](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L76)

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

[packages/bpmn-server/src/interfaces/engine.ts:77](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L77)

___

### end

▸ **end**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:78](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L78)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L79)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`IToken`](IToken.md)

#### Returns

[`IToken`](IToken.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:80](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L80)

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

[packages/bpmn-server/src/interfaces/engine.ts:81](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L81)

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

[packages/bpmn-server/src/interfaces/engine.ts:82](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L82)

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

[packages/bpmn-server/src/interfaces/engine.ts:83](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L83)
