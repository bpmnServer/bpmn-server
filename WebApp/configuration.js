"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const _1 = require("./");
const appDelegate_1 = require("./appDelegate");
const _2 = require("./");
const _3 = require("./");
let definitionsPath = __dirname + '/processes/';
var configuration = new _1.Configuration({
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
        new _3.Logger(server);
    },
    definitions: function (server) {
        return new _1.ModelsDatastoreFS(server);
    },
    appDelegate: function (server) {
        return new appDelegate_1.MyAppDelegate(server);
    },
    dataStore: function (server) {
        return new _2.DataStore(server);
    }
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map