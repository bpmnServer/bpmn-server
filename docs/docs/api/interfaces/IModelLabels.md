[bpmn-server](../readme.md) / IModelLabels

# Interface: IModelLabels

A model's label templates: the process's, and each element's (by id).

## Table of contents

### Properties

- [process](IModelLabels.md#process)
- [elements](IModelLabels.md#elements)

## Properties

### process

• `Optional` **process**: `string`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:26](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L26)

___

### elements

• **elements**: `Map`\<`string`, \{ `label?`: `string` ; `endLabel?`: `string`  }\>

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L27)
