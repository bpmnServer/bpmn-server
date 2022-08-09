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

* [currentNode](token.md#currentnode)
* [dataPath](token.md#datapath)
* [execution](token.md#execution)
* [id](token.md#id)
* [loop](token.md#loop)
* [originItem](token.md#originitem)
* [parentToken](token.md#optional-parenttoken)
* [path](token.md#path)
* [processId](token.md#processid)
* [startNodeId](token.md#startnodeid)
* [status](token.md#status)
* [type](token.md#type)

### Accessors

* [childrenTokens](token.md#childrentokens)
* [currentItem](token.md#currentitem)
* [data](token.md#data)
* [firstItem](token.md#firstitem)
* [lastItem](token.md#lastitem)

### Methods

* [applyInput](token.md#applyinput)
* [end](token.md#end)
* [error](token.md#error)
* [execute](token.md#execute)
* [getChildrenTokens](token.md#getchildrentokens)
* [getSubProcessToken](token.md#getsubprocesstoken)
* [goNext](token.md#gonext)
* [log](token.md#log)
* [preExecute](token.md#preexecute)
* [preNext](token.md#prenext)
* [processError](token.md#processerror)
* [restored](token.md#restored)
* [resume](token.md#resume)
* [save](token.md#save)
* [signal](token.md#signal)
* [stop](token.md#stop)
* [terminate](token.md#terminate)
* [load](token.md#static-load)
* [startNewToken](token.md#static-startnewtoken)

## Constructors

###  constructor

\+ **new Token**(`type`: [TOKEN_TYPE](../enums/token_type.md), `execution`: [Execution](execution.md), `startNode`: [Node](node.md), `dataPath?`: any, `parentToken?`: [Token](token.md), `originItem?`: [Item](item.md)): *[Token](token.md)*

Defined in bpmnServer/src/engine/Token.ts:95

**Parameters:**

Name | Type |
------ | ------ |
`type` | [TOKEN_TYPE](../enums/token_type.md) |
`execution` | [Execution](execution.md) |
`startNode` | [Node](node.md) |
`dataPath?` | any |
`parentToken?` | [Token](token.md) |
`originItem?` | [Item](item.md) |

**Returns:** *[Token](token.md)*

## Properties

###  currentNode

• **currentNode**: *[Node](node.md)*

*Implementation of [IToken](../interfaces/itoken.md).[currentNode](../interfaces/itoken.md#currentnode)*

Defined in bpmnServer/src/engine/Token.ts:68

___

###  dataPath

• **dataPath**: *string*

*Implementation of [IToken](../interfaces/itoken.md).[dataPath](../interfaces/itoken.md#datapath)*

Defined in bpmnServer/src/engine/Token.ts:61

___

###  execution

• **execution**: *[IExecution](../interfaces/iexecution.md)*

*Implementation of [IToken](../interfaces/itoken.md).[execution](../interfaces/itoken.md#execution)*

Defined in bpmnServer/src/engine/Token.ts:60

___

###  id

• **id**: *any*

*Implementation of [IToken](../interfaces/itoken.md).[id](../interfaces/itoken.md#id)*

Defined in bpmnServer/src/engine/Token.ts:58

___

###  loop

• **loop**: *[Loop](loop.md)*

*Implementation of [IToken](../interfaces/itoken.md).[loop](../interfaces/itoken.md#loop)*

Defined in bpmnServer/src/engine/Token.ts:67

___

###  originItem

• **originItem**: *[Item](item.md)*

*Implementation of [IToken](../interfaces/itoken.md).[originItem](../interfaces/itoken.md#originitem)*

Defined in bpmnServer/src/engine/Token.ts:65

___

### `Optional` parentToken

• **parentToken**? : *[Token](token.md)*

*Implementation of [IToken](../interfaces/itoken.md).[parentToken](../interfaces/itoken.md#optional-parenttoken)*

Defined in bpmnServer/src/engine/Token.ts:63

___

###  path

• **path**: *[Item](item.md)[]*

*Implementation of [IToken](../interfaces/itoken.md).[path](../interfaces/itoken.md#path)*

Defined in bpmnServer/src/engine/Token.ts:66

___

###  processId

• **processId**: *any*

*Implementation of [IToken](../interfaces/itoken.md).[processId](../interfaces/itoken.md#processid)*

Defined in bpmnServer/src/engine/Token.ts:69

___

###  startNodeId

• **startNodeId**: *any*

*Implementation of [IToken](../interfaces/itoken.md).[startNodeId](../interfaces/itoken.md#startnodeid)*

Defined in bpmnServer/src/engine/Token.ts:62

___

###  status

• **status**: *[TOKEN_STATUS](../enums/token_status.md)*

*Implementation of [IToken](../interfaces/itoken.md).[status](../interfaces/itoken.md#status)*

Defined in bpmnServer/src/engine/Token.ts:70

___

###  type

• **type**: *[TOKEN_TYPE](../enums/token_type.md)*

*Implementation of [IToken](../interfaces/itoken.md).[type](../interfaces/itoken.md#type)*

Defined in bpmnServer/src/engine/Token.ts:59

## Accessors

###  childrenTokens

• **get childrenTokens**(): *[Token](token.md)[]*

Defined in bpmnServer/src/engine/Token.ts:91

**Returns:** *[Token](token.md)[]*

___

###  currentItem

• **get currentItem**(): *[Item](item.md)*

Defined in bpmnServer/src/engine/Token.ts:75

**Returns:** *[Item](item.md)*

___

###  data

• **get data**(): *any*

Defined in bpmnServer/src/engine/Token.ts:72

**Returns:** *any*

___

###  firstItem

• **get firstItem**(): *[Item](item.md)*

Defined in bpmnServer/src/engine/Token.ts:78

**Returns:** *[Item](item.md)*

___

###  lastItem

• **get lastItem**(): *[Item](item.md)*

Defined in bpmnServer/src/engine/Token.ts:81

**Returns:** *[Item](item.md)*

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:298

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *void*

___

###  end

▸ **end**(): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:338

**Returns:** *Promise‹void›*

___

###  error

▸ **error**(`msg`: any): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:405

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  execute

▸ **execute**(`input`: any): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:221

this is the primary exectuion method for a token

**Parameters:**

Name | Type |
------ | ------ |
`input` | any |

**Returns:** *Promise‹void›*

___

###  getChildrenTokens

▸ **getChildrenTokens**(): *any[]*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:194

**Returns:** *any[]*

___

###  getSubProcessToken

▸ **getSubProcessToken**(): *[Token](token.md)*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:185

**Returns:** *[Token](token.md)*

___

###  goNext

▸ **goNext**(): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:361

**Returns:** *Promise‹void›*

___

###  log

▸ **log**(`msg`: any): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:402

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  preExecute

▸ **preExecute**(): *Promise‹boolean›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:206

**Returns:** *Promise‹boolean›*

___

###  preNext

▸ **preNext**(): *Promise‹boolean›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:213

**Returns:** *Promise‹boolean›*

___

###  processError

▸ **processError**(): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:268

**Returns:** *Promise‹void›*

___

###  restored

▸ **restored**(): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:180

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:176

**Returns:** *void*

___

###  save

▸ **save**(): *object*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:133

**Returns:** *object*

* **currentNode**: *any* = this.currentNode.id

* **dataPath**: *string* = this.dataPath

* **id**: *any* = this.id

* **loopId**: *any*

* **originItem**: *any*

* **parentToken**: *any*

* **startNodeId**: *any* = this.startNodeId

* **status**: *[TOKEN_STATUS](../enums/token_status.md)* = this.status

* **type**: *[TOKEN_TYPE](../enums/token_type.md)* = this.type

___

###  signal

▸ **signal**(`data`: any): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:314

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹void›*

___

###  stop

▸ **stop**(): *void*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:167

**Returns:** *void*

___

###  terminate

▸ **terminate**(): *Promise‹void›*

*Implementation of [IToken](../interfaces/itoken.md)*

Defined in bpmnServer/src/engine/Token.ts:305

 is called by Gateways to cancel current token

**Returns:** *Promise‹void›*

___

### `Static` load

▸ **load**(`execution`: [Execution](execution.md), `da`: any): *[Token](token.md)*

Defined in bpmnServer/src/engine/Token.ts:154

**Parameters:**

Name | Type |
------ | ------ |
`execution` | [Execution](execution.md) |
`da` | any |

**Returns:** *[Token](token.md)*

___

### `Static` startNewToken

▸ **startNewToken**(`type`: [TOKEN_TYPE](../enums/token_type.md), `execution`: any, `startNode`: any, `dataPath`: any, `parentToken`: [Token](token.md), `originItem`: [Item](item.md), `loop`: [Loop](loop.md), `data`: any, `noExecute`: boolean): *Promise‹[Token](token.md)‹››*

Defined in bpmnServer/src/engine/Token.ts:122

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`type` | [TOKEN_TYPE](../enums/token_type.md) | - | - |
`execution` | any | - | - |
`startNode` | any | - | - |
`dataPath` | any | - | - |
`parentToken` | [Token](token.md) | - | - |
`originItem` | [Item](item.md) | - | - |
`loop` | [Loop](loop.md) | - | - |
`data` | any | null |   |
`noExecute` | boolean | false | - |

**Returns:** *Promise‹[Token](token.md)‹››*
