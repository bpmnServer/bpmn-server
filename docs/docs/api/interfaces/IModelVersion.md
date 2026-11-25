[bpmn-server](../readme.md) / IModelVersion

# Interface: IModelVersion

A saved version of a model.

## Table of contents

### Properties

- [version](IModelVersion.md#version)
- [savedAt](IModelVersion.md#savedat)
- [savedBy](IModelVersion.md#savedby)
- [size](IModelVersion.md#size)

## Properties

### version

• **version**: `number`

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:6](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/ModelHistory.ts#L6)

___

### savedAt

• **savedAt**: `string`

when it was saved (ISO): its file's time

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:8](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/ModelHistory.ts#L8)

___

### savedBy

• `Optional` **savedBy**: `string`

who saved it, when known

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:10](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/ModelHistory.ts#L10)

___

### size

• **size**: `number`

its size in bytes: its file's

#### Defined in

[packages/bpmn-server/src/datastore/ModelHistory.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/ModelHistory.ts#L12)
