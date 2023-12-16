bpmn-server

# bpmn-server

## Table of contents

### Enumerations

- [BPMN\_TYPE](enums/BPMN_TYPE.md)
- [EXECUTION\_EVENT](enums/EXECUTION_EVENT.md)
- [EXECUTION\_STATUS](enums/EXECUTION_STATUS.md)
- [FLOW\_ACTION](enums/FLOW_ACTION.md)
- [ITEM\_STATUS](enums/ITEM_STATUS.md)
- [NODE\_ACTION](enums/NODE_ACTION.md)
- [NODE\_SUBTYPE](enums/NODE_SUBTYPE.md)
- [TOKEN\_STATUS](enums/TOKEN_STATUS.md)
- [TOKEN\_TYPE](enums/TOKEN_TYPE.md)
- [USER\_ROLE](enums/USER_ROLE.md)

### Classes

- [APIData](classes/APIData.md)
- [APIEngine](classes/APIEngine.md)
- [APIModel](classes/APIModel.md)
- [BPMNAPI](classes/BPMNAPI.md)
- [BPMNServer](classes/BPMNServer.md)
- [Behaviour](classes/Behaviour.md)
- [BehaviourLoader](classes/BehaviourLoader.md)
- [BoundaryEvent](classes/BoundaryEvent.md)
- [BpmnModelData](classes/BpmnModelData.md)
- [BusinessRuleTask](classes/BusinessRuleTask.md)
- [CacheManager](classes/CacheManager.md)
- [CallActivity](classes/CallActivity.md)
- [CamundaFormData](classes/CamundaFormData.md)
- [CatchEvent](classes/CatchEvent.md)
- [Configuration](classes/Configuration.md)
- [Cron](classes/Cron.md)
- [DataStore](classes/DataStore.md)
- [DefaultAppDelegate](classes/DefaultAppDelegate.md)
- [Definition](classes/Definition.md)
- [Element](classes/Element.md)
- [EndEvent](classes/EndEvent.md)
- [Engine](classes/Engine.md)
- [Event](classes/Event.md)
- [EventBasedGateway](classes/EventBasedGateway.md)
- [EventData](classes/EventData.md)
- [Execution](classes/Execution.md)
- [Flow](classes/Flow.md)
- [Gateway](classes/Gateway.md)
- [IOBehaviour](classes/IOBehaviour.md)
- [InstanceLocker](classes/InstanceLocker.md)
- [InstanceObject](classes/InstanceObject.md)
- [Item](classes/Item.md)
- [ItemObject](classes/ItemObject.md)
- [Logger](classes/Logger.md)
- [Loop](classes/Loop.md)
- [LoopBehaviour](classes/LoopBehaviour.md)
- [LoopObject](classes/LoopObject.md)
- [MessageEventBehaviour](classes/MessageEventBehaviour.md)
- [MessageFlow](classes/MessageFlow.md)
- [ModelsDatastore](classes/ModelsDatastore.md)
- [ModelsDatastoreDB](classes/ModelsDatastoreDB.md)
- [MongoDB](classes/MongoDB.md)
- [NoCacheManager](classes/NoCacheManager.md)
- [Node](classes/Node.md)
- [NodeLoader](classes/NodeLoader.md)
- [Process](classes/Process.md)
- [ProcessData](classes/ProcessData.md)
- [Query](classes/Query.md)
- [ReceiveTask](classes/ReceiveTask.md)
- [ScriptBehaviour](classes/ScriptBehaviour.md)
- [ScriptHandler](classes/ScriptHandler.md)
- [ScriptTask](classes/ScriptTask.md)
- [SecureUser](classes/SecureUser.md)
- [SendTask](classes/SendTask.md)
- [ServerComponent](classes/ServerComponent.md)
- [ServiceTask](classes/ServiceTask.md)
- [SignalEventBehaviour](classes/SignalEventBehaviour.md)
- [StartEvent](classes/StartEvent.md)
- [SubProcess](classes/SubProcess.md)
- [TerminateBehaviour](classes/TerminateBehaviour.md)
- [ThrowEvent](classes/ThrowEvent.md)
- [TimerBehaviour](classes/TimerBehaviour.md)
- [Token](classes/Token.md)
- [TokenObject](classes/TokenObject.md)
- [Transaction](classes/Transaction.md)
- [UserTask](classes/UserTask.md)
- [XORGateway](classes/XORGateway.md)

### Interfaces

- [IAppDelegate](interfaces/IAppDelegate.md)
- [IBPMNServer](interfaces/IBPMNServer.md)
- [IBehaviour](interfaces/IBehaviour.md)
- [IBpmnModelData](interfaces/IBpmnModelData.md)
- [ICacheManager](interfaces/ICacheManager.md)
- [IConfiguration](interfaces/IConfiguration.md)
- [ICron](interfaces/ICron.md)
- [IDataStore](interfaces/IDataStore.md)
- [IDefinition](interfaces/IDefinition.md)
- [IDefinitionData](interfaces/IDefinitionData.md)
- [IElement](interfaces/IElement.md)
- [IElementData](interfaces/IElementData.md)
- [IEngine](interfaces/IEngine.md)
- [IEventData](interfaces/IEventData.md)
- [IExecution](interfaces/IExecution.md)
- [IFlow](interfaces/IFlow.md)
- [IFlowData](interfaces/IFlowData.md)
- [IInstanceData](interfaces/IInstanceData.md)
- [IItem](interfaces/IItem.md)
- [IItemData](interfaces/IItemData.md)
- [ILogger](interfaces/ILogger.md)
- [IModelsDatastore](interfaces/IModelsDatastore.md)
- [INode](interfaces/INode.md)
- [IProcessData](interfaces/IProcessData.md)
- [ISecureUser](interfaces/ISecureUser.md)
- [IServerComponent](interfaces/IServerComponent.md)
- [IToken](interfaces/IToken.md)
- [IUserInfo](interfaces/IUserInfo.md)
- [IUserService](interfaces/IUserService.md)

### Variables

- [Behaviour\_names](README.md#behaviour_names)
- [SystemUser](README.md#systemuser)
- [defaultConfiguration](README.md#defaultconfiguration)
- [docsFolder](README.md#docsfolder)

### Functions

- [dateDiff](README.md#datediff)

## Variables

### Behaviour\_names

• `Const` **Behaviour\_names**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `CamundaFormData` | `string` |
| `CamundaIO` | `string` |
| `CamundaScript` | `string` |
| `CamundaScript2` | `string` |
| `CamundaScript3` | `string` |
| `CancelEventDefinition` | `string` |
| `CompensateEventDefinition` | `string` |
| `ErrorEventDefinition` | `string` |
| `EscalationEventDefinition` | `string` |
| `IOSpecification` | `string` |
| `LoopCharacteristics` | `string` |
| `MessageEventDefinition` | `string` |
| `SignalEventDefinition` | `string` |
| `TerminateEventDefinition` | `string` |
| `TimerEventDefinition` | `string` |

#### Defined in

[elements/behaviours/BehaviourLoader.ts:16](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/elements/behaviours/BehaviourLoader.ts#L16)

___

### SystemUser

• `Const` **SystemUser**: [`SecureUser`](classes/SecureUser.md)

#### Defined in

[API/SecureUser.ts:227](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/API/SecureUser.ts#L227)

___

### defaultConfiguration

• **defaultConfiguration**: [`Configuration`](classes/Configuration.md)

#### Defined in

[common/DefaultConfiguration.ts:59](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/DefaultConfiguration.ts#L59)

___

### docsFolder

• `Const` **docsFolder**: `string`

#### Defined in

[index.ts:9](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/index.ts#L9)

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

[common/timer.ts:4](https://github.com/bpmnServer/bpmn-server/blob/b56411b/src/common/timer.ts#L4)
