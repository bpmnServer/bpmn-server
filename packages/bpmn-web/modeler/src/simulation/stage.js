// The close-up of a simulation: a small card beside the element a change is about, zoomed in from it. It reads only what the
// page already has (the model, the run), and adds no data. A user task shows its form, empty as it starts and typed in as it is done; a gateway, each branch
// with its condition being evaluated, then which held; a flow, the condition it was taken on; a service, what it was
// called with going in and what it answered coming out. One card at a time; the next change replaces it.

// ---- what to show: read from the model and from the run that is already on the page

const FORM_TYPES = { string: 'text', long: 'number', int: 'number', integer: 'number', double: 'number', number: 'number', boolean: 'checkbox', date: 'date', enum: 'select' };
const GATEWAYS = {
    'bpmn:ExclusiveGateway': { gateway: 'exclusive', symbol: '✕', word: 'Exclusive: the first condition that holds' },
    'bpmn:InclusiveGateway': { gateway: 'inclusive', symbol: '○', word: 'Inclusive: every condition that holds' },
    'bpmn:ParallelGateway': { gateway: 'parallel', symbol: '+', word: 'Parallel: every flow, and a join waits for all' },
    'bpmn:EventBasedGateway': { gateway: 'event', symbol: '◇', word: 'Event-based: the first event that happens' },
    'bpmn:ComplexGateway': { gateway: 'complex', symbol: '✱', word: 'Complex' },
};
/** A timer event: { mode, when } as the model words it ('PT1H', a date, a cycle). */
function timerOf(el) {
    if (!['bpmn:StartEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'].includes(el.$type)) return null;
    const def = (el.eventDefinitions ?? []).find(d => d.$type === 'bpmn:TimerEventDefinition');
    if (!def) return null;
    const pick = [['duration', def.timeDuration], ['date', def.timeDate], ['cycle', def.timeCycle]].find(([, v]) => v);
    return { mode: pick?.[0] ?? 'duration', when: clean(pick?.[1]?.body ?? pick?.[1]?.$body ?? ''), attachedTo: clean(el.attachedToRef?.name) || el.attachedToRef?.id || null,
        interrupting: el.cancelActivity !== false };
}

/** An error or escalation event: raised by an end or throw event, caught by a boundary or start event. */
function errorOf(el) {
    const def = (el.eventDefinitions ?? []).find(d => d.$type === 'bpmn:ErrorEventDefinition' || d.$type === 'bpmn:EscalationEventDefinition');
    if (!def) return null;
    const direction = ['bpmn:EndEvent', 'bpmn:IntermediateThrowEvent'].includes(el.$type) ? 'raise' : ['bpmn:BoundaryEvent', 'bpmn:StartEvent'].includes(el.$type) ? 'catch' : null;
    if (!direction) return null;
    const ref = def.get?.('errorRef') ?? def.get?.('escalationRef');
    const what = def.$type === 'bpmn:ErrorEventDefinition' ? 'Error' : 'Escalation';
    return { direction, what, code: clean(ref?.errorCode ?? ref?.escalationCode ?? ref?.name ?? ''),
        attachedTo: clean(el.attachedToRef?.name) || el.attachedToRef?.id || null };
}

const SERVICE_TYPES = ['bpmn:ServiceTask', 'bpmn:BusinessRuleTask', 'bpmn:ScriptTask'];
// a message goes out from these and comes in at these (the event must carry a message definition; the tasks always do)
const SENDS = ['bpmn:SendTask', 'bpmn:EndEvent', 'bpmn:IntermediateThrowEvent'];
const RECEIVES = ['bpmn:ReceiveTask', 'bpmn:StartEvent', 'bpmn:IntermediateCatchEvent', 'bpmn:BoundaryEvent'];

/** { direction, message } of an element that sends or receives a message, else null. */
function messageOf(el) {
    const type = el.$type;
    const direction = SENDS.includes(type) ? 'send' : RECEIVES.includes(type) ? 'receive' : null;
    if (!direction) return null;
    const def = (el.eventDefinitions ?? []).find(d => d.$type === 'bpmn:MessageEventDefinition');
    const task = type === 'bpmn:SendTask' || type === 'bpmn:ReceiveTask';
    if (!def && !task) return null;
    return { direction, message: clean((def ?? el).get?.('messageRef')?.name) || '' };
}

/** An attribute of an element, as camunda: or owf: names it (a typed property, or an attribute the moddle did not know). */
const attr = (el, name) => el?.get?.(`camunda:${name}`) ?? el?.[name] ?? el?.$attrs?.[`camunda:${name}`] ?? undefined;
const clean = text => String(text ?? '').replace(/\s+/g, ' ').trim();
const extensions = el => el?.extensionElements?.values ?? [];

/** The form a user task declares: its fields, as they are drawn. */
function formOf(el) {
    const data = extensions(el).find(e => e.$type === 'camunda:FormData');
    return (data?.fields ?? []).map(f => ({
        id: f.id, label: clean(f.label) || f.id, type: f.type || 'string',
        input: FORM_TYPES[f.type] ?? 'text',
        options: (f.values ?? []).map(v => ({ id: v.id, name: v.name ?? v.id })),
        defaultValue: f.defaultValue,
    }));
}

/** What a service-like task calls, in the words the model uses for it. */
function callOf(el) {
    const connector = extensions(el).find(e => e.$type === 'camunda:Connector');
    if (connector) return { how: 'connector', name: connector.connectorId };
    const zeebe = extensions(el).find(e => e.$type === 'zeebe:taskDefinition');
    if (zeebe) return { how: 'worker', name: zeebe.$attrs?.type ?? zeebe.type };
    const delegate = attr(el, 'delegateExpression');
    if (delegate) return { how: 'service', name: clean(delegate).replace(/^[#$]\{|\}$/g, '') };
    const expression = attr(el, 'expression');
    if (expression) return { how: 'expression', name: clean(expression) };
    const klass = attr(el, 'class');
    if (klass) return { how: 'class', name: klass };
    if (el.$type === 'bpmn:ScriptTask') return { how: 'script', name: '' };
    return { how: 'service', name: clean(el.name) };
}

/** The names a task's input/output mapping declares (camunda:inputOutput, zeebe:ioMapping). */
function mappingOf(el) {
    const io = extensions(el).find(e => e.$type === 'camunda:InputOutput');
    const zeebe = extensions(el).find(e => e.$type === 'zeebe:ioMapping');
    const names = list => (list ?? []).map(p => p.name ?? p.$attrs?.target).filter(Boolean);
    return {
        inputs: names(io?.inputParameters ?? zeebe?.$children?.filter(c => c.$type === 'zeebe:input')),
        outputs: names(io?.outputParameters ?? zeebe?.$children?.filter(c => c.$type === 'zeebe:output')),
    };
}

/** A flow's condition, as the model writes it ('' when it has none). */
const conditionOf = flow => clean(flow?.conditionExpression?.body ?? flow?.conditionExpression?.$body ?? '');

/**
 * What the model says of each element a simulation shows close up, by id: a user task's form, a gateway's branches, a
 * flow's condition, a service's call. `moddle`: the model as bpmn-moddle read it (its rootElement).
 */
export function modelFacts(rootElement) {
    const facts = new Map();
    const walk = container => (container?.get?.('flowElements') ?? []).forEach(el => {
        const type = el.$type;
        const message = messageOf(el);
        const timer = !message && timerOf(el);
        const error = !message && !timer && errorOf(el);
        if (message) facts.set(el.id, { kind: 'message', name: clean(el.name), ...message });
        else if (timer) facts.set(el.id, { kind: 'timer', name: clean(el.name), ...timer });
        else if (error) facts.set(el.id, { kind: 'error', name: clean(el.name), ...error });
        else if (type === 'bpmn:UserTask' || type === 'bpmn:ManualTask')
            facts.set(el.id, { kind: 'user', name: clean(el.name), fields: formOf(el), formKey: attr(el, 'formKey') });
        else if (SERVICE_TYPES.includes(type))
            facts.set(el.id, { kind: 'service', name: clean(el.name), type, call: callOf(el), ...mappingOf(el) });
        else if (GATEWAYS[type])
            facts.set(el.id, {
                kind: 'gateway', name: clean(el.name), ...GATEWAYS[type],
                defaultFlow: el.get?.('default')?.id ?? null,
                incoming: (container.get('flowElements') ?? []).filter(f => f.$type === 'bpmn:SequenceFlow' && f.get('targetRef')?.id === el.id).length,
                // from the flows that leave it (a model need not list them as the gateway's outgoing)
                branches: (container.get('flowElements') ?? []).filter(f => f.$type === 'bpmn:SequenceFlow' && f.get('sourceRef')?.id === el.id).map(f => ({ id: f.id, name: clean(f.name), condition: conditionOf(f), isDefault: el.get?.('default')?.id === f.id })),
            });
        else if (type === 'bpmn:SequenceFlow')
            facts.set(el.id, { kind: 'flow', name: clean(el.name), condition: conditionOf(el), from: el.get?.('sourceRef')?.id, to: el.get?.('targetRef')?.id });
        if (type === 'bpmn:SubProcess' || type === 'bpmn:Transaction' || type === 'bpmn:AdHocSubProcess') walk(el);
    });
    (rootElement?.get?.('rootElements') ?? []).filter(r => r.$type === 'bpmn:Process').forEach(walk);
    return facts;
}

/** A value, short enough for a field or a chip. */
export function shortValue(value, max = 48) {
    if (value === undefined) return '';
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** The data the run's step completed an element with (a user task's form values), or null. */
function completedWith(id, steps) {
    for (const step of steps ?? [])
        if (step.element === id && step.data && Object.keys(step.data).length) return { data: step.data, userName: step.userName ?? null, label: step.label };
    return null;
}

/** What the run decided about an element: the decisions the Rationale logged for it, as { action, why }. */
function decisionsAbout(id, steps) {
    const out = [];
    for (const step of steps ?? [])
        for (const event of step.events ?? [])
            if (event.id === id) for (const d of event.decisions ?? []) out.push({ action: d.action, why: clean(d.why), not: Boolean(d.not) });
    return out;
}

/** What a frame is: started, done, or waiting. */
const phaseOf = frame => ({ 'test-started': 'started', 'test-passed': 'done', 'test-waiting': 'waits' }[frame?.marker] ?? 'started');

/**
 * The stage of a change, as data: null when the element has nothing to show close up (an event, a plain task). `run`:
 * { items, steps } of the run.
 *   user: its form, the fields empty when the task starts, filled (with who filled them) when it is done
 *   gateway: its branches and the condition of each; when done, which were taken and why
 *   flow: the condition it was taken on (only a flow with one)
 *   service: what it called, the input it was called with, and, when done, the output it answered
 */
export function stageOf(frame, facts, run = {}) {
    const item = frame?.item;
    const fact = item && facts?.get(item.elementId);
    if (!fact) return null;
    const phase = phaseOf(frame);
    const base = { kind: fact.kind, phase, id: item.elementId, title: fact.name || item.name || item.elementId };
    if (fact.kind === 'user') {
        const done = completedWith(item.elementId, run.steps);
        const values = phase === 'done' ? (done?.data ?? {}) : {};
        const shown = fact.fields.length ? fact.fields.map(f => ({ ...f, value: values[f.id], filled: phase === 'done' && values[f.id] !== undefined }))
            // no declared form: what was entered still shows, as fields of its own
            : Object.keys(values).map(key => ({ id: key, label: key, type: 'string', input: 'text', options: [], value: values[key], filled: true }));
        const waiting = phase === 'waits';
        return { ...base, fields: shown, formKey: fact.formKey ?? null, userName: done?.userName ?? item.userName ?? null,
            submitted: phase === 'done', waiting, empty: !shown.length };
    }
    if (fact.kind === 'timer')
        return { ...base, mode: fact.mode, when: fact.when, attachedTo: fact.attachedTo, interrupting: fact.interrupting, fired: phase === 'done' };
    if (fact.kind === 'error')
        return { ...base, direction: fact.direction, what: fact.what, code: fact.code, attachedTo: fact.attachedTo };
    if (fact.kind === 'message')
        return { ...base, direction: fact.direction, message: fact.message };
    if (fact.kind === 'service') {
        const failed = item.output && typeof item.output === 'object' && 'error' in item.output;
        return { ...base, call: fact.call, input: item.input ?? null, output: phase === 'done' ? (item.output ?? null) : null,
            declared: { inputs: fact.inputs, outputs: fact.outputs }, failed: Boolean(failed) && phase === 'done' };
    }
    if (fact.kind === 'gateway') {
        const taken = new Set((run.items ?? []).map(i => i.elementId));
        const chosen = decisionsAbout(item.elementId, run.steps);
        const branches = fact.branches.map(b => {
            const was = taken.has(b.id);
            const why = decisionsAbout(b.id, run.steps).map(d => d.why).filter(Boolean)[0] ?? '';
            return { ...b, result: phase !== 'done' ? 'pending' : was ? 'taken' : 'not taken', why };
        });
        // a gateway several flows arrive at is a join: one flow in as it starts, all of them when it is done
        const join = fact.incoming > 1 ? { total: fact.incoming, arrived: phase === 'done' ? fact.incoming : 1 } : null;
        return { ...base, gateway: fact.gateway, symbol: fact.symbol, word: fact.word, join, branches, decisions: phase === 'done' ? chosen : [] };
    }
    if (fact.kind === 'flow') {
        // a flow with no condition is not worth a card: the token travelling it says it
        if (!fact.condition) return null;
        const why = decisionsAbout(item.elementId, run.steps).map(d => d.why).filter(Boolean)[0] ?? '';
        return { ...base, title: fact.name || item.name || '', condition: fact.condition, result: 'taken', why };
    }
    return null;
}

// ---- drawing it

const KEY = 'bpmn-web.simulate.stage';
/** ms: how long a field takes to type, at most; and between one field and the next */
const TYPE_MS = 420;
const FIELD_GAP = 160;

/** Whether the stage is on (remembered in this browser). On unless it was turned off. */
export function stageOn() {
    try { return localStorage.getItem(KEY) !== '0'; } catch { return true; }
}
export function setStageOn(on) {
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch { /* this page only */ }
}

const still = () => {
    try { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true; } catch { return false; }
};

const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') node.className = value;
        else node.setAttribute(key, value === true ? '' : value);
    }
    node.append(...children.flat().filter(c => c !== null && c !== undefined && c !== false));
    return node;
};

/** A value as the card writes it: strings bare, the rest as JSON. */
const text = value => value === undefined || value === null ? '' : typeof value === 'string' ? value : JSON.stringify(value);

/** Type `value` into `node`, a character at a time (all at once for less motion). Returns the timer, to cancel. */
function typeInto(node, value, delay, timers) {
    const full = text(value);
    if (still() || !full) { node.textContent = full; return; }
    node.textContent = '';
    node.classList.add('typing');
    const per = Math.max(8, Math.min(30, TYPE_MS / full.length));
    timers.push(setTimeout(() => {
        let n = 0;
        const tick = setInterval(() => {
            node.textContent = full.slice(0, ++n);
            if (n >= full.length) { clearInterval(tick); node.classList.remove('typing'); }
        }, per);
        timers.push(tick);
    }, delay));
}

/** key: value lines of an input or an output (at most a few: the instance page has the rest). */
function lines(value, empty) {
    if (value === null || value === undefined || (typeof value === 'object' && !Object.keys(value).length))
        return el('div', { class: 'sim-lines sim-none' }, empty);
    if (typeof value !== 'object' || Array.isArray(value))
        return el('div', { class: 'sim-lines' }, el('div', {}, shortValue(value, 60)));
    const keys = Object.keys(value);
    return el('div', { class: 'sim-lines' },
        keys.slice(0, 4).map(k => el('div', {}, el('span', { class: 'sim-key' }, k), el('span', { class: 'sim-val' }, shortValue(value[k], 28)))),
        keys.length > 4 ? el('div', { class: 'sim-more' }, `+ ${keys.length - 4} more`) : null);
}

function formCard(s, timers) {
    const rows = s.fields.map((f, i) => {
        const value = el('span', { class: 'sim-field-value', 'data-field': f.id });
        const control = el('div', { class: `sim-field-control sim-${f.input}${f.filled ? ' filled' : ''}` }, value);
        if (f.input === 'select') control.append(el('span', { class: 'sim-caret-down' }, '▾'));
        if (f.filled) {
            // an enum shows the choice's name
            const shown = f.input === 'select' ? (f.options.find(o => o.id === f.value)?.name ?? f.value) : f.value;
            if (f.input === 'checkbox') { value.textContent = f.value ? '☑' : '☐'; }
            else typeInto(value, shown, i * FIELD_GAP, timers);
        }
        else if (f.defaultValue !== undefined && !s.submitted) value.textContent = text(f.defaultValue);
        return el('label', { class: 'sim-field' }, el('span', { class: 'sim-field-label' }, f.label), control);
    });
    const button = el('div', { class: `sim-submit${s.submitted ? ' pressed' : ''}` }, s.submitted ? '✓ Submitted' : s.waiting ? 'Waiting for the user…' : 'Submit');
    const footer = s.submitted
        ? el('div', { class: 'sim-foot' }, s.userName ? `Completed by ${s.userName}` : 'Completed')
        : el('div', { class: 'sim-foot sim-dim' }, s.userName ? `${s.userName} is filling it in` : 'A person fills this in');
    return [rows.length ? el('div', { class: 'sim-form' }, rows) : el('div', { class: 'sim-none' }, 'No fields: the task is just completed'), button, footer];
}

function gatewayCard(s, timers) {
    const rows = s.branches.map((b, i) => {
        const mark = el('span', { class: 'sim-mark' });
        const settle = () => {
            mark.className = `sim-mark ${b.result === 'taken' ? 'yes' : b.result === 'not taken' ? 'no' : 'pending'}`;
            mark.textContent = b.result === 'taken' ? '✓' : b.result === 'not taken' ? '✗' : '?';
            row.classList.toggle('taken', b.result === 'taken');
            row.classList.toggle('not-taken', b.result === 'not taken');
        };
        const row = el('div', { class: 'sim-branch' }, mark,
            el('span', { class: 'sim-branch-text' },
                el('span', { class: 'sim-branch-name' }, b.name || b.id),
                b.condition ? el('code', { class: 'sim-cond' }, b.condition) : el('span', { class: 'sim-dim' }, b.isDefault ? 'default flow' : s.gateway === 'parallel' ? 'always' : 'no condition')));
        if (b.result === 'pending' || still()) settle();
        else { mark.className = 'sim-mark pending'; mark.textContent = '?'; timers.push(setTimeout(settle, 260 + i * 200)); }
        return row;
    });
    const why = s.decisions.map(d => d.why ? `${d.action}: ${d.why}` : d.action).filter(Boolean)[0];
    const join = s.join ? el('div', { class: 'sim-join' }, ...Array.from({ length: s.join.total }, (_, i) =>
        el('span', { class: `sim-dot${i < s.join.arrived ? ' in' : ''}${s.phase === 'done' && i === s.join.total - 1 ? ' last' : ''}` })),
        el('span', { class: 'sim-dim' }, `${s.join.arrived} of ${s.join.total} arrived${s.join.arrived < s.join.total ? ': it waits for the rest' : ''}`)) : null;
    return [el('div', { class: 'sim-word' }, s.word), join, el('div', { class: 'sim-branches' }, rows),
        why ? el('div', { class: 'sim-foot sim-why' }, shortValue(why, 120)) : null];
}

function flowCard(s) {
    return [el('div', { class: 'sim-branches' },
        el('div', { class: 'sim-branch taken' }, el('span', { class: 'sim-mark yes' }, '✓'),
            el('span', { class: 'sim-branch-text' }, el('code', { class: 'sim-cond' }, s.condition), el('span', { class: 'sim-dim' }, 'held: this flow is taken')))),
    s.why ? el('div', { class: 'sim-foot sim-why' }, shortValue(s.why, 120)) : null];
}

function serviceCard(s) {
    const call = [s.call.how === 'service' || !s.call.how ? 'service' : s.call.how, s.call.name].filter(Boolean).join(' ');
    // no data on the item: the names the model declares, else just a placeholder: it is only to show an input and an output
    const wanted = s.declared?.inputs?.length ? s.declared.inputs.join(', ') : 'input';
    const answered = s.declared?.outputs?.length ? s.declared.outputs.join(', ') : 'output';
    return [el('div', { class: 'sim-call' },
        el('div', { class: 'sim-io sim-in' }, el('div', { class: 'sim-io-head' }, 'Input'), lines(s.input, wanted)),
        el('div', { class: 'sim-arrow sim-arrow-in' }, el('span', { class: 'sim-packet' })),
        el('div', { class: `sim-gear${s.phase === 'started' ? ' spin' : ''}` }, el('span', {}, '⚙'), el('small', {}, call)),
        el('div', { class: `sim-arrow sim-arrow-out${s.phase === 'done' ? ' on' : ''}` }, el('span', { class: 'sim-packet' })),
        el('div', { class: `sim-io sim-out${s.failed ? ' failed' : ''}${s.phase === 'done' ? '' : ' pending'}` },
            el('div', { class: 'sim-io-head' }, s.failed ? 'Failed' : 'Output'),
            s.phase === 'done' ? lines(s.output, answered) : el('div', { class: 'sim-lines sim-none' }, answered)))];
}

/**
 * A message: an envelope leaves the element as it sends, and arrives at it as it receives. A receiver that has not yet
 * been sent to shows the envelope faint, waiting.
 */
function messageCard(s) {
    const out = s.direction === 'send';
    const arrives = !out && s.phase === 'done';
    const waiting = !out && !arrives;
    const here = el('div', { class: 'sim-msg-end sim-msg-here' }, s.title || "this element");
    const there = el('div', { class: 'sim-msg-end sim-dim' }, "another process");
    const track = el('div', { class: `sim-msg-track${waiting ? ' waiting' : ' go'}${s.phase === 'done' && out ? ' sent' : ''}` },
        el('span', { class: 'sim-envelope' }, '✉'));
    const word = out ? (s.phase === 'done' ? 'Sent' : 'Sending') : arrives ? 'Received' : 'Waiting for';
    return [el('div', { class: `sim-msg sim-msg-${s.direction}` }, ...(out ? [here, track, there] : [there, track, here])),
        el('div', { class: 'sim-foot' }, `${word}${s.message ? ' ' : ''}`, s.message ? el('b', {}, s.message) : null)];
}

function timerCard(s) {
    const words = { duration: 'Waits', date: 'Waits until', cycle: 'Repeats' }[s.mode];
    return [el('div', { class: `sim-timer${s.fired ? ' fired' : ''}` },
        el('div', { class: 'sim-clock' }, el('i', { class: 'sim-hand sim-hand-min' }), el('i', { class: 'sim-hand sim-hand-hour' })),
        el('div', { class: 'sim-timer-text' }, el('span', { class: 'sim-dim' }, words), el('code', { class: 'sim-cond' }, s.when || 'a time'),
            s.attachedTo ? el('span', { class: 'sim-dim' }, s.interrupting ? `if ${s.attachedTo} is not done first` : `alongside ${s.attachedTo}`) : null)),
    el('div', { class: 'sim-foot' }, s.fired ? 'Fired' : 'Not yet')];
}

function errorCard(s) {
    const raise = s.direction === 'raise';
    const code = s.code ? el('b', {}, s.code) : null;
    return [el('div', { class: `sim-error ${raise ? 'raise' : 'catch'}` },
        el('span', { class: 'sim-bolt' }, '⚡'),
        el('div', { class: 'sim-error-text' }, el('span', {}, `${raise ? 'Raises' : 'Caught'} the ${s.what.toLowerCase()} `, code),
            !raise && s.attachedTo ? el('span', { class: 'sim-dim' }, `${s.attachedTo} is interrupted`) : null))];
}

const KINDS = { timer: 'Timer', error: 'Error',  user: 'User task', gateway: 'Gateway', flow: 'Condition', service: 'Service task', message: 'Message' };

/** The card of a stage (stage-model.js's stageOf), and the timers that animate it. */
export function stageCard(s) {
    const timers = [];
    const body = s.kind === 'user' ? formCard(s, timers) : s.kind === 'gateway' ? gatewayCard(s, timers)
        : s.kind === 'flow' ? flowCard(s) : s.kind === 'message' ? messageCard(s) : s.kind === 'timer' ? timerCard(s) : s.kind === 'error' ? errorCard(s) : serviceCard(s);
    const head = el('div', { class: 'sim-stage-head' },
        s.kind === 'gateway' ? el('span', { class: 'sim-diamond', title: s.word }, el('i', {}, s.symbol)) : null,
        el('span', { class: 'sim-stage-title' }, s.title || KINDS[s.kind]),
        el('span', { class: 'sim-stage-kind' }, KINDS[s.kind]));
    const card = el('div', { class: `sim-stage sim-stage-${s.kind} phase-${s.phase}`, 'data-element': s.id, role: 'group', 'aria-label': `Close-up: ${s.title || KINDS[s.kind]}` }, head, ...body);
    return { card, timers };
}

/**
 * The stage on a diagram. `container`: the element the diagram scrolls in (it is made a positioning context);
 * `rectOf(frame)`: where the frame's element is on the screen, or null; `facts`: modelFacts of the model; `run`:
 * { items, steps }, which a caller may replace as the run changes.
 */
export class Stage {
    constructor({ container, rectOf, facts, run }) {
        Object.assign(this, { container, rectOf, facts, run, node: null, timers: [], id: null });
    }

    /** The change `frame` on the stage. `moving`: as it happens (zooming in); not when Back draws what was before. */
    show(frame, moving = true) {
        this.hide();
        if (!stageOn() || !this.container) return;
        const s = stageOf(frame, this.facts, this.run);
        if (!s) { this.id = null; return; }
        const rect = this.rectOf(frame);
        if (!rect) return;
        const { card, timers } = stageCard(s);
        // the same element as the change before (a task started, then done): the card stays, it is not zoomed in again
        if (!moving || still() || this.id === s.id) card.classList.add('no-zoom');
        this.id = s.id;
        this.timers = timers;
        this.node = card;
        if (getComputedStyle(this.container).position === 'static') this.container.style.position = 'relative';
        this.container.appendChild(card);
        this._place(card, rect);
    }

    /** Beside the element (right of it, else left), inside the container, zooming from the element. */
    _place(card, rect) {
        const box = this.container.getBoundingClientRect();
        const w = card.offsetWidth, h = card.offsetHeight, gap = 14;
        const at = { x: rect.left - box.left + this.container.scrollLeft, y: rect.top - box.top + this.container.scrollTop };
        const view = { w: this.container.clientWidth + this.container.scrollLeft, h: this.container.clientHeight + this.container.scrollTop };
        let left = at.x + rect.width + gap;
        if (left + w > view.w - 6) left = at.x - w - gap;
        left = Math.max(6 + this.container.scrollLeft, Math.min(left, view.w - w - 6));
        let top = at.y + rect.height / 2 - h / 2;
        top = Math.max(6 + this.container.scrollTop, Math.min(top, view.h - h - 6));
        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
        // zoom out of the element: the origin is where its centre is, in the card
        card.style.transformOrigin = `${at.x + rect.width / 2 - left}px ${at.y + rect.height / 2 - top}px`;
    }

    /** The card away (the next change replaces it; Stop ends it). */
    hide() {
        this.timers.forEach(t => { clearTimeout(t); clearInterval(t); });
        this.timers = [];
        this.node?.remove();
        this.node = null;
    }

    /** How long Play stays on a change, ms: a card is read, a form is typed in; no card, the usual. */
    dwell(frame, usual) {
        if (!stageOn()) return usual;
        const s = stageOf(frame, this.facts, this.run);
        if (!s || still()) return usual;
        if (s.kind === 'user') return s.phase === 'done' ? 600 + 380 * Math.max(1, s.fields.filter(f => f.filled).length) + 900 : 1400;
        if (s.kind === 'gateway') return s.phase === 'done' ? 800 + 200 * s.branches.length + 700 : 1300;
        if (s.kind === 'service') return s.phase === 'done' ? 1600 : 1400;
        if (s.kind === 'message' || s.kind === 'timer' || s.kind === 'error') return 1500;
        return 1000;
    }

    /** The stage over: no card, and the next change zooms in afresh. */
    stop() {
        this.hide();
        this.id = null;
    }
}
