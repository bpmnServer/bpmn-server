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
exports.Docs = void 0;
const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
const FS = require('fs');
const __1 = require("..");
const common_1 = require("./common");
/* GET users listing. */
const url = 'https://raw.githubusercontent.com/ralphhanna/bpmn-server/master/';
const https = require('https');
function getRemoteFile(file) {
    return new Promise(resolve => {
        https.get(url + file, (resp) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                //console.log(data);
                resolve(data);
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    });
}
const awaitAppDelegateFactory = (middleware) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield middleware(req, res, next);
        }
        catch (err) {
            next(err);
        }
    });
};
class Docs extends common_1.Common {
    config() {
        var router = express.Router();
        router.get('/', function (request, response) {
            let fileName = '../README.md';
            return processFile(fileName, response);
        });
        router.get('/api/*/:fileName', awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log('from docs');
            console.log(request.params);
            let folder = '';
            if (request.params[0])
                folder = request.params[0] + '/';
            console.log(folder);
            let fileName = 'api/' + folder + request.params.fileName;
            return processFile(fileName, response);
        })));
        router.get('/api/:fileName', awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log('from docs');
            console.log(request.params);
            let fileName = 'api/' + request.params.fileName;
            return processFile(fileName, response);
        })));
        router.get('/examples/:fileName', awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log('from docs');
            console.log(request.params);
            let fileName = 'examples/' + request.params.fileName;
            return processFile(fileName, response);
        })));
        router.get('/:fileName', awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log('from docs');
            console.log(request.params);
            let fileName = request.params.fileName;
            return processFile(fileName, response);
        })));
        router.get('/readme_md', awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let processName = request.params.process;
            let fileName = __dirname + '/../node_modules/bpmn-server/README.md';
            let file = FS.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
            response.send(file);
        })));
        return router;
    }
}
exports.Docs = Docs;
function processFile(fileName, response) {
    fileName = __1.docsFolder + fileName;
    let file = FS.readFileSync(fileName);
    if (fileName.endsWith('.png')) {
        console.log('.png');
        //            response.header("Content-Type", "image/png");
        //            response.send(file);
        response.writeHead(200, { 'Content-Type': 'image/png' });
        response.end(file, 'binary');
        return;
    }
    else if (fileName.endsWith('.gif')) {
        response.header("Content-Type", "image/gif");
        response.send(file);
    }
    else {
        response.render('docs', { md: file });
    }
}
function show(output) {
    return output;
}
exports.default = router;
//# sourceMappingURL=docs.js.map