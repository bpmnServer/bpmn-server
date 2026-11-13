// Who a user task goes to and who may start a process, as bpmn-server reads them (Tasks.ts setAssignVal,
// Events.ts): a value starting with $ is an expression, # runs JavaScript, a comma-separated value is a list.
import { Group, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { attributeEntry } from './AttributeEntry.jsx';
import { policyEntries } from './PolicyEntries.jsx';

const VALUE_HELP = 'A name, a comma-separated list, or an expression such as $data.manager';
const DATE_HELP = 'An ISO date (2026-06-26T09:54:00) or an expression such as $data.dueDate';

export function UserAssignmentGroup(element, translate) {
    if (!is(element, 'bpmn:UserTask'))
        return null;
    const entry = (name, label, description) =>
        attributeEntry(element, { id: `assignment-${name}`, attribute: `camunda:${name}`, label, description });
    return {
        id: 'BpmnServer__UserAssignment',
        label: translate('User assignment'),
        component: Group,
        entries: [
            entry('assignee', 'Assignee', 'A user name or an expression such as $data.requester'),
            entry('candidateUsers', 'Candidate users', VALUE_HELP),
            entry('candidateGroups', 'Candidate groups', VALUE_HELP),
            ...policyEntries(element),
            // who completes it is this actor of the instance: actors.<name> in every expression (docs/design/expressions.md)
            attributeEntry(element, { id: 'assignment-actor', attribute: 'owf:actor', label: 'Actor',
                description: 'Who completes it is this actor of the instance (approver): actors.approver in conditions, scripts and policies' }),
            attributeEntry(element, { id: 'assignment-security-policy', attribute: 'owf:securityPolicy', label: 'Security policy',
                description: "Its own, besides the process's (in the process's Policies group): policies/security/<name>.dmn.xml, for who may claim, complete and assign it" }),
            attributeEntry(element, { id: 'assignment-notification-policy', attribute: 'owf:notificationPolicy', label: 'Notification policy',
                description: "Its own, besides the process's: policies/notification/<name>.dmn.xml, asked when it waits and when it is completed" }),
            entry('dueDate', 'Due date', DATE_HELP),
            entry('followUpDate', 'Follow up date', DATE_HELP),
            entry('priority', 'Priority', 'A number or an expression such as $data.priority')
        ]
    };
}

/** The process an element stands for: itself, or a pool's (a participant's processRef). */
const processOf = bo => is(bo, 'bpmn:Participant') ? bo.get('processRef') : bo;

/** A process's attribute: on the process itself, or, for a pool, on its process (as the Label group does). */
function ProcessAttributeField({ element, id, attribute, label, description }) {
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    const bo = getBusinessObject(element);
    const target = processOf(bo);
    return <TextFieldEntry
        element={element}
        id={id}
        label={translate(label)}
        description={translate(description)}
        debounce={debounce}
        getValue={() => target?.get(attribute) || ''}
        setValue={value => is(bo, 'bpmn:Participant')
            ? modeling.updateModdleProperties(element, target, { [attribute]: value || undefined })
            : modeling.updateProperties(element, { [attribute]: value || undefined })}
    />;
}

/**
 * A process's policies (docs/design/security-policies.md, notification-policies.md): each a decision table of the
 * models folder. On the process, or on a pool: its process's.
 */
export function ProcessPoliciesGroup(element, translate) {
    const bo = getBusinessObject(element);
    if (!is(bo, 'bpmn:Process') && !(is(bo, 'bpmn:Participant') && bo.get('processRef')))
        return null;
    const entry = props => ({ element, ...props, component: ProcessAttributeField, isEdited: isTextFieldEntryEdited });
    return {
        id: 'BpmnServer__ProcessPolicies',
        label: translate('Policies'),
        component: Group,
        entries: [
            entry({ id: 'process-security-policy', attribute: 'owf:securityPolicy', label: 'Security policy',
                description: 'Who sees its instances, which of their data, what they may do: policies/security/<name>.dmn.xml; none, the default' }),
            entry({ id: 'process-notification-policy', attribute: 'owf:notificationPolicy', label: 'Notification policy',
                description: 'Who is told what: policies/notification/<name>.dmn.xml, asked when a user task waits or is completed, and when an instance ends' }),
        ]
    };
}

export function StartAssignmentGroup(element, translate) {
    if (!is(element, 'bpmn:StartEvent'))
        return null;
    const entry = (name, label) =>
        attributeEntry(element, { id: `start-${name}`, attribute: `camunda:${name}`, label, description: VALUE_HELP });
    return {
        id: 'BpmnServer__StartAssignment',
        label: translate('Who can start'),
        component: Group,
        entries: [
            entry('candidateUsers', 'Candidate users'),
            entry('candidateGroups', 'Candidate groups')
        ]
    };
}
