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

* [accessRules](definition.md#accessrules)
* [flows](definition.md#flows)
* [logger](definition.md#logger)
* [moddle](definition.md#moddle)
* [name](definition.md#name)
* [nodes](definition.md#nodes)
* [processes](definition.md#processes)
* [rootElements](definition.md#rootelements)
* [server](definition.md#server)
* [source](definition.md#source)

### Methods

* [getDefinition](definition.md#getdefinition)
* [getFields](definition.md#getfields)
* [getJson](definition.md#getjson)
* [getNodeById](definition.md#getnodebyid)
* [getStartNode](definition.md#getstartnode)
* [getStartNodes](definition.md#getstartnodes)
* [load](definition.md#load)

## Constructors

###  constructor

\+ **new Definition**(`name`: string, `source`: string, `server`: [BPMNServer](bpmnserver.md)): *[Definition](definition.md)*

Defined in bpmnServer/src/elements/Definition.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`source` | string |
`server` | [BPMNServer](bpmnserver.md) |

**Returns:** *[Definition](definition.md)*

## Properties

###  accessRules

• **accessRules**: *any[]* = []

*Implementation of [IDefinition](../interfaces/idefinition.md).[accessRules](../interfaces/idefinition.md#accessrules)*

Defined in bpmnServer/src/elements/Definition.ts:30

___

###  flows

• **flows**: *any[]* = []

*Implementation of [IDefinition](../interfaces/idefinition.md).[flows](../interfaces/idefinition.md#flows)*

Defined in bpmnServer/src/elements/Definition.ts:25

___

###  logger

• **logger**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[logger](../interfaces/idefinition.md#logger)*

Defined in bpmnServer/src/elements/Definition.ts:27

___

###  moddle

• **moddle**: *any*

Defined in bpmnServer/src/elements/Definition.ts:29

___

###  name

• **name**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[name](../interfaces/idefinition.md#name)*

Defined in bpmnServer/src/elements/Definition.ts:21

___

###  nodes

• **nodes**: *Map‹any, any›* = new Map()

*Implementation of [IDefinition](../interfaces/idefinition.md).[nodes](../interfaces/idefinition.md#nodes)*

Defined in bpmnServer/src/elements/Definition.ts:24

___

###  processes

• **processes**: *Map‹any, any›* = new Map()

*Implementation of [IDefinition](../interfaces/idefinition.md).[processes](../interfaces/idefinition.md#processes)*

Defined in bpmnServer/src/elements/Definition.ts:22

___

###  rootElements

• **rootElements**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[rootElements](../interfaces/idefinition.md#rootelements)*

Defined in bpmnServer/src/elements/Definition.ts:23

___

###  server

• **server**: *any*

Defined in bpmnServer/src/elements/Definition.ts:28

___

###  source

• **source**: *any*

*Implementation of [IDefinition](../interfaces/idefinition.md).[source](../interfaces/idefinition.md#source)*

Defined in bpmnServer/src/elements/Definition.ts:26

## Methods

###  getDefinition

▸ **getDefinition**(`source`: any, `logger`: any): *Promise‹any›*

Defined in bpmnServer/src/elements/Definition.ts:217

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |
`logger` | any |

**Returns:** *Promise‹any›*

___

###  getFields

▸ **getFields**(`elementId`: any): *Promise‹any›*

Defined in bpmnServer/src/elements/Definition.ts:224

**Parameters:**

Name | Type |
------ | ------ |
`elementId` | any |

**Returns:** *Promise‹any›*

___

###  getJson

▸ **getJson**(): *string*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in bpmnServer/src/elements/Definition.ts:196

**Returns:** *string*

___

###  getNodeById

▸ **getNodeById**(`id`: any): *any*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in bpmnServer/src/elements/Definition.ts:249

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *any*

___

###  getStartNode

▸ **getStartNode**(): *any*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in bpmnServer/src/elements/Definition.ts:246

**Returns:** *any*

___

###  getStartNodes

▸ **getStartNodes**(`userInvokable`: boolean): *any[]*

Defined in bpmnServer/src/elements/Definition.ts:235

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`userInvokable` | boolean | false |

**Returns:** *any[]*

___

###  load

▸ **load**(): *Promise‹any›*

*Implementation of [IDefinition](../interfaces/idefinition.md)*

Defined in bpmnServer/src/elements/Definition.ts:72

**Returns:** *Promise‹any›*
