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
- [processEscalation](Token.md#processescalation)
- [appendData](Token.md#appenddata)
- [terminate](Token.md#terminate)
- [continue](Token.md#continue)
- [signal](Token.md#signal)
- [end](Token.md#end)
- [setCurrentNode](Token.md#setcurrentnode)
- [goNext](Token.md#gonext)
- [log](Token.md#log)
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

[engine/Token.ts:115](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L115)

## Properties

### id

• **id**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[id](../interfaces/IToken.md#id)

#### Defined in

[engine/Token.ts:58](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L58)

___

### type

• **type**: [`TOKEN_TYPE`](../enums/TOKEN_TYPE.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[type](../interfaces/IToken.md#type)

#### Defined in

[engine/Token.ts:59](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L59)

___

### execution

• **execution**: [`IExecution`](../interfaces/IExecution.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[execution](../interfaces/IToken.md#execution)

#### Defined in

[engine/Token.ts:60](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L60)

___

### dataPath

• **dataPath**: `string`

#### Implementation of

[IToken](../interfaces/IToken.md).[dataPath](../interfaces/IToken.md#datapath)

#### Defined in

[engine/Token.ts:61](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L61)

___

### startNodeId

• **startNodeId**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[startNodeId](../interfaces/IToken.md#startnodeid)

#### Defined in

[engine/Token.ts:62](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L62)

___

### parentToken

• `Optional` **parentToken**: [`Token`](Token.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[parentToken](../interfaces/IToken.md#parenttoken)

#### Defined in

[engine/Token.ts:63](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L63)

___

### originItem

• **originItem**: [`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[originItem](../interfaces/IToken.md#originitem)

#### Defined in

[engine/Token.ts:65](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L65)

___

### path

• **path**: [`Item`](Item.md)[]

#### Implementation of

[IToken](../interfaces/IToken.md).[path](../interfaces/IToken.md#path)

#### Defined in

[engine/Token.ts:66](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L66)

___

### loop

• **loop**: [`Loop`](Loop.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[loop](../interfaces/IToken.md#loop)

#### Defined in

[engine/Token.ts:67](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L67)

___

### currentNode

• **currentNode**: [`Node`](Node.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[currentNode](../interfaces/IToken.md#currentnode)

#### Defined in

[engine/Token.ts:68](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L68)

___

### processId

• **processId**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[processId](../interfaces/IToken.md#processid)

#### Defined in

[engine/Token.ts:69](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L69)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[status](../interfaces/IToken.md#status)

#### Defined in

[engine/Token.ts:70](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L70)

___

### input

• **input**: `Object`

#### Defined in

[engine/Token.ts:71](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L71)

___

### output

• **output**: `Object`

#### Defined in

[engine/Token.ts:72](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L72)

___

### messageMatchingKey

• **messageMatchingKey**: `Object`

#### Defined in

[engine/Token.ts:73](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L73)

## Accessors

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Implementation of

[IToken](../interfaces/IToken.md).[data](../interfaces/IToken.md#data)

#### Defined in

[engine/Token.ts:75](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L75)

___

### currentItem

• `get` **currentItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[currentItem](../interfaces/IToken.md#currentitem)

#### Defined in

[engine/Token.ts:78](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L78)

___

### firstItem

• `get` **firstItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[firstItem](../interfaces/IToken.md#firstitem)

#### Defined in

[engine/Token.ts:81](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L81)

___

### lastItem

• `get` **lastItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[lastItem](../interfaces/IToken.md#lastitem)

#### Defined in

[engine/Token.ts:93](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L93)

___

### childrenTokens

• `get` **childrenTokens**(): [`Token`](Token.md)[]

#### Returns

[`Token`](Token.md)[]

#### Implementation of

[IToken](../interfaces/IToken.md).[childrenTokens](../interfaces/IToken.md#childrentokens)

#### Defined in

[engine/Token.ts:103](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L103)

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

[engine/Token.ts:85](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L85)

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

[engine/Token.ts:109](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L109)

___

### startNewToken

▸ **startNewToken**(`type`, `execution`, `startNode`, `dataPath`, `parentToken`, `originItem`, `loop`, `data?`, `noExecute?`): `Promise`\<[`Token`](Token.md)\>

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

#### Returns

`Promise`\<[`Token`](Token.md)\>

#### Defined in

[engine/Token.ts:141](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L141)

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

#### Implementation of

[IToken](../interfaces/IToken.md).[save](../interfaces/IToken.md#save)

#### Defined in

[engine/Token.ts:153](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L153)

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

[engine/Token.ts:168](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L168)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[stop](../interfaces/IToken.md#stop)

#### Defined in

[engine/Token.ts:181](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L181)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[resume](../interfaces/IToken.md#resume)

#### Defined in

[engine/Token.ts:190](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L190)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[restored](../interfaces/IToken.md#restored)

#### Defined in

[engine/Token.ts:194](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L194)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`Token`](Token.md)

#### Returns

[`Token`](Token.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[getSubProcessToken](../interfaces/IToken.md#getsubprocesstoken)

#### Defined in

[engine/Token.ts:199](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L199)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IToken](../interfaces/IToken.md).[getChildrenTokens](../interfaces/IToken.md#getchildrentokens)

#### Defined in

[engine/Token.ts:208](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L208)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[preExecute](../interfaces/IToken.md#preexecute)

#### Defined in

[engine/Token.ts:220](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L220)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[preNext](../interfaces/IToken.md#prenext)

#### Defined in

[engine/Token.ts:227](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L227)

___

### execute

▸ **execute**(`input`): `Promise`\<`void`\>

this is the primary exectuion method for a token
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

[engine/Token.ts:238](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L238)

___

### processError

▸ **processError**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[processError](../interfaces/IToken.md#processerror)

#### Defined in

[engine/Token.ts:300](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L300)

___

### processEscalation

▸ **processEscalation**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[engine/Token.ts:330](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L330)

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

[engine/Token.ts:358](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L358)

___

### terminate

▸ **terminate**(): `Promise`\<`void`\>

is called by Gateways to cancel current token

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[terminate](../interfaces/IToken.md#terminate)

#### Defined in

[engine/Token.ts:365](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L365)

___

### continue

▸ **continue**(): `Promise`\<`void`\>

is called by events to cancel current token

#### Returns

`Promise`\<`void`\>

#### Defined in

[engine/Token.ts:375](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L375)

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

[engine/Token.ts:384](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L384)

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

[engine/Token.ts:416](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L416)

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

[engine/Token.ts:444](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L444)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[goNext](../interfaces/IToken.md#gonext)

#### Defined in

[engine/Token.ts:454](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L454)

___

### log

▸ **log**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[log](../interfaces/IToken.md#log)

#### Defined in

[engine/Token.ts:523](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L523)

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

[engine/Token.ts:526](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L526)

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

[engine/Token.ts:529](https://github.com/bpmnServer/bpmn-server/blob/d8a5b7d/src/engine/Token.ts#L529)
