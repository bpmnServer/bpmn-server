// The Label group (docs/design/labels.md): on the process, the case's label; on any element of the diagram, its
// label and its label once done. A label is a template: `${Name = data.path}` names a value (the lists offer it as a
// column and a filter), `${data.path}` is plain text. Checked as it is typed, as the engine reads it.
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { templateProblems } from 'bpmn-server/dist/engine/LabelTemplate.js';

const CASE_HELP = 'What a case is called in the lists: text, with values named, e.g. Client: ${Client = data.clientId}';
const ELEMENT_HELP = 'Shown in the lists and on the instance page, e.g. Approve ${Amount = data.amount} for ${instance.Client}';
const DONE_HELP = 'Once it has ended, e.g. Approved by ${completedBy}';

function LabelField({ element, id, attribute, label, description }) {
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');
    const translate = useService('translate');
    const bo = getBusinessObject(element);
    // a pool's label is its process's
    const target = is(bo, 'bpmn:Participant') ? bo.get('processRef') : bo;

    return <TextFieldEntry
        element={element}
        id={id}
        label={translate(label)}
        description={translate(description)}
        debounce={debounce}
        getValue={() => target?.get(attribute) || ''}
        setValue={value => is(bo, 'bpmn:Participant')
            ? modeling.updateModdleProperties(element, target, { [attribute]: value || undefined })
            : modeling.updateProperties(element, { [attribute]: value || undefined })}
        validate={value => (value ? templateProblems(value)[0] : undefined)}
    />;
}

const entry = (element, props) => ({ element, ...props, component: LabelField, isEdited: isTextFieldEntryEdited });

/** The Label group for the process (or its pool) and for any flow element but a sequence flow; else null. */
export function LabelGroup(element, translate) {
    const bo = getBusinessObject(element);
    if (is(bo, 'bpmn:Process') || (is(bo, 'bpmn:Participant') && bo.get('processRef')))
        return {
            id: 'BpmnServer__Label', label: translate('Label'),
            entries: [entry(element, { id: 'case-label', attribute: 'camunda:label', label: 'Case label', description: CASE_HELP })],
        };
    if (!is(bo, 'bpmn:FlowNode'))
        return null;
    return {
        id: 'BpmnServer__Label', label: translate('Label'),
        entries: [
            entry(element, { id: 'element-label', attribute: 'camunda:label', label: 'Label', description: ELEMENT_HELP }),
            entry(element, { id: 'element-end-label', attribute: 'camunda:endLabel', label: 'Label once done', description: DONE_HELP }),
        ],
    };
}
