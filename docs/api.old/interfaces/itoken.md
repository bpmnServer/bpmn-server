[bpmn-server](../README.md) › [IToken](itoken.md)

# Interface: IToken

## Hierarchy

* **IToken**

## Implemented by

* [Token](../classes/token.md)

## Index

### Properties

* [branchNode](itoken.md#optional-branchnode)
* [currentItem](itoken.md#currentitem)
* [currentNode](itoken.md#currentnode)
* [data](itoken.md#data)
* [dataPath](itoken.md#datapath)
* [execution](itoken.md#execution)
* [id](itoken.md#id)
* [lastItem](itoken.md#lastitem)
* [parentToken](itoken.md#optional-parenttoken)
* [path](itoken.md#path)
* [processId](itoken.md#processid)
* [startNodeId](itoken.md#startnodeid)
* [status](itoken.md#status)

### Methods

* [applyInput](itoken.md#applyinput)
* [end](itoken.md#end)
* [execute](itoken.md#execute)
* [getChildrenTokens](itoken.md#getchildrentokens)
* [goNext](itoken.md#gonext)
* [log](itoken.md#log)
* [preExecute](itoken.md#preexecute)
* [preNext](itoken.md#prenext)
* [restored](itoken.md#restored)
* [resume](itoken.md#resume)
* [save](itoken.md#save)
* [signal](itoken.md#signal)
* [terminate](itoken.md#terminate)

## Properties

### `Optional` branchNode

• **branchNode**? : *any*

Defined in src/interfaces/engine.ts:13

___

###  currentItem

• **currentItem**: *[IItem](iitem.md)*

Defined in src/interfaces/engine.ts:19

___

###  currentNode

• **currentNode**: *any*

Defined in src/interfaces/engine.ts:15

___

###  data

• **data**: *any*

Defined in src/interfaces/engine.ts:18

___

###  dataPath

• **dataPath**: *string*

Defined in src/interfaces/engine.ts:10

___

###  execution

• **execution**: *[IExecution](iexecution.md)*

Defined in src/interfaces/engine.ts:9

___

###  id

• **id**: *any*

Defined in src/interfaces/engine.ts:8

___

###  lastItem

• **lastItem**: *[IItem](iitem.md)*

Defined in src/interfaces/engine.ts:20

___

### `Optional` parentToken

• **parentToken**? : *[IToken](itoken.md)*

Defined in src/interfaces/engine.ts:12

___

###  path

• **path**: *[IItem](iitem.md)[]*

Defined in src/interfaces/engine.ts:14

___

###  processId

• **processId**: *any*

Defined in src/interfaces/engine.ts:16

___

###  startNodeId

• **startNodeId**: *any*

Defined in src/interfaces/engine.ts:11

___

###  status

• **status**: *[TOKEN_STATUS](../enums/token_status.md)*

Defined in src/interfaces/engine.ts:17

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any): *void*

Defined in src/interfaces/engine.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *void*

___

###  end

▸ **end**(): *Promise‹void›*

Defined in src/interfaces/engine.ts:47

**Returns:** *Promise‹void›*

___

###  execute

▸ **execute**(`inputData`: any): *Promise‹any›*

Defined in src/interfaces/engine.ts:39

this is the primary exectuion method for a token

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *Promise‹any›*

___

###  getChildrenTokens

▸ **getChildrenTokens**(): *any[]*

Defined in src/interfaces/engine.ts:33

**Returns:** *any[]*

___

###  goNext

▸ **goNext**(): *Promise‹void›*

Defined in src/interfaces/engine.ts:48

**Returns:** *Promise‹void›*

___

###  log

▸ **log**(`msg`: any): *void*

Defined in src/interfaces/engine.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  preExecute

▸ **preExecute**(): *Promise‹boolean›*

Defined in src/interfaces/engine.ts:34

**Returns:** *Promise‹boolean›*

___

###  preNext

▸ **preNext**(): *Promise‹boolean›*

Defined in src/interfaces/engine.ts:35

**Returns:** *Promise‹boolean›*

___

###  restored

▸ **restored**(): *void*

Defined in src/interfaces/engine.ts:32

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

Defined in src/interfaces/engine.ts:31

**Returns:** *void*

___

###  save

▸ **save**(): *object*

Defined in src/interfaces/engine.ts:21

**Returns:** *object*

* **branchNode**: *any*

* **currentNode**: *any*

* **dataPath**: *string*

* **id**: *any*

* **loopId**: *any*

* **parentToken**: *any*

* **startNodeId**: *any*

* **status**: *[TOKEN_STATUS](../enums/token_status.md)*

___

###  signal

▸ **signal**(`data`: any): *Promise‹any›*

Defined in src/interfaces/engine.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  terminate

▸ **terminate**(): *void*

Defined in src/interfaces/engine.ts:45

 is called by Gateways to cancel current token

**Returns:** *void*
