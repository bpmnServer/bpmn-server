[bpmn-server](../readme.md) / IAppModelIssue

# Interface: IAppModelIssue

An issue an application's verifyModel reports (verifyModel's IModelIssue).

## Table of contents

### Properties

- [severity](IAppModelIssue.md#severity)
- [code](IAppModelIssue.md#code)
- [message](IAppModelIssue.md#message)
- [elementId](IAppModelIssue.md#elementid)
- [elementName](IAppModelIssue.md#elementname)

## Properties

### severity

• `Optional` **severity**: ``"info"`` \| ``"error"`` \| ``"warning"``

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:190](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L190)

___

### code

• **code**: `string`

stable identifier of the check, e.g. 'ambiguous-route'

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:192](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L192)

___

### message

• **message**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:193](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L193)

___

### elementId

• `Optional` **elementId**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:194](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L194)

___

### elementName

• `Optional` **elementName**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:195](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/common.ts#L195)
