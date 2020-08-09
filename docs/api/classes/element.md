[bpmn-server](../README.md) › [Element](element.md)

# Class: Element

## Hierarchy

* **Element**

  ↳ [Node](node.md)

  ↳ [Flow](flow.md)

## Implements

* [IElement](../interfaces/ielement.md)

## Index

### Properties

* [behaviours](element.md#behaviours)
* [id](element.md#id)
* [name](element.md#name)
* [subType](element.md#subtype)
* [type](element.md#type)

### Methods

* [addBehaviour](element.md#addbehaviour)
* [continue](element.md#continue)
* [describe](element.md#describe)
* [getBehaviour](element.md#getbehaviour)
* [hasBehaviour](element.md#hasbehaviour)
* [restored](element.md#restored)
* [resume](element.md#resume)

## Properties

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of [IElement](../interfaces/ielement.md).[behaviours](../interfaces/ielement.md#behaviours)*

Defined in src/elements/Element.ts:17

___

###  id

• **id**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[id](../interfaces/ielement.md#id)*

Defined in src/elements/Element.ts:13

___

###  name

• **name**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[name](../interfaces/ielement.md#name)*

Defined in src/elements/Element.ts:16

___

###  subType

• **subType**: *any*

Defined in src/elements/Element.ts:15

___

###  type

• **type**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[type](../interfaces/ielement.md#type)*

Defined in src/elements/Element.ts:14

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of [IElement](../interfaces/ielement.md)*

Defined in src/elements/Element.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

___

###  continue

▸ **continue**(`item`: [Item](item.md)): *void*

Defined in src/elements/Element.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  describe

▸ **describe**(): *string[][]*

*Implementation of [IElement](../interfaces/ielement.md)*

Defined in src/elements/Element.ts:21

**Returns:** *string[][]*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of [IElement](../interfaces/ielement.md)*

Defined in src/elements/Element.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of [IElement](../interfaces/ielement.md)*

Defined in src/elements/Element.ts:32

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

___

###  restored

▸ **restored**(`item`: [Item](item.md)): *void*

Defined in src/elements/Element.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [Item](item.md)): *void*

Defined in src/elements/Element.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*
