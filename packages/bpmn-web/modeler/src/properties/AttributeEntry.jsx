// A text field bound to one attribute of the selected element's business object.
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

function AttributeField({ element, id, attribute, label, description }) {
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');
    const translate = useService('translate');

    return <TextFieldEntry
        element={element}
        id={id}
        label={translate(label)}
        description={description && translate(description)}
        debounce={debounce}
        getValue={() => getBusinessObject(element).get(attribute) || ''}
        setValue={value => modeling.updateProperties(element, { [attribute]: value || undefined })}
    />;
}

/** The entry for a properties group: { id, attribute, label, description? } */
export function attributeEntry(element, { id, attribute, label, description }) {
    return { id, element, attribute, label, description, component: AttributeField, isEdited: isTextFieldEntryEdited };
}
