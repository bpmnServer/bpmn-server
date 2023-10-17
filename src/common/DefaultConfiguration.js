"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = exports.Configuration = void 0;
const ModelsDatastore_1 = require("../datastore/ModelsDatastore");
const DefaultAppDelegate_1 = require("../engine/DefaultAppDelegate");
const __1 = require("../..");
const _1 = require("./");
let definitionsPath = __dirname + '/processes/';
class Configuration {
    definitions(server) {
        return new ModelsDatastore_1.ModelsDatastore(server);
    }
    appDelegate(server) {
        return new DefaultAppDelegate_1.DefaultAppDelegate(server);
    }
    dataStore(server) {
        return new __1.DataStore(server);
    }
    cacheManager(server) {
        return new __1.NoCacheManager(server);
    }
    constructor({ definitionsPath, templatesPath, timers, database, apiKey, logger, definitions, appDelegate, dataStore, cacheManager }) {
        this.definitionsPath = definitionsPath;
        this.templatesPath = templatesPath;
        this.timers = timers;
        this.database = database;
        this.apiKey = apiKey;
        this.logger = logger;
        this.definitions = definitions;
        this.appDelegate = appDelegate;
        this.dataStore = dataStore;
        this.cacheManager = cacheManager;
    }
}
exports.Configuration = Configuration;
var defaultConfiguration = new Configuration({
    definitionsPath: definitionsPath,
    templatesPath: __dirname + '/emailTemplates',
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
    apiKey: '1234',
    logger: function (server) {
        new _1.Logger(server);
    },
    definitions: function (server) {
        return new ModelsDatastore_1.ModelsDatastore(server);
    },
    appDelegate: function (server) {
        return new DefaultAppDelegate_1.DefaultAppDelegate(server);
    },
    dataStore: function (server) {
        return new __1.DataStore(server);
    },
    cacheManager: function (server) {
        return new __1.NoCacheManager(server);
    }
});
exports.defaultConfiguration = defaultConfiguration;
//# sourceMappingURL=DefaultConfiguration.js.map