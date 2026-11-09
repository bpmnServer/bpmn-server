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

[packages/bpmn-server/src/connectors/Connectors.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L67)

___

### name

• `Optional` **name**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:68](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L68)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:69](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L69)

___

### source

• `Optional` **source**: `string`

the document's URL (fetched now, and by refresh)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:71](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L71)

___

### document

• `Optional` **document**: `string` \| `object`

the document itself

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:73](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L73)

___

### baseUrl

• `Optional` **baseUrl**: `string`

default: the document's first server

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:75](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L75)

___

### operations

• `Optional` **operations**: `Record`\<`string`, `boolean`\>

default: every operation

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:77](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L77)

___

### groups

• `Optional` **groups**: `string`[]

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:78](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L78)

___

### enabled

• `Optional` **enabled**: `boolean`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L79)

___

### timeout

• `Optional` **timeout**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:80](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L80)

___

### retries

• `Optional` **retries**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:81](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L81)
