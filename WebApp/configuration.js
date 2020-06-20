"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const _1 = require("./");
const appDelegate_1 = require("./appDelegate");
const _2 = require("./");
const _3 = require("./");
const _4 = require("./");
let definitionsPath = __dirname + '/processes/';
var configuration = new _1.Configuration({ definitionsPath: definitionsPath,
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
    logger: _4.Logger,
    definitions: _1.ModelsDatastore,
    appDelegate: new appDelegate_1.MyAppDelegate(this),
    dataStore: _2.DataStore,
    eventsRegistry: _3.EventsRegistry //class
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map