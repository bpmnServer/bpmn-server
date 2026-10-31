// A data object (or data store) as bpmn-server uses it: the application loads it (appDelegate.loadDataObject)
// into the instance data when an element connected to it runs, under its name (data.client), and it is saved
// with the instance. The name is set in General; this group shows the field and what loads it.
import { Group, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, isAny, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/** The name bpmn-server stores it under: as the diagram shows it, else the data object's, else the id. */
export function dataObjectName(bo) {
    const target = bo.get('dataObjectRef') || bo.get('dataStoreRef') || bo;
    return bo.get('name') || target.get('name') || target.id || bo.id;
}

/** How scripts reach it: data.client, or data['my client'] for a name that is not an identifier. */
export function dataField(name) {
    return IDENTIFIER.test(name) ? `data.${name}` : `data[${JSON.stringify(name)}]`;
}

/** The elements connected to a data object reference by a data association, either way. */
export function loadersOf(bo) {
    const found = [];
    const walk = container => (container.get('flowElements') || []).forEach(e => {
        const reads = (e.get('dataInputAssociations') || []).some(a => (a.get('sourceRef') || []).includes(bo));
        const writes = (e.get('dataOutputAssociations') || []).some(a => a.get('targetRef') === bo);
        if (reads || writes) found.push(e);
        if (is(e, 'bpmn:SubProcess')) walk(e);
    });
    let process = bo.$parent;
    while (process && !is(process, 'bpmn:Process')) process = process.$parent;
    if (process) walk(process);
    return found;
}

function ReadOnly({ element, id, label, value, description }) {
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    return <TextFieldEntry
        element={element}
        id={id}
        label={translate(label)}
        description={description && translate(description)}
        debounce={debounce}
        disabled
        getValue={() => value}
        setValue={() => { }}
    />;
}

export function DataObjectGroup(element, translate) {
    if (!isAny(element, ['bpmn:DataObjectReference', 'bpmn:DataStoreReference']))
        return null;
    const bo = getBusinessObject(element);
    const name = dataObjectName(bo);
    const loaders = loadersOf(bo);
    return {
        id: 'BpmnServer__DataObject',
        label: translate('Data object'),
        component: Group,
        entries: [
            { id: 'dataObject-field', element, label: 'In the instance data', value: dataField(name), component: ReadOnly, isEdited: isTextFieldEntryEdited,
                description: 'The application loads it (appDelegate.loadDataObject) when an element connected to it runs; it is saved with the instance, and later elements read and change it there.' },
            { id: 'dataObject-loaders', element, label: 'Loaded when these run', component: ReadOnly, isEdited: isTextFieldEntryEdited,
                value: loaders.map(e => e.get('name') ? `${e.get('name')} (${e.id})` : e.id).join(', ') || '—',
                description: loaders.length ? null : 'Nothing: connect it to an element (a start event, a service task) to have it loaded.' }
        ]
    };
}
