[bpmn-server](../readme.md) / ISecureUser

# Interface: ISecureUser

## Hierarchy

- [`IUserInfo`](IUserInfo.md)

  ↳ **`ISecureUser`**

## Implemented by

- [`SecureUser`](../classes/SecureUser.md)

## Table of contents

### Properties

- [userName](ISecureUser.md#username)
- [userGroups](ISecureUser.md#usergroups)
- [tenantId](ISecureUser.md#tenantid)
- [modelsOwner](ISecureUser.md#modelsowner)

### Methods

- [isAdmin](ISecureUser.md#isadmin)
- [isSystem](ISecureUser.md#issystem)
- [inGroup](ISecureUser.md#ingroup)
- [qualifyInstances](ISecureUser.md#qualifyinstances)
- [qualifyItems](ISecureUser.md#qualifyitems)
- [qualifyStartEvents](ISecureUser.md#qualifystartevents)
- [qualifyDeleteInstances](ISecureUser.md#qualifydeleteinstances)
- [qualifyModels](ISecureUser.md#qualifymodels)
- [canModifyModel](ISecureUser.md#canmodifymodel)
- [canDeleteModel](ISecureUser.md#candeletemodel)
- [qualifyViewItems](ISecureUser.md#qualifyviewitems)
- [canInvoke](ISecureUser.md#caninvoke)
- [canAssign](ISecureUser.md#canassign)
- [canStart](ISecureUser.md#canstart)

## Properties

### userName

• **userName**: `string`

#### Inherited from

[IUserInfo](IUserInfo.md).[userName](IUserInfo.md#username)

#### Defined in

[interfaces/User.ts:3](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L3)

___

### userGroups

• **userGroups**: `string`[]

#### Inherited from

[IUserInfo](IUserInfo.md).[userGroups](IUserInfo.md#usergroups)

#### Defined in

[interfaces/User.ts:4](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L4)

___

### tenantId

• `Optional` **tenantId**: `string`

#### Inherited from

[IUserInfo](IUserInfo.md).[tenantId](IUserInfo.md#tenantid)

#### Defined in

[interfaces/User.ts:5](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L5)

___

### modelsOwner

• `Optional` **modelsOwner**: `string`

#### Inherited from

[IUserInfo](IUserInfo.md).[modelsOwner](IUserInfo.md#modelsowner)

#### Defined in

[interfaces/User.ts:6](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L6)

## Methods

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Defined in

[interfaces/User.ts:10](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L10)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Defined in

[interfaces/User.ts:11](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L11)

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

[interfaces/User.ts:12](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L12)

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

[interfaces/User.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L18)

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

[interfaces/User.ts:25](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L25)

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

[interfaces/User.ts:32](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L32)

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

[interfaces/User.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L38)

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

[interfaces/User.ts:44](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L44)

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

[interfaces/User.ts:47](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L47)

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

[interfaces/User.ts:50](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L50)

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

[interfaces/User.ts:56](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L56)

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

[interfaces/User.ts:57](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L57)

___

### canAssign

▸ **canAssign**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/User.ts:58](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L58)

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

[interfaces/User.ts:59](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L59)
