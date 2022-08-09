[bpmn-server](../README.md) › [AccessRule](accessrule.md)

# Class: AccessRule

Notify Rule
 Notify {user} on {event} of {object} using {template}

## Hierarchy

* **AccessRule**

  ↳ [AuthorizeRule](authorizerule.md)

  ↳ [DesignateRule](designaterule.md)

  ↳ [NotifyRule](notifyrule.md)

  ↳ [AssignRule](assignrule.md)

## Index

### Constructors

* [constructor](accessrule.md#constructor)

### Properties

* [actor](accessrule.md#actor)
* [assignActor](accessrule.md#assignactor)
* [cancelEvent](accessrule.md#cancelevent)
* [delay](accessrule.md#delay)
* [element](accessrule.md#element)
* [event](accessrule.md#event)
* [id](accessrule.md#id)
* [privilege](accessrule.md#privilege)
* [repeat](accessrule.md#repeat)
* [template](accessrule.md#template)
* [type](accessrule.md#type)
* [user](accessrule.md#user)
* [userGroup](accessrule.md#usergroup)

### Methods

* [assignUser](accessrule.md#assignuser)
* [describe](accessrule.md#describe)
* [describeUser](accessrule.md#describeuser)
* [getActor](accessrule.md#getactor)
* [invoke](accessrule.md#invoke)

## Constructors

###  constructor

\+ **new AccessRule**(`type`: any, `id`: any, `user`: any, `userGroup`: any, `actor`: any, `event`: any, `element`: any): *[AccessRule](accessrule.md)*

Defined in bpmnServer/src/acl/Rules.ts:30

-- user spec

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`type` | any | - | - |
`id` | any | - | - |
`user` | any | null | - |
`userGroup` | any | null | - |
`actor` | any | null |   |
`event` | any | - |   -- target object |
`element` | any | null |   |

**Returns:** *[AccessRule](accessrule.md)*

## Properties

###  actor

• **actor**: *any*

Defined in bpmnServer/src/acl/Rules.ts:18

___

###  assignActor

• **assignActor**: *any*

Defined in bpmnServer/src/acl/Rules.ts:27

___

###  cancelEvent

• **cancelEvent**: *any*

Defined in bpmnServer/src/acl/Rules.ts:30

___

###  delay

• **delay**: *any*

Defined in bpmnServer/src/acl/Rules.ts:28

___

###  element

• **element**: *any*

Defined in bpmnServer/src/acl/Rules.ts:22

___

###  event

• **event**: *any*

Defined in bpmnServer/src/acl/Rules.ts:15

___

###  id

• **id**: *any*

Defined in bpmnServer/src/acl/Rules.ts:14

___

###  privilege

• **privilege**: *any*

Defined in bpmnServer/src/acl/Rules.ts:24

___

###  repeat

• **repeat**: *any*

Defined in bpmnServer/src/acl/Rules.ts:29

___

###  template

• **template**: *any*

Defined in bpmnServer/src/acl/Rules.ts:26

___

###  type

• **type**: *any*

Defined in bpmnServer/src/acl/Rules.ts:13

___

###  user

• **user**: *any*

Defined in bpmnServer/src/acl/Rules.ts:17

___

###  userGroup

• **userGroup**: *any*

Defined in bpmnServer/src/acl/Rules.ts:19

## Methods

###  assignUser

▸ **assignUser**(`obj`: any, `context`: any): *void*

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

Defined in bpmnServer/src/acl/Rules.ts:95

**Returns:** *string*

___

###  describeUser

▸ **describeUser**(): *string*

Defined in bpmnServer/src/acl/Rules.ts:98

**Returns:** *string*

___

###  getActor

▸ **getActor**(`context`: any, `actor`: any): *any*

Defined in bpmnServer/src/acl/Rules.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`context` | any |
`actor` | any |

**Returns:** *any*

___

###  invoke

▸ **invoke**(`context`: any): *void*

Defined in bpmnServer/src/acl/Rules.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`context` | any |

**Returns:** *void*
