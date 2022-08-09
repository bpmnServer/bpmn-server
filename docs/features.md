Features
=========

<!-- tocstop -->
- [Modeling]()
- [Persistence](#Persistence)
- [Data Query](#data-query)
- [Customization](#customization)
- [Cache]()
- [Logging]()


# Persistence 

# Data Query

# Customization
# BPMN Elements

The following elements are tested and supported.

## Tasks
- ReceiveTask
- ScriptTask
- ManualTask
  Same as user task
- UserTask
- ServiceTask
- [Business Rule Task](./examples#BusinessRuleTask) 
- SendTask: Same behaviour as ServiceTask
- SignalTask
## Behaviour
- StandardLoopCharacteristics
- MultiInstanceLoopCharacteristics
## Events
- StartEvent
- Multiple start events in process
- End Event 
- Intermediate Catch Event
- Intermediate Throw Event
- Boundary Event
## Event Behaviour
- Message EventDefinition
- TerminateEventDefinition
- TimerEventDefinition
- SignalEventDefinition
- BoundaryEvent
## Gateways
- EventBasedGateway
- ExclusiveGateway
- InclusiveGateway
- ParallelGateway
## Flows
- SequenceFlow
- Conditional Sequence Flow
- MessageFlow
## Data
- IoSpecification
- Input transformation
- Output transformation
- Message matching Key
- Signal matching key
- DataObject
## Other
- SubProcess
- Call Task
- Lane
- Pool
- ErrorEventDefinition
## Special
- [Script Events](./examples#ScriptExtensions) 

## Pending 
- BpmnError
- compensate by outbound Association
- Error
- EscalationEventDefinition

		

