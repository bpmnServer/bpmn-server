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

[interfaces/User.ts:64](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/User.ts#L64)

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

[interfaces/User.ts:63](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/User.ts#L63)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/User.ts:66](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/User.ts#L66)

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

[interfaces/User.ts:65](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/interfaces/User.ts#L65)
