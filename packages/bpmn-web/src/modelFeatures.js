// Where a feature appears in a model's XML, and the features a model uses (docs/features.yaml, each feature's `xml`).
// Plain JavaScript, so the repository's scripts/features.mjs uses this same code, unbuilt.
//
// A marker is a small CSS-like selector on the model's XML: `bpmn:userTask` (an element), `[camunda:formKey]` (an
// attribute), `bpmn:subProcess[triggeredByEvent=true]` (an attribute's value), `bpmn:startEvent > bpmn:timerEventDefinition`
// (directly inside), `bpmn:serviceTask camunda:connector` (inside, at any depth). Names are matched by their local part:
// a model's prefixes (bpmn:, bpmn2:, none) do not matter.

const local = name => name.slice(name.indexOf(':') + 1);

/** A model's elements as a tree: { name, attrs, children, parent }. Comments, CDATA and text are left out. */
export function parseXml(xml) {
    const root = { name: '#root', attrs: {}, children: [], parent: null };
    let at = root;
    const text = String(xml ?? '').replace(/<!--[\s\S]*?-->/g, '').replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
        .replace(/<\?[\s\S]*?\?>/g, '').replace(/<!DOCTYPE[^>]*>/gi, '');
    for (const [, closing, name, attrText, selfClosing] of text.matchAll(/<(\/?)([\w.:-]+)((?:\s+[^\s=\/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>/g)) {
        if (closing) { if (at.parent) at = at.parent; continue; }
        const attrs = {};
        // each attribute by its local name; those written with a prefix (an extension's: camunda:label) known as such
        const prefixed = new Set();
        for (const [, key, , value] of attrText.matchAll(/([^\s=]+)\s*=\s*("|')([\s\S]*?)\2/g)) {
            attrs[local(key)] = value;
            if (key.includes(':')) prefixed.add(local(key));
        }
        const element = { name: local(name), attrs, prefixed, children: [], parent: at };
        at.children.push(element);
        if (!selfClosing) at = element;
    }
    return root;
}

/** One step of a marker: an element name (or any), and the attributes it must have. */
function step(text) {
    const parsed = /^([\w.:*-]*)((?:\[[^\]]+\])*)$/.exec(text);
    if (!parsed || (!parsed[1] && !parsed[2])) throw new Error(`'${text}' is not a marker's step: an element, [an attribute], or both`);
    const [, name, attrText] = parsed;
    const attrs = [...attrText.matchAll(/\[([^\]=]+)(?:=([^\]]*))?\]/g)]
        .map(([, key, value]) => ({ key: local(key.trim()), prefixed: key.includes(':'), value: value?.trim().replace(/^["']|["']$/g, '') }));
    return { name: !name || name === '*' ? '*' : local(name), attrs };
}
const fits = (element, { name, attrs }) => (name === '*' || element.name === name)
    && attrs.every(({ key, prefixed, value }) => key in element.attrs
        // [camunda:label] is an extension's attribute: not a plain label="..." (a DMN input's, a form field's)
        && (!prefixed || element.prefixed.has(key))
        && (value === undefined || element.attrs[key] === value));

/** A marker's steps, each with how it joins the one before: ' ' (inside it) or '>' (directly inside it). */
export function parseMarker(marker) {
    const tokens = String(marker ?? '').trim().replace(/\s*>\s*/g, ' > ').split(/\s+/).filter(Boolean);
    const steps = [];
    let join = ' ';
    for (const token of tokens) {
        if (token === '>') { join = '>'; continue; }
        steps.push({ ...step(token), join });
        join = ' ';
    }
    if (!steps.length || join === '>' || steps[0].join === '>') throw new Error(`'${marker}' is not a marker`);
    return steps;
}

/** The elements of a parsed model a marker finds (its last step's). */
export function find(tree, marker) {
    const steps = parseMarker(marker);
    const all = [];
    const walk = e => { for (const c of e.children) { all.push(c); walk(c); } };
    walk(tree);
    const holds = (element, i) => {
        if (!fits(element, steps[i])) return false;
        if (i === 0) return true;
        if (steps[i].join === '>') return !!element.parent && holds(element.parent, i - 1);
        for (let up = element.parent; up; up = up.parent) if (holds(up, i - 1)) return true;
        return false;
    };
    return all.filter(e => holds(e, steps.length - 1));
}

/**
 * Where an element is in the model, for a person: the nearest element with an id (itself, or what holds it), leaving
 * out the parts of an element that have ids of their own (an event's definition, a task's loop): the event, the task.
 */
const PART = /(EventDefinition|LoopCharacteristics|Expression)$/;
export function whereIs(element) {
    for (let e = element; e; e = e.parent) if (e.attrs?.id && !PART.test(e.name)) return e.attrs.id;
    return element.name;
}

/**
 * The features a model uses: [{ id, name, at }], `at` the ids of the elements where. `features`: [{ id, name, xml }],
 * the catalog's (modelFeatureCatalog.ts in bpmn-web).
 */
export function modelFeatures(xml, features) {
    const tree = parseXml(xml);
    const used = [];
    for (const f of features) {
        const at = new Set();
        for (const marker of f.xml ?? []) for (const element of find(tree, marker)) at.add(whereIs(element));
        if (at.size) used.push({ id: f.id, name: f.name, at: [...at] });
    }
    return used;
}
