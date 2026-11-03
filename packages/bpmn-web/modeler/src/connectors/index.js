// The connectors this designer may use (GET config.connectors.url): REST APIs the administrator added, with their
// enabled operations, for a service task's Connector fields. Fires 'connectors.changed' when read; read again
// when the page gets the focus back, so a connector added in the administration tab shows here. The connector
// wizard (Wizard.jsx) sets up a task's connector.
import ConnectorWizard from './Wizard.jsx';

class Connectors {
    constructor(config, eventBus) {
        this._eventBus = eventBus;
        this._url = config?.url;
        /** [{ id, name, description, operations: [{ operationId, method, path, summary, parameters, body, outputs, errors }] }] */
        this.list = [];
        this.loaded = false;
        this.load();
        window.addEventListener('focus', () => this.load());
    }

    async load() {
        if (!this._url)
            return;
        try {
            const response = await fetch(this._url);
            this.list = response.ok ? (await response.json()).connectors ?? [] : [];
        } catch {
            this.list = [];
        }
        this.loaded = true;
        this._eventBus.fire('connectors.changed', { connectors: this.list });
    }

    /** `<connector>/<operationId>` as { connector, operation } (either missing when the server has none). */
    find(ref) {
        const slash = String(ref ?? '').indexOf('/');
        if (slash <= 0)
            return { id: '', operationId: '', connector: null, operation: null };
        const id = ref.slice(0, slash), operationId = ref.slice(slash + 1);
        const connector = this.list.find(c => c.id === id) ?? null;
        return { id, operationId, connector, operation: connector?.operations.find(o => o.operationId === operationId) ?? null };
    }
}

Connectors.$inject = ['config.connectors', 'eventBus'];

export default {
    __init__: ['connectors', 'connectorWizard'],
    connectors: ['type', Connectors],
    connectorWizard: ['type', ConnectorWizard]
};
