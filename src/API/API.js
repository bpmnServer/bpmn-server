"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLE = exports.API = void 0;
const __1 = require("../..");
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["SYSTEM"] = "SYSTEM";
    USER_ROLE["ADMIN"] = "ADMIN";
    USER_ROLE["USER"] = "USER";
})(USER_ROLE || (exports.USER_ROLE = USER_ROLE = {}));
class AccessManager {
    constructor(api) {
        this.api = api;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyInstances(query) {
        if (this.api.tenantId)
            query['tenantId'] = this.api.tenantId;
        if (this.api.userRole == USER_ROLE.USER)
            query['items.candidate_users'] = this.api.userId;
        return query;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyItems(query) {
        if (this.api.tenantId)
            query['tenantId'] = this.api.tenantId;
        if (this.api.userRole == USER_ROLE.USER)
            query['items.candidate_users'] = this.api.userId;
        return query;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyDeleteInstances(query) {
        if (this.api.userRole == USER_ROLE.ADMIN)
            return this.qualifyInstances(query);
        else
            return false;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyModels(query) {
        if (this.api.modelsOwner)
            query['owner'] = this.api.ModelsOwner;
        return query;
    }
    /**
     */
    canModifyModel(name) {
        if (this.api.userRole == USER_ROLE.ADMIN)
            return true;
        else
            return false;
    }
    /**
     */
    canDeleteModel(name) {
        if (this.api.userRole == USER_ROLE.ADMIN)
            return true;
        else
            return false;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyViewItems(query) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    canInvoke(item) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    canAssign(item) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    canStart(name, startNodeId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
class API {
    constructor(server, { userId, userRole, userGroup, tenantId = null, modelsOwner = null }) {
        this.server = server;
        this.userId = userId;
        this.userRole = userRole;
        this.tenantId = tenantId;
        this.modelsOwner = modelsOwner;
        this.accessManager = new AccessManager(this);
        this.engine = new Engine(this);
        this.data = new Data(this);
        this.model = new Model(this);
        const listener = this.server.listener;
        listener.on(__1.EXECUTION_EVENT.process_start, function ({ context, event }) {
            context.instance.tenantId = tenantId;
        });
    }
}
exports.API = API;
class APIComponent {
    constructor(api) {
        this.api = api;
    }
    get server() {
        return this.api.server;
    }
    get accessManager() {
        return this.api.accessManager;
    }
    get userId() {
        return this.api.userId;
    }
    get tenantId() {
        return this.api.tenantId;
    }
    get modelsOwner() {
        return this.api.modelsOwner;
    }
}
class Engine extends APIComponent {
    start(name, data = {}, startNodeId = null, userId = null, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.engine.start(name, data, startNodeId, this.userId, options);
        });
    }
    invoke(query, data = {}, userId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            query = this.accessManager.qualifyItems(query);
            return yield this.server.engine.invoke(query, data, this.userId);
        });
    }
    assign(query, data, userId, assignment) {
        return __awaiter(this, void 0, void 0, function* () {
            query = this.accessManager.qualifyItems(query);
            return yield this.server.engine.assign(query, data, this.userId, assignment);
        });
    }
    throwMessage(messageId, data, messageMatchingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.engine.throwMessage(messageId, data, messageMatchingKey);
        });
    }
    throwSignal(signalId, data, messageMatchingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.engine.throwSignal(signalId, data, messageMatchingKey);
        });
    }
    startEvent(query, elementId, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.engine.startEvent(query, elementId, data);
        });
    }
}
class Data extends APIComponent {
    findItems(query) {
        return __awaiter(this, void 0, void 0, function* () {
            query = this.accessManager.qualifyInstances(query);
            return yield this.server.dataStore.findItems(query);
        });
    }
    findInstances(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            query = this.accessManager.qualifyInstances(query);
            return yield this.server.dataStore.findInstances(query, options);
        });
    }
    deleteInstances(query) {
        return __awaiter(this, void 0, void 0, function* () {
            query = this.accessManager.qualifyDeleteInstances(query);
            return yield this.server.dataStore.deleteInstances(query);
        });
    }
}
class Model extends APIComponent {
    saveModel(name, source, svg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.definitions.save(name, source, svg, this.modelsOwner);
        });
    }
    listModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (this.tenantId)
                query['owner'] = this.modelsOwner;
            console.log(query);
            return yield this.server.definitions.getList(query);
        });
    }
    findEvents(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.definitions.findEvents(query, this.modelsOwner);
        });
    }
    deleteModel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.accessManager.canDeleteModel(name);
            return yield this.server.definitions.deleteModel(name, this.modelsOwner);
        });
    }
    renameModel(name, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.accessManager.canModifyModel(name);
            return yield this.server.definitions.renameModel(name, newName, this.modelsOwner);
        });
    }
    getModel(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.server.definitions.getSource(name, this.modelsOwner);
        });
    }
}
//# sourceMappingURL=API.js.map