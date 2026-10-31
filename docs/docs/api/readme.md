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
- [APIEngine](classes/APIEngine.md)
- [APIData](classes/APIData.md)
- [APIModel](classes/APIModel.md)
- [SecureUser](classes/SecureUser.md)
- [Configuration](classes/Configuration.md)
- [Logger](classes/Logger.md)
- [DataStore](classes/DataStore.md)
- [InstanceLocker](classes/InstanceLocker.md)
- [BpmnModelData](classes/BpmnModelData.md)
- [ProcessData](classes/ProcessData.md)
- [EventData](classes/EventData.md)
- [ModelsDatastore](classes/ModelsDatastore.md)
- [ModelsDatastoreDB](classes/ModelsDatastoreDB.md)
- [MongoDB](classes/MongoDB.md)
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
- [ScriptHandler](classes/ScriptHandler.md)
- [Token](classes/Token.md)
- [BPMNServer](classes/BPMNServer.md)
- [NoCacheManager](classes/NoCacheManager.md)
- [CacheManager](classes/CacheManager.md)
- [Cron](classes/Cron.md)
- [Engine](classes/Engine.md)
- [ServerComponent](classes/ServerComponent.md)

### Interfaces

- [IEngineOptions](interfaces/IEngineOptions.md)
- [IAPIEngine](interfaces/IAPIEngine.md)
- [IAPIData](interfaces/IAPIData.md)
- [IAPIModel](interfaces/IAPIModel.md)
- [IBehaviour](interfaces/IBehaviour.md)
- [IItemData](interfaces/IItemData.md)
- [IInstanceData](interfaces/IInstanceData.md)
- [IDefinitionData](interfaces/IDefinitionData.md)
- [IElementData](interfaces/IElementData.md)
- [IFlowData](interfaces/IFlowData.md)
- [IEventData](interfaces/IEventData.md)
- [IBpmnModelData](interfaces/IBpmnModelData.md)
- [IProcessData](interfaces/IProcessData.md)
- [IUserInfo](interfaces/IUserInfo.md)
- [ISecureUser](interfaces/ISecureUser.md)
- [IUserService](interfaces/IUserService.md)
- [IConfiguration](interfaces/IConfiguration.md)
- [ILogger](interfaces/ILogger.md)
- [IAppDelegate](interfaces/IAppDelegate.md)
- [IDataStore](interfaces/IDataStore.md)
- [IModelsDatastore](interfaces/IModelsDatastore.md)
- [IDefinition](interfaces/IDefinition.md)
- [IElement](interfaces/IElement.md)
- [IFlow](interfaces/IFlow.md)
- [INode](interfaces/INode.md)
- [IToken](interfaces/IToken.md)
- [IExecution](interfaces/IExecution.md)
- [IItem](interfaces/IItem.md)
- [IBPMNServer](interfaces/IBPMNServer.md)
- [IServerComponent](interfaces/IServerComponent.md)
- [IEngine](interfaces/IEngine.md)
- [ICron](interfaces/ICron.md)
- [ICacheManager](interfaces/ICacheManager.md)

### Variables

- [SystemUser](readme.md#systemuser)
- [defaultConfiguration](readme.md#defaultconfiguration)
- [Instance\_collection](readme.md#instance_collection)
- [Locks\_collection](readme.md#locks_collection)
- [Archive\_collection](readme.md#archive_collection)
- [Behaviour\_names](readme.md#behaviour_names)

### Functions

- [dateDiff](readme.md#datediff)

## Variables

### SystemUser

• `Const` **SystemUser**: [`SecureUser`](classes/SecureUser.md)

#### Defined in

[API/SecureUser.ts:230](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/API/SecureUser.ts#L230)

___

### defaultConfiguration

• **defaultConfiguration**: [`Configuration`](classes/Configuration.md)

#### Defined in

[common/DefaultConfiguration.ts:56](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/DefaultConfiguration.ts#L56)

___

### Instance\_collection

• `Const` **Instance\_collection**: ``"wf_instances"``

#### Defined in

[datastore/DataStore.ts:17](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/DataStore.ts#L17)

___

### Locks\_collection

• `Const` **Locks\_collection**: ``"wf_locks"``

#### Defined in

[datastore/DataStore.ts:18](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/DataStore.ts#L18)

___

### Archive\_collection

• `Const` **Archive\_collection**: ``"wf_archives"``

#### Defined in

[datastore/DataStore.ts:19](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/datastore/DataStore.ts#L19)

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

#### Defined in

[elements/behaviours/BehaviourLoader.ts:16](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/elements/behaviours/BehaviourLoader.ts#L16)

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

[common/timer.ts:4](https://github.com/bpmnServer/bpmn-server/blob/67a073b/src/common/timer.ts#L4)
