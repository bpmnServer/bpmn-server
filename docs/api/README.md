[bpmn-server](README.md)

# bpmn-server

## Index

### Enumerations

* [BPMN_TYPE](enums/bpmn_type.md)
* [EXECUTION_EVENT](enums/execution_event.md)
* [EXECUTION_STATUS](enums/execution_status.md)
* [FLOW_ACTION](enums/flow_action.md)
* [ITEM_STATUS](enums/item_status.md)
* [NODE_ACTION](enums/node_action.md)
* [TOKEN_STATUS](enums/token_status.md)

### Classes

* [BPMNServer](classes/bpmnserver.md)
* [Behaviour](classes/behaviour.md)
* [BehaviourLoader](classes/behaviourloader.md)
* [BoundaryEvent](classes/boundaryevent.md)
* [BpmnModelData](classes/bpmnmodeldata.md)
* [CacheManager](classes/cachemanager.md)
* [CallActivity](classes/callactivity.md)
* [CamundaFormData](classes/camundaformdata.md)
* [CatchEvent](classes/catchevent.md)
* [Configuration](classes/configuration.md)
* [Cron](classes/cron.md)
* [DataQuery](classes/dataquery.md)
* [DataStore](classes/datastore.md)
* [DefaultAppDelegate](classes/defaultappdelegate.md)
* [Definition](classes/definition.md)
* [Element](classes/element.md)
* [EndEvent](classes/endevent.md)
* [Engine](classes/engine.md)
* [Event](classes/event.md)
* [EventBasedGateway](classes/eventbasedgateway.md)
* [EventData](classes/eventdata.md)
* [Execution](classes/execution.md)
* [ExecutionContext](classes/executioncontext.md)
* [Flow](classes/flow.md)
* [Gateway](classes/gateway.md)
* [IOBehaviour](classes/iobehaviour.md)
* [InstanceObject](classes/instanceobject.md)
* [InstanceQuery](classes/instancequery.md)
* [Item](classes/item.md)
* [ItemObject](classes/itemobject.md)
* [ItemQuery](classes/itemquery.md)
* [Logger](classes/logger.md)
* [Loop](classes/loop.md)
* [LoopBehaviour](classes/loopbehaviour.md)
* [LoopObject](classes/loopobject.md)
* [MessageEventBehaviour](classes/messageeventbehaviour.md)
* [MessageFlow](classes/messageflow.md)
* [ModelsDatastore](classes/modelsdatastore.md)
* [ModelsDatastoreDB](classes/modelsdatastoredb.md)
* [MongoDB](classes/mongodb.md)
* [Node](classes/node.md)
* [NodeLoader](classes/nodeloader.md)
* [Process](classes/process.md)
* [ProcessData](classes/processdata.md)
* [Query](classes/query.md)
* [ReceiveTask](classes/receivetask.md)
* [ScriptBehaviour](classes/scriptbehaviour.md)
* [ScriptTask](classes/scripttask.md)
* [SendTask](classes/sendtask.md)
* [ServerComponent](classes/servercomponent.md)
* [ServerHelper](classes/serverhelper.md)
* [ServiceTask](classes/servicetask.md)
* [SignalEventBehaviour](classes/signaleventbehaviour.md)
* [StartEvent](classes/startevent.md)
* [SubProcess](classes/subprocess.md)
* [TerminateBehaviour](classes/terminatebehaviour.md)
* [ThrowEvent](classes/throwevent.md)
* [TimerBehaviour](classes/timerbehaviour.md)
* [Token](classes/token.md)
* [TokenObject](classes/tokenobject.md)
* [UserTask](classes/usertask.md)
* [XORGateway](classes/xorgateway.md)

### Interfaces

* [IAppDelegate](interfaces/iappdelegate.md)
* [IBPMNServer](interfaces/ibpmnserver.md)
* [IBehaviour](interfaces/ibehaviour.md)
* [IBpmnModelData](interfaces/ibpmnmodeldata.md)
* [IConfiguration](interfaces/iconfiguration.md)
* [IDataStore](interfaces/idatastore.md)
* [IDefinition](interfaces/idefinition.md)
* [IElement](interfaces/ielement.md)
* [IEngine](interfaces/iengine.md)
* [IEventData](interfaces/ieventdata.md)
* [IExecution](interfaces/iexecution.md)
* [IExecutionContext](interfaces/iexecutioncontext.md)
* [IExecutionResponse](interfaces/iexecutionresponse.md)
* [IFlow](interfaces/iflow.md)
* [IInstanceData](interfaces/iinstancedata.md)
* [IItem](interfaces/iitem.md)
* [IItemData](interfaces/iitemdata.md)
* [ILogger](interfaces/ilogger.md)
* [IModelsDatastore](interfaces/imodelsdatastore.md)
* [INode](interfaces/inode.md)
* [IProcessData](interfaces/iprocessdata.md)
* [IServerComponent](interfaces/iservercomponent.md)
* [IServerContext](interfaces/iservercontext.md)
* [IToken](interfaces/itoken.md)

### Variables

* [BpmnModdle](README.md#const-bpmnmoddle)
* [DefaultLogger](README.md#const-defaultlogger)
* [Definition_collection](README.md#const-definition_collection)
* [Events_collection](README.md#const-events_collection)
* [FS](README.md#const-fs)
* [Instance_collection](README.md#const-instance_collection)
* [MongoClient](README.md#const-mongoclient)
* [MongoDb](README.md#const-mongodb)
* [Path](README.md#const-path)
* [Server](README.md#const-server)
* [assert](README.md#const-assert)
* [caseId](README.md#caseid)
* [defaultConfiguration](README.md#defaultconfiguration)
* [definitionsPath](README.md#let-definitionspath)
* [duration](README.md#const-duration)
* [end](README.md#const-end)
* [fs](README.md#const-fs)
* [logger](README.md#const-logger)
* [mongoose](README.md#const-mongoose)
* [parse](README.md#const-parse)
* [seq](README.md#seq)
* [toSeconds](README.md#const-toseconds)
* [uuidv4](README.md#uuidv4)

### Functions

* [Log](README.md#log)
* [checkOnEnd](README.md#checkonend)
* [checkOnWait](README.md#checkonwait)
* [dateDiff](README.md#datediff)
* [delay](README.md#delay)
* [getDueDate](README.md#getduedate)
* [getDueTimers](README.md#getduetimers)
* [test](README.md#test)

### Object literals

* [Behaviour_names](README.md#const-behaviour_names)
* [moddleOptions](README.md#const-moddleoptions)

## Variables

### `Const` BpmnModdle

• **BpmnModdle**: *any* = require('bpmn-moddle')

Defined in src/datastore/ModelsDatastore.ts:12

Defined in src/elements/Definition.ts:2

___

### `Const` DefaultLogger

• **DefaultLogger**: *any* = require('../src/DefaultLogger.js').DefaultLogger

Defined in src/helpers/ServerHelper.ts:3

___

### `Const` Definition_collection

• **Definition_collection**: *"wf_models"* = "wf_models"

Defined in src/datastore/ModelsDatastoreDB.ts:13

___

### `Const` Events_collection

• **Events_collection**: *"wf_events"* = "wf_events"

Defined in src/datastore/DataStore.ts:13

Defined in src/datastore/ModelsDatastoreDB.ts:14

___

### `Const` FS

• **FS**: *any* = require('fs')

Defined in src/common/Logger.ts:5

___

### `Const` Instance_collection

• **Instance_collection**: *"wf_instances"* = "wf_instances"

Defined in src/datastore/DataStore.ts:12

___

### `Const` MongoClient

• **MongoClient**: *any* = require('mongodb').MongoClient

Defined in src/datastore/MongoDB.ts:3

___

### `Const` MongoDb

• **MongoDb**: *any* = require('mongodb')

Defined in src/datastore/MongoDB.ts:4

___

### `Const` Path

• **Path**: *any* = require('path')

Defined in src/datastore/ModelsDatastore.ts:10

Defined in src/datastore/ModelsData.ts:7

Defined in src/datastore/ModelsDatastoreDB.ts:9

___

### `Const` Server

• **Server**: *any* = require("../src/.")

Defined in src/helpers/ServerHelper.ts:7

___

### `Const` assert

• **assert**: *any* = require('assert')

Defined in src/datastore/MongoDB.ts:6

___

###  caseId

• **caseId**: *any*

Defined in src/helpers/ServerHelper.ts:11

___

###  defaultConfiguration

• **defaultConfiguration**: *[Configuration](classes/configuration.md)‹›* = new Configuration(
	{
		definitionsPath: definitionsPath,
		timers: {
			forceTimersDelay: 1000,
			precision: 3000,
		},
		database: {
			MongoDB:
			{
				db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
				db: 'bpmn'
			}
		},
		logger: Logger,							// class
		definitions: ModelsDatastoreDB,			// class
		appDelegate: new DefaultAppDelegate(),		// object
		dataStore: DataStore				// class	
	})

Defined in src/common/DefaultConfiguration.ts:40

___

### `Let` definitionsPath

• **definitionsPath**: *string* = __dirname + '/processes/'

Defined in src/common/DefaultConfiguration.ts:8

___

### `Const` duration

• **duration**: *any* = require('iso8601-duration')

Defined in src/server/Cron.ts:8

Defined in src/elements/behaviours/Behaviour.ts:8

Defined in src/elements/behaviours/BehaviourLoader.ts:8

___

### `Const` end

• **end**: *any* = duration.end

Defined in src/server/Cron.ts:10

Defined in src/elements/behaviours/Behaviour.ts:10

Defined in src/elements/behaviours/BehaviourLoader.ts:10

___

### `Const` fs

• **fs**: *any* = require('fs')

Defined in src/engine/Token.ts:3

Defined in src/engine/Execution.ts:3

Defined in src/datastore/DataStore.ts:7

Defined in src/datastore/ModelsDatastore.ts:9

Defined in src/datastore/ModelsData.ts:6

Defined in src/server/CacheManager.ts:7

Defined in src/server/BPMNServer.ts:10

Defined in src/elements/Definition.ts:14

Defined in src/datastore/ModelsDatastoreDB.ts:8

___

### `Const` logger

• **logger**: *any* = new DefaultLogger({ toConsole: false })

Defined in src/helpers/ServerHelper.ts:5

___

### `Const` mongoose

• **mongoose**: *any* = require('mongoose')

Defined in src/datastore/MongoDB.ts:5

___

### `Const` parse

• **parse**: *any* = duration.parse

Defined in src/server/Cron.ts:9

Defined in src/elements/behaviours/Behaviour.ts:9

Defined in src/elements/behaviours/BehaviourLoader.ts:9

___

###  seq

• **seq**: *number* = 1

Defined in src/engine/DefaultAppDelegate.ts:5

___

### `Const` toSeconds

• **toSeconds**: *any* = duration.toSeconds

Defined in src/server/Cron.ts:11

Defined in src/elements/behaviours/Behaviour.ts:11

Defined in src/elements/behaviours/BehaviourLoader.ts:11

___

###  uuidv4

• **uuidv4**: *any*

Defined in src/engine/Execution.ts:13

## Functions

###  Log

▸ **Log**(`msg`: any): *void*

Defined in src/helpers/ServerHelper.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  checkOnEnd

▸ **checkOnEnd**(): *void*

Defined in src/common/timer.ts:11

**Returns:** *void*

___

###  checkOnWait

▸ **checkOnWait**(`task`: any, `item`: any): *void*

Defined in src/common/timer.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`task` | any |
`item` | any |

**Returns:** *void*

___

###  dateDiff

▸ **dateDiff**(`dateStr`: any): *string*

Defined in src/common/timer.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`dateStr` | any |

**Returns:** *string*

___

###  delay

▸ **delay**(`time`: any, `result`: any): *Promise‹unknown›*

Defined in src/engine/DefaultAppDelegate.ts:104

**Parameters:**

Name | Type |
------ | ------ |
`time` | any |
`result` | any |

**Returns:** *Promise‹unknown›*

___

###  getDueDate

▸ **getDueDate**(`task`: any): *void*

Defined in src/common/timer.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`task` | any |

**Returns:** *void*

___

###  getDueTimers

▸ **getDueTimers**(): *void*

Defined in src/common/timer.ts:14

**Returns:** *void*

___

###  test

▸ **test**(): *void*

Defined in src/engine/Model.ts:76

**Returns:** *void*

## Object literals

### `Const` Behaviour_names

### ▪ **Behaviour_names**: *object*

Defined in src/elements/behaviours/BehaviourLoader.ts:13

###  CamundaFormData

• **CamundaFormData**: *string* = "camunda:formData"

Defined in src/elements/behaviours/BehaviourLoader.ts:20

###  CamundaScript

• **CamundaScript**: *string* = "camunda:script"

Defined in src/elements/behaviours/BehaviourLoader.ts:21

###  IOSpecification

• **IOSpecification**: *string* = "ioSpecification"

Defined in src/elements/behaviours/BehaviourLoader.ts:16

###  LoopCharacteristics

• **LoopCharacteristics**: *string* = "loopCharacteristics"

Defined in src/elements/behaviours/BehaviourLoader.ts:15

###  MessageEventDefinition

• **MessageEventDefinition**: *string* = "bpmn:MessageEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:18

###  SignalEventDefinition

• **SignalEventDefinition**: *string* = "bpmn:SignalEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:19

###  TerminateEventDefinition

• **TerminateEventDefinition**: *string* = "bpmn:TerminateEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:17

###  TimerEventDefinition

• **TimerEventDefinition**: *string* = "bpmn:TimerEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:14

___

### `Const` moddleOptions

### ▪ **moddleOptions**: *object*

Defined in src/elements/js-bpmn-moddle.ts:1

###  name

• **name**: *string* = "Node bpmn-engine"

Defined in src/elements/js-bpmn-moddle.ts:3

###  prefix

• **prefix**: *string* = "js"

Defined in src/elements/js-bpmn-moddle.ts:5

###  types

• **types**: *object | object[]* = [{
    "name": "Task",
    "isAbstract": true,
    "extends": [
      "bpmn:Task"
    ],
    "properties": [
      {
        "name": "result",
        "isAttr": true,
        "type": "String"
      }
    ]
  }, {
    "name": "Output",
    "superClass": ["Element"]
  }, {
    "name": "Collectable",
    "isAbstract": true,
    "extends": ["bpmn:MultiInstanceLoopCharacteristics"],
    "properties": [
      {
        "name": "collection",
        "isAttr": true,
        "type": "String"
      },
      {
        "name": "elementVariable",
        "isAttr": true,
        "type": "String"
      }
    ]
  }, {
    "name": "FormSupported",
    "isAbstract": true,
    "extends": [
      "bpmn:StartEvent",
      "bpmn:UserTask"
    ],
    "properties": [
      {
        "name": "formKey",
        "isAttr": true,
        "type": "String"
      }
    ]
  }]

Defined in src/elements/js-bpmn-moddle.ts:9

###  uri

• **uri**: *string* = "http://paed01.github.io/bpmn-engine/schema/2017/08/bpmn"

Defined in src/elements/js-bpmn-moddle.ts:4

▪ **xml**: *object*

Defined in src/elements/js-bpmn-moddle.ts:6

* **tagAlias**: *string* = "lowerCase"
