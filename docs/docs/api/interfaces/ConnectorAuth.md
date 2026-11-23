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

[packages/bpmn-server/src/connectors/Connectors.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L38)

___

### in

• `Optional` **in**: ``"query"`` \| ``"header"`` \| ``"cookie"``

apiKey: in a header, the query or a cookie, under this name

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L40)

___

### name

• `Optional` **name**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L41)

___

### scheme

• `Optional` **scheme**: `string`

the securitySchemes entry it came from, when it did

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:43](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L43)

___

### secret

• `Optional` **secret**: `string`

the key, encrypted (never returned)

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L45)

___

### last4

• `Optional` **last4**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:46](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L46)

___

### setAt

• `Optional` **setAt**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:47](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L47)

___

### setBy

• `Optional` **setBy**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:48](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L48)
