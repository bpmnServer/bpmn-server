[bpmn-server](../readme.md) / IContractExpression

# Interface: IContractExpression

## Table of contents

### Properties

- [kind](IContractExpression.md#kind)
- [name](IContractExpression.md#name)
- [type](IContractExpression.md#type)
- [description](IContractExpression.md#description)
- [params](IContractExpression.md#params)
- [returns](IContractExpression.md#returns)
- [async](IContractExpression.md#async)
- [effect](IContractExpression.md#effect)

## Properties

### kind

• **kind**: ``"function"`` \| ``"var"``

var: appVars.<name>, a value with no arguments; function: appServices.<name>(...)

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L18)

___

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L19)

___

### type

• `Optional` **type**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L20)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L21)

___

### params

• `Optional` **params**: [`IContractParam`](IContractParam.md)[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L22)

___

### returns

• `Optional` **returns**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L23)

___

### async

• `Optional` **async**: `boolean`

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L24)

___

### effect

• `Optional` **effect**: ``"none"`` \| ``"read"`` \| ``"write"``

what a function does: none, read, write. A decision may not call a write function.

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L26)
