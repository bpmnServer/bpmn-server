// The language of a script or condition. bpmn-server runs JavaScript; a model can say otherwise (or say
// nothing), and the field shows what it says, so a file's value is never hidden.
import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

function FormatField({ element, id, label, target, property, allowEmpty }) {
    const commandStack = useService('commandStack');
    const translate = useService('translate');
    const current = () => target()?.get(property) || '';
    const options = () => {
        const values = [...(allowEmpty ? [''] : []), 'JavaScript'];
        if (!values.some(v => v.toLowerCase() === current().toLowerCase()))
            values.push(current());     // another language: shown, and listed under Problems
        return values.map(value => ({ value, label: value || translate('<not set>') }));
    };
    return <SelectEntry
        element={element}
        id={id}
        label={translate(label)}
        description={translate('bpmn-server runs JavaScript')}
        getValue={() => /^javascript$/i.test(current()) ? 'JavaScript' : current()}
        setValue={value => commandStack.execute('element.updateModdleProperties',
            { element, moddleElement: target(), properties: { [property]: value || undefined } })}
        getOptions={options}
    />;
}

/**
 * The entry for a group. `target` returns the object that holds the format (the script task, a camunda:Script,
 * a condition), `property` names it (scriptFormat, language).
 */
export function formatEntry(element, { id, label = 'Format', target, property, allowEmpty = false }) {
    return { id, element, label, target, property, allowEmpty, component: FormatField, isEdited: isSelectEntryEdited };
}
