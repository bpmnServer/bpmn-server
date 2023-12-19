[bpmn-server](../README.md) / [Exports](../modules.md) / [API/SecureUser](../modules/API_SecureUser.md) / SecureUser

# Class: SecureUser

[API/SecureUser](../modules/API_SecureUser.md).SecureUser

## Implements

- [`ISecureUser`](../interfaces/interfaces_User.ISecureUser.md)

## Table of contents

### Constructors

- [constructor](API_SecureUser.SecureUser.md#constructor)

### Properties

- [modelsOwner](API_SecureUser.SecureUser.md#modelsowner)
- [tenantId](API_SecureUser.SecureUser.md#tenantid)
- [userGroups](API_SecureUser.SecureUser.md#usergroups)
- [userName](API_SecureUser.SecureUser.md#username)

### Methods

- [canAssign](API_SecureUser.SecureUser.md#canassign)
- [canDeleteModel](API_SecureUser.SecureUser.md#candeletemodel)
- [canInvoke](API_SecureUser.SecureUser.md#caninvoke)
- [canModifyModel](API_SecureUser.SecureUser.md#canmodifymodel)
- [canStart](API_SecureUser.SecureUser.md#canstart)
- [inGroup](API_SecureUser.SecureUser.md#ingroup)
- [isAdmin](API_SecureUser.SecureUser.md#isadmin)
- [isSystem](API_SecureUser.SecureUser.md#issystem)
- [qualifyDeleteInstances](API_SecureUser.SecureUser.md#qualifydeleteinstances)
- [qualifyInstances](API_SecureUser.SecureUser.md#qualifyinstances)
- [qualifyItems](API_SecureUser.SecureUser.md#qualifyitems)
- [qualifyModels](API_SecureUser.SecureUser.md#qualifymodels)
- [qualifyStartEvents](API_SecureUser.SecureUser.md#qualifystartevents)
- [qualifyViewItems](API_SecureUser.SecureUser.md#qualifyviewitems)
- [SystemUser](API_SecureUser.SecureUser.md#systemuser)

## Constructors

### constructor

• **new SecureUser**(`params`): [`SecureUser`](API_SecureUser.SecureUser.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`IUserInfo`](../interfaces/interfaces_User.IUserInfo.md) |

#### Returns

[`SecureUser`](API_SecureUser.SecureUser.md)

#### Defined in

[src/API/SecureUser.ts:37](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L37)

## Properties

### modelsOwner

• `Optional` **modelsOwner**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[modelsOwner](../interfaces/interfaces_User.ISecureUser.md#modelsowner)

#### Defined in

[src/API/SecureUser.ts:36](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L36)

___

### tenantId

• `Optional` **tenantId**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[tenantId](../interfaces/interfaces_User.ISecureUser.md#tenantid)

#### Defined in

[src/API/SecureUser.ts:35](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L35)

___

### userGroups

• **userGroups**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[userGroups](../interfaces/interfaces_User.ISecureUser.md#usergroups)

#### Defined in

[src/API/SecureUser.ts:34](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L34)

___

### userName

• **userName**: `any`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[userName](../interfaces/interfaces_User.ISecureUser.md#username)

#### Defined in

[src/API/SecureUser.ts:33](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L33)

## Methods

### canAssign

▸ **canAssign**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[canAssign](../interfaces/interfaces_User.ISecureUser.md#canassign)

#### Defined in

[src/API/SecureUser.ts:198](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L198)

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

[src/API/SecureUser.ts:175](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L175)

___

### canInvoke

▸ **canInvoke**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[canInvoke](../interfaces/interfaces_User.ISecureUser.md#caninvoke)

#### Defined in

[src/API/SecureUser.ts:189](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L189)

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

[src/API/SecureUser.ts:167](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L167)

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

[src/API/SecureUser.ts:225](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L225)

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

[src/API/SecureUser.ts:63](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L63)

___

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[isAdmin](../interfaces/interfaces_User.ISecureUser.md#isadmin)

#### Defined in

[src/API/SecureUser.ts:53](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L53)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/interfaces_User.ISecureUser.md).[isSystem](../interfaces/interfaces_User.ISecureUser.md#issystem)

#### Defined in

[src/API/SecureUser.ts:58](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L58)

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

[src/API/SecureUser.ts:146](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L146)

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

[src/API/SecureUser.ts:73](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L73)

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

[src/API/SecureUser.ts:112](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L112)

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

[src/API/SecureUser.ts:157](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L157)

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

[src/API/SecureUser.ts:124](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L124)

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

[src/API/SecureUser.ts:186](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L186)

___

### SystemUser

▸ **SystemUser**(): [`SecureUser`](API_SecureUser.SecureUser.md)

#### Returns

[`SecureUser`](API_SecureUser.SecureUser.md)

#### Defined in

[src/API/SecureUser.ts:50](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/API/SecureUser.ts#L50)
