[bpmn-server](../README.md) › [ScriptTask](scripttask.md)

# Class: ScriptTask

## Hierarchy

  ↳ [Node](node.md)

  ↳ **ScriptTask**

## Implements

* [IElement](../interfaces/ielement.md)

## Index

### Constructors

* [constructor](scripttask.md#constructor)

### Properties

* [attachedTo](scripttask.md#attachedto)
* [attachments](scripttask.md#attachments)
* [behaviours](scripttask.md#behaviours)
* [def](scripttask.md#def)
* [id](scripttask.md#id)
* [inbounds](scripttask.md#inbounds)
* [messageId](scripttask.md#messageid)
* [name](scripttask.md#name)
* [outbounds](scripttask.md#outbounds)
* [processId](scripttask.md#processid)
* [scripts](scripttask.md#scripts)
* [signalId](scripttask.md#signalid)
* [subType](scripttask.md#subtype)
* [type](scripttask.md#type)

### Accessors

* [canBeInvoked](scripttask.md#canbeinvoked)
* [isCatching](scripttask.md#iscatching)
* [requiresWait](scripttask.md#requireswait)

### Methods

* [addBehaviour](scripttask.md#addbehaviour)
* [continue](scripttask.md#continue)
* [describe](scripttask.md#describe)
* [doEvent](scripttask.md#doevent)
* [end](scripttask.md#end)
* [enter](scripttask.md#enter)
* [execute](scripttask.md#execute)
* [getBehaviour](scripttask.md#getbehaviour)
* [getInput](scripttask.md#getinput)
* [getOutbounds](scripttask.md#getoutbounds)
* [getOutput](scripttask.md#getoutput)
* [hasBehaviour](scripttask.md#hasbehaviour)
* [init](scripttask.md#init)
* [restored](scripttask.md#restored)
* [resume](scripttask.md#resume)
* [run](scripttask.md#run)
* [setInput](scripttask.md#setinput)
* [start](scripttask.md#start)

## Constructors

###  constructor

\+ **new ScriptTask**(`id`: any, `processId`: any, `type`: any, `def`: any): *[ScriptTask](scripttask.md)*

*Inherited from [Node](node.md).[constructor](node.md#constructor)*

Defined in src/elements/Node.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`processId` | any |
`type` | any |
`def` | any |

**Returns:** *[ScriptTask](scripttask.md)*

## Properties

###  attachedTo

• **attachedTo**: *[Node](node.md)*

*Inherited from [Node](node.md).[attachedTo](node.md#attachedto)*

Defined in src/elements/Node.ts:19

___

###  attachments

• **attachments**: *[Node](node.md)[]*

*Inherited from [Node](node.md).[attachments](node.md#attachments)*

Defined in src/elements/Node.ts:18

___

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of [IElement](../interfaces/ielement.md).[behaviours](../interfaces/ielement.md#behaviours)*

*Inherited from [Element](element.md).[behaviours](element.md#behaviours)*

Defined in src/elements/Element.ts:17

___

###  def

• **def**: *any*

*Inherited from [Node](node.md).[def](node.md#def)*

Defined in src/elements/Node.ts:15

___

###  id

• **id**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[id](../interfaces/ielement.md#id)*

*Inherited from [Element](element.md).[id](element.md#id)*

Defined in src/elements/Element.ts:13

___

###  inbounds

• **inbounds**: *[Flow](flow.md)[]*

*Inherited from [Node](node.md).[inbounds](node.md#inbounds)*

Defined in src/elements/Node.ts:17

___

###  messageId

• **messageId**: *any*

*Inherited from [Node](node.md).[messageId](node.md#messageid)*

Defined in src/elements/Node.ts:20

___

###  name

• **name**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[name](../interfaces/ielement.md#name)*

*Inherited from [Node](node.md).[name](node.md#name)*

*Overrides [Element](element.md).[name](element.md#name)*

Defined in src/elements/Node.ts:13

___

###  outbounds

• **outbounds**: *[Flow](flow.md)[]*

*Inherited from [Node](node.md).[outbounds](node.md#outbounds)*

Defined in src/elements/Node.ts:16

___

###  processId

• **processId**: *any*

*Inherited from [Node](node.md).[processId](node.md#processid)*

Defined in src/elements/Node.ts:14

___

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from [Node](node.md).[scripts](node.md#scripts)*

Defined in src/elements/Node.ts:22

___

###  signalId

• **signalId**: *any*

*Inherited from [Node](node.md).[signalId](node.md#signalid)*

Defined in src/elements/Node.ts:21

___

###  subType

• **subType**: *any*

*Inherited from [Element](element.md).[subType](element.md#subtype)*

Defined in src/elements/Element.ts:15

___

###  type

• **type**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[type](../interfaces/ielement.md#type)*

*Inherited from [Element](element.md).[type](element.md#type)*

Defined in src/elements/Element.ts:14

## Accessors

###  canBeInvoked

• **get canBeInvoked**(): *boolean*

*Inherited from [Node](node.md).[canBeInvoked](node.md#canbeinvoked)*

Defined in src/elements/Node.ts:98

**Returns:** *boolean*

___

###  isCatching

• **get isCatching**(): *boolean*

*Inherited from [Node](node.md).[isCatching](node.md#iscatching)*

Defined in src/elements/Node.ts:100

**Returns:** *boolean*

___

###  requiresWait

• **get requiresWait**(): *boolean*

*Inherited from [Node](node.md).[requiresWait](node.md#requireswait)*

Defined in src/elements/Node.ts:93

**Returns:** *boolean*

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of [IElement](../interfaces/ielement.md)*

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

▸ **continue**(`item`: [Item](item.md)): *Promise‹void›*

*Inherited from [Node](node.md).[continue](node.md#continue)*

*Overrides [Element](element.md).[continue](element.md#continue)*

Defined in src/elements/Node.ts:170

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  describe

▸ **describe**(): *string[][]*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Element](element.md).[describe](element.md#describe)*

Defined in src/elements/Element.ts:21

**Returns:** *string[][]*

___

###  doEvent

▸ **doEvent**(`item`: [Item](item.md), `event`: [EXECUTION_EVENT](../enums/execution_event.md), `newStatus`: [ITEM_STATUS](../enums/item_status.md)): *Promise‹any›*

*Inherited from [Node](node.md).[doEvent](node.md#doevent)*

Defined in src/elements/Node.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |
`event` | [EXECUTION_EVENT](../enums/execution_event.md) |
`newStatus` | [ITEM_STATUS](../enums/item_status.md) |

**Returns:** *Promise‹any›*

___

###  end

▸ **end**(`item`: [Item](item.md)): *Promise‹void›*

*Inherited from [Node](node.md).[end](node.md#end)*

Defined in src/elements/Node.ts:188

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  enter

▸ **enter**(`item`: [Item](item.md)): *void*

*Inherited from [Node](node.md).[enter](node.md#enter)*

Defined in src/elements/Node.ts:85

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  execute

▸ **execute**(`item`: [Item](item.md)): *Promise‹void | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort) | [wait](../enums/node_action.md#wait)›*

*Inherited from [Node](node.md).[execute](node.md#execute)*

Defined in src/elements/Node.ts:110

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort) | [wait](../enums/node_action.md#wait)›*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Element](element.md).[getBehaviour](element.md#getbehaviour)*

Defined in src/elements/Element.ts:36

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  getInput

▸ **getInput**(`item`: [Item](item.md), `input`: any): *Promise‹any›*

*Inherited from [Node](node.md).[getInput](node.md#getinput)*

Defined in src/elements/Node.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |
`input` | any |

**Returns:** *Promise‹any›*

___

###  getOutbounds

▸ **getOutbounds**(`item`: [Item](item.md)): *[Item](item.md)[]*

*Inherited from [Node](node.md).[getOutbounds](node.md#getoutbounds)*

Defined in src/elements/Node.ts:234

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *[Item](item.md)[]*

___

###  getOutput

▸ **getOutput**(`item`: [Item](item.md)): *Promise‹any›*

*Inherited from [Node](node.md).[getOutput](node.md#getoutput)*

Defined in src/elements/Node.ts:76

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [Item](item.md) |   |

**Returns:** *Promise‹any›*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of [IElement](../interfaces/ielement.md)*

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

###  init

▸ **init**(`item`: [Item](item.md)): *void*

*Inherited from [Node](node.md).[init](node.md#init)*

Defined in src/elements/Node.ts:229

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

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

*Inherited from [Node](node.md).[resume](node.md#resume)*

*Overrides [Element](element.md).[resume](element.md#resume)*

Defined in src/elements/Node.ts:226

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [Item](item.md) |   |

**Returns:** *void*

___

###  run

▸ **run**(`item`: any): *Promise‹[NODE_ACTION](../enums/node_action.md)›*

*Overrides [Node](node.md).[run](node.md#run)*

Defined in src/elements/Tasks.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  setInput

▸ **setInput**(`item`: [Item](item.md), `input`: any): *Promise‹void›*

*Inherited from [Node](node.md).[setInput](node.md#setinput)*

Defined in src/elements/Node.ts:53

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [Item](item.md) |   |
`input` | any | - |

**Returns:** *Promise‹void›*

___

###  start

▸ **start**(`item`: [Item](item.md)): *Promise‹[NODE_ACTION](../enums/node_action.md)›*

*Inherited from [Node](node.md).[start](node.md#start)*

Defined in src/elements/Node.ts:176

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*
