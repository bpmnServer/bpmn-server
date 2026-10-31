// The Camunda 7 descriptor that bpmn-server models use, plus the attributes bpmn-server reads that Camunda
// does not define. The engine reads camunda:candidateUsers and camunda:candidateGroups on start events
// (who may start the process), so they are declared on bpmn:StartEvent here.
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
        }
    ]
};
