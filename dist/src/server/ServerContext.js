"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionContext = exports.ServerComponent = void 0;
//import { IModelsDatastore, IDataStore, IServerContext} from "../..";
/**
 * super class for various objects that are part of the server
 * */
class ServerComponent {
    constructor(server) {
        this.server = server;
    }
    get configuration() { return this.server.configuration; }
    get logger() { return this.server.logger; }
    get dataStore() { return this.server.dataStore; }
    get engine() { return this.server.engine; }
    ;
    get cron() { return this.server.cron; }
    ;
    get cache() { return this.server.cache; }
    ;
    get definitions() { return this.server.definitions; }
    get appDelegate() { return this.server.appDelegate; }
}
exports.ServerComponent = ServerComponent;
class ExecutionResponse {
}
class ExecutionContext extends ServerComponent {
    constructor(server, parentContext = null) {
        super(server);
        this.parentContext = parentContext;
        this.response = new ExecutionResponse();
        //		this.errors = [];
    }
    /*
    input;
    output;
    messageMatchingKey;
    */
    error(error) {
        return this;
    }
    get instance() {
        if (this.execution)
            return this.execution.getState();
    }
    get items() {
        if (this.execution)
            return this.execution.getItems();
    }
}
exports.ExecutionContext = ExecutionContext;
//# sourceMappingURL=ServerContext.js.map