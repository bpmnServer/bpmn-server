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
- [source](ModelVerifier.md#source)
- [#contract](ModelVerifier.md##contract)
- [#roles](ModelVerifier.md##roles)

### Accessors

- [modelChecks](ModelVerifier.md#modelchecks)
- [addOnCheck](ModelVerifier.md#addoncheck)
- [decisionsFolder](ModelVerifier.md#decisionsfolder)
- [moddleOptions](ModelVerifier.md#moddleoptions)

### Methods

- [verifyAddOnsOff](ModelVerifier.md#verifyaddonsoff)
- [addOnChecks](ModelVerifier.md#addonchecks)
- [addOnDecisionFiles](ModelVerifier.md#addondecisionfiles)
- [checkLabel](ModelVerifier.md#checklabel)
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
- [operationOf](ModelVerifier.md#operationof)
- [verifyExecutables](ModelVerifier.md#verifyexecutables)
- [verifyWholeModel](ModelVerifier.md#verifywholemodel)
- [roles](ModelVerifier.md#roles)
- [contract](ModelVerifier.md#contract)
- [verifyContract](ModelVerifier.md#verifycontract)
- [decisionFilesUsed](ModelVerifier.md#decisionfilesused)
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

[packages/bpmn-server/src/elements/verifyModel.ts:77](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L77)

## Properties

### issues

• **issues**: [`IModelIssue`](../interfaces/IModelIssue.md)[] = `[]`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L72)

___

### processId

• **processId**: `string`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:73](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L73)

___

### services

• **services**: `any` = `null`

the application's services provider, when it can be had without a running execution

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:75](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L75)

___

### server

• `Private` `Optional` **server**: [`IBPMNServer`](../interfaces/IBPMNServer.md)

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:77](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L77)

___

### options

• `Private` **options**: [`IVerifyOptions`](../interfaces/IVerifyOptions.md) = `{}`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:77](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L77)

___

### source

• **source**: `string`

the model's XML, as it was given

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:167](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L167)

___

### #contract

• `Private` **#contract**: [`IAppContract`](../interfaces/IAppContract.md) = `undefined`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:629](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L629)

___

### #roles

• `Private` **#roles**: `string`[] = `undefined`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:681](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L681)

## Accessors

### modelChecks

• `get` **modelChecks**(): [`IModelCheck`](../interfaces/IModelCheck.md)[]

The model checks the add-ons registered: the server's, else those of the add-ons given.

#### Returns

[`IModelCheck`](../interfaces/IModelCheck.md)[]

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:101](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L101)

___

### addOnCheck

• `get` **addOnCheck**(): [`IAddOnModelCheck`](../interfaces/IAddOnModelCheck.md)

What an add-on's checks are given: the folder, the roles, and a way to report (engine/AddOns.ts).

#### Returns

[`IAddOnModelCheck`](../interfaces/IAddOnModelCheck.md)

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:106](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L106)

___

### decisionsFolder

• `get` **decisionsFolder**(): `string`

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:133](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L133)

___

### moddleOptions

• `get` **moddleOptions**(): `any`

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:162](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L162)

## Methods

### verifyAddOnsOff

▸ **verifyAddOnsOff**(`definition`): `void`

A model that uses an add-on that is off: its attributes (the add-on's manifest says which) are kept, and the
engine doesn't read them. One warning for each such add-on, naming where.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:83](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L83)

___

### addOnChecks

▸ **addOnChecks**(`hook`, `...args`): `Promise`\<`void`\>

Each add-on's model check, in turn; one that throws is a warning.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hook` | ``"verifyNode"`` \| ``"verifyProcess"`` |
| `...args` | `any`[] |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:115](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L115)

___

### addOnDecisionFiles

▸ **addOnDecisionFiles**(`definition`): `Promise`\<[`IAddOnDecisionFile`](../interfaces/IAddOnDecisionFile.md)[]\>

The decision files the model uses through its add-ons (its policies).

#### Parameters

| Name | Type |
| :------ | :------ |
| `definition` | `any` |

#### Returns

`Promise`\<[`IAddOnDecisionFile`](../interfaces/IAddOnDecisionFile.md)[]\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:124](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L124)

___

### checkLabel

▸ **checkLabel**(`def`): `void`

Label templates (owf:label, owf:endLabel): data paths, names once (addons/labels/Labels.ts). And OWF's attributes
still under their old camunda: names (elements/owfAttributes.ts).

#### Parameters

| Name | Type |
| :------ | :------ |
| `def` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:142](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L142)

___

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

[packages/bpmn-server/src/elements/verifyModel.ts:147](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L147)

___

### result

▸ **result**(): [`IModelVerification`](../interfaces/IModelVerification.md)

#### Returns

[`IModelVerification`](../interfaces/IModelVerification.md)

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:155](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L155)

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

[packages/bpmn-server/src/elements/verifyModel.ts:169](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L169)

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

[packages/bpmn-server/src/elements/verifyModel.ts:229](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L229)

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

[packages/bpmn-server/src/elements/verifyModel.ts:249](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L249)

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

[packages/bpmn-server/src/elements/verifyModel.ts:274](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L274)

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

[packages/bpmn-server/src/elements/verifyModel.ts:338](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L338)

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

[packages/bpmn-server/src/elements/verifyModel.ts:366](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L366)

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

[packages/bpmn-server/src/elements/verifyModel.ts:373](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L373)

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

[packages/bpmn-server/src/elements/verifyModel.ts:392](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L392)

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

[packages/bpmn-server/src/elements/verifyModel.ts:415](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L415)

___

### operationOf

▸ **operationOf**(`ref`, `def`, `fails`): `Promise`\<`any`\>

A connector's operation a model names, `<connector>/<operationId>` (already checked to be one), with the server's
connectors: the connector and the operation there and enabled. `fails`: what happens when one is disabled.
Undefined, with the error added, when it is not there; and when the server has no connectors.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `string` |
| `def` | `any` |
| `fails` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:455](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L455)

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

[packages/bpmn-server/src/elements/verifyModel.ts:485](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L485)

___

### verifyWholeModel

▸ **verifyWholeModel**(`source`, `definition`): `Promise`\<`void`\>

The whole model, once, by the add-ons' checks (engine/AddOns.ts, verifyModel): with its source, its definition,
and the decision files it uses (its business rule tasks' and the add-ons' whose actors are read), each its text.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |
| `definition` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:581](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L581)

___

### roles

▸ **roles**(): `string`[]

The roles: the models folder's roles.json and the application's contract (app-contract.json), together; null with
neither. A bad roles.json is an error.

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:610](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L610)

___

### contract

▸ **contract**(): [`IAppContract`](../interfaces/IAppContract.md)

The application's contract (its delegate's describe(): app-contract.json), or null.

#### Returns

[`IAppContract`](../interfaces/IAppContract.md)

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:621](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L621)

___

### verifyContract

▸ **verifyContract**(`source`, `definition?`): `Promise`\<`void`\>

The model against the application's contract (docs/design/app-contract.md §5), when it has one: each
appServices.<name> a function it declares, with as many arguments as it takes; each appVars.<name> a variable it
declares; each app:<page> form key one of its pages; and no decision the model uses (its business rule tasks',
its policies) calling a function that changes things (effect write). Warnings, but the last: the contract is
guidance; the model runs as it is.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |
| `definition?` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:638](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L638)

___

### decisionFilesUsed

▸ **decisionFilesUsed**(`text`, `definition?`): `Promise`\<\{ `what`: `string` ; `file`: `string`  }[]\>

The decision files a model uses: its business rule tasks' decisions and its add-ons' (the policies it names).

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |
| `definition?` | `any` |

#### Returns

`Promise`\<\{ `what`: `string` ; `file`: `string`  }[]\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:671](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L671)

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

[packages/bpmn-server/src/elements/verifyModel.ts:687](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L687)

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

[packages/bpmn-server/src/elements/verifyModel.ts:721](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L721)

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

[packages/bpmn-server/src/elements/verifyModel.ts:737](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L737)

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

[packages/bpmn-server/src/elements/verifyModel.ts:750](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L750)

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

[packages/bpmn-server/src/elements/verifyModel.ts:777](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L777)

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

[packages/bpmn-server/src/elements/verifyModel.ts:784](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L784)

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

[packages/bpmn-server/src/elements/verifyModel.ts:793](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L793)

___

### knownModels

▸ **knownModels**(): `Promise`\<`Set`\<`string`\>\>

#### Returns

`Promise`\<`Set`\<`string`\>\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:806](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L806)

___

### servicesProvider

▸ **servicesProvider**(): `Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

#### Returns

`Promise`\<[`IServiceProvider`](../interfaces/IServiceProvider.md)\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:817](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L817)
