// The selected element's behaviour, above the properties panel: what it is, when bpmn-server starts it and when
// it completes, worked out from the element as it is drawn (a gateway splits or joins by its flows; an event by its
// definition; a task by its kind, a loop on it). The instance page's descriptions, written for this element.
import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

const ARRIVES = 'When a flow arrives at it';

/** The kind of an event: its definition (timer, message, ...), or none. */
function eventKind(bo) {
    const definition = (bo.get('eventDefinitions') || [])[0];
    return definition ? definition.$type.replace(/^bpmn:/, '').replace(/EventDefinition$/, '').toLowerCase() : 'none';
}

const WAITS_FOR = {
    timer: 'its timer is due',
    message: 'the message arrives (a message thrown to the instance, or Force on its page)',
    signal: 'the signal is thrown',
    conditional: 'its condition holds',
    error: 'an error with its code is thrown',
    escalation: 'an escalation is thrown',
    link: 'its link is thrown',
    compensate: 'compensation is triggered',
};

/** { type, summary, starts, completes, notes[] } for a business object (the element's). */
export function describeBehaviour(element) {
    const bo = getBusinessObject(element);
    if (!bo || typeof bo.get !== 'function') return null;      // the canvas's root before a model is imported
    const type = bo.$type;
    // its flows, by their source and target (a model need not list them as the element's incoming and outgoing)
    const flows = (bo.$parent?.get?.('flowElements') || []).filter(f => is(f, 'bpmn:SequenceFlow'));
    const incoming = flows.filter(f => f.get('targetRef') === bo).length;
    const outgoing = flows.filter(f => f.get('sourceRef') === bo).length;
    const notes = [];
    let summary = '', starts = ARRIVES, completes = '';

    if (is(bo, 'bpmn:Gateway')) {
        const joins = incoming > 1, splits = outgoing > 1;
        const role = joins && splits ? 'joins and splits' : joins ? 'joins' : splits ? 'splits' : 'passes the flow on';
        summary = `Controls the flow of the process: this gateway ${role}.`;
        if (is(bo, 'bpmn:ExclusiveGateway')) {
            starts = joins ? 'When any incoming flow arrives (each arrival continues on its own)' : ARRIVES;
            completes = 'Completes as soon as it arrives';
            if (splits) notes.push(`Takes one flow: the first whose condition holds${bo.get('default') ? ', else its default flow' : ''}.`);
        } else if (is(bo, 'bpmn:ParallelGateway')) {
            starts = joins ? 'Waits for all its incoming flows' : ARRIVES;
            completes = joins ? 'Completes when the last branch arrives' : 'Completes as soon as it arrives';
            if (splits) notes.push('Takes every outgoing flow: the branches run side by side.');
        } else if (is(bo, 'bpmn:InclusiveGateway')) {
            starts = joins ? 'Waits for the branches that were taken (those still on the way)' : ARRIVES;
            completes = joins ? 'Completes when the last taken branch arrives' : 'Completes as soon as it arrives';
            if (splits) notes.push(`Takes every flow whose condition holds${bo.get('default') ? '; its default flow when none does' : ''}.`);
        } else if (is(bo, 'bpmn:EventBasedGateway')) {
            completes = 'Completes as soon as it arrives; then waits for the events after it';
            notes.push('The first of the events after it to happen wins: the others are cancelled.');
        } else {
            completes = 'Completes as soon as it arrives';
        }
    }
    else if (is(bo, 'bpmn:Event')) {
        const kind = eventKind(bo);
        if (is(bo, 'bpmn:StartEvent')) {
            summary = 'Starts the process.';
            starts = kind === 'none' ? 'When the process is started at it (by a user or the API)' : `When ${WAITS_FOR[kind] ?? kind}: it starts a new instance`;
            completes = 'Completes at once';
        } else if (is(bo, 'bpmn:EndEvent')) {
            summary = kind === 'terminate' ? 'Ends the whole instance.' : 'Ends its path.';
            completes = kind === 'terminate' ? 'Completes at once, ending every other path of the instance'
                : kind === 'none' ? 'Completes at once; the instance ends when no path is left' : `Completes at once, throwing its ${kind}`;
        } else if (is(bo, 'bpmn:BoundaryEvent')) {
            const host = bo.get('attachedToRef');
            summary = `Waits on ${host?.get('name') || host?.id || 'its task'} while it runs.`;
            starts = `When ${host?.get('name') || host?.id || 'the task it is attached to'} starts`;
            completes = `When ${WAITS_FOR[kind] ?? kind}`;
            notes.push(bo.get('cancelActivity') === false
                ? 'Non-interrupting: the task goes on; this event starts a path of its own.'
                : 'Interrupting: it cancels the task, and the flow continues from this event.');
        } else if (is(bo, 'bpmn:IntermediateThrowEvent')) {
            summary = kind === 'none' ? 'Marks a point in the flow.' : `Throws a ${kind}.`;
            completes = 'Completes at once';
        } else {
            summary = kind === 'none' ? 'Marks a point in the flow.' : `Waits for a ${kind}.`;
            completes = kind === 'none' ? 'Completes at once' : `When ${WAITS_FOR[kind] ?? kind}`;
        }
    }
    else if (is(bo, 'bpmn:Activity')) {
        summary = 'Work done in the process.';
        if (is(bo, 'bpmn:UserTask')) completes = 'When a user completes it (Execute on its task page, or the API\'s invoke)';
        else if (is(bo, 'bpmn:ServiceTask')) completes = 'When the service it calls returns (the app delegate\'s services)';
        else if (is(bo, 'bpmn:ScriptTask')) completes = 'When its script has run';
        else if (is(bo, 'bpmn:BusinessRuleTask')) completes = 'When its decision has been evaluated';
        else if (is(bo, 'bpmn:SendTask')) completes = 'When its message has been sent';
        else if (is(bo, 'bpmn:ReceiveTask')) completes = 'When its message arrives';
        else if (is(bo, 'bpmn:ManualTask')) completes = 'Completes at once: the work happens outside the engine';
        else if (is(bo, 'bpmn:CallActivity')) {
            summary = 'Runs another process.';
            completes = `When the process it calls (${bo.get('calledElement') || 'not named'}) ends`;
        }
        else if (is(bo, 'bpmn:SubProcess')) {
            summary = bo.get('triggeredByEvent') ? 'An event sub-process: runs when its start event happens.' : 'A part of the process, run as a whole.';
            starts = bo.get('triggeredByEvent') ? 'When its start event happens, while the process runs' : ARRIVES;
            completes = 'When every path inside it has ended';
        }
        else completes = 'Completes at once';
        if (outgoing > 1) notes.push('Its outgoing flows are all taken (each one whose condition holds).');
        if (incoming > 1) notes.push('Each incoming flow that arrives starts it again: a gateway joins flows.');
        const loop = bo.get('loopCharacteristics');
        if (loop && is(loop, 'bpmn:MultiInstanceLoopCharacteristics'))
            notes.push(`Multi-instance: it runs once per item of ${loop.get('camunda:collection') || 'its collection'}, ${loop.get('isSequential') ? 'one after another' : 'in parallel'}; it completes when all have.`);
        else if (loop)
            notes.push('Standard loop: it runs again while its loop condition holds.');
    }
    else if (is(bo, 'bpmn:SequenceFlow')) {
        const source = bo.get('sourceRef');
        summary = 'Connects two elements.';
        starts = `When ${source?.get('name') || source?.id || 'its source'} completes`;
        completes = bo.get('conditionExpression') ? 'Taken when its condition holds' : source?.get('default') === bo ? 'Taken when no other flow of its gateway is' : 'Taken';
    }
    else if (is(bo, 'bpmn:Process') || is(bo, 'bpmn:Participant') || is(bo, 'bpmn:Collaboration')) {
        summary = 'The process: its elements run from its start events.';
        starts = 'When it is started (a start event)';
        completes = 'When no path is left';
    }
    else return null;

    return { type, summary, starts, completes, notes };
}

/** The behaviour box above the properties panel, following the selection (the process when none). */
export default class ElementBehaviour {
    constructor(config, eventBus, canvas) {
        this._parent = config?.parent ? document.querySelector(config.parent) : null;
        this._canvas = canvas;
        if (!this._parent) return;
        this._box = document.createElement('section');
        this._box.id = 'js-element-behaviour';
        this._box.className = 'element-behaviour';
        this._parent.prepend(this._box);
        this._element = null;
        eventBus.on('selection.changed', ({ newSelection }) => { this.show(newSelection.length === 1 ? newSelection[0] : null); });
        eventBus.on('elements.changed', ({ elements }) => { if (!this._element || elements.includes(this._element)) this.show(this._element); });
        eventBus.on('import.done', () => { this.show(null); });
    }

    show(element) {
        this._element = element;
        const shown = element && element.type !== 'label' ? element : this._canvas.getRootElement();
        const behaviour = shown ? describeBehaviour(shown) : null;
        if (!behaviour) {
            this._box.replaceChildren();
            this._box.hidden = true;
            return;
        }
        const line = (label, value) => {
            const row = document.createElement('div');
            row.className = 'element-behaviour-line';
            const key = document.createElement('span');
            key.className = 'element-behaviour-key';
            key.textContent = label;
            row.append(key, document.createTextNode(value));
            return row;
        };
        const notes = behaviour.notes.map(n => { const p = document.createElement('p'); p.className = 'element-behaviour-note'; p.textContent = n; return p; });
        const summary = document.createElement('p');
        summary.className = 'element-behaviour-summary';
        summary.textContent = behaviour.summary;
        this._box.hidden = false;
        const type = line('type', behaviour.type);
        type.classList.add('element-behaviour-type');
        this._box.replaceChildren(summary, type, line('Starts', behaviour.starts), line('Completes', behaviour.completes), ...notes);
    }
}

ElementBehaviour.$inject = ['config.elementBehaviour', 'eventBus', 'canvas'];
