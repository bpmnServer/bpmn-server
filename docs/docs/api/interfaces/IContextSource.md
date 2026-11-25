[bpmn-server](../readme.md) / IContextSource

# Interface: IContextSource

Where a context was made.

## Table of contents

### Properties

- [kind](IContextSource.md#kind)
- [elementId](IContextSource.md#elementid)
- [what](IContextSource.md#what)
- [decision](IContextSource.md#decision)
- [policy](IContextSource.md#policy)
- [query](IContextSource.md#query)
- [action](IContextSource.md#action)
- [field](IContextSource.md#field)

## Properties

### kind

• **kind**: [`ContextKind`](../readme.md#contextkind)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L22)

___

### elementId

• `Optional` **elementId**: `string`

the element (item, element, form)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L24)

___

### what

• `Optional` **what**: `string`

what of it: a script's event, an attribute, a service's name, an event's name, a flow, a field

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L26)

___

### decision

• `Optional` **decision**: `string`

a decision's name, and which policy (assignment, security, notification) when it is one

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L28)

___

### policy

• `Optional` **policy**: `string`

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L29)

___

### query

• `Optional` **query**: `string`

a query's kind, a pre-action's action

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L31)

___

### action

• `Optional` **action**: `string`

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L32)

___

### field

• `Optional` **field**: `string`

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L33)
