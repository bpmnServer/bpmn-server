[bpmn-server](../README.md) / [Exports](../modules.md) / [interfaces/User](../modules/interfaces_User.md) / IUserService

# Interface: IUserService

[interfaces/User](../modules/interfaces_User.md).IUserService

## Table of contents

### Methods

- [addUser](interfaces_User.IUserService.md#adduser)
- [findUsers](interfaces_User.IUserService.md#findusers)
- [install](interfaces_User.IUserService.md#install)
- [setPassword](interfaces_User.IUserService.md#setpassword)

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

[src/interfaces/User.ts:64](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L64)

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

[src/interfaces/User.ts:63](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L63)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[src/interfaces/User.ts:66](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L66)

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

[src/interfaces/User.ts:65](https://github.com/linonetwo/bpmn-server/blob/02da6f2/src/interfaces/User.ts#L65)
