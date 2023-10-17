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
exports.USER_ROLE = exports.Request = void 0;
const __1 = require("../..");
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["SYSTEM"] = "SYSTEM";
    USER_ROLE["ADMIN"] = "ADMIN";
    USER_ROLE["USER"] = "USER";
})(USER_ROLE || (USER_ROLE = {}));
exports.USER_ROLE = USER_ROLE;
class AccessManager {
    constructor(request) {
        this.request = request;
    }
    qualifyInstances(query) {
        if (this.request.tenantId)
            query['tenantId'] = this.request.tenantId;
        if (this.request.role == USER_ROLE.USER)
            query['items.candidate_users'] = this.request.userId;
        return query;
    }
    qualifyItems(query) {
        if (this.request.tenantId)
            query['tenantId'] = this.request.tenantId;
        if (this.request.role == USER_ROLE.USER)
            query['items.candidate_users'] = this.request.userId;
        return query;
    }
    canDeleteInstances(query) {
        if (this.request.role == USER_ROLE.ADMIN)
            return this.qualifyInstances(query);
        else
            return false;
    }
    qualifyModels(query) {
        if (this.request.modelsOwner)
            query['owner'] = this.request.ModelsOwner;
        return query;
    }
    canView(query) {
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
    canDelete(query) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    canModifyModel(name) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    canDeleteModel(name) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
class Request {
    constructor(server, userId, role, tenantId = null, modelsOwner = null) {
        this.server = server;
        this.userId = userId;
        this.role = role;
        this.tenantId = tenantId;
        this.modelsOwner = modelsOwner;
        this.accessManager = new AccessManager(this);
        const listener = this.server.listener;
        listener.on(__1.EXECUTION_EVENT.process_start, function ({ context, event }) {
            context.instance.tenantId = tenantId;
        });
    }
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
            query = this.accessManager.canDeleteInstances(query);
            return yield this.server.dataStore.deleteInstances(query);
        });
    }
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
exports.Request = Request;
//# sourceMappingURL=Request.js.map