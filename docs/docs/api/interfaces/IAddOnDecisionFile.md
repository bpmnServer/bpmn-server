[bpmn-server](../readme.md) / IAddOnDecisionFile

# Interface: IAddOnDecisionFile

A decision file a model uses through an add-on (a policy), for the checks of what decisions read and call.

## Table of contents

### Properties

- [what](IAddOnDecisionFile.md#what)
- [file](IAddOnDecisionFile.md#file)
- [actors](IAddOnDecisionFile.md#actors)
- [calls](IAddOnDecisionFile.md#calls)

## Properties

### what

• **what**: `string`

what it is, in words: `assignment policy Approval`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L37)

___

### file

• **file**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L38)

___

### actors

• `Optional` **actors**: `boolean`

whether the actors it reads are checked against the model's (default true)

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L40)

___

### calls

• `Optional` **calls**: `boolean`

whether the functions it calls are checked against the application's contract (default true)

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L42)
