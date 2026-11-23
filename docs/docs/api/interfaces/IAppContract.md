[bpmn-server](../readme.md) / IAppContract

# Interface: IAppContract

## Table of contents

### Properties

- [name](IAppContract.md#name)
- [description](IAppContract.md#description)
- [expressions](IAppContract.md#expressions)
- [types](IAppContract.md#types)
- [roles](IAppContract.md#roles)
- [apis](IAppContract.md#apis)
- [pages](IAppContract.md#pages)

## Properties

### name

• `Optional` **name**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L29)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:30](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L30)

___

### expressions

• `Optional` **expressions**: [`IContractExpression`](IContractExpression.md)[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L31)

___

### types

• `Optional` **types**: `Record`\<`string`, `any`\>

JSON Schemas, by name, that the expressions' types name

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L33)

___

### roles

• `Optional` **roles**: \{ `name`: `string` ; `title?`: `string` ; `description?`: `string`  }[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L34)

___

### apis

• `Optional` **apis**: \{ `id`: `string` ; `openapi`: `string`  }[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L35)

___

### pages

• `Optional` **pages**: \{ `id`: `string` ; `url`: `string` ; `title?`: `string`  }[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:36](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L36)
