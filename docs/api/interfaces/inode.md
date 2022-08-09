[bpmn-server](../README.md) › [INode](inode.md)

# Interface: INode

## Hierarchy

* [IElement](ielement.md)

  ↳ **INode**

## Index

### Properties

* [behaviours](inode.md#behaviours)
* [def](inode.md#def)
* [id](inode.md#id)
* [inbounds](inode.md#inbounds)
* [name](inode.md#name)
* [outbounds](inode.md#outbounds)
* [processId](inode.md#processid)
* [type](inode.md#type)

### Methods

* [addBehaviour](inode.md#addbehaviour)
* [canBeInvoked](inode.md#canbeinvoked)
* [continue](inode.md#continue)
* [describe](inode.md#describe)
* [doEvent](inode.md#doevent)
* [end](inode.md#end)
* [enter](inode.md#enter)
* [execute](inode.md#execute)
* [getBehaviour](inode.md#getbehaviour)
* [getOutbounds](inode.md#getoutbounds)
* [hasBehaviour](inode.md#hasbehaviour)
* [init](inode.md#init)
* [requiresWait](inode.md#requireswait)
* [restored](inode.md#restored)
* [resume](inode.md#resume)
* [run](inode.md#run)
* [start](inode.md#start)

## Properties

###  behaviours

• **behaviours**: *Map‹any, any›*

*Inherited from [IElement](ielement.md).[behaviours](ielement.md#behaviours)*

Defined in bpmnServer/src/interfaces/elements.ts:24

___

###  def

• **def**: *any*

Defined in bpmnServer/src/interfaces/elements.ts:43

___

###  id

• **id**: *any*

*Inherited from [IElement](ielement.md).[id](ielement.md#id)*

Defined in bpmnServer/src/interfaces/elements.ts:21

___

###  inbounds

• **inbounds**: *any[]*

Defined in bpmnServer/src/interfaces/elements.ts:45

___

###  name

• **name**: *any*

*Overrides [IElement](ielement.md).[name](ielement.md#name)*

Defined in bpmnServer/src/interfaces/elements.ts:41

___

###  outbounds

• **outbounds**: *any[]*

Defined in bpmnServer/src/interfaces/elements.ts:44

___

###  processId

• **processId**: *any*

Defined in bpmnServer/src/interfaces/elements.ts:42

___

###  type

• **type**: *any*

*Inherited from [IElement](ielement.md).[type](ielement.md#type)*

Defined in bpmnServer/src/interfaces/elements.ts:22

## Methods

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Inherited from [IElement](ielement.md).[addBehaviour](ielement.md#addbehaviour)*

Defined in bpmnServer/src/interfaces/elements.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

___

###  canBeInvoked

▸ **canBeInvoked**(): *boolean*

Defined in bpmnServer/src/interfaces/elements.ts:49

**Returns:** *boolean*

___

###  continue

▸ **continue**(`item`: [IItem](iitem.md)): *Promise‹void›*

*Overrides [IElement](ielement.md).[continue](ielement.md#continue)*

Defined in bpmnServer/src/interfaces/elements.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *Promise‹void›*

___

###  describe

▸ **describe**(): *string[][]*

*Inherited from [IElement](ielement.md).[describe](ielement.md#describe)*

Defined in bpmnServer/src/interfaces/elements.ts:26

**Returns:** *string[][]*

___

###  doEvent

▸ **doEvent**(`item`: [IItem](iitem.md), `event`: [EXECUTION_EVENT](../enums/execution_event.md), `newStatus`: [ITEM_STATUS](../enums/item_status.md)): *Promise‹void›*

Defined in bpmnServer/src/interfaces/elements.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |
`event` | [EXECUTION_EVENT](../enums/execution_event.md) |
`newStatus` | [ITEM_STATUS](../enums/item_status.md) |

**Returns:** *Promise‹void›*

___

###  end

▸ **end**(`item`: [IItem](iitem.md)): *Promise‹void›*

Defined in bpmnServer/src/interfaces/elements.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *Promise‹void›*

___

###  enter

▸ **enter**(`item`: [IItem](iitem.md)): *void*

Defined in bpmnServer/src/interfaces/elements.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*

___

###  execute

▸ **execute**(`item`: [IItem](iitem.md)): *Promise‹void | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort) | [wait](../enums/node_action.md#wait)›*

Defined in bpmnServer/src/interfaces/elements.ts:59

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *Promise‹void | [error](../enums/node_action.md#error) | [abort](../enums/node_action.md#abort) | [wait](../enums/node_action.md#wait)›*

___

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Inherited from [IElement](ielement.md).[getBehaviour](ielement.md#getbehaviour)*

Defined in bpmnServer/src/interfaces/elements.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

___

###  getOutbounds

▸ **getOutbounds**(`item`: [IItem](iitem.md)): *[IItem](iitem.md)[]*

Defined in bpmnServer/src/interfaces/elements.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *[IItem](iitem.md)[]*

___

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Inherited from [IElement](ielement.md).[hasBehaviour](ielement.md#hasbehaviour)*

Defined in bpmnServer/src/interfaces/elements.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

___

###  init

▸ **init**(`item`: [IItem](iitem.md)): *void*

Defined in bpmnServer/src/interfaces/elements.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*

___

###  requiresWait

▸ **requiresWait**(): *boolean*

Defined in bpmnServer/src/interfaces/elements.ts:48

**Returns:** *boolean*

___

###  restored

▸ **restored**(`item`: [IItem](iitem.md)): *void*

*Inherited from [IElement](ielement.md).[restored](ielement.md#restored)*

Defined in bpmnServer/src/interfaces/elements.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *void*

___

###  resume

▸ **resume**(`item`: [IItem](iitem.md)): *void*

*Overrides [IElement](ielement.md).[resume](ielement.md#resume)*

Defined in bpmnServer/src/interfaces/elements.ts:69

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | [IItem](iitem.md) |   |

**Returns:** *void*

___

###  run

▸ **run**(`item`: [IItem](iitem.md)): *Promise‹[NODE_ACTION](../enums/node_action.md)›*

Defined in bpmnServer/src/interfaces/elements.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*

___

###  start

▸ **start**(`item`: [IItem](iitem.md)): *Promise‹[NODE_ACTION](../enums/node_action.md)›*

Defined in bpmnServer/src/interfaces/elements.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`item` | [IItem](iitem.md) |

**Returns:** *Promise‹[NODE_ACTION](../enums/node_action.md)›*
