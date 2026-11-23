[bpmn-server](../readme.md) / IExpressionPlace

# Interface: IExpressionPlace

A place in an instance, where an expression or a decision is evaluated: for the names an add-on gives it.

## Table of contents

### Properties

- [instance](IExpressionPlace.md#instance)
- [items](IExpressionPlace.md#items)
- [definition](IExpressionPlace.md#definition)
- [scope](IExpressionPlace.md#scope)
- [materialized](IExpressionPlace.md#materialized)

## Properties

### instance

• **instance**: `any`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:102](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L102)

___

### items

• `Optional` **items**: `any`[]

the instance's items (a running instance's); `instance.items` when not given

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:104](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L104)

___

### definition

• `Optional` **definition**: `any`

its model: a loaded definition, or its XML

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:106](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L106)

___

### scope

• `Optional` **scope**: `string`

the data path of the branch (a multi-instance's), '' at the top; null: all of them

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:108](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L108)

___

### materialized

• `Optional` **materialized**: `boolean`

plain values (a decision's, the sandbox's), not worked out when read

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:110](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L110)
