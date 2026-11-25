[bpmn-server](../readme.md) / IItemAssignment

# Interface: IItemAssignment

What decided a task's assignment, kept on the item: its policy and rule, or the person who reassigned it.

## Table of contents

### Properties

- [policy](IItemAssignment.md#policy)
- [rule](IItemAssignment.md#rule)
- [userName](IItemAssignment.md#username)

## Properties

### policy

• `Optional` **policy**: `string`

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L27)

___

### rule

• `Optional` **rule**: `number`

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L28)

___

### userName

• `Optional` **userName**: `string`

who reassigned it by hand (Execution.assign), replacing what its policy decided

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L30)
