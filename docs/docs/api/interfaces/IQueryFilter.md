[bpmn-server](../readme.md) / IQueryFilter

# Interface: IQueryFilter

What a user sees, narrowed by an add-on: the query of the tasks (`items`), the cases (`instances`) or the processes
they may start (`startEvents`), changed for this user (who is not an administrator). Each registered one is applied
in turn (SecureUser.qualify*).

## Table of contents

### Properties

- [name](IQueryFilter.md#name)

### Methods

- [filter](IQueryFilter.md#filter)

## Properties

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:96](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L96)

## Methods

### filter

▸ **filter**(`kind`, `user`, `query`): `Record`\<`string`, `any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `kind` | ``"items"`` \| ``"instances"`` \| ``"startEvents"`` |
| `user` | `Object` |
| `user.userName` | `string` |
| `user.userGroups` | `string`[] |
| `query` | `Record`\<`string`, `any`\> |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:97](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L97)
