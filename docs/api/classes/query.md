[bpmn-server](../README.md) › [Query](query.md)

# Class: Query

## Hierarchy

* **Query**

## Index

### Constructors

* [constructor](query.md#constructor)

### Methods

* [data](query.md#data)
* [instanceId](query.md#instanceid)
* [instanceName](query.md#instancename)
* [instanceStatus](query.md#instancestatus)
* [itemElementId](query.md#itemelementid)
* [itemId](query.md#itemid)
* [itemName](query.md#itemname)
* [itemStatus](query.md#itemstatus)

## Constructors

###  constructor

\+ **new Query**(`__namedParameters`: object): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:107

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`data` | any | null |
`instanceEndedAt` | any | null |
`instanceId` | any | null |
`instanceName` | any | null |
`instanceSaved` | any | null |
`instanceStartedAt` | any | null |
`instanceStatus` | [EXECUTION_STATUS](../enums/execution_status.md) | null |
`itemElementId` | any | null |
`itemEndedAt` | any | null |
`itemId` | any | null |
`itemKey` | any | null |
`itemName` | any | null |
`itemSeq` | any | null |
`itemStartedAt` | any | null |
`itemStatus` | [ITEM_STATUS](../enums/item_status.md) | null |
`itemTokenId` | any | null |
`itemType` | [BPMN_TYPE](../enums/bpmn_type.md) | null |

**Returns:** *[Query](query.md)*

## Methods

###  data

▸ **data**(`val`: any): *this*

Defined in bpmnServer/src/engine/Model.ts:154

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*

___

###  instanceId

▸ **instanceId**(`val`: any): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:151

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Query](query.md)*

___

###  instanceName

▸ **instanceName**(`val`: any): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Query](query.md)*

___

###  instanceStatus

▸ **instanceStatus**(`val`: [EXECUTION_STATUS](../enums/execution_status.md)): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:153

**Parameters:**

Name | Type |
------ | ------ |
`val` | [EXECUTION_STATUS](../enums/execution_status.md) |

**Returns:** *[Query](query.md)*

___

###  itemElementId

▸ **itemElementId**(`val`: any): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:158

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Query](query.md)*

___

###  itemId

▸ **itemId**(`val`: any): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:155

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Query](query.md)*

___

###  itemName

▸ **itemName**(`val`: any): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:156

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Query](query.md)*

___

###  itemStatus

▸ **itemStatus**(`val`: [ITEM_STATUS](../enums/item_status.md)): *[Query](query.md)*

Defined in bpmnServer/src/engine/Model.ts:157

**Parameters:**

Name | Type |
------ | ------ |
`val` | [ITEM_STATUS](../enums/item_status.md) |

**Returns:** *[Query](query.md)*
