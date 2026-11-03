// Which Camunda settings an element carries. A setting bpmn-server does not run is not offered for new work,
// but when a model has one the panel still shows it (Camunda's own group), so nothing in the file is hidden;
// the Problems list says it has no effect.
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

/** Set in the model, not just the descriptor's default (camunda:decisionRefBinding defaults to 'latest'). */
export function isSet(bo, property) {
    if (!bo)
        return false;
    const value = bo.get(property);
    if (value === undefined || value === null || value === '' || value === false)
        return false;
    return value !== bo.$model.getPropertyDescriptor(bo, property)?.default;
}

const any = (bo, properties) => properties.some(property => isSet(bo, property));
const extensions = (bo, ...types) => (bo?.get('extensionElements')?.get('values') || []).filter(v => types.some(t => is(v, t)));
/** The process of a pool, or the element itself. */
const processOf = bo => is(bo, 'bpmn:Participant') ? bo.get('processRef') : bo;

/**
 * For each Camunda group the panel replaces or leaves out: whether this element has a value only that group
 * shows. The group is then kept as Camunda draws it.
 */
export const CAMUNDA_GROUP_SET = {
    CamundaPlatform__ExternalTask: bo => bo.get('camunda:type') === 'external' || isSet(bo, 'camunda:topic'),
    CamundaPlatform__AsynchronousContinuations: bo => any(bo, ['camunda:asyncBefore', 'camunda:asyncAfter']),
    CamundaPlatform__JobExecution: bo => isSet(bo, 'camunda:jobPriority') || extensions(bo, 'camunda:FailedJobRetryTimeCycle').length > 0,
    CamundaPlatform__FieldInjection: bo => extensions(bo, 'camunda:Field').length > 0,
    CamundaPlatform__Errors: bo => extensions(bo, 'camunda:ErrorEventDefinition').length > 0,
    CamundaPlatform__InMapping: bo => extensions(bo, 'camunda:In').length > 0,
    CamundaPlatform__InMappingPropagation: bo => extensions(bo, 'camunda:In').length > 0,
    CamundaPlatform__OutMapping: bo => extensions(bo, 'camunda:Out').length > 0,
    CamundaPlatform__OutMappingPropagation: bo => extensions(bo, 'camunda:Out').length > 0,
    CamundaPlatform__BusinessKey: bo => extensions(bo, 'camunda:In').some(i => isSet(i, 'businessKey')),
    // a connector's inputs and outputs are in bpmn-server's Service group (ConnectorEntries.jsx)
    CamundaPlatform__ExtensionProperties: bo => extensions(processOf(bo), 'camunda:Properties').length > 0,
    CamundaPlatform__CandidateStarter: bo => any(processOf(bo), ['camunda:candidateStarterUsers', 'camunda:candidateStarterGroups']),
    CamundaPlatform__HistoryCleanup: bo => isSet(processOf(bo), 'camunda:historyTimeToLive'),
    CamundaPlatform__Tasklist: bo => processOf(bo)?.get('camunda:isStartableInTasklist') === false,
    // replaced by bpmn-server's groups, which show only what the engine reads
    // (a business rule task's result variable and result mapping are in bpmn-server's Decision group)
    CamundaPlatform__Implementation: bo => (bo.get('eventDefinitions') || []).some(d => any(d, ['camunda:class', 'camunda:expression', 'camunda:delegateExpression'])) || any(bo, ['camunda:class', 'camunda:expression',
        'camunda:decisionRefBinding', 'camunda:decisionRefVersion', 'camunda:decisionRefVersionTag', 'camunda:decisionRefTenantId'])
        || (!is(bo, 'bpmn:BusinessRuleTask') && any(bo, ['camunda:resultVariable', 'camunda:mapDecisionResult'])) || bo.get('camunda:type') === 'external',
    CamundaPlatform__Script: bo => any(bo, ['camunda:resource', 'camunda:resultVariable']),
    CamundaPlatform__Form: bo => any(bo, ['camunda:formRef', 'camunda:formRefBinding', 'camunda:formRefVersion']),
    CamundaPlatform__CallActivity: bo => any(bo, ['camunda:calledElementBinding', 'camunda:calledElementVersion',
        'camunda:calledElementVersionTag', 'camunda:calledElementTenantId', 'camunda:caseRef']),
    CamundaPlatform__Condition: bo => (bo.get('eventDefinitions') || []).some(d => is(d, 'bpmn:ConditionalEventDefinition'))
};

export function hasCamundaOnly(element, groupId) {
    const test = CAMUNDA_GROUP_SET[groupId];
    return Boolean(test && test(getBusinessObject(element)));
}
