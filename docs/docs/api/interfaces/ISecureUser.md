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

[packages/bpmn-server/src/interfaces/User.ts:4](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L4)

___

### userGroups

• **userGroups**: `string`[]

#### Inherited from

[IUserInfo](IUserInfo.md).[userGroups](IUserInfo.md#usergroups)

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:5](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L5)

___

### tenantId

• `Optional` **tenantId**: `string`

#### Inherited from

[IUserInfo](IUserInfo.md).[tenantId](IUserInfo.md#tenantid)

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:6](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L6)

___

### modelsOwner

• `Optional` **modelsOwner**: `string`

#### Inherited from

[IUserInfo](IUserInfo.md).[modelsOwner](IUserInfo.md#modelsowner)

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:7](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L7)

## Methods

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L11)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L12)

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

[packages/bpmn-server/src/interfaces/User.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L13)

___

### qualifyInstances

▸ **qualifyInstances**(`query`, `filters?`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](IQueryFilter.md)[] |

#### Returns

`any`

query

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L19)

___

### qualifyItems

▸ **qualifyItems**(`query`, `filters?`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](IQueryFilter.md)[] |

#### Returns

`any`

query

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L26)

___

### qualifyStartEvents

▸ **qualifyStartEvents**(`query`, `filters?`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](IQueryFilter.md)[] |

#### Returns

`any`

query

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L33)

___

### qualifyDeleteInstances

▸ **qualifyDeleteInstances**(`query`, `filters?`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](IQueryFilter.md)[] |

#### Returns

`any`

query

#### Defined in

[packages/bpmn-server/src/interfaces/User.ts:39](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L39)

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

[packages/bpmn-server/src/interfaces/User.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L45)

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

[packages/bpmn-server/src/interfaces/User.ts:48](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L48)

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

[packages/bpmn-server/src/interfaces/User.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L51)

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

[packages/bpmn-server/src/interfaces/User.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L57)

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

[packages/bpmn-server/src/interfaces/User.ts:58](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L58)

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

[packages/bpmn-server/src/interfaces/User.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L59)

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

[packages/bpmn-server/src/interfaces/User.ts:60](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/User.ts#L60)
