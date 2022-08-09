[bpmn-server](../README.md) › [Loop](loop.md)

# Class: Loop

## Hierarchy

* **Loop**

## Index

### Constructors

* [constructor](loop.md#constructor)

### Properties

* [completed](loop.md#completed)
* [dataPath](loop.md#datapath)
* [definition](loop.md#definition)
* [id](loop.md#id)
* [items](loop.md#items)
* [node](loop.md#node)
* [ownerToken](loop.md#ownertoken)
* [sequence](loop.md#sequence)

### Methods

* [getKeyName](loop.md#getkeyname)
* [getNext](loop.md#getnext)
* [isDone](loop.md#isdone)
* [isSequential](loop.md#issequential)
* [save](loop.md#save)
* [checkNext](loop.md#static-checknext)
* [checkStart](loop.md#static-checkstart)
* [load](loop.md#static-load)

## Constructors

###  constructor

\+ **new Loop**(`node`: [Node](node.md), `token`: [Token](token.md), `dataObject?`: any): *[Loop](loop.md)*

Defined in bpmnServer/src/engine/Loop.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](node.md) |
`token` | [Token](token.md) |
`dataObject?` | any |

**Returns:** *[Loop](loop.md)*

## Properties

###  completed

• **completed**: *any*

Defined in bpmnServer/src/engine/Loop.ts:14

___

###  dataPath

• **dataPath**: *any*

Defined in bpmnServer/src/engine/Loop.ts:12

___

###  definition

• **definition**: *[LoopBehaviour](loopbehaviour.md)*

Defined in bpmnServer/src/engine/Loop.ts:10

___

###  id

• **id**: *any*

Defined in bpmnServer/src/engine/Loop.ts:7

___

###  items

• **items**: *any[]*

Defined in bpmnServer/src/engine/Loop.ts:13

___

###  node

• **node**: *any*

Defined in bpmnServer/src/engine/Loop.ts:8

___

###  ownerToken

• **ownerToken**: *any*

Defined in bpmnServer/src/engine/Loop.ts:9

___

###  sequence

• **sequence**: *any*

Defined in bpmnServer/src/engine/Loop.ts:11

## Methods

###  getKeyName

▸ **getKeyName**(): *string*

Defined in bpmnServer/src/engine/Loop.ts:57

**Returns:** *string*

___

###  getNext

▸ **getNext**(): *any*

Defined in bpmnServer/src/engine/Loop.ts:63

**Returns:** *any*

___

###  isDone

▸ **isDone**(): *boolean*

Defined in bpmnServer/src/engine/Loop.ts:60

**Returns:** *boolean*

___

###  isSequential

▸ **isSequential**(): *any*

Defined in bpmnServer/src/engine/Loop.ts:15

**Returns:** *any*

___

###  save

▸ **save**(): *object*

Defined in bpmnServer/src/engine/Loop.ts:40

**Returns:** *object*

* **completed**: *any* = this.completed

* **dataPath**: *any* = this.dataPath

* **id**: *any* = this.id

* **nodeId**: *any* = this.node.id

* **ownerTokenId**: *any* = this.ownerToken.id

* **sequence**: *any* = this.sequence

___

### `Static` checkNext

▸ **checkNext**(`token`: [Token](token.md)): *Promise‹boolean›*

Defined in bpmnServer/src/engine/Loop.ts:115

**Parameters:**

Name | Type |
------ | ------ |
`token` | [Token](token.md) |

**Returns:** *Promise‹boolean›*

___

### `Static` checkStart

▸ **checkStart**(`token`: any): *Promise‹boolean›*

Defined in bpmnServer/src/engine/Loop.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`token` | any |

**Returns:** *Promise‹boolean›*

___

### `Static` load

▸ **load**(`execution`: any, `dataObject`: any): *[Loop](loop.md)*

Defined in bpmnServer/src/engine/Loop.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`execution` | any |
`dataObject` | any |

**Returns:** *[Loop](loop.md)*
