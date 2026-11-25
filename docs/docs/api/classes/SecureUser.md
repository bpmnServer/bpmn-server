[bpmn-server](../readme.md) / SecureUser

# Class: SecureUser

## Implements

- [`ISecureUser`](../interfaces/ISecureUser.md)

## Table of contents

### Constructors

- [constructor](SecureUser.md#constructor)

### Properties

- [userName](SecureUser.md#username)
- [userGroups](SecureUser.md#usergroups)
- [tenantId](SecureUser.md#tenantid)
- [modelsOwner](SecureUser.md#modelsowner)
- [#bypass](SecureUser.md##bypass)
- [warned](SecureUser.md#warned)

### Accessors

- [securityBypassed](SecureUser.md#securitybypassed)

### Methods

- [SystemUser](SecureUser.md#systemuser)
- [isAdmin](SecureUser.md#isadmin)
- [isSystem](SecureUser.md#issystem)
- [inGroup](SecureUser.md#ingroup)
- [qualifyInstances](SecureUser.md#qualifyinstances)
- [qualifyItems](SecureUser.md#qualifyitems)
- [qualifyStartEvents](SecureUser.md#qualifystartevents)
- [qualifyDeleteInstances](SecureUser.md#qualifydeleteinstances)
- [qualifyModels](SecureUser.md#qualifymodels)
- [canModifyModel](SecureUser.md#canmodifymodel)
- [canDeleteModel](SecureUser.md#candeletemodel)
- [qualifyViewItems](SecureUser.md#qualifyviewitems)
- [canInvoke](SecureUser.md#caninvoke)
- [canAssign](SecureUser.md#canassign)
- [canStart](SecureUser.md#canstart)

## Constructors

### constructor

• **new SecureUser**(`params`, `options?`): [`SecureUser`](SecureUser.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`IUserInfo`](../interfaces/IUserInfo.md) | - |
| `options` | `Object` | - |
| `options.enforceSecurity?` | `boolean` | true or false decides it for this user; absent, the environment does (as before, but for this user only: the upstream set it once for the whole process, and never back) |

#### Returns

[`SecureUser`](SecureUser.md)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:53](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L53)

## Properties

### userName

• **userName**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[userName](../interfaces/ISecureUser.md#username)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L40)

___

### userGroups

• **userGroups**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[userGroups](../interfaces/ISecureUser.md#usergroups)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L41)

___

### tenantId

• `Optional` **tenantId**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[tenantId](../interfaces/ISecureUser.md#tenantid)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L42)

___

### modelsOwner

• `Optional` **modelsOwner**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[modelsOwner](../interfaces/ISecureUser.md#modelsowner)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:43](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L43)

___

### #bypass

• `Private` `Readonly` **#bypass**: `boolean`

Whether the security rules are off for this user: decided when it is made, never changed after, never shared with another user.

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L45)

___

### warned

▪ `Static` `Private` **warned**: `boolean` = `false`

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:46](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L46)

## Accessors

### securityBypassed

• `get` **securityBypassed**(): `boolean`

Whether this user's security rules are off.

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L62)

## Methods

### SystemUser

▸ **SystemUser**(): [`SecureUser`](SecureUser.md)

#### Returns

[`SecureUser`](SecureUser.md)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L63)

___

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[isAdmin](../interfaces/ISecureUser.md#isadmin)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:66](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L66)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[isSystem](../interfaces/ISecureUser.md#issystem)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L71)

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

[ISecureUser](../interfaces/ISecureUser.md).[inGroup](../interfaces/ISecureUser.md#ingroup)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:76](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L76)

___

### qualifyInstances

▸ **qualifyInstances**(`query`, `filters?`): `any`

The query narrowed to what this user may see: their tenant's, and, unless an administrator, what the add-ons'
filters let them (`filters`: the server's, registrationsOf(server).queryFilters; the Assignment add-on's, the
tasks offered to them). Without `filters` (a caller from before add-ons), the tasks offered to them, as before.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](../interfaces/IQueryFilter.md)[] |

#### Returns

`any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[qualifyInstances](../interfaces/ISecureUser.md#qualifyinstances)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L86)

___

### qualifyItems

▸ **qualifyItems**(`query`, `filters?`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](../interfaces/IQueryFilter.md)[] |

#### Returns

`any`

query

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[qualifyItems](../interfaces/ISecureUser.md#qualifyitems)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:127](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L127)

___

### qualifyStartEvents

▸ **qualifyStartEvents**(`query`, `filters?`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](../interfaces/IQueryFilter.md)[] |

#### Returns

`any`

query

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[qualifyStartEvents](../interfaces/ISecureUser.md#qualifystartevents)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:143](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L143)

___

### qualifyDeleteInstances

▸ **qualifyDeleteInstances**(`query`, `filters?`): `any`

alters the query adding conditions based on security rules

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |
| `filters?` | [`IQueryFilter`](../interfaces/IQueryFilter.md)[] |

#### Returns

`any`

query

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[qualifyDeleteInstances](../interfaces/ISecureUser.md#qualifydeleteinstances)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:167](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L167)

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

[ISecureUser](../interfaces/ISecureUser.md).[qualifyModels](../interfaces/ISecureUser.md#qualifymodels)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:178](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L178)

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

[ISecureUser](../interfaces/ISecureUser.md).[canModifyModel](../interfaces/ISecureUser.md#canmodifymodel)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:188](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L188)

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

[ISecureUser](../interfaces/ISecureUser.md).[canDeleteModel](../interfaces/ISecureUser.md#candeletemodel)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:196](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L196)

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

[ISecureUser](../interfaces/ISecureUser.md).[qualifyViewItems](../interfaces/ISecureUser.md#qualifyviewitems)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:207](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L207)

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

[ISecureUser](../interfaces/ISecureUser.md).[canInvoke](../interfaces/ISecureUser.md#caninvoke)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:210](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L210)

___

### canAssign

▸ **canAssign**(`item`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[canAssign](../interfaces/ISecureUser.md#canassign)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:219](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L219)

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

[ISecureUser](../interfaces/ISecureUser.md).[canStart](../interfaces/ISecureUser.md#canstart)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:246](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L246)
