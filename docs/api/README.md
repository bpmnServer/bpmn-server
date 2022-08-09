[bpmn-server](README.md)

# bpmn-server

## Index

### Enumerations

* [BPMN_TYPE](enums/bpmn_type.md)
* [EXECUTION_EVENT](enums/execution_event.md)
* [EXECUTION_STATUS](enums/execution_status.md)
* [FLOW_ACTION](enums/flow_action.md)
* [HIT_POLICY](enums/hit_policy.md)
* [ITEM_STATUS](enums/item_status.md)
* [NODE_ACTION](enums/node_action.md)
* [NODE_SUBTYPE](enums/node_subtype.md)
* [TOKEN_STATUS](enums/token_status.md)
* [TOKEN_TYPE](enums/token_type.md)

### Classes

* [ACL](classes/acl.md)
* [AccessRule](classes/accessrule.md)
* [AssignRule](classes/assignrule.md)
* [Assignment](classes/assignment.md)
* [Authorization](classes/authorization.md)
* [AuthorizeRule](classes/authorizerule.md)
* [BPMNServer](classes/bpmnserver.md)
* [BaseRepository](classes/baserepository.md)
* [Behaviour](classes/behaviour.md)
* [BehaviourLoader](classes/behaviourloader.md)
* [BoundaryEvent](classes/boundaryevent.md)
* [BpmnModelData](classes/bpmnmodeldata.md)
* [BusinessRuleTask](classes/businessruletask.md)
* [CacheManager](classes/cachemanager.md)
* [CallActivity](classes/callactivity.md)
* [CamundaFormData](classes/camundaformdata.md)
* [CatchEvent](classes/catchevent.md)
* [Condition](classes/condition.md)
* [Configuration](classes/configuration.md)
* [Cron](classes/cron.md)
* [DTOutput](classes/dtoutput.md)
* [DataQuery](classes/dataquery.md)
* [DataStore](classes/datastore.md)
* [DecisionTable](classes/decisiontable.md)
* [DefaultAppDelegate](classes/defaultappdelegate.md)
* [Definition](classes/definition.md)
* [DesignateRule](classes/designaterule.md)
* [Element](classes/element.md)
* [EndEvent](classes/endevent.md)
* [Engine](classes/engine.md)
* [ErrorEventBehaviour](classes/erroreventbehaviour.md)
* [Event](classes/event.md)
* [EventBasedGateway](classes/eventbasedgateway.md)
* [EventData](classes/eventdata.md)
* [Execution](classes/execution.md)
* [Expression](classes/expression.md)
* [Flow](classes/flow.md)
* [Gateway](classes/gateway.md)
* [HitPolicy](classes/hitpolicy.md)
* [IAM](classes/iam.md)
* [IOBehaviour](classes/iobehaviour.md)
* [InputClause](classes/inputclause.md)
* [InstanceObject](classes/instanceobject.md)
* [InstanceQuery](classes/instancequery.md)
* [Involvement](classes/involvement.md)
* [Item](classes/item.md)
* [ItemObject](classes/itemobject.md)
* [ItemQuery](classes/itemquery.md)
* [Listener](classes/listener.md)
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
* [Notification](classes/notification.md)
* [NotifyRule](classes/notifyrule.md)
* [Options](classes/options.md)
* [OutputClause](classes/outputclause.md)
* [Process](classes/process.md)
* [ProcessData](classes/processdata.md)
* [Query](classes/query.md)
* [ReceiveTask](classes/receivetask.md)
* [Rule](classes/rule.md)
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
* [User](classes/user.md)
* [UserTask](classes/usertask.md)
* [XORGateway](classes/xorgateway.md)

### Interfaces

* [IACL](interfaces/iacl.md)
* [IAppDelegate](interfaces/iappdelegate.md)
* [IBPMNServer](interfaces/ibpmnserver.md)
* [IBehaviour](interfaces/ibehaviour.md)
* [IBpmnModelData](interfaces/ibpmnmodeldata.md)
* [ICacheManager](interfaces/icachemanager.md)
* [IConfiguration](interfaces/iconfiguration.md)
* [ICron](interfaces/icron.md)
* [IDataStore](interfaces/idatastore.md)
* [IDefinition](interfaces/idefinition.md)
* [IElement](interfaces/ielement.md)
* [IEngine](interfaces/iengine.md)
* [IEventData](interfaces/ieventdata.md)
* [IExecution](interfaces/iexecution.md)
* [IFlow](interfaces/iflow.md)
* [IIAM](interfaces/iiam.md)
* [IInstanceData](interfaces/iinstancedata.md)
* [IItem](interfaces/iitem.md)
* [IItemData](interfaces/iitemdata.md)
* [ILogger](interfaces/ilogger.md)
* [IModelsDatastore](interfaces/imodelsdatastore.md)
* [INode](interfaces/inode.md)
* [IProcessData](interfaces/iprocessdata.md)
* [IServerComponent](interfaces/iservercomponent.md)
* [IToken](interfaces/itoken.md)
* [IUser](interfaces/iuser.md)

### Variables

* [BpmnModdle](README.md#const-bpmnmoddle)
* [DefaultLogger](README.md#const-defaultlogger)
* [Definition_collection](README.md#const-definition_collection)
* [Events_collection](README.md#const-events_collection)
* [FEEL](README.md#const-feel)
* [FS](README.md#const-fs)
* [Instance_collection](README.md#const-instance_collection)
* [MongoClient](README.md#const-mongoclient)
* [MongoDb](README.md#const-mongodb)
* [Path](README.md#const-path)
* [Server](README.md#const-server)
* [_version_](README.md#const-_version_)
* [assert](README.md#const-assert)
* [caseId](README.md#caseid)
* [defaultConfiguration](README.md#defaultconfiguration)
* [definitionsPath](README.md#let-definitionspath)
* [duration](README.md#const-duration)
* [end](README.md#const-end)
* [feel](README.md#const-feel)
* [fs](README.md#const-fs)
* [logger](README.md#const-logger)
* [mongoose](README.md#const-mongoose)
* [parse](README.md#const-parse)
* [path](README.md#const-path)
* [rulesCount](README.md#rulescount)
* [rulesMatched](README.md#rulesmatched)
* [toSeconds](README.md#const-toseconds)
* [uuidv4](README.md#uuidv4)

### Functions

* [ExecuteCondition](README.md#executecondition)
* [ExecuteDecisionTable](README.md#executedecisiontable)
* [ExecuteExpression](README.md#executeexpression)
* [Log](README.md#log)
* [checkOnEnd](README.md#checkonend)
* [checkOnWait](README.md#checkonwait)
* [dateDiff](README.md#datediff)
* [debug](README.md#debug)
* [delay](README.md#delay)
* [getDueDate](README.md#getduedate)
* [getDueTimers](README.md#getduetimers)
* [getValue](README.md#getvalue)
* [test](README.md#test)
* [trimParam](README.md#trimparam)

### Object literals

* [Behaviour_names](README.md#const-behaviour_names)
* [moddleOptions](README.md#const-moddleoptions)

## Variables

### `Const` BpmnModdle

• **BpmnModdle**: *any* = require('bpmn-moddle')

Defined in bpmnServer/src/elements/Definition.ts:2

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:11

___

### `Const` DefaultLogger

• **DefaultLogger**: *any* = require('../src/DefaultLogger.js').DefaultLogger

Defined in bpmnServer/src/helpers/ServerHelper.ts:3

___

### `Const` Definition_collection

• **Definition_collection**: *"wf_models"* = "wf_models"

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:20

___

### `Const` Events_collection

• **Events_collection**: *"wf_events"* = "wf_events"

Defined in bpmnServer/src/datastore/DataStore.ts:15

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:21

___

### `Const` FEEL

• **FEEL**: *any* = feel

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:4

___

### `Const` FS

• **FS**: *any* = require('fs')

Defined in bpmnServer/src/common/Logger.ts:5

Defined in bpmnServer/node_modules/dmn-engine/common.ts:2

___

### `Const` Instance_collection

• **Instance_collection**: *"wf_instances"* = "wf_instances"

Defined in bpmnServer/src/datastore/DataStore.ts:14

___

### `Const` MongoClient

• **MongoClient**: *any* = require('mongodb').MongoClient

Defined in bpmnServer/src/datastore/MongoDB.ts:3

___

### `Const` MongoDb

• **MongoDb**: *any* = require('mongodb')

Defined in bpmnServer/src/datastore/MongoDB.ts:4

___

### `Const` Path

• **Path**: *any* = require('path')

Defined in bpmnServer/src/datastore/ModelsData.ts:7

Defined in bpmnServer/src/acl/Repository.ts:8

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:9

___

### `Const` Server

• **Server**: *any* = require("../src/.")

Defined in bpmnServer/src/helpers/ServerHelper.ts:7

___

### `Const` _version_

• **_version_**: *"1.1.10"* = "1.1.10"

Defined in bpmnServer/src/server/BPMNServer.ts:12

___

### `Const` assert

• **assert**: *any* = require('assert')

Defined in bpmnServer/src/datastore/MongoDB.ts:6

___

###  caseId

• **caseId**: *any*

Defined in bpmnServer/src/helpers/ServerHelper.ts:11

___

###  defaultConfiguration

• **defaultConfiguration**: *[Configuration](classes/configuration.md)‹›* = new Configuration(
	{
		definitionsPath: definitionsPath,
		templatesPath: __dirname +'/emailTemplates',
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
		apiKey: '1234',
		logger: function (server) {
			new Logger(server);
		},
		definitions: function (server) {
			return new ModelsDatastore(server);
		},
		appDelegate: function (server) {
			return new DefaultAppDelegate(server);
		},
		dataStore: function (server) {
			return new DataStore(server);
		},
		IAM: function (server) {
			return new IAM(server);
		},
		ACL: function (server) {
			return new ACL(server);
		}
	})

Defined in bpmnServer/src/common/DefaultConfiguration.ts:48

___

### `Let` definitionsPath

• **definitionsPath**: *string* = __dirname + '/processes/'

Defined in bpmnServer/src/common/DefaultConfiguration.ts:9

___

### `Const` duration

• **duration**: *any* = require('iso8601-duration')

Defined in bpmnServer/src/server/Cron.ts:8

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:8

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:9

___

### `Const` end

• **end**: *any* = duration.end

Defined in bpmnServer/src/server/Cron.ts:10

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:10

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:11

___

### `Const` feel

• **feel**: *any* = require('js-feel/dist/feel')

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:1

___

### `Const` fs

• **fs**: *any* = require('fs')

Defined in bpmnServer/src/server/ACL.ts:4

Defined in bpmnServer/src/datastore/DataStore.ts:9

Defined in bpmnServer/src/datastore/ModelsData.ts:6

Defined in bpmnServer/src/server/CacheManager.ts:9

Defined in bpmnServer/src/server/BPMNServer.ts:14

Defined in bpmnServer/src/acl/Repository.ts:7

Defined in bpmnServer/src/engine/Execution.ts:3

Defined in bpmnServer/src/engine/Token.ts:3

Defined in bpmnServer/src/elements/Definition.ts:15

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:5

Defined in bpmnServer/src/datastore/ModelsDatastore.ts:8

___

### `Const` logger

• **logger**: *any* = new DefaultLogger({ toConsole: false })

Defined in bpmnServer/node_modules/dmn-engine/common.ts:122

Defined in bpmnServer/src/helpers/ServerHelper.ts:5

___

### `Const` mongoose

• **mongoose**: *any* = require('mongoose')

Defined in bpmnServer/src/datastore/MongoDB.ts:5

___

### `Const` parse

▸ **parse**(`script`: any, `options`: object): *Promise‹any›*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:43

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`script` | any | - |
`options` | object | {} |

**Returns:** *Promise‹any›*

___

### `Const` path

• **path**: *any* = require('path')

Defined in bpmnServer/src/server/ACL.ts:5

___

###  rulesCount

• **rulesCount**: *number* = 0

Defined in bpmnServer/src/acl/Repository.ts:98

___

###  rulesMatched

• **rulesMatched**: *number* = 0

Defined in bpmnServer/src/acl/Repository.ts:99

___

### `Const` toSeconds

• **toSeconds**: *any* = duration.toSeconds

Defined in bpmnServer/src/server/Cron.ts:11

Defined in bpmnServer/src/elements/behaviours/Behaviour.ts:11

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:12

___

###  uuidv4

• **uuidv4**: *any*

Defined in bpmnServer/src/server/ACL.ts:11

Defined in bpmnServer/src/acl/Repository.ts:10

Defined in bpmnServer/src/engine/Execution.ts:16

## Functions

###  ExecuteCondition

▸ **ExecuteCondition**(`script`: any, `variable`: any, `context`: any): *Promise‹any›*

Defined in bpmnServer/node_modules/dmn-engine/index.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`script` | any |
`variable` | any |
`context` | any |

**Returns:** *Promise‹any›*

___

###  ExecuteDecisionTable

▸ **ExecuteDecisionTable**(`__namedParameters`: object): *Promise‹any›*

Defined in bpmnServer/node_modules/dmn-engine/index.ts:14

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`data` | any |
`definition` | any |
`loadFrom` | any |
`options` | any |

**Returns:** *Promise‹any›*

___

###  ExecuteExpression

▸ **ExecuteExpression**(`script`: any, `context`: any): *Promise‹any›*

Defined in bpmnServer/node_modules/dmn-engine/index.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`script` | any |
`context` | any |

**Returns:** *Promise‹any›*

___

###  Log

▸ **Log**(`msg`: any): *void*

Defined in bpmnServer/src/helpers/ServerHelper.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  checkOnEnd

▸ **checkOnEnd**(): *void*

Defined in bpmnServer/src/common/timer.ts:11

**Returns:** *void*

___

###  checkOnWait

▸ **checkOnWait**(`task`: any, `item`: any): *void*

Defined in bpmnServer/src/common/timer.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`task` | any |
`item` | any |

**Returns:** *void*

___

###  dateDiff

▸ **dateDiff**(`dateStr`: any): *string*

Defined in bpmnServer/src/common/timer.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`dateStr` | any |

**Returns:** *string*

___

###  debug

▸ **debug**(`type`: any, `title`: any, `obj`: any): *void*

Defined in bpmnServer/node_modules/dmn-engine/common.ts:12

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`type` | any | - |
`title` | any | - |
`obj` | any | null |

**Returns:** *void*

___

###  delay

▸ **delay**(`time`: any, `result`: any): *Promise‹unknown›*

Defined in bpmnServer/src/engine/DefaultAppDelegate.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`time` | any |
`result` | any |

**Returns:** *Promise‹unknown›*

___

###  getDueDate

▸ **getDueDate**(`task`: any): *void*

Defined in bpmnServer/src/common/timer.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`task` | any |

**Returns:** *void*

___

###  getDueTimers

▸ **getDueTimers**(): *void*

Defined in bpmnServer/src/common/timer.ts:14

**Returns:** *void*

___

###  getValue

▸ **getValue**(`value`: any): *any*

Defined in bpmnServer/node_modules/dmn-engine/Expression.ts:99

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *any*

___

###  test

▸ **test**(): *void*

Defined in bpmnServer/src/engine/Model.ts:84

**Returns:** *void*

___

###  trimParam

▸ **trimParam**(`param`: any): *any*

Defined in bpmnServer/node_modules/dmn-engine/DecisionTable.ts:129

**Parameters:**

Name | Type |
------ | ------ |
`param` | any |

**Returns:** *any*

## Object literals

### `Const` Behaviour_names

### ▪ **Behaviour_names**: *object*

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:14

###  CamundaFormData

• **CamundaFormData**: *string* = "camunda:formData"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:22

###  CamundaScript

• **CamundaScript**: *string* = "camunda:script"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:23

###  ErrorEventDefinition

• **ErrorEventDefinition**: *string* = "bpmn:ErrorEventDefinition"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:21

###  IOSpecification

• **IOSpecification**: *string* = "ioSpecification"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:17

###  LoopCharacteristics

• **LoopCharacteristics**: *string* = "loopCharacteristics"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:16

###  MessageEventDefinition

• **MessageEventDefinition**: *string* = "bpmn:MessageEventDefinition"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:19

###  SignalEventDefinition

• **SignalEventDefinition**: *string* = "bpmn:SignalEventDefinition"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:20

###  TerminateEventDefinition

• **TerminateEventDefinition**: *string* = "bpmn:TerminateEventDefinition"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:18

###  TimerEventDefinition

• **TimerEventDefinition**: *string* = "bpmn:TimerEventDefinition"

Defined in bpmnServer/src/elements/behaviours/BehaviourLoader.ts:15

___

### `Const` moddleOptions

### ▪ **moddleOptions**: *object*

Defined in bpmnServer/src/elements/js-bpmn-moddle.ts:1

###  name

• **name**: *string* = "Node bpmn-engine"

Defined in bpmnServer/src/elements/js-bpmn-moddle.ts:3

###  prefix

• **prefix**: *string* = "js"

Defined in bpmnServer/src/elements/js-bpmn-moddle.ts:5

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

Defined in bpmnServer/src/elements/js-bpmn-moddle.ts:9

###  uri

• **uri**: *string* = "http://paed01.github.io/bpmn-engine/schema/2017/08/bpmn"

Defined in bpmnServer/src/elements/js-bpmn-moddle.ts:4

▪ **xml**: *object*

Defined in bpmnServer/src/elements/js-bpmn-moddle.ts:6

* **tagAlias**: *string* = "lowerCase"
