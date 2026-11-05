// The Camunda 7 descriptor that bpmn-server models use, plus the attributes bpmn-server reads that Camunda
// does not define. The engine reads camunda:candidateUsers and camunda:candidateGroups on start events
// (who may start the process), so they are declared on bpmn:StartEvent here; camunda:exceptionsAsErrors on
// service, send and script tasks; and camunda:label, camunda:endLabel on the process and its elements.
import camunda from 'camunda-bpmn-moddle/resources/camunda.json';

export default {
    ...camunda,
    types: [
        ...camunda.types,
        {
            name: 'AssignableStart',
            isAbstract: true,
            extends: ['bpmn:StartEvent'],
            properties: [
                { name: 'candidateUsers', isAttr: true, type: 'String' },
                { name: 'candidateGroups', isAttr: true, type: 'String' }
            ]
        },
        {
            // bpmn-server's own labels (engine/Labels.ts): a template, with its values named
            name: 'Labeled',
            isAbstract: true,
            extends: ['bpmn:Process', 'bpmn:FlowNode'],
            properties: [
                { name: 'label', isAttr: true, type: 'String' },
                { name: 'endLabel', isAttr: true, type: 'String' }
            ]
        },
        {
            // bpmn-server's own (Node.failed): an exception of the task's work is raised as a BPMN error
            name: 'ExceptionsAsErrors',
            isAbstract: true,
            extends: ['bpmn:ServiceTask', 'bpmn:SendTask', 'bpmn:ScriptTask'],
            properties: [
                { name: 'exceptionsAsErrors', isAttr: true, type: 'Boolean' }
            ]
        }
    ]
};
