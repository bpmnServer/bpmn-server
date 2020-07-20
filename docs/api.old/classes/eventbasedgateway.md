[bpmn-server](../README.md) › [EventBasedGateway](eventbasedgateway.md)

# Class: EventBasedGateway

trick here is once one event is met all others must be cancelled

How will I know?
     when one of my events is fired shoudl I subscribe to the event or get directly notified?

## Hierarchy

  ↳ [Gateway](gateway.md)

  ↳ **EventBasedGateway**

## Implements

* [IElement](../interfaces/ielement.md)

## Index

### Constructors

* [constructor](eventbasedgateway.md#constructor)

### Properties

* [attachedTo](eventbasedgateway.md#attachedto)
* [attachments](eventbasedgateway.md#attachments)
* [behaviours](eventbasedgateway.md#behaviours)
* [def](eventbasedgateway.md#def)
* [id](eventbasedgateway.md#id)
* [inbounds](eventbasedgateway.md#inbounds)
* [listener](eventbasedgateway.md#listener)
* [messageId](eventbasedgateway.md#messageid)
* [name](eventbasedgateway.md#name)
* [outbounds](eventbasedgateway.md#outbounds)
* [processId](eventbasedgateway.md#processid)
* [scripts](eventbasedgateway.md#scripts)
* [signalId](eventbasedgateway.md#signalid)
* [type](eventbasedgateway.md#type)
* [working](eventbasedgateway.md#working)

### Accessors

* [canBeInvoked](eventbasedgateway.md#canbeinvoked)
* [isCatching](eventbasedgateway.md#iscatching)
* [requiresWait](eventbasedgateway.md#requireswait)

### Methods

* [addBehaviour](eventbasedgateway.md#addbehaviour)
* [cancelAllBranched](eventbasedgateway.md#cancelallbranched)
* [continue](eventbasedgateway.md#continue)
* [convergeFlows](eventbasedgateway.md#convergeflows)
* [describe](eventbasedgateway.md#describe)
* [doEvent](eventbasedgateway.md#doevent)
* [end](eventbasedgateway.md#end)
* [enter](eventbasedgateway.md#enter)
* [execute](eventbasedgateway.md#execute)
* [findActiveFlows](eventbasedgateway.md#findactiveflows)
* [getBehaviour](eventbasedgateway.md#getbehaviour)
* [getOutbounds](eventbasedgateway.md#getoutbounds)
* [getOutput](eventbasedgateway.md#getoutput)
* [hasBehaviour](eventbasedgateway.md#hasbehaviour)
* [init](eventbasedgateway.md#init)
* [restored](eventbasedgateway.md#restored)
* [resume](eventbasedgateway.md#resume)
* [run](eventbasedgateway.md#run)
* [setInput](eventbasedgateway.md#setinput)
* [start](eventbasedgateway.md#start)
* [startMonitor](eventbasedgateway.md#startmonitor)

## Constructors

###  constructor

\+ **new EventBasedGateway**(`id`: any, `processId`: any, `type`: any, `def`: any): *[EventBasedGateway](eventbasedgateway.md)*

*Inherited from [Node](node.md).[constructor](node.md#constructor)*

Defined in src/elements/Node.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`processId` | any |
`type` | any |
`def` | any |

**Returns:** *[EventBasedGateway](eventbasedgateway.md)*

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

Defined in src/elements/Element.ts:16

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

###  listener

• **listener**: *any*

Defined in src/elements/Gateway.ts:211

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

###  type

• **type**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[type](../interfaces/ielement.md#type)*

*Inherited from [Element](element.md).[type](element.md#type)*

Defined in src/elements/Element.ts:14

___

###  working

• **working**: *boolean* = false

Defined in src/elements/Gateway.ts:210

## Accessors

###  canBeInvoked

• **get canBeInvoked**(): *boolean*

*Inherited from [Node](node.md).[canBeInvoked](node.md#canbeinvoked)*

Defined in src/elements/Node.ts:91

**Returns:** *boolean*

___

###  isCatching

• **get isCatching**(): *boolean*

*Inherited from [Node](node.md).[isCatching](node.md#iscatching)*

Defined in src/elements/Node.ts:93

**Returns:** *boolean*

___

###  requiresWait

• **get requiresWait**(): *boolean*

*Inherited from [Node](node.md).[requiresWait](node.md#requireswait)*

Defined in src/elements/Node.ts:86

**Returns:** *boolean*

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Element](element.md).[addBehaviour](element.md#addbehaviour)*

Defined in src/elements/Element.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

___

###  cancelAllBranched

▸ **cancelAllBranched**(`endingItem`: [Item](item.md)): *Promise‹void›*

Defined in src/elements/Gateway.ts:221

**Parameters:**

Name | Type |
------ | ------ |
`endingItem` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  continue

▸ **continue**(`item`: [Item](item.md)): *Promise‹void›*

*Inherited from [Node](node.md).[continue](node.md#continue)*

*Overrides [Element](element.md).[continue](element.md#continue)*

Defined in src/elements/Node.ts:163

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  convergeFlows

▸ **convergeFlows**(`item`: [Item](item.md)): *void*

*Inherited from [Gateway](gateway.md).[convergeFlows](gateway.md#convergeflows)*

Defined in src/elements/Gateway.ts:124

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  describe

▸ **describe**(): *string[][]*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Element](element.md).[describe](element.md#describe)*

Defined in src/elements/Element.ts:20

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

Defined in src/elements/Node.ts:181

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  enter

▸ **enter**(`item`: [Item](item.md)): *void*

*Inherited from [Node](node.md).[enter](node.md#enter)*

Defined in src/elements/Node.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  execute

▸ **execute**(`item`: [Item](item.md)): *Promise‹void | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort) | [wait](../enums/node_action.md#wait)›*

*Inherited from [Node](node.md).[execute](node.md#execute)*

Defined in src/elements/Node.ts:103

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

###  findActiveFlows

▸ **findActiveFlows**(`token`: [Token](token.md)): *object*

*Inherited from [Gateway](gateway.md).[findActiveFlows](gateway.md#findactiveflows)*

Defined in src/elements/Gateway.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`token` | [Token](token.md) |

**Returns:** *object*

* **pendingTokens**: *any[]*

* **waitingTokens**: *any[]*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Element](element.md).[getBehaviour](element.md#getbehaviour)*

Defined in src/elements/Element.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  getOutbounds

▸ **getOutbounds**(`item`: [Item](item.md)): *[Item](item.md)[]*

*Inherited from [Gateway](gateway.md).[getOutbounds](gateway.md#getoutbounds)*

*Overrides [Node](node.md).[getOutbounds](node.md#getoutbounds)*

Defined in src/elements/Gateway.ts:34

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [Item](item.md) |   |

**Returns:** *[Item](item.md)[]*

___

###  getOutput

▸ **getOutput**(`item`: [Item](item.md)): *Promise‹any›*

*Inherited from [Node](node.md).[getOutput](node.md#getoutput)*

Defined in src/elements/Node.ts:69

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

Defined in src/elements/Element.ts:31

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

Defined in src/elements/Node.ts:222

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  restored

▸ **restored**(`item`: [Item](item.md)): *void*

*Overrides [Element](element.md).[restored](element.md#restored)*

Defined in src/elements/Gateway.ts:213

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

Defined in src/elements/Node.ts:219

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

Defined in src/elements/Gateway.ts:217

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

*Inherited from [Gateway](gateway.md).[start](gateway.md#start)*

*Overrides [Node](node.md).[start](node.md#start)*

Defined in src/elements/Gateway.ts:157

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  startMonitor

▸ **startMonitor**(`item`: any): *void*

Defined in src/elements/Gateway.ts:241

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*
