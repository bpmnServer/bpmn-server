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

  ↳ [Event](event.md)

  ↳ [CatchEvent](catchevent.md)

  ↳ [BoundaryEvent](boundaryevent.md)

  ↳ [ThrowEvent](throwevent.md)

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
* [name](node.md#name)
* [outbounds](node.md#outbounds)
* [processId](node.md#processid)
* [type](node.md#type)

### Methods

* [addBehaviour](node.md#addbehaviour)
* [canBeInvoked](node.md#canbeinvoked)
* [continue](node.md#continue)
* [describe](node.md#describe)
* [doEvent](node.md#doevent)
* [end](node.md#end)
* [enter](node.md#enter)
* [execute](node.md#execute)
* [getBehaviour](node.md#getbehaviour)
* [getOutbounds](node.md#getoutbounds)
* [hasBehaviour](node.md#hasbehaviour)
* [init](node.md#init)
* [requiresWait](node.md#requireswait)
* [restored](node.md#restored)
* [resume](node.md#resume)
* [run](node.md#run)
* [start](node.md#start)

## Constructors

###  constructor

\+ **new Node**(`id`: any, `processId`: any, `type`: any, `def`: any): *[Node](node.md)*

Defined in src/elements/Node.ts:19

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

*Inherited from [Node](node.md).[behaviours](node.md#behaviours)*

Defined in src/elements/Element.ts:16

___

###  def

• **def**: *any*

Defined in src/elements/Node.ts:15

___

###  id

• **id**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[id](../interfaces/ielement.md#id)*

*Inherited from [Node](node.md).[id](node.md#id)*

Defined in src/elements/Element.ts:13

___

###  inbounds

• **inbounds**: *[Flow](flow.md)[]*

Defined in src/elements/Node.ts:17

___

###  name

• **name**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[name](../interfaces/ielement.md#name)*

*Overrides [Flow](flow.md).[name](flow.md#name)*

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

###  type

• **type**: *any*

*Implementation of [IElement](../interfaces/ielement.md).[type](../interfaces/ielement.md#type)*

*Inherited from [Node](node.md).[type](node.md#type)*

Defined in src/elements/Element.ts:14

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of [IElement](../interfaces/ielement.md)*

*Inherited from [Node](node.md).[addBehaviour](node.md#addbehaviour)*

Defined in src/elements/Element.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

___

###  canBeInvoked

▸ **canBeInvoked**(): *boolean*

Defined in src/elements/Node.ts:52

**Returns:** *boolean*

___

###  continue

▸ **continue**(`item`: [Item](item.md)): *Promise‹void›*

*Overrides [Flow](flow.md).[continue](flow.md#continue)*

Defined in src/elements/Node.ts:124

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

Defined in src/elements/Element.ts:20

**Returns:** *string[][]*

___

###  doEvent

▸ **doEvent**(`item`: [Item](item.md), `event`: [EXECUTION_EVENT](../enums/execution_event.md), `newStatus`: [ITEM_STATUS](../enums/item_status.md)): *Promise‹void›*

Defined in src/elements/Node.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |
`event` | [EXECUTION_EVENT](../enums/execution_event.md) |
`newStatus` | [ITEM_STATUS](../enums/item_status.md) |

**Returns:** *Promise‹void›*

___

###  end

▸ **end**(`item`: [Item](item.md)): *Promise‹void›*

Defined in src/elements/Node.ts:142

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹void›*

___

###  enter

▸ **enter**(`item`: [Item](item.md)): *void*

Defined in src/elements/Node.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  execute

▸ **execute**(`item`: [Item](item.md)): *Promise‹void | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort) | [wait](../enums/node_action.md#wait)›*

Defined in src/elements/Node.ts:64

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

*Inherited from [Node](node.md).[getBehaviour](node.md#getbehaviour)*

Defined in src/elements/Element.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  getOutbounds

▸ **getOutbounds**(`item`: [Item](item.md)): *[Item](item.md)[]*

Defined in src/elements/Node.ts:188

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *[Item](item.md)[]*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of [IElement](../interfaces/ielement.md)*

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

###  init

▸ **init**(`item`: [Item](item.md)): *void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *void*

___

###  requiresWait

▸ **requiresWait**(): *boolean*

Defined in src/elements/Node.ts:47

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

*Overrides [Flow](flow.md).[resume](flow.md#resume)*

Defined in src/elements/Node.ts:180

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

Defined in src/elements/Node.ts:138

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  start

▸ **start**(`item`: [Item](item.md)): *Promise‹[NODE_ACTION](../enums/node_action.md)›*

Defined in src/elements/Node.ts:130

**Parameters:**

Name | Type |
------ | ------ |
`item` | [Item](item.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*
