// Simulate: a run shown on its diagram one change at a time, paused on the first: Step (and Back) one change, Play the
// rest (Pause), Stop. The editor's Test tab (testing/TestPanel.js) and an instance's page (instance/view.js) both use
// it: the same frames, the same controls, the same colours (blue started, green done, orange still waiting).
// With Show details, each change says what the Rationale says of it: what happened, who did it with what data, and
// why the engine went that way (a condition and the values it read, a gateway's choice).
import './simulation.css';
import { stageOn, setStageOn } from './stage.js';

/** ms between the changes Play shows */
export const SIMULATION_STEP = 450;
/** the markers a simulation puts on the diagram */
export const SIMULATION_MARKERS = ['test-started', 'test-passed', 'test-waiting'];

const DETAILS_KEY = 'bpmn-web.simulate.details';

/**
 * A diagram's SVG without the marks a run put on it (test-passed, test-waiting, ...: the Test tab's, Simulate's): the
 * picture saved with a model is of the model, not of the run it showed when it was saved.
 */
export function withoutRunMarks(svg) {
    return String(svg ?? '').replace(/class="([^"]*)"/g, (all, names) =>
        /\btest-/.test(names) ? `class="${names.split(/\s+/).filter(n => n && !n.startsWith('test-')).join(' ')}"` : all);
}

/** Whether Show details is on (remembered in this browser). */
export function showDetails() {
    try { return localStorage.getItem(DETAILS_KEY) === '1'; } catch { return false; }
}
function setShowDetails(on) {
    try { localStorage.setItem(DETAILS_KEY, on ? '1' : '0'); } catch { /* this page only */ }
}

/**
 * The frames of a run, one change each: { item, marker, number, text }. An element starts (blue, numbered by its
 * place among the run's items, as the instance page numbers them) when its item is created, and ends just before the
 * flow that leaves it is taken: a joining gateway starts when its first branch arrives and ends only when the last
 * has. Flows are taken at once (green). An element nothing left ends right after it starts; one that still waits when
 * the run stopped turns orange at the end.
 *   flowSource: the model's flows, by id, to the id of the element each leaves
 *   drawn(id): whether the diagram has the element
 *   label(id, name): how an element is called
 */
export function simulationFrames(items, { flowSource, drawn, label }) {
    const runItems = [...(items || [])]
        .filter(i => drawn(i.elementId) || flowSource.has(i.elementId))
        .sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
    const number = new Map(runItems.map((item, i) => [item, i + 1]));
    const isFlow = item => flowSource.has(item.elementId);
    const open = [];        // started, not ended
    const frames = [];
    const name = item => label(item.elementId, item.name);
    const frame = (item, marker, text, numbered = true) => frames.push({ item, marker, number: numbered ? number.get(item) : undefined, text });
    const end = item => {
        open.splice(open.indexOf(item), 1);
        frame(item, 'test-passed', `${name(item)} done`);
    };
    for (const item of runItems) {
        if (isFlow(item)) {
            // the element the flow leaves ends first (its latest item started before the flow)
            const source = [...open].reverse().find(o => o.elementId === flowSource.get(item.elementId));
            if (source) end(source);
            frame(item, 'test-passed', `flow ${name(item)} taken`, false);
            continue;
        }
        open.push(item);
        frame(item, 'test-started', `${name(item)} started`);
    }
    // what nothing left: ended where it stopped (end events), or still waiting
    for (const item of [...open])
        if (item.status !== 'wait') end(item);
    for (const item of open.filter(i => i.status === 'wait'))
        frame(item, 'test-waiting', `${name(item)} waits`);
    return frames;
}

/**
 * What the Rationale (its steps: rationaleSteps) says of a frame's item, as lines: when it started, who completed it
 * and with what data, what it chose and why. None when the run kept no log.
 */
export function frameDetails(frame, steps) {
    const item = frame?.item;
    if (!item || !steps?.length) return [];
    const lines = [];
    const starting = frame.marker === 'test-started';
    for (const step of steps) {
        // the step that drove it: a task completed, an event fired, the process started at it
        const drove = step.element === item.elementId && (starting ? /start/i.test(step.label ?? '') : !/start/i.test(step.label ?? ''));
        if (drove && (step.userName || (step.data && Object.keys(step.data).length)))
            lines.push(`${step.label || 'Step'}${step.userName ? ` by ${step.userName}` : ''}${step.data && Object.keys(step.data).length ? `, with ${JSON.stringify(step.data)}` : ''}`);
        for (const event of step.events ?? []) {
            if (event.seq !== item.seq || event.id !== item.elementId) continue;
            // a started frame: how it started; a done one: how it ended, and the decisions about it
            const isStart = /^(Started|Waiting)$/.test(event.raw ?? '');
            // a decision is made as it ends (a gateway's choice, a flow's condition): with that change, not its start
            if (event.raw === 'decision' ? starting : starting !== isStart && frame.marker !== 'test-waiting') continue;
            if (event.word) lines.push(`${event.word}${event.at ? ` (at ${event.at})` : ''}`);
            for (const d of event.decisions ?? [])
                lines.push(d.why ? `${d.action}: ${String(d.why).replace(/\s+/g, ' ').trim()}` : d.action);
        }
    }
    return [...new Set(lines)];
}

/** Whether the person asked their system for less motion: then the changes show without moving. */
const lessMotion = () => {
    try { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true; } catch { return false; }
};

/** A CSS animation run again on an element: its class off, a reflow, on again. */
function replay(node, name) {
    if (!node?.classList) return;
    node.classList.remove(name);
    void node.getBoundingClientRect();
    node.classList.add(name);
}

/**
 * A change, moving (simulation.css): an element that starts glows blue, one done flashes green; a flow taken draws
 * itself and a token travels it, from the element it leaves to the next. `gfx`: the element's drawing (its
 * .djs-element group, in the editor and in an instance page's diagram alike). Nothing moves for less motion.
 */
export function animateChange(gfx, frame) {
    if (!gfx || lessMotion()) return;
    replay(gfx, 'sim-anim');
    if (frame.marker === 'test-passed' && gfx.classList.contains('djs-connection')) travel(gfx);
}

/** A token along a flow's line, as long as the line is (within a change's time), its line drawn as it goes. */
function travel(gfx) {
    const line = gfx.querySelector('.djs-visual > path');
    if (!line?.getTotalLength) return;
    let length;
    try { length = line.getTotalLength(); } catch { return; }
    if (!length) return;
    const duration = Math.min(SIMULATION_STEP - 60, 220 + length * 0.8);
    line.style.setProperty('--sim-len', String(length));
    line.style.setProperty('--sim-dur', `${duration}ms`);
    const token = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    token.setAttribute('r', '6');
    token.setAttribute('class', 'sim-token');
    gfx.querySelectorAll('.sim-token').forEach(old => old.remove());
    gfx.appendChild(token);
    const start = performance.now();
    const ease = t => t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    const move = now => {
        const t = Math.min(1, (now - start) / duration);
        const at = line.getPointAtLength(ease(t) * length);
        token.setAttribute('cx', String(at.x));
        token.setAttribute('cy', String(at.y));
        if (t < 1 && token.isConnected) requestAnimationFrame(move);
        else token.remove();
    };
    requestAnimationFrame(move);
}

/** A number's badge, popping in (an element's order in the run). */
export function popBadge(node) {
    if (node && !lessMotion()) replay(node, 'sim-pop');
}

/**
 * A simulation: its frames, where it is, paused or playing. `paint(frame, moving)` shows one (moving: as it happens,
 * animated; not when Back draws the changes before again); `reset()` clears them all; `changed()` after each move.
 */
export class Simulation {
    constructor(frames, { paint, reset, changed, steps, stage }) {
        Object.assign(this, { frames, paint, reset, changed, steps, stage });
        this.index = 0;
        this.paused = true;
        this.timer = null;
        this.text = '';
    }

    get atEnd() { return this.index >= this.frames.length; }
    /** the change shown last */
    get current() { return this.index ? this.frames[this.index - 1] : null; }

    /** Show the next change; false when there is none (it stays on its last, paused). */
    step() {
        if (this.stopped) return false;
        if (this.atEnd) {
            clearTimeout(this.timer);
            this.paused = true;
            this.text = `End of the run (${this.frames.length} changes): blue started, green done, orange still waiting; the numbers are the order they started in`;
            this.changed?.();
            return false;
        }
        this.paint(this.frames[this.index++], true);
        this.stage?.show(this.current, true);
        this._status();
        this.changed?.();
        return true;
    }

    /** One change back: drawn again up to the change before. */
    back() {
        if (this.index <= 1) return;
        clearTimeout(this.timer);
        this.paused = true;
        this.reset();
        this.index--;
        this.frames.slice(0, this.index).forEach(frame => this.paint(frame, false));
        this.stage?.show(this.current, false);
        this._status();
        this.changed?.();
    }

    play() {
        this.paused = false;
        const next = () => {
            if (this.stopped || this.paused) return;
            if (!this.step()) return;
            this.timer = setTimeout(next, this.stage?.dwell(this.current, SIMULATION_STEP) ?? SIMULATION_STEP);
        };
        next();
        this.changed?.();
    }

    pause() {
        clearTimeout(this.timer);
        this.paused = true;
        this._status();
        this.changed?.();
    }

    /** Play or pause, as it is now. */
    toggle() { return this.paused ? this.play() : this.pause(); }

    stop() {
        clearTimeout(this.timer);
        this.stopped = true;
        this.stage?.stop();
    }

    _status() {
        if (this.index) this.text = `${this.index} of ${this.frames.length}: ${this.frames[this.index - 1].text}`;
    }
}

const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value === true ? '' : value);
    }
    node.append(...children.flat().filter(c => c !== null && c !== undefined && c !== false));
    return node;
};

/**
 * Simulate's panel: Back, Step, Play or Pause, Stop, Show details, what it shows now (and, with details, what the
 * Rationale says of it). `actions`: { back, step, play, stop }, each a function. Drawn as the simulation stands;
 * updateSimulationPanel keeps it so.
 */
export function simulationPanel(sim, actions) {
    const panel = el('div', { class: 'test-command-panel test-sim-panel', hidden: !sim },
        el('strong', {}, 'Simulate'),
        el('button', { type: 'button', class: 'test-sim-back', onclick: actions.back, title: 'Back one change' }, '◀ Back'),
        el('button', { type: 'button', class: 'test-sim-step', onclick: actions.step, title: 'The next change' }, 'Step ▶'),
        el('button', { type: 'button', class: 'test-sim-play', onclick: actions.play, title: 'Play the rest, or pause' }, '▶ Play'),
        el('button', { type: 'button', class: 'test-sim-stop', onclick: actions.stop, title: 'End the simulation' }, '■ Stop'),
        el('label', { class: 'test-sim-details-toggle', title: 'What the Rationale says of each change: who, with what data, and why' },
            el('input', { type: 'checkbox', class: 'test-sim-details-on', checked: showDetails(),
                onchange: e => { setShowDetails(e.target.checked); updateSimulationPanel(panel, panel._sim); } }),
            ' Show details'),
        el('label', { class: 'test-sim-details-toggle', title: 'A close-up beside each task, gateway and condition: the form being filled in, the condition being evaluated, the service called' },
            el('input', { type: 'checkbox', class: 'test-sim-stage-on', checked: stageOn(),
                onchange: e => {
                    setStageOn(e.target.checked);
                    const sim = panel._sim;
                    if (e.target.checked && sim?.current) sim.stage?.show(sim.current, false); else sim?.stage?.hide();
                } }),
            ' Show close-up'),
        el('span', { class: 'test-sim-text', role: 'status' }),
        el('ul', { class: 'test-sim-details', hidden: true }));
    updateSimulationPanel(panel, sim);
    return panel;
}

/**
 * What an item is at a change of the simulation: started, done (ended, its next flow taken), waits (still waiting
 * when the run stopped), or, for a flow, taken. Never its status at the run's end.
 */
export function frameState(frame) {
    if (!frame) return '';
    if (frame.number === undefined && frame.marker === 'test-passed') return 'taken';
    return { 'test-started': 'started', 'test-passed': 'done', 'test-waiting': 'waits' }[frame.marker] ?? '';
}

/** The panel as the simulation now stands (`root`: the panel, or what holds it). */
export function updateSimulationPanel(root, sim) {
    const panel = root?.matches?.('.test-sim-panel') ? root : root?.querySelector?.('.test-sim-panel');
    if (!panel) return;
    panel._sim = sim;
    panel.hidden = !sim;
    const atEnd = !sim || sim.atEnd;
    const find = selector => panel.querySelector(selector);
    find('.test-sim-back').disabled = !(sim?.index > 1);
    find('.test-sim-step').disabled = atEnd;
    const play = find('.test-sim-play');
    play.textContent = sim && !sim.paused ? '⏸ Pause' : '▶ Play';
    play.disabled = atEnd;
    find('.test-sim-text').textContent = sim?.text ?? '';
    const details = find('.test-sim-details');
    const lines = showDetails() && sim && !(sim.atEnd && sim.paused && /^End of the run/.test(sim.text)) ? frameDetails(sim.current, sim.steps) : [];
    // which item this change is: its number, its element, and what it is at this change (not at the run's end: an
    // item that ended later is only started here)
    const item = showDetails() && sim?.current?.item;
    const status = item && frameState(sim.current);
    const heading = item ? el('li', { class: 'test-sim-details-item' }, `#${item.seq ?? '?'} ${item.name || item.elementId || ''}${status ? ` · ${status}` : ''}`) : null;
    details.replaceChildren(...(heading ? [heading] : []), ...lines.map(line => el('li', {}, line)));
    details.hidden = !showDetails() || !sim;
    if (showDetails() && sim && !lines.length && sim.current)
        details.replaceChildren(...(heading ? [heading] : []), el('li', { class: 'test-sim-details-none' }, sim.steps?.length ? 'Nothing more in the Rationale about this change.' : 'No Rationale: this run kept no log.'));
    find('.test-sim-details-on').checked = showDetails();
    find('.test-sim-stage-on').checked = stageOn();
}
