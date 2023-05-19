"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = exports.Configuration = void 0;
const ModelsDatastore_1 = require("../datastore/ModelsDatastore");
const DefaultAppDelegate_1 = require("../engine/DefaultAppDelegate");
const __1 = require("../..");
const _1 = require("./");
const ACL_1 = require("../server/ACL");
let definitionsPath = __dirname + '/processes/';
class Configuration {
    constructor({ definitionsPath, templatesPath, timers, database, apiKey, logger, definitions, appDelegate, dataStore, IAM, ACL }) {
        this.definitionsPath = definitionsPath;
        this.templatesPath = templatesPath;
        this.timers = timers;
        this.database = database;
        this.apiKey = apiKey;
        this.logger = logger;
        this.definitions = definitions;
        this.appDelegate = appDelegate;
        this.dataStore = dataStore;
    }
    definitions(server) {
        return new ModelsDatastore_1.ModelsDatastoreDB(server);
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
    IAM: function (server) {
        return new ACL_1.IAM(server);
    },
    ACL: function (server) {
        return new ACL_1.ACL(server);
    }
});
exports.defaultConfiguration = defaultConfiguration;
//# sourceMappingURL=DefaultConfiguration.js.map