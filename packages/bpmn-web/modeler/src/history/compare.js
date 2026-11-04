// Two versions of a model compared by their report text (Report.text: the whole model as an outline), and by
// their diagram's layout, which the text does not hold.
import { diffLines } from 'diff';

const LAYOUT = /^(bpmndi|dc|di):/;

/** Every element's layout, by the id of what it draws: bounds, waypoints, label. */
function layoutOf(root) {
    const layout = new Map();
    const box = bounds => bounds ? [bounds.x, bounds.y, bounds.width, bounds.height] : null;
    const visit = element => {
        if (!element || typeof element !== 'object' || !element.$type)
            return;
        if ((element.$type === 'bpmndi:BPMNShape' || element.$type === 'bpmndi:BPMNEdge') && element.get('bpmnElement')) {
            const points = (element.get('waypoint') || []).map(p => [p.x, p.y]);
            layout.set(element.get('bpmnElement').id, {
                element: element.get('bpmnElement'),
                bounds: box(element.get('bounds')),
                points,
                waypoints: JSON.stringify(points),
                label: JSON.stringify(box(element.get('label')?.get('bounds'))),
                expanded: element.get('isExpanded')
            });
        }
        for (const property of element.$descriptor.properties) {
            if (property.isReference)
                continue;
            const value = element.get(property.name);
            for (const child of Array.isArray(value) ? value : [value])
                if (child && typeof child === 'object' && (LAYOUT.test(child.$type) || child.$type === 'bpmn:Definitions'))
                    visit(child);
        }
    };
    visit(root);
    return layout;
}

/** What differs between two layouts of an element, in words: ['moved', 'resized', ...]. */
function howChanged(older, newer) {
    const how = [];
    const [x1, y1, w1, h1] = older.bounds || [], [x2, y2, w2, h2] = newer.bounds || [];
    if (x1 !== x2 || y1 !== y2) how.push('moved');
    if (w1 !== w2 || h1 !== h2) how.push('resized');
    if (older.waypoints !== newer.waypoints) how.push('path changed');
    if (older.label !== newer.label) how.push('label moved');
    if (older.expanded !== newer.expanded) how.push(newer.expanded ? 'expanded' : 'collapsed');
    return how;
}

// EndEvent → 'end event'
const words = type => type.replace(/^bpmn:/, '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
const nameOf = element => element?.get?.('name') || element?.id || '';

/**
 * The elements drawn in both versions whose place, size or path on the diagram differs:
 *   [{ id, type: 'end event', name, how: ['moved', ...], from?, to? }]   (from and to: a flow's ends, by name)
 */
export function layoutChanges(before, after) {
    const older = layoutOf(before), newer = layoutOf(after);
    const changes = [];
    for (const [id, layout] of newer) {
        if (!older.has(id))
            continue;
        const how = howChanged(older.get(id), layout);
        if (!how.length)
            continue;
        const { element } = layout;
        const change = { id, type: words(element.$type), name: element.get('name') || '', how };
        if (element.sourceRef || element.targetRef) {
            change.from = nameOf(element.sourceRef);
            change.to = nameOf(element.targetRef);
        }
        changes.push(change);
    }
    return changes;
}

// what an element is, apart from where it is drawn: its own settings and parts, the elements it refers to by id;
// not its incoming and outgoing (its flows say so) nor the elements it contains (each is compared on its own)
const OWN_ONLY = new Set(['incoming', 'outgoing', 'flowElements', 'laneSets', 'artifacts', 'flowNodeRef', 'childLaneSet']);
function fingerprint(element) {
    const value = v => v && typeof v === 'object'
        ? (v.$type ? fingerprint(v) : Array.isArray(v) ? v.map(value) : v)
        : v;
    const own = { $type: element.$type, attrs: element.$attrs };
    for (const property of element.$descriptor.properties) {
        if (OWN_ONLY.has(property.name) || property.name === 'id')
            continue;
        const v = element.get(property.name);
        if (v === undefined || (Array.isArray(v) && !v.length))
            continue;
        own[property.name] = property.isReference
            ? (Array.isArray(v) ? v.map(r => r?.id) : v?.id)
            : value(v);
    }
    return JSON.stringify(own);
}

/**
 * The drawn elements of two versions marked as a diagram shows them: added (only in the newer), removed (only in
 * the older: with where they were drawn), changed (what they are differs), moved (only where they are drawn).
 *   { added: [id], removed: [{ id, type, name, bounds, points }], changed: [id], moved: [id] }
 */
export function diagramChanges(before, after) {
    const older = layoutOf(before), newer = layoutOf(after);
    const changes = { added: [], removed: [], changed: [], moved: [] };
    for (const [id, layout] of newer) {
        const was = older.get(id);
        if (!was)
            changes.added.push(id);
        else if (fingerprint(was.element) !== fingerprint(layout.element))
            changes.changed.push(id);
        else if (howChanged(was, layout).length)
            changes.moved.push(id);
    }
    for (const [id, { element, bounds, points }] of older)
        if (!newer.has(id))
            changes.removed.push({ id, type: words(element.$type), name: element.get('name') || '', bounds, points });
    return changes;
}

const indentOf = text => text.length - text.trimStart().length;

/**
 * The lines of `after` that differ from `before` (texts of outline lines), each change shown with `context` lines
 * around it and the lines it is nested under (its element, its process), as a reader needs to place it:
 *   [{ kind: 'same' | 'added' | 'removed' | 'skipped', text }]  (skipped: how many unchanged lines are not shown)
 */
export function textChanges(before, after, context = 1) {
    const lines = [];
    for (const part of diffLines(before, after)) {
        const kind = part.added ? 'added' : part.removed ? 'removed' : 'same';
        for (const line of part.value.replace(/\n$/, '').split('\n'))
            lines.push({ kind, text: line });
    }
    const shown = lines.map(() => false);
    lines.forEach((line, n) => {
        if (line.kind === 'same')
            return;
        for (let k = Math.max(0, n - context); k <= Math.min(lines.length - 1, n + context); k++)
            shown[k] = true;
        // the lines it is nested under: each earlier line indented less than the last one found
        let indent = indentOf(line.text);
        for (let k = n - 1; k >= 0 && indent > 0; k--)
            if (lines[k].kind !== 'added' && lines[k].text.trim() && indentOf(lines[k].text) < indent) {
                shown[k] = true;
                indent = indentOf(lines[k].text);
            }
    });
    const result = [];
    for (let n = 0; n < lines.length;) {
        if (shown[n]) {
            result.push(lines[n++]);
            continue;
        }
        let skipped = 0;
        while (n < lines.length && !shown[n]) { skipped++; n++; }
        result.push({ kind: 'skipped', text: `${skipped} unchanged line${skipped === 1 ? '' : 's'}` });
    }
    return result;
}
