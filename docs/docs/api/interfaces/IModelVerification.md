[bpmn-server](../readme.md) / IModelVerification

# Interface: IModelVerification

## Table of contents

### Properties

- [valid](IModelVerification.md#valid)
- [errors](IModelVerification.md#errors)
- [warnings](IModelVerification.md#warnings)
- [issues](IModelVerification.md#issues)

## Properties

### valid

• **valid**: `boolean`

true when there are no errors; warnings do not make a model invalid

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:54](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L54)

___

### errors

• **errors**: `number`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:55](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L55)

___

### warnings

• **warnings**: `number`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L56)

___

### issues

• **issues**: [`IModelIssue`](IModelIssue.md)[]

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L57)
