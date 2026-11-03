// A service task that calls a connector (work/connectors.md): a REST API the administrator added, named with one of
// its operations, `<connector>/<operationId>`, in camunda:connector, with the connector's own input/output
// parameters. The panel shows what the task calls; the connector wizard (connectors/Wizard.jsx) sets it up: the
// operation found by a search, its inputs, the parts of the response kept.
import { SelectEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { useEffect, useState } from '@bpmn-io/properties-panel/preact/hooks';
import { getConnector, operationInputs, fieldOf } from '../connectors/Wizard.jsx';

export { getConnector };

/** Re-render when the connectors have been read (again). */
function useConnectors() {
    const connectors = useService('connectors');
    const eventBus = useService('eventBus');
    const [, setVersion] = useState(0);
    useEffect(() => {
        const changed = () => setVersion(v => v + 1);
        eventBus.on('connectors.changed', changed);
        return () => eventBus.off('connectors.changed', changed);
    }, [eventBus]);
    return connectors;
}

// ---- Calls: a service, or a connector (set up in the wizard)

function CallsField({ element, id }) {
    const translate = useService('translate');
    const modeling = useService('modeling');
    const wizard = useService('connectorWizard');
    return <SelectEntry
        element={element}
        id={id}
        label={translate('Calls')}
        description={translate('A service of the application, or a connector: a REST API the administrator added')}
        getValue={() => getConnector(element) ? 'connector' : 'service'}
        getOptions={() => [{ value: 'service', label: translate('Service') }, { value: 'connector', label: translate('Connector') }]}
        setValue={value => {
            const connector = getConnector(element);
            if (value === 'connector') {
                // nothing changes until the wizard is done; cancelled, the select shows Service again (the model, unchanged,
                // does not re-render it)
                if (!connector) wizard.open(element).then(applied => {
                    const select = document.getElementById(`bio-properties-panel-${id}`);
                    if (!applied && select) select.value = 'service';
                });
            }
            else if (connector) {
                const extensionElements = getBusinessObject(element).get('extensionElements');
                modeling.updateModdleProperties(element, extensionElements, { values: extensionElements.get('values').filter(v => v !== connector) });
            }
        }}
    />;
}

// ---- what the task calls, its inputs and outputs: shown, and changed in the wizard

function ConnectorSummary({ element, id }) {
    const translate = useService('translate');
    const wizard = useService('connectorWizard');
    const connectors = useConnectors();
    const connector = getConnector(element);
    const ref = connector?.get('connectorId') ?? '';
    const found = connectors.find(ref);
    const op = found.operation;
    const io = connector?.get('inputOutput');
    const inputs = io?.get('inputParameters') ?? [];
    const outputs = io?.get('outputParameters') ?? [];
    const missing = op ? operationInputs(op).filter(i => i.required && !inputs.some(p => p.get('name') === i.name && p.get('value'))) : [];

    let problem = null;
    if (!found.id) problem = translate('No operation chosen yet.');
    else if (connectors.loaded && !found.connector) problem = `${translate('This server has no connector')} '${found.id}'.`;
    else if (connectors.loaded && !op) problem = `${translate('The connector has no operation')} '${found.operationId}'.`;
    else if (missing.length) problem = `${translate('Required inputs with no value:')} ${missing.map(i => i.name).join(', ')}.`;

    return <div class="bio-properties-panel-connector-summary" id={id}>
        {found.id ? <div class="bio-properties-panel-connector-ref">
            <code id={`${id}-ref`} data-value={ref}>{ref}</code>
            {op ? <div class="bio-properties-panel-description">{op.method} {op.path}{op.summary ? `: ${op.summary}` : ''}</div> : null}
        </div> : null}
        {problem ? <p class="bio-properties-panel-connector-problem" id={`${id}-problem`}>{problem}</p> : null}

        <h4 class="bio-properties-panel-connector-heading">{translate('Inputs')}</h4>
        {inputs.length ? <ul class="bio-properties-panel-connector-list" id={`${id}-inputs`}>
            {inputs.map(p => <li key={p.get('name')}><span data-value={p.get('name')}>{p.get('name')}</span> = <code data-value={p.get('value')}>{p.get('value')}</code></li>)}
        </ul> : <p class="bio-properties-panel-description">{translate('None')}</p>}

        <h4 class="bio-properties-panel-connector-heading">{translate('Outputs')}</h4>
        {outputs.length ? <ul class="bio-properties-panel-connector-list" id={`${id}-outputs`}>
            {outputs.map(p => {
                const field = fieldOf(p.get('value'));
                return <li key={p.get('name')}>
                    {field === null ? <code data-value={p.get('value')}>{p.get('value')}</code> : <span data-value={p.get('value')} title={p.get('value')}>{field || translate('the whole response')}</span>}
                    {' → '}<span class="bio-properties-panel-connector-name" data-value={p.get('name')}>{p.get('name')}</span>
                </li>;
            })}
        </ul> : <p class="bio-properties-panel-description">{translate('None: nothing of the response is kept')}</p>}

        {op?.errors?.length ? <p class="bio-properties-panel-description">
            {translate('Answers')} {op.errors.map(e => `${e.status} (HTTP_${e.status})`).join(', ')}: {translate('a boundary error event catches them.')}
        </p> : null}
        <button type="button" id={`${id}-edit`} class="bio-properties-panel-connector-edit" onClick={() => wizard.open(element)}>
            {found.id ? translate('Edit connector…') : translate('Choose an operation…')}
        </button>
    </div>;
}

/** The Service group's entries for a task that calls a connector, after Calls. */
export function connectorEntries(element) {
    return [{ id: 'connector-summary', element, component: ConnectorSummary }];
}

export const callsEntry = element => ({ id: 'service-calls', element, component: CallsField, isEdited: () => Boolean(getConnector(element)) });

/** The task's own camunda:inputOutput (not the connector's), if it has one with parameters. */
export function taskInputOutput(element) {
    const values = getBusinessObject(element).get('extensionElements')?.get('values') ?? [];
    const io = values.find(v => is(v, 'camunda:InputOutput'));
    return io && ((io.get('inputParameters')?.length ?? 0) + (io.get('outputParameters')?.length ?? 0)) > 0 ? io : null;
}
