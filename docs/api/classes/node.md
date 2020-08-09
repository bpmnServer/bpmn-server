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

  ↳ [XORGateway](xorgateway.md)

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
* [messageId](node.md#messageid)
* [name](node.md#name)
* [outbounds](node.md#outbounds)
* [processId](node.md#processid)
* [scripts](node.md#scripts)
* [signalId](node.md#signalid)
* [subType](node.md#subtype)
* [type](node.md#type)

### Accessors

* [canBeInvoked](node.md#canbeinvoked)
* [isCatching](node.md#iscatching)
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

## Constructors

###  constructor

\+ **new Node**(`id`: any, `processId`: any, `type`: any, `def`: any): *[Node](node.md)*

Defined in src/elements/Node.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`processId` | any |
`type` | any |
`def` | any |

**Returns:** *[Node](node.md)*

## Properties

###  attachedTo

• **attachedTo**: *[Node](node.md)*

Defined in src/elements/Node.ts:19

___

###  attachments

• **attachments**: *[Node](node.md)[]*

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

Defined in src/elements/Node.ts:17

___

###  messageId

• **messageId**: *any*

Defined in src/elements/Node.ts:20

___

###  name

• **name**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[name](../interfaces/ielement.md#name)*

*Overrides [Element](element.md).[name](element.md#name)*

Defined in src/elements/Node.ts:13

___

###  outbounds

• **outbounds**: *[Flow](flow.md)[]*

Defined in src/elements/Node.ts:16

___

###  processId

• **processId**: *any*

Defined in src/elements/Node.ts:14

___

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

Defined in src/elements/Node.ts:22

___

###  signalId

• **signalId**: *any*

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

Defined in src/elements/Node.ts:98

**Returns:** *boolean*

___

###  isCatching

• **get isCatching**(): *boolean*

Defined in src/elements/Node.ts:100

**Returns:** *boolean*

___

###  requiresWait

• **get requiresWait**(): *boolean*

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

Defined in src/elements/Node.ts:188

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  enter

▸ **enter**(`item`: [Item](item.md)): *void*

Defined in src/elements/Node.ts:85

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  execute

▸ **execute**(`item`: [Item](item.md)): *Promise‹void | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort) | [wait](../enums/node_action.md#wait)›*

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

Defined in src/elements/Node.ts:234

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *[Item](item.md)[]*

___

###  getOutput

▸ **getOutput**(`item`: [Item](item.md)): *Promise‹any›*

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

Defined in src/elements/Node.ts:184

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  setInput

▸ **setInput**(`item`: [Item](item.md), `input`: any): *Promise‹void›*

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

Defined in src/elements/Node.ts:176

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*
