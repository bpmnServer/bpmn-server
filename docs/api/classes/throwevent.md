[bpmn-server](../README.md) › [ThrowEvent](throwevent.md)

# Class: ThrowEvent

## Hierarchy

  ↳ [Event](event.md)

  ↳ **ThrowEvent**

## Implements

* [IElement](../interfaces/ielement.md)

## Index

### Constructors

* [constructor](throwevent.md#constructor)

### Properties

* [attachedTo](throwevent.md#attachedto)
* [attachments](throwevent.md#attachments)
* [behaviours](throwevent.md#behaviours)
* [def](throwevent.md#def)
* [id](throwevent.md#id)
* [inbounds](throwevent.md#inbounds)
* [isFlow](throwevent.md#isflow)
* [messageId](throwevent.md#messageid)
* [name](throwevent.md#name)
* [outbounds](throwevent.md#outbounds)
* [process](throwevent.md#process)
* [scripts](throwevent.md#scripts)
* [signalId](throwevent.md#signalid)
* [subType](throwevent.md#subtype)
* [type](throwevent.md#type)

### Accessors

* [canBeInvoked](throwevent.md#canbeinvoked)
* [isCatching](throwevent.md#iscatching)
* [processId](throwevent.md#processid)
* [requiresWait](throwevent.md#requireswait)

### Methods

* [addBehaviour](throwevent.md#addbehaviour)
* [continue](throwevent.md#continue)
* [describe](throwevent.md#describe)
* [doEvent](throwevent.md#doevent)
* [end](throwevent.md#end)
* [enter](throwevent.md#enter)
* [execute](throwevent.md#execute)
* [getBehaviour](throwevent.md#getbehaviour)
* [getInput](throwevent.md#getinput)
* [getOutbounds](throwevent.md#getoutbounds)
* [getOutput](throwevent.md#getoutput)
* [hasBehaviour](throwevent.md#hasbehaviour)
* [hasMessage](throwevent.md#hasmessage)
* [hasSignal](throwevent.md#hassignal)
* [hasTimer](throwevent.md#hastimer)
* [init](throwevent.md#init)
* [restored](throwevent.md#restored)
* [resume](throwevent.md#resume)
* [run](throwevent.md#run)
* [setInput](throwevent.md#setinput)
* [start](throwevent.md#start)
* [startBoundaryEvents](throwevent.md#startboundaryevents)

## Constructors

###  constructor

\+ **new ThrowEvent**(`id`: any, `process`: any, `type`: any, `def`: any): *[ThrowEvent](throwevent.md)*

*Inherited from [Node](node.md).[constructor](node.md#constructor)*

Defined in bpmnServer/src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *[ThrowEvent](throwevent.md)*

## Properties

###  attachedTo

• **attachedTo**: *[Node](node.md)*

*Inherited from [Node](node.md).[attachedTo](node.md#attachedto)*

Defined in bpmnServer/src/elements/Node.ts:17

___

###  attachments

• **attachments**: *[Node](node.md)[]*

*Inherited from [Node](node.md).[attachments](node.md#attachments)*

Defined in bpmnServer/src/elements/Node.ts:16

___

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of [IElement](../interfaces/ielement.md).[behaviours](../interfaces/ielement.md#behaviours)*

*Inherited from [Node](node.md).[behaviours](node.md#behaviours)*

Defined in bpmnServer/src/elements/Element.ts:17

___

###  def

• **def**: *any*

*Inherited from [Node](node.md).[def](node.md#def)*

Defined in bpmnServer/src/elements/Node.ts:13

___

###  id

• **id**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[id](../interfaces/ielement.md#id)*

*Inherited from [Node](node.md).[id](node.md#id)*

Defined in bpmnServer/src/elements/Element.ts:13

___

###  inbounds

• **inbounds**: *[Flow](flow.md)[]*

*Inherited from [Node](node.md).[inbounds](node.md#inbounds)*

Defined in bpmnServer/src/elements/Node.ts:15

___

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from [Node](node.md).[isFlow](node.md#isflow)*

Defined in bpmnServer/src/elements/Element.ts:18

___

###  messageId

• **messageId**: *any*

*Inherited from [Node](node.md).[messageId](node.md#messageid)*

Defined in bpmnServer/src/elements/Node.ts:18

___

###  name

• **name**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[name](../interfaces/ielement.md#name)*

*Inherited from [Node](node.md).[name](node.md#name)*

*Overrides [Element](element.md).[name](element.md#name)*

Defined in bpmnServer/src/elements/Node.ts:11

___

###  outbounds

• **outbounds**: *[Flow](flow.md)[]*

*Inherited from [Node](node.md).[outbounds](node.md#outbounds)*

Defined in bpmnServer/src/elements/Node.ts:14

___

###  process

• **process**: *any*

*Inherited from [Node](node.md).[process](node.md#process)*

Defined in bpmnServer/src/elements/Node.ts:12

___

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from [Node](node.md).[scripts](node.md#scripts)*

Defined in bpmnServer/src/elements/Node.ts:20

___

###  signalId

• **signalId**: *any*

*Inherited from [Node](node.md).[signalId](node.md#signalid)*

Defined in bpmnServer/src/elements/Node.ts:19

___

###  subType

• **subType**: *any*

*Inherited from [Node](node.md).[subType](node.md#subtype)*

Defined in bpmnServer/src/elements/Element.ts:15

___

###  type

• **type**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[type](../interfaces/ielement.md#type)*

*Inherited from [Node](node.md).[type](node.md#type)*

Defined in bpmnServer/src/elements/Element.ts:14

## Accessors

###  canBeInvoked

• **get canBeInvoked**(): *boolean*

*Inherited from [Event](event.md).[canBeInvoked](event.md#canbeinvoked)*

*Overrides [Node](node.md).[canBeInvoked](node.md#canbeinvoked)*

Defined in bpmnServer/src/elements/Events.ts:30

**Returns:** *boolean*

___

###  isCatching

• **get isCatching**(): *boolean*

*Overrides [Node](node.md).[isCatching](node.md#iscatching)*

Defined in bpmnServer/src/elements/Events.ts:71

	using token: check if fromEventBasedGateway;	if yes cancel all other events

**Returns:** *boolean*

___

###  processId

• **get processId**(): *any*

*Inherited from [Node](node.md).[processId](node.md#processid)*

Defined in bpmnServer/src/elements/Node.ts:21

**Returns:** *any*

___

###  requiresWait

• **get requiresWait**(): *boolean*

*Inherited from [Node](node.md).[requiresWait](node.md#requireswait)*

Defined in bpmnServer/src/elements/Node.ts:96

**Returns:** *boolean*

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Node](node.md).[addBehaviour](node.md#addbehaviour)*

Defined in bpmnServer/src/elements/Element.ts:40

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

Defined in bpmnServer/src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  describe

▸ **describe**(): *string[][]*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Node](node.md).[describe](node.md#describe)*

Defined in bpmnServer/src/elements/Element.ts:22

**Returns:** *string[][]*

___

###  doEvent

▸ **doEvent**(`item`: [Item](item.md), `event`: [EXECUTION_EVENT](../enums/execution_event.md), `newStatus`: [ITEM_STATUS](../enums/item_status.md)): *Promise‹any›*

*Inherited from [Node](node.md).[doEvent](node.md#doevent)*

Defined in bpmnServer/src/elements/Node.ts:40

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

Defined in bpmnServer/src/elements/Events.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  enter

▸ **enter**(`item`: [Item](item.md)): *void*

*Inherited from [Node](node.md).[enter](node.md#enter)*

Defined in bpmnServer/src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  execute

▸ **execute**(`item`: [Item](item.md)): *Promise‹void | [wait](../enums/node_action.md#wait) | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort)›*

*Inherited from [Node](node.md).[execute](node.md#execute)*

Defined in bpmnServer/src/elements/Node.ts:113

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

**Returns:** *Promise‹void | [wait](../enums/node_action.md#wait) | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort)›*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Node](node.md).[getBehaviour](node.md#getbehaviour)*

Defined in bpmnServer/src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  getInput

▸ **getInput**(`item`: [Item](item.md), `input`: any): *Promise‹any›*

*Inherited from [Node](node.md).[getInput](node.md#getinput)*

Defined in bpmnServer/src/elements/Node.ts:66

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

Defined in bpmnServer/src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *[Item](item.md)[]*

___

###  getOutput

▸ **getOutput**(`item`: [Item](item.md)): *Promise‹any›*

*Inherited from [Node](node.md).[getOutput](node.md#getoutput)*

Defined in bpmnServer/src/elements/Node.ts:79

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

*Inherited from [Node](node.md).[hasBehaviour](node.md#hasbehaviour)*

Defined in bpmnServer/src/elements/Element.ts:33

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

Defined in bpmnServer/src/elements/Events.ts:7

**Returns:** *any*

___

###  hasSignal

▸ **hasSignal**(): *any*

*Inherited from [Event](event.md).[hasSignal](event.md#hassignal)*

Defined in bpmnServer/src/elements/Events.ts:10

**Returns:** *any*

___

###  hasTimer

▸ **hasTimer**(): *any*

*Inherited from [Event](event.md).[hasTimer](event.md#hastimer)*

Defined in bpmnServer/src/elements/Events.ts:13

**Returns:** *any*

___

###  init

▸ **init**(`item`: [Item](item.md)): *void*

*Inherited from [Node](node.md).[init](node.md#init)*

Defined in bpmnServer/src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  restored

▸ **restored**(`item`: [Item](item.md)): *void*

*Inherited from [Node](node.md).[restored](node.md#restored)*

Defined in bpmnServer/src/elements/Element.ts:23

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

Defined in bpmnServer/src/elements/Node.ts:225

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

*Overrides [Node](node.md).[run](node.md#run)*

Defined in bpmnServer/src/elements/Events.ts:76

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  setInput

▸ **setInput**(`item`: [Item](item.md), `input`: any): *Promise‹void›*

*Inherited from [Node](node.md).[setInput](node.md#setinput)*

Defined in bpmnServer/src/elements/Node.ts:56

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

Defined in bpmnServer/src/elements/Events.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from [Node](node.md).[startBoundaryEvents](node.md#startboundaryevents)*

Defined in bpmnServer/src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*
