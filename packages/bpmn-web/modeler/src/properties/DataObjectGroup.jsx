// A data object (or data store) as bpmn-server uses it: the application loads it (appDelegate.loadDataObject)
// into the instance data when an element connected to it runs, under its name (data.client), and it is saved
// with the instance. The name is set in General; this group shows the field and what loads it.
import { Group, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, isAny, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import { dataObjectName, dataField, loadersOf } from './dataObjects.js';

export { dataObjectName, dataField, loadersOf };

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
