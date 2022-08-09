[bpmn-server](../README.md) › [Node](node.md)

# Class: Node

## Hierarchy

* [Element](element.md)

  ↳ **Node**

  ↳ [ScriptTask](scripttask.md)

  ↳ [ServiceTask](servicetask.md)

  ↳ [UserTask](usertask.md)

  ↳ [ReceiveTask](receivetask.md)

  ↳ [SubProcess](subprocess.md)

  ↳ [CallActivity](callactivity.md)

  ↳ [Event](event.md)

  ↳ [Gateway](gateway.md)

## Implements

* [IElement](../interfaces/ielement.md)

## Index

### Constructors

* [constructor](node.md#constructor)

### Properties

* [attachedTo](node.md#attachedto)
* [attachments](node.md#attachments)
* [behaviours](node.md#behaviours)
* [def](node.md#def)
* [id](node.md#id)
* [inbounds](node.md#inbounds)
* [isFlow](node.md#isflow)
* [messageId](node.md#messageid)
* [name](node.md#name)
* [outbounds](node.md#outbounds)
* [process](node.md#process)
* [scripts](node.md#scripts)
* [signalId](node.md#signalid)
* [subType](node.md#subtype)
* [type](node.md#type)

### Accessors

* [canBeInvoked](node.md#canbeinvoked)
* [isCatching](node.md#iscatching)
* [processId](node.md#processid)
* [requiresWait](node.md#requireswait)

### Methods

* [addBehaviour](node.md#addbehaviour)
* [continue](node.md#continue)
* [describe](node.md#describe)
* [doEvent](node.md#doevent)
* [end](node.md#end)
* [enter](node.md#enter)
* [execute](node.md#execute)
* [getBehaviour](node.md#getbehaviour)
* [getInput](node.md#getinput)
* [getOutbounds](node.md#getoutbounds)
* [getOutput](node.md#getoutput)
* [hasBehaviour](node.md#hasbehaviour)
* [init](node.md#init)
* [restored](node.md#restored)
* [resume](node.md#resume)
* [run](node.md#run)
* [setInput](node.md#setinput)
* [start](node.md#start)
* [startBoundaryEvents](node.md#startboundaryevents)

## Constructors

###  constructor

\+ **new Node**(`id`: any, `process`: any, `type`: any, `def`: any): *[Node](node.md)*

Defined in bpmnServer/src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *[Node](node.md)*

## Properties

###  attachedTo

• **attachedTo**: *[Node](node.md)*

Defined in bpmnServer/src/elements/Node.ts:17

___

###  attachments

• **attachments**: *[Node](node.md)[]*

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

Defined in bpmnServer/src/elements/Node.ts:15

___

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from [Node](node.md).[isFlow](node.md#isflow)*

Defined in bpmnServer/src/elements/Element.ts:18

___

###  messageId

• **messageId**: *any*

Defined in bpmnServer/src/elements/Node.ts:18

___

###  name

• **name**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[name](../interfaces/ielement.md#name)*

*Overrides [Element](element.md).[name](element.md#name)*

Defined in bpmnServer/src/elements/Node.ts:11

___

###  outbounds

• **outbounds**: *[Flow](flow.md)[]*

Defined in bpmnServer/src/elements/Node.ts:14

___

###  process

• **process**: *any*

Defined in bpmnServer/src/elements/Node.ts:12

___

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

Defined in bpmnServer/src/elements/Node.ts:20

___

###  signalId

• **signalId**: *any*

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

Defined in bpmnServer/src/elements/Node.ts:101

**Returns:** *boolean*

___

###  isCatching

• **get isCatching**(): *boolean*

Defined in bpmnServer/src/elements/Node.ts:103

**Returns:** *boolean*

___

###  processId

• **get processId**(): *any*

Defined in bpmnServer/src/elements/Node.ts:21

**Returns:** *any*

___

###  requiresWait

• **get requiresWait**(): *boolean*

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

Defined in bpmnServer/src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  enter

▸ **enter**(`item`: [Item](item.md)): *void*

Defined in bpmnServer/src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  execute

▸ **execute**(`item`: [Item](item.md)): *Promise‹void | [wait](../enums/node_action.md#wait) | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort)›*

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

Defined in bpmnServer/src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *[Item](item.md)[]*

___

###  getOutput

▸ **getOutput**(`item`: [Item](item.md)): *Promise‹any›*

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

###  init

▸ **init**(`item`: [Item](item.md)): *void*

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

Defined in bpmnServer/src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  setInput

▸ **setInput**(`item`: [Item](item.md), `input`: any): *Promise‹void›*

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

Defined in bpmnServer/src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

Defined in bpmnServer/src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*
