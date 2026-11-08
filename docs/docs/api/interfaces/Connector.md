[bpmn-server](../readme.md) / Connector

# Interface: Connector

## Table of contents

### Properties

- [id](Connector.md#id)
- [name](Connector.md#name)
- [description](Connector.md#description)
- [openapi](Connector.md#openapi)
- [baseUrl](Connector.md#baseurl)
- [operations](Connector.md#operations)
- [groups](Connector.md#groups)
- [enabled](Connector.md#enabled)
- [timeout](Connector.md#timeout)
- [retries](Connector.md#retries)
- [auth](Connector.md#auth)
- [test](Connector.md#test)
- [createdAt](Connector.md#createdat)
- [updatedAt](Connector.md#updatedat)

## Properties

### id

• **id**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:46](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L46)

___

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:47](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L47)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:48](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L48)

___

### openapi

• **openapi**: `Object`

the document, kept as it was read (packed: see `document(id)` to read it)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `source?` | `string` |
| `version` | `string` |
| `title?` | `string` |
| `fetchedAt` | `string` |
| `packed` | `string` |
| `bytes` | `number` |

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:50](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L50)

___

### baseUrl

• **baseUrl**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:51](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L51)

___

### operations

• **operations**: `Record`\<`string`, `boolean`\>

the operations designers may use, by operationId

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:53](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L53)

___

### groups

• **groups**: `string`[]

the groups that may design with it; empty: every designer

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:55](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L55)

___

### enabled

• **enabled**: `boolean`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:56](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L56)

___

### timeout

• `Optional` **timeout**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:57](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L57)

___

### retries

• `Optional` **retries**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:58](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L58)

___

### auth

• `Optional` **auth**: [`ConnectorAuth`](ConnectorAuth.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:59](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L59)

___

### test

• `Optional` **test**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `at` | `string` |
| `operation` | `string` |
| `ok` | `boolean` |
| `status?` | `number` |
| `message?` | `string` |

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L60)

___

### createdAt

• **createdAt**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L61)

___

### updatedAt

• **updatedAt**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:62](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L62)
