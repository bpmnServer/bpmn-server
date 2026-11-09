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
- [\_currentNode](Token.md#_currentnode)
- [processId](Token.md#processid)
- [status](Token.md#status)
- [input](Token.md#input)
- [output](Token.md#output)
- [messageMatchingKey](Token.md#messagematchingkey)
- [itemsKey](Token.md#itemskey)

### Accessors

- [currentNode](Token.md#currentnode)
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
- [retry](Token.md#retry)
- [addItemToPath](Token.md#additemtopath)
- [processError](Token.md#processerror)
- [getScopeCatchEvent](Token.md#getscopecatchevent)
- [checkTokensForError](Token.md#checktokensforerror)
- [processCancel](Token.md#processcancel)
- [processEscalation](Token.md#processescalation)
- [appendData](Token.md#appenddata)
- [terminate](Token.md#terminate)
- [continue](Token.md#continue)
- [signal](Token.md#signal)
- [signal2](Token.md#signal2)
- [end](Token.md#end)
- [setCurrentNode](Token.md#setcurrentnode)
- [goNext](Token.md#gonext)
- [log](Token.md#log)
- [logS](Token.md#logs)
- [logE](Token.md#loge)
- [info](Token.md#info)
- [decision](Token.md#decision)
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

[packages/bpmn-server/src/engine/Token.ts:114](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L114)

## Properties

### id

• **id**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[id](../interfaces/IToken.md#id)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L54)

___

### type

• **type**: [`TOKEN_TYPE`](../enums/TOKEN_TYPE.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[type](../interfaces/IToken.md#type)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L55)

___

### execution

• **execution**: [`IExecution`](../interfaces/IExecution.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[execution](../interfaces/IToken.md#execution)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L56)

___

### dataPath

• **dataPath**: `string`

#### Implementation of

[IToken](../interfaces/IToken.md).[dataPath](../interfaces/IToken.md#datapath)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L57)

___

### startNodeId

• **startNodeId**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[startNodeId](../interfaces/IToken.md#startnodeid)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L58)

___

### parentToken

• `Optional` **parentToken**: [`Token`](Token.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[parentToken](../interfaces/IToken.md#parenttoken)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L59)

___

### originItem

• **originItem**: [`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[originItem](../interfaces/IToken.md#originitem)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:62](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L62)

___

### path

• **path**: [`Item`](Item.md)[]

#### Implementation of

[IToken](../interfaces/IToken.md).[path](../interfaces/IToken.md#path)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L63)

___

### loop

• **loop**: [`Loop`](Loop.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[loop](../interfaces/IToken.md#loop)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:64](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L64)

___

### \_currentNode

• **\_currentNode**: [`Node`](Node.md)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L65)

___

### processId

• **processId**: `any`

#### Implementation of

[IToken](../interfaces/IToken.md).[processId](../interfaces/IToken.md#processid)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L67)

___

### status

• **status**: [`TOKEN_STATUS`](../enums/TOKEN_STATUS.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[status](../interfaces/IToken.md#status)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:68](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L68)

___

### input

• **input**: `Object`

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L69)

___

### output

• **output**: `Object`

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:70](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L70)

___

### messageMatchingKey

• **messageMatchingKey**: `Object`

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:71](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L71)

___

### itemsKey

• **itemsKey**: `any` = `null`

#### Implementation of

[IToken](../interfaces/IToken.md).[itemsKey](../interfaces/IToken.md#itemskey)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:72](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L72)

## Accessors

### currentNode

• `get` **currentNode**(): [`Node`](Node.md)

#### Returns

[`Node`](Node.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[currentNode](../interfaces/IToken.md#currentnode)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:66](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L66)

___

### data

• `get` **data**(): `any`

#### Returns

`any`

#### Implementation of

[IToken](../interfaces/IToken.md).[data](../interfaces/IToken.md#data)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:74](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L74)

___

### currentItem

• `get` **currentItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[currentItem](../interfaces/IToken.md#currentitem)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:77](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L77)

___

### firstItem

• `get` **firstItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[firstItem](../interfaces/IToken.md#firstitem)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:80](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L80)

___

### lastItem

• `get` **lastItem**(): [`Item`](Item.md)

#### Returns

[`Item`](Item.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[lastItem](../interfaces/IToken.md#lastitem)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:92](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L92)

___

### childrenTokens

• `get` **childrenTokens**(): [`Token`](Token.md)[]

#### Returns

[`Token`](Token.md)[]

#### Implementation of

[IToken](../interfaces/IToken.md).[childrenTokens](../interfaces/IToken.md#childrentokens)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:102](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L102)

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

[packages/bpmn-server/src/engine/Token.ts:84](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L84)

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

[packages/bpmn-server/src/engine/Token.ts:108](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L108)

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

[packages/bpmn-server/src/engine/Token.ts:146](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L146)

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

[packages/bpmn-server/src/engine/Token.ts:177](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L177)

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

[packages/bpmn-server/src/engine/Token.ts:192](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L192)

___

### stop

▸ **stop**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[stop](../interfaces/IToken.md#stop)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:206](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L206)

___

### resume

▸ **resume**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[resume](../interfaces/IToken.md#resume)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:215](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L215)

___

### restored

▸ **restored**(): `void`

#### Returns

`void`

#### Implementation of

[IToken](../interfaces/IToken.md).[restored](../interfaces/IToken.md#restored)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:219](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L219)

___

### getSubProcessToken

▸ **getSubProcessToken**(): [`Token`](Token.md)

#### Returns

[`Token`](Token.md)

#### Implementation of

[IToken](../interfaces/IToken.md).[getSubProcessToken](../interfaces/IToken.md#getsubprocesstoken)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:224](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L224)

___

### getChildrenTokens

▸ **getChildrenTokens**(): `any`[]

#### Returns

`any`[]

#### Implementation of

[IToken](../interfaces/IToken.md).[getChildrenTokens](../interfaces/IToken.md#getchildrentokens)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:233](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L233)

___

### preExecute

▸ **preExecute**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[preExecute](../interfaces/IToken.md#preexecute)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:245](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L245)

___

### preNext

▸ **preNext**(): `Promise`\<`boolean`\>

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[preNext](../interfaces/IToken.md#prenext)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:252](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L252)

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

[packages/bpmn-server/src/engine/Token.ts:265](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L265)

___

### retry

▸ **retry**(`item`): `Promise`\<`void`\>

A failed item's work again (its status `error`): then on, as execute goes on after its node.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | [`Item`](Item.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:336](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L336)

___

### addItemToPath

▸ **addItemToPath**(`item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:359](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L359)

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

[packages/bpmn-server/src/engine/Token.ts:364](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L364)

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

[packages/bpmn-server/src/engine/Token.ts:382](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L382)

___

### checkTokensForError

▸ **checkTokensForError**(`tokens`, `bhName`, `propertyName`, `errorCode`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `tokens` | `any` |
| `bhName` | `any` |
| `propertyName` | `any` |
| `errorCode` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:449](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L449)

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

[packages/bpmn-server/src/engine/Token.ts:476](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L476)

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

[packages/bpmn-server/src/engine/Token.ts:484](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L484)

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

[packages/bpmn-server/src/engine/Token.ts:519](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L519)

___

### terminate

▸ **terminate**(): `Promise`\<`void`\>

is called by Gateways to cancel current token

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[terminate](../interfaces/IToken.md#terminate)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:526](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L526)

___

### continue

▸ **continue**(): `Promise`\<`void`\>

is called by events to cancel current token

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:551](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L551)

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

[packages/bpmn-server/src/engine/Token.ts:560](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L560)

___

### signal2

▸ **signal2**(): `Promise`\<[`Token`](Token.md)\>

#### Returns

`Promise`\<[`Token`](Token.md)\>

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:608](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L608)

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

[packages/bpmn-server/src/engine/Token.ts:636](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L636)

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

[packages/bpmn-server/src/engine/Token.ts:683](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L683)

___

### goNext

▸ **goNext**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[IToken](../interfaces/IToken.md).[goNext](../interfaces/IToken.md#gonext)

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:693](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L693)

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

[packages/bpmn-server/src/engine/Token.ts:792](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L792)

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

[packages/bpmn-server/src/engine/Token.ts:795](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L795)

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

[packages/bpmn-server/src/engine/Token.ts:798](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L798)

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

[packages/bpmn-server/src/engine/Token.ts:801](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L801)

___

### decision

▸ **decision**(`msg`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `msg` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/engine/Token.ts:804](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L804)

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

[packages/bpmn-server/src/engine/Token.ts:807](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Token.ts#L807)
