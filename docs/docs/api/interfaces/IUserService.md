[bpmn-server](../readme.md) / IUserService

# Interface: IUserService

## Table of contents

### Methods

- [findUsers](IUserService.md#findusers)
- [addUser](IUserService.md#adduser)
- [setPassword](IUserService.md#setpassword)
- [install](IUserService.md#install)

## Methods

### findUsers

▸ **findUsers**(`query`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `any` |

#### Returns

`any`

#### Defined in

[interfaces/User.ts:63](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L63)

___

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

[interfaces/User.ts:64](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L64)

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

[interfaces/User.ts:65](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L65)

___

### install

▸ **install**(): `any`

#### Returns

`any`

#### Defined in

[interfaces/User.ts:66](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/interfaces/User.ts#L66)
