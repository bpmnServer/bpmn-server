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
- [testing](Connector.md#testing)
- [createdAt](Connector.md#createdat)
- [updatedAt](Connector.md#updatedat)

## Properties

### id

• **id**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:52](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L52)

___

### name

• **name**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:53](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L53)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:54](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L54)

___

### openapi

• **openapi**: `Object`

where the document came from and what it is; the document itself in the file (`document(id)` reads it)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `source?` | `string` |
| `version` | `string` |
| `title?` | `string` |
| `fetchedAt` | `string` |
| `bytes` | `number` |
| `document?` | `any` |

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L56)

___

### baseUrl

• **baseUrl**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:57](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L57)

___

### operations

• **operations**: `Record`\<`string`, `boolean`\>

the operations designers may use, by operationId

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L59)

___

### groups

• **groups**: `string`[]

the groups that may design with it; empty: every designer

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:61](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L61)

___

### enabled

• **enabled**: `boolean`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:62](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L62)

___

### timeout

• `Optional` **timeout**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L63)

___

### retries

• `Optional` **retries**: `number`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:64](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L64)

___

### auth

• `Optional` **auth**: [`ConnectorAuth`](ConnectorAuth.md)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:65](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L65)

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

[packages/bpmn-server/src/connectors/Connectors.ts:66](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L66)

___

### testing

• `Optional` **testing**: [`ConnectorTesting`](ConnectorTesting.md)

what it answers outside production (APP_ENV development or test only): ConnectorTesting

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:68](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L68)

___

### createdAt

• **createdAt**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:69](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L69)

___

### updatedAt

• **updatedAt**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:70](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L70)
