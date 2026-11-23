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

[packages/bpmn-server/src/interfaces/common.ts:241](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L241)

___

### code

• **code**: `string`

stable identifier of the check, e.g. 'ambiguous-route'

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:243](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L243)

___

### message

• **message**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:244](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L244)

___

### elementId

• `Optional` **elementId**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:245](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L245)

___

### elementName

• `Optional` **elementName**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/common.ts:246](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/common.ts#L246)
