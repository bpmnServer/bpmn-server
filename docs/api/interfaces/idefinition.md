[bpmn-server](../README.md) › [IDefinition](idefinition.md)

# Interface: IDefinition

## Hierarchy

* **IDefinition**

## Implemented by

* [Definition](../classes/definition.md)

## Index

### Properties

* [flows](idefinition.md#flows)
* [logger](idefinition.md#logger)
* [name](idefinition.md#name)
* [nodes](idefinition.md#nodes)
* [processes](idefinition.md#processes)
* [rootElements](idefinition.md#rootelements)
* [source](idefinition.md#source)

### Methods

* [getDefinition](idefinition.md#getdefinition)
* [getJson](idefinition.md#getjson)
* [getNodeById](idefinition.md#getnodebyid)
* [getStartNode](idefinition.md#getstartnode)
* [load](idefinition.md#load)

## Properties

###  flows

• **flows**: *any[]*

Defined in src/interfaces/elements.ts:8

___

###  logger

• **logger**: *any*

Defined in src/interfaces/elements.ts:10

___

###  name

• **name**: *any*

Defined in src/interfaces/elements.ts:4

___

###  nodes

• **nodes**: *Map‹any, any›*

Defined in src/interfaces/elements.ts:7

___

###  processes

• **processes**: *Map‹any, any›*

Defined in src/interfaces/elements.ts:5

___

###  rootElements

• **rootElements**: *any*

Defined in src/interfaces/elements.ts:6

___

###  source

• **source**: *any*

Defined in src/interfaces/elements.ts:9

## Methods

###  getDefinition

▸ **getDefinition**(`source`: any, `logger`: [ILogger](ilogger.md)): *Promise‹any›*

Defined in src/interfaces/elements.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |
`logger` | [ILogger](ilogger.md) |

**Returns:** *Promise‹any›*

___

###  getJson

▸ **getJson**(): *string*

Defined in src/interfaces/elements.ts:12

**Returns:** *string*

___

###  getNodeById

▸ **getNodeById**(`id`: any): *[Node](../classes/node.md)*

Defined in src/interfaces/elements.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *[Node](../classes/node.md)*

___

###  getStartNode

▸ **getStartNode**(): *[Node](../classes/node.md)*

Defined in src/interfaces/elements.ts:14

**Returns:** *[Node](../classes/node.md)*

___

###  load

▸ **load**(): *Promise‹any›*

Defined in src/interfaces/elements.ts:11

**Returns:** *Promise‹any›*
