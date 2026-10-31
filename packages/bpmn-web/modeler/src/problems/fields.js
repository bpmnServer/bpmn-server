// Which properties-panel entries a bpmn-server model issue (verifyModel) is about, so the editor can mark the
// field and take the user to it. Issues name their element; the field comes from the issue's code and,
// for script and expression checks, from the part the message names ("The 'start' script does not compile").
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { container, listenersOf } from '../properties/ScriptsGroup.jsx';

const CONDITION = ['conditionExpression'];
const TIMER = ['timerEventDefinitionValue'];
const ASSIGNMENT = ['assignee', 'candidateGroups', 'candidateUsers', 'dueDate', 'followUpDate', 'priority'];

const BY_CODE = {
    'empty-script': () => ['script-body'],
    'empty-condition': () => CONDITION,
    'timer-not-defined': () => TIMER,
    'timer-invalid': () => TIMER,
    'service-not-named': () => ['service-name'],
    'service-not-found': () => ['service-name'],
    'call-activity-no-target': () => ['calledElement'],
    'called-model-missing': () => ['calledElement'],
    'decision-not-named': () => ['decisionRef'],
    'decision-not-found': () => ['decisionRef'],
    'decision-invalid': () => ['decisionRef'],
    'decision-input-from-data': () => ['decisionRef'],
    'decision-result-not-saved': () => ['decision-resultVariable'],
    'script-syntax': fieldsOfScript,
    'unknown-app-service': fieldsOfScript,
    'expression-syntax': fieldsOfScript
};

/** The entry ids of the issue's field on the element (empty when it is about the element as a whole). */
export function fieldsFor(issue, element) {
    const fields = BY_CODE[issue.code];
    return (fields && element) ? fields(issue, element) : [];
}

function fieldsOfScript(issue, element) {
    // "The X does not compile", "The X expression does not compile", "The X calls|reads appServices.name"
    const what = /^The (.+?) (?:expression )?(?:does not compile|calls appServices|reads appServices)/.exec(issue.message || '')?.[1];
    if (!what)
        return [];
    if (what === 'script')
        return ['script-body'];
    if (what === 'condition')
        return CONDITION;
    if (what === 'collection')
        return ['multiInstance-collection'];
    if (ASSIGNMENT.includes(what))
        return [is(element, 'bpmn:StartEvent') ? `start-${what}` : `assignment-${what}`];
    // "'start' script" on a node, "process 'start' script" on a process: every script for that event
    const event = /^(?:process )?'(.+)' script$/.exec(what)?.[1];
    if (!event)
        return [];
    const bo = container(element);
    return listenersOf(bo)
        .map((listener, index) => listener.get('event') === event ? `${element.id}-script-${index}-script` : null)
        .filter(Boolean);
}
