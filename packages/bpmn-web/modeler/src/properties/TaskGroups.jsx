// Service and script tasks as bpmn-server runs them: a service task calls a service by name (Tasks.ts reads
// implementation, then camunda:delegateExpression), a script task runs JavaScript with the item as `this`.
import { Group, CheckboxEntry, isCheckboxEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { attributeEntry } from './AttributeEntry.jsx';
import { formatEntry } from './FormatEntry.jsx';
import { codeEntry } from './code/CodeEntry.jsx';
import { callsEntry, connectorEntries, getConnector } from './ConnectorEntries.jsx';

function ExceptionsAsErrorsField({ element, id }) {
    const modeling = useService('modeling');
    const translate = useService('translate');
    return <CheckboxEntry
        element={element}
        id={id}
        label={translate('Exceptions raise a BPMN error')}
        description={translate('When the service or connector can not be called, or the script throws, a BPMN error is raised: its code is the exception\'s code (ECONNREFUSED, ETIMEDOUT), else its name (TypeError). An error event with no error catches any. Unchecked, the instance stops at the task, which can be retried.')}
        getValue={() => Boolean(getBusinessObject(element).get('camunda:exceptionsAsErrors'))}
        setValue={value => modeling.updateProperties(element, { 'camunda:exceptionsAsErrors': value || undefined })}
    />;
}

const exceptionsEntry = element => ({ id: 'exceptions-as-errors', element, component: ExceptionsAsErrorsField, isEdited: isCheckboxEntryEdited });

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
            callsEntry(element),
            ...(getConnector(element) ? connectorEntries(element) : [
                attributeEntry(element, {
                    id: 'service-name', attribute, label: 'Service name',
                    description: 'A service of the application\'s services provider, e.g. notifyManager'
                })
            ]),
            exceptionsEntry(element)
        ]
    };
}


export function ScriptGroup(element, translate) {
    if (!is(element, 'bpmn:ScriptTask'))
        return null;
    return {
        id: 'BpmnServer__Script',
        label: translate('Script'),
        component: Group,
        entries: [
            formatEntry(element, { id: 'script-format', target: () => getBusinessObject(element), property: 'scriptFormat' }),
            codeEntry(element, {
                id: 'script-body', label: 'Script', description: 'JavaScript; this.data holds the instance data', rows: 8,
                getValue: () => getBusinessObject(element).get('script') || '',
                setValue: (text, { modeling }) => modeling.updateProperties(element, {
                    scriptFormat: getBusinessObject(element).get('scriptFormat') || 'JavaScript', script: text || undefined
                })
            }),
            exceptionsEntry(element)
        ]
    };
}
