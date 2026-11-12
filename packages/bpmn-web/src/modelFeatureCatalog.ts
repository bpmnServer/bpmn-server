// Made from docs/features.yaml by `npm run features`: edit the catalog, not this file.
// The features that show in a model's XML, and what shows them (modelFeatures.js): the Design dashboard's filter.
export const MODEL_FEATURES: { id: string, name: string, area: string, xml: string[] }[] = [
    {
        "id": "user-task",
        "name": "User task",
        "area": "modeling",
        "xml": [
            "bpmn:userTask"
        ]
    },
    {
        "id": "service-task",
        "name": "Service task",
        "area": "modeling",
        "xml": [
            "bpmn:serviceTask"
        ]
    },
    {
        "id": "script-task",
        "name": "Script task",
        "area": "modeling",
        "xml": [
            "bpmn:scriptTask"
        ]
    },
    {
        "id": "send-receive-task",
        "name": "Send and receive tasks",
        "area": "modeling",
        "xml": [
            "bpmn:sendTask",
            "bpmn:receiveTask"
        ]
    },
    {
        "id": "business-rule-task",
        "name": "Business rule task",
        "area": "modeling",
        "xml": [
            "bpmn:businessRuleTask"
        ]
    },
    {
        "id": "call-activity",
        "name": "Call activity",
        "area": "modeling",
        "xml": [
            "bpmn:callActivity"
        ]
    },
    {
        "id": "manual-task",
        "name": "Manual task, plain task",
        "area": "modeling",
        "xml": [
            "bpmn:manualTask"
        ]
    },
    {
        "id": "sub-process",
        "name": "Embedded sub-process",
        "area": "modeling",
        "xml": [
            "bpmn:subProcess"
        ]
    },
    {
        "id": "event-sub-process",
        "name": "Event sub-process",
        "area": "modeling",
        "xml": [
            "bpmn:subProcess[triggeredByEvent=true]"
        ]
    },
    {
        "id": "transaction",
        "name": "Transaction, compensation and cancel",
        "area": "modeling",
        "xml": [
            "bpmn:transaction",
            "bpmn:compensateEventDefinition",
            "bpmn:cancelEventDefinition"
        ]
    },
    {
        "id": "ad-hoc-sub-process",
        "name": "Ad hoc sub-process",
        "area": "modeling",
        "xml": [
            "bpmn:adHocSubProcess"
        ]
    },
    {
        "id": "exclusive-gateway",
        "name": "Exclusive gateway, conditions, default flow",
        "area": "modeling",
        "xml": [
            "bpmn:exclusiveGateway"
        ]
    },
    {
        "id": "parallel-gateway",
        "name": "Parallel gateway",
        "area": "modeling",
        "xml": [
            "bpmn:parallelGateway"
        ]
    },
    {
        "id": "inclusive-gateway",
        "name": "Inclusive gateway",
        "area": "modeling",
        "xml": [
            "bpmn:inclusiveGateway"
        ]
    },
    {
        "id": "event-based-gateway",
        "name": "Event-based gateway",
        "area": "modeling",
        "xml": [
            "bpmn:eventBasedGateway"
        ]
    },
    {
        "id": "complex-gateway",
        "name": "Complex gateway",
        "area": "modeling",
        "xml": [
            "bpmn:complexGateway"
        ]
    },
    {
        "id": "start-events",
        "name": "Start events, several per model",
        "area": "modeling",
        "xml": [
            "bpmn:startEvent"
        ]
    },
    {
        "id": "end-events",
        "name": "End events, terminate",
        "area": "modeling",
        "xml": [
            "bpmn:endEvent"
        ]
    },
    {
        "id": "boundary-events",
        "name": "Boundary events, interrupting or not",
        "area": "modeling",
        "xml": [
            "bpmn:boundaryEvent"
        ]
    },
    {
        "id": "timers",
        "name": "Timers — duration, cycle, date",
        "area": "modeling",
        "xml": [
            "bpmn:timerEventDefinition"
        ]
    },
    {
        "id": "messages-signals",
        "name": "Messages and signals",
        "area": "modeling",
        "xml": [
            "bpmn:messageEventDefinition",
            "bpmn:signalEventDefinition"
        ]
    },
    {
        "id": "errors-escalations",
        "name": "Errors and escalations",
        "area": "modeling",
        "xml": [
            "bpmn:errorEventDefinition",
            "bpmn:escalationEventDefinition"
        ]
    },
    {
        "id": "conditional-event",
        "name": "Conditional event",
        "area": "modeling",
        "xml": [
            "bpmn:conditionalEventDefinition"
        ]
    },
    {
        "id": "link-event",
        "name": "Link events",
        "area": "modeling",
        "xml": [
            "bpmn:linkEventDefinition"
        ]
    },
    {
        "id": "multi-instance",
        "name": "Multi-instance, parallel and sequential",
        "area": "modeling",
        "xml": [
            "bpmn:multiInstanceLoopCharacteristics"
        ]
    },
    {
        "id": "standard-loop",
        "name": "Standard loop",
        "area": "modeling",
        "xml": [
            "bpmn:standardLoopCharacteristics"
        ]
    },
    {
        "id": "pools-lanes",
        "name": "Pools, lanes and message flows",
        "area": "modeling",
        "xml": [
            "bpmn:participant",
            "bpmn:lane",
            "bpmn:messageFlow"
        ]
    },
    {
        "id": "data-objects",
        "name": "Data objects and data stores",
        "area": "modeling",
        "xml": [
            "bpmn:dataObjectReference",
            "bpmn:dataStoreReference"
        ]
    },
    {
        "id": "forms",
        "name": "Forms",
        "area": "modeling",
        "xml": [
            "camunda:formData",
            "[camunda:formKey]"
        ]
    },
    {
        "id": "input-output",
        "name": "Input and output mapping",
        "area": "modeling",
        "xml": [
            "camunda:inputOutput"
        ]
    },
    {
        "id": "listeners",
        "name": "Scripts on events (listeners)",
        "area": "modeling",
        "xml": [
            "camunda:executionListener",
            "camunda:taskListener"
        ]
    },
    {
        "id": "assignment",
        "name": "Assignment and access",
        "area": "modeling",
        "xml": [
            "[camunda:assignee]",
            "[camunda:candidateUsers]",
            "[camunda:candidateGroups]",
            "[camunda:candidateStarterUsers]",
            "[camunda:candidateStarterGroups]"
        ]
    },
    {
        "id": "assignment-policies",
        "name": "Assignment policies",
        "area": "modeling",
        "xml": [
            "[camunda:assignmentPolicy]"
        ]
    },
    {
        "id": "security-policies",
        "name": "Security policies",
        "area": "security",
        "xml": [
            "[owf:securityPolicy]"
        ]
    },
    {
        "id": "expressions",
        "name": "Expressions and conditions",
        "area": "modeling",
        "xml": [
            "bpmn:conditionExpression"
        ]
    },
    {
        "id": "dmn",
        "name": "Decision tables (DMN)",
        "area": "decisions",
        "xml": [
            "dmn:decisionTable",
            "dmn:literalExpression"
        ]
    },
    {
        "id": "labels",
        "name": "Labels of cases and tasks",
        "area": "application",
        "xml": [
            "[camunda:label]",
            "[camunda:endLabel]"
        ]
    },
    {
        "id": "connectors",
        "name": "REST connectors (OpenAPI)",
        "area": "connectors",
        "xml": [
            "bpmn:serviceTask camunda:connector"
        ]
    }
];
