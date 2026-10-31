// Conditions, loops, forms, decisions and called processes as bpmn-server reads them:
//   a sequence flow's condition is a JavaScript expression (ScriptHandler.evaluateExpression; a leading $ is
//   optional), a multi-instance loop runs once per entry of camunda:collection (engine/Loop.ts), a user task's
//   form is camunda:formKey plus its form fields, a business rule task evaluates the decision camunda:decisionRef
//   names (DMNEngine; its result saved by camunda:resultVariable, shaped by camunda:mapDecisionResult) and a call
//   activity starts the saved model named by calledElement.
import { Group, ListGroup, SelectEntry, TextAreaEntry, TextFieldEntry, isSelectEntryEdited, isTextAreaEntryEdited, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';
import { useService } from 'bpmn-js-properties-panel';
import { is, isAny, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { attributeEntry } from './AttributeEntry.jsx';
import { addExtensionElement } from './extensions.js';
import { formatEntry } from './FormatEntry.jsx';
import { codeEntry } from './code/CodeEntry.jsx';

const CONDITIONAL_SOURCES = ['bpmn:Activity', 'bpmn:ExclusiveGateway', 'bpmn:InclusiveGateway', 'bpmn:ComplexGateway'];


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
            codeEntry(element, {
                id: 'conditionExpression', label: 'Condition', mode: 'expression', rows: 2,
                description: 'A JavaScript expression, e.g. data.days > 5; the flow is taken when it is true',
                getValue: () => bo.get('conditionExpression')?.get('body') || '',
                setValue: (value, { commandStack, bpmnFactory }) => {
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
                }
            }),
            ...(condition ? [formatEntry(element, {
                id: 'conditionLanguage', label: 'Language', allowEmpty: true,
                target: () => bo.get('conditionExpression'), property: 'language'
            })] : [])
        ]
    };
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
            codeEntry(element, {
                id: 'multiInstance-collection', label: 'Collection', mode: 'expression', rows: 1,
                description: 'An expression giving the list to run once per entry, e.g. $data.approvers, or a number of times',
                getValue: () => loop.get('camunda:collection') || '',
                setValue: (value, { commandStack }) => commandStack.execute('element.updateModdleProperties',
                    { element, moddleElement: loop, properties: { 'camunda:collection': value || undefined } })
            }),
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

/** Re-render when the decision files have been read (again). */
function useDecisions() {
    const decisions = useService('decisions');
    const eventBus = useService('eventBus');
    const [, setVersion] = useState(0);
    useEffect(() => {
        const changed = () => setVersion(v => v + 1);
        eventBus.on('decisions.changed', changed);
        return () => eventBus.off('decisions.changed', changed);
    }, [eventBus]);
    return decisions;
}

function DecisionRefField({ element, id }) {
    const modeling = useService('modeling');
    const translate = useService('translate');
    const decisions = useDecisions();
    const bo = getBusinessObject(element);
    const getValue = () => bo.get('camunda:decisionRef') || '';
    return <SelectEntry
        element={element}
        id={id}
        label={translate('Decision')}
        description={translate('A decision file of the models folder (<name>.dmn.xml), or a decision id in one')}
        getValue={getValue}
        setValue={value => modeling.updateProperties(element, { 'camunda:decisionRef': value || undefined })}
        getOptions={() => {
            const choices = decisions.choices();
            const current = getValue();
            // the current value as written, when it is not one of the choices: a decision id, or a name not found
            const found = decisions.find(current);
            const own = current && !choices.some(c => c.value === current)
                ? [{ value: current, label: found ? `${current} (${found.decision?.name || current}, in ${found.file.name})` : `${current} (${decisions.loaded ? 'not found' : 'reading…'})` }]
                : [];
            return [{ value: '', label: translate('<none>') }, ...own, ...choices];
        }}
    />;
}

/** What the named decision reads and gives, and a link to it in the decision editor. */
function DecisionSummary({ element, id }) {
    const decisions = useDecisions();
    const modeling = useService('modeling');
    const ref = getBusinessObject(element).get('camunda:decisionRef') || '';
    const found = decisions.find(ref);
    const open = name => window.open(`/model/decision/${encodeURIComponent(name)}`, 'decision-' + name);
    const create = () => {
        const name = (window.prompt('Name of the new decision file (<name>.dmn.xml):', ref || slug(getBusinessObject(element).get('name'))) || '').trim();
        if (!name)
            return;
        if (name !== ref)
            modeling.updateProperties(element, { 'camunda:decisionRef': name });
        open(name);
    };
    let text;
    if (found?.decision?.table) {
        const t = found.decision.table;
        text = `${t.hitPolicy}${t.aggregation ? ' ' + t.aggregation : ''}, ${t.rules.length} rules. Reads ${t.inputs.map(i => i.expression).join(', ') || 'nothing'}; gives ${t.outputs.map(o => o.name).join(', ') || 'nothing'}.`;
    } else if (found?.decision?.literal) {
        text = `An expression; gives ${found.decision.literal.variable}.`;
    } else if (found?.file?.error) {
        text = `${found.file.file} can not be read: ${found.file.error}`;
    } else if (ref && decisions.loaded) {
        text = `No decision file ${ref}.dmn.xml and no decision with that id.`;
    }
    return <div class="bio-properties-panel-entry bpmn-server-decision-summary" data-entry-id={id}>
        {text && <div class="bio-properties-panel-description">{text}</div>}
        <div class="bpmn-server-decision-actions">
            {found && <button type="button" class="bio-properties-panel-add-entry-label" onClick={() => open(found.file.name)}>Open {found.file.file}</button>}
            {!found && <button type="button" class="bio-properties-panel-add-entry-label" onClick={create}>{ref && decisions.loaded ? `Create ${ref}.dmn.xml` : 'New decision table'}</button>}
        </div>
    </div>;
}

const slug = name => (name || 'decision').trim().replace(/[^\w-]+/g, '_').replace(/^_+|_+$/g, '') || 'decision';

const RESULT_MAPPINGS = [
    ['', 'As the table gives it'],
    ['singleEntry', 'singleEntry: the one output of the one rule'],
    ['singleResult', 'singleResult: the outputs of the one rule'],
    ['collectEntries', 'collectEntries: the first output of each rule'],
    ['resultList', 'resultList: the outputs of each rule']
];

function ResultMappingField({ element, id }) {
    const modeling = useService('modeling');
    const translate = useService('translate');
    const bo = getBusinessObject(element);
    return <SelectEntry
        element={element}
        id={id}
        label={translate('Result mapping')}
        description={translate('As the table gives it: one rule\'s outputs { name: value } (or null) for a single-hit policy, a list for COLLECT and RULE ORDER')}
        getValue={() => bo.get('camunda:mapDecisionResult') || ''}
        setValue={value => modeling.updateProperties(element, { 'camunda:mapDecisionResult': value || undefined })}
        getOptions={() => RESULT_MAPPINGS.map(([value, label]) => ({ value, label }))}
    />;
}

export function DecisionGroup(element, translate) {
    if (!is(element, 'bpmn:BusinessRuleTask'))
        return null;
    return {
        id: 'BpmnServer__Decision',
        label: translate('Decision'),
        component: Group,
        entries: [
            { id: 'decisionRef', element, component: DecisionRefField, isEdited: isSelectEntryEdited },
            { id: 'decision-summary', element, component: DecisionSummary },
            attributeEntry(element, {
                id: 'decision-resultVariable', attribute: 'camunda:resultVariable', label: 'Result variable',
                description: 'The data field the result is saved in (data.<name>); or save parts of it with output parameters'
            }),
            { id: 'decision-mapDecisionResult', element, component: ResultMappingField, isEdited: isSelectEntryEdited }
        ]
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
