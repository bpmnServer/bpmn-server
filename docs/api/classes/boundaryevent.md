[bpmn-server](../README.md) › [BoundaryEvent](boundaryevent.md)

# Class: BoundaryEvent

## Hierarchy

  ↳ [Event](event.md)

  ↳ **BoundaryEvent**

## Implements

* [IElement](../interfaces/ielement.md)

## Index

### Constructors

* [constructor](boundaryevent.md#constructor)

### Properties

* [attachedTo](boundaryevent.md#attachedto)
* [attachments](boundaryevent.md#attachments)
* [behaviours](boundaryevent.md#behaviours)
* [def](boundaryevent.md#def)
* [id](boundaryevent.md#id)
* [inbounds](boundaryevent.md#inbounds)
* [messageId](boundaryevent.md#messageid)
* [name](boundaryevent.md#name)
* [outbounds](boundaryevent.md#outbounds)
* [processId](boundaryevent.md#processid)
* [scripts](boundaryevent.md#scripts)
* [signalId](boundaryevent.md#signalid)
* [subType](boundaryevent.md#subtype)
* [type](boundaryevent.md#type)

### Accessors

* [canBeInvoked](boundaryevent.md#canbeinvoked)
* [isCatching](boundaryevent.md#iscatching)
* [requiresWait](boundaryevent.md#requireswait)

### Methods

* [addBehaviour](boundaryevent.md#addbehaviour)
* [continue](boundaryevent.md#continue)
* [describe](boundaryevent.md#describe)
* [doEvent](boundaryevent.md#doevent)
* [end](boundaryevent.md#end)
* [enter](boundaryevent.md#enter)
* [execute](boundaryevent.md#execute)
* [getBehaviour](boundaryevent.md#getbehaviour)
* [getInput](boundaryevent.md#getinput)
* [getOutbounds](boundaryevent.md#getoutbounds)
* [getOutput](boundaryevent.md#getoutput)
* [hasBehaviour](boundaryevent.md#hasbehaviour)
* [hasMessage](boundaryevent.md#hasmessage)
* [hasSignal](boundaryevent.md#hassignal)
* [hasTimer](boundaryevent.md#hastimer)
* [init](boundaryevent.md#init)
* [restored](boundaryevent.md#restored)
* [resume](boundaryevent.md#resume)
* [run](boundaryevent.md#run)
* [setInput](boundaryevent.md#setinput)
* [start](boundaryevent.md#start)

## Constructors

###  constructor

\+ **new BoundaryEvent**(`id`: any, `processId`: any, `type`: any, `def`: any): *[BoundaryEvent](boundaryevent.md)*

*Inherited from [Node](node.md).[constructor](node.md#constructor)*

Defined in src/elements/Node.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`processId` | any |
`type` | any |
`def` | any |

**Returns:** *[BoundaryEvent](boundaryevent.md)*

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

*Overrides [Event](event.md).[canBeInvoked](event.md#canbeinvoked)*

Defined in src/elements/Events.ts:56

**Returns:** *boolean*

___

###  isCatching

• **get isCatching**(): *boolean*

*Overrides [Node](node.md).[isCatching](node.md#iscatching)*

Defined in src/elements/Events.ts:51

**Returns:** *boolean*

___

###  requiresWait

• **get requiresWait**(): *boolean*

*Overrides [Node](node.md).[requiresWait](node.md#requireswait)*

Defined in src/elements/Events.ts:53

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

*Inherited from [Event](event.md).[end](event.md#end)*

*Overrides [Node](node.md).[end](node.md#end)*

Defined in src/elements/Events.ts:26

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

###  hasMessage

▸ **hasMessage**(): *any*

*Inherited from [Event](event.md).[hasMessage](event.md#hasmessage)*

Defined in src/elements/Events.ts:7

**Returns:** *any*

___

###  hasSignal

▸ **hasSignal**(): *any*

*Inherited from [Event](event.md).[hasSignal](event.md#hassignal)*

Defined in src/elements/Events.ts:10

**Returns:** *any*

___

###  hasTimer

▸ **hasTimer**(): *any*

*Inherited from [Event](event.md).[hasTimer](event.md#hastimer)*

Defined in src/elements/Events.ts:13

**Returns:** *any*

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

▸ **run**(`item`: [Item](item.md)): *Promise‹[NODE_ACTION](../enums/node_action.md)›*

*Inherited from [Node](node.md).[run](node.md#run)*

Defined in src/elements/Node.ts:184

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

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

*Overrides [Event](event.md).[start](event.md#start)*

Defined in src/elements/Events.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*
