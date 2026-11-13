import { BPMNAdminAPI, SecureUser } from '../../index.js';
import { ViewHelper } from '../ViewHelper.js';
import { CaseAccess } from '../caseAccess.js';
import { invokeDecision } from '../decisions.js';
import { assertModelAcceptable, checkModel } from '../../runtime/modelVerification.js';

/*
 * The API's operations, once (docs/design/api-v3.md): each takes the user it acts as and its input, and answers its
 * result or throws. No HTTP here: where the input comes from and how the answer is shaped is each version's
 * (routes/api.ts is v1, routes/api2.ts v2). The rules are BPMNAPI's, with the user: a user made with
 * enforceSecurity false (v1's) passes every query through unchanged, as v1 always did.
 */

/** A user named by the caller, with no security rules: what /api (v1) acts as until its door is changed. */
export function unrestrictedUser(userName?: string): SecureUser {
    return new SecureUser({ userName, userGroups: [], tenantId: null, modelsOwner: null } as any, { enforceSecurity: false });
}

export interface EngineInput { data?: any; options?: any }

export class Operations {
    // the administration API: reading and changing models; each change still asks the user (canModifyModel)
    readonly api: BPMNAdminAPI;
    constructor(readonly server) {
        this.api = new BPMNAdminAPI(server);
    }

    // ---- the server and its data

    status() {
        return this.server.status();
    }
    findItems(user: SecureUser, query) {
        return this.api.data.findItems(query ?? {}, user);
    }
    findInstances(user: SecureUser, query, projection: any = 'full') {
        return this.api.data.findInstances(query ?? {}, user, projection);
    }
    /** A page of instances, as the store finds them (system only: its filter is not narrowed to the user). */
    find(user: SecureUser, { filter = {}, projection = { name: 1, status: 1, data: 1, items: { elementId: 1, seq: 1, type: 1, status: 1 } },
        after, limit = 10, sort = { '_id': -1 }, lastItem = {}, latestItem = {}, getTotalCount = false }: any = {}) {
        return this.server.dataStore.find({ filter, projection, after, limit: Number.parseInt(limit), sort, lastItem, latestItem, getTotalCount });
    }
    /** An item's element, its form fields, and its instance's data. */
    async fieldInfo(user: SecureUser, itemId: string, elementId: string) {
        const [instance] = await this.api.data.findInstances({ 'items.id': itemId }, user, 'full');
        const definition = await this.server.definitions.loadFromInstance(instance);
        const { node, fields } = definition.getNodeInfo(elementId);
        // the element refers to its definition and back: each object once
        const seen = [];
        const plainNode = JSON.parse(JSON.stringify(node, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (seen.includes(value)) return;
                seen.push(value);
            }
            return value;
        }));
        return { node: plainNode, fields, data: ViewHelper.formatData(instance.data) };
    }
    deleteInstances(user: SecureUser, query) {
        return this.api.data.deleteInstances(query, user);
    }

    // ---- the engine

    start(user: SecureUser, name: string, { data, options = {} }: EngineInput = {}) {
        return this.api.engine.start(name, data, user, options);
    }
    /** The case's security policy may refuse giving the task to someone else (CaseAccess.requireAssignment). */
    async assign(user: SecureUser, query, data, assignment, options = {}) {
        await new CaseAccess(this.server).requireAssignment(user, query, assignment);
        return this.api.engine.assign(query, data, assignment, user, options);
    }
    invoke(user: SecureUser, query, { data, options }: EngineInput = {}) {
        return this.api.engine.invoke(query, data, user, options);
    }
    startEvent(user: SecureUser, instanceId: string, startNodeId: string, { data, options }: EngineInput = {}) {
        return this.api.engine.startEvent(instanceId, startNodeId, data, user, options);
    }
    restart(user: SecureUser, query, { data, options }: EngineInput = {}) {
        return this.api.engine.restart(query, data, user, options);
    }
    /** An instance, through the engine (its live copy if this server runs it). */
    get(user: SecureUser, query) {
        return this.server.engine.get(user.qualifyInstances(query ?? {}));
    }
    throwMessage(user: SecureUser, messageId: string, data, messageMatchingKey = {}, options = {}) {
        return this.api.engine.throwMessage(messageId, data, messageMatchingKey, user, options);
    }
    throwSignal(user: SecureUser, signalId: string, data, messageMatchingKey = {}, options = {}) {
        return this.api.engine.throwSignal(signalId, data, messageMatchingKey, user, options);
    }
    upgrade(user: SecureUser, model: string, nodeIds: string[]) {
        return this.api.engine.upgrade(model, nodeIds, user);
    }

    // ---- models, read

    listModels(user: SecureUser, query = {}) {
        return this.api.model.list(query, user);
    }
    findEvents(user: SecureUser, query = {}) {
        return this.api.model.findEvents(query, user);
    }
    findStartEvents(user: SecureUser, query = {}) {
        return this.api.model.findStartEvents(query, user);
    }
    /** A model's BPMN XML; throws when there is none. */
    modelSource(user: SecureUser, name: string) {
        return this.api.model.getSource(name, user);
    }
    /** A model as the engine reads it (JSON). */
    async modelJson(user: SecureUser, name: string) {
        const definition = await this.server.definitions.load(name);
        return JSON.parse(definition.getJson());
    }
    /** A model checked, without saving it: errors and warnings. */
    async verifyModel(user: SecureUser, name: string | undefined, source: string) {
        const check = await checkModel(this.server, name ?? 'model', source, 'warn');
        return { name: name ?? null, valid: check.errors.length === 0, errors: check.errors, warnings: check.warnings };
    }

    // ---- models, changed (a model with errors is refused: assertModelAcceptable throws, sendModelRejection answers it)

    /** Saves a model; false when this user may not change it. */
    async saveModel(user: SecureUser, name: string, source: string, svg = null) {
        await assertModelAcceptable(this.server, name, source);
        return this.api.model.save(name, source, svg, user);
    }
    renameModel(user: SecureUser, name: string, newName: string) {
        return this.api.model.rename(name, newName, user);
    }
    deleteModel(user: SecureUser, name: string) {
        return this.api.model.delete(name, user);
    }

    // ---- decisions

    invokeRules(user: SecureUser, input) {
        return invokeDecision(this.server, input);
    }
}
