[bpmn-server](../README.md) › [Token](token.md)

# Class: Token

## Hierarchy

* **Token**

## Implements

* [IToken](../interfaces/itoken.md)

## Index

### Constructors

* [constructor](token.md#constructor)

### Properties

* [branchNode](token.md#optional-branchnode)
* [currentNode](token.md#currentnode)
* [dataPath](token.md#datapath)
* [execution](token.md#execution)
* [id](token.md#id)
* [loop](token.md#loop)
* [parentToken](token.md#optional-parenttoken)
* [path](token.md#path)
* [processId](token.md#processid)
* [startNodeId](token.md#startnodeid)
* [status](token.md#status)

### Accessors

* [currentItem](token.md#currentitem)
* [data](token.md#data)
* [lastItem](token.md#lastitem)

### Methods

* [applyInput](token.md#applyinput)
* [end](token.md#end)
* [execute](token.md#execute)
* [getChildrenTokens](token.md#getchildrentokens)
* [goNext](token.md#gonext)
* [log](token.md#log)
* [preExecute](token.md#preexecute)
* [preNext](token.md#prenext)
* [restored](token.md#restored)
* [resume](token.md#resume)
* [save](token.md#save)
* [signal](token.md#signal)
* [terminate](token.md#terminate)
* [load](token.md#static-load)
* [startNewToken](token.md#static-startnewtoken)

## Constructors

###  constructor

\+ **new Token**(`execution`: [Execution](execution.md), `startNode`: [Node](node.md), `dataPath?`: any, `parentToken?`: [Token](token.md), `branchNode?`: [Node](node.md)): *[Token](token.md)*

Defined in src/engine/Token.ts:84

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |
`startNode` | [Node](node.md) |
`dataPath?` | any |
`parentToken?` | [Token](token.md) |
`branchNode?` | [Node](node.md) |

**Returns:** *[Token](token.md)*

## Properties

### `Optional` branchNode

• **branchNode**? : *[Node](node.md)*

*Implementation of [IToken](../interfaces/itoken.md).[branchNode](../interfaces/itoken.md#optional-branchnode)*

Defined in src/engine/Token.ts:60

___

###  currentNode

• **currentNode**: *[Node](node.md)*

*Implementation of [IToken](../interfaces/itoken.md).[currentNode](../interfaces/itoken.md#currentnode)*

Defined in src/engine/Token.ts:64

___

###  dataPath

• **dataPath**: *string*

*Implementation of [IToken](../interfaces/itoken.md).[dataPath](../interfaces/itoken.md#datapath)*

Defined in src/engine/Token.ts:57

___

###  execution

• **execution**: *any*

*Implementation of [IToken](../interfaces/itoken.md).[execution](../interfaces/itoken.md#execution)*

Defined in src/engine/Token.ts:56

___

###  id

• **id**: *any*

*Implementation of [IToken](../interfaces/itoken.md).[id](../interfaces/itoken.md#id)*

Defined in src/engine/Token.ts:55

___

###  loop

• **loop**: *[Loop](loop.md)*

Defined in src/engine/Token.ts:62

___

### `Optional` parentToken

• **parentToken**? : *[Token](token.md)*

*Implementation of [IToken](../interfaces/itoken.md).[parentToken](../interfaces/itoken.md#optional-parenttoken)*

Defined in src/engine/Token.ts:59

___

###  path

• **path**: *[Item](item.md)[]*

*Implementation of [IToken](../interfaces/itoken.md).[path](../interfaces/itoken.md#path)*

Defined in src/engine/Token.ts:61

___

###  processId

• **processId**: *any*

*Implementation of [IToken](../interfaces/itoken.md).[processId](../interfaces/itoken.md#processid)*

Defined in src/engine/Token.ts:65

___

###  startNodeId

• **startNodeId**: *any*

*Implementation of [IToken](../interfaces/itoken.md).[startNodeId](../interfaces/itoken.md#startnodeid)*

Defined in src/engine/Token.ts:58

___

###  status

• **status**: *[TOKEN_STATUS](../enums/token_status.md)*

*Implementation of [IToken](../interfaces/itoken.md).[status](../interfaces/itoken.md#status)*

Defined in src/engine/Token.ts:67

## Accessors

###  currentItem

• **get currentItem**(): *[Item](item.md)*

Defined in src/engine/Token.ts:72

**Returns:** *[Item](item.md)*

___

###  data

• **get data**(): *any*

Defined in src/engine/Token.ts:69

**Returns:** *any*

___

###  lastItem

• **get lastItem**(): *[Item](item.md)*

Defined in src/engine/Token.ts:75

**Returns:** *[Item](item.md)*

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *void*

___

###  end

▸ **end**(): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:268

**Returns:** *Promise‹void›*

___

###  execute

▸ **execute**(): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:193

this is the primary exectuion method for a token

**Returns:** *Promise‹void›*

___

###  getChildrenTokens

▸ **getChildrenTokens**(): *any[]*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:166

**Returns:** *any[]*

___

###  goNext

▸ **goNext**(): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:283

**Returns:** *Promise‹void›*

___

###  log

▸ **log**(`msg`: any): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:323

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  preExecute

▸ **preExecute**(): *Promise‹boolean›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:178

**Returns:** *Promise‹boolean›*

___

###  preNext

▸ **preNext**(): *Promise‹boolean›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:185

**Returns:** *Promise‹boolean›*

___

###  restored

▸ **restored**(): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:161

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:157

**Returns:** *void*

___

###  save

▸ **save**(): *object*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:116

**Returns:** *object*

* **branchNode**: *any*

* **currentNode**: *any* = this.currentNode.id

* **dataPath**: *string* = this.dataPath

* **id**: *any* = this.id

* **loopId**: *any*

* **parentToken**: *any*

* **startNodeId**: *any* = this.startNodeId

* **status**: *[TOKEN_STATUS](../enums/token_status.md)* = this.status

___

###  signal

▸ **signal**(`data`: any): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:244

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹void›*

___

###  terminate

▸ **terminate**(): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in src/engine/Token.ts:235

 is called by Gateways to cancel current token

**Returns:** *void*

___

### `Static` load

▸ **load**(`execution`: [Execution](execution.md), `da`: any): *[Token](token.md)*

Defined in src/engine/Token.ts:137

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |
`da` | any |

**Returns:** *[Token](token.md)*

___

### `Static` startNewToken

▸ **startNewToken**(`execution`: any, `startNode`: any, `dataPath`: any, `parentToken`: [Token](token.md), `branchNode`: [Node](node.md), `loop`: [Loop](loop.md), `data`: any): *Promise‹[Token](token.md)‹››*

Defined in src/engine/Token.ts:108

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`execution` | any | - |
`startNode` | any | - |
`dataPath` | any | - |
`parentToken` | [Token](token.md) | - |
`branchNode` | [Node](node.md) | - |
`loop` | [Loop](loop.md) | - |
`data` | any | null |

**Returns:** *Promise‹[Token](token.md)‹››*
