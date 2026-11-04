// The bpmn-web model editor: bpmn-js with the properties panel shaped for bpmn-server.
// The page (src/views/modeler.pug) provides #js-canvas, #js-properties-panel, #js-panel-resizer, the save
// buttons, the dock under the canvas (#js-dock: the Problems, Report, Test and History tabs) and the model as JSON in #model-source. window.saveDiagramFunct(option) saves, as it did in the
// classic modeler (hosts and tests call it).
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import 'bpmn-js-element-templates/dist/assets/element-templates.css';
import '@bpmn-io/element-template-chooser/dist/element-template-chooser.css';
import './modeler.css';
import './report/report.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule, CamundaPlatformPropertiesProviderModule } from 'bpmn-js-properties-panel';
import CamundaBehaviorsModule from 'camunda-bpmn-js-behaviors/lib/camunda-platform';
import { ElementTemplatesPropertiesProviderModule } from 'bpmn-js-element-templates';
import ElementTemplateChooserModule from '@bpmn-io/element-template-chooser';
import camundaModdle from './moddle.js';
import BpmnServerPropertiesModule from './properties/index.js';
import ProblemsModule from './problems/index.js';
import ReportModule from './report/index.js';
import TestModule from './testing/index.js';
import { setupNavigation } from './navigation.js';
import ElementBehaviour from './properties/ElementBehaviour.js';
import DecisionsModule from './decisions/index.js';
import ConnectorsModule from './connectors/index.js';
import LintRulesModule from './lint/index.js';
import HistoryModule from './history/index.js';

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
        ElementTemplatesPropertiesProviderModule,
        ElementTemplateChooserModule,
        BpmnServerPropertiesModule,
        ProblemsModule,
        ReportModule,
        TestModule,
        DecisionsModule,
        ConnectorsModule,
        LintRulesModule,
        HistoryModule,
        { __init__: ['elementBehaviour'], elementBehaviour: ['type', ElementBehaviour] }
    ],
    report: { container: '#js-report', processName },
    history: { container: '#js-history', processName },
    // what the selected element does, above the properties panel
    elementBehaviour: { parent: '#js-properties-panel' },
    scriptContext: { servicesUrl: '/model/services' },
    decisions: { url: '/model/decisions' },
    connectors: { url: '/model/connectors' },
    lint: { url: '/model/lint-rules', button: '#js-lint-rules-open' },
    // tests run the saved model: save the editor's changes first
    test: { container: '#js-test', processName, save: () => saveIfChanged() },
    problems: { list: '#js-problems', counts: '#js-problems-counts', status: '#js-problems-status', url: '/model/verify', processName },
    moddleExtensions: { camunda: camundaModdle }
});
window.bpmnModeler = modeler;
window.BPMNModeler = modeler;     // the classic modeler's name for it, used by hosts

// the model and element drop-downs; the properties panel opens what is set
setupNavigation(modeler, { processName, header: document.querySelector('.modeler-header'), panel: '#js-properties-panel' });


let changed = false;
modeler.on('commandStack.changed', () => {
    changed = true;
    if (status.textContent === 'Saved')
        showStatus('Unsaved changes');
});
// the History tab loaded a saved version into the editor: it is a change, until saved
modeler.on('model.restored', ({ version }) => {
    changed = true;
    showStatus(`Version ${version} restored: unsaved`);
});
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

const panelState = { width: 360, collapsed: false, dockHeight: 220, dockCollapsed: false, dockTab: 'problems', ...loadPanelState() };
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

// ---- the dock under the canvas: Problems and Report tabs, resizable and collapsible, remembered per browser

const dock = document.getElementById('js-dock');
const MIN_DOCK = 80;
const maxDock = () => Math.max(MIN_DOCK, Math.floor(page.clientHeight * 0.7));

// History only when the server keeps it (MODEL_HISTORY)
const DOCK_TABS = ['problems', 'report', 'test', 'history'].filter(name => document.getElementById(`js-tab-${name}`));

function applyDockState() {
    const tab = DOCK_TABS.includes(panelState.dockTab) ? panelState.dockTab : 'problems';
    dock.style.setProperty('--dock-height', Math.min(Math.max(panelState.dockHeight, MIN_DOCK), maxDock()) + 'px');
    dock.classList.toggle('collapsed', panelState.dockCollapsed);
    dock.dataset.tab = tab;
    for (const name of DOCK_TABS)
        document.getElementById(`js-tab-${name}`).setAttribute('aria-selected', String(name === tab));
    document.getElementById('js-dock-toggle').setAttribute('aria-expanded', String(!panelState.dockCollapsed));
    for (const [name, view] of [['report', modeler.get('report')], ['test', modeler.get('testPanel')], ['history', modeler.get('historyPanel')]]) {
        if (tab === name && !panelState.dockCollapsed)
            view.show();
        else
            view.hide();
    }
}

function showTab(tab) {
    panelState.dockTab = tab;
    panelState.dockCollapsed = false;      // choosing a tab opens the dock
    applyDockState();
    savePanelState(panelState);
}
document.getElementById('js-tab-problems').addEventListener('click', () => showTab('problems'));
document.getElementById('js-tab-report').addEventListener('click', () => showTab('report'));
document.getElementById('js-tab-test').addEventListener('click', () => showTab('test'));
document.getElementById('js-tab-history')?.addEventListener('click', () => showTab('history'));
document.getElementById('js-dock-toggle').addEventListener('click', () => {
    panelState.dockCollapsed = !panelState.dockCollapsed;
    applyDockState();
    savePanelState(panelState);
});
document.getElementById('js-print').addEventListener('click', () => window.print());

const dockResizer = document.getElementById('js-dock-resizer');
dockResizer.addEventListener('pointerdown', down => {
    if (panelState.dockCollapsed)
        return;
    dockResizer.setPointerCapture(down.pointerId);
    const startY = down.clientY, startHeight = dock.querySelector('.dock-body').getBoundingClientRect().height;
    page.classList.add('resizing-dock');
    const move = event => {
        panelState.dockHeight = Math.min(Math.max(startHeight + startY - event.clientY, MIN_DOCK), maxDock());
        applyDockState();
    };
    const up = () => {
        dockResizer.removeEventListener('pointermove', move);
        page.classList.remove('resizing-dock');
        savePanelState(panelState);
    };
    dockResizer.addEventListener('pointermove', move);
    dockResizer.addEventListener('pointerup', up, { once: true });
});
window.addEventListener('resize', applyDockState);

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

/** The configured tasks of the application (GET /model/templates), offered under Template in the panel. */
async function loadTemplates() {
    try {
        const response = await fetch('/model/templates');
        if (!response.ok)
            throw new Error(`${response.status} ${response.statusText}`);
        const { templates, rejected } = await response.json();
        for (const template of rejected)
            console.warn(`element template ${template.file} left out: ${template.problems.join('; ')}`);
        modeler.get('elementTemplates').set(templates);
    } catch (err) {
        console.error('Could not load the element templates', err);
    }
}

async function open() {
    const xml = JSON.parse(document.getElementById('model-source').textContent);
    await loadTemplates();    // before the model: tasks made from a template show it
    applyPanelState();
    applyDockState();
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
        modeler.get('eventBus').fire('model.saved', { processName });
        if (option === 'run')
            window.open('/execute/' + encodeURIComponent(processName), 'execute')?.focus();
    } catch (err) {
        showStatus('Save failed: ' + err.message, true);
        console.error(err);
    }
}
window.saveDiagramFunct = saveDiagram;

/** Save when the editor has changes; fails when saving does. */
async function saveIfChanged() {
    if (!changed)
        return;
    await saveDiagram();
    if (changed)
        throw new Error('Save the model first: saving failed');
}
document.getElementById('js-save').addEventListener('click', () => saveDiagram());
document.getElementById('js-save-run').addEventListener('click', () => saveDiagram('run'));

document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveDiagram();
    }
});

open();
