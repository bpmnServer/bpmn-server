// Shapes the Camunda 7 properties panel to what bpmn-server runs. It runs after the Camunda provider
// (lower priority), removes the groups for Camunda engine features bpmn-server does not have, and puts
// bpmn-server's own groups in place of the ones whose fields mean something different here.
import { UserAssignmentGroup, StartAssignmentGroup } from './AssignmentGroups.jsx';
import { ServiceGroup, ScriptGroup } from './TaskGroups.jsx';
import { ScriptsGroup } from './ScriptsGroup.jsx';

const LOW_PRIORITY = 400;

/** Camunda engine features with no meaning in bpmn-server. */
const REMOVED = new Set([
    'CamundaPlatform__ExternalTask',
    'CamundaPlatform__AsynchronousContinuations',
    'CamundaPlatform__JobExecution',
    'CamundaPlatform__FieldInjection',
    'CamundaPlatform__Errors',
    'CamundaPlatform__InMapping',
    'CamundaPlatform__InMappingPropagation',
    'CamundaPlatform__OutMapping',
    'CamundaPlatform__OutMappingPropagation',
    'CamundaPlatform__BusinessKey',
    'CamundaPlatform__ConnectorInput',
    'CamundaPlatform__ConnectorOutput',
    'CamundaPlatform__ExtensionProperties',
    'CamundaPlatform__TaskListener'          // shown with the execution listeners, under Scripts
]);

export default class BpmnServerPropertiesProvider {
    constructor(propertiesPanel, injector, translate) {
        this._injector = injector;
        this._translate = translate;
        propertiesPanel.registerProvider(LOW_PRIORITY, this);
    }

    getGroups(element) {
        return groups => {
            const translate = this._translate;
            const replace = (id, group) => {
                const index = groups.findIndex(g => g.id === id);
                if (index >= 0)
                    groups.splice(index, 1, ...(group ? [group] : []));
                else if (group)
                    groups.push(group);
            };
            groups = groups.filter(group => !REMOVED.has(group.id));

            // a business rule task keeps Camunda's implementation group (decisionRef)
            const service = ServiceGroup(element, translate);
            if (service)
                replace('CamundaPlatform__Implementation', service);
            replace('CamundaPlatform__Script', ScriptGroup(element, translate));
            replace('CamundaPlatform__UserAssignment', UserAssignmentGroup(element, translate));
            replace('CamundaPlatform__ExecutionListener', ScriptsGroup(element, this._injector));

            const startAssignment = StartAssignmentGroup(element, translate);
            if (startAssignment)
                groups.splice(Math.min(groups.length, 2), 0, startAssignment);
            return groups;
        };
    }
}

BpmnServerPropertiesProvider.$inject = ['propertiesPanel', 'injector', 'translate'];
