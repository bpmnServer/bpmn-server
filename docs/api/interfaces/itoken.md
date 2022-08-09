[bpmn-server](../README.md) › [IToken](itoken.md)

# Interface: IToken

## Hierarchy

* **IToken**

## Implemented by

* [Token](../classes/token.md)

## Index

### Properties

* [childrenTokens](itoken.md#childrentokens)
* [currentItem](itoken.md#currentitem)
* [currentNode](itoken.md#currentnode)
* [data](itoken.md#data)
* [dataPath](itoken.md#datapath)
* [execution](itoken.md#execution)
* [firstItem](itoken.md#firstitem)
* [id](itoken.md#id)
* [lastItem](itoken.md#lastitem)
* [loop](itoken.md#loop)
* [originItem](itoken.md#originitem)
* [parentToken](itoken.md#optional-parenttoken)
* [path](itoken.md#path)
* [processId](itoken.md#processid)
* [startNodeId](itoken.md#startnodeid)
* [status](itoken.md#status)
* [type](itoken.md#type)

### Methods

* [applyInput](itoken.md#applyinput)
* [end](itoken.md#end)
* [error](itoken.md#error)
* [execute](itoken.md#execute)
* [getChildrenTokens](itoken.md#getchildrentokens)
* [getSubProcessToken](itoken.md#getsubprocesstoken)
* [goNext](itoken.md#gonext)
* [log](itoken.md#log)
* [preExecute](itoken.md#preexecute)
* [preNext](itoken.md#prenext)
* [processError](itoken.md#processerror)
* [restored](itoken.md#restored)
* [resume](itoken.md#resume)
* [save](itoken.md#save)
* [signal](itoken.md#signal)
* [stop](itoken.md#stop)
* [terminate](itoken.md#terminate)

## Properties

###  childrenTokens

• **childrenTokens**: *[Token](../classes/token.md)[]*

Defined in bpmnServer/src/interfaces/engine.ts:26

___

###  currentItem

• **currentItem**: *[IItem](iitem.md)*

Defined in bpmnServer/src/interfaces/engine.ts:23

___

###  currentNode

• **currentNode**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:19

___

###  data

• **data**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:22

___

###  dataPath

• **dataPath**: *string*

Defined in bpmnServer/src/interfaces/engine.ts:12

___

###  execution

• **execution**: *[IExecution](iexecution.md)*

Defined in bpmnServer/src/interfaces/engine.ts:11

___

###  firstItem

• **firstItem**: *[Item](../classes/item.md)*

Defined in bpmnServer/src/interfaces/engine.ts:25

___

###  id

• **id**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:9

___

###  lastItem

• **lastItem**: *[IItem](iitem.md)*

Defined in bpmnServer/src/interfaces/engine.ts:24

___

###  loop

• **loop**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:18

___

###  originItem

• **originItem**: *[IItem](iitem.md)*

Defined in bpmnServer/src/interfaces/engine.ts:16

___

### `Optional` parentToken

• **parentToken**? : *[IToken](itoken.md)*

Defined in bpmnServer/src/interfaces/engine.ts:14

___

###  path

• **path**: *[IItem](iitem.md)[]*

Defined in bpmnServer/src/interfaces/engine.ts:17

___

###  processId

• **processId**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:20

___

###  startNodeId

• **startNodeId**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:13

___

###  status

• **status**: *[TOKEN_STATUS](../enums/token_status.md)*

Defined in bpmnServer/src/interfaces/engine.ts:21

___

###  type

• **type**: *any*

Defined in bpmnServer/src/interfaces/engine.ts:10

## Methods

###  applyInput

▸ **applyInput**(`inputData`: any): *void*

Defined in bpmnServer/src/interfaces/engine.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *void*

___

###  end

▸ **end**(): *Promise‹void›*

Defined in bpmnServer/src/interfaces/engine.ts:56

**Returns:** *Promise‹void›*

___

###  error

▸ **error**(`msg`: any): *void*

Defined in bpmnServer/src/interfaces/engine.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  execute

▸ **execute**(`inputData`: any): *Promise‹any›*

Defined in bpmnServer/src/interfaces/engine.ts:48

this is the primary exectuion method for a token

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *Promise‹any›*

___

###  getChildrenTokens

▸ **getChildrenTokens**(): *any[]*

Defined in bpmnServer/src/interfaces/engine.ts:42

**Returns:** *any[]*

___

###  getSubProcessToken

▸ **getSubProcessToken**(): *[IToken](itoken.md)*

Defined in bpmnServer/src/interfaces/engine.ts:58

**Returns:** *[IToken](itoken.md)*

___

###  goNext

▸ **goNext**(): *Promise‹void›*

Defined in bpmnServer/src/interfaces/engine.ts:57

**Returns:** *Promise‹void›*

___

###  log

▸ **log**(`msg`: any): *void*

Defined in bpmnServer/src/interfaces/engine.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  preExecute

▸ **preExecute**(): *Promise‹boolean›*

Defined in bpmnServer/src/interfaces/engine.ts:43

**Returns:** *Promise‹boolean›*

___

###  preNext

▸ **preNext**(): *Promise‹boolean›*

Defined in bpmnServer/src/interfaces/engine.ts:44

**Returns:** *Promise‹boolean›*

___

###  processError

▸ **processError**(): *any*

Defined in bpmnServer/src/interfaces/engine.ts:40

**Returns:** *any*

___

###  restored

▸ **restored**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:41

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:38

**Returns:** *void*

___

###  save

▸ **save**(): *object*

Defined in bpmnServer/src/interfaces/engine.ts:27

**Returns:** *object*

* **currentNode**: *any*

* **dataPath**: *string*

* **id**: *any*

* **loopId**: *any*

* **originItem**: *any*

* **parentToken**: *any*

* **startNodeId**: *any*

* **status**: *[TOKEN_STATUS](../enums/token_status.md)*

* **type**: *any*

___

###  signal

▸ **signal**(`data`: any): *Promise‹any›*

Defined in bpmnServer/src/interfaces/engine.ts:55

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

___

###  stop

▸ **stop**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:39

**Returns:** *void*

___

###  terminate

▸ **terminate**(): *void*

Defined in bpmnServer/src/interfaces/engine.ts:54

 is called by Gateways to cancel current token

**Returns:** *void*
