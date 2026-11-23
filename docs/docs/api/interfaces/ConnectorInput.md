[bpmn-server](../readme.md) / ConnectorInput

# Interface: ConnectorInput

What `add` takes: the document as text (JSON or YAML) or an object, or its URL.

## Table of contents

### Properties

- [id](ConnectorInput.md#id)
- [name](ConnectorInput.md#name)
- [description](ConnectorInput.md#description)
- [source](ConnectorInput.md#source)
- [document](ConnectorInput.md#document)
- [baseUrl](ConnectorInput.md#baseurl)
- [operations](ConnectorInput.md#operations)
- [groups](ConnectorInput.md#groups)
- [enabled](ConnectorInput.md#enabled)
- [timeout](ConnectorInput.md#timeout)
- [retries](ConnectorInput.md#retries)

## Properties

### id

• **id**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:100](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L100)

___

### name

• `Optional` **name**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:101](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L101)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:102](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L102)

___

### source

• `Optional` **source**: `string`

the document's URL (fetched now, and by refresh)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:104](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L104)

___

### document

• `Optional` **document**: `string` \| `object`

the document itself

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:106](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L106)

___

### baseUrl

• `Optional` **baseUrl**: `string`

default: the document's first server

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:108](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L108)

___

### operations

• `Optional` **operations**: `Record`\<`string`, `boolean`\>

default: every operation

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:110](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L110)

___

### groups

• `Optional` **groups**: `string`[]

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:111](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L111)

___

### enabled

• `Optional` **enabled**: `boolean`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:112](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L112)

___

### timeout

• `Optional` **timeout**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:113](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L113)

___

### retries

• `Optional` **retries**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:114](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L114)
