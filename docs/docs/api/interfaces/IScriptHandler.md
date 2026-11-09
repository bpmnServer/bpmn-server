[bpmn-server](../readme.md) / IScriptHandler

# Interface: IScriptHandler

## Implemented by

- [`ScriptHandler`](../classes/ScriptHandler.md)

## Table of contents

### Properties

- [context](IScriptHandler.md#context)

### Methods

- [evaluateExpression](IScriptHandler.md#evaluateexpression)
- [evaluateCondition](IScriptHandler.md#evaluatecondition)
- [executeScript](IScriptHandler.md#executescript)

## Properties

### context

• `Optional` **context**: `Record`\<`string`, (`scope`: \{ `data`: `any`  }) => `any`\>

variables scripts see besides their own

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L17)

## Methods

### evaluateExpression

▸ **evaluateExpression**(`scope`, `expression`, `label?`): `any`

label: what the expression is (a condition, an assignment): its name for debuggers and errors

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | [`IToken`](IToken.md) \| [`IItem`](IItem.md) |
| `expression` | `any` |
| `label?` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L13)

___

### evaluateCondition

▸ **evaluateCondition**(`scope`, `expression`, `language?`, `label?`): `any`

a sequence flow's condition, in its language attribute's language (FEEL, else JavaScript); without it, evaluateExpression

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | [`IToken`](IToken.md) \| [`IItem`](IItem.md) |
| `expression` | `any` |
| `language?` | `string` |
| `label?` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L15)

___

### executeScript

▸ **executeScript**(`scope`, `script`, `label?`): `any`

label: which script it is (an event's, a script task's): its name for debuggers and errors

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | [`IExecution`](IExecution.md) \| [`IItem`](IItem.md) |
| `script` | `any` |
| `label?` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L19)
