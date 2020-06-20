[bpmn-server](../README.md) › [Definition](definition.md)

# Class: Definition

## Hierarchy

* **Definition**

## Implements

* [IDefinition](../interfaces/idefinition.md)

## Index

### Constructors

* [constructor](definition.md#constructor)

### Properties

* [flows](definition.md#flows)
* [logger](definition.md#logger)
* [name](definition.md#name)
* [nodes](definition.md#nodes)
* [processes](definition.md#processes)
* [rootElements](definition.md#rootelements)
* [source](definition.md#source)

### Methods

* [getDefinition](definition.md#getdefinition)
* [getJson](definition.md#getjson)
* [getNodeById](definition.md#getnodebyid)
* [getStartNode](definition.md#getstartnode)
* [load](definition.md#load)

## Constructors

###  constructor

\+ **new Definition**(`name`: string, `source`: string, `logger`: [Logger](logger.md)): *[Definition](definition.md)*

Defined in src/elements/Definition.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`source` | string |
`logger` | [Logger](logger.md) |

**Returns:** *[Definition](definition.md)*

## Properties

###  flows

• **flows**: *any[]* = []

*Implementation of [IDefinition](../interfaces/idefinition.md).[flows](../interfaces/idefinition.md#flows)*

Defined in src/elements/Definition.ts:38

___

###  logger

• **logger**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[logger](../interfaces/idefinition.md#logger)*

Defined in src/elements/Definition.ts:40

___

###  name

• **name**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[name](../interfaces/idefinition.md#name)*

Defined in src/elements/Definition.ts:34

___

###  nodes

• **nodes**: *Map‹any, any›* = new Map()

*Implementation of [IDefinition](../interfaces/idefinition.md).[nodes](../interfaces/idefinition.md#nodes)*

Defined in src/elements/Definition.ts:37

___

###  processes

• **processes**: *Map‹any, any›* = new Map()

*Implementation of [IDefinition](../interfaces/idefinition.md).[processes](../interfaces/idefinition.md#processes)*

Defined in src/elements/Definition.ts:35

___

###  rootElements

• **rootElements**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[rootElements](../interfaces/idefinition.md#rootelements)*

Defined in src/elements/Definition.ts:36

___

###  source

• **source**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[source](../interfaces/idefinition.md#source)*

Defined in src/elements/Definition.ts:39

## Methods

###  getDefinition

▸ **getDefinition**(`source`: any, `logger`: any): *Promise‹any›*

Defined in src/elements/Definition.ts:185

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |
`logger` | any |

**Returns:** *Promise‹any›*

___

###  getJson

▸ **getJson**(): *string*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in src/elements/Definition.ts:169

**Returns:** *string*

___

###  getNodeById

▸ **getNodeById**(`id`: any): *any*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in src/elements/Definition.ts:202

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *any*

___

###  getStartNode

▸ **getStartNode**(): *any*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in src/elements/Definition.ts:193

**Returns:** *any*

___

###  load

▸ **load**(): *Promise‹any›*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in src/elements/Definition.ts:71

**Returns:** *Promise‹any›*
