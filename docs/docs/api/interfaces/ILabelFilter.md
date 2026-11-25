[bpmn-server](../readme.md) / ILabelFilter

# Interface: ILabelFilter

A filter of cases by their labels: a model; a value of a label (`field`, or any) that contains, or is, `value`; a search of them all.

## Table of contents

### Properties

- [model](ILabelFilter.md#model)
- [field](ILabelFilter.md#field)
- [op](ILabelFilter.md#op)
- [value](ILabelFilter.md#value)
- [search](ILabelFilter.md#search)

## Properties

### model

• `Optional` **model**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:250](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L250)

___

### field

• `Optional` **field**: `string`

A named value's name, or a data path (`data.amount`).

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:252](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L252)

___

### op

• `Optional` **op**: ``"contains"`` \| ``"is"`` \| ``"gt"`` \| ``"lt"``

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:253](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L253)

___

### value

• `Optional` **value**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:254](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L254)

___

### search

• `Optional` **search**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:255](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L255)
