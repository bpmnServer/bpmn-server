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

• **new SecureUser**(`params`): [`SecureUser`](SecureUser.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`IUserInfo`](../interfaces/IUserInfo.md) |

#### Returns

[`SecureUser`](SecureUser.md)

#### Defined in

[API/SecureUser.ts:40](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L40)

## Properties

### userName

• **userName**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[userName](../interfaces/ISecureUser.md#username)

#### Defined in

[API/SecureUser.ts:36](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L36)

___

### userGroups

• **userGroups**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[userGroups](../interfaces/ISecureUser.md#usergroups)

#### Defined in

[API/SecureUser.ts:37](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L37)

___

### tenantId

• `Optional` **tenantId**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[tenantId](../interfaces/ISecureUser.md#tenantid)

#### Defined in

[API/SecureUser.ts:38](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L38)

___

### modelsOwner

• `Optional` **modelsOwner**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[modelsOwner](../interfaces/ISecureUser.md#modelsowner)

#### Defined in

[API/SecureUser.ts:39](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L39)

## Methods

### SystemUser

▸ **SystemUser**(): [`SecureUser`](SecureUser.md)

#### Returns

[`SecureUser`](SecureUser.md)

#### Defined in

[API/SecureUser.ts:53](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L53)

___

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[isAdmin](../interfaces/ISecureUser.md#isadmin)

#### Defined in

[API/SecureUser.ts:56](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L56)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[isSystem](../interfaces/ISecureUser.md#issystem)

#### Defined in

[API/SecureUser.ts:61](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L61)

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

[API/SecureUser.ts:66](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L66)

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

[ISecureUser](../interfaces/ISecureUser.md).[qualifyInstances](../interfaces/ISecureUser.md#qualifyinstances)

#### Defined in

[API/SecureUser.ts:76](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L76)

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

[ISecureUser](../interfaces/ISecureUser.md).[qualifyItems](../interfaces/ISecureUser.md#qualifyitems)

#### Defined in

[API/SecureUser.ts:115](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L115)

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

[ISecureUser](../interfaces/ISecureUser.md).[qualifyStartEvents](../interfaces/ISecureUser.md#qualifystartevents)

#### Defined in

[API/SecureUser.ts:127](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L127)

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

[ISecureUser](../interfaces/ISecureUser.md).[qualifyDeleteInstances](../interfaces/ISecureUser.md#qualifydeleteinstances)

#### Defined in

[API/SecureUser.ts:149](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L149)

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

[API/SecureUser.ts:160](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L160)

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

[API/SecureUser.ts:170](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L170)

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

[API/SecureUser.ts:178](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L178)

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

[API/SecureUser.ts:189](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L189)

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

[API/SecureUser.ts:192](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L192)

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

[API/SecureUser.ts:201](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L201)

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

[API/SecureUser.ts:228](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L228)
