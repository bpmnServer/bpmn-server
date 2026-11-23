[bpmn-server](../readme.md) / ILabelPart

# Interface: ILabelPart

A part of a label: its text around its value, the value's path, and the name the value is known by.

## Table of contents

### Properties

- [before](ILabelPart.md#before)
- [after](ILabelPart.md#after)
- [path](ILabelPart.md#path)
- [name](ILabelPart.md#name)

## Properties

### before

• **before**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L34)

___

### after

• **after**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L35)

___

### path

• `Optional` **path**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L36)

___

### name

• `Optional` **name**: `string`

the value's name: given (`${Name = path}`, as before 3.7.5), else from the part's text, else from its path

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L38)
