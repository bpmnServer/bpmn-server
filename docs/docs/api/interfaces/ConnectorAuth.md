[bpmn-server](../readme.md) / ConnectorAuth

# Interface: ConnectorAuth

## Table of contents

### Properties

- [type](ConnectorAuth.md#type)
- [in](ConnectorAuth.md#in)
- [name](ConnectorAuth.md#name)
- [scheme](ConnectorAuth.md#scheme)
- [secret](ConnectorAuth.md#secret)
- [last4](ConnectorAuth.md#last4)
- [setAt](ConnectorAuth.md#setat)
- [setBy](ConnectorAuth.md#setby)

## Properties

### type

• **type**: ``"bearer"`` \| ``"apiKey"`` \| ``"basic"``

how the key is sent

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L32)

___

### in

• `Optional` **in**: ``"header"`` \| ``"query"`` \| ``"cookie"``

apiKey: in a header, the query or a cookie, under this name

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:34](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L34)

___

### name

• `Optional` **name**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L35)

___

### scheme

• `Optional` **scheme**: `string`

the securitySchemes entry it came from, when it did

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L37)

___

### secret

• `Optional` **secret**: `string`

the key, encrypted (never returned)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:39](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L39)

___

### last4

• `Optional` **last4**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:40](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L40)

___

### setAt

• `Optional` **setAt**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:41](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L41)

___

### setBy

• `Optional` **setBy**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:42](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Connectors.ts#L42)
