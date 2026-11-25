[bpmn-server](../readme.md) / IListColumn

# Interface: IListColumn

A column: its key (a named value's name, or a data path), its title, and the path it reads in each model.

## Table of contents

### Properties

- [key](IListColumn.md#key)
- [title](IListColumn.md#title)
- [path](IListColumn.md#path)
- [paths](IListColumn.md#paths)

## Properties

### key

• **key**: `string`

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L18)

___

### title

• **title**: `string`

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L19)

___

### path

• `Optional` **path**: `string`

A data path's: the same path in every model.

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L21)

___

### paths

• `Optional` **paths**: `Map`\<`string`, `string`\>

A named value's: its path in each model that names it.

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L23)
