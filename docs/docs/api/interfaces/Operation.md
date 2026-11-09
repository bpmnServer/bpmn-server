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

[packages/bpmn-server/src/connectors/OpenAPI.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L18)

___

### method

• **method**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:19](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L19)

___

### path

• **path**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L20)

___

### summary

• `Optional` **summary**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L21)

___

### description

• `Optional` **description**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L22)

___

### parameters

• **parameters**: [`OperationParameter`](OperationParameter.md)[]

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L23)

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

[packages/bpmn-server/src/connectors/OpenAPI.ts:25](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L25)

___

### responses

• **responses**: `Record`\<`string`, \{ `description?`: `string` ; `schema?`: `any`  }\>

the responses by status ('200', '404', 'default'): their description and JSON schema

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:27](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L27)

___

### security

• `Optional` **security**: `string`[]

the security requirements (names of securitySchemes); none given: the document's

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:29](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L29)
