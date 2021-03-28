"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerComponent = void 0;
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
//# sourceMappingURL=ServerComponent.js.map