"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
console.log('This routine will setup bpmn-server database');
const fs = require('fs');
const cwd = process.cwd();
let configuration;
const configPath = cwd + '/configuration.js';
if (fs.existsSync(configPath)) {
    configuration = require(configPath).configuration;
    install();
}
else {
    console.log(`**Error** configuration.js file does not exist in this folder '${cwd}'**`);
    console.log("please run this script from the folder containing 'configuration.js'");
}
function install() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Installing a new Database');
        console.log('current directory is ' + process.cwd());
        console.log('Installing a new Database based on configuration in current directory');
        console.log('current directory is ' + process.cwd());
        console.log('database configuration:', configuration.database);
        const server = new _1.BPMNServer(configuration, null, { cron: false });
        const dataStore = server.dataStore;
        const modelsDataStore = server.definitions;
        try {
            yield dataStore.install();
            yield modelsDataStore.install();
        }
        catch (exc) {
            console.log(exc);
        }
        console.log('---done.');
        process.exit();
    });
}
//# sourceMappingURL=setup.js.map