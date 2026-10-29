// Service and script tasks as bpmn-server runs them: a service task calls a service by name (Tasks.ts reads
// implementation, then camunda:delegateExpression), a script task runs JavaScript with the item as `this`.
import { Group, TextAreaEntry, isTextAreaEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { attributeEntry } from './AttributeEntry.jsx';

export function ServiceGroup(element, translate) {
    if (!is(element, 'bpmn:ServiceTask') && !is(element, 'bpmn:SendTask'))
        return null;
    // keep writing the attribute the model already uses; new models use camunda:delegateExpression
    const attribute = getBusinessObject(element).get('implementation') ? 'implementation' : 'camunda:delegateExpression';
    return {
        id: 'BpmnServer__Service',
        label: translate('Service'),
        component: Group,
        entries: [
            attributeEntry(element, {
                id: 'service-name', attribute, label: 'Service name',
                description: 'A service of the application\'s services provider, e.g. notifyManager'
            })
        ]
    };
}

function ScriptField({ element, id }) {
    const modeling = useService('modeling');
    const debounce = useService('debounceInput');
    const translate = useService('translate');

    return <TextAreaEntry
        element={element}
        id={id}
        label={translate('Script')}
        description={translate('JavaScript; this.data holds the instance data')}
        monospace
        rows={8}
        debounce={debounce}
        getValue={() => getBusinessObject(element).get('script') || ''}
        setValue={value => modeling.updateProperties(element, { scriptFormat: 'JavaScript', script: value || undefined })}
    />;
}

export function ScriptGroup(element, translate) {
    if (!is(element, 'bpmn:ScriptTask'))
        return null;
    return {
        id: 'BpmnServer__Script',
        label: translate('Script'),
        component: Group,
        entries: [{ id: 'script-body', element, component: ScriptField, isEdited: isTextAreaEntryEdited }]
    };
}
