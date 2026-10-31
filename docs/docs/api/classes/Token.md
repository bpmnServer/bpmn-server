[bpmn-server](../readme.md) / Token

# Class: Token

## Implements

- [`IToken`](../interfaces/IToken.md)

## Table of contents

### Constructors

- [constructor](Token.md#constructor)

### Properties

- [id](Token.md#id)
- [type](Token.md#type)
- [execution](Token.md#execution)
- [dataPath](Token.md#datapath)
- [startNodeId](Token.md#startnodeid)
- [parentToken](Token.md#parenttoken)
- [originItem](Token.md#originitem)
- [path](Token.md#path)
- [loop](Token.md#loop)
- [currentNode](Token.md#currentnode)
- [processId](Token.md#processid)
- [status](Token.md#status)
- [input](Token.md#input)
- [output](Token.md#output)
- [messageMatchingKey](Token.md#messagematchingkey)
- [itemsKey](Token.md#itemskey)

### Accessors

- [data](Token.md#data)
- [currentItem](Token.md#currentitem)
- [firstItem](Token.md#firstitem)
- [lastItem](Token.md#lastitem)
- [childrenTokens](Token.md#childrentokens)

### Methods

- [hasNode](Token.md#hasnode)
- [getFullPath](Token.md#getfullpath)
- [startNewToken](Token.md#startnewtoken)
- [save](Token.md#save)
- [load](Token.md#load)
- [stop](Token.md#stop)
- [resume](Token.md#resume)
- [restored](Token.md#restored)
- [getSubProcessToken](Token.md#getsubprocesstoken)
- [getChildrenTokens](Token.md#getchildrentokens)
- [preExecute](Token.md#preexecute)
- [preNext](Token.md#prenext)
- [execute](Token.md#execute)
- [processError](Token.md#processerror)
- [getScopeCatchEvent](Token.md#getscopecatchevent)
- [processCancel](Token.md#processcancel)
- [processEscalation](Token.md#processescalation)
- [appendData](Token.md#appenddata)
- [terminate](Token.md#terminate)
- [continue](Token.md#continue)
- [signal](Token.md#signal)
- [end](Token.md#end)
- [setCurrentNode](Token.md#setcurrentnode)
- [goNext](Token.md#gonext)
- [log](Token.md#log)
- [logS](Token.md#logs)
- [logE](Token.md#loge)
- [info](Token.md#info)
- [error](Token.md#error)

## Constructors

### constructor

• **new Token**(`type`, `execution`, `startNode`, `dataPath?`, `parentToken?`, `originItem?`): [`Token`](Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`TOKEN_TYPE`](../enums/TOKEN_TYPE.md) |
| `execution` | [`Execution`](Execution.md) |
| `startNode` | [`Node`](Node.md) |
| `dataPath?` | `any` |
| `parentToken?` | [`Token`](Token.md) |
| `originItem?` | [`Item`](Item.md) |

#### Returns

[`Token`](Token.md)

#### Defined in

[engine/Token.ts:116](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L116)

## Properties

### id

• **id**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[id](../interfaces/IToken.md#id)

#### Defined in

[engine/Token.ts:58](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L58)

___

### type

• **type**: [`TOKEN_TYPE`](../enums/TOKEN_TYPE.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[type](../interfaces/IToken.md#type)

#### Defined in

[engine/Token.ts:59](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L59)

___

### execution

• **execution**: [`IExecution`](../interfaces/IExecution.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[execution](../interfaces/IToken.md#execution)

#### Defined in

[engine/Token.ts:60](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L60)

___

### dataPath

• **dataPath**: `string`

#### Implementation of

[IToken](../interfaces/IToken.md).[dataPath](../interfaces/IToken.md#datapath)

#### Defined in

[engine/Token.ts:61](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L61)

___

### startNodeId

• **startNodeId**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[startNodeId](../interfaces/IToken.md#startnodeid)

#### Defined in

[engine/Token.ts:62](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L62)

___

### parentToken

• `Optional` **parentToken**: [`Token`](Token.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[parentToken](../interfaces/IToken.md#parenttoken)

#### Defined in

[engine/Token.ts:63](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L63)

___

### originItem

• **originItem**: [`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[originItem](../interfaces/IToken.md#originitem)

#### Defined in

[engine/Token.ts:65](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L65)

___

### path

• **path**: [`Item`](Item.md)[]

#### Implementation of

[IToken](../interfaces/IToken.md).[path](../interfaces/IToken.md#path)

#### Defined in

[engine/Token.ts:66](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L66)

___

### loop

• **loop**: [`Loop`](Loop.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[loop](../interfaces/IToken.md#loop)

#### Defined in

[engine/Token.ts:67](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L67)

___

### currentNode

• **currentNode**: [`Node`](Node.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[currentNode](../interfaces/IToken.md#currentnode)

#### Defined in

[engine/Token.ts:68](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L68)

___

### processId

• **processId**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[processId](../interfaces/IToken.md#processid)

#### Defined in

[engine/Token.ts:69](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L69)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[status](../interfaces/IToken.md#status)

#### Defined in

[engine/Token.ts:70](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L70)

___

### input

• **input**: `Object`

#### Defined in

[engine/Token.ts:71](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L71)

___

### output

• **output**: `Object`

#### Defined in

[engine/Token.ts:72](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L72)

___

### messageMatchingKey

• **messageMatchingKey**: `Object`

#### Defined in

[engine/Token.ts:73](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L73)

___

### itemsKey

• **itemsKey**: `any`

#### Defined in

[engine/Token.ts:74](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L74)

## Accessors

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Implementation of

[IToken](../interfaces/IToken.md).[data](../interfaces/IToken.md#data)

#### Defined in

[engine/Token.ts:76](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L76)

___

### currentItem

• `get` **currentItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[currentItem](../interfaces/IToken.md#currentitem)

#### Defined in

[engine/Token.ts:79](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L79)

___

### firstItem

• `get` **firstItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[firstItem](../interfaces/IToken.md#firstitem)

#### Defined in

[engine/Token.ts:82](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L82)

___

### lastItem

• `get` **lastItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[lastItem](../interfaces/IToken.md#lastitem)

#### Defined in

[engine/Token.ts:94](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L94)

___

### childrenTokens

• `get` **childrenTokens**(): [`Token`](Token.md)[]

#### Returns

[`Token`](Token.md)[]

#### Implementation of

[IToken](../interfaces/IToken.md).[childrenTokens](../interfaces/IToken.md#childrentokens)

#### Defined in

[engine/Token.ts:104](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L104)

## Methods

### hasNode

▸ **hasNode**(`nodeId`): `Boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `any` |

#### Returns

`Boolean`

#### Defined in

[engine/Token.ts:86](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L86)

___

### getFullPath

▸ **getFullPath**(`path?`): [`Item`](Item.md)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | `any`[] | `[]` |

#### Returns

[`Item`](Item.md)[]

#### Implementation of

[IToken](../interfaces/IToken.md).[getFullPath](../interfaces/IToken.md#getfullpath)

#### Defined in

[engine/Token.ts:110](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L110)

___

### startNewToken

▸ **startNewToken**(`type`, `execution`, `startNode`, `dataPath`, `parentToken`, `originItem`, `loop`, `data?`, `noExecute?`, `itemsKey?`): `Promise`\<[`Token`](Token.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`TOKEN_TYPE`](../enums/TOKEN_TYPE.md) | `undefined` |
| `execution` | `any` | `undefined` |
| `startNode` | `any` | `undefined` |
| `dataPath` | `any` | `undefined` |
| `parentToken` | [`Token`](Token.md) | `undefined` |
| `originItem` | [`Item`](Item.md) | `undefined` |
| `loop` | [`Loop`](Loop.md) | `undefined` |
| `data` | `any` | `null` |
| `noExecute` | `boolean` | `false` |
| `itemsKey` | `any` | `null` |

#### Returns

`Promise`\<[`Token`](Token.md)\>

#### Defined in

[engine/Token.ts:146](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L146)

___

### save

▸ **save**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `type` | [`TOKEN_TYPE`](../enums/TOKEN_TYPE.md) |
| `status` | [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md) |
| `dataPath` | `string` |
| `loopId` | `any` |
| `parentToken` | `any` |
| `originItem` | `any` |
| `startNodeId` | `any` |
| `currentNode` | `any` |
| `itemsKey` | `any` |

#### Implementation of

[IToken](../interfaces/IToken.md).[save](../interfaces/IToken.md#save)

#### Defined in

[engine/Token.ts:177](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L177)

___

### load

▸ **load**(`execution`, `da`): [`Token`](Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](Execution.md) |
| `da` | `any` |

#### Returns

[`Token`](Token.md)

#### Defined in

[engine/Token.ts:192](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L192)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[stop](../interfaces/IToken.md#stop)

#### Defined in

[engine/Token.ts:206](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L206)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[resume](../interfaces/IToken.md#resume)

#### Defined in

[engine/Token.ts:215](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L215)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[restored](../interfaces/IToken.md#restored)

#### Defined in

[engine/Token.ts:219](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L219)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`Token`](Token.md)

#### Returns

[`Token`](Token.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[getSubProcessToken](../interfaces/IToken.md#getsubprocesstoken)

#### Defined in

[engine/Token.ts:224](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L224)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IToken](../interfaces/IToken.md).[getChildrenTokens](../interfaces/IToken.md#getchildrentokens)

#### Defined in

[engine/Token.ts:233](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L233)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[preExecute](../interfaces/IToken.md#preexecute)

#### Defined in

[engine/Token.ts:245](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L245)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[preNext](../interfaces/IToken.md#prenext)

#### Defined in

[engine/Token.ts:252](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L252)

___

### execute

▸ **execute**(`input`): `Promise`\<`void`\>

this is the primary exectuion method for a token, it executes from current node till:
     a node hits a wait

Pre-Conditions:
     currentNode is set 
     status!= end

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[execute](../interfaces/IToken.md#execute)

#### Defined in

[engine/Token.ts:265](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L265)

___

### processError

▸ **processError**(`errorCode`, `callingEvent`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorCode` | `any` |
| `callingEvent` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[processError](../interfaces/IToken.md#processerror)

#### Defined in

[engine/Token.ts:335](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L335)

___

### getScopeCatchEvent

▸ **getScopeCatchEvent**(`type`, `code`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | ``"error"`` \| ``"escalation"`` \| ``"cancel"`` |
| `code` | `any` |

#### Returns

`any`

#### Defined in

[engine/Token.ts:350](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L350)

___

### processCancel

▸ **processCancel**(`callingEvent`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `callingEvent` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[processCancel](../interfaces/IToken.md#processcancel)

#### Defined in

[engine/Token.ts:426](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L426)

___

### processEscalation

▸ **processEscalation**(`escalationCode`, `callingEvent`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `escalationCode` | `any` |
| `callingEvent` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[processEscalation](../interfaces/IToken.md#processescalation)

#### Defined in

[engine/Token.ts:434](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L434)

___

### appendData

▸ **appendData**(`inputData`, `item`): `void`

renamed from applyInput to appendData

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputData` | `any` |
| `item` | `any` |

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[appendData](../interfaces/IToken.md#appenddata)

#### Defined in

[engine/Token.ts:451](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L451)

___

### terminate

▸ **terminate**(): `Promise`\<`void`\>

is called by Gateways to cancel current token

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[terminate](../interfaces/IToken.md#terminate)

#### Defined in

[engine/Token.ts:458](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L458)

___

### continue

▸ **continue**(): `Promise`\<`void`\>

is called by events to cancel current token

#### Returns

`Promise`\<`void`\>

#### Defined in

[engine/Token.ts:468](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L468)

___

### signal

▸ **signal**(`data`, `options?`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `options` | `Object` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[signal](../interfaces/IToken.md#signal)

#### Defined in

[engine/Token.ts:477](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L477)

___

### end

▸ **end**(`cancel?`): `Promise`\<`void`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cancel` | `Boolean` | `false` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[end](../interfaces/IToken.md#end)

#### Defined in

[engine/Token.ts:528](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L528)

___

### setCurrentNode

▸ **setCurrentNode**(`newCurrentNode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newCurrentNode` | [`Node`](Node.md) |

#### Returns

`void`

#### Defined in

[engine/Token.ts:575](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L575)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[goNext](../interfaces/IToken.md#gonext)

#### Defined in

[engine/Token.ts:585](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L585)

___

### log

▸ **log**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[log](../interfaces/IToken.md#log)

#### Defined in

[engine/Token.ts:675](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L675)

___

### logS

▸ **logS**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Defined in

[engine/Token.ts:678](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L678)

___

### logE

▸ **logE**(`...msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...msg` | `any`[] |

#### Returns

`void`

#### Defined in

[engine/Token.ts:681](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L681)

___

### info

▸ **info**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[info](../interfaces/IToken.md#info)

#### Defined in

[engine/Token.ts:684](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L684)

___

### error

▸ **error**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[error](../interfaces/IToken.md#error)

#### Defined in

[engine/Token.ts:687](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/engine/Token.ts#L687)
