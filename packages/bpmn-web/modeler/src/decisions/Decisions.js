// The decision files of the models folder (GET config.decisions.url), read in the browser: their decisions,
// inputs, outputs and rules, for the properties panel and the Report. A business rule task names one as
// bpmn-server finds it (DMNEngine.find): a file `<name>.dmn.xml`, or a decision with that id, exactly or else
// case aside. Fires 'decisions.changed' when the files are read; they are read again when the page gets the
// focus back, so a table saved in the decision editor's tab shows here.

const DMN_TEXT = el => (child(el, 'text')?.textContent || '').trim();
const children = (el, name) => el ? [...el.children].filter(c => c.localName === name) : [];
const child = (el, name) => children(el, name)[0];

/** A DMN file's decisions, as the engine reads them (DMNParser). */
export function parseDecisions(xml) {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const root = doc.documentElement;
    if (!root || root.localName !== 'definitions' || doc.getElementsByTagName('parsererror').length)
        throw new Error('not a DMN file');
    return children(root, 'decision').map(d => {
        const decision = {
            id: d.getAttribute('id') || '',
            name: d.getAttribute('name') || d.getAttribute('id') || '',
            requires: children(d, 'informationRequirement').map(r => (child(r, 'requiredDecision')?.getAttribute('href') || '').replace(/^.*#/, '')).filter(Boolean)
        };
        const table = child(d, 'decisionTable');
        const literal = child(d, 'literalExpression');
        if (table) {
            const hitPolicy = (table.getAttribute('hitPolicy') || 'UNIQUE').toUpperCase();
            decision.table = {
                hitPolicy,
                aggregation: (table.getAttribute('aggregation') || '').toUpperCase() || undefined,
                inputs: children(table, 'input').map(i => ({
                    label: i.getAttribute('label') || '',
                    expression: DMN_TEXT(child(i, 'inputExpression')) || i.getAttribute('label') || '',
                    typeRef: child(i, 'inputExpression')?.getAttribute('typeRef') || ''
                })),
                outputs: children(table, 'output').map((o, n) => ({
                    name: o.getAttribute('name') || o.getAttribute('label') || `output${n + 1}`,
                    label: o.getAttribute('label') || '',
                    typeRef: o.getAttribute('typeRef') || ''
                })),
                rules: children(table, 'rule').map(r => ({
                    description: (child(r, 'description')?.textContent || '').trim(),
                    inputs: children(r, 'inputEntry').map(DMN_TEXT),
                    outputs: children(r, 'outputEntry').map(DMN_TEXT)
                }))
            };
        } else if (literal) {
            const variable = child(d, 'variable');
            decision.literal = { text: DMN_TEXT(literal), variable: variable?.getAttribute('name') || decision.name };
        }
        return decision;
    });
}

/** The decision a file is for: the first one no other decision of the file requires. */
export function topDecision(decisions) {
    const required = new Set(decisions.flatMap(d => d.requires));
    return decisions.find(d => !required.has(d.id)) || decisions[0];
}

export default class Decisions {
    constructor(config, eventBus) {
        this._eventBus = eventBus;
        this._url = config?.url;
        /** [{ name, file, decisions, error }] */
        this.files = [];
        /** the policies of the models folder, by kind (assignment, security): [{ name, file, decisions, error }]; securityOn */
        this.policies = { assignment: [], security: [], securityOn: false };
        this.loaded = false;
        this.load();
        window.addEventListener('focus', () => this.load());
    }

    async load() {
        if (!this._url)
            return;
        try {
            const response = await fetch(this._url);
            const { decisions, policies } = response.ok ? await response.json() : { decisions: [] };
            const parsed = ({ name, file, xml }) => {
                try {
                    return { name, file, decisions: parseDecisions(xml) };
                } catch (err) {
                    return { name, file, decisions: [], error: err.message };
                }
            };
            this.files = (decisions || []).map(parsed);
            this.policies = { assignment: (policies?.assignment || []).map(parsed), security: (policies?.security || []).map(parsed), securityOn: !!policies?.securityOn };
        } catch {
            this.files = [];
            this.policies = { assignment: [], security: [], securityOn: false };
        }
        this.loaded = true;
        this._eventBus.fire('decisions.changed', { files: this.files });
    }

    /** A policy of a kind (assignment, security) by its name: { file, decision }, or null. */
    findPolicy(kind, name) {
        const file = name ? (this.policies[kind] || []).find(f => f.name === name) : null;
        return file ? { file, decision: topDecision(file.decisions) } : null;
    }

    /** What a business rule task's camunda:decisionRef names: { file, decision }, or null. */
    find(ref) {
        if (!ref)
            return null;
        for (const same of [(a, b) => a === b, (a, b) => a.toLowerCase() === b.toLowerCase()]) {
            const file = this.files.find(f => same(f.name, ref));
            if (file)
                return { file, decision: file.decisions.find(d => same(d.id, ref)) || topDecision(file.decisions) };
            for (const f of this.files) {
                const decision = f.decisions.find(d => same(d.id, ref));
                if (decision)
                    return { file: f, decision };
            }
        }
        return null;
    }

    /** The values a decisionRef can take: each file, and each decision of a file that has several. */
    choices() {
        return this.files.flatMap(f => {
            const top = topDecision(f.decisions);
            const own = [{ value: f.name, label: top && top.name !== f.name ? `${f.name} (${top.name})` : f.name }];
            if (f.decisions.length > 1)
                own.push(...f.decisions.filter(d => d !== top).map(d => ({ value: d.id, label: `${d.id} (${d.name}, in ${f.name})` })));
            return own;
        });
    }
}

Decisions.$inject = ['config.decisions', 'eventBus'];
