// The Extended Forms add-on's part of the editor (docs/design/form-lookups.md): each form field's choices from a
// source (<owf:list>, <owf:lookup>), after Camunda's own entries. Loaded only when the add-on is on; without it a form
// field is Camunda's, and the model keeps its lists and lookups.
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { formChoicesEntries } from './FormChoicesEntries.jsx';

// after bpmn-server's own provider (400)
const PRIORITY = 300;

/** The element's form fields, in the order Camunda's Form fields list has them. */
function formFieldsOf(element) {
    const values = getBusinessObject(element).get('extensionElements')?.get('values') || [];
    return values.find(value => is(value, 'camunda:FormData'))?.get('fields') || [];
}

class FormsPropertiesProvider {
    constructor(propertiesPanel) {
        propertiesPanel.registerProvider(PRIORITY, this);
    }

    getGroups(element) {
        return groups => {
            const formFields = groups.find(g => g.id === 'CamundaPlatform__FormData');
            if (formFields?.items) {
                const fields = formFieldsOf(element);
                formFields.items = formFields.items.map((item, index) => fields[index]
                    ? { ...item, entries: [...item.entries, ...formChoicesEntries(element, fields[index], item.id)] } : item);
            }
            return groups;
        };
    }
}
FormsPropertiesProvider.$inject = ['propertiesPanel'];

export default {
    __init__: ['formsPropertiesProvider'],
    formsPropertiesProvider: ['type', FormsPropertiesProvider]
};
