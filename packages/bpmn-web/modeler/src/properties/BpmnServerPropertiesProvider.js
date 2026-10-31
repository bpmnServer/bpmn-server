// Shapes the Camunda 7 properties panel to what bpmn-server runs. It runs after the Camunda provider
// (lower priority), removes the groups for Camunda engine features bpmn-server does not have, and puts
// bpmn-server's own groups in place of the ones whose fields mean something different here.
import { UserAssignmentGroup, StartAssignmentGroup } from './AssignmentGroups.jsx';
import { ServiceGroup, ScriptGroup } from './TaskGroups.jsx';
import { ScriptsGroup } from './ScriptsGroup.jsx';
import { hasCamundaOnly } from './settings.js';
import { DefaultFlowGroup } from './DefaultFlowGroup.jsx';
import { OtherAttributesGroup } from './OtherAttributesGroup.jsx';
import { TemplateValuesGroup } from './TemplateValuesGroup.jsx';
import { DataObjectGroup } from './DataObjectGroup.jsx';
import { ConditionGroup, MultiInstanceGroup, FormGroup, NewFormFieldsGroup, DecisionGroup, CalledProcessGroup } from './FlowGroups.jsx';

const LOW_PRIORITY = 400;

/**
 * Camunda engine features with no meaning in bpmn-server: not offered, but shown when the element has a value
 * for one (settings.js), so every setting in a model file can be read in the panel.
 */
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
    'CamundaPlatform__TaskListener',         // shown with the execution listeners, under Scripts
    // stored with the model but not used when it runs; who may start is set on the start event
    'CamundaPlatform__CandidateStarter',
    'CamundaPlatform__HistoryCleanup',
    'CamundaPlatform__Tasklist'
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
            // bpmn-server's group in place of Camunda's, unless the element has a setting only Camunda's shows
            const replace = (id, group) => {
                if (hasCamundaOnly(element, id))
                    return;
                const index = groups.findIndex(g => g.id === id);
                if (index >= 0)
                    groups.splice(index, 1, ...(group ? [group] : []));
                else if (group)
                    groups.push(group);
            };
            groups = groups.filter(group => !REMOVED.has(group.id) || hasCamundaOnly(element, group.id));

            replace('CamundaPlatform__Implementation', ServiceGroup(element, translate) || DecisionGroup(element, translate));
            replace('CamundaPlatform__Condition', ConditionGroup(element, translate));
            replace('multiInstance', MultiInstanceGroup(element, translate));
            replace('CamundaPlatform__Form', FormGroup(element, translate));
            const newFormFields = NewFormFieldsGroup(element, this._injector);
            if (newFormFields)
                groups.splice(groups.findIndex(g => g.id === 'BpmnServer__Form') + 1, 0, newFormFields);
            replace('CamundaPlatform__CallActivity', CalledProcessGroup(element, translate));
            replace('CamundaPlatform__Script', ScriptGroup(element, translate));
            replace('CamundaPlatform__UserAssignment', UserAssignmentGroup(element, translate));
            replace('CamundaPlatform__ExecutionListener', ScriptsGroup(element, this._injector));

            const defaultFlow = DefaultFlowGroup(element, translate);
            if (defaultFlow)
                groups.splice(Math.min(groups.length, 2), 0, defaultFlow);

            const templateValues = TemplateValuesGroup(element, this._injector);
            if (templateValues)
                groups.splice(groups.findIndex(g => g.id === 'ElementTemplates__Template') + 1, 0, templateValues);

            const dataObject = DataObjectGroup(element, translate);
            if (dataObject)
                groups.splice(Math.min(groups.length, 1), 0, dataObject);

            const other = OtherAttributesGroup(element, translate);
            if (other)
                groups.push(other);

            const startAssignment = StartAssignmentGroup(element, translate);
            if (startAssignment)
                groups.splice(Math.min(groups.length, 2), 0, startAssignment);
            return groups;
        };
    }
}

BpmnServerPropertiesProvider.$inject = ['propertiesPanel', 'injector', 'translate'];
