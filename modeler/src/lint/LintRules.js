// The team's modeling rules: the level of each bpmnlint rule, changed for every designer (GET and PUT
// config.lint.url: bpmnlint.json in the models folder). A Rules dialog (config.lint.button opens it) lists every
// rule with its default level and documentation; a finding in Problems can turn its rule off. Fires
// 'lintRules.changed' when the levels change, and Problems checks the model again.
import { ruleDefaults } from './lint.js';

const LEVELS = [['off', 'Off'], ['info', 'Information'], ['warn', 'Warning'], ['error', 'Error']];

export default class LintRules {
    constructor(config, eventBus) {
        this._config = config || {};
        this._eventBus = eventBus;
        /** { '<rule>': level }: what the team changed */
        this.overrides = {};
        this.loaded = this._config.url ? this.load() : Promise.resolve();
        document.querySelector(this._config.button)?.addEventListener('click', () => this.open());
    }

    async load() {
        try {
            const response = await fetch(this._config.url);
            this.overrides = response.ok ? (await response.json()).rules || {} : {};
        } catch {
            this.overrides = {};
        }
    }

    /** A rule's level for everyone; the rule's default level clears the change. */
    async setLevel(name, level) {
        const defaults = Object.fromEntries(ruleDefaults().map(r => [r.name, r.level]));
        const rules = { ...this.overrides };
        if (level === defaults[name]) delete rules[name];
        else rules[name] = level;
        await this.save(rules);
    }

    async save(rules) {
        const response = await fetch(this._config.url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rules })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok)
            throw new Error(result.errors || response.statusText);
        this.overrides = result.rules || {};
        this._eventBus.fire('lintRules.changed', { rules: this.overrides });
    }

    /** The Rules dialog: every rule, its level (changed ones marked) and documentation. */
    open() {
        document.getElementById('js-lint-rules')?.remove();
        const dialog = document.createElement('dialog');
        dialog.id = 'js-lint-rules';
        dialog.className = 'lint-rules';
        const title = document.createElement('h2');
        title.textContent = 'Modeling rules';
        const note = document.createElement('p');
        note.textContent = 'bpmnlint rules checked as models are edited. A change applies to every designer and to npm run lint:models.';
        const table = document.createElement('table');
        table.innerHTML = '<thead><tr><th>Rule</th><th>Level</th><th>Default</th></tr></thead>';
        const body = document.createElement('tbody');
        for (const rule of ruleDefaults()) {
            const row = document.createElement('tr');
            row.dataset.rule = rule.name;
            const changed = rule.name in this.overrides;
            if (changed) row.classList.add('changed');
            const name = document.createElement('td');
            const link = document.createElement('a');
            link.href = rule.url || '#';
            link.target = '_blank';
            link.rel = 'noopener';
            link.textContent = rule.name;
            name.append(link);
            const select = document.createElement('select');
            select.setAttribute('aria-label', `Level of ${rule.name}`);
            for (const [value, label] of LEVELS)
                select.append(new Option(label, value, false, (this.overrides[rule.name] ?? rule.level) === value));
            select.addEventListener('change', async () => {
                select.disabled = true;
                try {
                    await this.setLevel(rule.name, select.value);
                    row.classList.toggle('changed', rule.name in this.overrides);
                } catch (err) {
                    window.alert('The rule was not changed: ' + err.message);
                } finally {
                    select.disabled = false;
                }
            });
            const level = document.createElement('td');
            level.append(select);
            const byDefault = document.createElement('td');
            byDefault.className = 'default';
            byDefault.textContent = LEVELS.find(([value]) => value === rule.level)?.[1] || rule.level;
            row.append(name, level, byDefault);
            body.append(row);
        }
        table.append(body);
        const close = document.createElement('button');
        close.type = 'button';
        close.textContent = 'Close';
        close.addEventListener('click', () => dialog.close());
        dialog.addEventListener('close', () => dialog.remove());
        dialog.append(title, note, table, close);
        document.body.append(dialog);
        dialog.showModal();
    }
}

LintRules.$inject = ['config.lint', 'eventBus'];
