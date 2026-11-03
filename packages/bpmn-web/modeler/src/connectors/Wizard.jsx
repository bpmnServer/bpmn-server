// The connector wizard: a service task's connector set up in a window over the editor, in three steps.
//   1. Operation: every operation of the connectors this designer may use, found by a search (connector, operation,
//      method, path, summary).
//   2. Inputs: the operation's parameters and body fields, each a value or an expression; the required ones filled
//      in as the data of the same name (${data.owner}), a value the task has already kept.
//   3. Outputs: the response's fields (and the whole response), each with a check box and the data name it is kept
//      under.
// Nothing changes in the model until Done, which writes the connector, its inputs and outputs as one undoable step.
// Cancel leaves the task as it was.
import { render } from '@bpmn-io/properties-panel/preact';
import { useState, useMemo, useEffect, useRef } from '@bpmn-io/properties-panel/preact/hooks';
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

/** The task's camunda:connector, if it has one. */
export function getConnector(element) {
    const values = getBusinessObject(element).get('extensionElements')?.get('values') ?? [];
    return values.find(v => is(v, 'camunda:Connector')) ?? null;
}

/** An operation's inputs: its parameters, then its JSON body (its fields as body.<field>, else body). */
export function operationInputs(op) {
    return [
        ...op.parameters.map(p => ({ name: p.name, required: p.required, in: p.in, type: p.type, enum: p.enum, description: p.description })),
        ...(op.body ? (op.body.fields.length
            ? op.body.fields.map(f => ({ name: `body.${f}`, required: op.body.requiredFields.includes(f), in: 'body' }))
            : [{ name: 'body', required: op.body.required, in: 'body', description: 'the request body: an object, or an expression' }]) : [])
    ];
}

/** The response's part an output parameter keeps: '' for all of it (${output}), the field of ${output.<field>}. */
export const fieldOf = expression => {
    const text = String(expression ?? '').trim();
    if (text === '${output}') return '';
    // a field's path only (output.a.b); anything else (${output.tier + '!'}) is an expression of its own
    const match = /^\$\{output\.([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\}$/.exec(text);
    return match ? match[1] : null;
};
export const expressionOf = field => field ? `\${output.${field}}` : '${output}';
const fromData = name => `\${data.${name.replace(/^body\./, '')}}`;
const nameOf = field => field ? field.split('.').pop() : 'response';

const STEPS = ['Operation', 'Inputs', 'Outputs'];

/** The words an operation is found by. */
const searchText = (c, op) => [c.id, c.name, op.operationId, op.method, op.path, op.summary].filter(Boolean).join(' ').toLowerCase();

function Wizard({ element, connectors, translate, onDone, onCancel }) {
    const existing = getConnector(element);
    const io = existing?.get('inputOutput');
    const found = connectors.find(existing?.get('connectorId'));
    const [step, setStep] = useState(found.operation ? 1 : 0);
    const [choice, setChoice] = useState(found.operation ? { connector: found.connector, operation: found.operation } : null);
    const [query, setQuery] = useState('');
    // the values the task has, by input name; and its outputs, by the field they keep
    const [values, setValues] = useState(() => Object.fromEntries((io?.get('inputParameters') ?? []).map(p => [p.get('name'), p.get('value') ?? ''])));
    const [outputs, setOutputs] = useState(() => {
        const kept = new Map();
        for (const p of io?.get('outputParameters') ?? []) {
            const field = fieldOf(p.get('value'));
            if (field !== null && !kept.has(field)) kept.set(field, { on: true, name: p.get('name') ?? nameOf(field) });
        }
        return kept;
    });
    // outputs with an expression of their own: kept as written
    const own = (io?.get('outputParameters') ?? []).filter(p => fieldOf(p.get('value')) === null);
    const search = useRef(null);
    useEffect(() => { if (step === 0) search.current?.focus(); }, [step]);

    const matches = useMemo(() => {
        const words = query.toLowerCase().split(/\s+/).filter(Boolean);
        return connectors.list.map(c => ({ connector: c, operations: c.operations.filter(op => words.every(w => searchText(c, op).includes(w))) }))
            .filter(g => g.operations.length);
    }, [query, connectors.list]);
    const count = matches.reduce((n, g) => n + g.operations.length, 0);

    const op = choice?.operation;
    const inputs = op ? operationInputs(op) : [];
    const fields = op ? ['', ...(op.outputs ?? [])] : [];
    const isPicked = (c, o) => choice?.connector.id === c.id && choice.operation.operationId === o.operationId;

    const pick = (connector, operation) => {
        if (!isPicked(connector, operation)) {
            // the required inputs from the data of the same name; a value given already kept
            const next = {};
            for (const input of operationInputs(operation))
                next[input.name] = values[input.name] ?? (input.required ? fromData(input.name) : '');
            setValues(next);
            setChoice({ connector, operation });
        }
        setStep(1);
    };
    const setValue = (name, value) => setValues(before => ({ ...before, [name]: value }));
    const setOutput = (field, change) => setOutputs(before => {
        const next = new Map(before);
        next.set(field, { on: false, name: nameOf(field), ...before.get(field), ...change });
        return next;
    });
    const ticked = fields.filter(f => outputs.get(f)?.on);
    const missing = inputs.filter(i => i.required && !String(values[i.name] ?? '').trim());

    const done = () => onDone({
        connectorId: `${choice.connector.id}/${op.operationId}`,
        inputs: [
            ...inputs.filter(i => String(values[i.name] ?? '').trim()).map(i => ({ name: i.name, value: values[i.name].trim() })),
            // a value the task has for what the operation does not take: kept, as the panel shows it
            ...Object.entries(values).filter(([name, value]) => !inputs.some(i => i.name === name) && value).map(([name, value]) => ({ name, value }))
        ],
        outputs: ticked.map(f => ({ name: (outputs.get(f).name || nameOf(f)).trim(), value: expressionOf(f) })),
        own
    });

    return <div class="connector-wizard-frame">
        <header class="connector-wizard-header">
            <h2>{translate('Connector')}{choice ? <span class="connector-wizard-chosen"> · {choice.connector.id}/{op.operationId}</span> : null}</h2>
            <ol class="connector-wizard-steps">
                {STEPS.map((label, n) => <li key={label}>
                    <button type="button" id={`connector-wizard-step-${n}`} class={n === step ? 'current' : ''} disabled={n > 0 && !choice}
                        onClick={() => setStep(n)}>{n + 1}. {translate(label)}</button>
                </li>)}
            </ol>
            <button type="button" class="connector-wizard-close" title={translate('Cancel')} onClick={onCancel}>✕</button>
        </header>

        <main class="connector-wizard-body">
            {step === 0 ? <section>
                <input ref={search} id="connector-wizard-search" type="search" value={query} placeholder={translate('Search: connector, operation, path, summary')}
                    onInput={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && count === 1) pick(matches[0].connector, matches[0].operations[0]); }} />
                <p class="connector-wizard-note">
                    {!connectors.loaded ? translate('Reading the connectors…')
                        : !connectors.list.length ? translate('No connector you may use: an administrator adds them (Administration, Connectors).')
                        : `${count} ${count === 1 ? translate('operation') : translate('operations')}`}
                </p>
                {matches.map(({ connector, operations }) => <div class="connector-wizard-group" key={connector.id}>
                    <h3>{connector.name && connector.name !== connector.id ? `${connector.name} (${connector.id})` : connector.id}
                        {connector.description ? <span class="connector-wizard-description"> {connector.description}</span> : null}</h3>
                    <ul class="connector-wizard-operations">
                        {operations.map(o => <li key={o.operationId}>
                            <button type="button" class={`connector-wizard-operation${isPicked(connector, o) ? ' picked' : ''}`}
                                data-operation={`${connector.id}/${o.operationId}`} onClick={() => pick(connector, o)}>
                                <span class={`connector-wizard-method ${o.method.toLowerCase()}`}>{o.method}</span>
                                <span class="connector-wizard-path">{o.path}</span>
                                <span class="connector-wizard-id">{o.operationId}</span>
                                {o.summary ? <span class="connector-wizard-summary">{o.summary}</span> : null}
                            </button>
                        </li>)}
                    </ul>
                </div>)}
            </section> : null}

            {step === 1 && op ? <section>
                <p class="connector-wizard-note">
                    {translate('Each input is a value, or an expression: ${data.email}. An input left empty is not sent; * marks the required ones.')}
                </p>
                {inputs.length ? <table class="connector-wizard-table">
                    <thead><tr><th>{translate('Input')}</th><th>{translate('In')}</th><th>{translate('Value')}</th></tr></thead>
                    <tbody>
                        {inputs.map(input => <tr key={input.name} class={missing.includes(input) ? 'missing' : ''}>
                            <td>
                                <label for={`connector-wizard-in-${input.name}`} class="connector-wizard-input-name">{input.name}{input.required ? ' *' : ''}</label>
                                {input.description ? <div class="connector-wizard-description">{input.description}</div> : null}
                            </td>
                            <td class="connector-wizard-in">{input.in}{input.type ? ` · ${input.type}` : ''}</td>
                            <td>
                                <div class="connector-wizard-value">
                                    <input id={`connector-wizard-in-${input.name}`} value={values[input.name] ?? ''}
                                        list={input.enum ? `connector-wizard-enum-${input.name}` : undefined}
                                        placeholder={input.enum ? input.enum.join(' | ') : ''}
                                        onInput={e => setValue(input.name, e.target.value)} />
                                    {input.enum ? <datalist id={`connector-wizard-enum-${input.name}`}>{input.enum.map(v => <option value={v} key={v} />)}</datalist> : null}
                                    {values[input.name] !== fromData(input.name)
                                        ? <button type="button" class="connector-wizard-small" title={fromData(input.name)}
                                            onClick={() => setValue(input.name, fromData(input.name))}>{translate('from data')}</button>
                                        : null}
                                </div>
                            </td>
                        </tr>)}
                    </tbody>
                </table> : <p>{translate('The operation takes no input.')}</p>}
            </section> : null}

            {step === 2 && op ? <section>
                <p class="connector-wizard-note">{translate('Tick the parts of the response to keep: each is kept in the data under the name given.')}</p>
                <table class="connector-wizard-table">
                    <thead><tr>
                        <th class="connector-wizard-check">
                            <input type="checkbox" id="connector-wizard-out-all" aria-label={translate('All')}
                                checked={fields.length > 0 && ticked.length === fields.length}
                                onChange={e => fields.forEach(f => setOutput(f, { on: e.target.checked }))} />
                        </th>
                        <th>{translate('Response')}</th><th>{translate('Kept as')}</th>
                    </tr></thead>
                    <tbody>
                        {fields.map(f => {
                            const out = outputs.get(f);
                            return <tr key={f} class={out?.on ? 'on' : ''}>
                                <td class="connector-wizard-check">
                                    <input type="checkbox" id={`connector-wizard-out-${f || 'response'}`} data-field={f} checked={Boolean(out?.on)}
                                        onChange={e => setOutput(f, { on: e.target.checked })} />
                                </td>
                                <td><label for={`connector-wizard-out-${f || 'response'}`}>{f || translate('the whole response')}</label></td>
                                <td><input id={`connector-wizard-name-${f || 'response'}`} aria-label={translate('Data name')} disabled={!out?.on}
                                    value={out?.name ?? nameOf(f)} onInput={e => setOutput(f, { name: e.target.value })} /></td>
                            </tr>;
                        })}
                    </tbody>
                </table>
                {fields.length === 1 ? <p class="connector-wizard-note">{translate('The operation\'s document lists no fields of the response.')}</p> : null}
                {own.length ? <p class="connector-wizard-note">
                    {translate('Kept as written:')} {own.map(p => `${p.get('name')} = ${p.get('value')}`).join(', ')}
                </p> : null}
            </section> : null}
        </main>

        <footer class="connector-wizard-footer">
            {step === 1 && missing.length
                ? <span class="connector-wizard-warning">{translate('Required:')} {missing.map(i => i.name).join(', ')}</span>
                : <span />}
            <div>
                <button type="button" id="connector-wizard-cancel" onClick={onCancel}>{translate('Cancel')}</button>
                {step > 0 ? <button type="button" id="connector-wizard-back" onClick={() => setStep(step - 1)}>{translate('Back')}</button> : null}
                {step > 0 && step < 2 ? <button type="button" id="connector-wizard-next" onClick={() => setStep(step + 1)}>{translate('Next')}</button> : null}
                <button type="button" id="connector-wizard-done" class="primary" disabled={!choice} onClick={done}>{translate('Done')}</button>
            </div>
        </footer>
    </div>;
}

/** Opens the wizard for a service or send task: open(element), a promise of whether Done changed it. */
class ConnectorWizard {
    constructor(connectors, bpmnFactory, commandStack, translate, eventBus) {
        this._connectors = connectors;
        this._bpmnFactory = bpmnFactory;
        this._commandStack = commandStack;
        this._translate = translate;
        eventBus.on('connectors.changed', () => this._render?.());
        eventBus.on('diagram.destroy', () => this.close());
    }

    open(element) {
        this.close();
        const closed = new Promise(resolve => { this._closed = resolve; });
        const dialog = document.createElement('dialog');
        dialog.id = 'js-connector-wizard';
        dialog.className = 'connector-wizard';
        // Escape closes the dialog: as Cancel
        dialog.addEventListener('cancel', event => { event.preventDefault(); this.close(); });
        document.body.append(dialog);
        this._dialog = dialog;
        this._render = () => render(<Wizard element={element} connectors={this._connectors} translate={this._translate}
            onDone={result => { this.apply(element, result); this.close(true); }} onCancel={() => this.close()} />, dialog);
        this._render();
        dialog.showModal();
        this._connectors.load();
        return closed;
    }

    close(applied = false) {
        if (!this._dialog) return;
        render(null, this._dialog);
        this._dialog.remove();
        this._dialog = this._render = null;
        this._closed?.(applied);
    }

    /** The connector, its inputs and outputs written as one step; a service's name goes (a task calls one or the other). */
    apply(element, { connectorId, inputs, outputs, own }) {
        const factory = this._bpmnFactory;
        const bo = getBusinessObject(element);
        const commands = [];
        const update = (moddleElement, properties) => commands.push({ cmd: 'element.updateModdleProperties', context: { element, moddleElement, properties } });
        let extensionElements = bo.get('extensionElements');
        if (!extensionElements) {
            extensionElements = factory.create('bpmn:ExtensionElements', { values: [] });
            extensionElements.$parent = bo;
            update(bo, { extensionElements });
        }
        if (bo.get('implementation') || bo.get('camunda:delegateExpression'))
            update(bo, { implementation: undefined, 'camunda:delegateExpression': undefined });

        const io = factory.create('camunda:InputOutput');
        const parameters = (type, list) => list.map(({ name, value }) => {
            const p = factory.create(type, { name, value });
            p.$parent = io;
            return p;
        });
        io.set('inputParameters', parameters('camunda:InputParameter', inputs));
        io.set('outputParameters', [...parameters('camunda:OutputParameter', outputs),
            ...own.map(p => { const copy = factory.create('camunda:OutputParameter', { name: p.get('name'), value: p.get('value') }); copy.$parent = io; return copy; })]);

        const values = extensionElements.get('values') ?? [];
        const before = getConnector(element);
        if (before) {
            io.$parent = before;
            update(before, { connectorId, inputOutput: io });
        }
        else {
            const connector = factory.create('camunda:Connector', { connectorId, inputOutput: io });
            io.$parent = connector;
            connector.$parent = extensionElements;
            update(extensionElements, { values: [...values, connector] });
        }
        this._commandStack.execute('properties-panel.multi-command-executor', commands);
    }
}

ConnectorWizard.$inject = ['connectors', 'bpmnFactory', 'commandStack', 'translate', 'eventBus'];

export default ConnectorWizard;
