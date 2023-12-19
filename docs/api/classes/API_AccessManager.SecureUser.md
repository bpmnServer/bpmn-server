[bpmn-server](../README.md) / [Exports](../modules.md) / [API/AccessManager](../modules/API_AccessManager.md) / SecureUser

# Class: SecureUser

[API/AccessManager](../modules/API_AccessManager.md).SecureUser

## Implements

- [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md)

## Table of contents

### Constructors

- [constructor](API_AccessManager.SecureUser.md#constructor)

### Properties

- [modelsOwner](API_AccessManager.SecureUser.md#modelsowner)
- [tenantId](API_AccessManager.SecureUser.md#tenantid)
- [userGroups](API_AccessManager.SecureUser.md#usergroups)
- [userName](API_AccessManager.SecureUser.md#username)

### Methods

- [canAssign](API_AccessManager.SecureUser.md#canassign)
- [canDeleteModel](API_AccessManager.SecureUser.md#candeletemodel)
- [canInvoke](API_AccessManager.SecureUser.md#caninvoke)
- [canModifyModel](API_AccessManager.SecureUser.md#canmodifymodel)
- [canStart](API_AccessManager.SecureUser.md#canstart)
- [inGroup](API_AccessManager.SecureUser.md#ingroup)
- [isAdmin](API_AccessManager.SecureUser.md#isadmin)
- [isSystem](API_AccessManager.SecureUser.md#issystem)
- [qualifyDeleteInstances](API_AccessManager.SecureUser.md#qualifydeleteinstances)
- [qualifyInstances](API_AccessManager.SecureUser.md#qualifyinstances)
- [qualifyItems](API_AccessManager.SecureUser.md#qualifyitems)
- [qualifyModels](API_AccessManager.SecureUser.md#qualifymodels)
- [qualifyStartEvents](API_AccessManager.SecureUser.md#qualifystartevents)
- [qualifyViewItems](API_AccessManager.SecureUser.md#qualifyviewitems)
- [SystemUser](API_AccessManager.SecureUser.md#systemuser)

## Constructors

### constructor

• **new SecureUser**(`params`): [`SecureUser`](API_AccessManager.SecureUser.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`IUserInfo`](../interfaces/interfaces_User.IUserInfo.md) |

#### Returns

[`SecureUser`](API_AccessManager.SecureUser.md)

#### Defined in

[src/API/AccessManager.ts:15](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L15)

## Properties

### modelsOwner

• `Optional` **modelsOwner**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[modelsOwner](../interfaces/interfaces_User.ISecureUser.md#modelsowner)

#### Defined in

[src/API/AccessManager.ts:14](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L14)

___

### tenantId

• `Optional` **tenantId**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[tenantId](../interfaces/interfaces_User.ISecureUser.md#tenantid)

#### Defined in

[src/API/AccessManager.ts:13](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L13)

___

### userGroups

• **userGroups**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[userGroups](../interfaces/interfaces_User.ISecureUser.md#usergroups)

#### Defined in

[src/API/AccessManager.ts:12](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L12)

___

### userName

• **userName**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[userName](../interfaces/interfaces_User.ISecureUser.md#username)

#### Defined in

[src/API/AccessManager.ts:11](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L11)

## Methods

### canAssign

▸ **canAssign**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[canAssign](../interfaces/interfaces_User.ISecureUser.md#canassign)

#### Defined in

[src/API/AccessManager.ts:152](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L152)

___

### canDeleteModel

▸ **canDeleteModel**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[canDeleteModel](../interfaces/interfaces_User.ISecureUser.md#candeletemodel)

#### Defined in

[src/API/AccessManager.ts:139](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L139)

___

### canInvoke

▸ **canInvoke**(`item`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[canInvoke](../interfaces/interfaces_User.ISecureUser.md#caninvoke)

#### Defined in

[src/API/AccessManager.ts:151](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L151)

___

### canModifyModel

▸ **canModifyModel**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[canModifyModel](../interfaces/interfaces_User.ISecureUser.md#canmodifymodel)

#### Defined in

[src/API/AccessManager.ts:131](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L131)

___

### canStart

▸ **canStart**(`name`, `startNodeId`, `user`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |
| `startNodeId` | `any` |
| `user` | `any` |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[canStart](../interfaces/interfaces_User.ISecureUser.md#canstart)

#### Defined in

[src/API/AccessManager.ts:153](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L153)

___

### inGroup

▸ **inGroup**(`userGroup`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `userGroup` | `any` |

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[inGroup](../interfaces/interfaces_User.ISecureUser.md#ingroup)

#### Defined in

[src/API/AccessManager.ts:39](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L39)

___

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[isAdmin](../interfaces/interfaces_User.ISecureUser.md#isadmin)

#### Defined in

[src/API/AccessManager.ts:29](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L29)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[isSystem](../interfaces/interfaces_User.ISecureUser.md#issystem)

#### Defined in

[src/API/AccessManager.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L34)

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

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[qualifyDeleteInstances](../interfaces/interfaces_User.ISecureUser.md#qualifydeleteinstances)

#### Defined in

[src/API/AccessManager.ts:110](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L110)

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

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[qualifyInstances](../interfaces/interfaces_User.ISecureUser.md#qualifyinstances)

#### Defined in

[src/API/AccessManager.ts:49](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L49)

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

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[qualifyItems](../interfaces/interfaces_User.ISecureUser.md#qualifyitems)

#### Defined in

[src/API/AccessManager.ts:76](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L76)

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

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[qualifyModels](../interfaces/interfaces_User.ISecureUser.md#qualifymodels)

#### Defined in

[src/API/AccessManager.ts:121](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L121)

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

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[qualifyStartEvents](../interfaces/interfaces_User.ISecureUser.md#qualifystartevents)

#### Defined in

[src/API/AccessManager.ts:88](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L88)

___

### qualifyViewItems

▸ **qualifyViewItems**(`query`): `Promise`\<`void`\>

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`Promise`\<`void`\>

query

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[qualifyViewItems](../interfaces/interfaces_User.ISecureUser.md#qualifyviewitems)

#### Defined in

[src/API/AccessManager.ts:150](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L150)

___

### SystemUser

▸ **SystemUser**(): [`SecureUser`](API_AccessManager.SecureUser.md)

#### Returns

[`SecureUser`](API_AccessManager.SecureUser.md)

#### Defined in

[src/API/AccessManager.ts:26](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/AccessManager.ts#L26)
