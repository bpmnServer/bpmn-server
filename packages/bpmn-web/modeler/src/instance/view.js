// An instance's page (views/InstanceDetails.pug): Simulate, as the editor's Test tab has it (simulation/simulation.js),
// on the page's diagram (an SVG of the model, its elements by data-element-id, each item's number badge #seq_<seq>):
// the run one change at a time, Back, Step, Play, Stop, and Show details (what the Rationale says of each change).
import { BpmnModdle } from 'bpmn-moddle';
import { moddleExtensions } from '../moddle.js';
import './instance.css';
import { Simulation, simulationFrames, simulationPanel, updateSimulationPanel, SIMULATION_MARKERS } from '../simulation/simulation.js';

const json = id => {
    try { return JSON.parse(document.getElementById(id)?.textContent || 'null'); } catch { return null; }
};

/** The model's flows, by id, to the element each leaves (in its sub-processes too). */
async function flowSources(xml) {
    const flows = new Map();
    if (!xml) return flows;
    try {
        const { rootElement } = await new BpmnModdle(moddleExtensions).fromXML(xml);
        const walk = container => (container.get?.('flowElements') || []).forEach(e => {
            if (e.$type === 'bpmn:SequenceFlow') flows.set(e.id, e.get('sourceRef')?.id);
            if (e.$type === 'bpmn:SubProcess' || e.$type === 'bpmn:Transaction' || e.$type === 'bpmn:AdHocSubProcess') walk(e);
        });
        (rootElement.get('rootElements') || []).filter(r => r.$type === 'bpmn:Process').forEach(walk);
    } catch { /* a model that does not read: no flows, its elements alone */ }
    return flows;
}

async function setUp() {
    const button = document.getElementById('startSimulation');
    const holder = document.getElementById('simulation');
    const svg = document.querySelector('.instance-diagram svg');
    if (!button || !holder || !svg) return;
    const items = json('animationItems') || [];
    const steps = json('rationaleSteps') || [];
    const source = document.querySelector('script[data-report-source]');
    let xml = null;
    try { xml = source ? JSON.parse(source.textContent) : null; } catch { xml = null; }
    const flowSource = await flowSources(typeof xml === 'string' ? xml : null);

    const shape = id => { try { return svg.querySelector(`.djs-element[data-element-id="${CSS.escape(id)}"]`); } catch { return null; } };
    const badges = () => [...svg.querySelectorAll('[id^="seq_"]')];
    const marked = () => [...svg.querySelectorAll(SIMULATION_MARKERS.map(m => `.djs-element.${m}`).join(','))];
    const clear = () => marked().forEach(e => e.classList.remove(...SIMULATION_MARKERS));
    const reset = () => {
        clear();
        badges().forEach(b => { b.style.display = 'none'; });
    };
    const paint = frame => {
        const element = shape(frame.item.elementId);
        if (!element) return;
        element.classList.remove(...SIMULATION_MARKERS);
        element.classList.add(frame.marker);
        // its own number, as the items table and the Rationale give it
        if (frame.number !== undefined && frame.item.seq != null) {
            const badge = document.getElementById('seq_' + frame.item.seq);
            if (badge) badge.style.display = '';
        }
    };

    let sim = null;
    const changed = () => {
        updateSimulationPanel(holder, sim);
        button.classList.toggle('active', Boolean(sim));
        button.setAttribute('aria-pressed', String(Boolean(sim)));
    };
    const stop = () => {
        sim?.stop();
        sim = null;
        clear();
        badges().forEach(b => { b.style.display = ''; });     // the diagram as it was
        changed();
    };
    const start = () => {
        const frames = simulationFrames(items.map(i => ({ ...i, elementId: i.elementId ?? i.id })), {
            flowSource, drawn: id => Boolean(shape(id)), label: (id, name) => name ? `${name} (${id})` : id,
        });
        reset();
        sim = new Simulation(frames, { paint, reset, changed, steps });
        sim.step();
    };
    holder.replaceChildren(simulationPanel(null, {
        back: () => sim?.back(),
        step: () => { sim?.pause(); sim?.step(); },
        play: () => sim?.toggle(),
        stop,
    }));
    button.addEventListener('click', () => sim ? stop() : start());
    button.disabled = false;
}

/**
 * A click on an element of the diagram: its popup (SVGHelper.js's displayDescription) shows what the Model report says
 * of it (its section: settings, form, policies, its flows), then what this run did with it. The report and the popup
 * say the same. An element the report has no section for (a pool, a lane) keeps the popup it had.
 */
function popupsFromReport() {
    const earlier = window.displayDescription;
    if (typeof earlier !== 'function' || !window.jQuery?.fn?.dialog) return;
    const items = json('animationItems') || [];
    const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    let dialog = null;
    window.displayDescription = function (id) {
        let section = null;
        try { section = document.querySelector(`#model-report [data-element-id="${CSS.escape(id)}"]`); } catch { section = null; }
        if (!section) return earlier(id);
        const copy = section.cloneNode(true);
        // the element itself: not the elements nested under it (a sub-process's), they have their own
        copy.querySelectorAll('.report-element').forEach(nested => nested.remove());
        copy.querySelectorAll('[id]').forEach(e => e.removeAttribute('id'));
        const runs = items.filter(i => (i.elementId ?? i.id) === id).sort((a, b) => (a.seq ?? 0) - (b.seq ?? 0));
        const kind = window.bpmn_descriptions?.[String(window.jsonData?.elements?.find?.(e => e.id === id)?.type ?? '').replace('bpmn:', '')];
        const html = `<article class="report-document report-popup">`
            + (kind?.desc ? `<p class="report-popup-kind">${esc(kind.title ?? '')}${kind.title ? ': ' : ''}${esc(kind.desc)}</p>` : '')
            + copy.outerHTML
            + `<p class="report-popup-run"><b>In this run:</b> ${runs.length
                ? runs.map(i => `#${esc(i.seq)} ${esc(i.status === 'wait' ? 'waits' : i.status === 'end' ? (i.type === 'bpmn:SequenceFlow' ? 'taken' : 'ended') : i.status)}`).join(', ')
                : 'not reached'}</p></article>`;
        const title = runs[0]?.name || id;
        if (dialog?.dialog('isOpen')) {
            dialog.html(html);
            dialog.dialog('option', 'title', title);
        }
        else {
            dialog = window.jQuery(`<div class="report-popup-dialog">${html}</div>`).dialog({
                title, autoOpen: true, width: 460, maxHeight: 520,
                close: () => { dialog?.dialog('destroy'); dialog = null; },
            });
        }
    };
}

function ready() {
    setUp();
    popupsFromReport();
    // any part of a shape opens its popup (SVGHelper.js finds the element only from the part's own parent)
    document.querySelector('.instance-diagram')?.addEventListener('click', e => {
        const element = e.target.closest?.('.djs-element[data-element-id]');
        const id = element?.getAttribute('data-element-id');
        if (!id || id.endsWith('_label') || e.target.parentNode?.getAttribute?.('data-element-id') === id) return;   // SVGHelper's own
        window.displayDescription?.(id);
    });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
else ready();
