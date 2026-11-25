[bpmn-server](../readme.md) / Operation

# Interface: Operation

## Table of contents

### Properties

- [operationId](Operation.md#operationid)
- [method](Operation.md#method)
- [path](Operation.md#path)
- [summary](Operation.md#summary)
- [description](Operation.md#description)
- [parameters](Operation.md#parameters)
- [body](Operation.md#body)
- [responses](Operation.md#responses)
- [security](Operation.md#security)

## Properties

### operationId

• **operationId**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L18)

___

### method

• **method**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L19)

___

### path

• **path**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L20)

___

### summary

• `Optional` **summary**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L21)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L22)

___

### parameters

• **parameters**: [`OperationParameter`](OperationParameter.md)[]

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L23)

___

### body

• `Optional` **body**: `Object`

the JSON request body, when the operation takes one

#### Type declaration

| Name | Type |
| :------ | :------ |
| `required` | `boolean` |
| `schema?` | `any` |
| `contentType` | `string` |

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L25)

___

### responses

• **responses**: `Record`\<`string`, \{ `description?`: `string` ; `schema?`: `any` ; `example?`: `any`  }\>

the responses by status ('200', '404', 'default'): their description, JSON schema, and the document's example

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L27)

___

### security

• `Optional` **security**: `string`[]

the security requirements (names of securitySchemes); none given: the document's

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L29)
