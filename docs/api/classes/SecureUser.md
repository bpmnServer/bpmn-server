[bpmn-server](../README.md) / SecureUser

# Class: SecureUser

## Implements

- [`ISecureUser`](../interfaces/ISecureUser.md)

## Table of contents

### Constructors

- [constructor](SecureUser.md#constructor)

### Properties

- [modelsOwner](SecureUser.md#modelsowner)
- [tenantId](SecureUser.md#tenantid)
- [userGroups](SecureUser.md#usergroups)
- [userName](SecureUser.md#username)

### Methods

- [canAssign](SecureUser.md#canassign)
- [canDeleteModel](SecureUser.md#candeletemodel)
- [canInvoke](SecureUser.md#caninvoke)
- [canModifyModel](SecureUser.md#canmodifymodel)
- [canStart](SecureUser.md#canstart)
- [inGroup](SecureUser.md#ingroup)
- [isAdmin](SecureUser.md#isadmin)
- [isSystem](SecureUser.md#issystem)
- [qualifyDeleteInstances](SecureUser.md#qualifydeleteinstances)
- [qualifyInstances](SecureUser.md#qualifyinstances)
- [qualifyItems](SecureUser.md#qualifyitems)
- [qualifyModels](SecureUser.md#qualifymodels)
- [qualifyStartEvents](SecureUser.md#qualifystartevents)
- [qualifyViewItems](SecureUser.md#qualifyviewitems)
- [SystemUser](SecureUser.md#systemuser)

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

[API/SecureUser.ts:37](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-37)

## Properties

### modelsOwner

• `Optional` **modelsOwner**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[modelsOwner](../interfaces/ISecureUser.md#modelsowner)

#### Defined in

[API/SecureUser.ts:36](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-36)

___

### tenantId

• `Optional` **tenantId**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[tenantId](../interfaces/ISecureUser.md#tenantid)

#### Defined in

[API/SecureUser.ts:35](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-35)

___

### userGroups

• **userGroups**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[userGroups](../interfaces/ISecureUser.md#usergroups)

#### Defined in

[API/SecureUser.ts:34](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-34)

___

### userName

• **userName**: `any`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[userName](../interfaces/ISecureUser.md#username)

#### Defined in

[API/SecureUser.ts:33](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-33)

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

[ISecureUser](../interfaces/ISecureUser.md).[canAssign](../interfaces/ISecureUser.md#canassign)

#### Defined in

[API/SecureUser.ts:198](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-198)

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

[API/SecureUser.ts:175](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-175)

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

[API/SecureUser.ts:189](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-189)

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

[API/SecureUser.ts:167](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-167)

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

[API/SecureUser.ts:225](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-225)

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

[API/SecureUser.ts:63](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-63)

___

### isAdmin

▸ **isAdmin**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[isAdmin](../interfaces/ISecureUser.md#isadmin)

#### Defined in

[API/SecureUser.ts:53](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-53)

___

### isSystem

▸ **isSystem**(): `boolean`

#### Returns

`boolean`

#### Implementation of

[ISecureUser](../interfaces/ISecureUser.md).[isSystem](../interfaces/ISecureUser.md#issystem)

#### Defined in

[API/SecureUser.ts:58](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-58)

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

[API/SecureUser.ts:146](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-146)

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

[API/SecureUser.ts:73](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-73)

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

[API/SecureUser.ts:112](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-112)

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

[API/SecureUser.ts:157](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-157)

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

[API/SecureUser.ts:124](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-124)

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

[API/SecureUser.ts:186](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-186)

___

### SystemUser

▸ **SystemUser**(): [`SecureUser`](SecureUser.md)

#### Returns

[`SecureUser`](SecureUser.md)

#### Defined in

[API/SecureUser.ts:50](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/API/SecureUser.ts#lines-50)
