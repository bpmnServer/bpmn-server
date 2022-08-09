[bpmn-server](../README.md) › [BpmnModelData](bpmnmodeldata.md)

# Class: BpmnModelData

## Hierarchy

* **BpmnModelData**

## Implements

* [IBpmnModelData](../interfaces/ibpmnmodeldata.md)

## Index

### Constructors

* [constructor](bpmnmodeldata.md#constructor)

### Properties

* [events](bpmnmodeldata.md#events)
* [name](bpmnmodeldata.md#name)
* [processes](bpmnmodeldata.md#processes)
* [saved](bpmnmodeldata.md#saved)
* [source](bpmnmodeldata.md#source)
* [svg](bpmnmodeldata.md#svg)

### Methods

* [parse](bpmnmodeldata.md#parse)

## Constructors

###  constructor

\+ **new BpmnModelData**(`name`: any, `source`: any, `svg`: any, `processes`: any, `events`: any): *[BpmnModelData](bpmnmodeldata.md)*

Defined in bpmnServer/src/datastore/ModelsData.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`source` | any |
`svg` | any |
`processes` | any |
`events` | any |

**Returns:** *[BpmnModelData](bpmnmodeldata.md)*

## Properties

###  events

• **events**: *[IEventData](../interfaces/ieventdata.md)[]*

*Implementation of [IBpmnModelData](../interfaces/ibpmnmodeldata.md).[events](../interfaces/ibpmnmodeldata.md#events)*

Defined in bpmnServer/src/datastore/ModelsData.ts:16

___

###  name

• **name**: *any*

*Implementation of [IBpmnModelData](../interfaces/ibpmnmodeldata.md).[name](../interfaces/ibpmnmodeldata.md#name)*

Defined in bpmnServer/src/datastore/ModelsData.ts:12

___

###  processes

• **processes**: *[IProcessData](../interfaces/iprocessdata.md)[]*

*Implementation of [IBpmnModelData](../interfaces/ibpmnmodeldata.md).[processes](../interfaces/ibpmnmodeldata.md#processes)*

Defined in bpmnServer/src/datastore/ModelsData.ts:15

___

###  saved

• **saved**: *any*

*Implementation of [IBpmnModelData](../interfaces/ibpmnmodeldata.md).[saved](../interfaces/ibpmnmodeldata.md#saved)*

Defined in bpmnServer/src/datastore/ModelsData.ts:17

___

###  source

• **source**: *any*

*Implementation of [IBpmnModelData](../interfaces/ibpmnmodeldata.md).[source](../interfaces/ibpmnmodeldata.md#source)*

Defined in bpmnServer/src/datastore/ModelsData.ts:13

___

###  svg

• **svg**: *any*

*Implementation of [IBpmnModelData](../interfaces/ibpmnmodeldata.md).[svg](../interfaces/ibpmnmodeldata.md#svg)*

Defined in bpmnServer/src/datastore/ModelsData.ts:14

## Methods

###  parse

▸ **parse**(`definition`: [Definition](definition.md)): *void*

Defined in bpmnServer/src/datastore/ModelsData.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`definition` | [Definition](definition.md) |

**Returns:** *void*
