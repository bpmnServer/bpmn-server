[bpmn-server](../README.md) › [IIAM](iiam.md)

# Interface: IIAM

## Hierarchy

* **IIAM**

## Implemented by

* [IAM](../classes/iam.md)

## Index

### Methods

* [addUser](iiam.md#adduser)
* [getCurrentUser](iiam.md#getcurrentuser)
* [getUser](iiam.md#getuser)
* [getUsersForGroup](iiam.md#getusersforgroup)
* [login](iiam.md#login)

## Methods

###  addUser

▸ **addUser**(`userId`: any, `name`: any, `email`: any, `userGroups`: any, `password`: any): *Promise‹[IUser](iuser.md)›*

Defined in bpmnServer/src/interfaces/server.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`userId` | any |
`name` | any |
`email` | any |
`userGroups` | any |
`password` | any |

**Returns:** *Promise‹[IUser](iuser.md)›*

___

###  getCurrentUser

▸ **getCurrentUser**(`key`: any): *[IUser](iuser.md)*

Defined in bpmnServer/src/interfaces/server.ts:110

**Parameters:**

Name | Type |
------ | ------ |
`key` | any |

**Returns:** *[IUser](iuser.md)*

___

###  getUser

▸ **getUser**(`userId`: any): *Promise‹[IUser](iuser.md)›*

Defined in bpmnServer/src/interfaces/server.ts:111

**Parameters:**

Name | Type |
------ | ------ |
`userId` | any |

**Returns:** *Promise‹[IUser](iuser.md)›*

___

###  getUsersForGroup

▸ **getUsersForGroup**(`userGroup`: any): *Promise‹[IUser](iuser.md)[]›*

Defined in bpmnServer/src/interfaces/server.ts:112

**Parameters:**

Name | Type |
------ | ------ |
`userGroup` | any |

**Returns:** *Promise‹[IUser](iuser.md)[]›*

___

###  login

▸ **login**(`userId`: any, `password`: any): *any*

Defined in bpmnServer/src/interfaces/server.ts:109

**Parameters:**

Name | Type |
------ | ------ |
`userId` | any |
`password` | any |

**Returns:** *any*
