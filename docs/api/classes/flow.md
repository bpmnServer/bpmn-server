[bpmn-server](../README.md) › [Flow](flow.md)

# Class: Flow

## Hierarchy

* [Element](element.md)

  ↳ **Flow**

  ↳ [MessageFlow](messageflow.md)

## Implements

* [IElement](../interfaces/ielement.md)
* [IFlow](../interfaces/iflow.md)

## Index

### Constructors

* [constructor](flow.md#constructor)

### Properties

* [behaviours](flow.md#behaviours)
* [def](flow.md#def)
* [from](flow.md#from)
* [id](flow.md#id)
* [isMessageFlow](flow.md#ismessageflow)
* [name](flow.md#name)
* [to](flow.md#to)
* [type](flow.md#type)

### Methods

* [addBehaviour](flow.md#addbehaviour)
* [continue](flow.md#continue)
* [describe](flow.md#describe)
* [execute](flow.md#execute)
* [getBehaviour](flow.md#getbehaviour)
* [hasBehaviour](flow.md#hasbehaviour)
* [restored](flow.md#restored)
* [resume](flow.md#resume)
* [run](flow.md#run)

## Constructors

###  constructor

\+ **new Flow**(`id`: any, `type`: any, `from`: any, `to`: any, `def`: any): *[Flow](flow.md)*

Defined in src/elements/Flow.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`type` | any |
`from` | any |
`to` | any |
`def` | any |

**Returns:** *[Flow](flow.md)*

## Properties

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of [IFlow](../interfaces/iflow.md).[behaviours](../interfaces/iflow.md#behaviours)*

*Inherited from [Node](node.md).[behaviours](node.md#behaviours)*

Defined in src/elements/Element.ts:16

___

###  def

• **def**: *any*

Defined in src/elements/Flow.ts:13

___

###  from

• **from**: *[Node](node.md)*

Defined in src/elements/Flow.ts:11

___

###  id

• **id**: *any*

*Implementation of [IFlow](../interfaces/iflow.md).[id](../interfaces/iflow.md#id)*

*Inherited from [Node](node.md).[id](node.md#id)*

Defined in src/elements/Element.ts:13

___

###  isMessageFlow

• **isMessageFlow**: *boolean* = false

Defined in src/elements/Flow.ts:14

___

###  name

• **name**: *any*

*Implementation of [IFlow](../interfaces/iflow.md).[name](../interfaces/iflow.md#name)*

*Inherited from [Flow](flow.md).[name](flow.md#name)*

Defined in src/elements/Element.ts:15

___

###  to

• **to**: *[Node](node.md)*

Defined in src/elements/Flow.ts:12

___

###  type

• **type**: *any*

*Implementation of [IFlow](../interfaces/iflow.md).[type](../interfaces/iflow.md#type)*

*Inherited from [Node](node.md).[type](node.md#type)*

Defined in src/elements/Element.ts:14

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Inherited from [Node](node.md).[addBehaviour](node.md#addbehaviour)*

Defined in src/elements/Element.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

___

###  continue

▸ **continue**(`item`: [Item](item.md)): *void*

*Inherited from [Flow](flow.md).[continue](flow.md#continue)*

Defined in src/elements/Element.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  describe

▸ **describe**(): *any[][]*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Overrides [Node](node.md).[describe](node.md#describe)*

Defined in src/elements/Flow.ts:24

**Returns:** *any[][]*

___

###  execute

▸ **execute**(`item`: any): *Promise‹void›*

Defined in src/elements/Flow.ts:58

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹void›*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Inherited from [Node](node.md).[getBehaviour](node.md#getbehaviour)*

Defined in src/elements/Element.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Inherited from [Node](node.md).[hasBehaviour](node.md#hasbehaviour)*

Defined in src/elements/Element.ts:31

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

*Inherited from [Node](node.md).[restored](node.md#restored)*

Defined in src/elements/Element.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [Item](item.md)): *void*

*Inherited from [Flow](flow.md).[resume](flow.md#resume)*

Defined in src/elements/Element.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  run

▸ **run**(`item`: [Item](item.md)): *[FLOW_ACTION](../enums/flow_action.md)*

Defined in src/elements/Flow.ts:41

<Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
 otherwise, flow will be discarded.
</Rule>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [Item](item.md) |   |

**Returns:** *[FLOW_ACTION](../enums/flow_action.md)*
