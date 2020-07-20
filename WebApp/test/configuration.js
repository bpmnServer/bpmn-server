"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const __1 = require("../");
const appDelegate_1 = require("./appDelegate");
const __2 = require("../");
const __3 = require("../");
let definitionsPath = __dirname + '/../processes/';
var configuration = new __1.Configuration({
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
    logger: function (server) {
        new __3.Logger(server);
    },
    definitions: function (server) {
        return new __1.ModelsDatastore(server);
    },
    appDelegate: function (server) {
        return new appDelegate_1.MyAppDelegate(server);
    },
    dataStore: function (server) {
        return new __2.DataStore(server);
    }
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map