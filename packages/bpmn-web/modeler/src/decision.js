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
    } catch (err) {
        setStatus('Not saved: ' + err.message, 'error');
    }
}

document.getElementById('js-save').addEventListener('click', save);
window.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        save();
    }
});
window.addEventListener('beforeunload', event => {
    if (dirty) event.preventDefault();
});

open();
