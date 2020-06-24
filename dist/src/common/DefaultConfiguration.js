"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = exports.Configuration = void 0;
const ModelsDatastoreDB_1 = require("../datastore/ModelsDatastoreDB");
const DefaultAppDelegate_1 = require("../engine/DefaultAppDelegate");
const __1 = require("../..");
const _1 = require("./");
let definitionsPath = __dirname + '/processes/';
class Configuration {
    constructor({ definitionsPath, timers, database, logger, definitions, appDelegate, dataStore }) {
        this.definitionsPath = definitionsPath;
        this.timers = timers;
        this.database = database;
        this.logger = logger;
        this.definitions = definitions;
        this.appDelegate = appDelegate;
        this.dataStore = dataStore;
    }
    definitions(server) {
        return new ModelsDatastoreDB_1.ModelsDatastoreDB(server);
    }
    appDelegate(server) {
        return new DefaultAppDelegate_1.DefaultAppDelegate(server);
    }
    dataStore(server) {
        return new __1.DataStore(server);
    }
}
exports.Configuration = Configuration;
var defaultConfiguration = new Configuration({
    definitionsPath: definitionsPath,
    timers: {
        forceTimersDelay: 1000,
        precision: 3000,
    },
    database: {
        MongoDB: {
            db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
            db: 'bpmn'
        }
    },
    logger: _1.Logger,
    definitions: ModelsDatastoreDB_1.ModelsDatastoreDB,
    appDelegate: new DefaultAppDelegate_1.DefaultAppDelegate(),
    dataStore: __1.DataStore // class	
});
exports.defaultConfiguration = defaultConfiguration;
//# sourceMappingURL=DefaultConfiguration.js.map