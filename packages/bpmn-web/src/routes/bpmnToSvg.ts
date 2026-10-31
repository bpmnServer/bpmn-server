import { BpmnModdle } from 'bpmn-moddle';

/**
 * Renders a preview SVG from a model's diagram information (BPMN DI) without a browser.
 * The look follows bpmn-js closely enough for previews; saving the model in the modeler
 * replaces it with the modeler's own export.
 */

type Bounds = { x: number, y: number, width: number, height: number };

const STROKE = '#22242a';
const FONT = 'font-family="Arial, sans-serif" font-size="12" fill="' + STROKE + '"';

function esc(value: string): string {
    return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function is(element, type: string): boolean {
    return !!element && typeof element.$instanceOf === 'function' && element.$instanceOf(type);
}

/** Greedy word wrap at roughly 6.5px per character. */
function wrap(text: string, width: number): string[] {
    const max = Math.max(4, Math.floor(width / 6.5));
    const lines: string[] = [];
    let line = '';
    for (const word of String(text).split(/\s+/).filter(Boolean)) {
        if (line && (line + ' ' + word).length > max) {
            lines.push(line);
            line = word;
        }
        else
            line = line ? line + ' ' + word : word;
    }
    if (line) lines.push(line);
    return lines;
}

function textBlock(text: string, cx: number, top: number, width: number, middle = false, height = 0): string {
    if (!text) return '';
    const lines = wrap(text, width);
    const lineHeight = 14;
    let y = middle ? top + height / 2 - (lines.length * lineHeight) / 2 + 11 : top + 11;
    return lines.map(l => {
        const t = `<text x="${cx}" y="${y}" text-anchor="middle" ${FONT}>${esc(l)}</text>`;
        y += lineHeight;
        return t;
    }).join('');
}

function externalLabel(shape, element, b: Bounds): string {
    if (!element.name) return '';
    const lb = shape.label && shape.label.bounds;
    if (lb)
        return textBlock(element.name, lb.x + lb.width / 2, lb.y - 2, Math.max(lb.width, 90));
    return textBlock(element.name, b.x + b.width / 2, b.y + b.height + 7, 90);
}

function eventShape(element, b: Bounds): string {
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2, r = b.width / 2;
    let out: string;
    if (is(element, 'bpmn:EndEvent'))
        out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${STROKE}" stroke-width="4"/>`;
    else if (is(element, 'bpmn:StartEvent'))
        out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${STROKE}" stroke-width="2"/>`;
    else
        out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${STROKE}" stroke-width="1.5"/>` +
            `<circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="${STROKE}" stroke-width="1.5"/>`;
    const defs = (element.eventDefinitions || []).map(d => d.$type);
    if (defs.includes('bpmn:TimerEventDefinition'))
        out += `<circle cx="${cx}" cy="${cy}" r="${r - 7}" fill="white" stroke="${STROKE}" stroke-width="1.5"/>` +
            `<path d="M${cx} ${cy - r + 9}V${cy}L${cx + 5} ${cy + 3}" fill="none" stroke="${STROKE}" stroke-width="1.5"/>`;
    else if (defs.includes('bpmn:MessageEventDefinition'))
        out += `<rect x="${cx - 8}" y="${cy - 5.5}" width="16" height="11" fill="white" stroke="${STROKE}"/>` +
            `<path d="M${cx - 8} ${cy - 5.5}L${cx} ${cy + 1}L${cx + 8} ${cy - 5.5}" fill="none" stroke="${STROKE}"/>`;
    else if (defs.length)
        out += `<circle cx="${cx}" cy="${cy}" r="4" fill="${STROKE}"/>`;
    return out;
}

function gatewayShape(element, b: Bounds): string {
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    let out = `<polygon points="${cx},${b.y} ${b.x + b.width},${cy} ${cx},${b.y + b.height} ${b.x},${cy}" fill="white" stroke="${STROKE}" stroke-width="2"/>`;
    const m = b.width * 0.22;
    if (is(element, 'bpmn:ParallelGateway'))
        out += `<path d="M${cx} ${cy - m}V${cy + m}M${cx - m} ${cy}H${cx + m}" stroke="${STROKE}" stroke-width="4"/>`;
    else if (is(element, 'bpmn:InclusiveGateway'))
        out += `<circle cx="${cx}" cy="${cy}" r="${m}" fill="none" stroke="${STROKE}" stroke-width="2.5"/>`;
    else if (is(element, 'bpmn:EventBasedGateway'))
        out += `<circle cx="${cx}" cy="${cy}" r="${m}" fill="none" stroke="${STROKE}" stroke-width="1"/>`;
    else if (is(element, 'bpmn:ExclusiveGateway'))
        out += `<path d="M${cx - m * 0.7} ${cy - m * 0.7}L${cx + m * 0.7} ${cy + m * 0.7}M${cx + m * 0.7} ${cy - m * 0.7}L${cx - m * 0.7} ${cy + m * 0.7}" stroke="${STROKE}" stroke-width="4"/>`;
    return out;
}

/** The shape's visual, drawn at the origin (its element group is translated to its position). */
function shapeSvg(shape): string {
    const element = shape.bpmnElement;
    if (!element || !shape.bounds) return '';
    const b: Bounds = { x: 0, y: 0, width: shape.bounds.width, height: shape.bounds.height };
    const name = element.name || '';
    if (is(element, 'bpmn:Participant'))
        return `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="white" stroke="${STROKE}" stroke-width="1.5"/>` +
            `<path d="M${b.x + 30} ${b.y}V${b.y + b.height}" stroke="${STROKE}" stroke-width="1.5"/>` +
            `<text transform="translate(${b.x + 19} ${b.y + b.height / 2}) rotate(-90)" text-anchor="middle" ${FONT}>${esc(name)}</text>`;
    if (is(element, 'bpmn:Lane'))
        return `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="none" stroke="${STROKE}" stroke-width="1"/>` +
            `<text transform="translate(${b.x + 15} ${b.y + b.height / 2}) rotate(-90)" text-anchor="middle" ${FONT}>${esc(name)}</text>`;
    if (is(element, 'bpmn:Event'))
        return eventShape(element, b);
    if (is(element, 'bpmn:Gateway'))
        return gatewayShape(element, b);
    if (is(element, 'bpmn:SubProcess')) {
        const expanded = shape.isExpanded !== false && b.width > 150;
        return `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="10" fill="white" stroke="${STROKE}" stroke-width="2"/>` +
            (expanded ? textBlock(name, b.x + b.width / 2, b.y + 4, b.width - 10)
                : textBlock(name, b.x + b.width / 2, b.y, b.width - 10, true, b.height) +
                `<rect x="${b.x + b.width / 2 - 7}" y="${b.y + b.height - 16}" width="14" height="14" fill="white" stroke="${STROKE}"/>` +
                `<path d="M${b.x + b.width / 2} ${b.y + b.height - 13}v8M${b.x + b.width / 2 - 4} ${b.y + b.height - 9}h8" stroke="${STROKE}"/>`);
    }
    if (is(element, 'bpmn:Activity')) {
        const call = is(element, 'bpmn:CallActivity');
        return `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="10" fill="white" stroke="${STROKE}" stroke-width="${call ? 5 : 2}"/>` +
            taskMarker(element, b) + textBlock(name, b.x + b.width / 2, b.y, b.width - 10, true, b.height);
    }
    if (is(element, 'bpmn:DataObjectReference') || is(element, 'bpmn:DataObject')) {
        const f = 10;
        return `<path d="M${b.x} ${b.y}H${b.x + b.width - f}L${b.x + b.width} ${b.y + f}V${b.y + b.height}H${b.x}Z" fill="white" stroke="${STROKE}" stroke-width="1.5"/>`;
    }
    if (is(element, 'bpmn:DataStoreReference')) {
        const e = 6;
        return `<path d="M${b.x} ${b.y + e}V${b.y + b.height - e}A${b.width / 2} ${e} 0 0 0 ${b.x + b.width} ${b.y + b.height - e}V${b.y + e}A${b.width / 2} ${e} 0 0 0 ${b.x} ${b.y + e}A${b.width / 2} ${e} 0 0 0 ${b.x + b.width} ${b.y + e}" fill="white" stroke="${STROKE}" stroke-width="1.5"/>`;
    }
    if (is(element, 'bpmn:TextAnnotation'))
        return `<path d="M${b.x + 10} ${b.y}H${b.x}V${b.y + b.height}H${b.x + 10}" fill="none" stroke="${STROKE}"/>` +
            textBlock(element.text || '', b.x + b.width / 2, b.y, b.width - 6, true, b.height);
    if (is(element, 'bpmn:Group'))
        return `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="10" fill="none" stroke="${STROKE}" stroke-dasharray="10,6,2,6"/>`;
    return `<rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="none" stroke="${STROKE}"/>`;
}

/** Small type marker in the top-left corner of a task. */
function taskMarker(element, b: Bounds): string {
    const x = b.x + 8, y = b.y + 8;
    if (is(element, 'bpmn:UserTask'))
        return `<circle cx="${x + 6}" cy="${y + 4}" r="3.5" fill="none" stroke="${STROKE}"/><path d="M${x} ${y + 14}c0-6 12-6 12 0Z" fill="none" stroke="${STROKE}"/>`;
    if (is(element, 'bpmn:ServiceTask'))
        return `<circle cx="${x + 6}" cy="${y + 6}" r="5" fill="none" stroke="${STROKE}" stroke-width="2" stroke-dasharray="2,1.5"/><circle cx="${x + 6}" cy="${y + 6}" r="2" fill="none" stroke="${STROKE}"/>`;
    if (is(element, 'bpmn:ScriptTask'))
        return `<path d="M${x + 2} ${y}h9c-4 3 0 9-4 13h-9c4-4 0-10 4-13M${x + 1} ${y + 4}h6M${x} ${y + 8}h6" fill="none" stroke="${STROKE}"/>`;
    if (is(element, 'bpmn:SendTask') || is(element, 'bpmn:ReceiveTask'))
        return `<rect x="${x}" y="${y + 1}" width="14" height="10" fill="${is(element, 'bpmn:SendTask') ? STROKE : 'white'}" stroke="${STROKE}"/>` +
            `<path d="M${x} ${y + 1}L${x + 7} ${y + 6}L${x + 14} ${y + 1}" fill="none" stroke="${is(element, 'bpmn:SendTask') ? 'white' : STROKE}"/>`;
    if (is(element, 'bpmn:BusinessRuleTask'))
        return `<rect x="${x}" y="${y}" width="15" height="11" fill="white" stroke="${STROKE}"/><path d="M${x} ${y + 4}h15M${x + 5} ${y}v11" stroke="${STROKE}"/>`;
    return '';
}

function edgeSvg(edge): string {
    const element = edge.bpmnElement;
    const points = edge.waypoint || [];
    if (points.length < 2) return '';
    const d = points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join('');
    let out: string;
    if (is(element, 'bpmn:MessageFlow'))
        out = `<path d="${d}" fill="none" stroke="${STROKE}" stroke-width="1.5" stroke-dasharray="10,8" marker-end="url(#open-arrow)"/>`;
    else if (is(element, 'bpmn:Association') || is(element, 'bpmn:DataInputAssociation') || is(element, 'bpmn:DataOutputAssociation'))
        out = `<path d="${d}" fill="none" stroke="${STROKE}" stroke-dasharray="1,4" stroke-linecap="round"${is(element, 'bpmn:Association') ? '' : ' marker-end="url(#open-arrow)"'}/>`;
    else
        out = `<path d="${d}" fill="none" stroke="${STROKE}" stroke-width="1.5" marker-end="url(#arrow)"/>`;
    return out;
}

function edgeLabel(edge): string {
    const element = edge.bpmnElement;
    const points = edge.waypoint || [];
    if (!element || !element.name || points.length < 2) return '';
    const lb = edge.label && edge.label.bounds;
    const mid = points[Math.floor((points.length - 1) / 2)], next = points[Math.floor((points.length - 1) / 2) + 1];
    return lb ? textBlock(element.name, lb.x + lb.width / 2, lb.y - 2, Math.max(lb.width, 60))
        : textBlock(element.name, (mid.x + next.x) / 2, (mid.y + next.y) / 2 - 18, 80);
}

function hasExternalLabel(element): boolean {
    return is(element, 'bpmn:Event') || is(element, 'bpmn:Gateway') ||
        is(element, 'bpmn:DataObjectReference') || is(element, 'bpmn:DataObject') || is(element, 'bpmn:DataStoreReference');
}

/**
 * Wraps a visual the way bpmn-js exports it, so instance decorations and the replay animation
 * (public/javascripts/SVGHelper.js) find elements by data-element-id.
 */
function element(id: string, kind: 'shape' | 'connection', visual: string, transform = ''): string {
    if (!visual) return '';
    return `<g class="djs-group"><g class="djs-element djs-${kind}" data-element-id="${esc(id)}"${transform ? ` transform="${transform}"` : ''}>` +
        `<g class="djs-visual">${visual}</g></g></g>`;
}

function extend(box, x: number, y: number) {
    box.minX = Math.min(box.minX, x); box.minY = Math.min(box.minY, y);
    box.maxX = Math.max(box.maxX, x); box.maxY = Math.max(box.maxY, y);
}

/** Returns SVG markup for the model's first diagram, or null when it has no diagram information. */
export async function bpmnToSvg(xml: string): Promise<string | null> {
    const { rootElement } = await new BpmnModdle().fromXML(xml);
    const plane = rootElement && rootElement.diagrams && rootElement.diagrams[0] && rootElement.diagrams[0].plane;
    const items = (plane && plane.planeElement) || [];
    if (!items.length) return null;

    const box = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    const containers: string[] = [], shapes: string[] = [], edges: string[] = [], labels: string[] = [];
    for (const item of items) {
        if (is(item, 'bpmndi:BPMNEdge')) {
            (item.waypoint || []).forEach(p => extend(box, p.x, p.y));
            const id = item.bpmnElement ? item.bpmnElement.id : item.id;
            edges.push(element(id, 'connection', edgeSvg(item)));
            labels.push(element(id + '_label', 'shape', edgeLabel(item)));
        }
        else if (is(item, 'bpmndi:BPMNShape') && item.bounds) {
            const b = item.bounds;
            extend(box, b.x, b.y);
            extend(box, b.x + b.width, b.y + b.height);
            if (item.label && item.label.bounds)
                extend(box, item.label.bounds.x + item.label.bounds.width, item.label.bounds.y + item.label.bounds.height);
            else if (is(item.bpmnElement, 'bpmn:Event') || is(item.bpmnElement, 'bpmn:Gateway'))
                extend(box, b.x + b.width / 2, b.y + b.height + 40);
            const el = item.bpmnElement;
            const isContainer = is(el, 'bpmn:Participant') || is(el, 'bpmn:Lane') ||
                (is(el, 'bpmn:SubProcess') && item.isExpanded !== false && b.width > 150);
            const id = el ? el.id : item.id;
            (isContainer ? containers : shapes).push(element(id, 'shape', shapeSvg(item), `matrix(1 0 0 1 ${b.x} ${b.y})`));
            if (el && hasExternalLabel(el))
                labels.push(element(id + '_label', 'shape', externalLabel(item, el, b)));
        }
    }
    if (!isFinite(box.minX)) return null;

    const pad = 20;
    const x = Math.floor(box.minX - pad), y = Math.floor(box.minY - pad);
    const width = Math.ceil(box.maxX - box.minX + 2 * pad), height = Math.ceil(box.maxY - box.minY + 2 * pad);
    return `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${x} ${y} ${width} ${height}">` +
        `<defs><marker id="arrow" viewBox="0 0 20 20" refX="11" refY="10" markerWidth="10" markerHeight="10" orient="auto">` +
        `<path d="M1 5L11 10L1 15Z" fill="${STROKE}"/></marker>` +
        `<marker id="open-arrow" viewBox="0 0 20 20" refX="11" refY="10" markerWidth="10" markerHeight="10" orient="auto">` +
        `<path d="M1 5L11 10L1 15" fill="white" stroke="${STROKE}"/></marker></defs>` +
        containers.join('') + edges.join('') + shapes.join('') + labels.join('') + `</svg>`;
}
