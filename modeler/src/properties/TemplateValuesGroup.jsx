// A task made from an element template shows only the template's fields; the template's Hidden values (the
// service it calls, a script it runs) are set in the file all the same, so they are listed here, read-only.
import { Group, TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

function TemplateValueField({ element, id, label, value }) {
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    return <TextFieldEntry
        element={element}
        id={id}
        label={label}
        description={translate('Set by the template')}
        debounce={debounce}
        disabled
        getValue={() => value}
        setValue={() => { }}
    />;
}

/** What a Hidden binding sets, named the way the file names it. */
function describe(binding) {
    switch (binding.type) {
        case 'property': return binding.name;
        case 'camunda:inputParameter': return `input ${binding.name}`;
        case 'camunda:outputParameter': return `output ${binding.source}`;
        case 'camunda:executionListener': return `'${binding.event}' script`;
        default: return binding.type;
    }
}

export function TemplateValuesGroup(element, injector) {
    let elementTemplates;
    try {
        elementTemplates = injector.get('elementTemplates');
    } catch {
        return null;    // templates not loaded in this editor
    }
    const template = elementTemplates.get(element);
    const hidden = (template?.properties || []).filter(p => p.type === 'Hidden' && p.value !== undefined);
    if (!hidden.length)
        return null;
    return {
        id: 'ElementTemplates__BpmnServerValues',   // the templates provider keeps ElementTemplates__ groups
        label: injector.get('translate')('Template values'),
        component: Group,
        entries: hidden.map((property, index) => ({
            id: `template-value-${index}`, element, component: TemplateValueField, isEdited: isTextFieldEntryEdited,
            label: property.label ? `${property.label} (${describe(property.binding)})` : describe(property.binding),
            value: String(property.value)
        }))
    };
}
