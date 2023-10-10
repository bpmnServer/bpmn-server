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
var USER_ROLE;
(function (USER_ROLE) {
    USER_ROLE["SYSTEM"] = "SYSTEM";
    USER_ROLE["ADMIN"] = "ADMIN";
    USER_ROLE["USER"] = "USER";
})(USER_ROLE || (exports.USER_ROLE = USER_ROLE = {}));
class Request {
    constructor(server, userId, role, tenantId = null) {
        this.server = server;
        this.userId = userId;
        this.role = role;
        this.tenantId = tenantId;
        this.engine = new RequestEngine(this);
        this.datastore = new RequestDatastore(this);
        this.definitions = new RequestDefinitions(this);
    }
    addInstanceQuery(query) {
        if (this.tenantId)
            query['tenantId'] = this.tenantId;
        if (this.role == USER_ROLE.USER)
            query['items.candidate_users'] = this.userId;
        return query;
    }
    addModelQuery(query) {
        return query;
    }
}
exports.Request = Request;
class RequestEngine {
    constructor(request) {
        this.request = request;
    }
    start(name, data = {}, startNodeId = null, userId = null, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.engine.start(name, data, startNodeId, userId, options);
        });
    }
    invoke(query, data = {}, userId = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.engine.invoke(query, data, userId);
        });
    }
    assign(query, data, userId, assignment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.engine.assign(query, data, userId, assignment);
        });
    }
    throwMessage(messageId, data, messageMatchingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.engine.throwMessage(messageId, data, messageMatchingKey);
        });
    }
    throwSignal(signalId, data, messageMatchingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.engine.throwSignal(signalId, data, messageMatchingKey);
        });
    }
    get(instanceQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.engine.get(instanceQuery);
        });
    }
    startEvent(instanceId, elementId, data = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.engine.startEvent(instanceId, elementId, data);
        });
    }
}
class RequestDatastore {
    constructor(request) {
        this.request = request;
    }
    findItems(query) {
        return this.request.server.dataStore.findItems(query);
    }
    findInstances(query) {
        return this.request.server.dataStore.findInstances(query);
    }
    deleteInstances(query) {
        return this.request.server.dataStore.deleteInstances(query);
    }
}
class RequestDefinitions {
    constructor(request) {
        this.request = request;
    }
    save(name, source, svg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request.server.definitions.save(name, source, svg, this.request.tenantId);
        });
    }
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (this.request.tenantId)
                query['owner'] = this.request.tenantId;
            return yield this.request.server.definitions.getList(query);
        });
    }
    delete(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.definitions.delete(name, this.request.tenantId);
        });
    }
    rename(name, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.definitions.rename(name, newName, this.request.tenantId);
        });
    }
    load(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.definitions.load(name, this.request.tenantId);
        });
    }
    getSource(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request.server.definitions.getSource(name, this.request.tenantId);
        });
    }
}
//# sourceMappingURL=Request.js.map