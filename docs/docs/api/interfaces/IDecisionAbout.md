[bpmn-server](../readme.md) / IDecisionAbout

# Interface: IDecisionAbout

What a decision is about, as the application's hook is told.

## Table of contents

### Properties

- [kind](IDecisionAbout.md#kind)
- [name](IDecisionAbout.md#name)
- [user](IDecisionAbout.md#user)
- [instance](IDecisionAbout.md#instance)
- [task](IDecisionAbout.md#task)

## Properties

### kind

• **kind**: [`DecisionKind`](../readme.md#decisionkind)

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L36)

___

### name

• `Optional` **name**: `string`

the decision's or the policy's name

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L38)

___

### user

• **user**: [`IDecisionUser`](IDecisionUser.md)

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:39](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L39)

___

### instance

• `Optional` **instance**: `any`

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L40)

___

### task

• `Optional` **task**: `string`

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L41)
