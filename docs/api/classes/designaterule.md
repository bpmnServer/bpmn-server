[bpmn-server](../README.md) › [DesignateRule](designaterule.md)

# Class: DesignateRule

## Hierarchy

* [AccessRule](accessrule.md)

  ↳ **DesignateRule**

## Index

### Constructors

* [constructor](designaterule.md#constructor)

### Properties

* [actor](designaterule.md#actor)
* [assignActor](designaterule.md#assignactor)
* [cancelEvent](designaterule.md#cancelevent)
* [delay](designaterule.md#delay)
* [element](designaterule.md#element)
* [event](designaterule.md#event)
* [id](designaterule.md#id)
* [privilege](designaterule.md#privilege)
* [repeat](designaterule.md#repeat)
* [template](designaterule.md#template)
* [type](designaterule.md#type)
* [user](designaterule.md#user)
* [userGroup](designaterule.md#usergroup)

### Methods

* [assignUser](designaterule.md#assignuser)
* [describe](designaterule.md#describe)
* [describeUser](designaterule.md#describeuser)
* [getActor](designaterule.md#getactor)
* [invoke](designaterule.md#invoke)

## Constructors

###  constructor

\+ **new DesignateRule**(`__namedParameters`: object): *[DesignateRule](designaterule.md)*

*Overrides [AccessRule](accessrule.md).[constructor](accessrule.md#constructor)*

Defined in bpmnServer/src/acl/Rules.ts:147

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`assignActor` | any | null |
`id` | any | - |
`user` | any | null |
`userGroup` | any | null |

**Returns:** *[DesignateRule](designaterule.md)*

## Properties

###  actor

• **actor**: *any*

*Inherited from [AccessRule](accessrule.md).[actor](accessrule.md#actor)*

Defined in bpmnServer/src/acl/Rules.ts:18

___

###  assignActor

• **assignActor**: *any*

*Inherited from [AccessRule](accessrule.md).[assignActor](accessrule.md#assignactor)*

Defined in bpmnServer/src/acl/Rules.ts:27

___

###  cancelEvent

• **cancelEvent**: *any*

*Inherited from [AccessRule](accessrule.md).[cancelEvent](accessrule.md#cancelevent)*

Defined in bpmnServer/src/acl/Rules.ts:30

___

###  delay

• **delay**: *any*

*Inherited from [AccessRule](accessrule.md).[delay](accessrule.md#delay)*

Defined in bpmnServer/src/acl/Rules.ts:28

___

###  element

• **element**: *any*

*Inherited from [AccessRule](accessrule.md).[element](accessrule.md#element)*

Defined in bpmnServer/src/acl/Rules.ts:22

___

###  event

• **event**: *any*

*Inherited from [AccessRule](accessrule.md).[event](accessrule.md#event)*

Defined in bpmnServer/src/acl/Rules.ts:15

___

###  id

• **id**: *any*

*Inherited from [AccessRule](accessrule.md).[id](accessrule.md#id)*

Defined in bpmnServer/src/acl/Rules.ts:14

___

###  privilege

• **privilege**: *any*

*Inherited from [AccessRule](accessrule.md).[privilege](accessrule.md#privilege)*

Defined in bpmnServer/src/acl/Rules.ts:24

___

###  repeat

• **repeat**: *any*

*Inherited from [AccessRule](accessrule.md).[repeat](accessrule.md#repeat)*

Defined in bpmnServer/src/acl/Rules.ts:29

___

###  template

• **template**: *any*

*Inherited from [AccessRule](accessrule.md).[template](accessrule.md#template)*

Defined in bpmnServer/src/acl/Rules.ts:26

___

###  type

• **type**: *any*

*Inherited from [AccessRule](accessrule.md).[type](accessrule.md#type)*

Defined in bpmnServer/src/acl/Rules.ts:13

___

###  user

• **user**: *any*

*Inherited from [AccessRule](accessrule.md).[user](accessrule.md#user)*

Defined in bpmnServer/src/acl/Rules.ts:17

___

###  userGroup

• **userGroup**: *any*

*Inherited from [AccessRule](accessrule.md).[userGroup](accessrule.md#usergroup)*

Defined in bpmnServer/src/acl/Rules.ts:19

## Methods

###  assignUser

▸ **assignUser**(`obj`: any, `context`: any): *void*

*Inherited from [AccessRule](accessrule.md).[assignUser](accessrule.md#assignuser)*

Defined in bpmnServer/src/acl/Rules.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`obj` | any |
`context` | any |

**Returns:** *void*

___

###  describe

▸ **describe**(): *string*

*Overrides [AccessRule](accessrule.md).[describe](accessrule.md#describe)*

Defined in bpmnServer/src/acl/Rules.ts:160

**Returns:** *string*

___

###  describeUser

▸ **describeUser**(): *string*

*Inherited from [AccessRule](accessrule.md).[describeUser](accessrule.md#describeuser)*

Defined in bpmnServer/src/acl/Rules.ts:98

**Returns:** *string*

___

###  getActor

▸ **getActor**(`context`: any, `actor`: any): *any*

*Inherited from [AccessRule](accessrule.md).[getActor](accessrule.md#getactor)*

Defined in bpmnServer/src/acl/Rules.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`context` | any |
`actor` | any |

**Returns:** *any*

___

###  invoke

▸ **invoke**(`context`: [IExecution](../interfaces/iexecution.md)): *void*

*Overrides [AccessRule](accessrule.md).[invoke](accessrule.md#invoke)*

Defined in bpmnServer/src/acl/Rules.ts:153

**Parameters:**

Name | Type |
------ | ------ |
`context` | [IExecution](../interfaces/iexecution.md) |

**Returns:** *void*
