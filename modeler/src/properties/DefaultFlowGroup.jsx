// The flow a gateway (or activity) takes when no condition of its other flows is true: bpmn-server reads
// `default` (Gateway.ts). The diagram marks it with a slash; the panel names it and lets it be changed.
import { Group, SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, isAny, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

const SOURCES = ['bpmn:ExclusiveGateway', 'bpmn:InclusiveGateway', 'bpmn:ComplexGateway', 'bpmn:Activity'];

/** The flows leaving the element, by their source: a file need not list them as the element's outgoing. */
const outgoingOf = bo => (bo.$parent?.get('flowElements') || []).filter(flow => is(flow, 'bpmn:SequenceFlow') && flow.get('sourceRef') === bo);

function DefaultFlowField({ element, id }) {
    const modeling = useService('modeling');
    const translate = useService('translate');
    const bo = getBusinessObject(element);
    const outgoing = () => outgoingOf(bo);
    return <SelectEntry
        element={element}
        id={id}
        label={translate('Default flow')}
        description={translate('Taken when no condition of the other flows is true')}
        getValue={() => bo.get('default')?.id || ''}
        setValue={value => modeling.updateProperties(element, { default: outgoing().find(flow => flow.id === value) })}
        getOptions={() => [
            { value: '', label: translate('<none>') },
            ...outgoing().map(flow => ({ value: flow.id, label: flow.name ? `${flow.name} (${flow.id})` : flow.id }))
        ]}
    />;
}

export function DefaultFlowGroup(element, translate) {
    if (!isAny(element, SOURCES))
        return null;
    const bo = getBusinessObject(element);
    // gateways always; an activity only when it has one (a default flow out of a task is rare)
    if (is(element, 'bpmn:Activity') && !bo.get('default'))
        return null;
    if (!outgoingOf(bo).length)
        return null;
    return {
        id: 'BpmnServer__DefaultFlow',
        label: translate('Default flow'),
        component: Group,
        entries: [{ id: 'defaultFlow', element, component: DefaultFlowField, isEdited: isSelectEntryEdited }]
    };
}
