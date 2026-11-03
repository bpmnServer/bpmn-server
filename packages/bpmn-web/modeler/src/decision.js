// The decision editor (dmn-js): a DMN file of the models folder, `<name>.dmn.xml`, as business rule tasks name it.
// The page (src/views/decision.pug) holds the file as JSON in #model-source; Save posts it back to this URL.
import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-decision-table-controls.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn-embedded.css';
import './modeler.css';
import './decision.css';

import DmnModeler from 'dmn-js/lib/Modeler';
import DecisionTestPanel from './testing/DecisionTestPanel.js';

const page = document.getElementById('decision-page');
const status = document.getElementById('js-save-status');
const viewsNav = document.getElementById('js-views');

const modeler = new DmnModeler({ container: '#js-decision', common: { keyboard: { bindTo: window } } });
window.dmnModeler = modeler;

let dirty = page.dataset.exists !== 'true';     // a new file is not saved yet
const setStatus = (text, kind = '') => { status.textContent = text; status.className = `modeler-status ${kind}`; };

/** One button per decision (its table or expression) and one for the diagram (DRD) when there are several. */
function showViews() {
    const views = modeler.getViews();
    const active = modeler.getActiveView();
    viewsNav.replaceChildren(...views
        .filter(v => v.type !== 'drd' || views.length > 2)
        .map(view => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = view.type === 'drd' ? 'Diagram' : (view.element.name || view.element.id);
            button.setAttribute('aria-pressed', String(view === active));
            button.addEventListener('click', () => modeler.open(view));
            return button;
        }));
}

modeler.on('views.changed', showViews);
// each view has its own command stack: a change in any marks the file unsaved
const watched = new WeakSet();
modeler.on('views.changed', () => {
    const viewer = modeler.getActiveViewer();
    if (!viewer || watched.has(viewer))
        return;
    watched.add(viewer);
    viewer.get('eventBus').on('commandStack.changed', () => {
        dirty = true;
        setStatus('Unsaved changes');
    });
});

async function open() {
    const xml = JSON.parse(document.getElementById('model-source').textContent);
    try {
        await modeler.importXML(xml);
    } catch (err) {
        setStatus('The file can not be opened: ' + err.message, 'error');
        return;
    }
    // straight to the decision: a file with one decision opens on its table
    const decisions = modeler.getViews().filter(v => v.type !== 'drd');
    if (decisions.length === 1)
        await modeler.open(decisions[0]);
    setStatus(dirty ? 'New file: not saved yet' : '');
}

async function save() {
    setStatus('Saving…');
    try {
        const { xml } = await modeler.saveXML({ format: true });
        const response = await fetch(window.location.pathname, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xml })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok)
            throw new Error(result.errors || response.statusText);
        dirty = false;
        setStatus('Saved', 'ok');
        return true;
    } catch (err) {
        setStatus('Not saved: ' + err.message, 'error');
        return false;
    }
}

// ---- the dock under the decision: the Test tab, resizable and collapsible, remembered per browser ----------

const DOCK_KEY = 'bpmn-web.decision-dock';
const MIN_DOCK = 80;
const dock = document.getElementById('js-dock');
const dockState = { height: 260, collapsed: false };
try { Object.assign(dockState, JSON.parse(localStorage.getItem(DOCK_KEY) || '{}')); } catch { /* none kept */ }
const keepDock = () => { try { localStorage.setItem(DOCK_KEY, JSON.stringify(dockState)); } catch { /* not kept */ } };
const maxDock = () => Math.max(MIN_DOCK, Math.floor(page.clientHeight * 0.7));

const testPanel = new DecisionTestPanel(document.getElementById('js-test'), {
    name: page.dataset.name,
    modeler,
    // the tests run on the saved file: save the changes first
    save: () => dirty ? save() : Promise.resolve(true)
});

function applyDock() {
    dock.style.setProperty('--dock-height', Math.min(Math.max(dockState.height, MIN_DOCK), maxDock()) + 'px');
    dock.classList.toggle('collapsed', dockState.collapsed);
    document.getElementById('js-dock-toggle').setAttribute('aria-expanded', String(!dockState.collapsed));
    if (dockState.collapsed) testPanel.hide();
    else testPanel.show();
}
document.getElementById('js-tab-test').addEventListener('click', () => {
    dockState.collapsed = false;
    applyDock();
    keepDock();
});
document.getElementById('js-dock-toggle').addEventListener('click', () => {
    dockState.collapsed = !dockState.collapsed;
    applyDock();
    keepDock();
});
const dockResizer = document.getElementById('js-dock-resizer');
dockResizer.addEventListener('pointerdown', down => {
    if (dockState.collapsed)
        return;
    dockResizer.setPointerCapture(down.pointerId);
    const startY = down.clientY, startHeight = dock.querySelector('.dock-body').getBoundingClientRect().height;
    page.classList.add('resizing-dock');
    const move = event => {
        dockState.height = Math.min(Math.max(startHeight + startY - event.clientY, MIN_DOCK), maxDock());
        applyDock();
    };
    const up = () => {
        dockResizer.removeEventListener('pointermove', move);
        page.classList.remove('resizing-dock');
        keepDock();
    };
    dockResizer.addEventListener('pointermove', move);
    dockResizer.addEventListener('pointerup', up, { once: true });
});
window.addEventListener('resize', applyDock);
// the inputs and outputs the tab offers follow the file's decisions
modeler.on('views.changed', () => testPanel.refresh());
// #tests (from the Design dashboard) opens the tab
if (window.location.hash === '#tests')
    dockState.collapsed = false;

document.getElementById('js-save').addEventListener('click', save);
window.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        save();
    }
});
window.addEventListener('beforeunload', event => {
    if (dirty || testPanel.pending) event.preventDefault();
});

open().then(applyDock);
