[bpmn-server](../readme.md) / ConnectorTesting

# Interface: ConnectorTesting

What a connector answers outside production (docs/docs/connectors.md#outside-production): only where APP_ENV is
development or test; production, or a server that does not say, always calls the real API.
- `real` (the default): the real API, as in production;
- `examples`: no call: each operation answers its document's example (else one made from its schema);
- `sandbox`: the same calls, to `baseUrl` (a sandbox of the API), with the same key.
`answers`, by operationId: an operation's own answer, in place of the example (`examples`): the answer itself, or
`{ cases: [{ when, status, output }] }`: the first case whose `when` its input matches (each value, as text; a
case without `when` matches any); a status other than 2xx fails as the API's would (HTTP_<status>).
`environments`: where it applies, development and test (the default), or one of them.

## Table of contents

### Properties

- [answer](ConnectorTesting.md#answer)
- [baseUrl](ConnectorTesting.md#baseurl)
- [answers](ConnectorTesting.md#answers)
- [environments](ConnectorTesting.md#environments)

## Properties

### answer

• **answer**: ``"real"`` \| ``"examples"`` \| ``"sandbox"``

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:85](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L85)

___

### baseUrl

• `Optional` **baseUrl**: `string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L86)

___

### answers

• `Optional` **answers**: `Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:87](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L87)

___

### environments

• `Optional` **environments**: (``"test"`` \| ``"development"``)[]

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:88](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L88)
