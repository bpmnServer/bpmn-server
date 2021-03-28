[bpmn-server](README.md)

# bpmn-server

## Index

### Enumerations

* [BPMN_TYPE]()
* [EXECUTION_EVENT]()
* [EXECUTION_STATUS]()
* [EXPRESSION_TYPE]()
* [FLOW_ACTION]()
* [HIT_POLICY]()
* [ITEM_STATUS]()
* [NODE_ACTION]()
* [NODE_SUBTYPE]()
* [TOKEN_GROUP]()
* [TOKEN_STATUS]()
* [TOKEN_TYPE]()

### Classes

* [BPMNServer]()
* [Behaviour]()
* [BehaviourLoader]()
* [BoundaryEvent]()
* [BpmnModelData]()
* [BusinessRuleTask]()
* [CacheManager]()
* [CallActivity]()
* [CamundaFormData]()
* [CatchEvent]()
* [Condition]()
* [Configuration]()
* [Cron]()
* [CustomFuntions]()
* [DTOutput]()
* [DTVariable]()
* [DataQuery]()
* [DataStore]()
* [DecisionTable]()
* [DefaultAppDelegate]()
* [DefaultImplementor]()
* [Definition]()
* [Element]()
* [EndEvent]()
* [Engine]()
* [ErrorEventBehaviour]()
* [Event]()
* [EventBasedGateway]()
* [EventData]()
* [Execution]()
* [ExecutionContext]()
* [ExecutionResponse]()
* [Executor]()
* [Expression]()
* [ExpressionDate]()
* [ExpressionNode]()
* [ExpressionString]()
* [ExpressionTime]()
* [Flow]()
* [Gateway]()
* [IOBehaviour]()
* [InstanceObject]()
* [InstanceQuery]()
* [Item]()
* [ItemObject]()
* [ItemQuery]()
* [Logger]()
* [Loop]()
* [LoopBehaviour]()
* [LoopObject]()
* [MessageEventBehaviour]()
* [MessageFlow]()
* [ModelsDatastore]()
* [ModelsDatastoreDB]()
* [MongoDB]()
* [Node]()
* [NodeLoader]()
* [Operator]()
* [Options]()
* [Parser]()
* [Process]()
* [ProcessData]()
* [Query]()
* [ReceiveTask]()
* [Rule]()
* [RulesDelegate]()
* [ScriptBehaviour]()
* [ScriptTask]()
* [SendTask]()
* [ServerComponent]()
* [ServerHelper]()
* [ServiceTask]()
* [SignalEventBehaviour]()
* [StartEvent]()
* [SubProcess]()
* [TerminateBehaviour]()
* [ThrowEvent]()
* [TimerBehaviour]()
* [Token]()
* [TokenObject]()
* [TreeBuilder]()
* [TreeNode]()
* [UserTask]()
* [XORGateway]()

### Interfaces

* [IAppDelegate]()
* [IBPMNServer]()
* [IBehaviour]()
* [IBpmnModelData]()
* [IConfiguration]()
* [IDataStore]()
* [IDefinition]()
* [IElement]()
* [IEngine]()
* [IEventData]()
* [IExecution]()
* [IExecutionContext]()
* [IExecutionResponse]()
* [IFlow]()
* [IInstanceData]()
* [IItem]()
* [IItemData]()
* [ILogger]()
* [IModelsDatastore]()
* [INode]()
* [IProcessData]()
* [IServerComponent]()
* [IServerContext]()
* [IToken]()

### Variables

* [BINARY_OPERATORS]()
* [BpmnModdle]()
* [DefaultLogger]()
* [Definition_collection]()
* [Events_collection]()
* [FS]()
* [Instance_collection]()
* [MongoClient]()
* [MongoDb]()
* [OPERATORS]()
* [Path]()
* [REGEX]()
* [Server]()
* [assert]()
* [caseId]()
* [configPath]()
* [configuration]()
* [cwd]()
* [defaultConfiguration]()
* [definitionsPath]()
* [duration]()
* [end]()
* [fs]()
* [group1]()
* [group2]()
* [group3]()
* [group4]()
* [group5]()
* [logger]()
* [mongoose]()
* [operatorList]()
* [parse]()
* [seq]()
* [toSeconds]()
* [uuidv4]()

### Functions

* [Execute]()
* [Log]()
* [WebService]()
* [checkOnEnd]()
* [checkOnWait]()
* [dateDiff]()
* [debug]()
* [delay]()
* [getDueDate]()
* [getDueTimers]()
* [install]()
* [removeFromArray]()
* [test]()
* [trimParam]()

### Object literals

* [Behaviour_names]()
* [moddleOptions]()

## Enumerations

###  BPMN_TYPE

• **BPMN_TYPE**:

Defined in src/interfaces/Enums.ts:2

###  BoundaryEvent

• **BoundaryEvent**: = "bpmn:BoundaryEvent"

Defined in src/interfaces/Enums.ts:14

###  BusinessRuleTask

• **BusinessRuleTask**: = "bpmn:BusinessRuleTask"

Defined in src/interfaces/Enums.ts:8

###  CallActivity

• **CallActivity**: = "bpmn:CallActivity"

Defined in src/interfaces/Enums.ts:21

###  EndEvent

• **EndEvent**: = "bpmn:EndEvent"

Defined in src/interfaces/Enums.ts:18

###  EventBasedGateway

• **EventBasedGateway**: = "bpmn:EventBasedGateway"

Defined in src/interfaces/Enums.ts:11

###  ExclusiveGateway

• **ExclusiveGateway**: = "bpmn:ExclusiveGateway"

Defined in src/interfaces/Enums.ts:13

###  InclusiveGateway

• **InclusiveGateway**: = "bpmn:InclusiveGateway"

Defined in src/interfaces/Enums.ts:12

###  IntermediateCatchEvent

• **IntermediateCatchEvent**: = "bpmn:IntermediateCatchEvent"

Defined in src/interfaces/Enums.ts:16

###  IntermediateThrowEvent

• **IntermediateThrowEvent**: = "bpmn:IntermediateThrowEvent"

Defined in src/interfaces/Enums.ts:17

###  MessageFlow

• **MessageFlow**: = "bpmn:MessageFlow"

Defined in src/interfaces/Enums.ts:20

###  ParallelGateway

• **ParallelGateway**: = "bpmn:ParallelGateway"

Defined in src/interfaces/Enums.ts:10

###  ReceiveTask

• **ReceiveTask**: = "bpmn:ReceiveTask"

Defined in src/interfaces/Enums.ts:7

###  ScriptTask

• **ScriptTask**: = "bpmn:ScriptTask"

Defined in src/interfaces/Enums.ts:4

###  SendTask

• **SendTask**: = "bpmn:SendTask"

Defined in src/interfaces/Enums.ts:6

###  SequenceFlow

• **SequenceFlow**: = "bpmn:SequenceFlow"

Defined in src/interfaces/Enums.ts:19

###  ServiceTask

• **ServiceTask**: = "bpmn:ServiceTask"

Defined in src/interfaces/Enums.ts:5

###  StartEvent

• **StartEvent**: = "bpmn:StartEvent"

Defined in src/interfaces/Enums.ts:15

###  SubProcess

• **SubProcess**: = "bpmn:SubProces"

Defined in src/interfaces/Enums.ts:9

###  UserTask

• **UserTask**: = "bpmn:UserTask"

Defined in src/interfaces/Enums.ts:3

___

###  EXECUTION_EVENT

• **EXECUTION_EVENT**:

Defined in src/interfaces/Enums.ts:34

###  execution_end

• **execution_end**: = "execution.end"

Defined in src/interfaces/Enums.ts:42

###  execution_execute

• **execution_execute**: = "execution.execute"

Defined in src/interfaces/Enums.ts:38

###  execution_executed

• **execution_executed**: = "execution.executed"

Defined in src/interfaces/Enums.ts:38

###  execution_invoke

• **execution_invoke**: = "execution.invoke"

Defined in src/interfaces/Enums.ts:39

###  execution_invoked

• **execution_invoked**: = "execution.invoked"

Defined in src/interfaces/Enums.ts:39

###  execution_restored

• **execution_restored**: = "execution.restored"

Defined in src/interfaces/Enums.ts:40

###  execution_resumed

• **execution_resumed**: = "execution_resumed"

Defined in src/interfaces/Enums.ts:40

###  execution_terminated

• **execution_terminated**: = "executeion.terminate"

Defined in src/interfaces/Enums.ts:42

###  execution_wait

• **execution_wait**: = "execution.wait"

Defined in src/interfaces/Enums.ts:41

###  flow_discard

• **flow_discard**: = "discard"

Defined in src/interfaces/Enums.ts:37

###  flow_take

• **flow_take**: = "take"

Defined in src/interfaces/Enums.ts:37

###  node_end

• **node_end**: = "end"

Defined in src/interfaces/Enums.ts:35

###  node_enter

• **node_enter**: = "enter"

Defined in src/interfaces/Enums.ts:35

###  node_start

• **node_start**: = "start"

Defined in src/interfaces/Enums.ts:35

###  node_terminated

• **node_terminated**: = "terminated"

Defined in src/interfaces/Enums.ts:35

###  node_wait

• **node_wait**: = "wait"

Defined in src/interfaces/Enums.ts:35

###  token_end

• **token_end**: = "token.end"

Defined in src/interfaces/Enums.ts:43

###  token_start

• **token_start**: = "token.start"

Defined in src/interfaces/Enums.ts:43

###  token_terminated

• **token_terminated**: = "token.terminated"

Defined in src/interfaces/Enums.ts:43

###  token_wait

• **token_wait**: = "token.wait"

Defined in src/interfaces/Enums.ts:43

###  transform_input

• **transform_input**: = "transformInput"

Defined in src/interfaces/Enums.ts:36

###  transform_output

• **transform_output**: = "transformOutput"

Defined in src/interfaces/Enums.ts:36

___

###  EXECUTION_STATUS

• **EXECUTION_STATUS**:

Defined in src/interfaces/Enums.ts:55

###  end

• **end**: = "end"

Defined in src/interfaces/Enums.ts:55

###  running

• **running**: = "running"

Defined in src/interfaces/Enums.ts:55

###  terminated

• **terminated**: = "terminated"

Defined in src/interfaces/Enums.ts:55

###  wait

• **wait**: = "wait"

Defined in src/interfaces/Enums.ts:55

___

###  EXPRESSION_TYPE

• **EXPRESSION_TYPE**:

Defined in node_modules/dmn-engine/common.ts:16

###  AlwaysTrue

• **AlwaysTrue**: = "True"

Defined in node_modules/dmn-engine/common.ts:28

###  Binary

• **Binary**: = "Binary"

Defined in node_modules/dmn-engine/common.ts:22

###  Bracket

• **Bracket**: = "Bracket"

Defined in node_modules/dmn-engine/common.ts:24

###  Call

• **Call**: = "Call"

Defined in node_modules/dmn-engine/common.ts:26

###  Group

• **Group**: = "Group"

Defined in node_modules/dmn-engine/common.ts:25

###  Literal

• **Literal**: = "Literal"

Defined in node_modules/dmn-engine/common.ts:19

###  Number

• **Number**: = "Number"

Defined in node_modules/dmn-engine/common.ts:20

###  Operator

• **Operator**: = "Operator"

Defined in node_modules/dmn-engine/common.ts:23

###  Root

• **Root**: = "Root"

Defined in node_modules/dmn-engine/common.ts:17

###  Single

• **Single**: = "Single"

Defined in node_modules/dmn-engine/common.ts:18

###  Text

• **Text**: = "Text"

Defined in node_modules/dmn-engine/common.ts:21

###  Token

• **Token**: = ""

Defined in node_modules/dmn-engine/common.ts:27

___

###  FLOW_ACTION

• **FLOW_ACTION**:

Defined in src/interfaces/Enums.ts:63

###  discard

• **discard**: = "discard"

Defined in src/interfaces/Enums.ts:63

###  take

• **take**: = "take"

Defined in src/interfaces/Enums.ts:63

___

###  HIT_POLICY

• **HIT_POLICY**:

Defined in node_modules/dmn-engine/DecisionTable.ts:6

###  Any

• **Any**: = "Any"

Defined in node_modules/dmn-engine/DecisionTable.ts:8

###  Collect

• **Collect**: = "Collect+"

Defined in node_modules/dmn-engine/DecisionTable.ts:11

###  First

• **First**: = "First"

Defined in node_modules/dmn-engine/DecisionTable.ts:9

###  RuleOrder

• **RuleOrder**: = "Order"

Defined in node_modules/dmn-engine/DecisionTable.ts:10

###  Unique

• **Unique**: = "Unique"

Defined in node_modules/dmn-engine/DecisionTable.ts:7

___

###  ITEM_STATUS

• **ITEM_STATUS**:

Defined in src/interfaces/Enums.ts:51

###  discard

• **discard**: = "discard"

Defined in src/interfaces/Enums.ts:51

###  end

• **end**: = "end"

Defined in src/interfaces/Enums.ts:51

###  enter

• **enter**: = "enter"

Defined in src/interfaces/Enums.ts:51

###  start

• **start**: = "start"

Defined in src/interfaces/Enums.ts:51

###  terminated

• **terminated**: = "terminated"

Defined in src/interfaces/Enums.ts:51

###  wait

• **wait**: = "wait"

Defined in src/interfaces/Enums.ts:51

___

###  NODE_ACTION

• **NODE_ACTION**:

Defined in src/interfaces/Enums.ts:49

###  abort

• **abort**:

Defined in src/interfaces/Enums.ts:49

###  continue

• **continue**: = 1

Defined in src/interfaces/Enums.ts:49

###  end

• **end**:

Defined in src/interfaces/Enums.ts:49

###  error

• **error**:

Defined in src/interfaces/Enums.ts:49

###  stop

• **stop**:

Defined in src/interfaces/Enums.ts:49

###  wait

• **wait**:

Defined in src/interfaces/Enums.ts:49

___

###  NODE_SUBTYPE

• **NODE_SUBTYPE**:

Defined in src/interfaces/Enums.ts:24

###  error

• **error**: = "error"

Defined in src/interfaces/Enums.ts:28

###  escalation

• **escalation**: = "escalation"

Defined in src/interfaces/Enums.ts:29

###  message

• **message**: = "message"

Defined in src/interfaces/Enums.ts:26

###  signal

• **signal**: = "signal"

Defined in src/interfaces/Enums.ts:27

###  timer

• **timer**: = "timer"

Defined in src/interfaces/Enums.ts:25

___

###  TOKEN_GROUP

• **TOKEN_GROUP**:

Defined in node_modules/dmn-engine/common.ts:5

###  alpha

• **alpha**: = "alpha"

Defined in node_modules/dmn-engine/common.ts:6

###  number

• **number**: = "number"

Defined in node_modules/dmn-engine/common.ts:7

###  space

• **space**: = "space"

Defined in node_modules/dmn-engine/common.ts:9

###  symbol

• **symbol**: = "symbol"

Defined in node_modules/dmn-engine/common.ts:8

___

###  TOKEN_STATUS

• **TOKEN_STATUS**:

Defined in src/interfaces/Enums.ts:57

###  end

• **end**: = "end"

Defined in src/interfaces/Enums.ts:57

###  running

• **running**: = "running"

Defined in src/interfaces/Enums.ts:57

###  terminated

• **terminated**: = "terminated"

Defined in src/interfaces/Enums.ts:57

###  wait

• **wait**: = "wait"

Defined in src/interfaces/Enums.ts:57

___

###  TOKEN_TYPE

• **TOKEN_TYPE**:

Defined in src/engine/Token.ts:52

###  BoundaryEvent

• **BoundaryEvent**: = "BoundaryEvent"

Defined in src/engine/Token.ts:54

###  Diverge

• **Diverge**: = "Diverge"

Defined in src/engine/Token.ts:53

###  EventSubProcess

• **EventSubProcess**: = "EventSubProces"

Defined in src/engine/Token.ts:54

###  Instance

• **Instance**: = "Instance"

Defined in src/engine/Token.ts:53

###  Primary

• **Primary**: = "Primary"

Defined in src/engine/Token.ts:53

###  SubProcess

• **SubProcess**: = "SubProcess"

Defined in src/engine/Token.ts:53

## Classes

###  BPMNServer

• **BPMNServer**:

Defined in src/server/BPMNServer.ts:33

	The main class of Server Layer
	provides the full functionalities:

		1.	access to Execution engine
		2.	data Presistence through DataStore class
		3.	access to models definitions, loading and saving of models
		4.	access to BPMN definition details

		primary Use Cases:
		a.	execute a process
			server= new BPMNServer(...);
			server.execute(...);

		b.	invoke a task in an already started process
			server= new BPMNServer(...);
			server.invoke(...);

		c.	find items (various options)
			server= new BPMNServer(...);
			server.findItems(...);

###  constructor

\+ **new BPMNServer**(`configuration`: IConfiguration, `logger?`: ILogger, `options`: object): *BPMNServer*

Defined in src/server/BPMNServer.ts:42

Server Constructor

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`configuration` | IConfiguration | - | see |
`logger?` | ILogger | - |   |
`options` | object | {} | - |

**Returns:** *BPMNServer*

###  appDelegate

• **appDelegate**: *IAppDelegate*

*Implementation of void*

Defined in src/server/BPMNServer.ts:39

###  cache

• **cache**: *CacheManager*

*Implementation of void*

Defined in src/server/BPMNServer.ts:41

###  configuration

• **configuration**: *any*

*Implementation of void*

Defined in src/server/BPMNServer.ts:36

###  cron

• **cron**: *Cron*

*Implementation of void*

Defined in src/server/BPMNServer.ts:42

###  dataStore

• **dataStore**: *IDataStore*

*Implementation of void*

Defined in src/server/BPMNServer.ts:40

###  definitions

• **definitions**: *any*

*Implementation of void*

Defined in src/server/BPMNServer.ts:38

###  engine

• **engine**: *Engine*

*Implementation of void*

Defined in src/server/BPMNServer.ts:35

###  logger

• **logger**: *ILogger*

*Implementation of void*

Defined in src/server/BPMNServer.ts:37

### `Static` getVersion

▸ **getVersion**(): *any*

Defined in src/server/BPMNServer.ts:74

**Returns:** *any*

___

###  Behaviour

• **Behaviour**:

Defined in src/elements/behaviours/Behaviour.ts:37

###  constructor

\+ **new Behaviour**(`node`: Node, `definition`: any): *Behaviour*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *Behaviour*

###  definition

• **definition**: *any*

*Implementation of void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  node

• **node**: *Node*

*Implementation of void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  describe

▸ **describe**(): *any[]*

*Implementation of void*

Defined in src/elements/behaviours/Behaviour.ts:46

**Returns:** *any[]*

###  end

▸ **end**(`item`: Item): *void*

Defined in src/elements/behaviours/Behaviour.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

Defined in src/elements/behaviours/Behaviour.ts:47

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *void*

Defined in src/elements/behaviours/Behaviour.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  BehaviourLoader

• **BehaviourLoader**:

Defined in src/elements/behaviours/BehaviourLoader.ts:26

### `Static` behaviours

▪ **behaviours**: *(object | object)[]* = [
        {
            name: Behaviour_names.TimerEventDefinition, funct: function (node, def) {
                return new TimerBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.LoopCharacteristics, funct: function (node, def) {
                return new LoopBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaFormData, funct: function (node, def) {
                return new CamundaFormData(node, def);
            }
        },
        {
            name: Behaviour_names.IOSpecification, funct: function (node, def) {
                return new IOBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.MessageEventDefinition, funct: function (node, def) {
                return new MessageEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.SignalEventDefinition, funct: function (node, def) {
                return new SignalEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.ErrorEventDefinition, funct: function (node, def) {
                return new ErrorEventBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.CamundaScript, funct: function (node, def) {
                return new ScriptBehaviour(node, def);
            }
        },
        {
            name: Behaviour_names.TerminateEventDefinition, funct: function (node, def) {
                return new TerminateBehaviour(node, def);
            }
        }
    ]

Defined in src/elements/behaviours/BehaviourLoader.ts:27

### `Static` load

▸ **load**(`node`: Node): *void*

Defined in src/elements/behaviours/BehaviourLoader.ts:102

 1.  node.definition[<name>]
 2.  node.definition.eventDefinitions
         $type == <name>

         example:

<bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
<bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
</bpmn:timerEventDefinition>

 3.  node.definitions.extensionElements
         $type == <name>
         example: 'camunda:formData'
<extensionElements>
<camunda:formData >
<camunda: formField id = "surname" label = "Surname" type = "string" />
<camunda: formField id = "givenName" label = "Given name" type = "string" />
</camunda:formData>
< /extensionElements>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`node` | Node |   |

**Returns:** *void*

### `Static` register

▸ **register**(`name`: any, `funct`: any): *void*

Defined in src/elements/behaviours/BehaviourLoader.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`funct` | any |

**Returns:** *void*

___

###  BoundaryEvent

• **BoundaryEvent**:

Defined in src/elements/Events.ts:49

###  constructor

\+ **new BoundaryEvent**(`id`: any, `process`: any, `type`: any, `def`: any): *BoundaryEvent*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *BoundaryEvent*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Overrides void*

Defined in src/elements/Events.ts:56

###  isCatching

• **isCatching**:

*Overrides void*

Defined in src/elements/Events.ts:51

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Overrides void*

Defined in src/elements/Events.ts:53

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  hasMessage

▸ **hasMessage**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:7

**Returns:** *any*

###  hasSignal

▸ **hasSignal**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:10

**Returns:** *any*

###  hasTimer

▸ **hasTimer**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:13

**Returns:** *any*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Events.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  BpmnModelData

• **BpmnModelData**:

Defined in src/datastore/ModelsData.ts:11

###  constructor

\+ **new BpmnModelData**(`name`: any, `source`: any, `svg`: any, `processes`: any, `events`: any): *BpmnModelData*

Defined in src/datastore/ModelsData.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`source` | any |
`svg` | any |
`processes` | any |
`events` | any |

**Returns:** *BpmnModelData*

###  events

• **events**: *IEventData[]*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:16

###  name

• **name**: *any*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:12

###  processes

• **processes**: *IProcessData[]*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:15

###  saved

• **saved**: *any*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:17

###  source

• **source**: *any*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:13

###  svg

• **svg**: *any*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:14

###  parse

▸ **parse**(`definition`: Definition): *void*

Defined in src/datastore/ModelsData.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`definition` | Definition |

**Returns:** *void*

___

###  BusinessRuleTask

• **BusinessRuleTask**:

Defined in src/elements/Tasks.ts:68

###  constructor

\+ **new BusinessRuleTask**(`id`: any, `process`: any, `type`: any, `def`: any): *BusinessRuleTask*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *BusinessRuleTask*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: any): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Tasks.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  CacheManager

• **CacheManager**:

Defined in src/server/CacheManager.ts:10

###  constructor

\+ **new CacheManager**(`server`: IBPMNServer): *CacheManager*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | IBPMNServer |

**Returns:** *CacheManager*

###  server

• **server**: *any*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

### `Static` liveInstances

▪ **liveInstances**: *Map‹any, any›* = new Map()

Defined in src/server/CacheManager.ts:11

###  appDelegate

• **appDelegate**:

*Inherited from void*

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

*Inherited from void*

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

*Inherited from void*

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

*Inherited from void*

Defined in src/server/ServerContext.ts:17

###  dataStore

• **dataStore**:

*Inherited from void*

Defined in src/server/ServerContext.ts:15

###  definitions

• **definitions**:

*Inherited from void*

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

*Inherited from void*

Defined in src/server/ServerContext.ts:16

###  logger

• **logger**:

*Inherited from void*

Defined in src/server/ServerContext.ts:14

###  add

▸ **add**(`executionContext`: ExecutionContext): *void*

Defined in src/server/CacheManager.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`executionContext` | ExecutionContext |

**Returns:** *void*

###  getInstance

▸ **getInstance**(`instanceId`: any): *any*

Defined in src/server/CacheManager.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *any*

###  list

▸ **list**(): *any[]*

Defined in src/server/CacheManager.ts:13

**Returns:** *any[]*

###  remove

▸ **remove**(`instanceId`: any): *void*

Defined in src/server/CacheManager.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *void*

###  restart

▸ **restart**(): *Promise‹void›*

Defined in src/server/CacheManager.ts:50

**Returns:** *Promise‹void›*

###  shutdown

▸ **shutdown**(): *Promise‹void›*

Defined in src/server/CacheManager.ts:34

**Returns:** *Promise‹void›*

___

###  CallActivity

• **CallActivity**:

Defined in src/elements/Tasks.ts:148

<callActivity id="callCheckCreditProcess" name="Check credit" calledElement="checkCreditProcess" />

the called process need to call me back when done.

###  constructor

\+ **new CallActivity**(`id`: any, `process`: any, `type`: any, `def`: any): *CallActivity*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *CallActivity*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  calledElement

• **calledElement**:

Defined in src/elements/Tasks.ts:149

###  canBeInvoked

• **canBeInvoked**:

*Overrides void*

Defined in src/elements/Tasks.ts:154

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Overrides void*

Defined in src/elements/Tasks.ts:153

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: any): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Tasks.ts:163

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

### `Static` executionEnded

▸ **executionEnded**(`execution`: IExecution): *Promise‹void›*

Defined in src/elements/Tasks.ts:156

**Parameters:**

Name | Type |
------ | ------ |
`execution` | IExecution |

**Returns:** *Promise‹void›*

___

###  CamundaFormData

• **CamundaFormData**:

Defined in src/elements/behaviours/Form.ts:9

###  constructor

\+ **new CamundaFormData**(`node`: Node, `definition`: any): *CamundaFormData*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *CamundaFormData*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  fields

• **fields**: *any*

Defined in src/elements/behaviours/Form.ts:10

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Form.ts:18

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getFields

▸ **getFields**(): *any*

Defined in src/elements/behaviours/Form.ts:17

**Returns:** *any*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Form.ts:11

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  CatchEvent

• **CatchEvent**:

Defined in src/elements/Events.ts:34

###  constructor

\+ **new CatchEvent**(`id`: any, `process`: any, `type`: any, `def`: any): *CatchEvent*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *CatchEvent*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Overrides void*

Defined in src/elements/Events.ts:41

###  isCatching

• **isCatching**:

*Overrides void*

Defined in src/elements/Events.ts:36

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Overrides void*

Defined in src/elements/Events.ts:38

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  hasMessage

▸ **hasMessage**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:7

**Returns:** *any*

###  hasSignal

▸ **hasSignal**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:10

**Returns:** *any*

###  hasTimer

▸ **hasTimer**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:13

**Returns:** *any*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Events.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  Condition

• **Condition**:

Defined in node_modules/dmn-engine/ExpressionNode.ts:41

###  constructor

\+ **new Condition**(`script`: any, `variableName`: any): *Condition*

*Overrides void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`script` | any |
`variableName` | any |

**Returns:** *Condition*

###  rootNode

• **rootNode**: *ExpressionNode*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:8

###  script

• **script**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:7

###  variableName

• **variableName**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:43

###  isCondition

• **isCondition**:

*Overrides void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:42

###  compile

▸ **compile**(): *void*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:24

**Returns:** *void*

###  display

▸ **display**(): *void*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:31

**Returns:** *void*

###  evaluate

▸ **evaluate**(`data`: any): *any*

*Overrides void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:55

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *any*

###  getState

▸ **getState**(): *this*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:28

**Returns:** *this*

### `Static` compile

▸ **compile**(`script`: any, `variableName`: any): *Condition*

*Overrides void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`script` | any |
`variableName` | any |

**Returns:** *Condition*

### `Static` load

▸ **load**(`json`: any): *Expression*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`json` | any |

**Returns:** *Expression*

___

###  Configuration

• **Configuration**:

Defined in src/common/DefaultConfiguration.ts:10

###  constructor

\+ **new Configuration**(`__namedParameters`: object): *Configuration*

Defined in src/common/DefaultConfiguration.ts:23

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`appDelegate` | any |
`dataStore` | any |
`database` | any |
`definitions` | any |
`definitionsPath` | any |
`logger` | any |
`timers` | any |

**Returns:** *Configuration*

###  database

• **database**: *object*

*Implementation of void*

Defined in src/common/DefaultConfiguration.ts:13

#### Type declaration:

* **MongoDB**: *object*

###  definitionsPath

• **definitionsPath**: *string*

*Implementation of void*

Defined in src/common/DefaultConfiguration.ts:11

###  logger

• **logger**: *ILogger*

*Implementation of void*

Defined in src/common/DefaultConfiguration.ts:14

###  timers

• **timers**: *object*

*Implementation of void*

Defined in src/common/DefaultConfiguration.ts:12

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*

###  appDelegate

▸ **appDelegate**(`server`: any): *DefaultAppDelegate‹›*

*Implementation of void*

Defined in src/common/DefaultConfiguration.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *DefaultAppDelegate‹›*

###  dataStore

▸ **dataStore**(`server`: any): *DataStore‹›*

*Implementation of void*

Defined in src/common/DefaultConfiguration.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *DataStore‹›*

###  definitions

▸ **definitions**(`server`: any): *ModelsDatastoreDB‹›*

*Implementation of void*

Defined in src/common/DefaultConfiguration.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *ModelsDatastoreDB‹›*

___

###  Cron

• **Cron**:

Defined in src/server/Cron.ts:15

###  constructor

\+ **new Cron**(`server`: IBPMNServer): *Cron*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | IBPMNServer |

**Returns:** *Cron*

###  server

• **server**: *any*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

### `Static` `Private` checkingTimers

▪ **checkingTimers**: *boolean* = false

Defined in src/server/Cron.ts:18

### `Static` `Private` timersFired

▪ **timersFired**: *number* = 0

Defined in src/server/Cron.ts:19

### `Static` `Private` timersStarted

▪ **timersStarted**: *boolean* = false

Defined in src/server/Cron.ts:17

###  appDelegate

• **appDelegate**:

*Inherited from void*

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

*Inherited from void*

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

*Inherited from void*

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

*Inherited from void*

Defined in src/server/ServerContext.ts:17

###  dataStore

• **dataStore**:

*Inherited from void*

Defined in src/server/ServerContext.ts:15

###  definitions

• **definitions**:

*Inherited from void*

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

*Inherited from void*

Defined in src/server/ServerContext.ts:16

###  logger

• **logger**:

*Inherited from void*

Defined in src/server/ServerContext.ts:14

###  checkTimers

▸ **checkTimers**(`duration`: number): *Promise‹void›*

Defined in src/server/Cron.ts:28

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`duration` | number | 0 |

**Returns:** *Promise‹void›*

### `Private` itemTimerExpired

▸ **itemTimerExpired**(): *Promise‹void›*

Defined in src/server/Cron.ts:93

**Returns:** *Promise‹void›*

### `Private` processTimerExpired

▸ **processTimerExpired**(): *Promise‹void›*

Defined in src/server/Cron.ts:97

**Returns:** *Promise‹void›*

### `Private` scheduleItem

▸ **scheduleItem**(`entry`: any): *void*

Defined in src/server/Cron.ts:123

**Parameters:**

Name | Type |
------ | ------ |
`entry` | any |

**Returns:** *void*

### `Private` scheduleProcess

▸ **scheduleProcess**(`entry`: any): *void*

Defined in src/server/Cron.ts:110

**Parameters:**

Name | Type |
------ | ------ |
`entry` | any |

**Returns:** *void*

###  start

▸ **start**(): *Promise‹void›*

Defined in src/server/Cron.ts:31

**Returns:** *Promise‹void›*

###  startTimers

▸ **startTimers**(): *Promise‹void›*

Defined in src/server/Cron.ts:34

**Returns:** *Promise‹void›*

### `Static` checkCron

▸ **checkCron**(`expression`: any, `referenceDateTime`: any): *number*

Defined in src/server/Cron.ts:133

**Parameters:**

Name | Type |
------ | ------ |
`expression` | any |
`referenceDateTime` | any |

**Returns:** *number*

### `Static` timeDue

▸ **timeDue**(`expression`: any, `referenceDateTime`: any): *any*

Defined in src/server/Cron.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`expression` | any |
`referenceDateTime` | any |

**Returns:** *any*

### `Static` timerEnded

▸ **timerEnded**(`item`: any): *void*

Defined in src/server/Cron.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

### `Static` timerScheduled

▸ **timerScheduled**(`timeDue`: any): *void*

Defined in src/server/Cron.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`timeDue` | any |

**Returns:** *void*

___

###  CustomFuntions

• **CustomFuntions**:

Defined in node_modules/dmn-engine/RulesDelegate.ts:4

###  constructor

\+ **new CustomFuntions**(`data`: any): *CustomFuntions*

*Inherited from void*

*Overrides void*

Defined in node_modules/dmn-engine/Implementor.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *CustomFuntions*

###  Date

• **Date**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:13

###  Number

• **Number**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:16

###  String

• **String**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:15

###  Time

• **Time**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:14

###  fun

▸ **fun**(`params`: any, `value`: any, `isCondition`: any): *boolean*

Defined in node_modules/dmn-engine/RulesDelegate.ts:6

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |
`value` | any |
`isCondition` | any |

**Returns:** *boolean*

___

###  DTOutput

• **DTOutput**:

Defined in node_modules/dmn-engine/DecisionTable.ts:13

###  actions

• **actions**: *object*

Defined in node_modules/dmn-engine/DecisionTable.ts:17

#### Type declaration:

###  input

• **input**: *object*

Defined in node_modules/dmn-engine/DecisionTable.ts:14

#### Type declaration:

###  rules

• **rules**: *any[]* = []

Defined in node_modules/dmn-engine/DecisionTable.ts:15

###  successCount

• **successCount**: *number* = 0

Defined in node_modules/dmn-engine/DecisionTable.ts:16

___

###  DTVariable

• **DTVariable**:

Defined in node_modules/dmn-engine/DecisionTable.ts:20

###  name

• **name**: *any*

Defined in node_modules/dmn-engine/DecisionTable.ts:21

###  type

• **type**: *"String" | "Number" | "Money" | "Date"*

Defined in node_modules/dmn-engine/DecisionTable.ts:22

___

###  DataQuery

• **DataQuery**:

Defined in src/engine/Model.ts:68

###  constructor

\+ **new DataQuery**(`instance`: any, `item`: any): *DataQuery*

Defined in src/engine/Model.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`instance` | any |
`item` | any |

**Returns:** *DataQuery*

###  instance

• **instance**: *any*

Defined in src/engine/Model.ts:69

###  item

• **item**: *any*

Defined in src/engine/Model.ts:70

___

###  DataStore

• **DataStore**:

Defined in src/datastore/DataStore.ts:16

###  constructor

\+ **new DataStore**(`server`: IBPMNServer): *DataStore*

*Overrides void*

Defined in src/datastore/DataStore.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`server` | IBPMNServer |

**Returns:** *DataStore*

###  db

• **db**: *any*

*Implementation of void*

Defined in src/datastore/DataStore.ts:19

###  dbConfiguration

• **dbConfiguration**: *any*

*Implementation of void*

Defined in src/datastore/DataStore.ts:18

###  execution

• **execution**: *Execution*

*Implementation of void*

Defined in src/datastore/DataStore.ts:21

###  inSaving

• **inSaving**: *boolean* = false

Defined in src/datastore/DataStore.ts:24

###  isModified

• **isModified**: *boolean* = false

Defined in src/datastore/DataStore.ts:22

###  isRunning

• **isRunning**: *boolean* = false

Defined in src/datastore/DataStore.ts:23

###  promises

• **promises**: *any[]* = []

Defined in src/datastore/DataStore.ts:25

###  saveCounter

• **saveCounter**: *number* = 0

Defined in src/datastore/DataStore.ts:55

###  server

• **server**: *any*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

### `Static` seq

▪ **seq**: *number* = 0

Defined in src/datastore/DataStore.ts:143

###  appDelegate

• **appDelegate**:

*Inherited from void*

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

*Inherited from void*

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

*Inherited from void*

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

*Inherited from void*

Defined in src/server/ServerContext.ts:17

###  dataStore

• **dataStore**:

*Inherited from void*

Defined in src/server/ServerContext.ts:15

###  definitions

• **definitions**:

*Inherited from void*

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

*Inherited from void*

Defined in src/server/ServerContext.ts:16

###  logger

• **logger**:

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:14

###  check

▸ **check**(`event`: any, `item`: any): *Promise‹number›*

Defined in src/datastore/DataStore.ts:93

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |
`item` | any |

**Returns:** *Promise‹number›*

###  deleteInstances

▸ **deleteInstances**(`query`: any): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/DataStore.ts:359

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

###  findInstance

▸ **findInstance**(`query`: any, `options`: any): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/DataStore.ts:197

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`options` | any |

**Returns:** *Promise‹any›*

###  findInstances

▸ **findInstances**(`query`: any, `option`: "summary" | "full" | any): *Promise‹any›*

Defined in src/datastore/DataStore.ts:208

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | - |
`option` | "summary" &#124; "full" &#124; any | "summary" |

**Returns:** *Promise‹any›*

###  findItem

▸ **findItem**(`query`: any): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/DataStore.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

###  findItems

▸ **findItems**(`query`: any): *Promise‹any[]›*

*Implementation of void*

Defined in src/datastore/DataStore.ts:242

scenario:
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
message			{ items: { messageId: nameofmessage, key: value } {}
status			{ items: {status: 'wait' } }
custom: { query: query, projection: projection }

New approach:
just like MongoDB
itemId			{ items { id : value } }
itemKey			{ items {key: value } }
instance, task	{ instance: { id: instanceId }, items: { elementId: value }}
message			{ items: { messageId: nameofmessage, key: value } {}
status			{ items: {status: 'wait' } }
custom: { query: query, projection: projection }

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | any |   |

**Returns:** *Promise‹any[]›*

### `Private` getItemsFromInstances

▸ **getItemsFromInstances**(`instances`: any, `condition`: any): *any[]*

Defined in src/datastore/DataStore.ts:119

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`instances` | any | - |
`condition` | any | null |

**Returns:** *any[]*

###  install

▸ **install**(): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/DataStore.ts:372

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

###  loadInstance

▸ **loadInstance**(`instanceId`: any): *Promise‹object›*

*Implementation of void*

Defined in src/datastore/DataStore.ts:104

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *Promise‹object›*

###  monitorExecution

▸ **monitorExecution**(`execution`: Execution): *void*

Defined in src/datastore/DataStore.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`execution` | Execution |

**Returns:** *void*

###  save

▸ **save**(): *Promise‹void›*

*Implementation of void*

Defined in src/datastore/DataStore.ts:57

**Returns:** *Promise‹void›*

### `Private` saveInstance

▸ **saveInstance**(`instance`: any, `items`: any): *Promise‹void›*

Defined in src/datastore/DataStore.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`instance` | any |
`items` | any |

**Returns:** *Promise‹void›*

### `Private` setListener

▸ **setListener**(`listener`: any): *void*

Defined in src/datastore/DataStore.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`listener` | any |

**Returns:** *void*

### `Private` translateCriteria

▸ **translateCriteria**(`query`: any): *object*

Defined in src/datastore/DataStore.ts:254

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *object*

* **projection**: *object* = projection

* **query**: *any* = query

### `Private` translateCriteria2

▸ **translateCriteria2**(`criteria`: any): *object*

Defined in src/datastore/DataStore.ts:274

**Parameters:**

Name | Type |
------ | ------ |
`criteria` | any |

**Returns:** *object*

* **projection**: *any* = projection

* **query**: *any* = criteria.query

___

###  DecisionTable

• **DecisionTable**:

Defined in node_modules/dmn-engine/DecisionTable.ts:24

###  constructor

\+ **new DecisionTable**(`__namedParameters`: object): *DecisionTable*

Defined in node_modules/dmn-engine/DecisionTable.ts:37

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`actionVars` | any |
`conditionVars` | any |
`hitPolicy` | any |
`name` | any |
`rules` | any |

**Returns:** *DecisionTable*

###  actionVars

• **actionVars**: *DTVariable[]*

Defined in node_modules/dmn-engine/DecisionTable.ts:27

###  conditionVars

• **conditionVars**: *DTVariable[]*

Defined in node_modules/dmn-engine/DecisionTable.ts:26

###  hitPolicy

• **hitPolicy**: *HIT_POLICY*

Defined in node_modules/dmn-engine/DecisionTable.ts:29

###  name

• **name**: *any*

Defined in node_modules/dmn-engine/DecisionTable.ts:25

###  rules

• **rules**: *Rule[]*

Defined in node_modules/dmn-engine/DecisionTable.ts:28

###  asJson

▸ **asJson**(): *string*

Defined in node_modules/dmn-engine/DecisionTable.ts:143

**Returns:** *string*

###  compile

▸ **compile**(): *object*

Defined in node_modules/dmn-engine/DecisionTable.ts:68

**Returns:** *object*

* **rules**: *undefined[]* = []

###  evaluate

▸ **evaluate**(`data`: any): *any*

Defined in node_modules/dmn-engine/DecisionTable.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *any*

### `Private` processAll

▸ **processAll**(): *boolean*

Defined in node_modules/dmn-engine/DecisionTable.ts:30

**Returns:** *boolean*

### `Private` processResults

▸ **processResults**(`output`: any): *any*

Defined in node_modules/dmn-engine/DecisionTable.ts:102

**Parameters:**

Name | Type |
------ | ------ |
`output` | any |

**Returns:** *any*

###  save

▸ **save**(`fileName`: any): *void*

Defined in node_modules/dmn-engine/DecisionTable.ts:131

**Parameters:**

Name | Type |
------ | ------ |
`fileName` | any |

**Returns:** *void*

### `Static` execute

▸ **execute**(`dtDefinition`: any, `data`: any): *object*

Defined in node_modules/dmn-engine/DecisionTable.ts:60

Execute a DT on the fly, passing multiple records
used for WebAPI

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dtDefinition` | any | - |
`data` | any |   |

**Returns:** *object*

* **decisionTable**: *DecisionTable‹›* = dt

* **results**: *any[]* = response

### `Static` load

▸ **load**(`fileName`: any): *DecisionTable‹›*

Defined in node_modules/dmn-engine/DecisionTable.ts:135

**Parameters:**

Name | Type |
------ | ------ |
`fileName` | any |

**Returns:** *DecisionTable‹›*

___

###  DefaultAppDelegate

• **DefaultAppDelegate**:

Defined in src/engine/DefaultAppDelegate.ts:7

###  constructor

\+ **new DefaultAppDelegate**(`logger`: any): *DefaultAppDelegate*

Defined in src/engine/DefaultAppDelegate.ts:8

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`logger` | any | null |

**Returns:** *DefaultAppDelegate*

###  servicesProvider

• **servicesProvider**: *any*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:8

###  moddleOptions

• **moddleOptions**:

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:13

###  executionEvent

▸ **executionEvent**(`__namedParameters`: object): *Promise‹void›*

Defined in src/engine/DefaultAppDelegate.ts:23

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`event` | any |
`execution` | any |
`item` | any |

**Returns:** *Promise‹void›*

###  executionStarted

▸ **executionStarted**(`execution`: IExecutionContext): *Promise‹void›*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`execution` | IExecutionContext |

**Returns:** *Promise‹void›*

###  issueMessage

▸ **issueMessage**(`messageId`: any, `data`: any): *Promise‹void›*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:57

is called when an event throws a message that can not be answered by another process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | - |
`data` | any |   |

**Returns:** *Promise‹void›*

###  issueSignal

▸ **issueSignal**(`signalId`: any, `data`: any): *Promise‹void›*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |

**Returns:** *Promise‹void›*

###  messageThrown

▸ **messageThrown**(`messageId`: any, `data`: any, `messageMatchingKey`: any, `item`: Item): *Promise‹void›*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:38

 is called when a event throws a message

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | - |
`data` | any | - |
`messageMatchingKey` | any | - |
`item` | Item |   |

**Returns:** *Promise‹void›*

###  scopeEval

▸ **scopeEval**(`scope`: any, `script`: any): *any*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

###  scopeJS

▸ **scopeJS**(`scope`: any, `script`: any): *Promise‹any›*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *Promise‹any›*

###  serviceCalled

▸ **serviceCalled**(`serviceName`: any, `data`: any, `item`: Item): *Promise‹void›*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`serviceName` | any |
`data` | any |
`item` | Item |

**Returns:** *Promise‹void›*

###  signalThrown

▸ **signalThrown**(`signalId`: any, `data`: any, `messageMatchingKey`: any, `item`: Item): *Promise‹void›*

*Implementation of void*

Defined in src/engine/DefaultAppDelegate.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |
`messageMatchingKey` | any |
`item` | Item |

**Returns:** *Promise‹void›*

___

###  DefaultImplementor

• **DefaultImplementor**:

Defined in node_modules/dmn-engine/Implementor.ts:12

class structure
     DefaultImplementor
         CustomImplementor
             DataObject  <---    custom

###  constructor

\+ **new DefaultImplementor**(): *DefaultImplementor*

Defined in node_modules/dmn-engine/Implementor.ts:16

**Returns:** *DefaultImplementor*

###  Date

• **Date**: *any*

Defined in node_modules/dmn-engine/Implementor.ts:13

###  Number

• **Number**: *any*

Defined in node_modules/dmn-engine/Implementor.ts:16

###  String

• **String**: *any*

Defined in node_modules/dmn-engine/Implementor.ts:15

###  Time

• **Time**: *any*

Defined in node_modules/dmn-engine/Implementor.ts:14

___

###  Definition

• **Definition**:

Defined in src/elements/Definition.ts:20

###  constructor

\+ **new Definition**(`name`: string, `source`: string, `server`: BPMNServer): *Definition*

Defined in src/elements/Definition.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`source` | string |
`server` | BPMNServer |

**Returns:** *Definition*

###  flows

• **flows**: *any[]* = []

*Implementation of void*

Defined in src/elements/Definition.ts:25

###  logger

• **logger**: *any*

*Implementation of void*

Defined in src/elements/Definition.ts:27

###  moddle

• **moddle**: *any*

Defined in src/elements/Definition.ts:29

###  name

• **name**: *any*

*Implementation of void*

Defined in src/elements/Definition.ts:21

###  nodes

• **nodes**: *Map‹any, any›* = new Map()

*Implementation of void*

Defined in src/elements/Definition.ts:24

###  processes

• **processes**: *Map‹any, any›* = new Map()

*Implementation of void*

Defined in src/elements/Definition.ts:22

###  rootElements

• **rootElements**: *any*

*Implementation of void*

Defined in src/elements/Definition.ts:23

###  server

• **server**: *any*

Defined in src/elements/Definition.ts:28

###  source

• **source**: *any*

*Implementation of void*

Defined in src/elements/Definition.ts:26

###  getDefinition

▸ **getDefinition**(`source`: any, `logger`: any): *Promise‹any›*

Defined in src/elements/Definition.ts:206

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |
`logger` | any |

**Returns:** *Promise‹any›*

###  getFields

▸ **getFields**(`elementId`: any): *Promise‹any›*

Defined in src/elements/Definition.ts:213

**Parameters:**

Name | Type |
------ | ------ |
`elementId` | any |

**Returns:** *Promise‹any›*

###  getJson

▸ **getJson**(): *string*

*Implementation of void*

Defined in src/elements/Definition.ts:185

**Returns:** *string*

###  getNodeById

▸ **getNodeById**(`id`: any): *any*

*Implementation of void*

Defined in src/elements/Definition.ts:238

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *any*

###  getStartNode

▸ **getStartNode**(): *any*

*Implementation of void*

Defined in src/elements/Definition.ts:235

**Returns:** *any*

###  getStartNodes

▸ **getStartNodes**(`userInvokable`: boolean): *any[]*

Defined in src/elements/Definition.ts:224

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`userInvokable` | boolean | false |

**Returns:** *any[]*

###  load

▸ **load**(): *Promise‹any›*

*Implementation of void*

Defined in src/elements/Definition.ts:68

**Returns:** *Promise‹any›*

### `Private` loadProcess

▸ **loadProcess**(`definition`: any, `processElement`: any, `parentProcess`: any): *Process‹›*

Defined in src/elements/Definition.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`definition` | any |
`processElement` | any |
`parentProcess` | any |

**Returns:** *Process‹›*

___

###  Element

• **Element**:

Defined in src/elements/Element.ts:12

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

Defined in src/elements/Element.ts:17

###  id

• **id**: *any*

*Implementation of void*

Defined in src/elements/Element.ts:13

###  isFlow

• **isFlow**: *boolean* = false

Defined in src/elements/Element.ts:18

###  name

• **name**: *any*

*Implementation of void*

Defined in src/elements/Element.ts:16

###  subType

• **subType**: *any*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

Defined in src/elements/Element.ts:14

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *void*

Defined in src/elements/Element.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  restored

▸ **restored**(`item`: Item): *void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

Defined in src/elements/Element.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  EndEvent

• **EndEvent**:

Defined in src/elements/Events.ts:82

###  constructor

\+ **new EndEvent**(`id`: any, `process`: any, `type`: any, `def`: any): *EndEvent*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *EndEvent*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:30

###  isCatching

• **isCatching**:

*Overrides void*

Defined in src/elements/Events.ts:84

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Overrides void*

Defined in src/elements/Events.ts:85

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  hasMessage

▸ **hasMessage**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:7

**Returns:** *any*

###  hasSignal

▸ **hasSignal**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:10

**Returns:** *any*

###  hasTimer

▸ **hasTimer**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:13

**Returns:** *any*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:22

	using token: check if fromEventBasedGateway;	if yes cancel all other events

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  Engine

• **Engine**:

Defined in src/server/Engine.ts:9

###  constructor

\+ **new Engine**(`server`: IBPMNServer): *Engine*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | IBPMNServer |

**Returns:** *Engine*

###  server

• **server**: *any*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

###  appDelegate

• **appDelegate**:

*Inherited from void*

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

*Inherited from void*

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

*Inherited from void*

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

*Inherited from void*

Defined in src/server/ServerContext.ts:17

###  dataStore

• **dataStore**:

*Inherited from void*

Defined in src/server/ServerContext.ts:15

###  definitions

• **definitions**:

*Inherited from void*

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

*Inherited from void*

Defined in src/server/ServerContext.ts:16

###  logger

• **logger**:

*Inherited from void*

Defined in src/server/ServerContext.ts:14

### `Private` error

▸ **error**(`exc`: any, `executionContext`: any): *any*

Defined in src/server/Engine.ts:281

**Parameters:**

Name | Type |
------ | ------ |
`exc` | any |
`executionContext` | any |

**Returns:** *any*

###  get

▸ **get**(`instanceQuery`: any, `listener`: EventEmitter): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:82

restores an instance into memeory or provides you access to a running instance

this will also resume execution

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`instanceQuery` | any | - | criteria to fetch the instance  query example:	{ id: instanceId} 					{ data: {caseId: 1005}} 					{ items.item.id : 'abcc111322'} 					{ items.item.itemKey : 'businesskey here'}   |
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹ExecutionContext›*

###  invoke

▸ **invoke**(`itemQuery`: any, `data`: object, `listener`: EventEmitter): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:134

Continue an existing item that is in a wait state

-------------------------------------------------
scenario:
		itemId			{itemId: value }
		itemKey			{itemKey: value}
		instance,task	{instanceId: instanceId, elementId: value }

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`itemQuery` | any | - | criteria to retrieve the item |
`data` | object | {} |   |
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹ExecutionContext›*

###  invokeItem

▸ **invokeItem**(`itemQuery`: any, `data`: object, `listener`: EventEmitter): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:118

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`itemQuery` | any | - |
`data` | object | {} |
`listener` | EventEmitter | null |

**Returns:** *Promise‹ExecutionContext›*

###  restore

▸ **restore**(`instanceQuery`: any, `listener`: EventEmitter): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:87

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`instanceQuery` | any | - |
`listener` | EventEmitter | null |

**Returns:** *Promise‹ExecutionContext›*

###  start

▸ **start**(`name`: any, `data`: any, `listener`: EventEmitter, `startNodeId`: string, `options`: object): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:18

	loads a definitions  and start execution

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`name` | any | - | name of the process to start |
`data` | any | {} | input data |
`listener` | EventEmitter | null | - |
`startNodeId` | string | null | in process has multiple start node; you need to specify which one  |
`options` | object | {} | - |

**Returns:** *Promise‹ExecutionContext›*

###  startEvent

▸ **startEvent**(`instanceId`: any, `elementId`: any, `data`: object, `listener`: EventEmitter): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:184

Invoking an event (usually start event of a secondary process) against an existing instance
or
Invoking a start event (of a secondary process) against an existing instance
----------------------------------------------------------------------------
	 instance,task
```
	{instanceId: instanceId, elementId: value }
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`instanceId` | any | - | - |
`elementId` | any | - | - |
`data` | object | {} |   |
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹ExecutionContext›*

###  throwMessage

▸ **throwMessage**(`messageId`: any, `data`: object, `matchingQuery`: object, `listener`: EventEmitter): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:208

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`messageId` | any | - |
`data` | object | {} |
`matchingQuery` | object | {} |
`listener` | EventEmitter | null |

**Returns:** *Promise‹ExecutionContext›*

###  throwSignal

▸ **throwSignal**(`messageId`: any, `data`: object, `matchingQuery`: object, `listener`: EventEmitter): *Promise‹ExecutionContext›*

Defined in src/server/Engine.ts:250

signal/message raise a signal or throw a message

will seach for a matching event/task given the signalId/messageId

that can be againt a running instance or it may start a new instance
----------------------------------------------------------------------------

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`messageId` | any | - | the id of the message or signal as per bpmn definition |
`data` | object | {} | message data  |
`matchingQuery` | object | {} | should match the itemKey (if specified) |
`listener` | EventEmitter | null | - |

**Returns:** *Promise‹ExecutionContext›*

___

###  ErrorEventBehaviour

• **ErrorEventBehaviour**:

Defined in src/elements/behaviours/Error.ts:9

###  constructor

\+ **new ErrorEventBehaviour**(`node`: Node, `definition`: any): *ErrorEventBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *ErrorEventBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  errorId

• **errorId**:

Defined in src/elements/behaviours/Error.ts:32

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Error.ts:36

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Error.ts:10

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *Promise‹wait | error›*

*Overrides void*

Defined in src/elements/behaviours/Error.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹wait | error›*

___

###  Event

• **Event**:

Defined in src/elements/Events.ts:5

###  constructor

\+ **new Event**(`id`: any, `process`: any, `type`: any, `def`: any): *Event*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *Event*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Overrides void*

Defined in src/elements/Events.ts:30

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Overrides void*

Defined in src/elements/Events.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  hasMessage

▸ **hasMessage**(): *any*

Defined in src/elements/Events.ts:7

**Returns:** *any*

###  hasSignal

▸ **hasSignal**(): *any*

Defined in src/elements/Events.ts:10

**Returns:** *any*

###  hasTimer

▸ **hasTimer**(): *any*

Defined in src/elements/Events.ts:13

**Returns:** *any*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Events.ts:22

	using token: check if fromEventBasedGateway;	if yes cancel all other events

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  EventBasedGateway

• **EventBasedGateway**:

Defined in src/elements/Gateway.ts:209

trick here is once one event is met all others must be cancelled

How will I know?
     when one of my events is fired shoudl I subscribe to the event or get directly notified?

###  constructor

\+ **new EventBasedGateway**(`id`: any, `process`: any, `type`: any, `def`: any): *EventBasedGateway*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *EventBasedGateway*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  listener

• **listener**: *any*

Defined in src/elements/Gateway.ts:211

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  working

• **working**: *boolean* = false

Defined in src/elements/Gateway.ts:210

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  cancelAllBranched

▸ **cancelAllBranched**(`endingItem`: Item): *Promise‹void›*

Defined in src/elements/Gateway.ts:221

**Parameters:**

Name | Type |
------ | ------ |
`endingItem` | Item |

**Returns:** *Promise‹void›*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  convergeFlows

▸ **convergeFlows**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Gateway.ts:125

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  findActiveFlows

▸ **findActiveFlows**(`token`: Token): *object*

*Inherited from void*

Defined in src/elements/Gateway.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`token` | Token |

**Returns:** *object*

* **pendingTokens**: *any[]*

* **waitingTokens**: *any[]*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

*Overrides void*

Defined in src/elements/Gateway.ts:34

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/Gateway.ts:213

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Gateway.ts:217

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Gateway.ts:158

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

###  startMonitor

▸ **startMonitor**(`item`: any): *void*

Defined in src/elements/Gateway.ts:241

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

___

###  EventData

• **EventData**:

Defined in src/interfaces/datastore.ts:62

Defined in src/datastore/ModelsData.ts:81

###  elementId

• **elementId**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:63

Defined in src/datastore/ModelsData.ts:82

###  expression

• **expression**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:71

Defined in src/datastore/ModelsData.ts:90

###  expressionFormat

• **expressionFormat**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:72

Defined in src/datastore/ModelsData.ts:91

###  maxRepeat

• **maxRepeat**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:74

Defined in src/datastore/ModelsData.ts:93

###  messageId

• **messageId**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:69

Defined in src/datastore/ModelsData.ts:88

###  name

• **name**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:66

Defined in src/datastore/ModelsData.ts:85

###  processId

• **processId**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:67

Defined in src/datastore/ModelsData.ts:86

###  referenceDateTime

• **referenceDateTime**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:73

Defined in src/datastore/ModelsData.ts:92

###  repeatCount

• **repeatCount**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:75

Defined in src/datastore/ModelsData.ts:94

###  signalId

• **signalId**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:68

Defined in src/datastore/ModelsData.ts:87

###  subType

• **subType**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:65

Defined in src/datastore/ModelsData.ts:84

### `Optional` timeDue

• **timeDue**? : *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:76

Defined in src/datastore/ModelsData.ts:95

###  type

• **type**: *any*

*Implementation of void*

Defined in src/interfaces/datastore.ts:64

Defined in src/datastore/ModelsData.ts:83

___

###  Execution

• **Execution**:

Defined in src/engine/Execution.ts:23

 is accessed two ways:
     execute - start process
     signal  - invoke a node (userTask, event, etc.)

###  constructor

\+ **new Execution**(`name`: string, `source`: any, `executionContext`: ExecutionContext): *Execution*

Defined in src/engine/Execution.ts:42

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | process name |
`source` | any | bpmn source |
`executionContext` | ExecutionContext |   |

**Returns:** *Execution*

###  appDelegate

• **appDelegate**: *IAppDelegate*

*Implementation of void*

Defined in src/engine/Execution.ts:32

###  data

• **data**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:35

###  definition

• **definition**: *IDefinition*

*Implementation of void*

Defined in src/engine/Execution.ts:31

###  endedAt

• **endedAt**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:27

###  executionContext

• **executionContext**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:40

###  id

• **id**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:24

###  listener

• **listener**: *EventEmitter*

*Implementation of void*

Defined in src/engine/Execution.ts:39

###  logger

• **logger**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:34

###  logs

• **logs**: *any[]* = []

*Implementation of void*

Defined in src/engine/Execution.ts:36

###  name

• **name**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:25

###  parentItemId

• **parentItemId**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:37

###  promises

• **promises**: *any[]* = []

*Implementation of void*

Defined in src/engine/Execution.ts:42

###  saved

• **saved**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:28

###  source

• **source**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:33

###  startedAt

• **startedAt**: *any*

*Implementation of void*

Defined in src/engine/Execution.ts:26

###  status

• **status**: *EXECUTION_STATUS*

*Implementation of void*

Defined in src/engine/Execution.ts:29

###  tokens

• **tokens**: *Map‹any, any›* = new Map()

*Implementation of void*

Defined in src/engine/Execution.ts:30

###  uids

• **uids**: *object*

*Implementation of void*

Defined in src/engine/Execution.ts:368

#### Type declaration:

###  applyInput

▸ **applyInput**(`inputData`: any, `dataPath`: any): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:401

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`inputData` | any | - |
`dataPath` | any | null |

**Returns:** *void*

###  doExecutionEvent

▸ **doExecutionEvent**(`event`: any): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Execution.ts:383

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *Promise‹void›*

###  doItemEvent

▸ **doItemEvent**(`item`: any, `event`: any): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Execution.ts:388

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`event` | any |

**Returns:** *Promise‹void›*

###  end

▸ **end**(): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Execution.ts:81

**Returns:** *Promise‹void›*

###  execute

▸ **execute**(`startNodeId`: any, `inputData`: object, `options`: object): *Promise‹void›*

Defined in src/engine/Execution.ts:111

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`startNodeId` | any | null |
`inputData` | object | {} |
`options` | object | {} |

**Returns:** *Promise‹void›*

###  getAndCreateData

▸ **getAndCreateData**(`dataPath`: any, `asArray`: boolean): *any*

*Implementation of void*

Defined in src/engine/Execution.ts:443

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dataPath` | any | - |
`asArray` | boolean | false |

**Returns:** *any*

###  getData

▸ **getData**(`dataPath`: any): *any*

*Implementation of void*

Defined in src/engine/Execution.ts:430

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |

**Returns:** *any*

###  getItems

▸ **getItems**(`query`: any): *Item[]*

*Implementation of void*

Defined in src/engine/Execution.ts:224

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | null |

**Returns:** *Item[]*

###  getItemsData

▸ **getItemsData**(): *any[]*

*Implementation of void*

Defined in src/engine/Execution.ts:235

**Returns:** *any[]*

###  getNewId

▸ **getNewId**(`scope`: string): *number*

*Implementation of void*

Defined in src/engine/Execution.ts:369

**Parameters:**

Name | Type |
------ | ------ |
`scope` | string |

**Returns:** *number*

###  getNodeById

▸ **getNodeById**(`id`: any): *Node‹›*

*Implementation of void*

Defined in src/engine/Execution.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *Node‹›*

###  getState

▸ **getState**(): *IInstanceData*

*Implementation of void*

Defined in src/engine/Execution.ts:245

**Returns:** *IInstanceData*

###  getToken

▸ **getToken**(`id`: number): *Token*

*Implementation of void*

Defined in src/engine/Execution.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`id` | number |

**Returns:** *Token*

###  getUUID

▸ **getUUID**(): *any*

*Implementation of void*

Defined in src/engine/Execution.ts:376

**Returns:** *any*

###  log

▸ **log**(`msg`: any): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:393

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

###  report

▸ **report**(): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:344

**Returns:** *void*

###  restored

▸ **restored**(): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:331

**Returns:** *void*

###  resume

▸ **resume**(): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:338

**Returns:** *void*

###  signal

▸ **signal**(`executionId`: any, `inputData`: any): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Execution.ts:165

invoke scenarios:
     itemId
     elementId   - but only one is active
     elementId   - for a startEvent in a secondary process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`executionId` | any | - |
`inputData` | any |    |

**Returns:** *Promise‹void›*

###  stop

▸ **stop**(): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:104

causes the execution to stop from running any further

**Returns:** *void*

###  terminate

▸ **terminate**(): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:94

causes the execution to stop from running any further

**Returns:** *void*

###  tokenEnded

▸ **tokenEnded**(`token`: Token): *void*

*Implementation of void*

Defined in src/engine/Execution.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`token` | Token |

**Returns:** *void*

### `Static` restore

▸ **restore**(`state`: IInstanceData, `executionContext`: any): *Promise‹Execution›*

Defined in src/engine/Execution.ts:266

**Parameters:**

Name | Type |
------ | ------ |
`state` | IInstanceData |
`executionContext` | any |

**Returns:** *Promise‹Execution›*

___

###  ExecutionContext

• **ExecutionContext**:

Defined in src/server/ServerContext.ts:30

Defined in node_modules/dmn-engine/Implementor.ts:23

###  constructor

\+ **new ExecutionContext**(`server`: IBPMNServer, `parentContext`: IExecutionContext): *ExecutionContext*

*Overrides void*

Defined in src/server/ServerContext.ts:58

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`server` | IBPMNServer | - |
`parentContext` | IExecutionContext | null |

**Returns:** *ExecutionContext*

###  Date

• **Date**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:13

###  Number

• **Number**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:16

###  String

• **String**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:15

###  Time

• **Time**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/Implementor.ts:14

###  dataStore

• **dataStore**: *any*

*Implementation of void*

*Overrides void*

Defined in src/server/ServerContext.ts:34

###  errors

• **errors**: *any*

*Implementation of void*

Defined in src/server/ServerContext.ts:35

### `Optional` execution

• **execution**? : *IExecution*

*Implementation of void*

Defined in src/server/ServerContext.ts:31

###  item

• **item**: *any*

*Implementation of void*

Defined in src/server/ServerContext.ts:39

###  listener

• **listener**: *any*

*Implementation of void*

Defined in src/server/ServerContext.ts:33

###  logger

• **logger**: *any*

*Implementation of void*

*Overrides void*

Defined in src/server/ServerContext.ts:32

### `Optional` parentContext

• **parentContext**? : *IExecutionContext*

*Implementation of void*

Defined in src/server/ServerContext.ts:37

###  process

• **process**: *any*

*Implementation of void*

Defined in src/server/ServerContext.ts:38

###  response

• **response**: *any*

*Implementation of void*

Defined in src/server/ServerContext.ts:40

###  server

• **server**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

###  worker

• **worker**: *any*

*Implementation of void*

Defined in src/server/ServerContext.ts:46

###  appDelegate

• **appDelegate**:

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:17

###  definitions

• **definitions**:

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

*Implementation of void*

*Inherited from void*

Defined in src/server/ServerContext.ts:16

###  instance

• **instance**:

*Implementation of void*

Defined in src/server/ServerContext.ts:55

###  items

• **items**:

*Implementation of void*

Defined in src/server/ServerContext.ts:65

###  error

▸ **error**(`error`: any): *IExecutionContext*

*Implementation of void*

Defined in src/server/ServerContext.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *IExecutionContext*

###  tillDone

▸ **tillDone**(): *Promise‹this›*

*Implementation of void*

Defined in src/server/ServerContext.ts:48

**Returns:** *Promise‹this›*

___

###  ExecutionResponse

• **ExecutionResponse**:

Defined in src/server/ServerContext.ts:23

###  action

• **action**: *any*

Defined in src/server/ServerContext.ts:26

###  input

• **input**: *any*

Defined in src/server/ServerContext.ts:24

###  messageMatchingKey

• **messageMatchingKey**: *any*

Defined in src/server/ServerContext.ts:27

###  output

• **output**: *any*

Defined in src/server/ServerContext.ts:25

___

###  Executor

• **Executor**:

Defined in node_modules/dmn-engine/Executor.ts:7

###  constructor

\+ **new Executor**(`data`: any): *Executor*

Defined in node_modules/dmn-engine/Executor.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Executor*

###  context

• **context**: *any*

Defined in node_modules/dmn-engine/Executor.ts:9

###  delegate

• **delegate**: *any*

Defined in node_modules/dmn-engine/Executor.ts:8

###  forCondition

• **forCondition**: *any*

Defined in node_modules/dmn-engine/Executor.ts:10

###  value

• **value**: *any*

Defined in node_modules/dmn-engine/Executor.ts:11

###  evaluate

▸ **evaluate**(`expr`: ExpressionNode): *any*

Defined in node_modules/dmn-engine/Executor.ts:78

**Parameters:**

Name | Type |
------ | ------ |
`expr` | ExpressionNode |

**Returns:** *any*

###  evaluateCondition

▸ **evaluateCondition**(`expr`: ExpressionNode, `value`: any, `isCondition`: boolean): *any*

Defined in node_modules/dmn-engine/Executor.ts:58

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`expr` | ExpressionNode | - |
`value` | any | - |
`isCondition` | boolean | true |

**Returns:** *any*

###  getNamedVariable

▸ **getNamedVariable**(`object`: any, `name`: any): *any*

Defined in node_modules/dmn-engine/Executor.ts:146

**Parameters:**

Name | Type |
------ | ------ |
`object` | any |
`name` | any |

**Returns:** *any*

###  getParameterValues

▸ **getParameterValues**(`expr`: any): *any[]*

Defined in node_modules/dmn-engine/Executor.ts:22

values from bracket (1,2,3)

**Parameters:**

Name | Type |
------ | ------ |
`expr` | any |

**Returns:** *any[]*

###  getValue

▸ **getValue**(`child`: any): *any*

Defined in node_modules/dmn-engine/Executor.ts:34

values could be children nodes or group

**Parameters:**

Name | Type |
------ | ------ |
`child` | any |

**Returns:** *any*

###  getValues

▸ **getValues**(`expr`: any): *any[]*

Defined in node_modules/dmn-engine/Executor.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`expr` | any |

**Returns:** *any[]*

___

###  Expression

• **Expression**:

Defined in node_modules/dmn-engine/ExpressionNode.ts:6

###  constructor

\+ **new Expression**(`script`: any): *Expression*

Defined in node_modules/dmn-engine/ExpressionNode.ts:8

**Parameters:**

Name | Type |
------ | ------ |
`script` | any |

**Returns:** *Expression*

###  rootNode

• **rootNode**: *ExpressionNode*

Defined in node_modules/dmn-engine/ExpressionNode.ts:8

###  script

• **script**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:7

###  isCondition

• **isCondition**:

Defined in node_modules/dmn-engine/ExpressionNode.ts:12

###  compile

▸ **compile**(): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:24

**Returns:** *void*

###  display

▸ **display**(): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:31

**Returns:** *void*

###  evaluate

▸ **evaluate**(`data`: any): *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *any*

###  getState

▸ **getState**(): *this*

Defined in node_modules/dmn-engine/ExpressionNode.ts:28

**Returns:** *this*

### `Static` compile

▸ **compile**(`script`: any, `variableName`: string): *Expression*

Defined in node_modules/dmn-engine/ExpressionNode.ts:14

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`script` | any | - |
`variableName` | string | "" |

**Returns:** *Expression*

### `Static` load

▸ **load**(`json`: any): *Expression*

Defined in node_modules/dmn-engine/ExpressionNode.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`json` | any |

**Returns:** *Expression*

___

###  ExpressionDate

• **ExpressionDate**:

Defined in node_modules/dmn-engine/Implementor.ts:33

###  now

▸ **now**(): *Date*

Defined in node_modules/dmn-engine/Implementor.ts:34

**Returns:** *Date*

___

###  ExpressionNode

• **ExpressionNode**:

Defined in node_modules/dmn-engine/ExpressionNode.ts:142

###  constructor

\+ **new ExpressionNode**(`type`: any, `parent`: any, `value`: any, `position`: any): *ExpressionNode*

*Overrides void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:149

**Parameters:**

Name | Type |
------ | ------ |
`type` | any |
`parent` | any |
`value` | any |
`position` | any |

**Returns:** *ExpressionNode*

###  children

• **children**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:65

###  id

• **id**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:147

###  parent

• **parent**: *any*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:64

###  position

• **position**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:146

###  result

• **result**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:145

###  type

• **type**: *EXPRESSION_TYPE*

Defined in node_modules/dmn-engine/ExpressionNode.ts:143

###  value

• **value**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:144

### `Static` id

▪ **id**: *number* = 0

Defined in node_modules/dmn-engine/ExpressionNode.ts:149

###  addChild

▸ **addChild**(`node`: any): *void*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *void*

###  delete

▸ **delete**(): *void*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:121

**Returns:** *void*

###  displayExpression

▸ **displayExpression**(`level`: number): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:170

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`level` | number | 0 |

**Returns:** *void*

###  first

▸ **first**(`withinParent`: boolean): *void*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:83

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withinParent` | boolean | false |

**Returns:** *void*

###  getState

▸ **getState**(): *object*

Defined in node_modules/dmn-engine/ExpressionNode.ts:165

**Returns:** *object*

* **children**: *any[]*

* **type**: *EXPRESSION_TYPE* = this.type

* **value**: *any* = this.value

###  loop

▸ **loop**(`funct`: any, `level`: number): *void*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:103

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`funct` | any | - |
`level` | number | 0 |

**Returns:** *void*

###  loopUp

▸ **loopUp**(`funct`: any, `level`: number): *void*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:111

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`funct` | any | - |
`level` | number | 0 |

**Returns:** *void*

###  move

▸ **move**(`newParent`: any): *any*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:124

**Parameters:**

Name | Type |
------ | ------ |
`newParent` | any |

**Returns:** *any*

###  next

▸ **next**(`withinParent`: boolean): *any*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:85

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withinParent` | boolean | false |

**Returns:** *any*

###  previous

▸ **previous**(`withinParent`: boolean): *any*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:93

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withinParent` | boolean | false |

**Returns:** *any*

###  root

▸ **root**(): *any*

*Inherited from void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:77

**Returns:** *any*

### `Static` NewFromToken

▸ **NewFromToken**(`token`: any, `parent`: any, `type`: any): *ExpressionNode*

Defined in node_modules/dmn-engine/ExpressionNode.ts:158

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`token` | any | - |
`parent` | any | - |
`type` | any | null |

**Returns:** *ExpressionNode*

### `Static` calcTypeFromToken

▸ **calcTypeFromToken**(`token`: any): *Literal | Number | Text | Binary | Operator*

Defined in node_modules/dmn-engine/ExpressionNode.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`token` | any |

**Returns:** *Literal | Number | Text | Binary | Operator*

___

###  ExpressionString

• **ExpressionString**:

Defined in node_modules/dmn-engine/Implementor.ts:38

###  add

▸ **add**(`values`: any): *any*

Defined in node_modules/dmn-engine/Implementor.ts:47

example:
 String.add('Hello,',' World!')   -> returns 'Hello, World!'

**Parameters:**

Name | Type |
------ | ------ |
`values` | any |

**Returns:** *any*

###  contains

▸ **contains**(`str1`: any, `check`: any): *any*

Defined in node_modules/dmn-engine/Implementor.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`str1` | any |
`check` | any |

**Returns:** *any*

###  endsWith

▸ **endsWith**(`str`: any, `check`: any): *any*

Defined in node_modules/dmn-engine/Implementor.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`str` | any |
`check` | any |

**Returns:** *any*

###  size

▸ **size**(`values`: any): *any*

Defined in node_modules/dmn-engine/Implementor.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`values` | any |

**Returns:** *any*

###  startsWith

▸ **startsWith**(`str`: any, `check`: any): *any*

Defined in node_modules/dmn-engine/Implementor.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`str` | any |
`check` | any |

**Returns:** *any*

###  substr

▸ **substr**(`values`: any): *any*

Defined in node_modules/dmn-engine/Implementor.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`values` | any |

**Returns:** *any*

___

###  ExpressionTime

• **ExpressionTime**:

Defined in node_modules/dmn-engine/Implementor.ts:36

___

###  Flow

• **Flow**:

Defined in src/elements/Flow.ts:10

###  constructor

\+ **new Flow**(`id`: any, `type`: any, `from`: any, `to`: any, `def`: any): *Flow*

Defined in src/elements/Flow.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`type` | any |
`from` | any |
`to` | any |
`def` | any |

**Returns:** *Flow*

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

Defined in src/elements/Flow.ts:13

###  from

• **from**: *Node*

Defined in src/elements/Flow.ts:11

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  isMessageFlow

• **isMessageFlow**: *boolean* = false

Defined in src/elements/Flow.ts:14

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:16

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  to

• **to**: *Node*

Defined in src/elements/Flow.ts:12

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  describe

▸ **describe**(): *any[][]*

*Implementation of void*

*Overrides void*

Defined in src/elements/Flow.ts:25

**Returns:** *any[][]*

###  execute

▸ **execute**(`item`: any): *Promise‹void›*

Defined in src/elements/Flow.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹void›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *FLOW_ACTION*

Defined in src/elements/Flow.ts:42

<Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
 otherwise, flow will be discarded.
</Rule>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *FLOW_ACTION*

___

###  Gateway

• **Gateway**:

Defined in src/elements/Gateway.ts:26

###  constructor

\+ **new Gateway**(`id`: any, `process`: any, `type`: any, `def`: any): *Gateway*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *Gateway*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  convergeFlows

▸ **convergeFlows**(`item`: Item): *void*

Defined in src/elements/Gateway.ts:125

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  findActiveFlows

▸ **findActiveFlows**(`token`: Token): *object*

Defined in src/elements/Gateway.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`token` | Token |

**Returns:** *object*

* **pendingTokens**: *any[]*

* **waitingTokens**: *any[]*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Overrides void*

Defined in src/elements/Gateway.ts:34

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Gateway.ts:158

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  IOBehaviour

• **IOBehaviour**:

Defined in src/elements/behaviours/IOBehaviour.ts:11

###  constructor

\+ **new IOBehaviour**(`node`: Node, `definition`: any): *IOBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *IOBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/IOBehaviour.ts:17

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/IOBehaviour.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:47

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/IOBehaviour.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  InstanceObject

• **InstanceObject**:

Defined in src/engine/Model.ts:8

as stored in MongoDB

###  data

• **data**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:15

###  endedAt

• **endedAt**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:13

###  id

• **id**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:9

###  items

• **items**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:16

###  logs

• **logs**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:18

###  loops

• **loops**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:20

###  name

• **name**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:10

###  parentItemId

• **parentItemId**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:21

###  saved

• **saved**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:14

###  source

• **source**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:17

###  startedAt

• **startedAt**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:12

###  status

• **status**: *EXECUTION_STATUS*

*Implementation of void*

Defined in src/engine/Model.ts:11

###  tokens

• **tokens**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:19

___

###  InstanceQuery

• **InstanceQuery**:

Defined in src/engine/Model.ts:153

###  constructor

\+ **new InstanceQuery**(`__namedParameters`: object): *InstanceQuery*

Defined in src/engine/Model.ts:164

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`data` | any | null |
`endedAt` | any | null |
`id` | any | null |
`items` | ItemQuery‹› | new ItemQuery() |
`name` | any | null |
`saved` | any | null |
`startedAt` | any | null |
`status` | EXECUTION_STATUS | null |

**Returns:** *InstanceQuery*

###  _data

• **_data**: *any*

Defined in src/engine/Model.ts:161

###  _endedAt

• **_endedAt**: *any*

Defined in src/engine/Model.ts:159

###  _id

• **_id**: *any*

Defined in src/engine/Model.ts:155

###  _name

• **_name**: *any*

Defined in src/engine/Model.ts:156

###  _parentNodeId

• **_parentNodeId**: *any*

Defined in src/engine/Model.ts:164

###  _saved

• **_saved**: *any*

Defined in src/engine/Model.ts:160

###  _source

• **_source**: *any*

Defined in src/engine/Model.ts:163

###  _startedAt

• **_startedAt**: *any*

Defined in src/engine/Model.ts:158

###  _status

• **_status**: *EXECUTION_STATUS*

Defined in src/engine/Model.ts:157

###  items

• **items**: *ItemQuery* = new ItemQuery()

Defined in src/engine/Model.ts:162

###  id

▸ **id**(`val`: any): *InstanceQuery*

Defined in src/engine/Model.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *InstanceQuery*

###  name

▸ **name**(`val`: any): *InstanceQuery*

Defined in src/engine/Model.ts:181

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *InstanceQuery*

___

###  Item

• **Item**:

Defined in src/engine/Item.ts:7

###  constructor

\+ **new Item**(`element`: any, `token`: any, `status`: ITEM_STATUS): *Item*

Defined in src/engine/Item.ts:54

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`element` | any | - |
`token` | any | - |
`status` | ITEM_STATUS | ITEM_STATUS.start |

**Returns:** *Item*

###  _dbAction

• **_dbAction**: *"add" | "update" | null* = null

Defined in src/engine/Item.ts:54

###  _endedAt

• **_endedAt**: *any* = null

Defined in src/engine/Item.ts:14

###  _status

• **_status**: *ITEM_STATUS*

Defined in src/engine/Item.ts:23

###  element

• **element**: *Element*

*Implementation of void*

Defined in src/engine/Item.ts:10

###  id

• **id**: *any*

*Implementation of void*

Defined in src/engine/Item.ts:8

###  itemKey

• **itemKey**: *string*

*Implementation of void*

Defined in src/engine/Item.ts:9

###  messageId

• **messageId**: *any*

*Implementation of void*

Defined in src/engine/Item.ts:51

###  seq

• **seq**: *any*

*Implementation of void*

Defined in src/engine/Item.ts:12

###  signalId

• **signalId**: *any*

*Implementation of void*

Defined in src/engine/Item.ts:52

###  startedAt

• **startedAt**: *any*

*Implementation of void*

Defined in src/engine/Item.ts:13

###  timeDue

• **timeDue**: *Date*

*Implementation of void*

Defined in src/engine/Item.ts:50

###  token

• **token**: *Token*

*Implementation of void*

Defined in src/engine/Item.ts:11

###  context

• **context**:

*Implementation of void*

Defined in src/engine/Item.ts:35

###  data

• **data**:

*Implementation of void*

Defined in src/engine/Item.ts:33

Defined in src/engine/Item.ts:34

###  elementId

• **elementId**:

*Implementation of void*

Defined in src/engine/Item.ts:36

###  endedAt

• **endedAt**:

*Implementation of void*

Defined in src/engine/Item.ts:15

Defined in src/engine/Item.ts:18

###  name

• **name**:

*Implementation of void*

Defined in src/engine/Item.ts:37

###  node

• **node**:

*Implementation of void*

Defined in src/engine/Item.ts:46

###  status

• **status**:

*Implementation of void*

Defined in src/engine/Item.ts:24

Defined in src/engine/Item.ts:27

###  tokenId

• **tokenId**:

*Implementation of void*

Defined in src/engine/Item.ts:40

###  type

• **type**:

*Implementation of void*

Defined in src/engine/Item.ts:43

###  log

▸ **log**(`msg`: any): *void*

Defined in src/engine/Item.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

###  save

▸ **save**(): *IItemData*

Defined in src/engine/Item.ts:64

**Returns:** *IItemData*

### `Static` load

▸ **load**(`execution`: Execution, `dataObject`: IItemData, `token`: any): *Item‹›*

Defined in src/engine/Item.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`execution` | Execution |
`dataObject` | IItemData |
`token` | any |

**Returns:** *Item‹›*

___

###  ItemObject

• **ItemObject**:

Defined in src/engine/Model.ts:26

 as stroed in MongoDB

###  data

• **data**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:44

###  elementId

• **elementId**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:37

###  endedAt

• **endedAt**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:34

###  id

• **id**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:27

###  instanceId

• **instanceId**: *any*

Defined in src/engine/Model.ts:41

 retrieved from findObjects

###  itemKey

• **itemKey**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:29

###  messageId

• **messageId**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:45

###  name

• **name**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:30

###  processName

• **processName**: *any*

Defined in src/engine/Model.ts:42

###  seq

• **seq**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:28

###  signalId

• **signalId**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:46

###  startedAt

• **startedAt**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:33

###  status

• **status**: *ITEM_STATUS*

*Implementation of void*

Defined in src/engine/Model.ts:32

###  timeDue

• **timeDue**: *Date*

*Implementation of void*

Defined in src/engine/Model.ts:43

###  tokenId

• **tokenId**: *any*

*Implementation of void*

Defined in src/engine/Model.ts:36

###  type

• **type**: *BPMN_TYPE*

*Implementation of void*

Defined in src/engine/Model.ts:31

___

###  ItemQuery

• **ItemQuery**:

Defined in src/engine/Model.ts:183

###  constructor

\+ **new ItemQuery**(`__namedParameters`: object): *ItemQuery*

Defined in src/engine/Model.ts:193

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`elementId` | any | null |
`endedAt` | any | null |
`id` | any | null |
`itemKey` | any | null |
`name` | any | null |
`seq` | any | null |
`startedAt` | any | null |
`status` | ITEM_STATUS | null |
`tokenId` | any | null |
`type` | BPMN_TYPE | null |

**Returns:** *ItemQuery*

###  _elementId

• **_elementId**: *any*

Defined in src/engine/Model.ts:193

###  _endedAt

• **_endedAt**: *any*

Defined in src/engine/Model.ts:191

###  _id

• **_id**: *any*

Defined in src/engine/Model.ts:184

###  _itemKey

• **_itemKey**: *any*

Defined in src/engine/Model.ts:186

###  _name

• **_name**: *any*

Defined in src/engine/Model.ts:187

###  _seq

• **_seq**: *any*

Defined in src/engine/Model.ts:185

###  _startedAt

• **_startedAt**: *any*

Defined in src/engine/Model.ts:190

###  _status

• **_status**: *ITEM_STATUS*

Defined in src/engine/Model.ts:189

###  _tokenId

• **_tokenId**: *any*

Defined in src/engine/Model.ts:192

###  _type

• **_type**: *BPMN_TYPE*

Defined in src/engine/Model.ts:188

###  id

▸ **id**(`val`: any): *this*

Defined in src/engine/Model.ts:218

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*

###  name

▸ **name**(`val`: any): *this*

Defined in src/engine/Model.ts:219

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*

###  status

▸ **status**(`val`: any): *this*

Defined in src/engine/Model.ts:220

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*

___

###  Logger

• **Logger**:

Defined in src/common/Logger.ts:7

Defined in node_modules/dmn-engine/common.ts:60

###  constructor

\+ **new Logger**(`__namedParameters`: object): *Logger*

Defined in src/common/Logger.ts:12

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Default |
------ | ------ | ------ |
`callback` | any | null |
`toConsole` | boolean | true |
`toFile` | string | "" |

**Returns:** *Logger*

###  callback

• **callback**: *any* = null

Defined in src/common/Logger.ts:12

Defined in node_modules/dmn-engine/common.ts:65

###  debugMsgs

• **debugMsgs**: *any[]* = []

Defined in src/common/Logger.ts:9

Defined in node_modules/dmn-engine/common.ts:62

###  toConsole

• **toConsole**: *boolean* = true

Defined in src/common/Logger.ts:10

Defined in node_modules/dmn-engine/common.ts:63

###  toFile

• **toFile**: *any* = null

Defined in src/common/Logger.ts:11

Defined in node_modules/dmn-engine/common.ts:64

###  clear

▸ **clear**(): *void*

*Implementation of void*

Defined in src/common/Logger.ts:31

**Returns:** *void*

###  debug

▸ **debug**(`message`: any): *void*

*Implementation of void*

Defined in src/common/Logger.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

###  error

▸ **error**(`err`: any): *void*

*Implementation of void*

Defined in src/common/Logger.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`err` | any |

**Returns:** *void*

###  get

▸ **get**(): *any[]*

*Implementation of void*

Defined in src/common/Logger.ts:35

**Returns:** *any[]*

###  log

▸ **log**(`message`: any): *void*

*Implementation of void*

Defined in src/common/Logger.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

###  msg

▸ **msg**(`message`: any, `type`: string): *void*

Defined in src/common/Logger.ts:23

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`message` | any | - |
`type` | string | "log" |

**Returns:** *void*

###  save

▸ **save**(`filename`: any): *Promise‹void›*

*Implementation of void*

Defined in src/common/Logger.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`filename` | any |

**Returns:** *Promise‹void›*

###  setOptions

▸ **setOptions**(`__namedParameters`: object): *void*

Defined in src/common/Logger.ts:17

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`callback` | any |
`toConsole` | any |
`toFile` | any |

**Returns:** *void*

###  warn

▸ **warn**(`message`: any): *void*

*Implementation of void*

Defined in src/common/Logger.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  Loop

• **Loop**:

Defined in src/engine/Loop.ts:6

###  constructor

\+ **new Loop**(`node`: Node, `token`: Token, `dataObject?`: any): *Loop*

Defined in src/engine/Loop.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`token` | Token |
`dataObject?` | any |

**Returns:** *Loop*

###  completed

• **completed**: *any*

Defined in src/engine/Loop.ts:14

###  dataPath

• **dataPath**: *any*

Defined in src/engine/Loop.ts:12

###  definition

• **definition**: *LoopBehaviour*

Defined in src/engine/Loop.ts:10

###  id

• **id**: *any*

Defined in src/engine/Loop.ts:7

###  items

• **items**: *any[]*

Defined in src/engine/Loop.ts:13

###  node

• **node**: *any*

Defined in src/engine/Loop.ts:8

###  ownerToken

• **ownerToken**: *any*

Defined in src/engine/Loop.ts:9

###  sequence

• **sequence**: *any*

Defined in src/engine/Loop.ts:11

###  getKeyName

▸ **getKeyName**(): *string*

Defined in src/engine/Loop.ts:57

**Returns:** *string*

###  getNext

▸ **getNext**(): *any*

Defined in src/engine/Loop.ts:63

**Returns:** *any*

###  isDone

▸ **isDone**(): *boolean*

Defined in src/engine/Loop.ts:60

**Returns:** *boolean*

###  isSequential

▸ **isSequential**(): *any*

Defined in src/engine/Loop.ts:15

**Returns:** *any*

###  save

▸ **save**(): *object*

Defined in src/engine/Loop.ts:40

**Returns:** *object*

* **completed**: *any* = this.completed

* **dataPath**: *any* = this.dataPath

* **id**: *any* = this.id

* **nodeId**: *any* = this.node.id

* **ownerTokenId**: *any* = this.ownerToken.id

* **sequence**: *any* = this.sequence

### `Static` checkNext

▸ **checkNext**(`token`: Token): *Promise‹boolean›*

Defined in src/engine/Loop.ts:110

**Parameters:**

Name | Type |
------ | ------ |
`token` | Token |

**Returns:** *Promise‹boolean›*

### `Static` checkStart

▸ **checkStart**(`token`: any): *Promise‹boolean›*

Defined in src/engine/Loop.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`token` | any |

**Returns:** *Promise‹boolean›*

### `Static` load

▸ **load**(`execution`: any, `dataObject`: any): *Loop*

Defined in src/engine/Loop.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`execution` | any |
`dataObject` | any |

**Returns:** *Loop*

___

###  LoopBehaviour

• **LoopBehaviour**:

Defined in src/elements/behaviours/Loop.ts:5

###  constructor

\+ **new LoopBehaviour**(`node`: Node, `definition`: any): *LoopBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *LoopBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  collection

• **collection**:

Defined in src/elements/behaviours/Loop.ts:9

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Loop.ts:19

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Loop.ts:6

**Returns:** *void*

###  isSequential

▸ **isSequential**(): *any*

Defined in src/elements/behaviours/Loop.ts:16

**Returns:** *any*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:48

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  LoopObject

• **LoopObject**:

Defined in src/engine/Model.ts:59

###  dataPath

• **dataPath**: *any*

Defined in src/engine/Model.ts:62

###  nodeId

• **nodeId**: *any*

Defined in src/engine/Model.ts:60

###  ownerTokenId

• **ownerTokenId**: *any*

Defined in src/engine/Model.ts:61

###  sequence

• **sequence**: *any*

Defined in src/engine/Model.ts:63

___

###  MessageEventBehaviour

• **MessageEventBehaviour**:

Defined in src/elements/behaviours/MessageSignal.ts:16

it is part of the following:

 events
 sendTask
 receiveTask

###  constructor

\+ **new MessageEventBehaviour**(`node`: Node, `definition`: any): *MessageEventBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *MessageEventBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  messageId

• **messageId**:

Defined in src/elements/behaviours/MessageSignal.ts:38

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:42

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:17

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *Promise‹void›*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

___

###  MessageFlow

• **MessageFlow**:

Defined in src/elements/Flow.ts:70

<Rule>MessageFlow: can only be sent to active node in waiting
or to a start event
</Rule>

###  constructor

\+ **new MessageFlow**(`id`: any, `type`: any, `from`: any, `to`: any, `def`: any): *MessageFlow*

*Inherited from void*

Defined in src/elements/Flow.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`type` | any |
`from` | any |
`to` | any |
`def` | any |

**Returns:** *MessageFlow*

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Flow.ts:13

###  from

• **from**: *Node*

*Inherited from void*

Defined in src/elements/Flow.ts:11

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  isMessageFlow

• **isMessageFlow**: *boolean* = true

*Overrides void*

Defined in src/elements/Flow.ts:71

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:16

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  to

• **to**: *Node*

*Inherited from void*

Defined in src/elements/Flow.ts:12

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  describe

▸ **describe**(): *any[][]*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Flow.ts:25

**Returns:** *any[][]*

###  execute

▸ **execute**(`item`: Item): *Promise‹void›*

*Overrides void*

Defined in src/elements/Flow.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *FLOW_ACTION*

*Inherited from void*

Defined in src/elements/Flow.ts:42

<Rule> if flow has a condition, it must be evaluated and if result is true flow will continue
 otherwise, flow will be discarded.
</Rule>

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *FLOW_ACTION*

___

###  ModelsDatastore

• **ModelsDatastore**:

Defined in src/datastore/ModelsDatastore.ts:14

###  constructor

\+ **new ModelsDatastore**(`server`: BPMNServer): *ModelsDatastore*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`server` | BPMNServer |

**Returns:** *ModelsDatastore*

###  db

• **db**: *any*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:18

###  dbConfiguration

• **dbConfiguration**: *any*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:17

###  definitionsPath

• **definitionsPath**: *any*

Defined in src/datastore/ModelsDatastore.ts:16

###  server

• **server**: *any*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

###  appDelegate

• **appDelegate**:

*Inherited from void*

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

*Inherited from void*

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

*Inherited from void*

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

*Inherited from void*

Defined in src/server/ServerContext.ts:17

###  dataStore

• **dataStore**:

*Inherited from void*

Defined in src/server/ServerContext.ts:15

###  definitions

• **definitions**:

*Inherited from void*

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

*Inherited from void*

Defined in src/server/ServerContext.ts:16

###  logger

• **logger**:

*Inherited from void*

Defined in src/server/ServerContext.ts:14

###  deleteModel

▸ **deleteModel**(`name`: any): *Promise‹void›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:98

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

###  export

▸ **export**(`name`: any, `folderPath`: any): *Promise‹void›*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:205

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`folderPath` | any |

**Returns:** *Promise‹void›*

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹IEventData[]›*

*Implementation of void*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹IEventData[]›*

### `Private` getFile

▸ **getFile**(`name`: any, `type`: any): *any*

Defined in src/datastore/ModelsDatastore.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`type` | any |

**Returns:** *any*

###  getList

▸ **getList**(): *Promise‹string[]›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:28

**Returns:** *Promise‹string[]›*

### `Private` getPath

▸ **getPath**(`name`: any, `type`: any): *string*

Defined in src/datastore/ModelsDatastore.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`type` | any |

**Returns:** *string*

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹string›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

###  getSource

▸ **getSource**(`name`: any): *Promise‹string›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:77

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

###  import

▸ **import**(`data`: any): *Promise‹any›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

###  install

▸ **install**(): *Promise‹any›*

*Implementation of void*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:127

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

###  load

▸ **load**(`name`: any): *Promise‹Definition›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹Definition›*

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹BpmnModelData›*

*Implementation of void*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹BpmnModelData›*

###  rebuild

▸ **rebuild**(`model`: any): *Promise‹void›*

Defined in src/datastore/ModelsDatastore.ts:126

reconstruct the models database from files

use when modifying the files manually or importing new environment

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`model` | any | null |

**Returns:** *Promise‹void›*

### `Private` rebuildModel

▸ **rebuildModel**(`name`: any): *Promise‹void›*

Defined in src/datastore/ModelsDatastore.ts:161

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:108

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`newName` | any |

**Returns:** *Promise‹boolean›*

###  save

▸ **save**(`name`: any, `bpmn`: any, `svg?`: any): *Promise‹boolean›*

*Implementation of void*

*Overrides void*

Defined in src/datastore/ModelsDatastore.ts:86

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`bpmn` | any |
`svg?` | any |

**Returns:** *Promise‹boolean›*

### `Private` saveFile

▸ **saveFile**(`name`: any, `type`: any, `data`: any): *void*

Defined in src/datastore/ModelsDatastore.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`type` | any |
`data` | any |

**Returns:** *void*

###  saveModel

▸ **saveModel**(`model`: IBpmnModelData): *Promise‹boolean›*

*Implementation of void*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:162

**Parameters:**

Name | Type |
------ | ------ |
`model` | IBpmnModelData |

**Returns:** *Promise‹boolean›*

###  updateTimer

▸ **updateTimer**(`name`: any): *Promise‹boolean›*

*Inherited from void*

Defined in src/datastore/ModelsDatastoreDB.ts:136

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹boolean›*

___

###  ModelsDatastoreDB

• **ModelsDatastoreDB**:

Defined in src/datastore/ModelsDatastoreDB.ts:16

###  constructor

\+ **new ModelsDatastoreDB**(`server`: BPMNServer): *ModelsDatastoreDB*

*Overrides void*

Defined in src/datastore/ModelsDatastoreDB.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`server` | BPMNServer |

**Returns:** *ModelsDatastoreDB*

###  db

• **db**: *any*

Defined in src/datastore/ModelsDatastoreDB.ts:18

###  dbConfiguration

• **dbConfiguration**: *any*

Defined in src/datastore/ModelsDatastoreDB.ts:17

###  server

• **server**: *any*

*Inherited from void*

Defined in src/server/ServerContext.ts:9

###  appDelegate

• **appDelegate**:

*Inherited from void*

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

*Inherited from void*

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

*Inherited from void*

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

*Inherited from void*

Defined in src/server/ServerContext.ts:17

###  dataStore

• **dataStore**:

*Inherited from void*

Defined in src/server/ServerContext.ts:15

###  definitions

• **definitions**:

*Inherited from void*

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

*Inherited from void*

Defined in src/server/ServerContext.ts:16

###  logger

• **logger**:

*Inherited from void*

Defined in src/server/ServerContext.ts:14

###  deleteModel

▸ **deleteModel**(`name`: any): *Promise‹void›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:182

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

###  export

▸ **export**(`name`: any, `folderPath`: any): *Promise‹void›*

Defined in src/datastore/ModelsDatastoreDB.ts:205

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`folderPath` | any |

**Returns:** *Promise‹void›*

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹IEventData[]›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹IEventData[]›*

###  getList

▸ **getList**(): *Promise‹string[]›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:27

**Returns:** *Promise‹string[]›*

### `Private` getProjection

▸ **getProjection**(`query`: any): *object*

Defined in src/datastore/ModelsDatastoreDB.ts:101

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *object*

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹any›*

###  getSource

▸ **getSource**(`name`: any): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:47

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹any›*

###  import

▸ **import**(`data`: any): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:130

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

###  install

▸ **install**(): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:127

first time installation of DB

creates a new collection and add an index

**Returns:** *Promise‹any›*

###  load

▸ **load**(`name`: any): *Promise‹Definition›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹Definition›*

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹BpmnModelData›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹BpmnModelData›*

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`newName` | any |

**Returns:** *Promise‹boolean›*

###  save

▸ **save**(`name`: any, `source`: any, `svg`: any): *Promise‹any›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:71

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`source` | any |
`svg` | any |

**Returns:** *Promise‹any›*

###  saveModel

▸ **saveModel**(`model`: IBpmnModelData): *Promise‹boolean›*

*Implementation of void*

Defined in src/datastore/ModelsDatastoreDB.ts:162

**Parameters:**

Name | Type |
------ | ------ |
`model` | IBpmnModelData |

**Returns:** *Promise‹boolean›*

###  updateTimer

▸ **updateTimer**(`name`: any): *Promise‹boolean›*

Defined in src/datastore/ModelsDatastoreDB.ts:136

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹boolean›*

___

### `Const` MongoDB

• **MongoDB**: *any* = require('./MongoDB').MongoDB

Defined in src/datastore/DataStore.ts:9

Defined in src/datastore/ModelsData.ts:8

Defined in src/datastore/MongoDB.ts:18

Defined in src/datastore/ModelsDatastoreDB.ts:10

###  constructor

\+ **new MongoDB**(`dbConfig`: any, `logger`: any): *MongoDB*

Defined in src/datastore/MongoDB.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`dbConfig` | any |
`logger` | any |

**Returns:** *MongoDB*

###  client

• **client**: *any*

Defined in src/datastore/MongoDB.ts:19

###  dbConfig

• **dbConfig**: *any*

Defined in src/datastore/MongoDB.ts:20

###  logger

• **logger**: *any*

Defined in src/datastore/MongoDB.ts:21

###  connect

▸ **connect**(): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:208

**Returns:** *Promise‹unknown›*

###  createIndex

▸ **createIndex**(`dbName`: any, `collName`: any, `index`: any, `unique`: object): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:59

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`index` | any | - |
`unique` | object | {} |

**Returns:** *Promise‹unknown›*

###  find

▸ **find**(`dbName`: any, `collName`: any, `qry`: any, `projection`: any): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:33

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`qry` | any | - |
`projection` | any | null |

**Returns:** *Promise‹unknown›*

###  getClient

▸ **getClient**(): *Promise‹any›*

Defined in src/datastore/MongoDB.ts:26

**Returns:** *Promise‹any›*

###  insert

▸ **insert**(`dbName`: any, `collName`: any, `docs`: any): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | any |
`collName` | any |
`docs` | any |

**Returns:** *Promise‹unknown›*

###  remove

▸ **remove**(`dbName`: any, `collName`: any, `query`: any): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | any |
`collName` | any |
`query` | any |

**Returns:** *Promise‹unknown›*

###  removeById

▸ **removeById**(`dbName`: any, `collName`: any, `id`: any): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`dbName` | any |
`collName` | any |
`id` | any |

**Returns:** *Promise‹unknown›*

###  update

▸ **update**(`dbName`: any, `collName`: any, `query`: any, `updateObject`: any, `options`: object): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:107

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`query` | any | - |
`updateObject` | any | - |
`options` | object | {} |

**Returns:** *Promise‹unknown›*

###  update2

▸ **update2**(`dbName`: any, `collName`: any, `query`: any, `updateObject`: any, `options`: object): *Promise‹unknown›*

Defined in src/datastore/MongoDB.ts:129

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`dbName` | any | - |
`collName` | any | - |
`query` | any | - |
`updateObject` | any | - |
`options` | object | {} |

**Returns:** *Promise‹unknown›*

___

###  Node

• **Node**:

Defined in src/elements/Node.ts:10

###  constructor

\+ **new Node**(`id`: any, `process`: any, `type`: any, `def`: any): *Node*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *Node*

###  attachedTo

• **attachedTo**: *Node*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

Defined in src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  NodeLoader

• **NodeLoader**:

Defined in src/elements/NodeLoader.ts:11

### `Static` loadNode

▸ **loadNode**(`el`: any, `process`: any): *Node*

Defined in src/elements/NodeLoader.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`el` | any |
`process` | any |

**Returns:** *Node*

___

###  Operator

• **Operator**:

Defined in node_modules/dmn-engine/Operator.ts:147

 operator definition

     name:
     precedence value

     leftOperands
     rightOperands
     conditionOperandPosition:   left or right or none

###  constructor

\+ **new Operator**(`obj`: any): *Operator*

Defined in node_modules/dmn-engine/Operator.ts:155

**Parameters:**

Name | Type |
------ | ------ |
`obj` | any |

**Returns:** *Operator*

###  conditionOperand

• **conditionOperand**: *any*

Defined in node_modules/dmn-engine/Operator.ts:152

###  function

• **function**: *any*

Defined in node_modules/dmn-engine/Operator.ts:153

###  leftOperands

• **leftOperands**: *any*

Defined in node_modules/dmn-engine/Operator.ts:150

###  name

• **name**: *any*

Defined in node_modules/dmn-engine/Operator.ts:148

###  precedenceValue

• **precedenceValue**: *any*

Defined in node_modules/dmn-engine/Operator.ts:149

###  rightOperands

• **rightOperands**: *any*

Defined in node_modules/dmn-engine/Operator.ts:151

### `Static` operators

▪ **operators**: *(object | object | object)[]* = OPERATORS

Defined in node_modules/dmn-engine/Operator.ts:154

### `Static` operatorsMap

▪ **operatorsMap**: *any*

Defined in node_modules/dmn-engine/Operator.ts:155

###  parseOperator

▸ **parseOperator**(`rootNode`: any, `parser`: any, `forCondition`: any): *boolean*

Defined in node_modules/dmn-engine/Operator.ts:190

**Parameters:**

Name | Type |
------ | ------ |
`rootNode` | any |
`parser` | any |
`forCondition` | any |

**Returns:** *boolean*

### `Static` execute

▸ **execute**(`name`: any, `values`: any, `expression`: any, `executor`: any): *any*

Defined in node_modules/dmn-engine/Operator.ts:166

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`values` | any |
`expression` | any |
`executor` | any |

**Returns:** *any*

### `Static` parse

▸ **parse**(`rootNode`: any, `parser`: any, `forCondition`: any): *void*

Defined in node_modules/dmn-engine/Operator.ts:175

**Parameters:**

Name | Type |
------ | ------ |
`rootNode` | any |
`parser` | any |
`forCondition` | any |

**Returns:** *void*

___

###  Options

• **Options**:

Defined in node_modules/dmn-engine/common.ts:31

### `Static` debugExecution

▪ **debugExecution**: *boolean* = false

Defined in node_modules/dmn-engine/common.ts:34

### `Static` debugExpression

▪ **debugExpression**: *boolean* = false

Defined in node_modules/dmn-engine/common.ts:33

### `Static` debugTokens

▪ **debugTokens**: *boolean* = false

Defined in node_modules/dmn-engine/common.ts:32

### `Static` debugTree

▪ **debugTree**: *boolean* = false

Defined in node_modules/dmn-engine/common.ts:35

### `Static` delegate

▪ **delegate**: *any*

Defined in node_modules/dmn-engine/common.ts:36

___

###  Parser

• **Parser**:

Defined in node_modules/dmn-engine/ExpressionParser.ts:41

###  compile

▸ **compile**(`string`: any, `forCondtion`: any): *ExpressionNode‹›*

Defined in node_modules/dmn-engine/ExpressionParser.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`string` | any |
`forCondtion` | any |

**Returns:** *ExpressionNode‹›*

###  postParse

▸ **postParse**(`expr`: any): *void*

Defined in node_modules/dmn-engine/ExpressionParser.ts:112

1,   handles function calls  looking for bracket after text
2.   special sytax for condition:
         > 30 days

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`expr` | any |   |

**Returns:** *void*

###  preParse

▸ **preParse**(`seps`: any): *any[]*

Defined in node_modules/dmn-engine/ExpressionParser.ts:125

1.  handles quotes  '/"
2.  handles commas in numbers
3.  spaces
4.  double operators    >=  <=  ==
5.  -number should be one token     like -20 NNOO
6.  mark

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`seps` | any |   |

**Returns:** *any[]*

### `Static` tokenize

▸ **tokenize**(`string`: any): *any[]*

Defined in node_modules/dmn-engine/ExpressionParser.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`string` | any |

**Returns:** *any[]*

___

###  Process

• **Process**:

Defined in src/elements/Process.ts:11

###  constructor

\+ **new Process**(`definition`: any, `parent`: any): *Process*

Defined in src/elements/Process.ts:19

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`definition` | any | - |
`parent` | any | null |

**Returns:** *Process*

###  childrenNodes

• **childrenNodes**: *Node[]*

Defined in src/elements/Process.ts:17

###  def

• **def**: *Definition*

Defined in src/elements/Process.ts:15

###  eventSubProcesses

• **eventSubProcesses**: *any[]*

Defined in src/elements/Process.ts:18

###  id

• **id**: *any*

Defined in src/elements/Process.ts:12

###  isExecutable

• **isExecutable**: *any*

Defined in src/elements/Process.ts:14

###  name

• **name**: *any*

Defined in src/elements/Process.ts:13

###  parent

• **parent**: *Process*

Defined in src/elements/Process.ts:16

###  subProcessEvents

• **subProcessEvents**: *any[]*

Defined in src/elements/Process.ts:19

###  end

▸ **end**(): *Promise‹void›*

Defined in src/elements/Process.ts:54

Notify process that it ended

**Returns:** *Promise‹void›*

###  getEventSubProcessStart

▸ **getEventSubProcessStart**(): *Node[]*

Defined in src/elements/Process.ts:80

**Returns:** *Node[]*

###  getStartNodes

▸ **getStartNodes**(`userInvokable`: boolean): *any[]*

Defined in src/elements/Process.ts:63

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`userInvokable` | boolean | false |

**Returns:** *any[]*

###  init

▸ **init**(`children`: any, `eventSubProcesses`: any): *void*

Defined in src/elements/Process.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`children` | any |
`eventSubProcesses` | any |

**Returns:** *void*

###  start

▸ **start**(`execution`: Execution, `parentToken`: any): *Promise‹void›*

Defined in src/elements/Process.ts:35

Notify process that it started

**Parameters:**

Name | Type |
------ | ------ |
`execution` | Execution |
`parentToken` | any |

**Returns:** *Promise‹void›*

___

###  ProcessData

• **ProcessData**:

Defined in src/datastore/ModelsData.ts:76

###  id

• **id**: *any*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:77

###  isExecutable

• **isExecutable**: *any*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:79

###  name

• **name**: *any*

*Implementation of void*

Defined in src/datastore/ModelsData.ts:78

___

###  Query

• **Query**:

Defined in src/engine/Model.ts:79

###  constructor

\+ **new Query**(`__namedParameters`: object): *Query*

Defined in src/engine/Model.ts:99

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type | Default |
------ | ------ | ------ |
`data` | any | null |
`instanceEndedAt` | any | null |
`instanceId` | any | null |
`instanceName` | any | null |
`instanceSaved` | any | null |
`instanceStartedAt` | any | null |
`instanceStatus` | EXECUTION_STATUS | null |
`itemElementId` | any | null |
`itemEndedAt` | any | null |
`itemId` | any | null |
`itemKey` | any | null |
`itemName` | any | null |
`itemSeq` | any | null |
`itemStartedAt` | any | null |
`itemStatus` | ITEM_STATUS | null |
`itemTokenId` | any | null |
`itemType` | BPMN_TYPE | null |

**Returns:** *Query*

### `Private` _data

• **_data**: *any*

Defined in src/engine/Model.ts:89

### `Private` _instanceData

• **_instanceData**: *any*

Defined in src/engine/Model.ts:86

### `Private` _instanceEndedAt

• **_instanceEndedAt**: *any*

Defined in src/engine/Model.ts:84

### `Private` _instanceId

• **_instanceId**: *any*

Defined in src/engine/Model.ts:80

### `Private` _instanceName

• **_instanceName**: *any*

Defined in src/engine/Model.ts:81

### `Private` _instanceParentNodeId

• **_instanceParentNodeId**: *any*

Defined in src/engine/Model.ts:88

### `Private` _instanceSaved

• **_instanceSaved**: *any*

Defined in src/engine/Model.ts:85

### `Private` _instanceSource

• **_instanceSource**: *any*

Defined in src/engine/Model.ts:87

### `Private` _instanceStartedAt

• **_instanceStartedAt**: *any*

Defined in src/engine/Model.ts:83

### `Private` _instanceStatus

• **_instanceStatus**: *EXECUTION_STATUS*

Defined in src/engine/Model.ts:82

### `Private` _itemElementId

• **_itemElementId**: *any*

Defined in src/engine/Model.ts:99

### `Private` _itemEndedAt

• **_itemEndedAt**: *any*

Defined in src/engine/Model.ts:97

### `Private` _itemId

• **_itemId**: *any*

Defined in src/engine/Model.ts:90

### `Private` _itemKey

• **_itemKey**: *any*

Defined in src/engine/Model.ts:92

### `Private` _itemName

• **_itemName**: *any*

Defined in src/engine/Model.ts:93

### `Private` _itemSeq

• **_itemSeq**: *any*

Defined in src/engine/Model.ts:91

### `Private` _itemStartedAt

• **_itemStartedAt**: *any*

Defined in src/engine/Model.ts:96

### `Private` _itemStatus

• **_itemStatus**: *ITEM_STATUS*

Defined in src/engine/Model.ts:95

### `Private` _itemTokenId

• **_itemTokenId**: *any*

Defined in src/engine/Model.ts:98

### `Private` _itemType

• **_itemType**: *BPMN_TYPE*

Defined in src/engine/Model.ts:94

###  data

▸ **data**(`val`: any): *this*

Defined in src/engine/Model.ts:146

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *this*

###  instanceId

▸ **instanceId**(`val`: any): *Query*

Defined in src/engine/Model.ts:143

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *Query*

###  instanceName

▸ **instanceName**(`val`: any): *Query*

Defined in src/engine/Model.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *Query*

###  instanceStatus

▸ **instanceStatus**(`val`: EXECUTION_STATUS): *Query*

Defined in src/engine/Model.ts:145

**Parameters:**

Name | Type |
------ | ------ |
`val` | EXECUTION_STATUS |

**Returns:** *Query*

###  itemElementId

▸ **itemElementId**(`val`: any): *Query*

Defined in src/engine/Model.ts:150

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *Query*

###  itemId

▸ **itemId**(`val`: any): *Query*

Defined in src/engine/Model.ts:147

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *Query*

###  itemName

▸ **itemName**(`val`: any): *Query*

Defined in src/engine/Model.ts:148

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *Query*

###  itemStatus

▸ **itemStatus**(`val`: ITEM_STATUS): *Query*

Defined in src/engine/Model.ts:149

**Parameters:**

Name | Type |
------ | ------ |
`val` | ITEM_STATUS |

**Returns:** *Query*

___

###  ReceiveTask

• **ReceiveTask**:

Defined in src/elements/Tasks.ts:112

###  constructor

\+ **new ReceiveTask**(`id`: any, `process`: any, `type`: any, `def`: any): *ReceiveTask*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *ReceiveTask*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Overrides void*

Defined in src/elements/Tasks.ts:116

###  isCatching

• **isCatching**:

*Overrides void*

Defined in src/elements/Tasks.ts:114

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Overrides void*

Defined in src/elements/Tasks.ts:115

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  Rule

• **Rule**:

Defined in node_modules/dmn-engine/Rule.ts:6

###  constructor

\+ **new Rule**(`id`: any, `conditions`: string[], `actions`: string[], `conditionVars`: DTVariable[], `actionVars`: DTVariable[]): *Rule*

Defined in node_modules/dmn-engine/Rule.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`conditions` | string[] |
`actions` | string[] |
`conditionVars` | DTVariable[] |
`actionVars` | DTVariable[] |

**Returns:** *Rule*

###  actionVars

• **actionVars**: *DTVariable[]*

Defined in node_modules/dmn-engine/Rule.ts:11

###  actions

• **actions**: *Expression[]*

Defined in node_modules/dmn-engine/Rule.ts:9

###  conditionVars

• **conditionVars**: *DTVariable[]*

Defined in node_modules/dmn-engine/Rule.ts:10

###  conditions

• **conditions**: *Condition[]*

Defined in node_modules/dmn-engine/Rule.ts:8

###  id

• **id**: *any*

Defined in node_modules/dmn-engine/Rule.ts:7

###  asJson

▸ **asJson**(): *any[]*

Defined in node_modules/dmn-engine/Rule.ts:30

**Returns:** *any[]*

###  compile

▸ **compile**(): *any*

Defined in node_modules/dmn-engine/Rule.ts:37

**Returns:** *any*

###  evaluate

▸ **evaluate**(`data`: any, `result`: any): *boolean*

Defined in node_modules/dmn-engine/Rule.ts:43

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |
`result` | any |

**Returns:** *boolean*

___

###  RulesDelegate

• **RulesDelegate**:

Defined in node_modules/dmn-engine/RulesDelegate.ts:11

###  constructor

\+ **new RulesDelegate**(): *RulesDelegate*

Defined in node_modules/dmn-engine/RulesDelegate.ts:13

**Returns:** *RulesDelegate*

###  context

• **context**: *any*

Defined in node_modules/dmn-engine/RulesDelegate.ts:13

###  executor

• **executor**: *Executor*

Defined in node_modules/dmn-engine/RulesDelegate.ts:12

###  customFunctions

▸ **customFunctions**(`funct`: any, `params`: any, `executor`: any): *any*

Defined in node_modules/dmn-engine/RulesDelegate.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`funct` | any |
`params` | any |
`executor` | any |

**Returns:** *any*

###  executeFunction

▸ **executeFunction**(`funct`: any, `params`: any, `executor`: any): *any*

Defined in node_modules/dmn-engine/RulesDelegate.ts:44

**Parameters:**

Name | Type |
------ | ------ |
`funct` | any |
`params` | any |
`executor` | any |

**Returns:** *any*

###  getVariable

▸ **getVariable**(`name`: any): *string*

Defined in node_modules/dmn-engine/RulesDelegate.ts:26

called if a variable request but not found in context object

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | any |   |

**Returns:** *string*

###  init

▸ **init**(`executor`: any, `data`: any): *void*

Defined in node_modules/dmn-engine/RulesDelegate.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`executor` | any |
`data` | any |

**Returns:** *void*

___

###  ScriptBehaviour

• **ScriptBehaviour**:

Defined in src/elements/behaviours/Script.ts:4

###  constructor

\+ **new ScriptBehaviour**(`node`: Node, `definition`: any): *ScriptBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *ScriptBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  event

• **event**: *any*

Defined in src/elements/behaviours/Script.ts:12

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  script

• **script**: *any*

Defined in src/elements/behaviours/Script.ts:13

###  describe

▸ **describe**(): *any[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Script.ts:42

**Returns:** *any[]*

###  end

▸ **end**(`item`: Item): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Script.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  executeScript

▸ **executeScript**(`item`: any): *void*

Defined in src/elements/behaviours/Script.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Script.ts:14

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Script.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Script.ts:25

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Script.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  ScriptTask

• **ScriptTask**:

Defined in src/elements/Tasks.ts:14

###  constructor

\+ **new ScriptTask**(`id`: any, `process`: any, `type`: any, `def`: any): *ScriptTask*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *ScriptTask*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: any): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Tasks.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  SendTask

• **SendTask**:

Defined in src/elements/Tasks.ts:94

###  constructor

\+ **new SendTask**(`id`: any, `process`: any, `type`: any, `def`: any): *SendTask*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *SendTask*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

*Overrides void*

Defined in src/elements/Tasks.ts:96

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: any): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Tasks.ts:98

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  ServerComponent

• **ServerComponent**:

Defined in src/server/ServerContext.ts:8

super class for various objects that are part of the server

###  constructor

\+ **new ServerComponent**(`server`: IBPMNServer): *ServerComponent*

Defined in src/server/ServerContext.ts:9

**Parameters:**

Name | Type |
------ | ------ |
`server` | IBPMNServer |

**Returns:** *ServerComponent*

###  server

• **server**: *any*

Defined in src/server/ServerContext.ts:9

###  appDelegate

• **appDelegate**:

Defined in src/server/ServerContext.ts:20

###  cache

• **cache**:

Defined in src/server/ServerContext.ts:18

###  configuration

• **configuration**:

Defined in src/server/ServerContext.ts:13

###  cron

• **cron**:

Defined in src/server/ServerContext.ts:17

###  dataStore

• **dataStore**:

Defined in src/server/ServerContext.ts:15

###  definitions

• **definitions**:

Defined in src/server/ServerContext.ts:19

###  engine

• **engine**:

Defined in src/server/ServerContext.ts:16

###  logger

• **logger**:

Defined in src/server/ServerContext.ts:14

___

###  ServerHelper

• **ServerHelper**:

Defined in src/helpers/ServerHelper.ts:18

###  constructor

\+ **new ServerHelper**(`configuration`: any): *ServerHelper*

Defined in src/helpers/ServerHelper.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`configuration` | any |

**Returns:** *ServerHelper*

###  bpmnServer

• **bpmnServer**: *any*

Defined in src/helpers/ServerHelper.ts:24

###  configuration

• **configuration**: *any*

Defined in src/helpers/ServerHelper.ts:25

###  engine

• **engine**: *any*

Defined in src/helpers/ServerHelper.ts:28

###  instance

• **instance**: *any*

Defined in src/helpers/ServerHelper.ts:26

###  instanceId

• **instanceId**: *any*

Defined in src/helpers/ServerHelper.ts:29

###  items

• **items**: *any*

Defined in src/helpers/ServerHelper.ts:27

###  checkItem

▸ **checkItem**(`query`: any, `step`: any): *Promise‹boolean›*

Defined in src/helpers/ServerHelper.ts:116

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`step` | any |

**Returns:** *Promise‹boolean›*

###  completedItems

▸ **completedItems**(): *any[]*

Defined in src/helpers/ServerHelper.ts:76

**Returns:** *any[]*

###  delay

▸ **delay**(`time`: any, `result`: any): *Promise‹unknown›*

Defined in src/helpers/ServerHelper.ts:134

**Parameters:**

Name | Type |
------ | ------ |
`time` | any |
`result` | any |

**Returns:** *Promise‹unknown›*

###  dumpInfo

▸ **dumpInfo**(`execution`: any): *Promise‹boolean›*

Defined in src/helpers/ServerHelper.ts:93

**Parameters:**

Name | Type |
------ | ------ |
`execution` | any |

**Returns:** *Promise‹boolean›*

###  execute

▸ **execute**(`definitionName`: any, `data`: object): *Promise‹this›*

Defined in src/helpers/ServerHelper.ts:40

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`definitionName` | any | - |
`data` | object | {} |

**Returns:** *Promise‹this›*

###  findItems

▸ **findItems**(`query`: any): *Promise‹any›*

Defined in src/helpers/ServerHelper.ts:128

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

###  getItems

▸ **getItems**(`status`: any): *any[]*

Defined in src/helpers/ServerHelper.ts:79

**Parameters:**

Name | Type |
------ | ------ |
`status` | any |

**Returns:** *any[]*

###  getLogger

▸ **getLogger**(): *any*

Defined in src/helpers/ServerHelper.ts:36

**Returns:** *any*

###  invoke

▸ **invoke**(`nodeName`: any, `data`: any): *Promise‹this›*

Defined in src/helpers/ServerHelper.ts:55

**Parameters:**

Name | Type |
------ | ------ |
`nodeName` | any |
`data` | any |

**Returns:** *Promise‹this›*

###  isComplete

▸ **isComplete**(): *Promise‹boolean›*

Defined in src/helpers/ServerHelper.ts:105

**Returns:** *Promise‹boolean›*

###  log

▸ **log**(`msg`: any): *void*

Defined in src/helpers/ServerHelper.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

###  resetData

▸ **resetData**(): *Promise‹boolean›*

Defined in src/helpers/ServerHelper.ts:88

**Returns:** *Promise‹boolean›*

###  saveLog

▸ **saveLog**(`name`: any): *void*

Defined in src/helpers/ServerHelper.ts:143

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *void*

###  waitingItems

▸ **waitingItems**(): *any[]*

Defined in src/helpers/ServerHelper.ts:73

**Returns:** *any[]*

___

###  ServiceTask

• **ServiceTask**:

Defined in src/elements/Tasks.ts:34

     foo[method]();

     await this.token.appDelegate[serviceName](data);

     service signature:
             output= service (input,context)

###  constructor

\+ **new ServiceTask**(`id`: any, `process`: any, `type`: any, `def`: any): *ServiceTask*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *ServiceTask*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: any): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Tasks.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  SignalEventBehaviour

• **SignalEventBehaviour**:

Defined in src/elements/behaviours/MessageSignal.ts:49

###  constructor

\+ **new SignalEventBehaviour**(`node`: Node, `definition`: any): *SignalEventBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *SignalEventBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  signalId

• **signalId**:

Defined in src/elements/behaviours/MessageSignal.ts:74

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:68

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:50

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/MessageSignal.ts:54

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  StartEvent

• **StartEvent**:

Defined in src/elements/Events.ts:89

###  constructor

\+ **new StartEvent**(`id`: any, `process`: any, `type`: any, `def`: any): *StartEvent*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *StartEvent*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:30

###  isCatching

• **isCatching**:

*Overrides void*

Defined in src/elements/Events.ts:90

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  hasMessage

▸ **hasMessage**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:7

**Returns:** *any*

###  hasSignal

▸ **hasSignal**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:10

**Returns:** *any*

###  hasTimer

▸ **hasTimer**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:13

**Returns:** *any*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:22

	using token: check if fromEventBasedGateway;	if yes cancel all other events

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  SubProcess

• **SubProcess**:

Defined in src/elements/Tasks.ts:119

###  constructor

\+ **new SubProcess**(`id`: any, `process`: any, `type`: any, `def`: any): *SubProcess*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *SubProcess*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  childProcess

• **childProcess**: *Process*

Defined in src/elements/Tasks.ts:120

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Overrides void*

Defined in src/elements/Tasks.ts:122

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Overrides void*

Defined in src/elements/Tasks.ts:121

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: any): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Tasks.ts:124

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  TerminateBehaviour

• **TerminateBehaviour**:

Defined in src/elements/behaviours/Terminate.ts:10

###  constructor

\+ **new TerminateBehaviour**(`node`: Node, `definition`: any): *TerminateBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *TerminateBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Terminate.ts:17

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/Terminate.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:47

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/Terminate.ts:11

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

___

###  ThrowEvent

• **ThrowEvent**:

Defined in src/elements/Events.ts:64

###  constructor

\+ **new ThrowEvent**(`id`: any, `process`: any, `type`: any, `def`: any): *ThrowEvent*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *ThrowEvent*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:30

###  isCatching

• **isCatching**:

*Overrides void*

Defined in src/elements/Events.ts:71

	using token: check if fromEventBasedGateway;	if yes cancel all other events

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Events.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  hasMessage

▸ **hasMessage**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:7

**Returns:** *any*

###  hasSignal

▸ **hasSignal**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:10

**Returns:** *any*

###  hasTimer

▸ **hasTimer**(): *any*

*Inherited from void*

Defined in src/elements/Events.ts:13

**Returns:** *any*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Events.ts:76

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Overrides void*

Defined in src/elements/Events.ts:73

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  TimerBehaviour

• **TimerBehaviour**:

Defined in src/elements/behaviours/Timer.ts:40

###  constructor

\+ **new TimerBehaviour**(`node`: Node, `definition`: any): *TimerBehaviour*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

**Parameters:**

Name | Type |
------ | ------ |
`node` | Node |
`definition` | any |

**Returns:** *TimerBehaviour*

###  definition

• **definition**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:39

###  duration

• **duration**: *any*

Defined in src/elements/behaviours/Timer.ts:41

###  node

• **node**: *Node*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:38

###  timeCycle

• **timeCycle**: *any*

Defined in src/elements/behaviours/Timer.ts:42

###  describe

▸ **describe**(): *string[]*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Timer.ts:63

**Returns:** *string[]*

###  end

▸ **end**(`item`: Item): *void*

*Overrides void*

Defined in src/elements/behaviours/Timer.ts:127

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  expires

▸ **expires**(): *void*

Defined in src/elements/behaviours/Timer.ts:120

**Returns:** *void*

###  getItemAttributes

▸ **getItemAttributes**(`item`: Item, `attributes`: any[]): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`attributes` | any[] |

**Returns:** *void*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *void*

###  init

▸ **init**(): *void*

*Implementation of void*

*Overrides void*

Defined in src/elements/behaviours/Timer.ts:43

**Returns:** *void*

###  restored

▸ **restored**(`item`: any): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  resume

▸ **resume**(): *void*

*Overrides void*

Defined in src/elements/behaviours/Timer.ts:131

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/behaviours/Behaviour.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  start

▸ **start**(`item`: Item): *NODE_ACTION*

*Overrides void*

Defined in src/elements/behaviours/Timer.ts:90

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *NODE_ACTION*

###  startTimer

▸ **startTimer**(`item`: any): *void*

Defined in src/elements/behaviours/Timer.ts:102

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *void*

###  timeDue

▸ **timeDue**(`timerModifier`: any): *number*

Defined in src/elements/behaviours/Timer.ts:71

return the next time the timer is due
format is time format

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`timerModifier` | any | null | for testing purposes configuration can alter the timer  |

**Returns:** *number*

___

###  Token

• **Token**:

Defined in src/engine/Token.ts:57

Defined in node_modules/dmn-engine/ExpressionParser.ts:27

###  constructor

\+ **new Token**(`type`: TOKEN_TYPE, `execution`: Execution, `startNode`: Node, `dataPath?`: any, `parentToken?`: Token, `originItem?`: Item): *Token*

Defined in src/engine/Token.ts:95

**Parameters:**

Name | Type |
------ | ------ |
`type` | TOKEN_TYPE |
`execution` | Execution |
`startNode` | Node |
`dataPath?` | any |
`parentToken?` | Token |
`originItem?` | Item |

**Returns:** *Token*

###  bracketEndToken

• **bracketEndToken**: *any*

Defined in node_modules/dmn-engine/ExpressionParser.ts:33

###  currentNode

• **currentNode**: *Node*

*Implementation of void*

Defined in src/engine/Token.ts:68

###  dataPath

• **dataPath**: *string*

*Implementation of void*

Defined in src/engine/Token.ts:61

###  entry

• **entry**: *any*

Defined in node_modules/dmn-engine/ExpressionParser.ts:32

###  execution

• **execution**: *IExecution*

*Implementation of void*

Defined in src/engine/Token.ts:60

###  group

• **group**: *any*

Defined in node_modules/dmn-engine/ExpressionParser.ts:31

###  id

• **id**: *any*

*Implementation of void*

Defined in src/engine/Token.ts:58

###  index

• **index**: *any*

Defined in node_modules/dmn-engine/ExpressionParser.ts:30

###  loop

• **loop**: *Loop*

*Implementation of void*

Defined in src/engine/Token.ts:67

###  originItem

• **originItem**: *Item*

*Implementation of void*

Defined in src/engine/Token.ts:65

### `Optional` parentToken

• **parentToken**? : *Token*

*Implementation of void*

Defined in src/engine/Token.ts:63

###  path

• **path**: *Item[]*

*Implementation of void*

Defined in src/engine/Token.ts:66

###  processId

• **processId**: *any*

*Implementation of void*

Defined in src/engine/Token.ts:69

###  startNodeId

• **startNodeId**: *any*

*Implementation of void*

Defined in src/engine/Token.ts:62

###  status

• **status**: *TOKEN_STATUS*

*Implementation of void*

Defined in src/engine/Token.ts:70

###  type

• **type**: *TOKEN_TYPE*

*Implementation of void*

Defined in src/engine/Token.ts:59

### `Static` groups

▪ **groups**: *string[]* = ['number', 'alpha', 'space' , 'symbol']

Defined in node_modules/dmn-engine/ExpressionParser.ts:28

###  childrenTokens

• **childrenTokens**:

*Implementation of void*

Defined in src/engine/Token.ts:91

###  currentItem

• **currentItem**:

*Implementation of void*

Defined in src/engine/Token.ts:75

###  data

• **data**:

*Implementation of void*

Defined in src/engine/Token.ts:72

###  firstItem

• **firstItem**:

*Implementation of void*

Defined in src/engine/Token.ts:78

###  lastItem

• **lastItem**:

*Implementation of void*

Defined in src/engine/Token.ts:81

###  applyInput

▸ **applyInput**(`inputData`: any): *void*

*Implementation of void*

Defined in src/engine/Token.ts:296

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *void*

###  end

▸ **end**(): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Token.ts:336

**Returns:** *Promise‹void›*

###  execute

▸ **execute**(`input`: any): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Token.ts:219

this is the primary exectuion method for a token

**Parameters:**

Name | Type |
------ | ------ |
`input` | any |

**Returns:** *Promise‹void›*

###  getChildrenTokens

▸ **getChildrenTokens**(): *any[]*

*Implementation of void*

Defined in src/engine/Token.ts:192

**Returns:** *any[]*

###  getSubProcessToken

▸ **getSubProcessToken**(): *Token*

*Implementation of void*

Defined in src/engine/Token.ts:183

**Returns:** *Token*

###  goNext

▸ **goNext**(): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Token.ts:359

**Returns:** *Promise‹void›*

###  isLiteral

▸ **isLiteral**(): *void*

Defined in node_modules/dmn-engine/ExpressionParser.ts:37

**Returns:** *void*

###  isOperator

▸ **isOperator**(): *boolean*

Defined in node_modules/dmn-engine/ExpressionParser.ts:34

**Returns:** *boolean*

###  log

▸ **log**(`msg`: any): *void*

*Implementation of void*

Defined in src/engine/Token.ts:400

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

###  preExecute

▸ **preExecute**(): *Promise‹boolean›*

*Implementation of void*

Defined in src/engine/Token.ts:204

**Returns:** *Promise‹boolean›*

###  preNext

▸ **preNext**(): *Promise‹boolean›*

*Implementation of void*

Defined in src/engine/Token.ts:211

**Returns:** *Promise‹boolean›*

###  processError

▸ **processError**(): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Token.ts:266

**Returns:** *Promise‹void›*

###  restored

▸ **restored**(): *void*

*Implementation of void*

Defined in src/engine/Token.ts:178

**Returns:** *void*

###  resume

▸ **resume**(): *void*

*Implementation of void*

Defined in src/engine/Token.ts:174

**Returns:** *void*

###  save

▸ **save**(): *object*

*Implementation of void*

Defined in src/engine/Token.ts:131

**Returns:** *object*

* **currentNode**: *any* = this.currentNode.id

* **dataPath**: *string* = this.dataPath

* **id**: *any* = this.id

* **loopId**: *any*

* **originItem**: *any*

* **parentToken**: *any*

* **startNodeId**: *any* = this.startNodeId

* **status**: *TOKEN_STATUS* = this.status

* **type**: *TOKEN_TYPE* = this.type

###  signal

▸ **signal**(`data`: any): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Token.ts:312

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹void›*

###  stop

▸ **stop**(): *void*

*Implementation of void*

Defined in src/engine/Token.ts:165

**Returns:** *void*

###  terminate

▸ **terminate**(): *Promise‹void›*

*Implementation of void*

Defined in src/engine/Token.ts:303

 is called by Gateways to cancel current token

**Returns:** *Promise‹void›*

### `Static` load

▸ **load**(`execution`: Execution, `da`: any): *Token*

Defined in src/engine/Token.ts:152

**Parameters:**

Name | Type |
------ | ------ |
`execution` | Execution |
`da` | any |

**Returns:** *Token*

### `Static` startNewToken

▸ **startNewToken**(`type`: TOKEN_TYPE, `execution`: any, `startNode`: any, `dataPath`: any, `parentToken`: Token, `originItem`: Item, `loop`: Loop, `data`: any, `noExecute`: boolean): *Promise‹Token‹››*

Defined in src/engine/Token.ts:122

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`type` | TOKEN_TYPE | - | - |
`execution` | any | - | - |
`startNode` | any | - | - |
`dataPath` | any | - | - |
`parentToken` | Token | - | - |
`originItem` | Item | - | - |
`loop` | Loop | - | - |
`data` | any | null |   |
`noExecute` | boolean | false | - |

**Returns:** *Promise‹Token‹››*

___

###  TokenObject

• **TokenObject**:

Defined in src/engine/Model.ts:48

###  branchNodeId

• **branchNodeId**: *any*

Defined in src/engine/Model.ts:54

###  currentNodeId

• **currentNodeId**: *any*

Defined in src/engine/Model.ts:56

###  dataPath

• **dataPath**: *any*

Defined in src/engine/Model.ts:51

###  id

• **id**: *any*

Defined in src/engine/Model.ts:49

###  loopId

• **loopId**: *any*

Defined in src/engine/Model.ts:52

###  parentTokenId

• **parentTokenId**: *any*

Defined in src/engine/Model.ts:53

###  startNodeId

• **startNodeId**: *any*

Defined in src/engine/Model.ts:55

###  status

• **status**: *any*

Defined in src/engine/Model.ts:50

___

###  TreeBuilder

• **TreeBuilder**:

Defined in node_modules/dmn-engine/TreeBuilder.ts:51

###  constructor

\+ **new TreeBuilder**(`tokens`: any): *TreeBuilder*

Defined in node_modules/dmn-engine/TreeBuilder.ts:56

**Parameters:**

Name | Type |
------ | ------ |
`tokens` | any |

**Returns:** *TreeBuilder*

###  errors

• **errors**: *any[]* = []

Defined in node_modules/dmn-engine/TreeBuilder.ts:56

###  nodes

• **nodes**: *any*

Defined in node_modules/dmn-engine/TreeBuilder.ts:55

###  pos

• **pos**: *any*

Defined in node_modules/dmn-engine/TreeBuilder.ts:53

###  rootNode

• **rootNode**: *any*

Defined in node_modules/dmn-engine/TreeBuilder.ts:54

###  tokens

• **tokens**: *any*

Defined in node_modules/dmn-engine/TreeBuilder.ts:52

###  BuildOperators

▸ **BuildOperators**(`operator`: any, `leftOperands`: any, `rightOperands`: any): *boolean*

Defined in node_modules/dmn-engine/TreeBuilder.ts:231

check for operators and move
before:   operand1
          op
          operand2
after:    op
             operand1
             operand2

**Parameters:**

Name | Type |
------ | ------ |
`operator` | any |
`leftOperands` | any |
`rightOperands` | any |

**Returns:** *boolean*

###  build

▸ **build**(`forCondition`: any): *ExpressionNode*

Defined in node_modules/dmn-engine/TreeBuilder.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`forCondition` | any |

**Returns:** *ExpressionNode*

###  buildBracketNodes

▸ **buildBracketNodes**(`start`: ExpressionNode): *any*

Defined in node_modules/dmn-engine/TreeBuilder.ts:172

**Parameters:**

Name | Type |
------ | ------ |
`start` | ExpressionNode |

**Returns:** *any*

###  buildBrackets

▸ **buildBrackets**(`rootNode`: ExpressionNode): *boolean*

Defined in node_modules/dmn-engine/TreeBuilder.ts:121

**Parameters:**

Name | Type |
------ | ------ |
`rootNode` | ExpressionNode |

**Returns:** *boolean*

###  error

▸ **error**(`msg`: any): *boolean*

Defined in node_modules/dmn-engine/TreeBuilder.ts:162

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *boolean*

###  newNode

▸ **newNode**(`parent`: any, `token`: Token, `type`: EXPRESSION_TYPE): *ExpressionNode‹›*

Defined in node_modules/dmn-engine/TreeBuilder.ts:86

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`parent` | any | - |
`token` | Token | - |
`type` | EXPRESSION_TYPE | null |

**Returns:** *ExpressionNode‹›*

___

###  TreeNode

• **TreeNode**:

Defined in node_modules/dmn-engine/ExpressionNode.ts:63

###  constructor

\+ **new TreeNode**(`parent`: any): *TreeNode*

Defined in node_modules/dmn-engine/ExpressionNode.ts:65

**Parameters:**

Name | Type |
------ | ------ |
`parent` | any |

**Returns:** *TreeNode*

###  children

• **children**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:65

###  parent

• **parent**: *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:64

###  addChild

▸ **addChild**(`node`: any): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:74

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *void*

###  delete

▸ **delete**(): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:121

**Returns:** *void*

###  first

▸ **first**(`withinParent`: boolean): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:83

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withinParent` | boolean | false |

**Returns:** *void*

###  loop

▸ **loop**(`funct`: any, `level`: number): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:103

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`funct` | any | - |
`level` | number | 0 |

**Returns:** *void*

###  loopUp

▸ **loopUp**(`funct`: any, `level`: number): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:111

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`funct` | any | - |
`level` | number | 0 |

**Returns:** *void*

###  move

▸ **move**(`newParent`: any): *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:124

**Parameters:**

Name | Type |
------ | ------ |
`newParent` | any |

**Returns:** *any*

###  next

▸ **next**(`withinParent`: boolean): *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:85

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withinParent` | boolean | false |

**Returns:** *any*

###  previous

▸ **previous**(`withinParent`: boolean): *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:93

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`withinParent` | boolean | false |

**Returns:** *any*

###  root

▸ **root**(): *any*

Defined in node_modules/dmn-engine/ExpressionNode.ts:77

**Returns:** *any*

___

###  UserTask

• **UserTask**:

Defined in src/elements/Tasks.ts:107

###  constructor

\+ **new UserTask**(`id`: any, `process`: any, `type`: any, `def`: any): *UserTask*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *UserTask*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Overrides void*

Defined in src/elements/Tasks.ts:110

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Overrides void*

Defined in src/elements/Tasks.ts:109

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: Item): *Item[]*

*Inherited from void*

Defined in src/elements/Node.ts:233

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Item[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

___

###  XORGateway

• **XORGateway**:

Defined in src/elements/Gateway.ts:187

 ExclusiveGatway:
     outbounds:  only 1
     inbound:    only 1 -

###  constructor

\+ **new XORGateway**(`id`: any, `process`: any, `type`: any, `def`: any): *XORGateway*

*Inherited from void*

Defined in src/elements/Node.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |
`process` | any |
`type` | any |
`def` | any |

**Returns:** *XORGateway*

###  attachedTo

• **attachedTo**: *Node*

*Inherited from void*

Defined in src/elements/Node.ts:17

###  attachments

• **attachments**: *Node[]*

*Inherited from void*

Defined in src/elements/Node.ts:16

###  behaviours

• **behaviours**: *Map‹any, any›* = new Map()

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:17

###  def

• **def**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:13

###  id

• **id**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:13

###  inbounds

• **inbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:15

###  isFlow

• **isFlow**: *boolean* = false

*Inherited from void*

Defined in src/elements/Element.ts:18

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:18

###  name

• **name**: *any*

*Implementation of void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:11

###  outbounds

• **outbounds**: *Flow[]*

*Inherited from void*

Defined in src/elements/Node.ts:14

###  process

• **process**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:12

###  scripts

• **scripts**: *Map‹any, any›* = new Map()

*Inherited from void*

Defined in src/elements/Node.ts:20

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/elements/Node.ts:19

###  subType

• **subType**: *any*

*Inherited from void*

Defined in src/elements/Element.ts:15

###  type

• **type**: *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:14

###  canBeInvoked

• **canBeInvoked**:

*Inherited from void*

Defined in src/elements/Node.ts:101

###  isCatching

• **isCatching**:

*Inherited from void*

Defined in src/elements/Node.ts:103

###  processId

• **processId**:

*Inherited from void*

Defined in src/elements/Node.ts:21

###  requiresWait

• **requiresWait**:

*Inherited from void*

Defined in src/elements/Node.ts:96

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: Item): *Promise‹void›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:169

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  convergeFlows

▸ **convergeFlows**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Gateway.ts:125

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  describe

▸ **describe**(): *string[][]*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:22

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: Item, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹any›*

###  end

▸ **end**(`item`: Item): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:187

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  execute

▸ **execute**(`item`: Item): *Promise‹void | wait | error | abort›*

*Inherited from void*

Defined in src/elements/Node.ts:113

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹void | wait | error | abort›*

###  findActiveFlows

▸ **findActiveFlows**(`token`: Token): *object*

*Inherited from void*

Defined in src/elements/Gateway.ts:68

**Parameters:**

Name | Type |
------ | ------ |
`token` | Token |

**Returns:** *object*

* **pendingTokens**: *any[]*

* **waitingTokens**: *any[]*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:37

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getInput

▸ **getInput**(`item`: Item, `input`: any): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:66

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |
`input` | any |

**Returns:** *Promise‹any›*

###  getOutbounds

▸ **getOutbounds**(`item`: any): *Item‹›[]*

*Overrides void*

Defined in src/elements/Gateway.ts:189

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |

**Returns:** *Item‹›[]*

###  getOutput

▸ **getOutput**(`item`: Item): *Promise‹any›*

*Inherited from void*

Defined in src/elements/Node.ts:79

transform data using output rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *Promise‹any›*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Implementation of void*

*Inherited from void*

Defined in src/elements/Element.ts:33

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Node.ts:228

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  restored

▸ **restored**(`item`: Item): *void*

*Inherited from void*

Defined in src/elements/Element.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *void*

###  resume

▸ **resume**(`item`: Item): *void*

*Inherited from void*

*Overrides void*

Defined in src/elements/Node.ts:225

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |

**Returns:** *void*

###  run

▸ **run**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

Defined in src/elements/Node.ts:183

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  setInput

▸ **setInput**(`item`: Item, `input`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:56

transform data using input rules
todo

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | Item |   |
`input` | any | - |

**Returns:** *Promise‹void›*

###  start

▸ **start**(`item`: Item): *Promise‹NODE_ACTION›*

*Inherited from void*

*Overrides void*

Defined in src/elements/Gateway.ts:158

**Parameters:**

Name | Type |
------ | ------ |
`item` | Item |

**Returns:** *Promise‹NODE_ACTION›*

###  startBoundaryEvents

▸ **startBoundaryEvents**(`item`: any, `token`: any): *Promise‹void›*

*Inherited from void*

Defined in src/elements/Node.ts:248

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`token` | any |

**Returns:** *Promise‹void›*

## Interfaces

###  IAppDelegate

• **IAppDelegate**:

Defined in src/interfaces/common.ts:64

 Application Delegate Object to respond to various events and services:

 1.  receive all events from workflow
 2.  receive service calls
 3.  receive message and signal calls
 4.  execute scripts

###  moddleOptions

• **moddleOptions**: *any*

Defined in src/interfaces/common.ts:65

###  servicesProvider

• **servicesProvider**: *any*

Defined in src/interfaces/common.ts:66

###  executionEvent

▸ **executionEvent**(`__namedParameters`: object): *any*

Defined in src/interfaces/common.ts:68

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`event` | any |
`execution` | any |
`item` | any |

**Returns:** *any*

###  executionStarted

▸ **executionStarted**(`execution`: IExecutionContext): *any*

Defined in src/interfaces/common.ts:67

**Parameters:**

Name | Type |
------ | ------ |
`execution` | IExecutionContext |

**Returns:** *any*

###  issueMessage

▸ **issueMessage**(`messageId`: any, `data`: any): *any*

Defined in src/interfaces/common.ts:78

is called when an event throws a message that can not be answered by another process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | - |
`data` | any |   |

**Returns:** *any*

###  issueSignal

▸ **issueSignal**(`messageId`: any, `data`: any): *any*

Defined in src/interfaces/common.ts:79

**Parameters:**

Name | Type |
------ | ------ |
`messageId` | any |
`data` | any |

**Returns:** *any*

###  messageThrown

▸ **messageThrown**(`signalId`: any, `data`: any, `messageMatchingKey`: any, `item`: IItem): *any*

Defined in src/interfaces/common.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |
`messageMatchingKey` | any |
`item` | IItem |

**Returns:** *any*

###  scopeEval

▸ **scopeEval**(`scope`: any, `script`: any): *any*

Defined in src/interfaces/common.ts:87

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

###  scopeJS

▸ **scopeJS**(`scope`: any, `script`: any): *any*

Defined in src/interfaces/common.ts:88

**Parameters:**

Name | Type |
------ | ------ |
`scope` | any |
`script` | any |

**Returns:** *any*

###  serviceCalled

▸ **serviceCalled**(`serviceName`: any, `data`: any, `item`: IItem): *any*

Defined in src/interfaces/common.ts:85

is called only if the serviceTask has no implementation; otherwise the specified implementation will be called.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`serviceName` | any | - |
`data` | any | - |
`item` | IItem |   |

**Returns:** *any*

###  signalThrown

▸ **signalThrown**(`signalId`: any, `data`: any, `messageMatchingKey`: any, `item`: IItem): *any*

Defined in src/interfaces/common.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`signalId` | any |
`data` | any |
`messageMatchingKey` | any |
`item` | IItem |

**Returns:** *any*

___

###  IBPMNServer

• **IBPMNServer**:

Defined in src/interfaces/server.ts:17

###  appDelegate

• **appDelegate**: *any*

Defined in src/interfaces/server.ts:25

###  cache

• **cache**: *any*

Defined in src/interfaces/server.ts:23

###  configuration

• **configuration**: *any*

Defined in src/interfaces/server.ts:18

###  cron

• **cron**: *any*

Defined in src/interfaces/server.ts:22

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/server.ts:20

###  definitions

• **definitions**: *any*

Defined in src/interfaces/server.ts:24

###  engine

• **engine**: *any*

Defined in src/interfaces/server.ts:21

###  logger

• **logger**: *any*

Defined in src/interfaces/server.ts:19

___

###  IBehaviour

• **IBehaviour**:

Defined in src/elements/behaviours/Behaviour.ts:23

Behaviour
     ioSpecification
     timer
     message
     signal

  each behaviour is a class
     it scans def and insert itself to perform actions as required

###  definition

• **definition**: *any*

Defined in src/elements/behaviours/Behaviour.ts:25

###  node

• **node**: *Node*

Defined in src/elements/behaviours/Behaviour.ts:24

###  describe

▸ **describe**(): *string[]*

Defined in src/elements/behaviours/Behaviour.ts:33

**Returns:** *string[]*

###  end

▸ **end**(`item`: IItem): *any*

Defined in src/elements/behaviours/Behaviour.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *any*

###  getItemAttributes

▸ **getItemAttributes**(`item`: IItem, `attributes`: any[]): *any*

Defined in src/elements/behaviours/Behaviour.ts:32

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |
`attributes` | any[] |

**Returns:** *any*

###  getNodeAttributes

▸ **getNodeAttributes**(`attributes`: any[]): *any*

Defined in src/elements/behaviours/Behaviour.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`attributes` | any[] |

**Returns:** *any*

###  init

▸ **init**(): *any*

Defined in src/elements/behaviours/Behaviour.ts:34

**Returns:** *any*

###  restored

▸ **restored**(`item`: IItem): *any*

Defined in src/elements/behaviours/Behaviour.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *any*

###  resume

▸ **resume**(`item`: IItem): *any*

Defined in src/elements/behaviours/Behaviour.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *any*

###  run

▸ **run**(`item`: IItem): *any*

Defined in src/elements/behaviours/Behaviour.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *any*

###  start

▸ **start**(`item`: IItem): *any*

Defined in src/elements/behaviours/Behaviour.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *any*

___

###  IBpmnModelData

• **IBpmnModelData**:

Defined in src/interfaces/datastore.ts:79

###  events

• **events**: *IEventData[]*

Defined in src/interfaces/datastore.ts:84

###  name

• **name**: *any*

Defined in src/interfaces/datastore.ts:80

###  processes

• **processes**: *IProcessData[]*

Defined in src/interfaces/datastore.ts:83

###  saved

• **saved**: *any*

Defined in src/interfaces/datastore.ts:85

###  source

• **source**: *any*

Defined in src/interfaces/datastore.ts:81

###  svg

• **svg**: *any*

Defined in src/interfaces/datastore.ts:82

___

###  IConfiguration

• **IConfiguration**:

Defined in src/interfaces/common.ts:4

###  database

• **database**: *object*

Defined in src/interfaces/common.ts:11

#### Type declaration:

* **MongoDB**: *object*

###  definitionsPath

• **definitionsPath**: *string*

Defined in src/interfaces/common.ts:6

###  logger

• **logger**: *ILogger*

Defined in src/interfaces/common.ts:19

###  timers

• **timers**: *object*

Defined in src/interfaces/common.ts:7

#### Type declaration:

* **forceTimersDelay**: *number*

* **precision**: *number*

###  appDelegate

▸ **appDelegate**(`server`: any): *IAppDelegate*

Defined in src/interfaces/common.ts:21

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *IAppDelegate*

###  dataStore

▸ **dataStore**(`server`: any): *IDataStore*

Defined in src/interfaces/common.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *IDataStore*

###  definitions

▸ **definitions**(`server`: any): *IModelsDatastore*

Defined in src/interfaces/common.ts:20

**Parameters:**

Name | Type |
------ | ------ |
`server` | any |

**Returns:** *IModelsDatastore*

___

###  IDataStore

• **IDataStore**:

Defined in src/interfaces/engine.ts:4

Defined in src/interfaces/datastore.ts:5

###  db

• **db**: *any*

Defined in src/interfaces/datastore.ts:7

###  dbConfiguration

• **dbConfiguration**: *any*

Defined in src/interfaces/datastore.ts:6

###  execution

• **execution**: *IExecution*

Defined in src/interfaces/datastore.ts:9

###  logger

• **logger**: *any*

Defined in src/interfaces/datastore.ts:8

###  deleteInstances

▸ **deleteInstances**(`query?`: any): *Promise‹void›*

Defined in src/interfaces/datastore.ts:23

**Parameters:**

Name | Type |
------ | ------ |
`query?` | any |

**Returns:** *Promise‹void›*

###  findInstance

▸ **findInstance**(`query`: any, `options`: any): *Promise‹any›*

Defined in src/interfaces/datastore.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`options` | any |

**Returns:** *Promise‹any›*

###  findInstances

▸ **findInstances**(`query`: any, `option`: "summary" | "full"): *Promise‹any›*

Defined in src/interfaces/datastore.ts:18

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |
`option` | "summary" &#124; "full" |

**Returns:** *Promise‹any›*

###  findItem

▸ **findItem**(`query`: any): *Promise‹any›*

Defined in src/interfaces/datastore.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any›*

###  findItems

▸ **findItems**(`query`: any): *Promise‹any[]›*

Defined in src/interfaces/datastore.ts:22

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`query` | any |   |

**Returns:** *Promise‹any[]›*

###  install

▸ **install**(): *any*

Defined in src/interfaces/datastore.ts:24

**Returns:** *any*

###  loadInstance

▸ **loadInstance**(`instanceId`: any): *Promise‹object›*

Defined in src/interfaces/datastore.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`instanceId` | any |

**Returns:** *Promise‹object›*

###  monitorExecution

▸ **monitorExecution**(`execution`: IExecution): *void*

Defined in src/interfaces/datastore.ts:10

**Parameters:**

Name | Type |
------ | ------ |
`execution` | IExecution |

**Returns:** *void*

###  save

▸ **save**(): *Promise‹void›*

Defined in src/interfaces/datastore.ts:11

**Returns:** *Promise‹void›*

___

###  IDefinition

• **IDefinition**:

Defined in src/interfaces/elements.ts:3

###  flows

• **flows**: *any[]*

Defined in src/interfaces/elements.ts:8

###  logger

• **logger**: *any*

Defined in src/interfaces/elements.ts:10

###  name

• **name**: *any*

Defined in src/interfaces/elements.ts:4

###  nodes

• **nodes**: *Map‹any, any›*

Defined in src/interfaces/elements.ts:7

###  processes

• **processes**: *Map‹any, any›*

Defined in src/interfaces/elements.ts:5

###  rootElements

• **rootElements**: *any*

Defined in src/interfaces/elements.ts:6

###  source

• **source**: *any*

Defined in src/interfaces/elements.ts:9

###  getDefinition

▸ **getDefinition**(`source`: any, `logger`: ILogger): *Promise‹any›*

Defined in src/interfaces/elements.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`source` | any |
`logger` | ILogger |

**Returns:** *Promise‹any›*

###  getJson

▸ **getJson**(): *string*

Defined in src/interfaces/elements.ts:12

**Returns:** *string*

###  getNodeById

▸ **getNodeById**(`id`: any): *Node*

Defined in src/interfaces/elements.ts:15

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *Node*

###  getStartNode

▸ **getStartNode**(): *Node*

Defined in src/interfaces/elements.ts:14

**Returns:** *Node*

###  load

▸ **load**(): *Promise‹any›*

Defined in src/interfaces/elements.ts:11

**Returns:** *Promise‹any›*

___

###  IElement

• **IElement**:

Defined in src/interfaces/elements.ts:19

###  behaviours

• **behaviours**: *Map‹any, any›*

Defined in src/interfaces/elements.ts:23

###  id

• **id**: *any*

Defined in src/interfaces/elements.ts:20

###  name

• **name**: *any*

Defined in src/interfaces/elements.ts:22

###  type

• **type**: *any*

Defined in src/interfaces/elements.ts:21

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

Defined in src/interfaces/elements.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: IItem): *void*

Defined in src/interfaces/elements.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

###  describe

▸ **describe**(): *string[][]*

Defined in src/interfaces/elements.ts:25

**Returns:** *string[][]*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

Defined in src/interfaces/elements.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

Defined in src/interfaces/elements.ts:32

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  restored

▸ **restored**(`item`: IItem): *void*

Defined in src/interfaces/elements.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

###  resume

▸ **resume**(`item`: IItem): *void*

Defined in src/interfaces/elements.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

___

###  IEngine

• **IEngine**:

Defined in src/interfaces/server.ts:40

###  appDelegate

• **appDelegate**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:37

###  cache

• **cache**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:35

###  configuration

• **configuration**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:30

###  cron

• **cron**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:34

###  dataStore

• **dataStore**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:32

###  definitions

• **definitions**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:36

###  engine

• **engine**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:33

###  logger

• **logger**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:31

###  server

• **server**: *any*

*Inherited from void*

Defined in src/interfaces/server.ts:29

###  get

▸ **get**(`instanceQuery`: any, `listener?`: EventEmitter): *Promise‹IExecutionContext›*

Defined in src/interfaces/server.ts:62

restores an instance into memeory or provides you access to a running instance

this will also resume execution

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`instanceQuery` | any | criteria to fetch the instance  query example:	{ id: instanceId} 					{ data: {caseId: 1005}} 					{ items.item.id : 'abcc111322'} 					{ items.item.itemKey : 'businesskey here'}   |
`listener?` | EventEmitter | - |

**Returns:** *Promise‹IExecutionContext›*

###  invoke

▸ **invoke**(`itemQuery`: any, `data?`: object, `listener?`: EventEmitter): *Promise‹IExecutionContext›*

Defined in src/interfaces/server.ts:76

Continue an existing item that is in a wait state

-------------------------------------------------
scenario:
		itemId			{itemId: value }
		itemKey			{itemKey: value}
		instance,task	{instanceId: instanceId, elementId: value }

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`itemQuery` | any | criteria to retrieve the item |
`data?` | object |   |
`listener?` | EventEmitter | - |

**Returns:** *Promise‹IExecutionContext›*

###  restore

▸ **restore**(`instanceQuery`: any, `listener?`: EventEmitter): *Promise‹IExecutionContext›*

Defined in src/interfaces/server.ts:63

**Parameters:**

Name | Type |
------ | ------ |
`instanceQuery` | any |
`listener?` | EventEmitter |

**Returns:** *Promise‹IExecutionContext›*

###  signal

▸ **signal**(`messageId`: any, `matchingKey`: any, `data?`: object, `listener?`: EventEmitter): *Promise‹IExecutionContext›*

Defined in src/interfaces/server.ts:105

signal/message raise a signal or throw a message

will seach for a matching event/task given the signalId/messageId

that can be againt a running instance or it may start a new instance
----------------------------------------------------------------------------

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`messageId` | any | the id of the message or signal as per bpmn definition |
`matchingKey` | any | should match the itemKey (if specified) |
`data?` | object | message data  |
`listener?` | EventEmitter | - |

**Returns:** *Promise‹IExecutionContext›*

###  start

▸ **start**(`name`: any, `data?`: any, `listener?`: EventEmitter, `startNodeId?`: string): *Promise‹IExecutionContext›*

Defined in src/interfaces/server.ts:48

	loads a definitions  and start execution

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | any | name of the process to start |
`data?` | any | input data |
`listener?` | EventEmitter | - |
`startNodeId?` | string | in process has multiple start node; you need to specify which one  |

**Returns:** *Promise‹IExecutionContext›*

###  startEvent

▸ **startEvent**(`instanceId`: any, `elementId`: any, `data?`: object, `listener?`: EventEmitter): *Promise‹IExecutionContext›*

Defined in src/interfaces/server.ts:92

Invoking an event (usually start event of a secondary process) against an existing instance
or
Invoking a start event (of a secondary process) against an existing instance
----------------------------------------------------------------------------
	 instance,task
```
	{instanceId: instanceId, elementId: value }
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`instanceId` | any | - |
`elementId` | any | - |
`data?` | object |   |
`listener?` | EventEmitter | - |

**Returns:** *Promise‹IExecutionContext›*

___

###  IEventData

• **IEventData**:

Defined in src/interfaces/datastore.ts:45

###  elementId

• **elementId**: *string*

Defined in src/interfaces/datastore.ts:46

###  expression

• **expression**: *any*

Defined in src/interfaces/datastore.ts:54

###  expressionFormat

• **expressionFormat**: *any*

Defined in src/interfaces/datastore.ts:55

###  maxRepeat

• **maxRepeat**: *any*

Defined in src/interfaces/datastore.ts:57

### `Optional` messageId

• **messageId**? : *string*

Defined in src/interfaces/datastore.ts:52

###  name

• **name**: *any*

Defined in src/interfaces/datastore.ts:49

###  processId

• **processId**: *string*

Defined in src/interfaces/datastore.ts:47

###  referenceDateTime

• **referenceDateTime**: *any*

Defined in src/interfaces/datastore.ts:56

###  repeatCount

• **repeatCount**: *any*

Defined in src/interfaces/datastore.ts:58

### `Optional` signalId

• **signalId**? : *string*

Defined in src/interfaces/datastore.ts:51

###  subType

• **subType**: *any*

Defined in src/interfaces/datastore.ts:50

### `Optional` timeDue

• **timeDue**? : *Date*

Defined in src/interfaces/datastore.ts:59

###  type

• **type**: *any*

Defined in src/interfaces/datastore.ts:48

___

###  IExecution

• **IExecution**:

Defined in src/interfaces/engine.ts:62

###  appDelegate

• **appDelegate**: *IAppDelegate*

Defined in src/interfaces/engine.ts:71

###  data

• **data**: *any*

Defined in src/interfaces/engine.ts:74

###  definition

• **definition**: *IDefinition*

Defined in src/interfaces/engine.ts:70

###  endedAt

• **endedAt**: *any*

Defined in src/interfaces/engine.ts:66

###  executionContext

• **executionContext**: *IExecutionContext*

Defined in src/interfaces/engine.ts:78

###  id

• **id**: *any*

Defined in src/interfaces/engine.ts:63

###  listener

• **listener**: *EventEmitter*

Defined in src/interfaces/engine.ts:77

###  logger

• **logger**: *ILogger*

Defined in src/interfaces/engine.ts:73

###  logs

• **logs**: *any[]*

Defined in src/interfaces/engine.ts:75

###  name

• **name**: *any*

Defined in src/interfaces/engine.ts:64

###  parentItemId

• **parentItemId**: *any*

Defined in src/interfaces/engine.ts:76

###  promises

• **promises**: *any*

Defined in src/interfaces/engine.ts:79

###  saved

• **saved**: *any*

Defined in src/interfaces/engine.ts:67

###  source

• **source**: *any*

Defined in src/interfaces/engine.ts:72

###  startedAt

• **startedAt**: *any*

Defined in src/interfaces/engine.ts:65

###  status

• **status**: *EXECUTION_STATUS*

Defined in src/interfaces/engine.ts:68

###  tokens

• **tokens**: *Map‹any, IToken›*

Defined in src/interfaces/engine.ts:69

###  uids

• **uids**: *object*

Defined in src/interfaces/engine.ts:109

#### Type declaration:

###  applyInput

▸ **applyInput**(`inputData`: any, `dataPath?`: any): *void*

Defined in src/interfaces/engine.ts:115

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |
`dataPath?` | any |

**Returns:** *void*

###  doExecutionEvent

▸ **doExecutionEvent**(`event`: any): *Promise‹any›*

Defined in src/interfaces/engine.ts:112

**Parameters:**

Name | Type |
------ | ------ |
`event` | any |

**Returns:** *Promise‹any›*

###  doItemEvent

▸ **doItemEvent**(`item`: any, `event`: any): *Promise‹any›*

Defined in src/interfaces/engine.ts:113

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`event` | any |

**Returns:** *Promise‹any›*

###  end

▸ **end**(): *Promise‹void›*

Defined in src/interfaces/engine.ts:85

**Returns:** *Promise‹void›*

###  execute

▸ **execute**(`startNodeId?`: any, `inputData?`: object): *Promise‹void›*

Defined in src/interfaces/engine.ts:92

**Parameters:**

Name | Type |
------ | ------ |
`startNodeId?` | any |
`inputData?` | object |

**Returns:** *Promise‹void›*

###  getAndCreateData

▸ **getAndCreateData**(`dataPath`: any, `asArray?`: boolean): *any*

Defined in src/interfaces/engine.ts:117

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |
`asArray?` | boolean |

**Returns:** *any*

###  getData

▸ **getData**(`dataPath`: any): *any*

Defined in src/interfaces/engine.ts:116

**Parameters:**

Name | Type |
------ | ------ |
`dataPath` | any |

**Returns:** *any*

###  getItems

▸ **getItems**(`query?`: any): *IItem[]*

Defined in src/interfaces/engine.ts:104

**Parameters:**

Name | Type |
------ | ------ |
`query?` | any |

**Returns:** *IItem[]*

###  getItemsData

▸ **getItemsData**(): *IItemData[]*

Defined in src/interfaces/engine.ts:84

**Returns:** *IItemData[]*

###  getNewId

▸ **getNewId**(`scope`: string): *number*

Defined in src/interfaces/engine.ts:110

**Parameters:**

Name | Type |
------ | ------ |
`scope` | string |

**Returns:** *number*

###  getNodeById

▸ **getNodeById**(`id`: any): *Node*

Defined in src/interfaces/engine.ts:81

**Parameters:**

Name | Type |
------ | ------ |
`id` | any |

**Returns:** *Node*

###  getState

▸ **getState**(): *IInstanceData*

Defined in src/interfaces/engine.ts:105

**Returns:** *IInstanceData*

###  getToken

▸ **getToken**(`id`: number): *IToken*

Defined in src/interfaces/engine.ts:82

**Parameters:**

Name | Type |
------ | ------ |
`id` | number |

**Returns:** *IToken*

###  getUUID

▸ **getUUID**(): *any*

Defined in src/interfaces/engine.ts:111

**Returns:** *any*

###  log

▸ **log**(`msg`: any): *void*

Defined in src/interfaces/engine.ts:114

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

###  report

▸ **report**(): *void*

Defined in src/interfaces/engine.ts:108

**Returns:** *void*

###  restored

▸ **restored**(): *void*

Defined in src/interfaces/engine.ts:106

**Returns:** *void*

###  resume

▸ **resume**(): *void*

Defined in src/interfaces/engine.ts:107

**Returns:** *void*

###  signal

▸ **signal**(`executionId`: any, `inputData`: any): *Promise‹void›*

Defined in src/interfaces/engine.ts:103

invoke scenarios:
     itemId
     elementId   - but only one is active
     elementId   - for a startEvent in a secondary process

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`executionId` | any | - |
`inputData` | any |   |

**Returns:** *Promise‹void›*

###  stop

▸ **stop**(): *void*

Defined in src/interfaces/engine.ts:90

causes the execution to stop from running any further

**Returns:** *void*

###  terminate

▸ **terminate**(): *void*

Defined in src/interfaces/engine.ts:91

**Returns:** *void*

###  tokenEnded

▸ **tokenEnded**(`token`: IToken): *void*

Defined in src/interfaces/engine.ts:83

**Parameters:**

Name | Type |
------ | ------ |
`token` | IToken |

**Returns:** *void*

___

###  IExecutionContext

• **IExecutionContext**:

Defined in src/interfaces/engine.ts:172

###  appDelegate

• **appDelegate**: *any*

Defined in src/interfaces/engine.ts:182

###  cache

• **cache**: *any*

Defined in src/interfaces/engine.ts:180

###  configuration

• **configuration**: *any*

Defined in src/interfaces/engine.ts:175

###  cron

• **cron**: *any*

Defined in src/interfaces/engine.ts:179

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/engine.ts:177

###  definitions

• **definitions**: *any*

Defined in src/interfaces/engine.ts:181

###  engine

• **engine**: *any*

Defined in src/interfaces/engine.ts:178

###  errors

• **errors**: *any*

Defined in src/interfaces/engine.ts:194

### `Optional` execution

• **execution**? : *IExecution*

Defined in src/interfaces/engine.ts:184

###  instance

• **instance**: *any*

Defined in src/interfaces/engine.ts:187

###  item

• **item**: *any*

Defined in src/interfaces/engine.ts:190

###  items

• **items**: *IItem[]*

Defined in src/interfaces/engine.ts:195

###  listener

• **listener**: *any*

Defined in src/interfaces/engine.ts:185

###  logger

• **logger**: *any*

Defined in src/interfaces/engine.ts:176

### `Optional` parentContext

• **parentContext**? : *IExecutionContext*

Defined in src/interfaces/engine.ts:200

###  process

• **process**: *any*

Defined in src/interfaces/engine.ts:189

###  response

• **response**: *IExecutionResponse*

Defined in src/interfaces/engine.ts:191

###  server

• **server**: *any*

Defined in src/interfaces/engine.ts:174

###  worker

• **worker**: *any*

Defined in src/interfaces/engine.ts:201

###  error

▸ **error**(`error`: any): *IExecutionContext*

Defined in src/interfaces/engine.ts:196

**Parameters:**

Name | Type |
------ | ------ |
`error` | any |

**Returns:** *IExecutionContext*

###  tillDone

▸ **tillDone**(): *any*

Defined in src/interfaces/engine.ts:202

**Returns:** *any*

___

###  IExecutionResponse

• **IExecutionResponse**:

Defined in src/interfaces/engine.ts:159

Defined in src/interfaces/engine.ts:165

###  action

• **action**: *any*

Defined in src/interfaces/engine.ts:168

###  errors

• **errors**: *any*

Defined in src/interfaces/engine.ts:161

###  input

• **input**: *any*

Defined in src/interfaces/engine.ts:166

###  instance

• **instance**: *IInstanceData*

Defined in src/interfaces/engine.ts:160

###  items

• **items**: *IItemData[]*

Defined in src/interfaces/engine.ts:162

###  messageMatchingKey

• **messageMatchingKey**: *any*

Defined in src/interfaces/engine.ts:169

###  output

• **output**: *any*

Defined in src/interfaces/engine.ts:167

___

###  IFlow

• **IFlow**:

Defined in src/interfaces/elements.ts:36

###  behaviours

• **behaviours**: *Map‹any, any›*

*Inherited from void*

Defined in src/interfaces/elements.ts:23

###  id

• **id**: *any*

*Inherited from void*

Defined in src/interfaces/elements.ts:20

###  name

• **name**: *any*

*Inherited from void*

Defined in src/interfaces/elements.ts:22

###  type

• **type**: *any*

*Inherited from void*

Defined in src/interfaces/elements.ts:21

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Inherited from void*

Defined in src/interfaces/elements.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  continue

▸ **continue**(`item`: IItem): *void*

*Inherited from void*

Defined in src/interfaces/elements.ts:24

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

###  describe

▸ **describe**(): *string[][]*

*Inherited from void*

Defined in src/interfaces/elements.ts:25

**Returns:** *string[][]*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Inherited from void*

Defined in src/interfaces/elements.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Inherited from void*

Defined in src/interfaces/elements.ts:32

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  restored

▸ **restored**(`item`: IItem): *void*

*Inherited from void*

Defined in src/interfaces/elements.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

###  resume

▸ **resume**(`item`: IItem): *void*

*Inherited from void*

Defined in src/interfaces/elements.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

___

###  IInstanceData

• **IInstanceData**:

Defined in src/interfaces/engine.ts:135

###  data

• **data**: *any*

Defined in src/interfaces/engine.ts:142

###  endedAt

• **endedAt**: *any*

Defined in src/interfaces/engine.ts:140

###  id

• **id**: *any*

Defined in src/interfaces/engine.ts:136

###  items

• **items**: *any*

Defined in src/interfaces/engine.ts:143

###  logs

• **logs**: *any*

Defined in src/interfaces/engine.ts:145

###  loops

• **loops**: *any*

Defined in src/interfaces/engine.ts:147

###  name

• **name**: *any*

Defined in src/interfaces/engine.ts:137

###  parentItemId

• **parentItemId**: *any*

Defined in src/interfaces/engine.ts:148

###  saved

• **saved**: *any*

Defined in src/interfaces/engine.ts:141

###  source

• **source**: *any*

Defined in src/interfaces/engine.ts:144

###  startedAt

• **startedAt**: *any*

Defined in src/interfaces/engine.ts:139

###  status

• **status**: *any*

Defined in src/interfaces/engine.ts:138

###  tokens

• **tokens**: *any*

Defined in src/interfaces/engine.ts:146

___

###  IItem

• **IItem**:

Defined in src/interfaces/engine.ts:151

###  context

• **context**: *IExecutionContext*

Defined in src/interfaces/engine.ts:154

###  data

• **data**: *any*

*Inherited from void*

Defined in src/interfaces/engine.ts:131

###  element

• **element**: *Element*

Defined in src/interfaces/engine.ts:152

###  elementId

• **elementId**: *string*

*Inherited from void*

Defined in src/interfaces/engine.ts:122

###  endedAt

• **endedAt**: *any*

*Inherited from void*

Defined in src/interfaces/engine.ts:127

###  id

• **id**: *string*

*Inherited from void*

Defined in src/interfaces/engine.ts:120

###  itemKey

• **itemKey**: *string*

*Inherited from void*

Defined in src/interfaces/engine.ts:121

###  messageId

• **messageId**: *any*

*Inherited from void*

Defined in src/interfaces/engine.ts:132

###  name

• **name**: *string*

*Inherited from void*

Defined in src/interfaces/engine.ts:123

###  node

• **node**: *Node*

Defined in src/interfaces/engine.ts:155

###  seq

• **seq**: *any*

*Inherited from void*

Defined in src/interfaces/engine.ts:128

###  signalId

• **signalId**: *any*

*Inherited from void*

Defined in src/interfaces/engine.ts:133

###  startedAt

• **startedAt**: *any*

*Inherited from void*

Defined in src/interfaces/engine.ts:126

###  status

• **status**: *ITEM_STATUS*

*Inherited from void*

Defined in src/interfaces/engine.ts:130

###  timeDue

• **timeDue**: *Date*

*Inherited from void*

Defined in src/interfaces/engine.ts:129

###  token

• **token**: *Token*

Defined in src/interfaces/engine.ts:153

###  tokenId

• **tokenId**: *any*

*Inherited from void*

Defined in src/interfaces/engine.ts:125

###  type

• **type**: *string*

*Inherited from void*

Defined in src/interfaces/engine.ts:124

___

###  IItemData

• **IItemData**:

Defined in src/interfaces/engine.ts:119

###  data

• **data**: *any*

Defined in src/interfaces/engine.ts:131

###  elementId

• **elementId**: *string*

Defined in src/interfaces/engine.ts:122

###  endedAt

• **endedAt**: *any*

Defined in src/interfaces/engine.ts:127

###  id

• **id**: *string*

Defined in src/interfaces/engine.ts:120

###  itemKey

• **itemKey**: *string*

Defined in src/interfaces/engine.ts:121

###  messageId

• **messageId**: *any*

Defined in src/interfaces/engine.ts:132

###  name

• **name**: *string*

Defined in src/interfaces/engine.ts:123

###  seq

• **seq**: *any*

Defined in src/interfaces/engine.ts:128

###  signalId

• **signalId**: *any*

Defined in src/interfaces/engine.ts:133

###  startedAt

• **startedAt**: *any*

Defined in src/interfaces/engine.ts:126

###  status

• **status**: *ITEM_STATUS*

Defined in src/interfaces/engine.ts:130

###  timeDue

• **timeDue**: *Date*

Defined in src/interfaces/engine.ts:129

###  tokenId

• **tokenId**: *any*

Defined in src/interfaces/engine.ts:125

###  type

• **type**: *string*

Defined in src/interfaces/engine.ts:124

___

###  ILogger

• **ILogger**:

Defined in src/interfaces/common.ts:32

A logging tool to take various message for monitoring and debugging

it can also keep the message in memory till saved later through saveToFile
msgs can be cleared by the clean method

###  clear

▸ **clear**(): *void*

Defined in src/interfaces/common.ts:47

**Returns:** *void*

###  debug

▸ **debug**(`message`: any): *void*

Defined in src/interfaces/common.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

###  error

▸ **error**(`err`: any): *void*

Defined in src/interfaces/common.ts:52

**Parameters:**

Name | Type |
------ | ------ |
`err` | any |

**Returns:** *void*

###  get

▸ **get**(): *any[]*

Defined in src/interfaces/common.ts:48

**Returns:** *any[]*

###  log

▸ **log**(`message`: any): *void*

Defined in src/interfaces/common.ts:51

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

###  save

▸ **save**(`filename`: any): *Promise‹void›*

Defined in src/interfaces/common.ts:53

**Parameters:**

Name | Type |
------ | ------ |
`filename` | any |

**Returns:** *Promise‹void›*

###  setOptions

▸ **setOptions**(`__namedParameters`: object): *void*

Defined in src/interfaces/common.ts:42

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type | Description |
------ | ------ | ------ |
`callback` | any | - |
`toConsole` | any | boolean  writes to the output console |
`toFile` | any | string writes to file   |

**Returns:** *void*

###  warn

▸ **warn**(`message`: any): *void*

Defined in src/interfaces/common.ts:50

**Parameters:**

Name | Type |
------ | ------ |
`message` | any |

**Returns:** *void*

___

###  IModelsDatastore

• **IModelsDatastore**:

Defined in src/interfaces/datastore.ts:27

###  deleteModel

▸ **deleteModel**(`name`: any): *Promise‹void›*

Defined in src/interfaces/datastore.ts:41

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹void›*

###  findEvents

▸ **findEvents**(`query`: any): *Promise‹any[]›*

Defined in src/interfaces/datastore.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`query` | any |

**Returns:** *Promise‹any[]›*

###  getList

▸ **getList**(): *Promise‹string[]›*

Defined in src/interfaces/datastore.ts:28

**Returns:** *Promise‹string[]›*

###  getSVG

▸ **getSVG**(`name`: any): *Promise‹string›*

Defined in src/interfaces/datastore.ts:30

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

###  getSource

▸ **getSource**(`name`: any): *Promise‹string›*

Defined in src/interfaces/datastore.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹string›*

###  import

▸ **import**(`data`: any): *any*

Defined in src/interfaces/datastore.ts:38

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *any*

###  install

▸ **install**(): *any*

Defined in src/interfaces/datastore.ts:37

**Returns:** *any*

###  load

▸ **load**(`name`: any): *Promise‹IDefinition›*

Defined in src/interfaces/datastore.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹IDefinition›*

###  loadModel

▸ **loadModel**(`name`: any): *Promise‹IBpmnModelData›*

Defined in src/interfaces/datastore.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *Promise‹IBpmnModelData›*

###  renameModel

▸ **renameModel**(`name`: any, `newName`: any): *Promise‹boolean›*

Defined in src/interfaces/datastore.ts:42

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`newName` | any |

**Returns:** *Promise‹boolean›*

###  save

▸ **save**(`name`: any, `bpmn`: any, `svg?`: any): *Promise‹boolean›*

Defined in src/interfaces/datastore.ts:31

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |
`bpmn` | any |
`svg?` | any |

**Returns:** *Promise‹boolean›*

###  saveModel

▸ **saveModel**(`model`: IBpmnModelData): *Promise‹boolean›*

Defined in src/interfaces/datastore.ts:40

**Parameters:**

Name | Type |
------ | ------ |
`model` | IBpmnModelData |

**Returns:** *Promise‹boolean›*

___

###  INode

• **INode**:

Defined in src/interfaces/elements.ts:39

###  behaviours

• **behaviours**: *Map‹any, any›*

*Inherited from void*

Defined in src/interfaces/elements.ts:23

###  def

• **def**: *any*

Defined in src/interfaces/elements.ts:42

###  id

• **id**: *any*

*Inherited from void*

Defined in src/interfaces/elements.ts:20

###  inbounds

• **inbounds**: *any[]*

Defined in src/interfaces/elements.ts:44

###  name

• **name**: *any*

*Overrides void*

Defined in src/interfaces/elements.ts:40

###  outbounds

• **outbounds**: *any[]*

Defined in src/interfaces/elements.ts:43

###  processId

• **processId**: *any*

Defined in src/interfaces/elements.ts:41

###  type

• **type**: *any*

*Inherited from void*

Defined in src/interfaces/elements.ts:21

###  addBehaviour

▸ **addBehaviour**(`nane`: any, `behavriour`: any): *void*

*Inherited from void*

Defined in src/interfaces/elements.ts:34

**Parameters:**

Name | Type |
------ | ------ |
`nane` | any |
`behavriour` | any |

**Returns:** *void*

###  canBeInvoked

▸ **canBeInvoked**(): *boolean*

Defined in src/interfaces/elements.ts:48

**Returns:** *boolean*

###  continue

▸ **continue**(`item`: IItem): *Promise‹void›*

*Overrides void*

Defined in src/interfaces/elements.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *Promise‹void›*

###  describe

▸ **describe**(): *string[][]*

*Inherited from void*

Defined in src/interfaces/elements.ts:25

**Returns:** *string[][]*

###  doEvent

▸ **doEvent**(`item`: IItem, `event`: EXECUTION_EVENT, `newStatus`: ITEM_STATUS): *Promise‹void›*

Defined in src/interfaces/elements.ts:45

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |
`event` | EXECUTION_EVENT |
`newStatus` | ITEM_STATUS |

**Returns:** *Promise‹void›*

###  end

▸ **end**(`item`: IItem): *Promise‹void›*

Defined in src/interfaces/elements.ts:62

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *Promise‹void›*

###  enter

▸ **enter**(`item`: IItem): *void*

Defined in src/interfaces/elements.ts:46

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

###  execute

▸ **execute**(`item`: IItem): *Promise‹void | error | abort | wait›*

Defined in src/interfaces/elements.ts:58

this is the primary exectuion method for a node

considerations: the following are handled by Token
     1.  Loops we are inside a loop already (if any)
     2.  Gatways
     3.  Subprocess the parent node is fired as normal
             run method will fire the subprocess invoking a new token and will go into wait

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *Promise‹void | error | abort | wait›*

###  getBehaviour

▸ **getBehaviour**(`name`: any): *any*

*Inherited from void*

Defined in src/interfaces/elements.ts:33

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *any*

###  getOutbounds

▸ **getOutbounds**(`item`: IItem): *IItem[]*

Defined in src/interfaces/elements.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *IItem[]*

###  hasBehaviour

▸ **hasBehaviour**(`name`: any): *boolean*

*Inherited from void*

Defined in src/interfaces/elements.ts:32

respond by providing behaviour attributes beyond item and node information
 ex: timer due , input/outupt , fields

**Parameters:**

Name | Type |
------ | ------ |
`name` | any |

**Returns:** *boolean*

###  init

▸ **init**(`item`: IItem): *void*

Defined in src/interfaces/elements.ts:69

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

###  requiresWait

▸ **requiresWait**(): *boolean*

Defined in src/interfaces/elements.ts:47

**Returns:** *boolean*

###  restored

▸ **restored**(`item`: IItem): *void*

*Inherited from void*

Defined in src/interfaces/elements.ts:26

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *void*

###  resume

▸ **resume**(`item`: IItem): *void*

*Overrides void*

Defined in src/interfaces/elements.ts:68

is called by the token after an execution resume for every active (in wait) item
different than init, which is called for all items

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`item` | IItem |   |

**Returns:** *void*

###  run

▸ **run**(`item`: IItem): *Promise‹NODE_ACTION›*

Defined in src/interfaces/elements.ts:61

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *Promise‹NODE_ACTION›*

###  start

▸ **start**(`item`: IItem): *Promise‹NODE_ACTION›*

Defined in src/interfaces/elements.ts:60

**Parameters:**

Name | Type |
------ | ------ |
`item` | IItem |

**Returns:** *Promise‹NODE_ACTION›*

___

###  IProcessData

• **IProcessData**:

Defined in src/interfaces/datastore.ts:88

###  id

• **id**: *any*

Defined in src/interfaces/datastore.ts:89

###  isExecutable

• **isExecutable**: *any*

Defined in src/interfaces/datastore.ts:91

###  name

• **name**: *any*

Defined in src/interfaces/datastore.ts:90

___

###  IServerComponent

• **IServerComponent**:

Defined in src/interfaces/server.ts:28

###  appDelegate

• **appDelegate**: *any*

Defined in src/interfaces/server.ts:37

###  cache

• **cache**: *any*

Defined in src/interfaces/server.ts:35

###  configuration

• **configuration**: *any*

Defined in src/interfaces/server.ts:30

###  cron

• **cron**: *any*

Defined in src/interfaces/server.ts:34

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/server.ts:32

###  definitions

• **definitions**: *any*

Defined in src/interfaces/server.ts:36

###  engine

• **engine**: *any*

Defined in src/interfaces/server.ts:33

###  logger

• **logger**: *any*

Defined in src/interfaces/server.ts:31

###  server

• **server**: *any*

Defined in src/interfaces/server.ts:29

___

###  IServerContext

• **IServerContext**:

Defined in src/interfaces/server.ts:8

is used as a repsone to server request

###  appDelegate

• **appDelegate**: *any*

Defined in src/interfaces/server.ts:12

###  configuration

• **configuration**: *any*

Defined in src/interfaces/server.ts:9

###  dataStore

• **dataStore**: *any*

Defined in src/interfaces/server.ts:13

###  definitions

• **definitions**: *any*

Defined in src/interfaces/server.ts:11

###  logger

• **logger**: *any*

Defined in src/interfaces/server.ts:10

___

###  IToken

• **IToken**:

Defined in src/interfaces/engine.ts:7

###  childrenTokens

• **childrenTokens**: *Token[]*

Defined in src/interfaces/engine.ts:26

###  currentItem

• **currentItem**: *IItem*

Defined in src/interfaces/engine.ts:23

###  currentNode

• **currentNode**: *any*

Defined in src/interfaces/engine.ts:19

###  data

• **data**: *any*

Defined in src/interfaces/engine.ts:22

###  dataPath

• **dataPath**: *string*

Defined in src/interfaces/engine.ts:12

###  execution

• **execution**: *IExecution*

Defined in src/interfaces/engine.ts:11

###  firstItem

• **firstItem**: *Item*

Defined in src/interfaces/engine.ts:25

###  id

• **id**: *any*

Defined in src/interfaces/engine.ts:9

###  lastItem

• **lastItem**: *IItem*

Defined in src/interfaces/engine.ts:24

###  loop

• **loop**: *any*

Defined in src/interfaces/engine.ts:18

###  originItem

• **originItem**: *IItem*

Defined in src/interfaces/engine.ts:16

### `Optional` parentToken

• **parentToken**? : *IToken*

Defined in src/interfaces/engine.ts:14

###  path

• **path**: *IItem[]*

Defined in src/interfaces/engine.ts:17

###  processId

• **processId**: *any*

Defined in src/interfaces/engine.ts:20

###  startNodeId

• **startNodeId**: *any*

Defined in src/interfaces/engine.ts:13

###  status

• **status**: *TOKEN_STATUS*

Defined in src/interfaces/engine.ts:21

###  type

• **type**: *any*

Defined in src/interfaces/engine.ts:10

###  applyInput

▸ **applyInput**(`inputData`: any): *void*

Defined in src/interfaces/engine.ts:49

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *void*

###  end

▸ **end**(): *Promise‹void›*

Defined in src/interfaces/engine.ts:56

**Returns:** *Promise‹void›*

###  execute

▸ **execute**(`inputData`: any): *Promise‹any›*

Defined in src/interfaces/engine.ts:48

this is the primary exectuion method for a token

**Parameters:**

Name | Type |
------ | ------ |
`inputData` | any |

**Returns:** *Promise‹any›*

###  getChildrenTokens

▸ **getChildrenTokens**(): *any[]*

Defined in src/interfaces/engine.ts:42

**Returns:** *any[]*

###  getSubProcessToken

▸ **getSubProcessToken**(): *IToken*

Defined in src/interfaces/engine.ts:58

**Returns:** *IToken*

###  goNext

▸ **goNext**(): *Promise‹void›*

Defined in src/interfaces/engine.ts:57

**Returns:** *Promise‹void›*

###  log

▸ **log**(`msg`: any): *void*

Defined in src/interfaces/engine.ts:59

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

###  preExecute

▸ **preExecute**(): *Promise‹boolean›*

Defined in src/interfaces/engine.ts:43

**Returns:** *Promise‹boolean›*

###  preNext

▸ **preNext**(): *Promise‹boolean›*

Defined in src/interfaces/engine.ts:44

**Returns:** *Promise‹boolean›*

###  processError

▸ **processError**(): *any*

Defined in src/interfaces/engine.ts:40

**Returns:** *any*

###  restored

▸ **restored**(): *void*

Defined in src/interfaces/engine.ts:41

**Returns:** *void*

###  resume

▸ **resume**(): *void*

Defined in src/interfaces/engine.ts:38

**Returns:** *void*

###  save

▸ **save**(): *object*

Defined in src/interfaces/engine.ts:27

**Returns:** *object*

* **currentNode**: *any*

* **dataPath**: *string*

* **id**: *any*

* **loopId**: *any*

* **originItem**: *any*

* **parentToken**: *any*

* **startNodeId**: *any*

* **status**: *TOKEN_STATUS*

* **type**: *any*

###  signal

▸ **signal**(`data`: any): *Promise‹any›*

Defined in src/interfaces/engine.ts:55

**Parameters:**

Name | Type |
------ | ------ |
`data` | any |

**Returns:** *Promise‹any›*

###  stop

▸ **stop**(): *void*

Defined in src/interfaces/engine.ts:39

**Returns:** *void*

###  terminate

▸ **terminate**(): *void*

Defined in src/interfaces/engine.ts:54

 is called by Gateways to cancel current token

**Returns:** *void*

## Variables

###  BINARY_OPERATORS

• **BINARY_OPERATORS**: *string[]* = ['and', 'or', 'not', '!']

Defined in node_modules/dmn-engine/ExpressionParser.ts:23

___

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

Defined in node_modules/dmn-engine/common.ts:3

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

### `Const` OPERATORS

• **OPERATORS**: *string[]* = ['*', '+', '-', , `/`,
    `<`, `>`, `>=`, `<=`]

Defined in node_modules/dmn-engine/Operator.ts:6

Defined in node_modules/dmn-engine/ExpressionParser.ts:24

___

### `Const` Path

• **Path**: *any* = require('path')

Defined in src/datastore/ModelsDatastore.ts:10

Defined in src/datastore/ModelsData.ts:7

Defined in src/datastore/ModelsDatastoreDB.ts:9

___

### `Let` REGEX

• **REGEX**: *string* = ""

Defined in node_modules/dmn-engine/ExpressionParser.ts:15

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

### `Const` configPath

• **configPath**: *string* = cwd + '/configuration.js'

Defined in install.ts:7

___

### `Let` configuration

• **configuration**: *any*

Defined in install.ts:6

___

### `Const` cwd

• **cwd**: *string* = process.cwd()

Defined in install.ts:4

___

###  defaultConfiguration

• **defaultConfiguration**: *Configuration‹›* = new Configuration(
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

Defined in src/elements/behaviours/Behaviour.ts:8

Defined in src/server/Cron.ts:8

Defined in src/elements/behaviours/BehaviourLoader.ts:9

___

### `Const` end

• **end**: *any* = duration.end

Defined in src/elements/behaviours/Behaviour.ts:10

Defined in src/server/Cron.ts:10

Defined in src/elements/behaviours/BehaviourLoader.ts:11

___

### `Const` fs

• **fs**: *any* = require('fs')

Defined in src/engine/Execution.ts:3

Defined in src/engine/Token.ts:3

Defined in src/datastore/DataStore.ts:7

Defined in src/datastore/ModelsDatastore.ts:9

Defined in src/datastore/ModelsData.ts:6

Defined in src/server/CacheManager.ts:7

Defined in src/server/BPMNServer.ts:10

Defined in src/elements/Definition.ts:15

Defined in node_modules/dmn-engine/DecisionTable.ts:4

Defined in src/datastore/ModelsDatastoreDB.ts:8

Defined in install.ts:3

___

###  group1

• **group1**: *string* = `[0-9\.]+`

Defined in node_modules/dmn-engine/ExpressionParser.ts:9

___

###  group2

• **group2**: *string* = `[a-zA-Z0-9\u0080-\u00FF\.\_]+`

Defined in node_modules/dmn-engine/ExpressionParser.ts:10

___

###  group3

• **group3**: *string* = `[,|!|\?|\)|\(|\"|\'|<|=|>|\+|\-|\*|\/]`

Defined in node_modules/dmn-engine/ExpressionParser.ts:11

___

###  group4

• **group4**: *string* = "\s"

Defined in node_modules/dmn-engine/ExpressionParser.ts:12

___

###  group5

• **group5**: *string* = `[^A-Za-z]`

Defined in node_modules/dmn-engine/ExpressionParser.ts:13

___

### `Const` logger

• **logger**: *any* = new DefaultLogger({ toConsole: false })

Defined in node_modules/dmn-engine/common.ts:150

Defined in src/helpers/ServerHelper.ts:5

___

### `Const` mongoose

• **mongoose**: *any* = require('mongoose')

Defined in src/datastore/MongoDB.ts:5

___

### `Const` operatorList

• **operatorList**: *(string | number | number[])[][]* = [
    ['^',10 , [1, 1], [1, 1]],
    ['*',20, [1, 1], [1, 1]],
    ['-',30, [1, 1], [1, 1]],
    ['+',40,  [1, 1], [1, 1]],
    ['/',50, [1, 1], [1, 1]],
    ['<',60, [0, 1], [1, 1]],
    ['>',70, [0, 1], [1, 1]],
    ['<=',80, [0, 1], [1, 1]],
    ['>=',90, [0, 1], [1, 1]],
    ['==',100, [0, 1], [1, 1]],
    ['and',110, [1, 1], [1, 1]],
    ['or',120, [1, 1], [1, 1]],
    ['not',130, [0, 1], [0, 1]],
    ['between',140, [0, 1], [1, 1]],     // since and will run first to make 2 into 1
]

Defined in node_modules/dmn-engine/Operator.ts:114

___

### `Const` parse

• **parse**: *any* = duration.parse

Defined in src/elements/behaviours/Behaviour.ts:9

Defined in src/server/Cron.ts:9

Defined in src/elements/behaviours/BehaviourLoader.ts:10

___

###  seq

• **seq**: *number* = 1

Defined in src/engine/DefaultAppDelegate.ts:5

___

### `Const` toSeconds

• **toSeconds**: *any* = duration.toSeconds

Defined in src/elements/behaviours/Behaviour.ts:11

Defined in src/server/Cron.ts:11

Defined in src/elements/behaviours/BehaviourLoader.ts:12

___

###  uuidv4

• **uuidv4**: *any*

Defined in src/engine/Execution.ts:13

## Functions

###  Execute

▸ **Execute**(`__namedParameters`: object): *any*

Defined in node_modules/dmn-engine/index.ts:14

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`data` | any |
`definition` | any |
`loadFrom` | any |
`options` | any |

**Returns:** *any*

___

###  Log

▸ **Log**(`msg`: any): *void*

Defined in src/helpers/ServerHelper.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`msg` | any |

**Returns:** *void*

___

###  WebService

▸ **WebService**(`request`: any, `response`: any): *Promise‹void›*

Defined in node_modules/dmn-engine/index.ts:8

**Parameters:**

Name | Type |
------ | ------ |
`request` | any |
`response` | any |

**Returns:** *Promise‹void›*

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

###  debug

▸ **debug**(`type`: any, `title`: any, `obj`: any): *void*

Defined in node_modules/dmn-engine/common.ts:40

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

Defined in src/engine/DefaultAppDelegate.ts:106

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

###  install

▸ **install**(): *Promise‹void›*

Defined in install.ts:21

**Returns:** *Promise‹void›*

___

###  removeFromArray

▸ **removeFromArray**(`array`: any, `item`: any): *void*

Defined in node_modules/dmn-engine/ExpressionNode.ts:135

**Parameters:**

Name | Type |
------ | ------ |
`array` | any |
`item` | any |

**Returns:** *void*

___

###  test

▸ **test**(): *void*

Defined in src/engine/Model.ts:76

**Returns:** *void*

___

###  trimParam

▸ **trimParam**(`param`: any): *any*

Defined in node_modules/dmn-engine/DecisionTable.ts:161

**Parameters:**

Name | Type |
------ | ------ |
`param` | any |

**Returns:** *any*

## Object literals

### `Const` Behaviour_names

### ▪ **Behaviour_names**: *object*

Defined in src/elements/behaviours/BehaviourLoader.ts:14

###  CamundaFormData

• **CamundaFormData**: *string* = "camunda:formData"

Defined in src/elements/behaviours/BehaviourLoader.ts:22

###  CamundaScript

• **CamundaScript**: *string* = "camunda:script"

Defined in src/elements/behaviours/BehaviourLoader.ts:23

###  ErrorEventDefinition

• **ErrorEventDefinition**: *string* = "bpmn:ErrorEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:21

###  IOSpecification

• **IOSpecification**: *string* = "ioSpecification"

Defined in src/elements/behaviours/BehaviourLoader.ts:17

###  LoopCharacteristics

• **LoopCharacteristics**: *string* = "loopCharacteristics"

Defined in src/elements/behaviours/BehaviourLoader.ts:16

###  MessageEventDefinition

• **MessageEventDefinition**: *string* = "bpmn:MessageEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:19

###  SignalEventDefinition

• **SignalEventDefinition**: *string* = "bpmn:SignalEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:20

###  TerminateEventDefinition

• **TerminateEventDefinition**: *string* = "bpmn:TerminateEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:18

###  TimerEventDefinition

• **TimerEventDefinition**: *string* = "bpmn:TimerEventDefinition"

Defined in src/elements/behaviours/BehaviourLoader.ts:15

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

• **types**: *(object | object)[]* = [{
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
