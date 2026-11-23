[bpmn-server](../readme.md) / IAccess

# Interface: IAccess

What a person may do with a case, or one of its tasks.

## Table of contents

### Properties

- [see](IAccess.md#see)
- [data](IAccess.md#data)
- [claim](IAccess.md#claim)
- [complete](IAccess.md#complete)
- [assign](IAccess.md#assign)
- [restart](IAccess.md#restart)
- [events](IAccess.md#events)
- [rules](IAccess.md#rules)

## Properties

### see

• **see**: ``"none"`` \| ``"summary"`` \| ``"full"``

none: not seen at all; summary: in the lists; full: its page, items and Rationale

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:44](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L44)

___

### data

• **data**: `Object`

which of its data: all, what forms entered, these paths (each a whole branch)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `all` | `boolean` |
| `forms` | `boolean` |
| `paths` | `string`[] |

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:46](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L46)

___

### claim

• **claim**: `boolean`

true: allowed, false: denied, null: as the assignment says (assignee, candidates)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:48](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L48)

___

### complete

• **complete**: `boolean`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:49](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L49)

___

### assign

• **assign**: `boolean`

giving a task to someone else (its assignee, its candidates): null, as today (those with a part in it)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:51](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L51)

___

### restart

• **restart**: `boolean`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:52](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L52)

___

### events

• **events**: `boolean`

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:53](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L53)

___

### rules

• **rules**: [`IPolicyRule`](IPolicyRule.md)[]

the rules that matched

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:55](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L55)
