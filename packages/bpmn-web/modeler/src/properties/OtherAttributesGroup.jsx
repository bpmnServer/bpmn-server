// Attributes a model file sets that no other group shows and bpmn-server does not read: BPMN attributes other
// tools write (gatewayDirection, processType, ...) and attributes of namespaces no descriptor knows. Shown
// read-only so nothing in the file is hidden.
import { Group, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

/** BPMN attributes bpmn-server does not read and the panel has no field for. */
const UNREAD = ['gatewayDirection', 'processType', 'isClosed', 'associationDirection'];

function ReadOnlyField({ element, id, label, value }) {
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    return <TextFieldEntry
        element={element}
        id={id}
        label={label}
        description={translate('Set in the file; not used by bpmn-server')}
        debounce={debounce}
        disabled
        getValue={() => value}
        setValue={() => { }}
    />;
}

function attributesOf(bo, prefix = '') {
    if (!bo)
        return [];
    // written in the file, even false, unless it is the default
    const written = name => Object.prototype.hasOwnProperty.call(bo, name) && bo.get(name) !== bo.$model.getPropertyDescriptor(bo, name)?.default;
    const found = UNREAD.filter(written).map(name => [prefix + name, String(bo.get(name))]);
    for (const [name, value] of Object.entries(bo.$attrs || {}))
        if (!name.startsWith('xmlns') && name !== 'xsi:type')
            found.push([prefix + name, String(value)]);
    return found;
}

export function OtherAttributesGroup(element, translate) {
    const bo = getBusinessObject(element);
    const found = attributesOf(bo);
    if (is(bo, 'bpmn:Participant'))
        found.push(...attributesOf(bo.get('processRef'), 'process '));
    if (is(bo, 'bpmn:Collaboration') && bo.get('name'))
        found.unshift(['name', bo.get('name')]);    // the panel's General group has no name for a collaboration
    if (!found.length)
        return null;
    return {
        id: 'BpmnServer__OtherAttributes',
        label: translate('Other attributes'),
        component: Group,
        entries: found.map(([label, value], index) => ({
            id: `other-attribute-${index}`, element, label, value, component: ReadOnlyField, isEdited: isTextFieldEntryEdited
        }))
    };
}
