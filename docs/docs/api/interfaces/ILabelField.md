[bpmn-server](../readme.md) / ILabelField

# Interface: ILabelField

A value a model's case label shows, as the filters and columns offer it: its name, the model, and the data path it
reads. Every `${data.…}` value is one, named by its part's text (`Client: ${data.clientId}` is Client), else its
path's last name (LabelTemplate.ts). A model with no case label shows `<model> #<caseId>`, so it offers caseId.

## Table of contents

### Properties

- [name](ILabelField.md#name)
- [model](ILabelField.md#model)
- [path](ILabelField.md#path)

## Properties

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:243](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L243)

___

### model

• **model**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:244](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L244)

___

### path

• **path**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:245](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L245)
