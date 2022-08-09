[bpmn-server](../README.md) › [ACL](acl.md)

# Class: ACL

## Hierarchy

* **ACL**

## Implements

* [IACL](../interfaces/iacl.md)

## Index

### Constructors

* [constructor](acl.md#constructor)

### Properties

* [listener](acl.md#listener)
* [server](acl.md#server)

### Methods

* [canPerform](acl.md#canperform)
* [cancelPendingAssignments](acl.md#cancelpendingassignments)
* [checkEvent](acl.md#checkevent)
* [checkFileExistsSync](acl.md#checkfileexistssync)
* [listen](acl.md#listen)
* [loadAccessRules](acl.md#loadaccessrules)
* [convertRule](acl.md#static-convertrule)

## Constructors

###  constructor

\+ **new ACL**(`server`: any): *[ACL](acl.md)*

Defined in bpmnServer/src/server/ACL.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[ACL](acl.md)*

## Properties

###  listener

• **listener**: *EventEmitter*

*Implementation of [IACL](../interfaces/iacl.md).[listener](../interfaces/iacl.md#listener)*

Defined in bpmnServer/src/server/ACL.ts:68

___

###  server

• **server**: *any*

Defined in bpmnServer/src/server/ACL.ts:69

## Methods

###  canPerform

▸ **canPerform**(`operation`: any, `object`: any): *boolean*

*Implementation of [IACL](../interfaces/iacl.md)*

Defined in bpmnServer/src/server/ACL.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`operation` | any |
`object` | any |

**Returns:** *boolean*

___

###  cancelPendingAssignments

▸ **cancelPendingAssignments**(`self`: any, `id`: any, `seq`: any): *Promise‹void›*

Defined in bpmnServer/src/server/ACL.ts:192

**Parameters:**

Name | Type |
------ | ------ |
`self` | any |
`id` | any |
`seq` | any |

**Returns:** *Promise‹void›*

___

###  checkEvent

▸ **checkEvent**(`event`: any, `context`: any): *void*

Defined in bpmnServer/src/server/ACL.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`context` | any |

**Returns:** *void*

___

###  checkFileExistsSync

▸ **checkFileExistsSync**(`filepath`: any): *boolean*

Defined in bpmnServer/src/server/ACL.ts:100

**Parameters:**

Name | Type |
------ | ------ |
`filepath` | any |

**Returns:** *boolean*

___

###  listen

▸ **listen**(`listener`: any): *void*

Defined in bpmnServer/src/server/ACL.ts:157

**Parameters:**

Name | Type |
------ | ------ |
`listener` | any |

**Returns:** *void*

___

###  loadAccessRules

▸ **loadAccessRules**(`processName`: any): *any[]*

Defined in bpmnServer/src/server/ACL.ts:109

**Parameters:**

Name | Type |
------ | ------ |
`processName` | any |

**Returns:** *any[]*

___

### `Static` convertRule

▸ **convertRule**(`spec`: any): *[AuthorizeRule](authorizerule.md)‹› | [DesignateRule](designaterule.md)‹› | [NotifyRule](notifyrule.md)‹› | [AssignRule](assignrule.md)‹›*

Defined in bpmnServer/src/server/ACL.ts:140

**Parameters:**

Name | Type |
------ | ------ |
`spec` | any |

**Returns:** *[AuthorizeRule](authorizerule.md)‹› | [DesignateRule](designaterule.md)‹› | [NotifyRule](notifyrule.md)‹› | [AssignRule](assignrule.md)‹›*
