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

[packages/bpmn-server/src/engine/Execution.ts:848](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L848)

___

### element

• **element**: `string`

e.g. "flow 'yes' (f1)", "gateway 'Covered?' (Covered)"

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:850](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L850)

___

### action

• **action**: `string`

e.g. "taken", "not taken", "takes 'yes' (f1)", "waits", "continues"

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:852](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L852)

___

### why

• `Optional` **why**: (`string` \| `string`[])[]

The reasons, a line each; a list is written under the line before it, indented.

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:854](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L854)
