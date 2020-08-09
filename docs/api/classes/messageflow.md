[bpmn-server](../README.md) › [MessageFlow](messageflow.md)

# Class: MessageFlow

<Rule>MessageFlow: can only be sent to active node in waiting
or to a start event
</Rule>

## Hierarchy

  ↳ [Flow](flow.md)

  ↳ **MessageFlow**

## Implements

* [IElement](../interfaces/ielement.md)
* [IFlow](../interfaces/iflow.md)

## Index

### Constructors

* [constructor](messageflow.md#constructor)

### Properties

* [behaviours](messageflow.md#behaviours)
* [def](messageflow.md#def)
* [from](messageflow.md#from)
* [id](messageflow.md#id)
* [isMessageFlow](messageflow.md#ismessageflow)
* [name](messageflow.md#name)
* [subType](messageflow.md#subtype)
* [to](messageflow.md#to)
* [type](messageflow.md#type)

### Methods

* [addBehaviour](messageflow.md#addbehaviour)
* [continue](messageflow.md#continue)
* [describe](messageflow.md#describe)
* [execute](messageflow.md#execute)
* [getBehaviour](messageflow.md#getbehaviour)
* [hasBehaviour](messageflow.md#hasbehaviour)
* [restored](messageflow.md#restored)
* [resume](messageflow.md#resume)
* [run](messageflow.md#run)

## Constructors

###  constructor

\+ **new MessageFlow**(`id`: any, `type`: any, `from`: any, `to`: any, `def`: any): *[MessageFlow](messageflow.md)*

*Inherited from [Flow](flow.md).[constructor](flow.md#constructor)*

Defined in src/elements/Flow.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`type` | any |
`from` | any |
`to` | any |
`def` | any |

**Returns:** *[MessageFlow](messageflow.md)*

## Properties

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of [IFlow](../interfaces/iflow.md).[behaviours](../interfaces/iflow.md#behaviours)*

*Inherited from [Element](element.md).[behaviours](element.md#behaviours)*

Defined in src/elements/Element.ts:17

___

###  def

• **def**: *any*

*Inherited from [Flow](flow.md).[def](flow.md#def)*

Defined in src/elements/Flow.ts:13

___

###  from

• **from**: *[Node](node.md)*

*Inherited from [Flow](flow.md).[from](flow.md#from)*

Defined in src/elements/Flow.ts:11

___

###  id

• **id**: *any*

*Implementation of [IFlow](../interfaces/iflow.md).[id](../interfaces/iflow.md#id)*

*Inherited from [Element](element.md).[id](element.md#id)*

Defined in src/elements/Element.ts:13

___

###  isMessageFlow

• **isMessageFlow**: *boolean* = true

*Overrides [Flow](flow.md).[isMessageFlow](flow.md#ismessageflow)*

Defined in src/elements/Flow.ts:70

___

###  name

• **name**: *any*

*Implementation of [IFlow](../interfaces/iflow.md).[name](../interfaces/iflow.md#name)*

*Inherited from [Element](element.md).[name](element.md#name)*

Defined in src/elements/Element.ts:16

___

###  subType

• **subType**: *any*

*Inherited from [Element](element.md).[subType](element.md#subtype)*

Defined in src/elements/Element.ts:15

___

###  to

• **to**: *[Node](node.md)*

*Inherited from [Flow](flow.md).[to](flow.md#to)*

Defined in src/elements/Flow.ts:12

___

###  type

• **type**: *any*

*Implementation of [IFlow](../interfaces/iflow.md).[type](../interfaces/iflow.md#type)*

*Inherited from [Element](element.md).[type](element.md#type)*

Defined in src/elements/Element.ts:14

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Inherited from [Element](element.md).[addBehaviour](element.md#addbehaviour)*

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

*Inherited from [Element](element.md).[continue](element.md#continue)*

Defined in src/elements/Element.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  describe

▸ **describe**(): *any[][]*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Inherited from [Flow](flow.md).[describe](flow.md#describe)*

*Overrides [Element](element.md).[describe](element.md#describe)*

Defined in src/elements/Flow.ts:24

**Returns:** *any[][]*

___

###  execute

▸ **execute**(`item`: [Item](item.md)): *Promise‹void›*

*Overrides [Flow](flow.md).[execute](flow.md#execute)*

Defined in src/elements/Flow.ts:72

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Inherited from [Element](element.md).[getBehaviour](element.md#getbehaviour)*

Defined in src/elements/Element.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of [IFlow](../interfaces/iflow.md)*

*Inherited from [Element](element.md).[hasBehaviour](element.md#hasbehaviour)*

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

*Inherited from [Element](element.md).[restored](element.md#restored)*

Defined in src/elements/Element.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [Item](item.md)): *void*

*Inherited from [Element](element.md).[resume](element.md#resume)*

Defined in src/elements/Element.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  run

▸ **run**(`item`: [Item](item.md)): *[FLOW_ACTION](../enums/flow_action.md)*

*Inherited from [Flow](flow.md).[run](flow.md#run)*

Defined in src/elements/Flow.ts:41

<Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
 otherwise, flow will be discarded.
</Rule>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [Item](item.md) |   |

**Returns:** *[FLOW_ACTION](../enums/flow_action.md)*
