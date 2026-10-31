// Scripts that run on an element's events. bpmn-server reads camunda:executionListener and camunda:taskListener
// alike (behaviours/Script.ts): each holds a camunda:script, run when the node fires the listener's event
// (EXECUTION_EVENT in bpmn-server's Enums.ts). New scripts are written as execution listeners.
// Checked by running them: a node fires enter, start, wait, end (a user task also assign, validate,
// transformInput); a process fires start and end, with the execution as `this` (instance.data holds the
// data). Scripts on sequence flows and transformOutput scripts are never run: they are shown when a model has
// them, not offered.
import { ListGroup, SelectEntry, TextFieldEntry, isSelectEntryEdited, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { addExtensionElement } from './extensions.js';
import { formatEntry } from './FormatEntry.jsx';
import { codeEntry } from './code/CodeEntry.jsx';

/** How a listener is implemented when it has no script: Camunda's Java options, which bpmn-server does not run. */
const JAVA = [['class', 'Java class'], ['expression', 'Expression'], ['delegateExpression', 'Delegate expression']];

const LISTENER_TYPES = ['camunda:ExecutionListener', 'camunda:TaskListener'];

const isProcess = element => is(element, 'bpmn:Process') || is(element, 'bpmn:Participant');

function eventsFor(element) {
    if (isProcess(element))
        return ['start', 'end'];
    if (is(element, 'bpmn:SequenceFlow'))
        return [];
    const events = ['enter', 'start', 'wait', 'end'];
    if (is(element, 'bpmn:UserTask'))
        events.push('assign', 'validate', 'transformInput');
    return events;
}

function scriptHelp(element) {
    if (is(element, 'bpmn:SequenceFlow'))
        return 'Not run: bpmn-server does not run scripts on sequence flows';
    if (isProcess(element))
        return 'JavaScript; this is the execution, instance.data holds the instance data';
    return 'JavaScript; this.data holds the instance data';
}

/** The business object that holds the scripts: a pool's scripts belong to its process. */
export function container(element) {
    const bo = getBusinessObject(element);
    return is(bo, 'bpmn:Participant') ? bo.get('processRef') : bo;
}

export function listenersOf(bo) {
    const values = bo.get('extensionElements')?.get('values') || [];
    return values.filter(value => LISTENER_TYPES.some(type => is(value, type)));
}

function update(commandStack, element, moddleElement, properties) {
    commandStack.execute('element.updateModdleProperties', { element, moddleElement, properties });
}

function EventField({ element, id, listener }) {
    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const options = () => {
        const events = eventsFor(element);
        const current = listener.get('event');
        if (current && !events.includes(current))    // keep a value written by another tool visible
            events.push(current);
        return events.map(value => ({ value, label: value }));
    };
    return <SelectEntry
        element={element}
        id={id}
        label={translate('Event')}
        getValue={() => listener.get('event')}
        setValue={value => update(commandStack, element, listener, { event: value })}
        getOptions={options}
    />;
}


/** A Java listener's implementation, shown so the entry is not mistaken for an empty script. */
function JavaField({ element, id, listener, property, label }) {
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    return <TextFieldEntry
        element={element}
        id={id}
        label={translate(label)}
        description={translate('Not run by bpmn-server: add a script, or remove this entry')}
        debounce={debounce}
        disabled
        getValue={() => listener.get(property) || ''}
        setValue={() => { }}
    />;
}

export function ScriptsGroup(element, injector) {
    const bo = container(element);
    if (!bo || !(is(bo, 'bpmn:FlowElement') || is(bo, 'bpmn:Process')))
        return null;
    const translate = injector.get('translate');
    const bpmnFactory = injector.get('bpmnFactory');
    const commandStack = injector.get('commandStack');

    const items = listenersOf(bo).map((listener, index) => {
        const id = `${element.id}-script-${index}`;
        return {
            id,
            label: listener.get('event') || translate('<no event>'),
            entries: [
                { id: `${id}-event`, element, listener, component: EventField, isEdited: isSelectEntryEdited },
                ...JAVA.filter(([property]) => listener.get(property)).map(([property, label]) =>
                    ({ id: `${id}-${property}`, element, listener, property, label, component: JavaField, isEdited: isTextFieldEntryEdited })),
                ...(listener.get('script') ? [formatEntry(element, { id: `${id}-format`, target: () => listener.get('script'), property: 'scriptFormat' })] : []),
                codeEntry(element, {
                    id: `${id}-script`, label: 'Script', description: scriptHelp(element),
                    getValue: () => listener.get('script')?.get('value') || '',
                    setValue: (value, { commandStack, bpmnFactory }) => {
                        const script = listener.get('script');
                        if (script)
                            update(commandStack, element, script, { value });
                        else {
                            const created = bpmnFactory.create('camunda:Script', { scriptFormat: 'JavaScript', value });
                            created.$parent = listener;
                            update(commandStack, element, listener, { script: created });
                        }
                    }
                })
            ],
            autoFocusEntry: `${id}-script`,
            remove: () => {
                const extensionElements = bo.get('extensionElements');
                update(commandStack, element, extensionElements,
                    { values: extensionElements.get('values').filter(value => value !== listener) });
            }
        };
    });

    // a sequence flow's scripts are shown when it has some, but none are added: they would not run
    if (!eventsFor(element).length) {
        if (!items.length)
            return null;
        return { id: 'BpmnServer__Scripts', label: translate('Scripts'), component: ListGroup, items };
    }

    const add = event => {
        event.stopPropagation();
        const script = bpmnFactory.create('camunda:Script', { scriptFormat: 'JavaScript', value: '' });
        const listener = bpmnFactory.create('camunda:ExecutionListener', { event: eventsFor(element)[0], script });
        script.$parent = listener;
        addExtensionElement(element, bo, listener, bpmnFactory, commandStack);
    };

    return { id: 'BpmnServer__Scripts', label: translate('Scripts'), component: ListGroup, items, add };
}
