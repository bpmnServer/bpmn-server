import { Behaviour } from './Behaviour.js';
import { IOBehaviour } from './IOBehaviour.js';
import type { Item } from '../../engine/Item.js';

/**
 * camunda:connector on a service-task-like element: the connector's operation (`<connector>/<operationId>`, see
 * work/connectors.md) and its own input/output parameters, which make the call's input and map its output (the
 * response) back to the data, as a task's camunda:inputOutput does. The task runs it (ServiceTask.run).
 *
 * ```xml
 *  <camunda:connector>
 *    <camunda:connectorId>crm/findCustomer</camunda:connectorId>
 *    <camunda:inputOutput>
 *      <camunda:inputParameter name="email">${data.email}</camunda:inputParameter>
 *      <camunda:outputParameter name="customer">${output}</camunda:outputParameter>
 *    </camunda:inputOutput>
 *  </camunda:connector>
 * ```
 */
class ConnectorBehaviour extends Behaviour {
    // declare: set by init(), which the base constructor calls; a plain field would reset them after it (define semantics)
    declare connectorId: string;
    declare io: IOBehaviour | null;

    init() {
        const children: any[] = this.definition['$children'] ?? [];
        // the moddle with the camunda extension gives properties; the generic one, $children
        this.connectorId = String(this.definition.connectorId ?? children.find(c => c.$type === 'camunda:connectorId')?.$body ?? '').trim();
        const io = this.definition.inputOutput ?? children.find(c => c.$type === 'camunda:inputOutput');
        this.io = io ? new IOBehaviour(this.node, io) : null;
    }

    async enter(item: Item) {
        if (!item.input) item.input = {};
        await this.io?.enter(item);
    }

    async exit(item: Item) {
        await this.io?.exit(item);
    }

    describe() {
        return [['Connector', this.connectorId], ...(this.io ? this.io.describe() : [])];
    }
}

export { ConnectorBehaviour };
