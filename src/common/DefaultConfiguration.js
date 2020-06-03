"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfiguration = void 0;
const server_1 = require("../server");
const DefaultHandler_1 = require("./DefaultHandler");
let definitionsPath = __dirname + '/processes/';
var defaultConfiguration = {
    definitionsPath: definitionsPath,
    definitions: new server_1.ModelsDatastore(definitionsPath),
    appDelegate: new DefaultHandler_1.DefaultHandler(),
    database: {
        MongoDB: {
            db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
            db: 'test'
        }
    },
};
exports.defaultConfiguration = defaultConfiguration;
//# sourceMappingURL=DefaultConfiguration.js.map