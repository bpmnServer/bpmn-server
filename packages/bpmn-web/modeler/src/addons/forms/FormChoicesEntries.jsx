// A form field's choices from a source (docs/design/form-lookups.md): <owf:list> (a drop-down of every choice) or
// <owf:lookup> (a search as the person types) inside the camunda:formField. Added to each field of Camunda's Form
// fields list: Choices, then the source and how its rows are read.
import { SelectEntry, TextFieldEntry, isSelectEntryEdited, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

const KINDS = ['list', 'lookup'];

/** The field's <owf:list> or <owf:lookup>, and which. */
export function choicesOf(formField) {
    for (const kind of KINDS) {
        const choices = formField.get(`owf:${kind}`);
        if (choices) return { kind, choices };
    }
    return { kind: '', choices: null };
}

function ChoicesKind({ element, id, formField }) {
    const translate = useService('translate');
    const bpmnFactory = useService('bpmnFactory');
    const commandStack = useService('commandStack');
    const setValue = kind => {
        const { kind: was, choices } = choicesOf(formField);
        if (kind === was) return;
        const properties = { 'owf:list': undefined, 'owf:lookup': undefined };
        if (kind) {
            // the source and the rest kept, from a list to a lookup or back; text only a lookup has
            const kept = {};
            for (const name of ['source', 'key', 'display', 'filter', 'filterInput', 'items', ...(kind === 'lookup' ? ['text'] : [])])
                if (choices?.get(name)) kept[name] = choices.get(name);
            const created = bpmnFactory.create(kind === 'list' ? 'owf:List' : 'owf:Lookup', kept);
            created.$parent = formField;
            properties[`owf:${kind}`] = created;
        }
        commandStack.execute('element.updateModdleProperties', { element, moddleElement: formField, properties });
    };
    return <SelectEntry
        element={element}
        id={id}
        label={translate('Choices')}
        description={translate('From a source the model names: a list offers every choice, a lookup searches as the person types')}
        getValue={() => choicesOf(formField).kind}
        setValue={setValue}
        getOptions={() => [
            { value: '', label: translate('<none>') },
            { value: 'list', label: translate('List (a drop-down)') },
            { value: 'lookup', label: translate('Lookup (a search)') },
        ]}
    />;
}

function ChoicesAttribute({ element, id, formField, attribute, label, description }) {
    const translate = useService('translate');
    const debounce = useService('debounceInput');
    const commandStack = useService('commandStack');
    return <TextFieldEntry
        element={element}
        id={id}
        label={translate(label)}
        description={description && translate(description)}
        debounce={debounce}
        getValue={() => choicesOf(formField).choices?.get(attribute) || ''}
        setValue={value => {
            const { choices } = choicesOf(formField);
            if (choices)
                commandStack.execute('element.updateModdleProperties', { element, moddleElement: choices, properties: { [attribute]: value || undefined } });
        }}
    />;
}

/** The entries for one form field of Camunda's list (idPrefix: the item's id). */
export function formChoicesEntries(element, formField, idPrefix) {
    const entries = [{ id: `${idPrefix}-choices`, element, formField, component: ChoicesKind, isEdited: isSelectEntryEdited }];
    const { kind, choices } = choicesOf(formField);
    if (!kind) return entries;
    const connector = /^connector:/.test(choices.get('source') || '');
    const attribute = (attribute, label, description) =>
        ({ id: `${idPrefix}-choices-${attribute}`, element, formField, attribute, label, description, component: ChoicesAttribute, isEdited: isTextFieldEntryEdited });
    entries.push(
        attribute('source', 'Source', 'service:<name> (the application\'s services) or connector:<connector>/<operation>'),
        attribute('key', 'Key', 'The field of a row that is saved (default: id)'),
        attribute('display', 'Display', 'The field of a row that is shown (default: the key)'),
        attribute('filter', 'Filter', 'Narrows the choices by the form\'s or the case\'s data, e.g. ${data.department}'));
    if (connector) {
        if (kind === 'lookup')
            entries.push(attribute('text', 'Text input', 'The operation\'s input the text typed goes to; without it the choices are searched here'));
        entries.push(
            attribute('filterInput', 'Filter input', 'The operation\'s input the filter goes to'),
            attribute('items', 'Rows at', 'Where the rows are in the answer, e.g. results (default: the answer, or its first list)'));
    }
    return entries;
}
