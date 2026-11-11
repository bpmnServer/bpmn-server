bpmn-server

# bpmn-server

## Table of contents

### Enumerations

- [USER\_ROLE](enums/USER_ROLE.md)
- [TOKEN\_TYPE](enums/TOKEN_TYPE.md)
- [BPMN\_TYPE](enums/BPMN_TYPE.md)
- [NODE\_SUBTYPE](enums/NODE_SUBTYPE.md)
- [EXECUTION\_EVENT](enums/EXECUTION_EVENT.md)
- [NODE\_ACTION](enums/NODE_ACTION.md)
- [ITEM\_STATUS](enums/ITEM_STATUS.md)
- [EXECUTION\_STATUS](enums/EXECUTION_STATUS.md)
- [TOKEN\_STATUS](enums/TOKEN_STATUS.md)
- [FLOW\_ACTION](enums/FLOW_ACTION.md)

### Classes

- [BPMNAPI](classes/BPMNAPI.md)
- [BPMNAdminAPI](classes/BPMNAdminAPI.md)
- [APIEngine](classes/APIEngine.md)
- [APIData](classes/APIData.md)
- [APIModelReader](classes/APIModelReader.md)
- [APIModel](classes/APIModel.md)
- [SecureUser](classes/SecureUser.md)
- [Configuration](classes/Configuration.md)
- [Logger](classes/Logger.md)
- [ConnectorError](classes/ConnectorError.md)
- [Connectors](classes/Connectors.md)
- [DataStore](classes/DataStore.md)
- [DocumentPager](classes/DocumentPager.md)
- [DocumentQuery](classes/DocumentQuery.md)
- [InstanceLocker](classes/InstanceLocker.md)
- [MemoryDocumentStore](classes/MemoryDocumentStore.md)
- [ModelHistory](classes/ModelHistory.md)
- [BpmnModelData](classes/BpmnModelData.md)
- [ProcessData](classes/ProcessData.md)
- [EventData](classes/EventData.md)
- [ModelsDatastore](classes/ModelsDatastore.md)
- [ModelsDatastoreDB](classes/ModelsDatastoreDB.md)
- [MongoDB](classes/MongoDB.md)
- [QueryTranslator](classes/QueryTranslator.md)
- [SqliteDocumentStore](classes/SqliteDocumentStore.md)
- [DMNEngine](classes/DMNEngine.md)
- [DMNParser](classes/DMNParser.md)
- [Definition](classes/Definition.md)
- [Element](classes/Element.md)
- [Event](classes/Event.md)
- [CatchEvent](classes/CatchEvent.md)
- [BoundaryEvent](classes/BoundaryEvent.md)
- [ThrowEvent](classes/ThrowEvent.md)
- [EndEvent](classes/EndEvent.md)
- [StartEvent](classes/StartEvent.md)
- [Flow](classes/Flow.md)
- [MessageFlow](classes/MessageFlow.md)
- [Gateway](classes/Gateway.md)
- [XORGateway](classes/XORGateway.md)
- [EventBasedGateway](classes/EventBasedGateway.md)
- [Node](classes/Node.md)
- [NodeLoader](classes/NodeLoader.md)
- [Process](classes/Process.md)
- [ScriptTask](classes/ScriptTask.md)
- [ServiceTask](classes/ServiceTask.md)
- [BusinessRuleTask](classes/BusinessRuleTask.md)
- [SendTask](classes/SendTask.md)
- [UserTask](classes/UserTask.md)
- [ReceiveTask](classes/ReceiveTask.md)
- [SubProcess](classes/SubProcess.md)
- [AdHocSubProcess](classes/AdHocSubProcess.md)
- [CallActivity](classes/CallActivity.md)
- [Transaction](classes/Transaction.md)
- [Behaviour](classes/Behaviour.md)
- [BehaviourLoader](classes/BehaviourLoader.md)
- [CamundaFormData](classes/CamundaFormData.md)
- [IOBehaviour](classes/IOBehaviour.md)
- [LoopBehaviour](classes/LoopBehaviour.md)
- [MessageEventBehaviour](classes/MessageEventBehaviour.md)
- [SignalEventBehaviour](classes/SignalEventBehaviour.md)
- [ScriptBehaviour](classes/ScriptBehaviour.md)
- [TerminateBehaviour](classes/TerminateBehaviour.md)
- [TimerBehaviour](classes/TimerBehaviour.md)
- [ModelVerifier](classes/ModelVerifier.md)
- [DataHandler](classes/DataHandler.md)
- [DefaultAppDelegate](classes/DefaultAppDelegate.md)
- [Execution](classes/Execution.md)
- [Item](classes/Item.md)
- [Loop](classes/Loop.md)
- [InstanceObject](classes/InstanceObject.md)
- [ItemObject](classes/ItemObject.md)
- [TokenObject](classes/TokenObject.md)
- [LoopObject](classes/LoopObject.md)
- [Query](classes/Query.md)
- [SandboxScriptHandler](classes/SandboxScriptHandler.md)
- [ScriptHandler](classes/ScriptHandler.md)
- [TestStubs](classes/TestStubs.md)
- [Token](classes/Token.md)
- [DuplicateKeyError](classes/DuplicateKeyError.md)
- [BPMNServer](classes/BPMNServer.md)
- [NoCacheManager](classes/NoCacheManager.md)
- [CacheManager](classes/CacheManager.md)
- [Cron](classes/Cron.md)
- [ReentrantCallError](classes/ReentrantCallError.md)
- [ItemNotWaitingError](classes/ItemNotWaitingError.md)
- [Engine](classes/Engine.md)
- [EngineNotRunningError](classes/EngineNotRunningError.md)
- [LaunchedEngine](classes/LaunchedEngine.md)
- [LaunchedServer](classes/LaunchedServer.md)
- [Listener](classes/Listener.md)
- [ServerComponent](classes/ServerComponent.md)

### Interfaces

- [IEngineOptions](interfaces/IEngineOptions.md)
- [IAPIEngine](interfaces/IAPIEngine.md)
- [IAPIData](interfaces/IAPIData.md)
- [IAPIModel](interfaces/IAPIModel.md)
- [ConnectorAuth](interfaces/ConnectorAuth.md)
- [Connector](interfaces/Connector.md)
- [ConnectorInput](interfaces/ConnectorInput.md)
- [CallResult](interfaces/CallResult.md)
- [OperationParameter](interfaces/OperationParameter.md)
- [Operation](interfaces/Operation.md)
- [IModelVersion](interfaces/IModelVersion.md)
- [SqliteOptions](interfaces/SqliteOptions.md)
- [IBehaviour](interfaces/IBehaviour.md)
- [IModelIssue](interfaces/IModelIssue.md)
- [IVerifyOptions](interfaces/IVerifyOptions.md)
- [IModelVerification](interfaces/IModelVerification.md)
- [ExecutionDecision](interfaces/ExecutionDecision.md)
- [StubSet](interfaces/StubSet.md)
- [IItemData](interfaces/IItemData.md)
- [IInstanceData](interfaces/IInstanceData.md)
- [IInstanceFlags](interfaces/IInstanceFlags.md)
- [IDefinitionData](interfaces/IDefinitionData.md)
- [IElementData](interfaces/IElementData.md)
- [IFlowData](interfaces/IFlowData.md)
- [IEventData](interfaces/IEventData.md)
- [IBpmnModelData](interfaces/IBpmnModelData.md)
- [IProcessData](interfaces/IProcessData.md)
- [IUserInfo](interfaces/IUserInfo.md)
- [ISecureUser](interfaces/ISecureUser.md)
- [IConfiguration](interfaces/IConfiguration.md)
- [IConnectorsConfiguration](interfaces/IConnectorsConfiguration.md)
- [ILogger](interfaces/ILogger.md)
- [IServiceProvider](interfaces/IServiceProvider.md)
- [IAppDelegate](interfaces/IAppDelegate.md)
- [IAppModelIssue](interfaces/IAppModelIssue.md)
- [FindParams](interfaces/FindParams.md)
- [FindResult](interfaces/FindResult.md)
- [IDataStore](interfaces/IDataStore.md)
- [IModelsDatastore](interfaces/IModelsDatastore.md)
- [IDefinition](interfaces/IDefinition.md)
- [IElement](interfaces/IElement.md)
- [IFlow](interfaces/IFlow.md)
- [INode](interfaces/INode.md)
- [IScriptHandler](interfaces/IScriptHandler.md)
- [IToken](interfaces/IToken.md)
- [IExecutionResult](interfaces/IExecutionResult.md)
- [IExecution](interfaces/IExecution.md)
- [IItem](interfaces/IItem.md)
- [ILifecycleListener](interfaces/ILifecycleListener.md)
- [IBPMNServer](interfaces/IBPMNServer.md)
- [IServerComponent](interfaces/IServerComponent.md)
- [IEngine](interfaces/IEngine.md)
- [IUpgradeInstanceReport](interfaces/IUpgradeInstanceReport.md)
- [IUpgradeReport](interfaces/IUpgradeReport.md)
- [ICron](interfaces/ICron.md)
- [ICacheManager](interfaces/ICacheManager.md)
- [IDocumentStore](interfaces/IDocumentStore.md)
- [ILockManager](interfaces/ILockManager.md)

### Type Aliases

- [InstanceLockerOptions](readme.md#instancelockeroptions)
- [DMNOptions](readme.md#dmnoptions)
- [FoundDecision](readme.md#founddecision)
- [InputClause](readme.md#inputclause)
- [OutputClause](readme.md#outputclause)
- [Rule](readme.md#rule)
- [DecisionTable](readme.md#decisiontable)
- [Decision](readme.md#decision)
- [DMNDefinitions](readme.md#dmndefinitions)
- [DMNIssue](readme.md#dmnissue)
- [ModelIssueSeverity](readme.md#modelissueseverity)
- [ScriptContext](readme.md#scriptcontext)
- [LifecycleNotification](readme.md#lifecyclenotification)
- [IUpgradeOutcome](readme.md#iupgradeoutcome)
- [StorageQuery](readme.md#storagequery)
- [StorageProjection](readme.md#storageprojection)
- [StorageSort](readme.md#storagesort)

### Variables

- [SystemUser](readme.md#systemuser)
- [defaultConfiguration](readme.md#defaultconfiguration)
- [HTTP\_METHODS](readme.md#http_methods)
- [HIT\_POLICIES](readme.md#hit_policies)
- [Behaviour\_names](readme.md#behaviour_names)

### Functions

- [dateDiff](readme.md#datediff)
- [parseDocument](readme.md#parsedocument)
- [refResolver](readme.md#refresolver)
- [resolveRefs](readme.md#resolverefs)
- [listOperations](readme.md#listoperations)
- [canEncrypt](readme.md#canencrypt)
- [databaseName](readme.md#databasename)
- [feelParses](readme.md#feelparses)
- [legacyTest](readme.md#legacytest)
- [label](readme.md#label)
- [valuesRead](readme.md#valuesread)
- [verifyModel](readme.md#verifymodel)
- [formatDecision](readme.md#formatdecision)
- [runSandboxed](readme.md#runsandboxed)
- [executionResult](readme.md#executionresult)
- [engineCalls](readme.md#enginecalls)
- [startEngineService](readme.md#startengineservice)

## Type Aliases

### InstanceLockerOptions

Ƭ **InstanceLockerOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `database` | `string` | The logical database (MongoDB's db name). |
| `collection?` | `string` | - |
| `owner?` | `string` | This process's identity as an owner; default `SERVER_ID`, else host, process id and a random suffix. |
| `retryDelay?` | `number` | Milliseconds between tries. |
| `maxTries?` | `number` | Tries before `lock` gives up. |
| `staleAfter?` | `number` | Milliseconds after which a lock or claim is stale: its owner is presumed gone and another may take it. |
| `logger?` | \{ `log`: (...`m`: `any`[]) => `any` ; `warn?`: (...`m`: `any`[]) => `any`  } | - |
| `logger.log` | [object Object] | - |
| `logger.warn?` | [object Object] | - |

#### Defined in

[packages/bpmn-server/src/datastore/InstanceLocker.ts:8](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/InstanceLocker.ts#L8)

___

### DMNOptions

Ƭ **DMNOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `debug?` | `boolean` |
| `log?` | (`message`: `string`) => `void` |

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L18)

___

### FoundDecision

Ƭ **FoundDecision**: `Object`

Where a decision was found.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `definitions` | [`DMNDefinitions`](readme.md#dmndefinitions) |
| `decision` | [`Decision`](readme.md#decision) |

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:21](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNEngine.ts#L21)

___

### InputClause

Ƭ **InputClause**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `label` | `string` |
| `expression` | `string` |
| `typeRef` | `string` |
| `values?` | `string` |

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L12)

___

### OutputClause

Ƭ **OutputClause**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name` | `string` |
| `label` | `string` |
| `typeRef` | `string` |
| `values?` | `string` |

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L13)

___

### Rule

Ƭ **Rule**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `description` | `string` |
| `inputEntries` | `string`[] |
| `outputEntries` | `string`[] |

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L14)

___

### DecisionTable

Ƭ **DecisionTable**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `hitPolicy` | `string` |
| `aggregation?` | `string` |
| `inputs` | [`InputClause`](readme.md#inputclause)[] |
| `outputs` | [`OutputClause`](readme.md#outputclause)[] |
| `rules` | [`Rule`](readme.md#rule)[] |

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:16](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L16)

___

### Decision

Ƭ **Decision**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name` | `string` |
| `requires` | `string`[] |
| `table?` | [`DecisionTable`](readme.md#decisiontable) |
| `literal?` | \{ `text`: `string` ; `variable`: `string` ; `typeRef`: `string`  } |
| `literal.text` | `string` |
| `literal.variable` | `string` |
| `literal.typeRef` | `string` |

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:24](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L24)

___

### DMNDefinitions

Ƭ **DMNDefinitions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name` | `string` |
| `decisions` | [`Decision`](readme.md#decision)[] |

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:32](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L32)

___

### DMNIssue

Ƭ **DMNIssue**: `Object`

A problem found in a DMN file: where it is and what is wrong.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `decisionId?` | `string` |
| `ruleId?` | `string` |
| `ruleIndex?` | `number` |
| `message` | `string` |

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:35](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L35)

___

### ModelIssueSeverity

Ƭ **ModelIssueSeverity**: ``"error"`` \| ``"warning"`` \| ``"info"``

Static verification of a BPMN model: reports what would stop the engine from loading or
running it (errors) and what is likely a modelling mistake (warnings), without starting it.

```ts
 const result = await verifyModel(xml, server);
 if (!result.valid) result.issues.filter(i => i.severity == 'error').forEach(i => console.log(i.message));
```

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:23](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L23)

___

### ScriptContext

Ƭ **ScriptContext**: `Record`\<`string`, (`scope`: \{ `data`: `any`  }) => `any`\>

A variable scripts see besides their own: its value, from a copy of the data (so it can not change the process's).

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/ScriptHandler.ts#L15)

___

### LifecycleNotification

Ƭ **LifecycleNotification**: `Object`

Internal engine lifecycle notifications: what happened to an execution (`process.start`,
`wait`, `end`, …: the [EXECUTION_EVENT](enums/EXECUTION_EVENT.md) names), distinct from BPMN events (messages,
signals, timers, which the engine correlates itself) and from an application's business events.

Delivery: in order, awaited, after the engine's own listeners and the application delegate.
A subscriber's failure is reported to the server's logger and does not abort the execution or
reach the other subscribers: a subscriber that must not miss a notification records it durably
itself (an outbox) and treats a repeat as a duplicate (`item.id` with the event identifies it).

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `string` | The event's name (an EXECUTION_EVENT value). |
| `context` | `any` | The execution it happened to. |
| `details?` | `unknown` | - |

#### Defined in

[packages/bpmn-server/src/interfaces/lifecycle.ts:11](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/lifecycle.ts#L11)

___

### IUpgradeOutcome

Ƭ **IUpgradeOutcome**: ``"upgraded"`` \| ``"would-upgrade"`` \| ``"current"`` \| ``"ended"`` \| ``"stranded"`` \| ``"busy"`` \| ``"failed"``

What upgradeRunning did with an instance.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:146](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/server.ts#L146)

___

### StorageQuery

Ƭ **StorageQuery**: `Record`\<`string`, `any`\>

The storage ports: what the engine's persistence components (the instance DataStore, the models
datastore and the instance locker) need from a database, so that MongoDB is one adapter among
others (an in-memory store; an application's PostgreSQL) and no engine code changes with it.

Documents are plain JSON objects. Queries, updates, projections and sorts use the subset of
MongoDB's query language the engine issues (equality, dotted paths into arrays, `$elemMatch`,
`$or`, `$nor`, `$and`, `$exists`, `$eq`, `$ne`, `$in`, `$nin`, `$lt`, `$lte`, `$gt`, `$gte`;
`$set` and whole-document updates, with `upsert`); an adapter that cannot evaluate a query
refuses it, never ignores part of it.

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:12](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L12)

___

### StorageProjection

Ƭ **StorageProjection**: `Record`\<`string`, ``0`` \| ``1`` \| `any`\> \| ``null``

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:13](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L13)

___

### StorageSort

Ƭ **StorageSort**: `Record`\<`string`, ``1`` \| ``-1``\> \| ``null``

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/interfaces/storage.ts#L14)

## Variables

### SystemUser

• `Const` **SystemUser**: [`SecureUser`](classes/SecureUser.md)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:239](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/API/SecureUser.ts#L239)

___

### defaultConfiguration

• `Const` **defaultConfiguration**: [`Configuration`](classes/Configuration.md)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:98](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/DefaultConfiguration.ts#L98)

___

### HTTP\_METHODS

• `Const` **HTTP\_METHODS**: `string`[]

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:7](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L7)

___

### HIT\_POLICIES

• `Const` **HIT\_POLICIES**: `string`[]

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L37)

___

### Behaviour\_names

• `Const` **Behaviour\_names**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `TimerEventDefinition` | `string` |
| `LoopCharacteristics` | `string` |
| `IOSpecification` | `string` |
| `TerminateEventDefinition` | `string` |
| `MessageEventDefinition` | `string` |
| `SignalEventDefinition` | `string` |
| `ErrorEventDefinition` | `string` |
| `EscalationEventDefinition` | `string` |
| `CancelEventDefinition` | `string` |
| `CompensateEventDefinition` | `string` |
| `CamundaFormData` | `string` |
| `CamundaScript` | `string` |
| `CamundaScript2` | `string` |
| `CamundaScript3` | `string` |
| `CamundaIO` | `string` |
| `CamundaConnector` | `string` |

#### Defined in

[packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts:22](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts#L22)

## Functions

### dateDiff

▸ **dateDiff**(`dateStr`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dateStr` | `any` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/common/timer.ts:4](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/common/timer.ts#L4)

___

### parseDocument

▸ **parseDocument**(`text`): `any`

A document from text: JSON, else YAML. Refuses what is not OpenAPI 3.x, and a `$ref` to another file. The
document is returned as it is written: its `$ref`s are resolved when it is read (listOperations), never
stored resolved (that copies each shared schema wherever it is used: GitHub's 11 MB document becomes 50).

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` \| `object` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:37](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L37)

___

### refResolver

▸ **refResolver**(`document`): (`value`: `any`) => `any`

A resolver of the document's local `$ref`s (`#/components/...`): what a value is with each reference replaced by
what it points to. Each target is resolved once and shared by every place that refers to it (a recursive schema
refers back to itself), so resolving costs what the document is, however often its schemas are used.

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `any` |

#### Returns

`fn`

▸ (`value`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

##### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:79](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L79)

___

### resolveRefs

▸ **resolveRefs**(`document`): `any`

The document with its references resolved (shared: see refResolver).

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:126](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L126)

___

### listOperations

▸ **listOperations**(`document`): `Object`

Every operation of the document that has an operationId, by it; `skipped` lists those that have none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `operations` | `Map`\<`string`, [`Operation`](interfaces/Operation.md)\> |
| `skipped` | `string`[] |

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:138](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/OpenAPI.ts#L138)

___

### canEncrypt

▸ **canEncrypt**(): `boolean`

Whether keys can be stored: CONNECTORS_KEY is set.

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/connectors/Secrets.ts:17](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/connectors/Secrets.ts#L17)

___

### databaseName

▸ **databaseName**(`dbConfig`): `string`

The database a MongoDB configuration means: its `db`, else the database named in `db_url`'s path, else
`test` — the one the MongoDB driver itself uses when `client.db()` is given no name. Naming it lets every
component use the same database: without it the instance, archive and model collections followed the
driver while the lock manager used the literal 'bpmn', so locks were kept in a database of their own.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbConfig` | `Object` |
| `dbConfig.db?` | `string` |
| `dbConfig.db_url?` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/MongoDB.ts:20](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/datastore/MongoDB.ts#L20)

___

### feelParses

▸ **feelParses**(`source`, `unary`): `boolean`

The FEEL text parses: as unary tests (an input cell) or as an expression.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |
| `unary` | `boolean` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:173](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L173)

___

### legacyTest

▸ **legacyTest**(`source`): `string`

Input cells written for bpmn-server's earlier evaluator: `== 5` and `!= 5` are FEEL `5` and `not(5)`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:189](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/dmn/DMNParser.ts#L189)

___

### label

▸ **label**(`element`): `string`

An element in a decision's words: 'Name' (Id), or Id.

#### Parameters

| Name | Type |
| :------ | :------ |
| `element` | `any` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:15](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L15)

___

### valuesRead

▸ **valuesRead**(`expression`, `data`): `string`

The values of the data an expression reads (data.x, $data.x.y, item.data.z): "x=1, y=\"a\"".

#### Parameters

| Name | Type |
| :------ | :------ |
| `expression` | `any` |
| `data` | `any` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/elements/Flow.ts:18](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/Flow.ts#L18)

___

### verifyModel

▸ **verifyModel**(`source`, `server?`, `name?`, `options?`): `Promise`\<[`IModelVerification`](interfaces/IModelVerification.md)\>

Verifies a BPMN model's XML. Pass the server to also check services and called models
against the application; without it only the model itself is checked.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `source` | `string` | `undefined` |
| `server?` | [`IBPMNServer`](interfaces/IBPMNServer.md) | `undefined` |
| `name` | `string` | `'model'` |
| `options?` | [`IVerifyOptions`](interfaces/IVerifyOptions.md) | `undefined` |

#### Returns

`Promise`\<[`IModelVerification`](interfaces/IModelVerification.md)\>

#### Defined in

[packages/bpmn-server/src/elements/verifyModel.ts:642](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/elements/verifyModel.ts#L642)

___

### formatDecision

▸ **formatDecision**(`d`): `string`

A decision as a block:

    seq: 3   flow 'repair' (flow_gw1_repair)
    action: taken
    why:
        condition
            (item.data.needsRepairs=="Yes") || item.data.needsRepairs
        result: true (needsRepairs="Yes")

#### Parameters

| Name | Type |
| :------ | :------ |
| `d` | [`ExecutionDecision`](interfaces/ExecutionDecision.md) |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/engine/Execution.ts:867](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/Execution.ts#L867)

___

### runSandboxed

▸ **runSandboxed**(`values`, `body`, `options?`): `Promise`\<\{ `result`: `any` ; `back`: `any` ; `calls`: `string`[]  }\>

Runs a function body in QuickJS with `values` as its variables (JSON copies). `appServices` and `appUtils` are
there too: calling one of their methods returns undefined and is listed in `calls`, or, given `services`, runs it.
Returns the body's value and `returned` (an expression over the variables, default all of them) as JSON. Throws the
script's error, or a time-limit error. The time limit is the script's own: not what it waits for a service.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Record`\<`string`, `any`\> | - |
| `body` | `string` | - |
| `options` | `Object` | - |
| `options.name?` | `string` | - |
| `options.timeLimit?` | `number` | - |
| `options.memoryLimit?` | `number` | - |
| `options.log?` | (`text`: `string`) => `void` | - |
| `options.self?` | `string` | an expression: `this` in the body |
| `options.prelude?` | `string` | statements run before the body |
| `options.returned?` | `string` | an expression: what comes back of the variables |
| `options.services?` | `Object` | what calling appServices.x and appUtils.x runs |
| `options.services.appServices?` | `any` | - |
| `options.services.appUtils?` | `any` | - |

#### Returns

`Promise`\<\{ `result`: `any` ; `back`: `any` ; `calls`: `string`[]  }\>

#### Defined in

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:74](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L74)

___

### executionResult

▸ **executionResult**(`execution`): [`IExecutionResult`](interfaces/IExecutionResult.md)

What an engine call answers from outside the engine: a JSON copy of where the instance stands, shaped as an execution was
read (`.id`, `.status`, `.instance`, with `instance.items` and `instance.tokens`). Nothing in it reaches a running
process, and it can cross a network as it is.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |

#### Returns

[`IExecutionResult`](interfaces/IExecutionResult.md)

#### Defined in

[packages/bpmn-server/src/server/EngineService.ts:14](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/EngineService.ts#L14)

___

### engineCalls

▸ **engineCalls**(`server`): `Record`\<`string`, (...`args`: `any`[]) => `Promise`\<`any`\>\>

Everything outside the engine can ask of it, each answering data. It is the whole door, in this process or over the network:
what is not here can't be asked.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | [`BPMNServer`](classes/BPMNServer.md) |

#### Returns

`Record`\<`string`, (...`args`: `any`[]) => `Promise`\<`any`\>\>

#### Defined in

[packages/bpmn-server/src/server/EngineService.ts:54](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/EngineService.ts#L54)

___

### startEngineService

▸ **startEngineService**(`server`, `«destructured»`): `Promise`\<`http.Server`\>

Serves `engineCalls` to the one who launched the server: POST /engine/call { method, args }, with the key in `x-engine-key`.
Private: it listens on this machine alone unless told otherwise, and no one but the host is to reach it.
`calls` adds to what can be asked (bpmn-web's tests): they run in here, and answer data as the rest do.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `server` | [`BPMNServer`](classes/BPMNServer.md) | `undefined` |
| `«destructured»` | `Object` | `undefined` |
| › `port?` | `number` | `3001` |
| › `host?` | `string` | `'127.0.0.1'` |
| › `key` | `string` | `undefined` |
| › `calls?` | (`server`: [`BPMNServer`](classes/BPMNServer.md)) => `Record`\<`string`, (...`args`: `any`[]) => `Promise`\<`any`\>\> | `undefined` |

#### Returns

`Promise`\<`http.Server`\>

#### Defined in

[packages/bpmn-server/src/server/EngineService.ts:119](https://github.com/bpmnServer/bpmn-server/blob/2add85734d01fc0c247bb25d3082213e3beaeac5/packages/bpmn-server/src/server/EngineService.ts#L119)
