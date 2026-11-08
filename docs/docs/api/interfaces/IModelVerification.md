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

[packages/bpmn-server/src/elements/verifyModel.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L42)

___

### errors

• **errors**: `number`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:43](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L43)

___

### warnings

• **warnings**: `number`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:44](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L44)

___

### issues

• **issues**: [`IModelIssue`](IModelIssue.md)[]

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:45](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L45)
