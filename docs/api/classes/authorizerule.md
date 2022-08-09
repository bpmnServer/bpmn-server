[bpmn-server](../README.md) › [AuthorizeRule](authorizerule.md)

# Class: AuthorizeRule

Authorize {user/group} {privilege} to {process/element}
Privilege:
     View
     Edit
     Perform
     Assign

## Hierarchy

* [AccessRule](accessrule.md)

  ↳ **AuthorizeRule**

## Index

### Constructors

* [constructor](authorizerule.md#constructor)

### Properties

* [actor](authorizerule.md#actor)
* [assignActor](authorizerule.md#assignactor)
* [cancelEvent](authorizerule.md#cancelevent)
* [delay](authorizerule.md#delay)
* [element](authorizerule.md#element)
* [event](authorizerule.md#event)
* [id](authorizerule.md#id)
* [privilege](authorizerule.md#privilege)
* [repeat](authorizerule.md#repeat)
* [template](authorizerule.md#template)
* [type](authorizerule.md#type)
* [user](authorizerule.md#user)
* [userGroup](authorizerule.md#usergroup)

### Methods

* [assignUser](authorizerule.md#assignuser)
* [describe](authorizerule.md#describe)
* [describeUser](authorizerule.md#describeuser)
* [getActor](authorizerule.md#getactor)
* [invoke](authorizerule.md#invoke)

## Constructors

###  constructor

\+ **new AuthorizeRule**(`__namedParameters`: object): *[AuthorizeRule](authorizerule.md)*

*Overrides [AccessRule](accessrule.md).[constructor](accessrule.md#constructor)*

Defined in bpmnServer/src/acl/Rules.ts:116

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`actor` | any | null |
`element` | any | null |
`id` | any | - |
`privilege` | any | null |
`user` | any | null |
`userGroup` | any | null |

**Returns:** *[AuthorizeRule](authorizerule.md)*

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

Defined in bpmnServer/src/acl/Rules.ts:137

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

Defined in bpmnServer/src/acl/Rules.ts:125

**Parameters:**

Name | Type |
------ | ------ |
`context` | [IExecution](../interfaces/iexecution.md) |

**Returns:** *void*
