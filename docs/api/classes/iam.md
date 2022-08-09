[bpmn-server](../README.md) › [IAM](iam.md)

# Class: IAM

## Hierarchy

* **IAM**

## Implements

* [IIAM](../interfaces/iiam.md)

## Index

### Constructors

* [constructor](iam.md#constructor)

### Properties

* [server](iam.md#server)
* [currentUsers](iam.md#static-currentusers)

### Methods

* [addUser](iam.md#adduser)
* [getCurrentUser](iam.md#getcurrentuser)
* [getUser](iam.md#getuser)
* [getUsersForGroup](iam.md#getusersforgroup)
* [login](iam.md#login)

## Constructors

###  constructor

\+ **new IAM**(`server`: any): *[IAM](iam.md)*

Defined in bpmnServer/src/server/ACL.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *[IAM](iam.md)*

## Properties

###  server

• **server**: *any*

Defined in bpmnServer/src/server/ACL.ts:15

___

### `Static` currentUsers

▪ **currentUsers**: *Map‹any, any›* = new Map()

Defined in bpmnServer/src/server/ACL.ts:16

## Methods

###  addUser

▸ **addUser**(`userId`: any, `name`: any, `email`: any, `userGroups`: any, `password`: any): *Promise‹[User](user.md)‹››*

*Implementation of [IIAM](../interfaces/iiam.md)*

Defined in bpmnServer/src/server/ACL.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`userId` | any |
`name` | any |
`email` | any |
`userGroups` | any |
`password` | any |

**Returns:** *Promise‹[User](user.md)‹››*

___

###  getCurrentUser

▸ **getCurrentUser**(`key`: any): *[User](user.md)*

*Implementation of [IIAM](../interfaces/iiam.md)*

Defined in bpmnServer/src/server/ACL.ts:52

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`key` | any |   |

**Returns:** *[User](user.md)*

___

###  getUser

▸ **getUser**(`userId`: any): *Promise‹[User](user.md)›*

*Implementation of [IIAM](../interfaces/iiam.md)*

Defined in bpmnServer/src/server/ACL.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`userId` | any |

**Returns:** *Promise‹[User](user.md)›*

___

###  getUsersForGroup

▸ **getUsersForGroup**(`userGroup`: any): *Promise‹[User](user.md)[]›*

*Implementation of [IIAM](../interfaces/iiam.md)*

Defined in bpmnServer/src/server/ACL.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`userGroup` | any |

**Returns:** *Promise‹[User](user.md)[]›*

___

###  login

▸ **login**(`userId`: any, `password`: any): *Promise‹any›*

*Implementation of [IIAM](../interfaces/iiam.md)*

Defined in bpmnServer/src/server/ACL.ts:39

Returns a key

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`userId` | any | - |
`password` | any |   |

**Returns:** *Promise‹any›*
