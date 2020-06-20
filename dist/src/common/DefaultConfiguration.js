"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = exports.Configuration = void 0;
const ModelsDatastore_1 = require("../server/ModelsDatastore");
const DefaultAppDelegate_1 = require("../engine/DefaultAppDelegate");
const __1 = require("../..");
const __2 = require("../..");
const _1 = require("./");
let definitionsPath = __dirname + '/processes/';
class Configuration {
    constructor({ definitionsPath, timers, database, logger, definitions, appDelegate, dataStore, eventsRegistry }) {
        this.definitionsPath = definitionsPath;
        this.timers = timers;
        this.database = database;
        this.logger = logger;
        this.definitions = definitions;
        this.appDelegate = appDelegate;
        this.dataStore = dataStore;
        this.eventsRegistry = eventsRegistry;
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
    definitions: ModelsDatastore_1.ModelsDatastore,
    appDelegate: new DefaultAppDelegate_1.DefaultAppDelegate(),
    dataStore: __1.DataStore,
    eventsRegistry: __2.EventsRegistry //class
});
exports.defaultConfiguration = defaultConfiguration;
//# sourceMappingURL=DefaultConfiguration.js.map