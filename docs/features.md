Features
=========

<!-- tocstop -->

The following elements are tested and supported.

- Definition: Executable BPMN 2 definition
- Process: Executes and keeps track of activity elements

# Tasks
- ReceiveTask
- ScriptTask
- ManualTask
- UserTask
- ServiceTask
- BusinessRuleTask: Same behaviour as ServiceTask
- SendTask: Same behaviour as ServiceTask
- SignalTask
# Behaviour
- StandardLoopCharacteristics
- MultiInstanceLoopCharacteristics
# Events
- StartEvent
- EndEvent 
- IntermediateCatchEvent
- IntermediateThrowEvent
# Event Behaviour
- MessageEventDefinition
- ConditionalEventDefinition
- CompensateEventDefinition
- TerminateEventDefinition
- TimerEventDefinition
- SignalEventDefinition
# Gateways
- EventBasedGateway
- ExclusiveGateway
- InclusiveGateway
- ParallelGateway
# Flows
- SequenceFlow
- MessageFlow
# Data
- IoSpecification
- DataObject
# Other
- SubProcess
- Lane
- Pool
# Special
- BpmnError
- BoundaryEvent
- compensate by outbound Association
- Error
- ErrorEventDefinition
- EscalationEventDefinition
- LinkEventDefinition
- ServiceImplementation: ServiceTask implementation attribute behaviour


# BPMN 2

BPMN 2 is an OMG standard and is widely supported by various modelling tools 

# Executable Workflow

BPMN-Server is built on top of bpmn-engine that provides an excellent solution for executable workflow,

# Instance Persistence 

# Accessible to your App

# Logging and debugging

# Web Interface

# Built for Integration

This package is not intended to be used as a stand-alone but rather be integrated with your applicaton. 
The Web interface serve only as a prototype to be integrated in your solution.
		

