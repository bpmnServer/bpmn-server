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
- [PolicyDenied](classes/PolicyDenied.md)
- [CaseAccess](classes/CaseAccess.md)
- [SecurityPolicy](classes/SecurityPolicy.md)
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
- [FormInvalidError](classes/FormInvalidError.md)
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
- [Registrations](classes/Registrations.md)
- [DataHandler](classes/DataHandler.md)
- [DefaultAppDelegate](classes/DefaultAppDelegate.md)
- [Execution](classes/Execution.md)
- [Item](classes/Item.md)
- [ListColumnError](classes/ListColumnError.md)
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
- [IItemAssignment](interfaces/IItemAssignment.md)
- [IFormLookup](interfaces/IFormLookup.md)
- [ILookupChoice](interfaces/ILookupChoice.md)
- [ILookupCriteria](interfaces/ILookupCriteria.md)
- [ILabelValue](interfaces/ILabelValue.md)
- [ILabel](interfaces/ILabel.md)
- [ILabelPart](interfaces/ILabelPart.md)
- [IModelLabels](interfaces/IModelLabels.md)
- [ILabelField](interfaces/ILabelField.md)
- [ILabelFilter](interfaces/ILabelFilter.md)
- [INotification](interfaces/INotification.md)
- [INotificationQuery](interfaces/INotificationQuery.md)
- [ISecurityUser](interfaces/ISecurityUser.md)
- [IPolicyRule](interfaces/IPolicyRule.md)
- [IAccess](interfaces/IAccess.md)
- [IWho](interfaces/IWho.md)
- [IWhoMay](interfaces/IWhoMay.md)
- [IModelSecurity](interfaces/IModelSecurity.md)
- [ISecurityTask](interfaces/ISecurityTask.md)
- [ISeeUser](interfaces/ISeeUser.md)
- [ConnectorAuth](interfaces/ConnectorAuth.md)
- [Connector](interfaces/Connector.md)
- [ConnectorTesting](interfaces/ConnectorTesting.md)
- [ConnectorInput](interfaces/ConnectorInput.md)
- [CallResult](interfaces/CallResult.md)
- [OperationParameter](interfaces/OperationParameter.md)
- [Operation](interfaces/Operation.md)
- [IModelVersion](interfaces/IModelVersion.md)
- [SqliteOptions](interfaces/SqliteOptions.md)
- [IFormProblem](interfaces/IFormProblem.md)
- [IBehaviour](interfaces/IBehaviour.md)
- [IModelIssue](interfaces/IModelIssue.md)
- [IVerifyOptions](interfaces/IVerifyOptions.md)
- [IModelVerification](interfaces/IModelVerification.md)
- [IAddOnModelCheck](interfaces/IAddOnModelCheck.md)
- [IAddOnDecisionFile](interfaces/IAddOnDecisionFile.md)
- [IAddOnManifest](interfaces/IAddOnManifest.md)
- [IModelCheck](interfaces/IModelCheck.md)
- [IQueryFilter](interfaces/IQueryFilter.md)
- [IExpressionPlace](interfaces/IExpressionPlace.md)
- [IExpressionName](interfaces/IExpressionName.md)
- [IFieldProblem](interfaces/IFieldProblem.md)
- [IFieldRule](interfaces/IFieldRule.md)
- [IFieldChoices](interfaces/IFieldChoices.md)
- [IAddOn](interfaces/IAddOn.md)
- [IContractParam](interfaces/IContractParam.md)
- [IContractExpression](interfaces/IContractExpression.md)
- [IAppContract](interfaces/IAppContract.md)
- [IContextSource](interfaces/IContextSource.md)
- [IContext](interfaces/IContext.md)
- [IDecisionUser](interfaces/IDecisionUser.md)
- [IDecisionAbout](interfaces/IDecisionAbout.md)
- [ExecutionDecision](interfaces/ExecutionDecision.md)
- [IListField](interfaces/IListField.md)
- [IListColumn](interfaces/IListColumn.md)
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

- [Actor](readme.md#actor)
- [PolicyKind](readme.md#policykind)
- [LookupKind](readme.md#lookupkind)
- [NotificationEvent](readme.md#notificationevent)
- [SeeConditions](readme.md#seeconditions)
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
- [DecisionLookup](readme.md#decisionlookup)
- [ApiEvent](readme.md#apievent)
- [ContextKind](readme.md#contextkind)
- [DecisionKind](readme.md#decisionkind)
- [ScriptContext](readme.md#scriptcontext)
- [LifecycleNotification](readme.md#lifecyclenotification)
- [IUpgradeOutcome](readme.md#iupgradeoutcome)
- [StorageQuery](readme.md#storagequery)
- [StorageProjection](readme.md#storageprojection)
- [StorageSort](readme.md#storagesort)

### Variables

- [SystemUser](readme.md#systemuser)
- [aiManifest](readme.md#aimanifest)
- [aiAddOn](readme.md#aiaddon)
- [POLICY\_FIELDS](readme.md#policy_fields)
- [POLICIES\_FOLDER](readme.md#policies_folder)
- [assignmentManifest](readme.md#assignmentmanifest)
- [assignmentAddOn](readme.md#assignmentaddon)
- [ACTOR\_ELEMENTS](readme.md#actor_elements)
- [BUILT\_IN\_ACTORS](readme.md#built_in_actors)
- [actorsName](readme.md#actorsname)
- [OLD\_POLICIES\_FOLDER](readme.md#old_policies_folder)
- [LOOKUP\_LIMIT](readme.md#lookup_limit)
- [formsManifest](readme.md#formsmanifest)
- [formsAddOn](readme.md#formsaddon)
- [POLICY\_ADD\_ONS](readme.md#policy_add_ons)
- [policiesManifest](readme.md#policiesmanifest)
- [policiesAddOn](readme.md#policiesaddon)
- [APP\_CONFIG\_FILE](readme.md#app_config_file)
- [FILTER\_OPS](readme.md#filter_ops)
- [labelsManifest](readme.md#labelsmanifest)
- [labelsAddOn](readme.md#labelsaddon)
- [modelingManifest](readme.md#modelingmanifest)
- [modelingAddOn](readme.md#modelingaddon)
- [NOTIFICATION\_FOLDER](readme.md#notification_folder)
- [NOTIFICATION\_TEMPLATES](readme.md#notification_templates)
- [NOTIFICATION\_COLLECTION](readme.md#notification_collection)
- [NOTIFICATION\_EVENTS](readme.md#notification_events)
- [NOTIFICATION\_OUTPUTS](readme.md#notification_outputs)
- [notificationManifest](readme.md#notificationmanifest)
- [notificationAddOn](readme.md#notificationaddon)
- [DECIDE\_AT\_ONCE](readme.md#decide_at_once)
- [SECURITY\_FOLDER](readme.md#security_folder)
- [DEFAULT\_SECURITY\_POLICY](readme.md#default_security_policy)
- [SECURITY\_ACTIONS](readme.md#security_actions)
- [FULL\_ACCESS](readme.md#full_access)
- [securityManifest](readme.md#securitymanifest)
- [securityAddOn](readme.md#securityaddon)
- [defaultConfiguration](readme.md#defaultconfiguration)
- [HTTP\_METHODS](readme.md#http_methods)
- [SECRETS\_KEY](readme.md#secrets_key)
- [OLD\_SECRETS\_KEY](readme.md#old_secrets_key)
- [HIT\_POLICIES](readme.md#hit_policies)
- [Behaviour\_names](readme.md#behaviour_names)
- [OWF\_NAMESPACE](readme.md#owf_namespace)
- [LEGACY\_CAMUNDA](readme.md#legacy_camunda)
- [ASSIGNMENT\_FIELDS](readme.md#assignment_fields)
- [API\_EVENTS](readme.md#api_events)
- [APP\_CONTRACT\_FILE](readme.md#app_contract_file)
- [DECISION\_KEYS](readme.md#decision_keys)
- [MAX\_COLUMNS](readme.md#max_columns)

### Functions

- [policyFile](readme.md#policyfile)
- [policyNames](readme.md#policynames)
- [evaluatePolicy](readme.md#evaluatepolicy)
- [applyPolicy](readme.md#applypolicy)
- [reassigned](readme.md#reassigned)
- [roleUses](readme.md#roleuses)
- [actorElements](readme.md#actorelements)
- [initiatorOf](readme.md#initiatorof)
- [actorsOf](readme.md#actorsof)
- [actorNamesOf](readme.md#actornamesof)
- [movePolicyFolder](readme.md#movepolicyfolder)
- [registerPolicyBasics](readme.md#registerpolicybasics)
- [parseLookupSource](readme.md#parselookupsource)
- [lookupElement](readme.md#lookupelement)
- [lookupElements](readme.md#lookupelements)
- [formFieldLookup](readme.md#formfieldlookup)
- [filterPath](readme.md#filterpath)
- [filterValue](readme.md#filtervalue)
- [choicesOf](readme.md#choicesof)
- [lookupChoices](readme.md#lookupchoices)
- [readAppConfig](readme.md#readappconfig)
- [addOnManifests](readme.md#addonmanifests)
- [enabledAddOns](readme.md#enabledaddons)
- [addOnNames](readme.md#addonnames)
- [policyAddOns](readme.md#policyaddons)
- [labelParts](readme.md#labelparts)
- [namedValues](readme.md#namedvalues)
- [templateProblems](readme.md#templateproblems)
- [fillTemplate](readme.md#filltemplate)
- [modelLabels](readme.md#modellabels)
- [labelsOn](readme.md#labelson)
- [caseLabel](readme.md#caselabel)
- [activityLabel](readme.md#activitylabel)
- [labelInstances](readme.md#labelinstances)
- [labelItems](readme.md#labelitems)
- [labelFields](readme.md#labelfields)
- [labelQuery](readme.md#labelquery)
- [notificationPolicyFile](readme.md#notificationpolicyfile)
- [notificationPolicyNames](readme.md#notificationpolicynames)
- [notificationTemplateFile](readme.md#notificationtemplatefile)
- [deliversNotifications](readme.md#deliversnotifications)
- [notifyEvent](readme.md#notifyevent)
- [findNotifications](readme.md#findnotifications)
- [notificationsOf](readme.md#notificationsof)
- [securityUser](readme.md#securityuser)
- [seeConditionsOfTable](readme.md#seeconditionsoftable)
- [builtInSeeConditions](readme.md#builtinseeconditions)
- [combineSeeConditions](readme.md#combineseeconditions)
- [settingProblem](readme.md#settingproblem)
- [settingsProblems](readme.md#settingsproblems)
- [parseEnv](readme.md#parseenv)
- [renderEnv](readme.md#renderenv)
- [dateDiff](readme.md#datediff)
- [connectorsTesting](readme.md#connectorstesting)
- [parseDocument](readme.md#parsedocument)
- [refResolver](readme.md#refresolver)
- [resolveRefs](readme.md#resolverefs)
- [listOperations](readme.md#listoperations)
- [exampleOf](readme.md#exampleof)
- [secretsKey](readme.md#secretskey)
- [canEncrypt](readme.md#canencrypt)
- [databaseName](readme.md#databasename)
- [orderedId](readme.md#orderedid)
- [feelParses](readme.md#feelparses)
- [legacyTest](readme.md#legacytest)
- [label](readme.md#label)
- [valuesRead](readme.md#valuesread)
- [constraintsOf](readme.md#constraintsof)
- [fieldProblems](readme.md#fieldproblems)
- [formProblems](readme.md#formproblems)
- [checkForm](readme.md#checkform)
- [taskAttribute](readme.md#taskattribute)
- [owfAttribute](readme.md#owfattribute)
- [legacyAttributes](readme.md#legacyattributes)
- [verifyModel](readme.md#verifymodel)
- [listensTo](readme.md#listensto)
- [fireApiEvent](readme.md#fireapievent)
- [registrationsOf](readme.md#registrationsof)
- [addOnsOf](readme.md#addonsof)
- [contractProblems](readme.md#contractproblems)
- [readAppContract](readme.md#readappcontract)
- [contractNames](readme.md#contractnames)
- [methodNames](readme.md#methodnames)
- [compareWithCode](readme.md#comparewithcode)
- [appVarsRead](readme.md#appvarsread)
- [appVarsFor](readme.md#appvarsfor)
- [makeContext](readme.md#makecontext)
- [itemContext](readme.md#itemcontext)
- [elementContext](readme.md#elementcontext)
- [decisionContextOf](readme.md#decisioncontextof)
- [queryContext](readme.md#querycontext)
- [formContext](readme.md#formcontext)
- [actionContext](readme.md#actioncontext)
- [narrowed](readme.md#narrowed)
- [pathProblem](readme.md#pathproblem)
- [pathValue](readme.md#pathvalue)
- [valueText](readme.md#valuetext)
- [dataPathOf](readme.md#datapathof)
- [inScope](readme.md#inscope)
- [elementType](readme.md#elementtype)
- [elementIdOf](readme.md#elementidof)
- [feelView](readme.md#feelview)
- [itemView](readme.md#itemview)
- [instanceView](readme.md#instanceview)
- [decisionContext](readme.md#decisioncontext)
- [namesAt](readme.md#namesat)
- [runningDecisionContext](readme.md#runningdecisioncontext)
- [formatDecision](readme.md#formatdecision)
- [isExpression](readme.md#isexpression)
- [columnKeys](readme.md#columnkeys)
- [listColumns](readme.md#listcolumns)
- [columnPath](readme.md#columnpath)
- [columnSortPath](readme.md#columnsortpath)
- [columnRaw](readme.md#columnraw)
- [columnValues](readme.md#columnvalues)
- [isLabelPath](readme.md#islabelpath)
- [compareValues](readme.md#comparevalues)
- [sortRecords](readme.md#sortrecords)
- [modelFormFields](readme.md#modelformfields)
- [sortOrder](readme.md#sortorder)
- [roleNames](readme.md#rolenames)
- [roleNameProblem](readme.md#rolenameproblem)
- [saveRoleNames](readme.md#saverolenames)
- [runSandboxed](readme.md#runsandboxed)
- [invokeDecision](readme.md#invokedecision)
- [delegateFacts](readme.md#delegatefacts)
- [executionResult](readme.md#executionresult)
- [engineCalls](readme.md#enginecalls)
- [startEngineService](readme.md#startengineservice)

## Type Aliases

### Actor

Ƭ **Actor**: `string` \| `string`[] \| ``null``

An actor: a user's name, several (latest first), or none.

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L18)

___

### PolicyKind

Ƭ **PolicyKind**: ``"assignment"`` \| ``"notification"`` \| ``"security"``

#### Defined in

[packages/bpmn-server/src/addons/basics/folders.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/folders.ts#L11)

___

### LookupKind

Ƭ **LookupKind**: ``"list"`` \| ``"lookup"``

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L27)

___

### NotificationEvent

Ƭ **NotificationEvent**: typeof [`NOTIFICATION_EVENTS`](readme.md#notification_events)[`number`]

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L25)

___

### SeeConditions

Ƭ **SeeConditions**: ``null`` \| `object`[]

A policy's narrowing: null, any case may be seen; [] none; else the case conditions, any of which.

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityQuery.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityQuery.ts#L18)

___

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

[packages/bpmn-server/src/datastore/InstanceLocker.ts:8](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/InstanceLocker.ts#L8)

___

### DMNOptions

Ƭ **DMNOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `debug?` | `boolean` | - |
| `log?` | (`message`: `string`) => `void` | - |
| `keepOutput?` | (`cell`: `string`) => `boolean` | - |
| `listInputs?` | `boolean` | an input whose value is a list matches a rule's test when the list or one of its values does (every decision: engine/DecisionContext.ts) |

#### Defined in

[packages/bpmn-server/src/dmn/DMNEngine.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L19)

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

[packages/bpmn-server/src/dmn/DMNEngine.ts:29](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNEngine.ts#L29)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L12)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L13)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L14)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:16](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L16)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L24)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:32](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L32)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L35)

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

[packages/bpmn-server/src/elements/verifyModel.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L31)

___

### DecisionLookup

Ƭ **DecisionLookup**: (`ref`: `string`, `folder`: `string`) => \{ `folder`: `string` ; `name`: `string`  } \| ``null``

A decision found by its tests' name (`LeaveApproval.policy`): its folder and name, or null when it isn't this one's.

#### Type declaration

▸ (`ref`, `folder`): \{ `folder`: `string` ; `name`: `string`  } \| ``null``

##### Parameters

| Name | Type |
| :------ | :------ |
| `ref` | `string` |
| `folder` | `string` |

##### Returns

\{ `folder`: `string` ; `name`: `string`  } \| ``null``

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:138](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L138)

___

### ApiEvent

Ƭ **ApiEvent**: typeof [`API_EVENTS`](readme.md#api_events)[`number`]

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:173](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L173)

___

### ContextKind

Ƭ **ContextKind**: ``"item"`` \| ``"element"`` \| ``"dmn"`` \| ``"query"`` \| ``"form"``

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L18)

___

### DecisionKind

Ƭ **DecisionKind**: ``"decision"`` \| ``"assignment"`` \| ``"security"`` \| ``"notification"``

What is deciding: a business rule task's decision, an assignment, security or notification policy.

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L25)

___

### ScriptContext

Ƭ **ScriptContext**: `Record`\<`string`, (`scope`: \{ `data`: `any`  }) => `any`\>

A variable scripts see besides their own: its value, from a copy of the data (so it can not change the process's).

#### Defined in

[packages/bpmn-server/src/engine/ScriptHandler.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ScriptHandler.ts#L18)

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

[packages/bpmn-server/src/interfaces/lifecycle.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/lifecycle.ts#L11)

___

### IUpgradeOutcome

Ƭ **IUpgradeOutcome**: ``"upgraded"`` \| ``"would-upgrade"`` \| ``"current"`` \| ``"ended"`` \| ``"stranded"`` \| ``"busy"`` \| ``"failed"``

What upgradeRunning did with an instance.

#### Defined in

[packages/bpmn-server/src/interfaces/server.ts:150](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/server.ts#L150)

___

### StorageQuery

Ƭ **StorageQuery**: `Record`\<`string`, `any`\>

The storage ports: what the engine's persistence components (the instance DataStore, the models
datastore and the instance locker) need from a database, so that MongoDB is one adapter among
others (an in-memory store; an application's PostgreSQL) and no engine code changes with it.

Documents are plain JSON objects. Queries, updates, projections and sorts use the subset of
MongoDB's query language the engine issues (equality, dotted paths into arrays, `$elemMatch`,
`$or`, `$nor`, `$and`, `$exists`, `$eq`, `$ne`, `$in`, `$nin`, `$lt`, `$lte`, `$gt`, `$gte`, `$not`, `$regex`;
`$set` and whole-document updates, with `upsert`); an adapter that cannot evaluate a query
refuses it, never ignores part of it.

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/storage.ts#L12)

___

### StorageProjection

Ƭ **StorageProjection**: `Record`\<`string`, ``0`` \| ``1`` \| `any`\> \| ``null``

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/storage.ts#L13)

___

### StorageSort

Ƭ **StorageSort**: `Record`\<`string`, ``1`` \| ``-1``\> \| ``null``

#### Defined in

[packages/bpmn-server/src/interfaces/storage.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/interfaces/storage.ts#L14)

## Variables

### SystemUser

• `Const` **SystemUser**: [`SecureUser`](classes/SecureUser.md)

#### Defined in

[packages/bpmn-server/src/API/SecureUser.ts:248](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/API/SecureUser.ts#L248)

___

### aiManifest

• `Const` **aiManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md)

#### Defined in

[packages/bpmn-server/src/addons/ai/index.ts:9](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/ai/index.ts#L9)

___

### aiAddOn

• `Const` **aiAddOn**: [`IAddOn`](interfaces/IAddOn.md)

#### Defined in

[packages/bpmn-server/src/addons/ai/index.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/ai/index.ts#L11)

___

### POLICY\_FIELDS

• `Const` **POLICY\_FIELDS**: readonly [``"assignee"``, ``"candidateUsers"``, ``"candidateGroups"``] = `ASSIGNMENT_FIELDS`

What a policy's rule sets: the engine's assignment fields.

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L21)

___

### POLICIES\_FOLDER

• `Const` **POLICIES\_FOLDER**: ``"assignment"``

The models folder's assignment policies: the Assignment add-on's own folder (before 3.7.5, policies/assignment).

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L23)

___

### assignmentManifest

• `Const` **assignmentManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md)

The Assignment add-on's manifest (addon.json): what it reads of a model, its settings, its doc page.

#### Defined in

[packages/bpmn-server/src/addons/assignment/index.ts:107](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/index.ts#L107)

___

### assignmentAddOn

• `Const` **assignmentAddOn**: [`IAddOn`](interfaces/IAddOn.md)

#### Defined in

[packages/bpmn-server/src/addons/assignment/index.ts:109](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/index.ts#L109)

___

### ACTOR\_ELEMENTS

• `Const` **ACTOR\_ELEMENTS**: `string`[]

The elements that may name an actor: the user who completes a user task, or starts the process at a start event.

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L12)

___

### BUILT\_IN\_ACTORS

• `Const` **BUILT\_IN\_ACTORS**: readonly [``"initiator"``, ``"assignee"``, ``"candidate"``]

The actors every instance has; a model names its own with owf:actor.

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L15)

___

### actorsName

• `Const` **actorsName**: [`IExpressionName`](interfaces/IExpressionName.md)

`actors`, the name every expression sees: for a place in an instance, worked out when read (a script's), or at once
(`materialized`: a decision's, the sandbox's).

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:106](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L106)

___

### OLD\_POLICIES\_FOLDER

• `Const` **OLD\_POLICIES\_FOLDER**: ``"policies"``

The folder before 3.7.5 that held the policies' folders.

#### Defined in

[packages/bpmn-server/src/addons/basics/folders.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/folders.ts#L14)

___

### LOOKUP\_LIMIT

• `Const` **LOOKUP\_LIMIT**: ``50``

At most this many choices are answered.

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L25)

___

### formsManifest

• `Const` **formsManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md) = `manifest`

#### Defined in

[packages/bpmn-server/src/addons/forms/index.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/index.ts#L14)

___

### formsAddOn

• `Const` **formsAddOn**: [`IAddOn`](interfaces/IAddOn.md)

#### Defined in

[packages/bpmn-server/src/addons/forms/index.ts:102](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/index.ts#L102)

___

### POLICY\_ADD\_ONS

• `Const` **POLICY\_ADD\_ONS**: `string`[]

The policies' three add-ons, in the order they are registered: who works on a task is decided before anyone is told.

#### Defined in

[packages/bpmn-server/src/addons/index.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L31)

___

### policiesManifest

• `Const` **policiesManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md)

**`Deprecated`**

the three add-ons' manifests together: what `policies` was before 3.7.5

#### Defined in

[packages/bpmn-server/src/addons/index.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L34)

___

### policiesAddOn

• `Const` **policiesAddOn**: [`IAddOn`](interfaces/IAddOn.md)

**`Deprecated`**

the three add-ons, registered together: what `policies` was before 3.7.5

#### Defined in

[packages/bpmn-server/src/addons/index.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L42)

___

### APP\_CONFIG\_FILE

• `Const` **APP\_CONFIG\_FILE**: ``"app-config.json"``

#### Defined in

[packages/bpmn-server/src/addons/index.ts:60](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L60)

___

### FILTER\_OPS

• `Const` **FILTER\_OPS**: readonly [``"contains"``, ``"is"``, ``"gt"``, ``"lt"``]

The filter's ops: contains (any case), is, more than, less than.

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:301](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L301)

___

### labelsManifest

• `Const` **labelsManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md) = `manifest`

#### Defined in

[packages/bpmn-server/src/addons/labels/index.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/index.ts#L13)

___

### labelsAddOn

• `Const` **labelsAddOn**: [`IAddOn`](interfaces/IAddOn.md)

#### Defined in

[packages/bpmn-server/src/addons/labels/index.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/index.ts#L34)

___

### modelingManifest

• `Const` **modelingManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md)

#### Defined in

[packages/bpmn-server/src/addons/modeling/index.ts:9](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/modeling/index.ts#L9)

___

### modelingAddOn

• `Const` **modelingAddOn**: [`IAddOn`](interfaces/IAddOn.md)

#### Defined in

[packages/bpmn-server/src/addons/modeling/index.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/modeling/index.ts#L11)

___

### NOTIFICATION\_FOLDER

• `Const` **NOTIFICATION\_FOLDER**: ``"notification"``

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L20)

___

### NOTIFICATION\_TEMPLATES

• `Const` **NOTIFICATION\_TEMPLATES**: ``"notification/templates"``

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:21](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L21)

___

### NOTIFICATION\_COLLECTION

• `Const` **NOTIFICATION\_COLLECTION**: ``"wf_notifications"``

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L22)

___

### NOTIFICATION\_EVENTS

• `Const` **NOTIFICATION\_EVENTS**: readonly [``"assigned"``, ``"completed"``, ``"ended"``]

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:23](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L23)

___

### NOTIFICATION\_OUTPUTS

• `Const` **NOTIFICATION\_OUTPUTS**: readonly [``"notify"``, ``"template"``, ``"channel"``]

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:24](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L24)

___

### notificationManifest

• `Const` **notificationManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md)

The Notifications add-on's manifest (addon.json): what it reads of a model, its settings, its doc page.

#### Defined in

[packages/bpmn-server/src/addons/notification/index.ts:84](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/index.ts#L84)

___

### notificationAddOn

• `Const` **notificationAddOn**: [`IAddOn`](interfaces/IAddOn.md)

#### Defined in

[packages/bpmn-server/src/addons/notification/index.ts:86](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/index.ts#L86)

___

### DECIDE\_AT\_ONCE

• `Const` **DECIDE\_AT\_ONCE**: ``16``

How many cases a list's page decides at once (CaseAccess.decideAll).

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L14)

___

### SECURITY\_FOLDER

• `Const` **SECURITY\_FOLDER**: ``"security"``

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:25](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L25)

___

### DEFAULT\_SECURITY\_POLICY

• `Const` **DEFAULT\_SECURITY\_POLICY**: ``"default"``

The application's default policy, for a process that names none.

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L27)

___

### SECURITY\_ACTIONS

• `Const` **SECURITY\_ACTIONS**: readonly [``"see"``, ``"data"``, ``"claim"``, ``"complete"``, ``"assign"``, ``"restart"``, ``"events"``]

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L28)

___

### FULL\_ACCESS

• `Const` **FULL\_ACCESS**: [`IAccess`](interfaces/IAccess.md)

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityPolicy.ts:80](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityPolicy.ts#L80)

___

### securityManifest

• `Const` **securityManifest**: [`IAddOnManifest`](interfaces/IAddOnManifest.md)

The Access Control add-on's manifest (addon.json): what it reads of a model, its settings, its doc page.

#### Defined in

[packages/bpmn-server/src/addons/security/index.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/index.ts#L63)

___

### securityAddOn

• `Const` **securityAddOn**: [`IAddOn`](interfaces/IAddOn.md)

#### Defined in

[packages/bpmn-server/src/addons/security/index.ts:65](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/index.ts#L65)

___

### defaultConfiguration

• `Const` **defaultConfiguration**: [`Configuration`](classes/Configuration.md)

#### Defined in

[packages/bpmn-server/src/common/DefaultConfiguration.ts:119](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/DefaultConfiguration.ts#L119)

___

### HTTP\_METHODS

• `Const` **HTTP\_METHODS**: `string`[]

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:7](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L7)

___

### SECRETS\_KEY

• `Const` **SECRETS\_KEY**: ``"SECRETS_KEY"``

The variable that holds the key, and its name before 3.7.5.

#### Defined in

[packages/bpmn-server/src/connectors/Secrets.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Secrets.ts#L11)

___

### OLD\_SECRETS\_KEY

• `Const` **OLD\_SECRETS\_KEY**: ``"CONNECTORS_KEY"``

#### Defined in

[packages/bpmn-server/src/connectors/Secrets.ts:12](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Secrets.ts#L12)

___

### HIT\_POLICIES

• `Const` **HIT\_POLICIES**: `string`[]

#### Defined in

[packages/bpmn-server/src/dmn/DMNParser.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L37)

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

[packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/behaviours/BehaviourLoader.ts#L22)

___

### OWF\_NAMESPACE

• `Const` **OWF\_NAMESPACE**: ``"http://omniworkflow.com/schema/owf/1.0"``

The `owf:` namespace's URI, as a model declares it: xmlns:owf="http://omniworkflow.com/schema/owf/1.0".

#### Defined in

[packages/bpmn-server/src/elements/owfAttributes.ts:8](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/owfAttributes.ts#L8)

___

### LEGACY\_CAMUNDA

• `Const` **LEGACY\_CAMUNDA**: readonly [``"assignmentPolicy"``, ``"label"``, ``"endLabel"``, ``"exceptionsAsErrors"``]

OWF's attributes once written as `camunda:` (Camunda does not define them).

#### Defined in

[packages/bpmn-server/src/elements/owfAttributes.ts:11](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/owfAttributes.ts#L11)

___

### ASSIGNMENT\_FIELDS

• `Const` **ASSIGNMENT\_FIELDS**: readonly [``"assignee"``, ``"candidateUsers"``, ``"candidateGroups"``]

The fields that say who works on a user task: its assignee and its candidates. The engine's, an add-on may set them.

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L18)

___

### API\_EVENTS

• `Const` **API\_EVENTS**: readonly [``"pre-query"``, ``"pre-action"``]

The API's own events (docs/design/context-object.md): fired before a read (`pre-query`, a context of kind query: a
listener adds conditions to `context.conditions`, never widens) and before an action (`pre-action`: a listener may
refuse, by throwing). An add-on listens as to any event, `server.listener.on('pre-query', (context) => ...)`.

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:172](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L172)

___

### APP\_CONTRACT\_FILE

• `Const` **APP\_CONTRACT\_FILE**: ``"app-contract.json"``

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:13](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L13)

___

### DECISION\_KEYS

• `Const` **DECISION\_KEYS**: readonly [``"data"``, ``"user"``, ``"actors"``, ``"task"``, ``"decision"``, ``"item"``, ``"this"``, ``"instance"``, ``"appServices"``]

The names the protocol sets: the data and the prepared inputs can't.

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L45)

___

### MAX\_COLUMNS

• `Const` **MAX\_COLUMNS**: ``12``

At most this many columns in a list.

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L14)

## Functions

### policyFile

▸ **policyFile**(`definitionsPath`, `name`): `string` \| ``null``

A policy's file in a models folder, or null when it isn't there.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |
| `name` | `string` |

#### Returns

`string` \| ``null``

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:34](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L34)

___

### policyNames

▸ **policyNames**(`definitionsPath`): `string`[]

The policies of a models folder, by name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:41](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L41)

___

### evaluatePolicy

▸ **evaluatePolicy**(`file`, `context`, `log?`): `Promise`\<\{ `rule?`: `number` ; `outputs`: `Record`\<`string`, `any`\> \| ``null``  }\>

A policy evaluated with this data: the first matching rule's number and its outputs (a `$(...)` cell as its text,
for the caller to evaluate), or no rule. Throws when the file can't be read or a cell isn't FEEL.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |
| `context` | `Record`\<`string`, `any`\> |
| `log?` | (`message`: `string`) => `void` |

#### Returns

`Promise`\<\{ `rule?`: `number` ; `outputs`: `Record`\<`string`, `any`\> \| ``null``  }\>

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:55](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L55)

___

### applyPolicy

▸ **applyPolicy**(`node`, `item`, `policy`): `Promise`\<\{ `set`: `Record`\<`string`, `any`\> ; `why`: [`IItemAssignment`](interfaces/IItemAssignment.md)  } \| ``null``\>

Evaluates the task's policy: what the matching rule's outputs give (each field it sets to replace the model's), and
what decided it; null when it assigns nothing. Writes a Rationale entry either way; never throws. The caller sets
them (Execution.assignItem).

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `any` |
| `item` | `any` |
| `policy` | `string` |

#### Returns

`Promise`\<\{ `set`: `Record`\<`string`, `any`\> ; `why`: [`IItemAssignment`](interfaces/IItemAssignment.md)  } \| ``null``\>

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:67](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L67)

___

### reassigned

▸ **reassigned**(`execution`, `item`, `before`, `changed`, `userName`, `previous?`): `void`

A person changed a waiting task's assignee or candidates (Execution.assign, its `assign` event), and the Rationale
says what it was and what it is now. `before`: its fields beforehand; `changed`: the assignment's fields given;
`previous`: what had decided it. A claim (taking an unassigned task oneself) keeps what offered it to them; any other
change is that person's (the engine records it).

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |
| `item` | `any` |
| `before` | `Record`\<`string`, `any`\> |
| `changed` | `Record`\<`string`, `any`\> |
| `userName` | `string` |
| `previous?` | [`IItemAssignment`](interfaces/IItemAssignment.md) |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:122](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L122)

___

### roleUses

▸ **roleUses**(`definitionsPath`): `Promise`\<`Map`\<`string`, `string`[]\>\>

Where each name is used as a role in a models folder: the lanes of its models (`<model>: lane`), and the groups its
policies assign as literals (`policy <name>, rule <n>`). By name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |

#### Returns

`Promise`\<`Map`\<`string`, `string`[]\>\>

#### Defined in

[packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts:140](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/assignment/AssignmentPolicy.ts#L140)

___

### actorElements

▸ **actorElements**(`model`): `Map`\<`string`, `string`\>

The elements a model names as actors (`owf:actor="approver"`), by element id: an actor is the name for the user who
completes a user task, or starts the process at a start event; on any other element it means nothing (verifyModel
warns). `model`: its XML, or a loaded definition (its nodes).

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `any` |

#### Returns

`Map`\<`string`, `string`\>

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L31)

___

### initiatorOf

▸ **initiatorOf**(`instance`, `items?`): `string` \| ``null``

Who started an instance: its start event's item's user, else its first item's, else the instance's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |
| `items` | `any`[] |

#### Returns

`string` \| ``null``

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L56)

___

### actorsOf

▸ **actorsOf**(`«destructured»`): `Record`\<`string`, [`Actor`](readme.md#actor)\>

An instance's actors, worked out from its items: who started it, who completed each element the model names
(`elements`, from actorElements), the waiting user tasks' assignees and candidates (users and groups). With
`scope` (an item's data path), only the items of its branch count, as its `data` does; without, all of them.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `«destructured»` | `Object` | `undefined` |
| › `instance?` | `any` | `undefined` |
| › `items?` | `any`[] | `undefined` |
| › `tokens?` | `any`[] | `instance.tokens` |
| › `elements?` | `Map`\<`string`, `string`\> | `undefined` |
| › `scope?` | `string` | `undefined` |

#### Returns

`Record`\<`string`, [`Actor`](readme.md#actor)\>

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L72)

___

### actorNamesOf

▸ **actorNamesOf**(`user`, `actors`): `string`[]

The actors a user is: the names whose value is them (or, for a candidate, one of their groups).

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`IDecisionUser`](interfaces/IDecisionUser.md) |
| `actors` | `Record`\<`string`, [`Actor`](readme.md#actor)\> |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/addons/basics/actors.ts:93](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/actors.ts#L93)

___

### movePolicyFolder

▸ **movePolicyFolder**(`definitionsPath`, `kind`, `warn?`): `string`

The add-on's folder in this models folder (`<definitionsPath>/<kind>`), its policies moved there first from where
they were before 3.7.5. `warn`: where the move is reported (once per folder).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `definitionsPath` | `string` | `undefined` |
| `kind` | [`PolicyKind`](readme.md#policykind) | `undefined` |
| `warn` | (`message`: `string`) => `void` | `console.warn` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/addons/basics/folders.ts:52](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/folders.ts#L52)

___

### registerPolicyBasics

▸ **registerPolicyBasics**(`server`): `void`

The actors, registered once on a server (each of the three add-ons asks).

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

`void`

#### Defined in

[packages/bpmn-server/src/addons/basics/index.ts:45](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/basics/index.ts#L45)

___

### parseLookupSource

▸ **parseLookupSource**(`text`): [`IFormLookup`](interfaces/IFormLookup.md)[``"source"``] \| `undefined`

A source as written: `service:<name>` or `connector:<connector>/<operationId>`; undefined when it is neither.

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

[`IFormLookup`](interfaces/IFormLookup.md)[``"source"``] \| `undefined`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L59)

___

### lookupElement

▸ **lookupElement**(`field`): `any`

A form field's `<owf:list>` or `<owf:lookup>` element (the first, when it has more).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L72)

___

### lookupElements

▸ **lookupElements**(`field`): `any`[]

The lookup elements of a field: more than one is a model's mistake (verifyModel).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `any` |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:77](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L77)

___

### formFieldLookup

▸ **formFieldLookup**(`field`): [`IFormLookup`](interfaces/IFormLookup.md) \| `undefined`

A form field's list or lookup, read from its `<owf:list>` or `<owf:lookup>`; undefined when it has none or no valid source.

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `any` |

#### Returns

[`IFormLookup`](interfaces/IFormLookup.md) \| `undefined`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:82](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L82)

___

### filterPath

▸ **filterPath**(`filter`): `string` \| `undefined`

A filter's data path: `${data.department}` reads `department`; anything else is not one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `filter` | `string` |

#### Returns

`string` \| `undefined`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:103](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L103)

___

### filterValue

▸ **filterValue**(`lookup`, `data?`): `any`

A filter's value, from the form's values first, then the case's data.

#### Parameters

| Name | Type |
| :------ | :------ |
| `lookup` | [`IFormLookup`](interfaces/IFormLookup.md) |
| `data` | `Record`\<`string`, `any`\> |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:108](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L108)

___

### choicesOf

▸ **choicesOf**(`output`, `lookup`, `text?`): [`ILookupChoice`](interfaces/ILookupChoice.md)[]

The choices in a source's answer: its rows' key and display, those with a key; searched when the source did not.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `output` | `any` | `undefined` |
| `lookup` | [`IFormLookup`](interfaces/IFormLookup.md) | `undefined` |
| `text` | `string` | `''` |

#### Returns

[`ILookupChoice`](interfaces/ILookupChoice.md)[]

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:114](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L114)

___

### lookupChoices

▸ **lookupChoices**(`server`, `lookup`, `criteria?`, `context?`): `Promise`\<[`ILookupChoice`](interfaces/ILookupChoice.md)[]\>

A field's choices, asked for now: its source called with the criteria (the text typed, the filter's value), and
its answer's rows as choices. `server`: its `appDelegate` for a service (`getServicesProvider`), its `connectors`
for a connector (their keys stay with the server). `context`: who is asking and from where, given to a service as
its second argument. A source that is missing or fails throws.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `lookup` | [`IFormLookup`](interfaces/IFormLookup.md) |
| `criteria` | [`ILookupCriteria`](interfaces/ILookupCriteria.md) |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<[`ILookupChoice`](interfaces/ILookupChoice.md)[]\>

#### Defined in

[packages/bpmn-server/src/addons/forms/FormLookup.ts:155](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/forms/FormLookup.ts#L155)

___

### readAppConfig

▸ **readAppConfig**(`file?`): \{ `[more: string]`: `any`; `addOns?`: `string`[]  } \| ``null``

The application's `app-config.json` (the working folder's, or the one given), or null when there is none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |

#### Returns

\{ `[more: string]`: `any`; `addOns?`: `string`[]  } \| ``null``

#### Defined in

[packages/bpmn-server/src/addons/index.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L63)

___

### addOnManifests

▸ **addOnManifests**(): [`IAddOnManifest`](interfaces/IAddOnManifest.md)[]

The manifests of every add-on bpmn-server comes with, on or off.

#### Returns

[`IAddOnManifest`](interfaces/IAddOnManifest.md)[]

#### Defined in

[packages/bpmn-server/src/addons/index.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L72)

___

### enabledAddOns

▸ **enabledAddOns**(`file?`, `warn?`): [`IAddOn`](interfaces/IAddOn.md)[]

The add-ons that are on: those `app-config.json` names, in bpmn-server's order; every one with no file or no
`addOns`. A name that isn't an add-on is reported (`warn`) and left out.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `file?` | `string` | `undefined` |
| `warn` | (`message`: `string`) => `void` | `console.warn` |

#### Returns

[`IAddOn`](interfaces/IAddOn.md)[]

#### Defined in

[packages/bpmn-server/src/addons/index.ts:80](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L80)

___

### addOnNames

▸ **addOnNames**(`names`): `string`[]

The names an app-config.json's `addOns` means: `policies` (before 3.7.5) is the three it became.

#### Parameters

| Name | Type |
| :------ | :------ |
| `names` | `string`[] |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/addons/index.ts:95](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L95)

___

### policyAddOns

▸ **policyAddOns**(): [`IAddOn`](interfaces/IAddOn.md)[]

The policies' add-ons, alone (Assignment, Notifications, Access Control): what a server had before `app-config.json`.

#### Returns

[`IAddOn`](interfaces/IAddOn.md)[]

#### Defined in

[packages/bpmn-server/src/addons/index.ts:100](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/index.ts#L100)

___

### labelParts

▸ **labelParts**(`template`): [`ILabelPart`](interfaces/ILabelPart.md)[]

A template's parts, in order. In parts (`;`): each part, with at most one value (a second is reported by
templateProblems, and read as part of its text). Else, as before 3.7.5: each value with the text before it, and the
text after the last one a part of its own.

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `string` |

#### Returns

[`ILabelPart`](interfaces/ILabelPart.md)[]

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:69](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L69)

___

### namedValues

▸ **namedValues**(`template`): \{ `name`: `string` ; `path`: `string`  }[]

A template's values: their names and the paths they read, in order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `string` |

#### Returns

\{ `name`: `string` ; `path`: `string`  }[]

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L94)

___

### templateProblems

▸ **templateProblems**(`template`): `string`[]

A template's problems: each value a path, at most one in a part, a name given a name, no name twice.

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `unknown` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:99](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L99)

___

### fillTemplate

▸ **fillTemplate**(`template`, `scope`): [`ILabel`](interfaces/ILabel.md)

A template filled in from `scope`. A part whose value is missing (none, null, '', only spaces) is left out, its text
too, so a label never shows a name with nothing after it. In parts, the parts are joined with ` · `; separators left
at either end are trimmed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `string` |
| `scope` | `Record`\<`string`, `unknown`\> |

#### Returns

[`ILabel`](interfaces/ILabel.md)

#### Defined in

[packages/bpmn-server/src/addons/labels/LabelTemplate.ts:125](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/LabelTemplate.ts#L125)

___

### modelLabels

▸ **modelLabels**(`source`, `moddleOptions?`): `Promise`\<[`IModelLabels`](interfaces/IModelLabels.md)\>

The label templates of a model's source: its process's, and every element's, sub-processes included.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `source` | `string` | `undefined` |
| `moddleOptions` | `Object` | `defaultModdleOptions` |
| `moddleOptions.name` | `string` | `"Node bpmn-engine"` |
| `moddleOptions.uri` | `string` | `"http://paed01.github.io/bpmn-engine/schema/2017/08/bpmn"` |
| `moddleOptions.prefix` | `string` | `"js"` |
| `moddleOptions.xml` | `Object` | `undefined` |
| `moddleOptions.xml.tagAlias` | `string` | `"lowerCase"` |
| `moddleOptions.types` | (\{ `name`: `string` = "Output"; `superClass`: `string`[] ; `isAbstract?`: `undefined` = true; `extends?`: `undefined` ; `properties?`: `undefined`  } \| \{ `superClass?`: `undefined` ; `name`: `string` = "processExtensions"; `isAbstract`: `boolean` = true; `extends`: `string`[] ; `properties`: (\{ `name`: `string` = "camunda:candidateStarterGroups"; `isAttr`: `boolean` = true; `type`: `string` = "String"; `default?`: `undefined` = true } \| \{ `name`: `string` = "camunda:isStartableInTasklist"; `isAttr`: `boolean` = true; `type`: `string` = "Boolean"; `default`: `boolean` = true })[]  })[] | `undefined` |

#### Returns

`Promise`\<[`IModelLabels`](interfaces/IModelLabels.md)\>

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:38](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L38)

___

### labelsOn

▸ **labelsOn**(`server`): `boolean`

Whether the Labels add-on is on for this server (app-config.json): off, a case is shown by its default (`<model>
#<caseId>`) and a task by its name. A server that says nothing of add-ons (an object of the application's): on.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:76](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L76)

___

### caseLabel

▸ **caseLabel**(`server`, `instance`, `labels?`): `Promise`\<[`ILabel`](interfaces/ILabel.md)\>

A case's label: its model's template, else the application's instanceLabel hook, else `<model> #<caseId>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `instance` | `any` |
| `labels?` | [`IModelLabels`](interfaces/IModelLabels.md) |

#### Returns

`Promise`\<[`ILabel`](interfaces/ILabel.md)\>

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:123](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L123)

___

### activityLabel

▸ **activityLabel**(`item`, `labels`, `caseValues`, `instance?`): [`ILabel`](interfaces/ILabel.md) \| `undefined`

An activity's own label: once it has ended, its endLabel; else (or when that says nothing) its label. The
template sees the item's data (a loop round's or a sub-process's own), its fields, and its case's named values
as `instance.<Name>`. Undefined when the element has none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `labels` | [`IModelLabels`](interfaces/IModelLabels.md) |
| `caseValues` | [`ILabelValue`](interfaces/ILabelValue.md)[] |
| `instance?` | `any` |

#### Returns

[`ILabel`](interfaces/ILabel.md) \| `undefined`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:132](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L132)

___

### labelInstances

▸ **labelInstances**(`server`, `instances`): `Promise`\<`any`[]\>

Cases labeled for display, from their own model's templates: `instance.label` (text), `instance.labelValues`
(its named values), and each item's `label` and `labelValues` when its element has a label. Nothing is saved.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `instances` | `any`[] |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:162](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L162)

___

### labelItems

▸ **labelItems**(`server`, `items`): `Promise`\<`any`[]\>

Tasks labeled for display (findItems' items: each with its data and its case's): `item.caseLabel`, its case's
label; `item.label`, its own, else its name and its case's. The cases' own sources are read in one query.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `items` | `any`[] |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:203](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L203)

___

### labelFields

▸ **labelFields**(`server`, `models?`): `Promise`\<[`ILabelField`](interfaces/ILabelField.md)[]\>

The values the models' case labels (their current versions) show, for the lists' filters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `models?` | `string`[] |

#### Returns

`Promise`\<[`ILabelField`](interfaces/ILabelField.md)[]\>

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:259](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L259)

___

### labelQuery

▸ **labelQuery**(`fields`, `filter?`): `Record`\<`string`, `any`\> \| `undefined`

A filter as a query on the cases (findInstances, and findItems for their tasks): the model, then the named value
on each model's own path, then the search on every named value. Undefined when there is nothing to filter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | [`ILabelField`](interfaces/ILabelField.md)[] |
| `filter` | [`ILabelFilter`](interfaces/ILabelFilter.md) |

#### Returns

`Record`\<`string`, `any`\> \| `undefined`

#### Defined in

[packages/bpmn-server/src/addons/labels/Labels.ts:307](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/labels/Labels.ts#L307)

___

### notificationPolicyFile

▸ **notificationPolicyFile**(`definitionsPath`, `name`): `string` \| ``null``

A notification policy's file, or null.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |
| `name` | `string` |

#### Returns

`string` \| ``null``

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:56](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L56)

___

### notificationPolicyNames

▸ **notificationPolicyNames**(`definitionsPath`): `string`[]

The models folder's notification policies, by name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L63)

___

### notificationTemplateFile

▸ **notificationTemplateFile**(`definitionsPath`, `name`): `string` \| ``null``

A template's file (`templates/<name>.md` or `.txt`), or null: a value that isn't one is the message itself.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |
| `name` | `string` |

#### Returns

`string` \| ``null``

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:70](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L70)

___

### deliversNotifications

▸ **deliversNotifications**(`instance`): `boolean`

Whether notifications are delivered: not for a test run's instance, nor with NOTIFICATIONS=record.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:81](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L81)

___

### notifyEvent

▸ **notifyEvent**(`execution`, `event`, `item?`): `Promise`\<[`INotification`](interfaces/INotification.md)[]\>

An event of an instance (`item`: its user task, for `assigned` and `completed`): the process's policy and the task's
own asked, each matching rule's notification worked out, delivered (or not) and kept. Never throws.

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |
| `event` | ``"ended"`` \| ``"assigned"`` \| ``"completed"`` |
| `item?` | `any` |

#### Returns

`Promise`\<[`INotification`](interfaces/INotification.md)[]\>

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:93](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L93)

___

### findNotifications

▸ **findNotifications**(`server`, `query?`): `Promise`\<[`INotification`](interfaces/INotification.md)[]\>

Notifications across the instances, newest first: to whom, of which instance or process, in which status.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `query` | [`INotificationQuery`](interfaces/INotificationQuery.md) |

#### Returns

`Promise`\<[`INotification`](interfaces/INotification.md)[]\>

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:225](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L225)

___

### notificationsOf

▸ **notificationsOf**(`server`, `instanceId`): `Promise`\<[`INotification`](interfaces/INotification.md)[]\>

An instance's notifications, oldest first.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `instanceId` | `string` |

#### Returns

`Promise`\<[`INotification`](interfaces/INotification.md)[]\>

#### Defined in

[packages/bpmn-server/src/addons/notification/NotificationPolicy.ts:242](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/notification/NotificationPolicy.ts#L242)

___

### securityUser

▸ **securityUser**(`user`): [`ISecurityUser`](interfaces/ISecurityUser.md)

A user as a policy sees them: administrators, the system, and security turned off are not asked.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | `SecureUser` |

#### Returns

[`ISecurityUser`](interfaces/ISecurityUser.md)

#### Defined in

[packages/bpmn-server/src/addons/security/CaseAccess.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/CaseAccess.ts#L27)

___

### seeConditionsOfTable

▸ **seeConditionsOfTable**(`file`, `user`): `Promise`\<`any`[]\>

One policy table's narrowing for this user.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |
| `user` | [`ISeeUser`](interfaces/ISeeUser.md) |

#### Returns

`Promise`\<`any`[]\>

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityQuery.ts:50](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityQuery.ts#L50)

___

### builtInSeeConditions

▸ **builtInSeeConditions**(`user`): `any`[]

The built-in default's narrowing (SecurityPolicy.builtInDefault): designers any case; the others, theirs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `user` | [`ISeeUser`](interfaces/ISeeUser.md) |

#### Returns

`any`[]

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityQuery.ts:96](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityQuery.ts#L96)

___

### combineSeeConditions

▸ **combineSeeConditions**(`byPolicy`, `fallback`): `object` \| ``null``

The store's condition for the cases this user may see, across the models: each policy's narrowing for the models
that name it, the default's for every case (a superset for the others). null: no narrowing (any case may be seen).

#### Parameters

| Name | Type |
| :------ | :------ |
| `byPolicy` | \{ `models`: `string`[] ; `conditions`: `object`[]  }[] |
| `fallback` | `object`[] |

#### Returns

`object` \| ``null``

#### Defined in

[packages/bpmn-server/src/addons/security/SecurityQuery.ts:109](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/addons/security/SecurityQuery.ts#L109)

___

### settingProblem

▸ **settingProblem**(`value`, `entry`): `string` \| ``null``

Why a value does not fit its schema entry, or null. An empty value is unset, and fits.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `entry` | `any` |

#### Returns

`string` \| ``null``

#### Defined in

[packages/bpmn-server/src/common/settingValue.ts:8](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/settingValue.ts#L8)

___

### settingsProblems

▸ **settingsProblems**(`env`, `schema`, `names?`): `string`[]

The settings' problems, one line each: a value of the wrong kind (`PORT=abc: PORT is a number`), and among `names`
(those the .env file sets) one that is not a setting but close to one (`SESSON_SECRET: not a setting; SESSION_SECRET?`).
A name far from every setting is the application's own, and not reported.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `env` | `Record`\<`string`, `string`\> | `undefined` |
| `schema` | `any` | `undefined` |
| `names` | `string`[] | `[]` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/common/settingValue.ts:40](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/settingValue.ts#L40)

___

### parseEnv

▸ **parseEnv**(`text`): `Record`\<`string`, `string`\>

A .env file's values, by name (quotes removed).

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`Record`\<`string`, `string`\>

#### Defined in

[packages/bpmn-server/src/common/settingValue.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/settingValue.ts#L59)

___

### renderEnv

▸ **renderEnv**(`text`, `changes`, `by?`): `string`

The .env with the changes (lines it adds go under a comment saying who set them, `by`): a setting's line replaced (or its commented #NAME= line), else added; null removes it.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `text` | `string` | `undefined` |
| `changes` | `Record`\<`string`, `string`\> | `undefined` |
| `by` | `string` | `'bpmn-server setup'` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/common/settingValue.ts:74](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/settingValue.ts#L74)

___

### dateDiff

▸ **dateDiff**(`dateStr`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `dateStr` | `any` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/common/timer.ts:4](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/common/timer.ts#L4)

___

### connectorsTesting

▸ **connectorsTesting**(`env?`): `string`

The environment connectors may answer outside production in: APP_ENV, when it says development or test; else none.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `env` | `ProcessEnv` | `process.env` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/connectors/Connectors.ts:93](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Connectors.ts#L93)

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

[packages/bpmn-server/src/connectors/OpenAPI.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L37)

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

[packages/bpmn-server/src/connectors/OpenAPI.ts:79](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L79)

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

[packages/bpmn-server/src/connectors/OpenAPI.ts:126](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L126)

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

[packages/bpmn-server/src/connectors/OpenAPI.ts:142](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L142)

___

### exampleOf

▸ **exampleOf**(`schema`, `depth?`): `any`

A value as a schema describes it (a connector's answer outside production, from its document): its example, else
its default, else one made from its type: an object's properties, an array of one item, the first of an enum, a
date for a date, 0, false, a string.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `schema` | `any` | `undefined` |
| `depth` | `number` | `0` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/connectors/OpenAPI.ts:189](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/OpenAPI.ts#L189)

___

### secretsKey

▸ **secretsKey**(`env?`, `warn?`): `string` \| `undefined`

The server's key for the secrets it stores: SECRETS_KEY, else CONNECTORS_KEY (its name before 3.7.5, said once).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `env` | `ProcessEnv` | `process.env` |
| `warn` | (`message`: `string`) => `void` | `console.warn` |

#### Returns

`string` \| `undefined`

#### Defined in

[packages/bpmn-server/src/connectors/Secrets.ts:17](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Secrets.ts#L17)

___

### canEncrypt

▸ **canEncrypt**(): `boolean`

Whether keys can be stored: SECRETS_KEY (or CONNECTORS_KEY, before 3.7.5) is set.

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/connectors/Secrets.ts:35](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/connectors/Secrets.ts#L35)

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

[packages/bpmn-server/src/datastore/MongoDB.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/MongoDB.ts#L20)

___

### orderedId

▸ **orderedId**(): `string`

An id for a document stored without one, ordered by when it was made, as MongoDB's ObjectIds are: newest-first
paging by `_id` (the instance lists, `find` with `after`) means the same on every store. 24 hex characters: the
milliseconds (12), a counter within the millisecond (4), random (8). In one process each is greater than the last.

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/datastore/orderedId.ts:10](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/datastore/orderedId.ts#L10)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:173](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L173)

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

[packages/bpmn-server/src/dmn/DMNParser.ts:189](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/dmn/DMNParser.ts#L189)

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

[packages/bpmn-server/src/elements/Flow.ts:15](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Flow.ts#L15)

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

[packages/bpmn-server/src/elements/Flow.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Flow.ts#L18)

___

### constraintsOf

▸ **constraintsOf**(`field`): `Record`\<`string`, `string` \| ``true``\>

A field's constraints, as { name: config }: from the parsed model, or the editor's moddle object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `any` |

#### Returns

`Record`\<`string`, `string` \| ``true``\>

#### Defined in

[packages/bpmn-server/src/elements/FormRules.ts:37](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/FormRules.ts#L37)

___

### fieldProblems

▸ **fieldProblems**(`field`, `value`, `«destructured»?`): [`IFormProblem`](interfaces/IFormProblem.md)[]

The problems of one field's value (`value`) by its type and constraints, but its list's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `any` |
| `value` | `any` |
| `«destructured»` | `Object` |
| › `sent` | `boolean` |
| › `current?` | `any` |

#### Returns

[`IFormProblem`](interfaces/IFormProblem.md)[]

#### Defined in

[packages/bpmn-server/src/elements/FormRules.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/FormRules.ts#L59)

___

### formProblems

▸ **formProblems**(`server`, `fields`, `sent?`, `current?`, `context?`): `Promise`\<[`IFormProblem`](interfaces/IFormProblem.md)[]\>

The problems of a form's values: `sent`, the data of the call; `current`, the case's. A list's value is checked
against its source's choices (as `context` asks); a source that fails refuses the value, which cannot be checked.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `fields` | `any`[] |
| `sent` | `Record`\<`string`, `any`\> |
| `current` | `Record`\<`string`, `any`\> |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<[`IFormProblem`](interfaces/IFormProblem.md)[]\>

#### Defined in

[packages/bpmn-server/src/elements/FormRules.ts:103](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/FormRules.ts#L103)

___

### checkForm

▸ **checkForm**(`server`, `elementId`, `fields`, `sent`, `current`, `context?`): `Promise`\<`void`\>

Throws FormInvalidError when the values break the form's rules.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `elementId` | `string` |
| `fields` | `any`[] |
| `sent` | `Record`\<`string`, `any`\> |
| `current` | `Record`\<`string`, `any`\> |
| `context` | `Record`\<`string`, `any`\> |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/elements/FormRules.ts:131](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/FormRules.ts#L131)

___

### taskAttribute

▸ **taskAttribute**(`item`, `def`, `attr`, `isDate?`): `Promise`\<\{ `value`: `any`  } \| ``null``\>

A user task's attribute (`camunda:<attr>`), evaluated: an expression, a `#` script, else its text with its `${...}`
parts filled in (a text with commas a list). Null when the task has none. For the task's own attributes, and for the
add-ons that read others (who works on it).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `item` | `any` | `undefined` |
| `def` | `any` | `undefined` |
| `attr` | `string` | `undefined` |
| `isDate` | `boolean` | `false` |

#### Returns

`Promise`\<\{ `value`: `any`  } \| ``null``\>

#### Defined in

[packages/bpmn-server/src/elements/Tasks.ts:282](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/Tasks.ts#L282)

___

### owfAttribute

▸ **owfAttribute**(`def`, `name`): `any`

An element's (or a process's) OWF attribute: `owf:<name>`, else the old `camunda:<name>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `def` | `any` |
| `name` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/elements/owfAttributes.ts:14](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/owfAttributes.ts#L14)

___

### legacyAttributes

▸ **legacyAttributes**(`def`): `string`[]

The OWF attributes an element still has under the old `camunda:` name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `def` | `any` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/elements/owfAttributes.ts:20](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/owfAttributes.ts#L20)

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

[packages/bpmn-server/src/elements/verifyModel.ts:852](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/elements/verifyModel.ts#L852)

___

### listensTo

▸ **listensTo**(`server`, `event`): `boolean`

Whether anything listens to an API event: with none, the API's built-in rules apply.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `event` | ``"pre-query"`` \| ``"pre-action"`` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:184](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L184)

___

### fireApiEvent

▸ **fireApiEvent**(`server`, `event`, `context`): `Promise`\<`void`\>

An API event, to each listener in turn, awaited. A listener that throws refuses: the error goes to the caller.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `event` | ``"pre-query"`` \| ``"pre-action"`` |
| `context` | `any` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:189](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L189)

___

### registrationsOf

▸ **registrationsOf**(`server`, `addOns?`): [`Registrations`](classes/Registrations.md)

What a server's add-ons registered. A server built with them has its own; else (a launched server, an object of the
application's, a model checked alone) they are registered apart, their events going nowhere: `addOns`, else the
server's configuration's.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `addOns?` | [`IAddOn`](interfaces/IAddOn.md)[] |

#### Returns

[`Registrations`](classes/Registrations.md)

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:212](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L212)

___

### addOnsOf

▸ **addOnsOf**(`server`): [`IAddOn`](interfaces/IAddOn.md)[]

A server's add-ons: what it was built with; a server that wasn't (a launched one, an object of the application's), its
configuration's; none when there is neither.

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |

#### Returns

[`IAddOn`](interfaces/IAddOn.md)[]

#### Defined in

[packages/bpmn-server/src/engine/AddOns.ts:228](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AddOns.ts#L228)

___

### contractProblems

▸ **contractProblems**(`contract`): `string`[]

What is wrong with a contract, as sentences; none when it is fine.

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `any` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L42)

___

### readAppContract

▸ **readAppContract**(`file?`): `Object`

The contract in a file (default: the working folder's app-contract.json): { contract, problems }; contract null
when there is no file, or it can't be read. Read again only when the file changed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `contract` | [`IAppContract`](interfaces/IAppContract.md) \| ``null`` |
| `problems` | `string`[] |
| `file` | `string` |

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:76](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L76)

___

### contractNames

▸ **contractNames**(`contract`): `Object`

A contract's names, by kind: its variables and functions (by name), its roles, its pages.

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | [`IAppContract`](interfaces/IAppContract.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `vars` | `Map`\<`string`, [`IContractExpression`](interfaces/IContractExpression.md)\> |
| `functions` | `Map`\<`string`, [`IContractExpression`](interfaces/IContractExpression.md)\> |
| `roles` | `string`[] |
| `pages` | `string`[] |

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:94](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L94)

___

### methodNames

▸ **methodNames**(`aClass`): `string`[]

The names of a class's methods (its prototype's, and its parents' up to Object's): a variables or functions class.

#### Parameters

| Name | Type |
| :------ | :------ |
| `aClass` | `any` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:105](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L105)

___

### compareWithCode

▸ **compareWithCode**(`contract`, `«destructured»`): \{ `severity`: ``"error"`` \| ``"warning"`` ; `message`: `string`  }[]

The contract compared with the delegate's code: a declared function the services provider lacks is an error, one
it has that is not declared a warning; the same for the variables and the variables class. As { severity, message }.

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | [`IAppContract`](interfaces/IAppContract.md) |
| `«destructured»` | `Object` |
| › `services?` | `string`[] |
| › `vars?` | `string`[] |

#### Returns

\{ `severity`: ``"error"`` \| ``"warning"`` ; `message`: `string`  }[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:117](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L117)

___

### appVarsRead

▸ **appVarsRead**(`text`): `string`[]

The `appVars.<name>`s a text reads (an expression, a script, a decision table's cells).

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:131](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L131)

___

### appVarsFor

▸ **appVarsFor**(`delegate`, `context`, `names?`): `Promise`\<`Record`\<`string`, `any`\>\>

The application's variables an evaluation reads, worked out before it runs (docs/design/app-contract.md §2.1):
the delegate's getAppVars(context) object, each name read once (a method called, an async one awaited). A name it
doesn't have reads as undefined. `names`: those read; all of the class's, when not known.

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegate` | `any` |
| `context` | `Record`\<`string`, `any`\> |
| `names?` | `string`[] |

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

#### Defined in

[packages/bpmn-server/src/engine/AppContract.ts:140](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/AppContract.ts#L140)

___

### makeContext

▸ **makeContext**(`fields`, `execution?`): [`IContext`](interfaces/IContext.md)

A context of these fields. With `execution`, what it doesn't have is read from the execution, and written there
(deprecated: the context was the execution before 3.7.5); `execution` itself is there too, not enumerable.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | [`IContext`](interfaces/IContext.md) |
| `execution?` | `any` |

#### Returns

[`IContext`](interfaces/IContext.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:72](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L72)

___

### itemContext

▸ **itemContext**(`item`, `extra?`): [`IContext`](interfaces/IContext.md)

Kind item: an item that exists.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `extra` | `Partial`\<[`IContext`](interfaces/IContext.md)\> & \{ `what?`: `string`  } |

#### Returns

[`IContext`](interfaces/IContext.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:109](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L109)

___

### elementContext

▸ **elementContext**(`execution`, `element?`, `extra?`): [`IContext`](interfaces/IContext.md)

Kind element: an element with no item yet (or the process itself, with none given).

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |
| `element?` | `any` |
| `extra` | `Partial`\<[`IContext`](interfaces/IContext.md)\> & \{ `what?`: `string`  } |

#### Returns

[`IContext`](interfaces/IContext.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:126](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L126)

___

### decisionContextOf

▸ **decisionContextOf**(`decision`, `input`, `from?`, `policy?`): [`IContext`](interfaces/IContext.md)

Kind dmn: a decision, from the context it was called from (an item's, an instance's), with its input.

#### Parameters

| Name | Type |
| :------ | :------ |
| `decision` | `string` |
| `input` | `any` |
| `from?` | `Partial`\<[`IContext`](interfaces/IContext.md)\> |
| `policy?` | `string` |

#### Returns

[`IContext`](interfaces/IContext.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:139](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L139)

___

### queryContext

▸ **queryContext**(`query`, `user`, `filter`): [`IContext`](interfaces/IContext.md)

Kind query: a read, its query and the conditions the `pre-query` listeners add.

#### Parameters

| Name | Type |
| :------ | :------ |
| `query` | `string` |
| `user` | `any` |
| `filter` | `Record`\<`string`, `any`\> |

#### Returns

[`IContext`](interfaces/IContext.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:153](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L153)

___

### formContext

▸ **formContext**(`field`, `input`, `from?`): [`IContext`](interfaces/IContext.md)

Kind form: a form field, with the form's values (`input`). What else `from` has is kept: the names a form's rules
and choices were handed before 3.7.5 (`processName`, `elementId`, `instanceId`, `taskId`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | `string` |
| `input` | `any` |
| `from` | `Partial`\<[`IContext`](interfaces/IContext.md)\> |

#### Returns

[`IContext`](interfaces/IContext.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:161](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L161)

___

### actionContext

▸ **actionContext**(`action`, `user`, `on?`): [`IContext`](interfaces/IContext.md)

Kind item or element, for a `pre-action`: the action, who asks, and what it is on (an item and its instance, or a
model's element; a model's name for a model's change).

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | `string` |
| `user` | `any` |
| `on` | `Object` |
| `on.item?` | `any` |
| `on.instance?` | `any` |
| `on.element?` | `any` |
| `on.model?` | `string` |
| `on.input?` | `any` |
| `on.assignment?` | `any` |

#### Returns

[`IContext`](interfaces/IContext.md)

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:175](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L175)

___

### narrowed

▸ **narrowed**(`query`, `conditions?`): `Record`\<`string`, `any`\>

Adds the listeners' conditions to a query, all of them holding (narrowing, never widening): each one's keys merged
where they are new, the query and the condition both kept (`$and`) where they say the same key.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `query` | `Record`\<`string`, `any`\> | `undefined` |
| `conditions` | `Record`\<`string`, `any`\>[] | `[]` |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/engine/Context.ts:186](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Context.ts#L186)

___

### pathProblem

▸ **pathProblem**(`path`): `string` \| ``null``

Why a path can't be used, or null: names separated by dots, none of them __proto__, prototype, constructor.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `unknown` |

#### Returns

`string` \| ``null``

#### Defined in

[packages/bpmn-server/src/engine/DataPaths.ts:9](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DataPaths.ts#L9)

___

### pathValue

▸ **pathValue**(`scope`, `path`): `any`

The value at a path, own fields only; undefined when it is not there.

#### Parameters

| Name | Type |
| :------ | :------ |
| `scope` | `unknown` |
| `path` | `string` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/DataPaths.ts:18](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DataPaths.ts#L18)

___

### valueText

▸ **valueText**(`value`): `string`

A value as text: '' for none, ISO for a date, lists joined, objects as JSON.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/engine/DataPaths.ts:28](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DataPaths.ts#L28)

___

### dataPathOf

▸ **dataPathOf**(`item`, `tokens?`): `string`

An item's data path (its scope): a running item's token's, else its saved token's ('' at the top).

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `tokens?` | `any`[] |

#### Returns

`string`

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:48](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L48)

___

### inScope

▸ **inScope**(`path`, `scope`): `boolean`

Whether an item at `path` is in the scope `scope`: the same branch, one inside it, or one it is inside.

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `scope` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:58](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L58)

___

### elementType

▸ **elementType**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:63](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L63)

___

### elementIdOf

▸ **elementIdOf**(`item`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:64](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L64)

___

### feelView

▸ **feelView**(`target`, `depth?`): `any`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `target` | `any` | `undefined` |
| `depth` | `number` | `2` |

#### Returns

`any`

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:70](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L70)

___

### itemView

▸ **itemView**(`item`, `data?`): `Object`

An item as an expression reads it: its own fields and its element, not the engine's objects.

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `data?` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `elementId` | `any` |
| `name` | `any` |
| `type` | `any` |
| `status` | `any` |
| `userName` | `any` |
| `assignee` | `any` |
| `seq` | `any` |
| `element` | \{ `id`: `any` ; `name`: `any` ; `type`: `any`  } |
| `element.id` | `any` |
| `element.name` | `any` |
| `element.type` | `any` |
| `data` | `any` |
| `input` | `any` |
| `output` | `any` |

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:97](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L97)

___

### instanceView

▸ **instanceView**(`instance`): `Object`

An instance as an expression reads it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `instance` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `id` | `any` |
| `name` | `any` |
| `status` | `any` |
| `data` | `any` |
| `startedAt` | `any` |
| `endedAt` | `any` |

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:109](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L109)

___

### decisionContext

▸ **decisionContext**(`«destructured»`): `Promise`\<`Record`\<`string`, `any`\>\>

The context a decision table reads (see above). `data`: the item's data (in its scope); `input`: its prepared
inputs; `names`: the names the add-ons give (namesAt: the policies' add-ons' `actors`); `appServices`: the
application's functions.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `data?` | `Record`\<`string`, `any`\> |
| › `input?` | `Record`\<`string`, `any`\> |
| › `user?` | [`IDecisionUser`](interfaces/IDecisionUser.md) |
| › `instance?` | `any` |
| › `task?` | `string` |
| › `kind` | [`DecisionKind`](readme.md#decisionkind) |
| › `name?` | `string` |
| › `appDelegate?` | `any` |
| › `appServices?` | `any` |
| › `item?` | `any` |
| › `names?` | `Record`\<`string`, `any`\> |
| › `log?` | (`message`: `string`) => `void` |

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:120](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L120)

___

### namesAt

▸ **namesAt**(`server`, `at`): `Record`\<`string`, `any`\>

The names the add-ons give expressions and decisions (engine/AddOns.ts, addExpressionName) for a place in a running
instance: its items, its model, the data path of the branch (`scope`).

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `at` | [`IExpressionPlace`](interfaces/IExpressionPlace.md) |

#### Returns

`Record`\<`string`, `any`\>

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:178](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L178)

___

### runningDecisionContext

▸ **runningDecisionContext**(`item`, `«destructured»`): `Promise`\<`Record`\<`string`, `any`\>\>

The context for a decision about a running item (a business rule task's, a user task's assignment policy): its
data in its scope, its prepared inputs, the operation's user, and the add-ons' names for its place (actors).

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |
| `«destructured»` | `Object` |
| › `kind` | [`DecisionKind`](readme.md#decisionkind) |
| › `name?` | `string` |
| › `task?` | `string` |

#### Returns

`Promise`\<`Record`\<`string`, `any`\>\>

#### Defined in

[packages/bpmn-server/src/engine/DecisionContext.ts:191](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/DecisionContext.ts#L191)

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

[packages/bpmn-server/src/engine/Execution.ts:940](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Execution.ts#L940)

___

### isExpression

▸ **isExpression**(`cell`): `boolean`

A decision table's cell that is a model expression, `$(...)` or `${...}`, evaluated as the model's others are.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cell` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/Expressions.ts:69](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Expressions.ts#L69)

___

### columnKeys

▸ **columnKeys**(`asked`): `string`[]

The keys asked, as a list: `Client,data.amount` or an array; each once, empty ones left out.

#### Parameters

| Name | Type |
| :------ | :------ |
| `asked` | `unknown` |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:33](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L33)

___

### listColumns

▸ **listColumns**(`fields`, `keys`, `model?`): [`IListColumn`](interfaces/IListColumn.md)[]

The columns for these keys: a data path (`data.…`), or a name the case labels give (`Client`), within `model` when
one is chosen. A key that is neither is a 400 BAD_COLUMN.

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | [`IListField`](interfaces/IListField.md)[] |
| `keys` | `string`[] |
| `model?` | `string` |

#### Returns

[`IListColumn`](interfaces/IListColumn.md)[]

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L42)

___

### columnPath

▸ **columnPath**(`column`, `model`): `string` \| `undefined`

The path a column reads in a model's case; undefined when that model doesn't name it.

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`IListColumn`](interfaces/IListColumn.md) |
| `model` | `string` |

#### Returns

`string` \| `undefined`

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:59](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L59)

___

### columnSortPath

▸ **columnSortPath**(`column`): `string` \| `undefined`

The one path a column reads in every case, so a database can sort by it; undefined when models differ.

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`IListColumn`](interfaces/IListColumn.md) |

#### Returns

`string` \| `undefined`

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:64](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L64)

___

### columnRaw

▸ **columnRaw**(`column`, `model`, `data`): `unknown`

A case's value of a column (its model, its data), as it is.

#### Parameters

| Name | Type |
| :------ | :------ |
| `column` | [`IListColumn`](interfaces/IListColumn.md) |
| `model` | `string` |
| `data` | `unknown` |

#### Returns

`unknown`

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:71](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L71)

___

### columnValues

▸ **columnValues**(`columns`, `model`, `data`): `Record`\<`string`, `string`\>

A case's columns as text, by key: `{ Client: 'acme', 'data.amount': '1200' }`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `columns` | [`IListColumn`](interfaces/IListColumn.md)[] |
| `model` | `string` |
| `data` | `unknown` |

#### Returns

`Record`\<`string`, `string`\>

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:77](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L77)

___

### isLabelPath

▸ **isLabelPath**(`fields`, `path`): `boolean`

Whether a data path is one the models' case labels read: shown in every list already (a label is public by design).

#### Parameters

| Name | Type |
| :------ | :------ |
| `fields` | [`IListField`](interfaces/IListField.md)[] |
| `path` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:82](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L82)

___

### compareValues

▸ **compareValues**(`a`, `b`): `number`

Two values in a sort's order: none last, numbers as numbers, dates by time, text by its letters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `unknown` |
| `b` | `unknown` |

#### Returns

`number`

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:87](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L87)

___

### sortRecords

▸ **sortRecords**\<`T`\>(`records`, `valueOf`, `direction`, `tie?`): `T`[]

Records sorted by a value, in `direction`; those without one last either way; `tie` orders equal ones.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `records` | `T`[] |
| `valueOf` | (`r`: `T`) => `unknown` |
| `direction` | ``-1`` \| ``1`` |
| `tie` | (`a`: `T`, `b`: `T`) => `number` |

#### Returns

`T`[]

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:97](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L97)

___

### modelFormFields

▸ **modelFormFields**(`source`): \{ `id`: `string` ; `label`: `string`  }[]

A model's form fields, each once, in the order the model has them: their ids (each a field of the case's data,
`data.<id>`) and labels. What a person knows a case's data by, to choose a list's columns.

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |

#### Returns

\{ `id`: `string` ; `label`: `string`  }[]

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:114](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L114)

___

### sortOrder

▸ **sortOrder**(`order`, `fallback`): ``1`` \| ``-1``

The order asked: asc or desc (a 400 BAD_SORT otherwise); `fallback` when none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `order` | `unknown` |
| `fallback` | ``-1`` \| ``1`` |

#### Returns

``1`` \| ``-1``

#### Defined in

[packages/bpmn-server/src/engine/ListColumns.ts:131](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/ListColumns.ts#L131)

___

### roleNames

▸ **roleNames**(`definitionsPath`): `string`[] \| ``null``

The roles of a models folder (`roles.json`, a list of names), or null when it has none.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |

#### Returns

`string`[] \| ``null``

#### Defined in

[packages/bpmn-server/src/engine/Roles.ts:9](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Roles.ts#L9)

___

### roleNameProblem

▸ **roleNameProblem**(`name`): `string` \| ``null``

Why a role name can't be used, or null: a name of letters, digits, spaces, `_`, `-` or `.`, at most 64.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `unknown` |

#### Returns

`string` \| ``null``

#### Defined in

[packages/bpmn-server/src/engine/Roles.ts:19](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Roles.ts#L19)

___

### saveRoleNames

▸ **saveRoleNames**(`definitionsPath`, `roles`): `string`[]

Writes roles.json: the names, each once, in the order given.

#### Parameters

| Name | Type |
| :------ | :------ |
| `definitionsPath` | `string` |
| `roles` | `string`[] |

#### Returns

`string`[]

#### Defined in

[packages/bpmn-server/src/engine/Roles.ts:27](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/Roles.ts#L27)

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

[packages/bpmn-server/src/engine/SandboxScriptHandler.ts:81](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/engine/SandboxScriptHandler.ts#L81)

___

### invokeDecision

▸ **invokeDecision**(`server`, `ref`, `data?`): `Promise`\<\{ `decision`: `string` = found.decision.id; `file`: `string` ; `result`: `any`  }\>

A decision of the models folder evaluated, as a business rule task does: `ref` is a file's name or a decision's id;
an add-on's by its tests' name (a policy: `LeaveApproval.policy`, `Cases.security-policy`), as the add-on says
(decisionByName). The engine's own (EngineService's invokeDecision, and a scenario's @evaluate, which runs in the engine).

#### Parameters

| Name | Type |
| :------ | :------ |
| `server` | `any` |
| `ref` | `string` |
| `data` | `Object` |

#### Returns

`Promise`\<\{ `decision`: `string` = found.decision.id; `file`: `string` ; `result`: `any`  }\>

#### Defined in

[packages/bpmn-server/src/server/EngineService.ts:22](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/EngineService.ts#L22)

___

### delegateFacts

▸ **delegateFacts**(`delegate`): `Object`

The application's delegate: its class, and the methods it defines itself (not those of bpmn-server's or bpmn-web's base).

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegate` | `any` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `name` | `string` \| ``null`` |
| `methods` | `string`[] |

#### Defined in

[packages/bpmn-server/src/server/EngineService.ts:31](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/EngineService.ts#L31)

___

### executionResult

▸ **executionResult**(`execution`): [`IExecutionResult`](interfaces/IExecutionResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `execution` | `any` |

#### Returns

[`IExecutionResult`](interfaces/IExecutionResult.md)

#### Defined in

[packages/bpmn-server/src/server/EngineService.ts:42](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/EngineService.ts#L42)

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

[packages/bpmn-server/src/server/EngineService.ts:82](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/EngineService.ts#L82)

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

[packages/bpmn-server/src/server/EngineService.ts:211](https://github.com/bpmnServer/bpmn-server/blob/c8e51315c75e44af0601374b1fc8baad86fd4779/packages/bpmn-server/src/server/EngineService.ts#L211)
