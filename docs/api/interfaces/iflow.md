[bpmn-server](../README.md) › [IFlow](iflow.md)

# Interface: IFlow

## Hierarchy

* [IElement](ielement.md)

  ↳ **IFlow**

## Implemented by

* [Flow](../classes/flow.md)
* [MessageFlow](../classes/messageflow.md)

## Index

### Properties

* [behaviours](iflow.md#behaviours)
* [id](iflow.md#id)
* [name](iflow.md#name)
* [type](iflow.md#type)

### Methods

* [addBehaviour](iflow.md#addbehaviour)
* [continue](iflow.md#continue)
* [describe](iflow.md#describe)
* [getBehaviour](iflow.md#getbehaviour)
* [hasBehaviour](iflow.md#hasbehaviour)
* [restored](iflow.md#restored)
* [resume](iflow.md#resume)

## Properties

###  behaviours

• **behaviours**: *Map‹any, any›*

*Inherited from [IElement](ielement.md).[behaviours](ielement.md#behaviours)*

Defined in bpmnServer/src/interfaces/elements.ts:24

___

###  id

• **id**: *any*

*Inherited from [IElement](ielement.md).[id](ielement.md#id)*

Defined in bpmnServer/src/interfaces/elements.ts:21

___

###  name

• **name**: *any*

*Inherited from [IElement](ielement.md).[name](ielement.md#name)*

Defined in bpmnServer/src/interfaces/elements.ts:23

___

###  type

• **type**: *any*

*Inherited from [IElement](ielement.md).[type](ielement.md#type)*

Defined in bpmnServer/src/interfaces/elements.ts:22

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Inherited from [IElement](ielement.md).[addBehaviour](ielement.md#addbehaviour)*

Defined in bpmnServer/src/interfaces/elements.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

___

###  continue

▸ **continue**(`item`: [IItem](iitem.md)): *void*

*Inherited from [IElement](ielement.md).[continue](ielement.md#continue)*

Defined in bpmnServer/src/interfaces/elements.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*

___

###  describe

▸ **describe**(): *string[][]*

*Inherited from [IElement](ielement.md).[describe](ielement.md#describe)*

Defined in bpmnServer/src/interfaces/elements.ts:26

**Returns:** *string[][]*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Inherited from [IElement](ielement.md).[getBehaviour](ielement.md#getbehaviour)*

Defined in bpmnServer/src/interfaces/elements.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Inherited from [IElement](ielement.md).[hasBehaviour](ielement.md#hasbehaviour)*

Defined in bpmnServer/src/interfaces/elements.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

___

###  restored

▸ **restored**(`item`: [IItem](iitem.md)): *void*

*Inherited from [IElement](ielement.md).[restored](ielement.md#restored)*

Defined in bpmnServer/src/interfaces/elements.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [IItem](iitem.md)): *void*

*Inherited from [IElement](ielement.md).[resume](ielement.md#resume)*

Defined in bpmnServer/src/interfaces/elements.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*
