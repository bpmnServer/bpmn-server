[bpmn-server](./api/README.md)

# bpmn-server [API summary](./api-summary.md)

## Server Classes

* [BPMNServer](api/classes/bpmnserver.md)
* [Engine](api/classes/engine.md)
* [CacheManager](api/classes/cachemanager.md)
* [Cron](api/classes/cron.md)

## Execution Engine Classes

* [Execution](api/classes/execution.md)
* [ExecutionContext](api/classes/executioncontext.md)
* [Item](api/classes/item.md)
* [Token](api/classes/token.md)
* [TokenObject](api/classes/tokenobject.md)

## Datastore Classes
* [InstanceObject](api/classes/instanceobject.md)
* [ItemObject](api/classes/itemobject.md)
* [InstanceQuery](api/classes/instancequery.md)
* [DataQuery](api/classes/dataquery.md)
* [DataStore](api/classes/datastore.md)
* [ModelsDatastore](api/classes/modelsdatastoreDB.md)
* [MongoDB](api/classes/mongodb.md)
* [ItemQuery](api/classes/itemquery.md)
* [Query](api/classes/query.md)

## Common Classes

* [Logger](api/classes/logger.md)
* [Configuration](api/classes/configuration.md)
* [DefaultAppDelegate](api/classes/defaultappdelegate.md)

## BPMN Elemetns Classes
### General
* [Definition](api/classes/definition.md)
* [Element](api/classes/element.md)
* [Flow](api/classes/flow.md)
* [MessageFlow](api/classes/messageflow.md)
* [Node](api/classes/node.md)
* [NodeLoader](api/classes/nodeloader.md)
### Activities
* [Process](api/classes/process.md)
* [ReceiveTask](api/classes/receivetask.md)
* [ScriptTask](api/classes/scripttask.md)
* [SendTask](api/classes/sendtask.md)
* [ServiceTask](api/classes/servicetask.md)
* [SubProcess](api/classes/subprocess.md)
### Events
* [Event](api/classes/event.md)
* [CatchEvent](api/classes/catchevent.md)
* [EndEvent](api/classes/endevent.md)
* [ThrowEvent](api/classes/throwevent.md)
* [UserTask](api/classes/usertask.md)
### Gateways
* [EventBasedGateway](api/classes/eventbasedgateway.md)
* [Gateway](api/classes/gateway.md)
* [Loop](api/classes/loop.md)
* [SignalEventBehaviour](api/classes/signaleventbehaviour.md)
* [XORGateway](api/classes/xorgateway.md)
## BPMN Behaviour Classes

* [Behaviour](api/classes/behaviour.md)
* [CamundaFormData](api/classes/camundaformdata.md)
* [TimerBehaviour](api/classes/timerbehaviour.md)
* [IOBehaviour](api/classes/iobehaviour.md)
* [MessageEventBehaviour](api/classes/messageeventbehaviour.md)
* [ScriptBehaviour](api/classes/scriptbehaviour.md)
* [LoopBehaviour](api/classes/loopbehaviour.md)
* [LoopObject](api/classes/loopobject.md)
* [TerminateBehaviour](api/classes/terminatebehaviour.md)

### Enumerations

* [BPMN_TYPE](api/enums/bpmn_type.md)
* [EXECUTION_EVENT](api/enums/execution_event.md)
* [EXECUTION_STATUS](api/enums/execution_status.md)
* [FLOW_ACTION](api/enums/flow_action.md)
* [ITEM_STATUS](api/enums/item_status.md)
* [NODE_ACTION](api/enums/node_action.md)
* [TOKEN_STATUS](api/enums/token_status.md)

### Interfaces

* [IBPMNServer](api/interfaces/ibpmnserver.md)
* [IBehaviour](api/interfaces/ibehaviour.md)
* [IConfiguration](api/interfaces/iconfiguration.md)
* [IDataStore](api/interfaces/idatastore.md)
* [IDefinition](api/interfaces/idefinition.md)
* [IElement](api/interfaces/ielement.md)
* [IEventData](api/interfaces/ieventdata.md)
* [IExecution](api/interfaces/iexecution.md)
* [IFlow](api/interfaces/iflow.md)
* [IAppDelegate](api/interfaces/iappdelegate.md)
* [IInstanceData](api/interfaces/iinstancedata.md)
* [IItem](api/interfaces/iitem.md)
* [IItemData](api/interfaces/iitemdata.md)
* [ILogger](api/interfaces/ilogger.md)
* [IModelsDatastore](api/interfaces/imodelsdatastore.md)
* [INode](api/interfaces/inode.md)
* [IServerContext](api/interfaces/iservercontext.md)
* [IToken](api/interfaces/itoken.md)

### Object literals

* [Behaviour_names](api/README.md#const-behaviour_names)
* [moddleOptions](api/README.md#const-moddleoptions)
