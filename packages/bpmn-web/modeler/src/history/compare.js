// Two versions of a model compared by their report text (Report.text: the whole model as an outline), and by
// their diagram's layout, which the text does not hold.
import { diffLines } from 'diff';

const LAYOUT = /^(bpmndi|dc|di):/;

/** Every element's layout, by the id of what it draws: bounds, waypoints, label. */
function layoutOf(root) {
    const layout = new Map();
    const visit = element => {
        if (!element || typeof element !== 'object' || !element.$type)
            return;
        if ((element.$type === 'bpmndi:BPMNShape' || element.$type === 'bpmndi:BPMNEdge') && element.get('bpmnElement')) {
            const bounds = element.get('bounds'), label = element.get('label')?.get('bounds');
            layout.set(element.get('bpmnElement').id, {
                element: element.get('bpmnElement'),
                text: JSON.stringify({
                    bounds: bounds && [bounds.x, bounds.y, bounds.width, bounds.height],
                    waypoints: (element.get('waypoint') || []).map(p => [p.x, p.y]),
                    label: label && [label.x, label.y, label.width, label.height],
                    expanded: element.get('isExpanded')
                })
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

/** The elements drawn in both versions whose place, size or path on the diagram differs: [{ id, type, name }]. */
export function layoutChanges(before, after) {
    const older = layoutOf(before), newer = layoutOf(after);
    return [...newer].filter(([id, { text }]) => older.has(id) && older.get(id).text !== text)
        .map(([id, { element }]) => ({ id, type: element.$type.replace(/^bpmn:/, ''), name: element.get('name') || '' }));
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
