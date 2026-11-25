[bpmn-server](../readme.md) / ExecutionDecision

# Interface: ExecutionDecision

Why the engine did something at an element: its item's seq, the element, what it did, and the reasons.

## Table of contents

### Properties

- [seq](ExecutionDecision.md#seq)
- [element](ExecutionDecision.md#element)
- [action](ExecutionDecision.md#action)
- [why](ExecutionDecision.md#why)

## Properties

### seq

• `Optional` **seq**: `number`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:921](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L921)

___

### element

• **element**: `string`

e.g. "flow 'yes' (f1)", "gateway 'Covered?' (Covered)"

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:923](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L923)

___

### action

• **action**: `string`

e.g. "taken", "not taken", "takes 'yes' (f1)", "waits", "continues"

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:925](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L925)

___

### why

• `Optional` **why**: (`string` \| `string`[])[]

The reasons, a line each; a list is written under the line before it, indented.

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:927](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L927)
