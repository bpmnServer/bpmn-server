[bpmn-server](../readme.md) / IFieldRule

# Interface: IFieldRule

A rule a form field's value is held to when a user task is completed (elements/FormRules.ts), an add-on's: a list's
value one of its choices. `value`: the value sent; `data`: the case's data with what was sent. Null: nothing to say.

## Table of contents

### Properties

- [name](IFieldRule.md#name)

### Methods

- [check](IFieldRule.md#check)

## Properties

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:127](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L127)

## Methods

### check

▸ **check**(`server`, `field`, `value`, `at`, `context`): [`IFieldProblem`](IFieldProblem.md) \| `Promise`\<[`IFieldProblem`](IFieldProblem.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `field` | `any` |
| `value` | `any` |
| `at` | `Object` |
| `at.data` | `Record`\<`string`, `any`\> |
| `at.current` | `any` |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

[`IFieldProblem`](IFieldProblem.md) \| `Promise`\<[`IFieldProblem`](IFieldProblem.md)\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:128](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L128)
