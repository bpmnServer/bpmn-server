"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const _1 = require("./");
const appDelegate_1 = require("./appDelegate");
const dotenv = require('dotenv');
const res = dotenv.config();
const templatesPath = __dirname + '/emailTemplates/';
var configuration = new _1.Configuration({
    definitionsPath: process.env.DEFINITIONS_PATH,
    templatesPath: templatesPath,
    timers: {
        //forceTimersDelay: 1000, 
        precision: 3000,
    },
    database: {
        MongoDB: {
            db_url: process.env.MONGO_DB_URL,
            db: process.env.MONGO_DB_NAME, //'bpmn'
        }
    },
    apiKey: process.env.API_KEY,
    /* Define Server Services */
    logger: function (server) {
        new _1.Logger(server);
    },
    definitions: function (server) {
        return new _1.ModelsDatastore(server);
    },
    appDelegate: function (server) {
        return new appDelegate_1.MyAppDelegate(server);
    },
    dataStore: function (server) {
        return new _1.DataStore(server);
    },
    cacheManager: function (server) {
        return new _1.NoCacheManager(server);
    }
});
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map