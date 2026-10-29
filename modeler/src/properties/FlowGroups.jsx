// Conditions, loops, forms, decisions and called processes as bpmn-server reads them:
//   a sequence flow's condition is a JavaScript expression (ScriptHandler.evaluateExpression; a leading $ is
//   optional), a multi-instance loop runs once per entry of camunda:collection (engine/Loop.ts), a user task's
//   form is camunda:formKey plus its form fields, a business rule task evaluates camunda:decisionRef and a call
//   activity starts the saved model named by calledElement.
import { Group, ListGroup, TextAreaEntry, TextFieldEntry, isTextAreaEntryEdited, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, isAny, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { attributeEntry } from './AttributeEntry.jsx';
import { addExtensionElement } from './extensions.js';
import { formatEntry } from './FormatEntry.jsx';

const CONDITIONAL_SOURCES = ['bpmn:Activity', 'bpmn:ExclusiveGateway', 'bpmn:InclusiveGateway', 'bpmn:ComplexGateway'];

function ConditionField({ element, id }) {
    const commandStack = useService('commandStack');
    const bpmnFactory = useService('bpmnFactory');
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    const bo = getBusinessObject(element);

    const setValue = value => {
        const condition = bo.get('conditionExpression');
        if (!value)
            commandStack.execute('element.updateModdleProperties', { element, moddleElement: bo, properties: { conditionExpression: undefined } });
        else if (condition)
            commandStack.execute('element.updateModdleProperties', { element, moddleElement: condition, properties: { body: value } });
        else {
            const created = bpmnFactory.create('bpmn:FormalExpression', { body: value });
            created.$parent = bo;
            commandStack.execute('element.updateModdleProperties', { element, moddleElement: bo, properties: { conditionExpression: created } });
        }
    };
    return <TextAreaEntry
        element={element}
        id={id}
        label={translate('Condition')}
        description={translate('A JavaScript expression, e.g. data.days > 5; the flow is taken when it is true')}
        monospace
        rows={2}
        autoResize
        debounce={debounce}
        getValue={() => bo.get('conditionExpression')?.get('body') || ''}
        setValue={setValue}
    />;
}

export function ConditionGroup(element, translate) {
    if (!is(element, 'bpmn:SequenceFlow'))
        return null;
    const bo = getBusinessObject(element);
    // a flow that has a condition shows it, wherever it starts: the engine evaluates it
    const condition = bo.get('conditionExpression');
    if (!condition) {
        if (!isAny(element.source, CONDITIONAL_SOURCES))
            return null;
        if (getBusinessObject(element.source).get('default') === bo)
            return null;    // the default flow is taken when no other condition is true
    }
    return {
        id: 'BpmnServer__Condition',
        label: translate('Condition'),
        component: Group,
        entries: [
            { id: 'conditionExpression', element, component: ConditionField, isEdited: isTextAreaEntryEdited },
            ...(condition ? [formatEntry(element, {
                id: 'conditionLanguage', label: 'Language', allowEmpty: true,
                target: () => bo.get('conditionExpression'), property: 'language'
            })] : [])
        ]
    };
}

function CollectionField({ element, id }) {
    const commandStack = useService('commandStack');
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    const loop = getBusinessObject(element).get('loopCharacteristics');
    return <TextFieldEntry
        element={element}
        id={id}
        label={translate('Collection')}
        description={translate('An expression giving the list to run once per entry, e.g. $data.approvers, or a number of times')}
        debounce={debounce}
        getValue={() => loop.get('camunda:collection') || ''}
        setValue={value => commandStack.execute('element.updateModdleProperties',
            { element, moddleElement: loop, properties: { 'camunda:collection': value || undefined } })}
    />;
}

/** A loop setting bpmn-server ignores, shown when a model has it so it can be read and cleared. */
function UnusedLoopField({ element, id, property, label, expression }) {
    const commandStack = useService('commandStack');
    const bpmnFactory = useService('bpmnFactory');
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    const loop = getBusinessObject(element).get('loopCharacteristics');
    const value = () => {
        const v = loop.get(property);
        return (expression ? v?.get('body') : v) || '';
    };
    const setValue = text => {
        const current = loop.get(property);
        if (expression && text && current) {
            commandStack.execute('element.updateModdleProperties', { element, moddleElement: current, properties: { body: text } });
            return;
        }
        let next = text || undefined;
        if (expression && text) {
            next = bpmnFactory.create('bpmn:FormalExpression', { body: text });
            next.$parent = loop;
        }
        commandStack.execute('element.updateModdleProperties', { element, moddleElement: loop, properties: { [property]: next } });
    };
    return <TextFieldEntry
        element={element}
        id={id}
        label={translate(label)}
        description={translate('Not used by bpmn-server, which loops over the collection; clear it')}
        debounce={debounce}
        getValue={value}
        setValue={setValue}
    />;
}

const UNUSED_LOOP = [
    ['loopCardinality', 'Loop cardinality', true],
    ['completionCondition', 'Completion condition', true],
    ['camunda:elementVariable', 'Element variable', false]
];

export function MultiInstanceGroup(element, translate) {
    const loop = getBusinessObject(element).get('loopCharacteristics');
    if (!is(loop, 'bpmn:MultiInstanceLoopCharacteristics'))
        return null;
    return {
        id: 'multiInstance',    // bpmn-js's id: shown on a task made from a template too
        label: translate('Multi-instance'),
        component: Group,
        entries: [
            { id: 'multiInstance-collection', element, component: CollectionField, isEdited: isTextFieldEntryEdited },
            ...UNUSED_LOOP.filter(([property]) => loop.get(property)).map(([property, label, expression]) => ({
                id: `multiInstance-${property.replace(':', '-')}`, element, property, label, expression,
                component: UnusedLoopField, isEdited: isTextFieldEntryEdited
            }))
        ]
    };
}

export function FormGroup(element, translate) {
    if (!is(element, 'bpmn:UserTask') && !is(element, 'bpmn:StartEvent'))
        return null;
    return {
        id: 'BpmnServer__Form',
        label: translate('Form'),
        component: Group,
        entries: [attributeEntry(element, {
            id: 'formKey', attribute: 'camunda:formKey', label: 'Form key',
            description: 'A form your application shows for this task; without one, the form fields below are shown'
        })]
    };
}

/**
 * Form fields for a task or start event that has none yet: Camunda's list (CamundaPlatform__FormData) shows
 * only once the element has camunda:formData, so this one starts it with a first field.
 */
export function NewFormFieldsGroup(element, injector) {
    const bo = getBusinessObject(element);
    const formData = (bo.get('extensionElements')?.get('values') || []).find(value => is(value, 'camunda:FormData'));
    if (formData || !(is(element, 'bpmn:UserTask') || is(element, 'bpmn:StartEvent') && !is(element.parent, 'bpmn:SubProcess')))
        return null;
    const bpmnFactory = injector.get('bpmnFactory');
    const commandStack = injector.get('commandStack');
    const add = event => {
        event.stopPropagation();
        const field = bpmnFactory.create('camunda:FormField', { id: 'field1', label: '', type: 'string' });
        const created = bpmnFactory.create('camunda:FormData', { fields: [field] });
        field.$parent = created;
        addExtensionElement(element, bo, created, bpmnFactory, commandStack);
    };
    return { id: 'BpmnServer__NewFormFields', label: injector.get('translate')('Form fields'), component: ListGroup, items: [], add };
}

export function DecisionGroup(element, translate) {
    if (!is(element, 'bpmn:BusinessRuleTask'))
        return null;
    return {
        id: 'BpmnServer__Decision',
        label: translate('Decision'),
        component: Group,
        entries: [attributeEntry(element, {
            id: 'decisionRef', attribute: 'camunda:decisionRef', label: 'Decision',
            description: 'The decision table the task evaluates: <name>.dmn.xml in the models folder'
        })]
    };
}

export function CalledProcessGroup(element, translate) {
    if (!is(element, 'bpmn:CallActivity'))
        return null;
    return {
        id: 'BpmnServer__CalledProcess',
        label: translate('Called process'),
        component: Group,
        entries: [attributeEntry(element, {
            id: 'calledElement', attribute: 'calledElement', label: 'Process',
            description: 'The name of the saved model this task starts and waits for'
        })]
    };
}
