// Camunda settings in a model that bpmn-server does not run. The properties panel no longer offers them,
// but models made with other tools (or the classic editor) can carry them; they are listed as Problems so
// nobody expects them to work. Each is checked against what bpmn-server reads (elements/, behaviours/).
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isSet } from '../properties/settings.js';

const NOT_RUN = 'is a Camunda setting bpmn-server does not run; it has no effect';
const NOT_USED = 'is stored with the model but bpmn-server does not use it when the process runs';

/** [property, label] checked on every flow element. */
const ELEMENT_SETTINGS = [
    ['camunda:asyncBefore', 'Asynchronous before'],
    ['camunda:asyncAfter', 'Asynchronous after'],
    ['camunda:jobPriority', 'Job priority'],
    ['camunda:class', 'Java class'],
    ['camunda:expression', 'Expression implementation'],
    ['camunda:topic', 'External task topic'],
    ['camunda:resultVariable', 'Result variable'],
    ['camunda:formRef', 'Camunda form reference'],
    ['camunda:calledElementBinding', 'Called element binding'],
    ['camunda:calledElementVersion', 'Called element version'],
    ['camunda:decisionRefBinding', 'Decision binding'],
    ['camunda:resource', 'External script resource']
];

/** Extension elements, by type. */
const EXTENSION_SETTINGS = {
    'camunda:FailedJobRetryTimeCycle': 'Retry time cycle',
    'camunda:Field': 'Field injection',
    'camunda:Properties': 'Extension properties',
    'camunda:In': 'Call activity input mapping',
    'camunda:Out': 'Call activity output mapping',
    'camunda:Connector': 'Connector'
};

const PROCESS_SETTINGS = [
    ['camunda:candidateStarterUsers', 'Candidate starter users'],
    ['camunda:candidateStarterGroups', 'Candidate starter groups'],
    ['camunda:historyTimeToLive', 'History time to live']
];

/** Issues, in verifyModel's shape, for the Camunda settings of the model that bpmn-server does not run. */
export function findUnsupported(definitions) {
    const issues = [];
    const add = (severity, bo, label, text) => issues.push({
        severity, code: 'not-run-by-bpmn-server', message: `${label} ${text}.`,
        elementId: bo.id, elementName: bo.name
    });

    for (const process of (definitions?.get('rootElements') || []).filter(e => is(e, 'bpmn:Process'))) {
        for (const [property, label] of PROCESS_SETTINGS)
            if (isSet(process, property))
                add('info', process, label, NOT_USED);
        checkExtensions(process, add);
        for (const element of flowElements(process))
            checkElement(element, add);
    }
    return issues;
}

function* flowElements(container) {
    for (const element of container.get('flowElements') || []) {
        yield element;
        if (is(element, 'bpmn:SubProcess'))
            yield* flowElements(element);
    }
}

function checkElement(bo, add) {
    for (const [property, label] of ELEMENT_SETTINGS)
        if (isSet(bo, property))
            add('warning', bo, label, NOT_RUN);
    if (bo.get('camunda:type') === 'external')
        add('warning', bo, 'External task', NOT_RUN);
    if (is(bo, 'bpmn:ScriptTask') && bo.get('scriptFormat') && !/^javascript$/i.test(bo.get('scriptFormat')))
        add('warning', bo, `Script format ${bo.get('scriptFormat')}`, 'is not run: bpmn-server runs scripts as JavaScript');

    const loop = bo.get('loopCharacteristics');
    if (is(loop, 'bpmn:MultiInstanceLoopCharacteristics')) {
        if (loop.get('loopCardinality'))
            add('warning', bo, 'Loop cardinality', 'is not used: bpmn-server loops over the collection (a number gives that many runs)');
        if (loop.get('completionCondition'))
            add('warning', bo, 'Completion condition', NOT_RUN);
        if (loop.get('camunda:elementVariable'))
            add('warning', bo, 'Element variable', NOT_RUN);
        if (loop.get('camunda:asyncBefore') || loop.get('camunda:asyncAfter'))
            add('warning', bo, 'Multi-instance asynchronous continuation', NOT_RUN);
    }
    for (const definition of bo.get('eventDefinitions') || []) {
        for (const [property, label] of [['camunda:class', 'Java class'], ['camunda:expression', 'Expression implementation'], ['camunda:delegateExpression', 'Service on a message event']])
            if (isSet(definition, property))
                add('warning', bo, label, NOT_RUN);
        if (is(definition, 'bpmn:ConditionalEventDefinition'))
            add('warning', bo, 'Conditional event', 'is not supported by bpmn-server; the event never triggers');
    }
    checkExtensions(bo, add);
}

function checkExtensions(bo, add) {
    for (const value of bo.get('extensionElements')?.get('values') || []) {
        const label = EXTENSION_SETTINGS[value.$type];
        if (label)
            add('warning', bo, label, NOT_RUN);
        if ((is(value, 'camunda:ExecutionListener') || is(value, 'camunda:TaskListener')) && is(bo, 'bpmn:SequenceFlow')) {
            add('warning', bo, `The '${value.get('event')}' script on a sequence flow`, 'is not run: bpmn-server does not run scripts on sequence flows');
            continue;
        }
        if ((is(value, 'camunda:ExecutionListener') || is(value, 'camunda:TaskListener')) && value.get('event') === 'transformOutput')
            add('warning', bo, "The 'transformOutput' script", 'is not run: bpmn-server never fires that event');
        // scripts on events run; listeners implemented in Java do not
        if ((is(value, 'camunda:ExecutionListener') || is(value, 'camunda:TaskListener')) && !value.get('script'))
            add('warning', bo, `The '${value.get('event')}' listener`, 'has no script: bpmn-server runs only script listeners, so it has no effect');
    }
}
