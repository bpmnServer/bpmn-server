[bpmn-server](../README.md) / IUserService

# Interface: IUserService

## Table of contents

### Methods

- [addUser](IUserService.md#adduser)
- [findUsers](IUserService.md#findusers)
- [install](IUserService.md#install)
- [setPassword](IUserService.md#setpassword)

## Methods

### addUser

▸ **addUser**(`userName`, `email`, `password`, `userGroups`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `userName` | `any` |
| `email` | `any` |
| `password` | `any` |
| `userGroups` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/User.ts:64](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/User.ts#lines-64)

___

### findUsers

▸ **findUsers**(`query`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/User.ts:63](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/User.ts#lines-63)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/User.ts:66](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/User.ts#lines-66)

___

### setPassword

▸ **setPassword**(`userName`, `password`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `userName` | `any` |
| `password` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/User.ts:65](https://bitbucket.org/ralphhanna/bpmn-server/src/2ac50a51/WebApp/bpmnServer/src/interfaces/User.ts#lines-65)
