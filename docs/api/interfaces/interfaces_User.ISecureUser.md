[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/User](../modules/interfaces_User.md) / ISecureUser

# Interface: ISecureUser

[interfaces/User](../modules/interfaces_User.md).ISecureUser

## Hierarchy

- [`IUserInfo`](interfaces_User.IUserInfo.md)

  ↳ **`ISecureUser`**

## Implemented by

- [`SecureUser`](../classes/API_AccessManager.SecureUser.md)
- [`SecureUser`](../classes/API_SecureUser.SecureUser.md)

## Table of contents

### Properties

- [modelsOwner](interfaces_User.ISecureUser.md#modelsowner)
- [tenantId](interfaces_User.ISecureUser.md#tenantid)
- [userGroups](interfaces_User.ISecureUser.md#usergroups)
- [userName](interfaces_User.ISecureUser.md#username)

### Methods

- [canAssign](interfaces_User.ISecureUser.md#canassign)
- [canDeleteModel](interfaces_User.ISecureUser.md#candeletemodel)
- [canInvoke](interfaces_User.ISecureUser.md#caninvoke)
- [canModifyModel](interfaces_User.ISecureUser.md#canmodifymodel)
- [canStart](interfaces_User.ISecureUser.md#canstart)
- [inGroup](interfaces_User.ISecureUser.md#ingroup)
- [isAdmin](interfaces_User.ISecureUser.md#isadmin)
- [isSystem](interfaces_User.ISecureUser.md#issystem)
- [qualifyDeleteInstances](interfaces_User.ISecureUser.md#qualifydeleteinstances)
- [qualifyInstances](interfaces_User.ISecureUser.md#qualifyinstances)
- [qualifyItems](interfaces_User.ISecureUser.md#qualifyitems)
- [qualifyModels](interfaces_User.ISecureUser.md#qualifymodels)
- [qualifyStartEvents](interfaces_User.ISecureUser.md#qualifystartevents)
- [qualifyViewItems](interfaces_User.ISecureUser.md#qualifyviewitems)

## Properties

### modelsOwner

• `Optional` **modelsOwner**: `string`

#### Inherited from

[IUserInfo](interfaces_User.IUserInfo.md).[modelsOwner](interfaces_User.IUserInfo.md#modelsowner)

#### Defined in

[src/interfaces/User.ts:6](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L6)

___

### tenantId

• `Optional` **tenantId**: `string`

#### Inherited from

[IUserInfo](interfaces_User.IUserInfo.md).[tenantId](interfaces_User.IUserInfo.md#tenantid)

#### Defined in

[src/interfaces/User.ts:5](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L5)

___

### userGroups

• **userGroups**: `string`[]

#### Inherited from

[IUserInfo](interfaces_User.IUserInfo.md).[userGroups](interfaces_User.IUserInfo.md#usergroups)

#### Defined in

[src/interfaces/User.ts:4](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L4)

___

### userName

• **userName**: `string`

#### Inherited from

[IUserInfo](interfaces_User.IUserInfo.md).[userName](interfaces_User.IUserInfo.md#username)

#### Defined in

[src/interfaces/User.ts:3](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L3)

## Methods

### canAssign

▸ **canAssign**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`

#### Defined in

[src/interfaces/User.ts:58](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L58)

___

### canDeleteModel

▸ **canDeleteModel**(`name`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`any`

#### Defined in

[src/interfaces/User.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L50)

___

### canInvoke

▸ **canInvoke**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`

#### Defined in

[src/interfaces/User.ts:57](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L57)

___

### canModifyModel

▸ **canModifyModel**(`name`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`any`

#### Defined in

[src/interfaces/User.ts:47](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L47)

___

### canStart

▸ **canStart**(`name`, `startNodeId`, `user`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `startNodeId` | `any` |
| `user` | `any` |

#### Returns

`any`

#### Defined in

[src/interfaces/User.ts:59](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L59)

___

### inGroup

▸ **inGroup**(`userGroup`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `userGroup` | `any` |

#### Returns

`boolean`

#### Defined in

[src/interfaces/User.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L12)

___

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/interfaces/User.ts:10](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L10)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/interfaces/User.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L11)

___

### qualifyDeleteInstances

▸ **qualifyDeleteInstances**(`query`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

query

#### Defined in

[src/interfaces/User.ts:38](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L38)

___

### qualifyInstances

▸ **qualifyInstances**(`query`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

query

#### Defined in

[src/interfaces/User.ts:18](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L18)

___

### qualifyItems

▸ **qualifyItems**(`query`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

query

#### Defined in

[src/interfaces/User.ts:25](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L25)

___

### qualifyModels

▸ **qualifyModels**(`query`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

query

#### Defined in

[src/interfaces/User.ts:44](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L44)

___

### qualifyStartEvents

▸ **qualifyStartEvents**(`query`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

query

#### Defined in

[src/interfaces/User.ts:32](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L32)

___

### qualifyViewItems

▸ **qualifyViewItems**(`query`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

query

#### Defined in

[src/interfaces/User.ts:56](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L56)
