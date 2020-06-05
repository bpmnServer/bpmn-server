"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const _1 = require("bpmn-server");
const handler_1 = require("./handler");
let definitionsPath = __dirname + '/processes/';
var configuration = {
    definitionsPath: definitionsPath,
    definitions: new _1.ModelsDatastore(definitionsPath),
    appDelegate: new handler_1.MyHandler(),
    database: {
        MongoDB: {
            db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
            db: 'test2'
        }
    },
};
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map