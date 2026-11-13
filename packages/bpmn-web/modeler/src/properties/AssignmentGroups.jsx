// Who a user task goes to and who may start a process, as bpmn-server reads them (Tasks.ts setAssignVal,
// Events.ts): a value starting with $ is an expression, # runs JavaScript, a comma-separated value is a list.
import { Group } from '@bpmn-io/properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { attributeEntry } from './AttributeEntry.jsx';
import { policyEntries, kindPolicyEntries } from './PolicyEntries.jsx';

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
            // an actor: the name for the user who completes it (docs/design/expressions.md)
            attributeEntry(element, { id: 'assignment-actor', attribute: 'owf:actor', label: 'Actor',
                description: 'The name for the user who completes it (approver): actors.approver in rules, conditions and scripts' }),
            ...kindPolicyEntries(element, { kind: 'security', attribute: 'owf:securityPolicy', idPrefix: 'assignment-security-policy',
                label: 'Security policy', suggestion: 'TaskAccess',
                description: "Its own, besides the process's (in the process's Policies group): who may claim, complete and assign it" }),
            ...kindPolicyEntries(element, { kind: 'notification', attribute: 'owf:notificationPolicy', idPrefix: 'assignment-notification-policy',
                label: 'Notification policy', suggestion: 'TaskNotices',
                description: "Its own, besides the process's: asked when it waits and when it is completed" }),
            entry('dueDate', 'Due date', DATE_HELP),
            entry('followUpDate', 'Follow up date', DATE_HELP),
            entry('priority', 'Priority', 'A number or an expression such as $data.priority')
        ]
    };
}

/**
 * A process's policies (docs/design/security-policies.md, notification-policies.md): each a decision table of the
 * models folder. On the process, or on a pool: its process's.
 */
export function ProcessPoliciesGroup(element, translate) {
    const bo = getBusinessObject(element);
    if (!is(bo, 'bpmn:Process') && !(is(bo, 'bpmn:Participant') && bo.get('processRef')))
        return null;
    return {
        id: 'BpmnServer__ProcessPolicies',
        label: translate('Policies'),
        component: Group,
        entries: [
            ...kindPolicyEntries(element, { kind: 'security', attribute: 'owf:securityPolicy', idPrefix: 'process-security-policy',
                label: 'Security policy', suggestion: 'Cases',
                description: 'Who sees its instances, which of their data, what they may do; none: the default' }),
            ...kindPolicyEntries(element, { kind: 'notification', attribute: 'owf:notificationPolicy', idPrefix: 'process-notification-policy',
                label: 'Notification policy', suggestion: 'Notices',
                description: 'Who is told what, when a user task waits or is completed, and when an instance ends' }),
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
            entry('candidateGroups', 'Candidate groups'),
            // an actor: the name for the user who starts the process here (docs/design/expressions.md)
            attributeEntry(element, { id: 'start-actor', attribute: 'owf:actor', label: 'Actor',
                description: 'The name for the user who starts the process here (requester): actors.requester in rules, conditions and scripts' })
        ]
    };
}
