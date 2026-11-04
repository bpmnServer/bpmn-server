// The History tab: every save of the model (GET /model/history/<name>), newest first, with who saved it and when,
// and the model in the editor (unsaved changes included) as "Current". Two ticked are compared by their report
// text (the Report tab's outline of the whole model: Report.text), its changed lines shown with the element and
// process they are in; and the elements moved or resized on the diagram, which the text does not hold. The newer
// version's diagram shows each element marked: + added, M changed (or moved), and the removed ones drawn where
// they were, dashed, with −. Restore loads a saved version into the editor, unsaved: Save keeps it as a new version,
// so the history keeps every version and a restore can itself be undone. Purge history removes every saved version
// (the model itself stays).
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';
import camundaModdle from '../moddle.js';
import { textChanges, layoutChanges, diagramChanges } from './compare.js';

const SVG = 'http://www.w3.org/2000/svg';
function svg(tag, attributes) {
    const element = document.createElementNS(SVG, tag);
    for (const [name, value] of Object.entries(attributes))
        element.setAttribute(name, value);
    return element;
}

const CURRENT = 'current';

function el(tag, attributes = {}, ...children) {
    const element = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) {
        if (name === 'class') element.className = value;
        else if (name.startsWith('on')) element.addEventListener(name.slice(2), value);
        else if (value !== undefined && value !== null && value !== false) element.setAttribute(name, value === true ? '' : value);
    }
    element.append(...children.flat().filter(c => c !== null && c !== undefined && c !== false));
    return element;
}

const when = iso => new Date(iso).toLocaleString();
const size = bytes => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

export default class HistoryPanel {
    constructor(config, eventBus, bpmnjs, moddle, elementRegistry, canvas, selection, report) {
        this._config = config || {};
        this._report = report;
        this._bpmnjs = bpmnjs;
        this._moddle = moddle;
        this._elementRegistry = elementRegistry;
        this._canvas = canvas;
        this._selection = selection;
        this._eventBus = eventBus;
        this._restored = null;      // the version last loaded into the editor, until the editor's model is saved
        this._root = document.querySelector(this._config.container);
        this._visible = false;
        this._versions = [];
        this._ticked = [];          // the versions ticked, in the order ticked (CURRENT for the editor's model)
        this._comparison = null;
        if (!this._root)
            return;
        eventBus.on('model.saved', () => { this._restored = null; if (this._visible) this.load(); });
    }

    get _url() {
        return '/model/history/' + encodeURIComponent(this._config.processName);
    }

    show() {
        if (!this._root)
            return;
        this._visible = true;
        this.load();
    }

    hide() {
        this._visible = false;
    }

    async load() {
        try {
            const response = await fetch(this._url);
            if (!response.ok)
                throw new Error(`${response.status} ${response.statusText}`);
            this._versions = (await response.json()).versions ?? [];
            this._error = null;
        } catch (err) {
            this._error = 'The history could not be read: ' + err.message;
        }
        this._ticked = this._ticked.filter(v => v === CURRENT || this._versions.some(x => x.version === v));
        this.render();
    }

    /** A version's model: a saved one from the server, the current one from the editor. */
    async source(version) {
        if (version === CURRENT)
            return (await this._bpmnjs.saveXML({ format: true })).xml;
        const response = await fetch(`${this._url}/${version}`);
        if (!response.ok)
            throw new Error(`version ${version}: ${response.status} ${response.statusText}`);
        return response.text();
    }

    tick(version, on) {
        this._ticked = this._ticked.filter(v => v !== version);
        if (on)
            this._ticked = [...this._ticked, version].slice(-2);      // two at most: the earliest ticked goes
        this.render();
    }

    async compare() {
        // the older first; the editor's model is the newest
        const [before, after] = [...this._ticked].sort((a, b) => (a === CURRENT ? Infinity : a) - (b === CURRENT ? Infinity : b));
        try {
            const [a, b] = await Promise.all([this.source(before), this.source(after)]);
            const [older, newer] = (await Promise.all([this._moddle.fromXML(a), this._moddle.fromXML(b)])).map(r => r.rootElement);
            const [from, to] = [this._report.text(older), this._report.text(newer)];
            this._comparison = { before, after, same: from === to, lines: textChanges(from, to), moved: layoutChanges(older, newer),
                diagram: diagramChanges(older, newer), xml: b };
        } catch (err) {
            this._comparison = { before, after, error: err.message };
        }
        this.render();
        if (this._comparison.xml)
            await this.drawDiagram(this._comparison);
    }

    /** The newer version's diagram, its elements marked: + added, M changed or moved, − removed (where they were). */
    async drawDiagram({ xml, diagram }) {
        if (!this._viewer) {
            this._diagramHost = el('div', { class: 'history-diagram' });
            this._viewer = new NavigatedViewer({ container: this._diagramHost, moddleExtensions: { camunda: camundaModdle } });
        }
        this.render();
        try {
            await this._viewer.importXML(xml);
        } catch (err) {
            this._diagramHost.replaceChildren(el('p', { class: 'history-error' }, 'The diagram could not be drawn: ' + err.message));
            return;
        }
        const canvas = this._viewer.get('canvas'), overlays = this._viewer.get('overlays'), registry = this._viewer.get('elementRegistry');
        const mark = (id, kind, sign, title) => {
            if (!registry.get(id))
                return;
            canvas.addMarker(id, `history-${kind}`);
            const badge = el('span', { class: `history-badge ${kind}`, title, 'data-id': id, onclick: () => this.reveal(id) }, sign);
            overlays.add(id, 'history', { position: { top: -10, right: 10 }, html: badge });
        };
        diagram.added.forEach(id => mark(id, 'added', '+', 'added'));
        diagram.changed.forEach(id => mark(id, 'changed', 'M', 'changed'));
        diagram.moved.forEach(id => mark(id, 'moved', 'M', 'moved or resized'));
        // the removed ones, drawn where they were in the older version
        const layer = canvas.getLayer('history-removed', 1);
        layer.replaceChildren();
        for (const removed of diagram.removed) {
            const title = svg('title', {});
            title.textContent = `removed: ${removed.type} ${removed.name || removed.id}`;
            const group = svg('g', { class: 'history-removed', 'data-id': removed.id });
            group.append(title);
            if (removed.bounds) {
                const [x, y, width, height] = removed.bounds;
                group.append(svg('rect', { x, y, width, height, rx: 8 }));
                const sign = svg('text', { x: x + width - 4, y: y + 4, class: 'history-removed-sign' });
                sign.textContent = '−';
                group.append(sign);
                if (removed.name) {
                    const name = svg('text', { x: x + width / 2, y: y + height / 2, class: 'history-removed-name' });
                    name.textContent = removed.name;
                    group.append(name);
                }
            }
            else if (removed.points?.length)
                group.append(svg('polyline', { points: removed.points.map(p => p.join(',')).join(' ') }));
            layer.append(group);
        }
        canvas.zoom('fit-viewport');
        // room around it for the marks on the elements at its edges
        const box = canvas.viewbox();
        const margin = Math.max(box.width, box.height) * 0.06;
        canvas.viewbox({ x: box.x - margin, y: box.y - margin, width: box.width + 2 * margin, height: box.height + 2 * margin });
    }

    /**
     * A saved version into the editor, in place of its model: not saved (the editor says "Unsaved changes"), so
     * nothing is lost until Save, which keeps it as the newest version.
     */
    async restore(version) {
        if (!window.confirm(`Load version ${version} of '${this._config.processName}' into the editor? `
            + 'It replaces the model in the editor, unsaved changes included; Save keeps it as a new version.'))
            return;
        try {
            await this._bpmnjs.importXML(await this.source(version));
        } catch (err) {
            window.alert(`Version ${version} could not be loaded: ${err.message}`);
            return;
        }
        this._restored = version;
        this._comparison = null;
        this._ticked = [];
        this._eventBus.fire('model.restored', { version });
        this.render();
    }

    async purge() {
        if (!window.confirm(`Delete all ${this._versions.length} saved versions of '${this._config.processName}'? The model itself stays.`))
            return;
        try {
            const response = await fetch(this._url, { method: 'DELETE' });
            if (!response.ok)
                throw new Error(`${response.status} ${response.statusText}`);
        } catch (err) {
            window.alert('The history was not purged: ' + err.message);
        }
        this._comparison = null;
        this.load();
    }

    /** Back to the diagram, with the element selected and in view. */
    reveal(id) {
        const element = this._elementRegistry.get(id);
        if (!element)
            return;
        if (element !== this._canvas.getRootElement())
            this._canvas.scrollToElement(element);
        this._selection.select(element);
    }

    render() {
        if (!this._root || !this._visible)
            return;
        const label = v => v === CURRENT ? 'Current' : `Version ${v}`;
        const row = (version, cells) => el('tr', { class: this._ticked.includes(version) ? 'ticked' : '' },
            el('td', {}, el('input', {
                type: 'checkbox', class: 'history-tick', 'data-version': String(version), 'aria-label': label(version),
                checked: this._ticked.includes(version), onchange: e => this.tick(version, e.target.checked)
            })),
            ...cells.map(c => el('td', {}, c)));

        const list = el('div', { class: 'history-list' },
            el('div', { class: 'history-actions' },
                el('button', { type: 'button', class: 'history-compare primary', disabled: this._ticked.length !== 2, onclick: () => this.compare() },
                    'Compare'),
                el('button', { type: 'button', class: 'history-purge', disabled: !this._versions.length, onclick: () => this.purge() }, 'Purge history')),
            this._error ? el('p', { class: 'history-error' }, this._error) : null,
            el('table', { class: 'history-versions' },
                el('thead', {}, el('tr', {}, el('th', {}), el('th', {}, 'Version'), el('th', {}, 'Saved'), el('th', {}, 'By'), el('th', {}, 'Size'), el('th', {}))),
                el('tbody', {},
                    row(CURRENT, ['Current', this._restored != null ? `version ${this._restored}, not saved` : 'in the editor', '', '', '']),
                    this._versions.map(v => row(v.version, [String(v.version), when(v.savedAt), v.savedBy ?? '', size(v.size),
                        el('button', { type: 'button', class: 'history-restore', 'data-version': String(v.version),
                            title: `Load version ${v.version} into the editor`, onclick: () => this.restore(v.version) }, 'Restore')])))),
            this._versions.length ? null : el('p', { class: 'history-note' }, 'No saved versions yet: each save keeps one.'),
            this._restored != null
                ? el('p', { class: 'history-restored' }, `Version ${this._restored} is in the editor, not saved: Save to keep it as a new version.`)
                : null,
            el('p', { class: 'history-note' }, 'Tick two to compare them. Restore loads a version into the editor; Save keeps it.'));

        this._root.replaceChildren(el('div', { class: 'history-panel' }, list, this.renderComparison(label)));
    }

    renderComparison(label) {
        const c = this._comparison;
        if (!c)
            return el('div', { class: 'history-comparison empty' });
        const title = el('h4', {}, `${label(c.before)} → ${label(c.after)}`);
        if (c.error)
            return el('div', { class: 'history-comparison' }, title, el('p', { class: 'history-error' }, 'Could not compare: ' + c.error));
        // "end event Not found (NotFound): moved"; a flow by its ends: "sequence flow Get repository → Not found (toNotFound): path changed"
        const name = e => el('span', {},
            `${e.type} `,
            el('a', { href: '#', class: 'history-element', 'data-id': e.id, onclick: ev => { ev.preventDefault(); this.reveal(e.id); } },
                e.from !== undefined ? `${e.from} → ${e.to}` : e.name || e.id),
            e.from !== undefined || e.name ? el('span', { class: 'history-id' }, ` (${e.id})`) : null,
            `: ${e.how.join(', ')}`);
        return el('div', { class: 'history-comparison' },
            title,
            c.same && !c.moved.length ? el('p', { class: 'history-note' }, 'No differences.') : null,
            c.same ? null : el('pre', { class: 'history-text' }, c.lines.map(l => el('div', { class: `line ${l.kind}` },
                l.kind === 'added' ? '+ ' : l.kind === 'removed' ? '- ' : l.kind === 'skipped' ? '… ' : '  ', l.text))),
            c.moved.length ? el('section', { class: 'history-changes moved' }, el('h5', {}, `Moved or resized on the diagram (${c.moved.length})`),
                el('ul', {}, c.moved.map(e => el('li', {}, name(e))))) : null,
            this._diagramHost && c.diagram ? el('section', { class: 'history-changes diagram' },
                el('h5', {}, `${label(c.after)}, marked`),
                el('p', { class: 'history-legend' },
                    el('span', { class: 'history-badge added' }, '+'), ' added  ',
                    el('span', { class: 'history-badge changed' }, 'M'), ' changed  ',
                    el('span', { class: 'history-badge moved' }, 'M'), ' moved or resized  ',
                    el('span', { class: 'history-badge removed' }, '−'), ' removed (dashed, where it was)'),
                this._diagramHost) : null);
    }
}

HistoryPanel.$inject = ['config.history', 'eventBus', 'bpmnjs', 'moddle', 'elementRegistry', 'canvas', 'selection', 'report'];
