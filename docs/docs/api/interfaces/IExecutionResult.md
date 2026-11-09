[bpmn-server](../readme.md) / IExecutionResult

# Interface: IExecutionResult

What an engine call answers: a JSON copy of where the instance stands, not the running execution.

## Table of contents

### Properties

- [id](IExecutionResult.md#id)
- [name](IExecutionResult.md#name)
- [status](IExecutionResult.md#status)
- [userName](IExecutionResult.md#username)
- [operation](IExecutionResult.md#operation)
- [errors](IExecutionResult.md#errors)
- [action](IExecutionResult.md#action)
- [instance](IExecutionResult.md#instance)
- [execution](IExecutionResult.md#execution)

## Properties

### id

• **id**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:88](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L88)

___

### name

• **name**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:89](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L89)

___

### status

• **status**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:90](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L90)

___

### userName

• `Optional` **userName**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:91](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L91)

___

### operation

• `Optional` **operation**: `string`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:92](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L92)

___

### errors

• `Optional` **errors**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:93](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L93)

___

### action

• `Optional` **action**: `any`

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:94](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L94)

___

### instance

• **instance**: [`IInstanceData`](IInstanceData.md)

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:95](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L95)

___

### execution

• **execution**: `Object`

as a running execution's own `.execution` read: its id, name and status

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `name` | `any` |
| `status` | `any` |

#### Defined in

[packages/bpmn-server/src/interfaces/engine.ts:97](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/engine.ts#L97)
