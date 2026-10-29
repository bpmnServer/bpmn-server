// The bpmn-web model editor: bpmn-js with the properties panel shaped for bpmn-server.
// The page (src/views/modeler.pug) provides #js-canvas, #js-properties-panel, #js-panel-resizer, the save
// buttons, #js-problems and the model as JSON in #model-source. window.saveDiagramFunct(option) saves, as it did in the
// classic modeler (hosts and tests call it).
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import './modeler.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule } from 'bpmn-js-properties-panel';
import CamundaBehaviorsModule from 'camunda-bpmn-js-behaviors/lib/camunda-platform';
import camundaModdle from './moddle.js';
import BpmnServerPropertiesModule from './properties/index.js';
import ProblemsModule from './problems/index.js';

const page = document.getElementById('modeler-page');
const { processName } = page.dataset;
const canvasElement = document.getElementById('js-canvas');
const status = document.getElementById('js-save-status');

const modeler = new BpmnModeler({
    container: canvasElement,
    propertiesPanel: { parent: '#js-properties-panel' },
    additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
        CamundaBehaviorsModule,
        BpmnServerPropertiesModule,
        ProblemsModule
    ],
    problems: { container: '#js-problems', url: '/model/verify', processName },
    moddleExtensions: { camunda: camundaModdle }
});
window.bpmnModeler = modeler;
window.BPMNModeler = modeler;     // the classic modeler's name for it, used by hosts


let changed = false;
modeler.on('commandStack.changed', () => { changed = true; });
window.addEventListener('beforeunload', event => {
    if (changed) {
        event.preventDefault();
        event.returnValue = '';
    }
});

function showStatus(text, isError = false) {
    status.textContent = text;
    status.classList.toggle('error', isError);
}

// ---- layout: the panel beside the canvas, resizable and collapsible, remembered per browser

const STORAGE_KEY = 'bpmn-web.modeler.panel';
const MIN_WIDTH = 260;

function loadPanelState() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
        return {};
    }
}
function savePanelState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // no storage (private window): the layout just isn't remembered
    }
}

const panelState = { width: 360, collapsed: false, ...loadPanelState() };
const maxWidth = () => Math.max(MIN_WIDTH, Math.floor(page.clientWidth * 0.6));

function applyPanelState() {
    const width = Math.min(Math.max(panelState.width, MIN_WIDTH), maxWidth());
    page.style.setProperty('--panel-width', width + 'px');
    page.classList.toggle('panel-collapsed', panelState.collapsed);
    modeler.get('canvas').resized();
}

const resizer = document.getElementById('js-panel-resizer');
resizer.addEventListener('pointerdown', down => {
    if (down.target.closest('button') || panelState.collapsed)
        return;
    resizer.setPointerCapture(down.pointerId);
    const startX = down.clientX, startWidth = panelState.width;
    page.classList.add('resizing');
    const move = event => {
        panelState.width = Math.min(Math.max(startWidth + startX - event.clientX, MIN_WIDTH), maxWidth());
        applyPanelState();
    };
    const up = () => {
        resizer.removeEventListener('pointermove', move);
        page.classList.remove('resizing');
        savePanelState(panelState);
    };
    resizer.addEventListener('pointermove', move);
    resizer.addEventListener('pointerup', up, { once: true });
});
document.getElementById('js-panel-toggle').addEventListener('click', () => {
    panelState.collapsed = !panelState.collapsed;
    applyPanelState();
    savePanelState(panelState);
});
window.addEventListener('resize', applyPanelState);
// an issue opens its field: show the panel if it is hidden
modeler.on('problems.reveal', () => {
    if (panelState.collapsed) {
        panelState.collapsed = false;
        applyPanelState();
        savePanelState(panelState);
    }
});

// The diagram stays fitted while the canvas changes size (the window, the panel, the Problems list),
// until the user pans or zooms.
let fitted = false, fitting = false;
modeler.on('canvas.viewbox.changing', () => {
    if (!fitting)
        fitted = false;
});
new ResizeObserver(() => {
    modeler.get('canvas').resized();
    if (fitted)
        fitDiagram();
}).observe(canvasElement);

/** Fit the whole diagram in view, to the right of the palette rather than under it. */
function fitDiagram() {
    const canvas = modeler.get('canvas');
    const inner = canvas.viewbox().inner;
    if (!inner.width || !inner.height)
        return;
    const palette = canvasElement.querySelector('.djs-palette');
    const box = canvasElement.getBoundingClientRect();
    const margin = 24;
    const left = (palette ? palette.getBoundingClientRect().right - box.left : 0) + margin;
    const scale = Math.min(1, (box.width - left - margin) / inner.width, (box.height - 2 * margin) / inner.height);
    fitting = true;
    try {
        canvas.viewbox({
            x: inner.x - left / scale,
            y: inner.y - margin / scale,
            width: box.width / scale,
            height: box.height / scale
        });
    } finally {
        fitting = false;
    }
    fitted = true;
}

// ---- open and save

async function open() {
    const xml = JSON.parse(document.getElementById('model-source').textContent);
    applyPanelState();
    try {
        const { warnings } = await modeler.importXML(xml);
        if (warnings.length)
            console.warn('import warnings', warnings);
        fitDiagram();
    } catch (err) {
        showStatus('Could not open the model: ' + err.message, true);
        console.error(err);
    }
}

async function saveDiagram(option) {
    try {
        showStatus('Saving…');
        const { xml } = await modeler.saveXML({ format: true });
        const { svg } = await modeler.saveSVG();
        const response = await fetch(window.location.pathname, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ processId: processName, bpmn: xml, svg })
        });
        if (!response.ok)
            throw new Error(`${response.status} ${response.statusText}`);
        changed = false;
        showStatus('Saved');
        if (option === 'run')
            window.open('/execute/' + encodeURIComponent(processName), 'execute')?.focus();
    } catch (err) {
        showStatus('Save failed: ' + err.message, true);
        console.error(err);
    }
}
window.saveDiagramFunct = saveDiagram;
document.getElementById('js-save').addEventListener('click', () => saveDiagram());
document.getElementById('js-save-run').addEventListener('click', () => saveDiagram('run'));

document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveDiagram();
    }
});

open();
