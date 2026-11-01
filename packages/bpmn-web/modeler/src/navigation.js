// Getting around the editor: a model drop-down (open another model; the page asks first when there are unsaved
// changes), an element drop-down (every element of the model, in each process's order; picking one shows and
// selects it, and it follows the selection), and the properties panel opening the groups that have values set
// when an element is selected.
import { is } from 'bpmn-js/lib/util/ModelUtil';

const label = bo => bo.get('name') ? `${bo.get('name')} (${bo.id})` : bo.id;

function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') node.className = value;
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else if (key === 'value') node.value = value;
        else node.setAttribute(key, value === true ? '' : value);
    }
    node.append(...children.flat().filter(c => c !== null && c !== undefined).map(c => c instanceof Node ? c : document.createTextNode(String(c))));
    return node;
}

/** The model drop-down: every model; another one opens in its place. */
async function modelPicker(container, processName) {
    const select = el('select', { id: 'js-model-picker', class: 'modeler-picker', 'aria-label': 'Open another model', title: 'Open another model' },
        el('option', { value: processName }, processName));
    container.append(select);
    select.addEventListener('change', () => {
        if (select.value !== processName)
            location.href = `/model/edit/${encodeURIComponent(select.value)}`;     // unsaved changes: the page asks first
    });
    try {
        const response = await fetch('/model/names');
        const { names } = await response.json();
        select.replaceChildren(...names.map(name => el('option', { value: name, selected: name === processName }, name)));
        if (!names.includes(processName)) select.prepend(el('option', { value: processName, selected: true }, processName));
    } catch {
        // the list stays this model only
    }
}

/** The element drop-down: the model's elements in each process, by name (id); it shows and selects the one picked. */
function elementPicker(container, modeler) {
    const elementRegistry = modeler.get('elementRegistry');
    const canvas = modeler.get('canvas');
    const selection = modeler.get('selection');
    const select = el('select', { id: 'js-element-picker', class: 'modeler-picker', 'aria-label': 'Go to an element', title: 'Go to an element' });
    container.append(select);

    const fill = () => {
        const current = select.value;
        const definitions = modeler.getDefinitions();
        const groups = [];
        const walk = (container, into) => (container.get('flowElements') || []).forEach(e => {
            if (is(e, 'bpmn:SequenceFlow') || is(e, 'bpmn:DataObject')) return;
            into.push(e);
            if (is(e, 'bpmn:SubProcess')) walk(e, into);
        });
        for (const process of (definitions?.get('rootElements') || []).filter(e => is(e, 'bpmn:Process'))) {
            const elements = [];
            walk(process, elements);
            groups.push(el('optgroup', { label: label(process) },
                elements.filter(e => elementRegistry.get(e.id)).map(e => el('option', { value: e.id }, label(e)))));
        }
        select.replaceChildren(el('option', { value: '' }, 'Go to an element…'), ...groups);
        select.value = elementRegistry.get(current) ? current : '';
    };
    let timer;
    const refill = () => { clearTimeout(timer); timer = setTimeout(fill, 150); };

    select.addEventListener('change', () => {
        const element = elementRegistry.get(select.value);
        if (!element) return;
        canvas.scrollToElement(element);
        selection.select(element);
    });
    modeler.on('import.done', fill);
    modeler.on('elements.changed', refill);
    modeler.on('selection.changed', ({ newSelection }) => {
        const one = newSelection.length === 1 ? newSelection[0] : null;
        select.value = one && select.querySelector(`option[value="${CSS.escape(one.id)}"]`) ? one.id : '';
    });
    fill();
}

/**
 * The properties panel: the groups with values set (the panel marks them with a dot) open when an element is
 * selected. Opened as the panel draws them (its propertiesPanel.updated, and the frame after it), during its first
 * renders of the element; each group once, so one closed by hand stays closed. A group has values when the panel's
 * dot says so, or a field of it is filled (a text field's value and dot come from an effect).
 */
function openActiveGroups(modeler, panelSelector) {
    const SETTLE = 500;
    let last = null, until = 0, opened = new Set();
    /** The group has a value: its dot, or (a text field's dot comes later, from an effect) a field already filled. */
    const hasValues = (header) => {
        if (header.querySelector('.bio-properties-panel-dot')) return true;
        const group = header.closest('[data-group-id]');
        return [...(group?.querySelectorAll('input:not([type=checkbox]):not([type=hidden]), textarea, select') ?? [])].some(f => f.value?.trim())
            || [...(group?.querySelectorAll('[contenteditable="true"]') ?? [])].some(f => f.textContent.trim());
    };
    const open = () => {
        if (Date.now() > until) return;
        for (const header of document.querySelectorAll(`${panelSelector} .bio-properties-panel-group-header`)) {
            const id = header.closest('[data-group-id]')?.dataset.groupId ?? header.textContent;
            if (opened.has(id) || !hasValues(header)) continue;
            opened.add(id);
            if (!header.classList.contains('open')) header.click();
        }
    };
    modeler.on('selection.changed', ({ newSelection }) => {
        const one = newSelection.length === 1 ? newSelection[0] : null;
        const key = one?.id ?? null;
        if (key === last) return;
        last = key;
        opened = new Set();
        until = Date.now() + SETTLE;
    });
    // at once, as the panel has drawn, and on the next frame: a text field gets its value (and dot) from an effect
    modeler.on('propertiesPanel.updated', () => { open(); requestAnimationFrame(open); });
}

export function setupNavigation(modeler, { processName, header, panel }) {
    const container = el('div', { class: 'modeler-pickers' });
    // beside the model's name
    const title = header.querySelector('h1');
    if (title) title.after(container); else header.append(container);
    modelPicker(container, processName);
    elementPicker(container, modeler);
    openActiveGroups(modeler, panel);
}

