[bpmn-server](../readme.md) / ModelVerifier

# Class: ModelVerifier

## Table of contents

### Constructors

- [constructor](ModelVerifier.md#constructor)

### Properties

- [issues](ModelVerifier.md#issues)
- [processId](ModelVerifier.md#processid)
- [services](ModelVerifier.md#services)
- [server](ModelVerifier.md#server)
- [options](ModelVerifier.md#options)

### Accessors

- [decisionsFolder](ModelVerifier.md#decisionsfolder)
- [moddleOptions](ModelVerifier.md#moddleoptions)

### Methods

- [add](ModelVerifier.md#add)
- [result](ModelVerifier.md#result)
- [verify](ModelVerifier.md#verify)
- [verifyApplication](ModelVerifier.md#verifyapplication)
- [verifyDataObjects](ModelVerifier.md#verifydataobjects)
- [verifyContainer](ModelVerifier.md#verifycontainer)
- [verifyGateway](ModelVerifier.md#verifygateway)
- [verifyEventDefinitions](ModelVerifier.md#verifyeventdefinitions)
- [verifyDiagram](ModelVerifier.md#verifydiagram)
- [loadDefinition](ModelVerifier.md#loaddefinition)
- [checkConnector](ModelVerifier.md#checkconnector)
- [verifyExecutables](ModelVerifier.md#verifyexecutables)
- [checkDecision](ModelVerifier.md#checkdecision)
- [checkScript](ModelVerifier.md#checkscript)
- [checkServiceReferences](ModelVerifier.md#checkservicereferences)
- [checkExpression](ModelVerifier.md#checkexpression)
- [checkTemplate](ModelVerifier.md#checktemplate)
- [checkValue](ModelVerifier.md#checkvalue)
- [checkTimer](ModelVerifier.md#checktimer)
- [knownModels](ModelVerifier.md#knownmodels)
- [servicesProvider](ModelVerifier.md#servicesprovider)

## Constructors

### constructor

• **new ModelVerifier**(`server?`, `options?`): [`ModelVerifier`](ModelVerifier.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `server?` | [`IBPMNServer`](../interfaces/IBPMNServer.md) |
| `options` | [`IVerifyOptions`](../interfaces/IVerifyOptions.md) |

#### Returns

[`ModelVerifier`](ModelVerifier.md)

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L65)

## Properties

### issues

• **issues**: [`IModelIssue`](../interfaces/IModelIssue.md)[] = `[]`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:60](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L60)

___

### processId

• **processId**: `string`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:61](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L61)

___

### services

• **services**: `any` = `null`

the application's services provider, when it can be had without a running execution

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:63](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L63)

___

### server

• `Private` `Optional` **server**: [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L65)

___

### options

• `Private` **options**: [`IVerifyOptions`](../interfaces/IVerifyOptions.md) = `{}`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:65](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L65)

## Accessors

### decisionsFolder

• `get` **decisionsFolder**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:67](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L67)

___

### moddleOptions

• `get` **moddleOptions**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:87](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L87)

## Methods

### add

▸ **add**(`severity`, `code`, `message`, `element?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `severity` | [`ModelIssueSeverity`](../readme.md#modelissueseverity) |
| `code` | `string` |
| `message` | `string` |
| `element?` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:72](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L72)

___

### result

▸ **result**(): [`IModelVerification`](../interfaces/IModelVerification.md)

#### Returns

[`IModelVerification`](../interfaces/IModelVerification.md)

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:80](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L80)

___

### verify

▸ **verify**(`source`, `name`): `Promise`\<[`IModelVerification`](../interfaces/IModelVerification.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |
| `name` | `string` |

#### Returns

`Promise`\<[`IModelVerification`](../interfaces/IModelVerification.md)\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:91](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L91)

___

### verifyApplication

▸ **verifyApplication**(`name`, `source`, `definition`): `Promise`\<`void`\>

5. the application's own checks (appDelegate.verifyModel), reported with these. A check that throws is
reported as a warning: it never stops the model being verified.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `source` | `string` |
| `definition` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:147](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L147)

___

### verifyDataObjects

▸ **verifyDataObjects**(`processes`): `void`

Data objects are loaded by the application (appDelegate.loadDataObject) when an element connected to them
runs: one connected to nothing is never loaded, and an application without loadDataObject loads none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `processes` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:167](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L167)

___

### verifyContainer

▸ **verifyContainer**(`container`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `container` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:192](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L192)

___

### verifyGateway

▸ **verifyGateway**(`gateway`, `incoming`, `outgoing`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `gateway` | `any` |
| `incoming` | `any` |
| `outgoing` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:256](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L256)

___

### verifyEventDefinitions

▸ **verifyEventDefinitions**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:284](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L284)

___

### verifyDiagram

▸ **verifyDiagram**(`root`, `processes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `root` | `any` |
| `processes` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:291](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L291)

___

### loadDefinition

▸ **loadDefinition**(`name`, `source`): `Promise`\<[`Definition`](Definition.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `source` | `string` |

#### Returns

`Promise`\<[`Definition`](Definition.md)\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:310](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L310)

___

### checkConnector

▸ **checkConnector**(`node`, `connector`, `def`): `Promise`\<`void`\>

A task that calls a connector (docs/docs/connectors.md): it names `<connector>/<operationId>`, and no service; with a
server, the connector and the operation are there and enabled, the operation's required inputs are given, and
every input is one of the operation's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`ServiceTask`](ServiceTask.md) |
| `connector` | `any` |
| `def` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:333](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L333)

___

### verifyExecutables

▸ **verifyExecutables**(`definition`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | [`Definition`](Definition.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:390](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L390)

___

### checkDecision

▸ **checkDecision**(`node`, `def`): `Promise`\<`void`\>

A business rule task's decision: named, found in the decisions folder, readable and valid, and its result
saved (a result variable or output parameters).

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`BusinessRuleTask`](BusinessRuleTask.md) |
| `def` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:477](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L477)

___

### checkScript

▸ **checkScript**(`script`, `what`, `element`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `script` | `string` |
| `what` | `string` |
| `element` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:511](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L511)

___

### checkServiceReferences

▸ **checkServiceReferences**(`code`, `what`, `element`): `void`

`appServices.name` in a script or expression must be something the application's services provide:
calling one that is not there fails when the process runs; reading one gives undefined, which fails
as soon as it is used (Object.keys(appServices.rules)).

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `string` |
| `what` | `string` |
| `element` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:527](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L527)

___

### checkExpression

▸ **checkExpression**(`expression`, `what`, `element`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | `string` |
| `what` | `string` |
| `element` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:540](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L540)

___

### checkTemplate

▸ **checkTemplate**(`text`, `what`, `element`): `void`

A text with ${...} parts: each part is an expression.

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `what` | `string` |
| `element` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:567](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L567)

___

### checkValue

▸ **checkValue**(`value`, `what`, `element`): `void`

A value evaluated only when it is an expression ($js, ${js}) or has ${...} parts; any other text is as written.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `what` | `string` |
| `element` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:574](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L574)

___

### checkTimer

▸ **checkTimer**(`timer`, `element`, `checkScripts`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `timer` | `any` |
| `element` | `any` |
| `checkScripts` | `boolean` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:583](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L583)

___

### knownModels

▸ **knownModels**(): `Promise`\<`Set`\<`string`\>\>

#### Returns

`Promise`\<`Set`\<`string`\>\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:596](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L596)

___

### servicesProvider

▸ **servicesProvider**(): `Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

#### Returns

`Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:607](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L607)
