[bpmn-server](../README.md) / [Exports](../modules.md) / [engine/Token](../modules/engine_Token.md) / Token

# Class: Token

[engine/Token](../modules/engine_Token.md).Token

## Implements

- [`IToken`](../interfaces/interfaces_engine.IToken.md)

## Table of contents

### Constructors

- [constructor](engine_Token.Token.md#constructor)

### Properties

- [currentNode](engine_Token.Token.md#currentnode)
- [dataPath](engine_Token.Token.md#datapath)
- [execution](engine_Token.Token.md#execution)
- [id](engine_Token.Token.md#id)
- [input](engine_Token.Token.md#input)
- [loop](engine_Token.Token.md#loop)
- [messageMatchingKey](engine_Token.Token.md#messagematchingkey)
- [originItem](engine_Token.Token.md#originitem)
- [output](engine_Token.Token.md#output)
- [parentToken](engine_Token.Token.md#parenttoken)
- [path](engine_Token.Token.md#path)
- [processId](engine_Token.Token.md#processid)
- [startNodeId](engine_Token.Token.md#startnodeid)
- [status](engine_Token.Token.md#status)
- [type](engine_Token.Token.md#type)

### Accessors

- [childrenTokens](engine_Token.Token.md#childrentokens)
- [currentItem](engine_Token.Token.md#currentitem)
- [data](engine_Token.Token.md#data)
- [firstItem](engine_Token.Token.md#firstitem)
- [lastItem](engine_Token.Token.md#lastitem)

### Methods

- [appendData](engine_Token.Token.md#appenddata)
- [continue](engine_Token.Token.md#continue)
- [end](engine_Token.Token.md#end)
- [error](engine_Token.Token.md#error)
- [execute](engine_Token.Token.md#execute)
- [getChildrenTokens](engine_Token.Token.md#getchildrentokens)
- [getFullPath](engine_Token.Token.md#getfullpath)
- [getSubProcessToken](engine_Token.Token.md#getsubprocesstoken)
- [goNext](engine_Token.Token.md#gonext)
- [hasNode](engine_Token.Token.md#hasnode)
- [info](engine_Token.Token.md#info)
- [log](engine_Token.Token.md#log)
- [preExecute](engine_Token.Token.md#preexecute)
- [preNext](engine_Token.Token.md#prenext)
- [processError](engine_Token.Token.md#processerror)
- [processEscalation](engine_Token.Token.md#processescalation)
- [restored](engine_Token.Token.md#restored)
- [resume](engine_Token.Token.md#resume)
- [save](engine_Token.Token.md#save)
- [setCurrentNode](engine_Token.Token.md#setcurrentnode)
- [signal](engine_Token.Token.md#signal)
- [stop](engine_Token.Token.md#stop)
- [terminate](engine_Token.Token.md#terminate)
- [load](engine_Token.Token.md#load)
- [startNewToken](engine_Token.Token.md#startnewtoken)

## Constructors

### constructor

• **new Token**(`type`, `execution`, `startNode`, `dataPath?`, `parentToken?`, `originItem?`): [`Token`](engine_Token.Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`TOKEN_TYPE`](../enums/engine_Token.TOKEN_TYPE.md) |
| `execution` | [`Execution`](engine_Execution.Execution.md) |
| `startNode` | [`Node`](elements_Node.Node.md) |
| `dataPath?` | `any` |
| `parentToken?` | [`Token`](engine_Token.Token.md) |
| `originItem?` | [`Item`](engine_Item.Item.md) |

#### Returns

[`Token`](engine_Token.Token.md)

#### Defined in

[src/engine/Token.ts:115](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L115)

## Properties

### currentNode

• **currentNode**: [`Node`](elements_Node.Node.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[currentNode](../interfaces/interfaces_engine.IToken.md#currentnode)

#### Defined in

[src/engine/Token.ts:68](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L68)

___

### dataPath

• **dataPath**: `string`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[dataPath](../interfaces/interfaces_engine.IToken.md#datapath)

#### Defined in

[src/engine/Token.ts:61](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L61)

___

### execution

• **execution**: [`IExecution`](../interfaces/interfaces_engine.IExecution.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[execution](../interfaces/interfaces_engine.IToken.md#execution)

#### Defined in

[src/engine/Token.ts:60](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L60)

___

### id

• **id**: `any`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[id](../interfaces/interfaces_engine.IToken.md#id)

#### Defined in

[src/engine/Token.ts:58](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L58)

___

### input

• **input**: `Object`

#### Defined in

[src/engine/Token.ts:71](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L71)

___

### loop

• **loop**: [`Loop`](engine_Loop.Loop.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[loop](../interfaces/interfaces_engine.IToken.md#loop)

#### Defined in

[src/engine/Token.ts:67](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L67)

___

### messageMatchingKey

• **messageMatchingKey**: `Object`

#### Defined in

[src/engine/Token.ts:73](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L73)

___

### originItem

• **originItem**: [`Item`](engine_Item.Item.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[originItem](../interfaces/interfaces_engine.IToken.md#originitem)

#### Defined in

[src/engine/Token.ts:65](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L65)

___

### output

• **output**: `Object`

#### Defined in

[src/engine/Token.ts:72](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L72)

___

### parentToken

• `Optional` **parentToken**: [`Token`](engine_Token.Token.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[parentToken](../interfaces/interfaces_engine.IToken.md#parenttoken)

#### Defined in

[src/engine/Token.ts:63](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L63)

___

### path

• **path**: [`Item`](engine_Item.Item.md)[]

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[path](../interfaces/interfaces_engine.IToken.md#path)

#### Defined in

[src/engine/Token.ts:66](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L66)

___

### processId

• **processId**: `any`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[processId](../interfaces/interfaces_engine.IToken.md#processid)

#### Defined in

[src/engine/Token.ts:69](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L69)

___

### startNodeId

• **startNodeId**: `any`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[startNodeId](../interfaces/interfaces_engine.IToken.md#startnodeid)

#### Defined in

[src/engine/Token.ts:62](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L62)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/interfaces_Enums.TOKEN_STATUS.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[status](../interfaces/interfaces_engine.IToken.md#status)

#### Defined in

[src/engine/Token.ts:70](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L70)

___

### type

• **type**: [`TOKEN_TYPE`](../enums/engine_Token.TOKEN_TYPE.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[type](../interfaces/interfaces_engine.IToken.md#type)

#### Defined in

[src/engine/Token.ts:59](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L59)

## Accessors

### childrenTokens

• `get` **childrenTokens**(): [`Token`](engine_Token.Token.md)[]

#### Returns

[`Token`](engine_Token.Token.md)[]

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[childrenTokens](../interfaces/interfaces_engine.IToken.md#childrentokens)

#### Defined in

[src/engine/Token.ts:103](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L103)

___

### currentItem

• `get` **currentItem**(): [`Item`](engine_Item.Item.md)

#### Returns

[`Item`](engine_Item.Item.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[currentItem](../interfaces/interfaces_engine.IToken.md#currentitem)

#### Defined in

[src/engine/Token.ts:78](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L78)

___

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[data](../interfaces/interfaces_engine.IToken.md#data)

#### Defined in

[src/engine/Token.ts:75](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L75)

___

### firstItem

• `get` **firstItem**(): [`Item`](engine_Item.Item.md)

#### Returns

[`Item`](engine_Item.Item.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[firstItem](../interfaces/interfaces_engine.IToken.md#firstitem)

#### Defined in

[src/engine/Token.ts:81](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L81)

___

### lastItem

• `get` **lastItem**(): [`Item`](engine_Item.Item.md)

#### Returns

[`Item`](engine_Item.Item.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[lastItem](../interfaces/interfaces_engine.IToken.md#lastitem)

#### Defined in

[src/engine/Token.ts:93](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L93)

## Methods

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

[IToken](../interfaces/interfaces_engine.IToken.md).[appendData](../interfaces/interfaces_engine.IToken.md#appenddata)

#### Defined in

[src/engine/Token.ts:358](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L358)

___

### continue

▸ **continue**(): `Promise`\<`void`\>

is called by events to cancel current token

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/engine/Token.ts:375](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L375)

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

[IToken](../interfaces/interfaces_engine.IToken.md).[end](../interfaces/interfaces_engine.IToken.md#end)

#### Defined in

[src/engine/Token.ts:416](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L416)

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

[IToken](../interfaces/interfaces_engine.IToken.md).[error](../interfaces/interfaces_engine.IToken.md#error)

#### Defined in

[src/engine/Token.ts:529](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L529)

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

[IToken](../interfaces/interfaces_engine.IToken.md).[execute](../interfaces/interfaces_engine.IToken.md#execute)

#### Defined in

[src/engine/Token.ts:238](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L238)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[getChildrenTokens](../interfaces/interfaces_engine.IToken.md#getchildrentokens)

#### Defined in

[src/engine/Token.ts:208](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L208)

___

### getFullPath

▸ **getFullPath**(`path?`): [`Item`](engine_Item.Item.md)[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `path` | `any`[] | `[]` |

#### Returns

[`Item`](engine_Item.Item.md)[]

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[getFullPath](../interfaces/interfaces_engine.IToken.md#getfullpath)

#### Defined in

[src/engine/Token.ts:109](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L109)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`Token`](engine_Token.Token.md)

#### Returns

[`Token`](engine_Token.Token.md)

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[getSubProcessToken](../interfaces/interfaces_engine.IToken.md#getsubprocesstoken)

#### Defined in

[src/engine/Token.ts:199](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L199)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[goNext](../interfaces/interfaces_engine.IToken.md#gonext)

#### Defined in

[src/engine/Token.ts:454](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L454)

___

### hasNode

▸ **hasNode**(`nodeId`): `Boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `nodeId` | `any` |

#### Returns

`Boolean`

#### Defined in

[src/engine/Token.ts:85](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L85)

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

[IToken](../interfaces/interfaces_engine.IToken.md).[info](../interfaces/interfaces_engine.IToken.md#info)

#### Defined in

[src/engine/Token.ts:526](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L526)

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

[IToken](../interfaces/interfaces_engine.IToken.md).[log](../interfaces/interfaces_engine.IToken.md#log)

#### Defined in

[src/engine/Token.ts:523](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L523)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[preExecute](../interfaces/interfaces_engine.IToken.md#preexecute)

#### Defined in

[src/engine/Token.ts:220](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L220)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[preNext](../interfaces/interfaces_engine.IToken.md#prenext)

#### Defined in

[src/engine/Token.ts:227](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L227)

___

### processError

▸ **processError**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[processError](../interfaces/interfaces_engine.IToken.md#processerror)

#### Defined in

[src/engine/Token.ts:300](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L300)

___

### processEscalation

▸ **processEscalation**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/engine/Token.ts:330](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L330)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[restored](../interfaces/interfaces_engine.IToken.md#restored)

#### Defined in

[src/engine/Token.ts:194](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L194)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[resume](../interfaces/interfaces_engine.IToken.md#resume)

#### Defined in

[src/engine/Token.ts:190](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L190)

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
| `type` | [`TOKEN_TYPE`](../enums/engine_Token.TOKEN_TYPE.md) |

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[save](../interfaces/interfaces_engine.IToken.md#save)

#### Defined in

[src/engine/Token.ts:153](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L153)

___

### setCurrentNode

▸ **setCurrentNode**(`newCurrentNode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newCurrentNode` | [`Node`](elements_Node.Node.md) |

#### Returns

`void`

#### Defined in

[src/engine/Token.ts:444](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L444)

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

[IToken](../interfaces/interfaces_engine.IToken.md).[signal](../interfaces/interfaces_engine.IToken.md#signal)

#### Defined in

[src/engine/Token.ts:384](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L384)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[stop](../interfaces/interfaces_engine.IToken.md#stop)

#### Defined in

[src/engine/Token.ts:181](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L181)

___

### terminate

▸ **terminate**(): `Promise`\<`void`\>

is called by Gateways to cancel current token

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/interfaces_engine.IToken.md).[terminate](../interfaces/interfaces_engine.IToken.md#terminate)

#### Defined in

[src/engine/Token.ts:365](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L365)

___

### load

▸ **load**(`execution`, `da`): [`Token`](engine_Token.Token.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | [`Execution`](engine_Execution.Execution.md) |
| `da` | `any` |

#### Returns

[`Token`](engine_Token.Token.md)

#### Defined in

[src/engine/Token.ts:168](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L168)

___

### startNewToken

▸ **startNewToken**(`type`, `execution`, `startNode`, `dataPath`, `parentToken`, `originItem`, `loop`, `data?`, `noExecute?`): `Promise`\<[`Token`](engine_Token.Token.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `type` | [`TOKEN_TYPE`](../enums/engine_Token.TOKEN_TYPE.md) | `undefined` |
| `execution` | `any` | `undefined` |
| `startNode` | `any` | `undefined` |
| `dataPath` | `any` | `undefined` |
| `parentToken` | [`Token`](engine_Token.Token.md) | `undefined` |
| `originItem` | [`Item`](engine_Item.Item.md) | `undefined` |
| `loop` | [`Loop`](engine_Loop.Loop.md) | `undefined` |
| `data` | `any` | `null` |
| `noExecute` | `boolean` | `false` |

#### Returns

`Promise`\<[`Token`](engine_Token.Token.md)\>

#### Defined in

[src/engine/Token.ts:141](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/engine/Token.ts#L141)
