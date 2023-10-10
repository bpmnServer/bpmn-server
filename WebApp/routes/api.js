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
exports.API = void 0;
const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
//import { ExecuteDecisionTable, ExecuteCondition, ExecuteExpression } from 'dmn-engine';
const FS = require('fs');
const __1 = require("..");
//const bpmnServer = new BPMNServer(config);
//const definitions = bpmnServer.definitions;
var caseId = Math.floor(Math.random() * 10000);
/* GET users listing. */
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
function loggedIn(req, res, next) {
    let apiKey = req.header('x-api-key');
    if (!apiKey) {
        apiKey = req.query.apiKey;
    }
    if (apiKey == process.env.API_KEY) {
        next();
    }
    else {
        res.json({ errors: 'missing or invalid "x-api-key"' });
    }
}
const common_1 = require("./common");
class API extends common_1.Common {
    get bpmnServer() { return this.webApp.bpmnServer; }
    config() {
        var router = express.Router();
        var bpmnServer = this.bpmnServer;
        router.get('/datastore/findItems', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            let query;
            if (request.body.query) {
                query = request.body.query;
            }
            else
                query = request.body;
            console.log(query);
            let items;
            let errors;
            try {
                items = yield this.bpmnServer.dataStore.findItems(query);
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, items });
        })));
        router.get('/datastore/findInstances', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            let query;
            if (request.body.query) {
                query = request.body.query;
            }
            else
                query = request.body;
            console.log(query);
            let instances;
            let errors;
            try {
                instances = yield this.bpmnServer.dataStore.findInstances(query, 'full');
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instances });
        })));
        /*
        returns list of current instances running or ended
         */
        router.get('/engine/status', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                var list = [];
                __1.CacheManager.liveInstances.forEach(exec => {
                    list.push({ instance: exec.instance, currentItem: exec.item.id, currentElement: exec.item.elementId, status: exec.instance.status });
                });
                response.json(list);
            }
            catch (exc) {
                response.json({ error: exc.toString() });
            }
        })));
        router.post('/engine/start/:name?', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let name = request.params.name;
                if (!name)
                    name = request.body.name;
                console.log(' starting ' + name);
                console.log(request.body);
                let data = request.body.data;
                let startNodeId, options = {}, userId;
                if (request.body.startNodeId) {
                    startNodeId = request.body.startNodeId;
                }
                if (request.body.options) {
                    options = request.body.options;
                }
                if (options['userId'] !== undefined) {
                    userId = options['userId'];
                }
                else if (request.body.userId) {
                    userId = request.body.userId;
                }
                let context;
                console.log(data, userId);
                context = yield this.bpmnServer.engine.start(name, data, startNodeId, userId, options);
                response.json(context.instance);
            }
            catch (exc) {
                response.json({ error: exc.toString() });
            }
        })));
        ///
        router.put('/engine/assign', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            let query, data, userId, assignment;
            if (request.body.query) {
                query = request.body.query;
            }
            if (request.body.data) {
                data = request.body.data;
            }
            if (request.body.assignment) {
                assignment = request.body.assignment;
            }
            if (request.body.userId) {
                userId = request.body.userId;
            }
            console.log(query);
            let context;
            let instance;
            let errors;
            try {
                context = yield this.bpmnServer.engine.assign(query, data, userId, assignment);
                instance = context.instance;
                if (context && context.errors)
                    errors = context.errors.toString();
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instance });
        })));
        ///
        router.put('/engine/invoke', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log('---------invoke', request.body);
            let query, data, userId, options;
            if (request.body.query) {
                query = request.body.query;
            }
            if (request.body.data) {
                data = request.body.data;
            }
            if (request.body.options) {
                options = request.body.options;
            }
            if (request.body.userId) {
                userId = request.body.userId;
            }
            let context;
            let instance;
            let errors;
            try {
                context = yield this.bpmnServer.engine.invoke(query, data, userId, options);
                instance = context.instance;
                if (context && context.errors)
                    errors = context.errors.toString();
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instance });
        })));
        router.get('/engine/get', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let query;
            if (request.body.query) {
                query = request.body.query;
            }
            else
                query = request.body;
            console.log("Query", query);
            let context;
            let instance;
            let errors;
            try {
                context = yield this.bpmnServer.engine.get(query);
                instance = context.instance;
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instance });
        })));
        /*
         *      response = await bpmn.engine.throwMessage(messageId,data);
        */
        router.post('/engine/throwMessage', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let messageId = request.body.messageId;
                console.log(' MessageId ' + messageId);
                let data = request.body.data;
                let messageMatchingKey = {};
                if (request.body.messageMatchingKey)
                    messageMatchingKey = request.body.messageMatchingKey;
                let context;
                console.log(data);
                context = yield this.bpmnServer.engine.throwMessage(messageId, data, messageMatchingKey);
                if (context)
                    response.json(context.instance);
                else
                    response.json({});
            }
            catch (exc) {
                console.log(exc);
                response.json({ error: exc.toString() });
            }
        })));
        /*
         *  engine.throwSignal     - issue a signal by id
         *  ------------------
         *      same as message except multiple receipients
         *
         *
         *
         */
        router.post('/engine/throwSignal', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let signalId = request.body.signalId;
                console.log(' Signal Id: ' + signalId);
                let data = request.body.data;
                let messageMatchingKey = {};
                if (request.body.messageMatchingKey)
                    messageMatchingKey = request.body.messageMatchingKey;
                let context;
                context = yield this.bpmnServer.engine.throwSignal(signalId, data, messageMatchingKey);
                response.json(context);
            }
            catch (exc) {
                console.log(exc);
                response.json({ error: exc.toString() });
            }
        })));
        ////
        var fsx = require('fs-extra'); //File System - for file manipulation
        router.post('/definitions/import/:name?', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let name = request.params.name;
            if (!name)
                name = request.body.name;
            console.log(' importing: ' + name);
            //console.log('request', request);
            console.log('request.body', request.body);
            var fstream;
            var files = [];
            try {
                if (request.busboy) {
                    request.pipe(request.busboy);
                    request.busboy.on('file', function (fileUploaded, file, filename) {
                        // no longer writing to tmp
                        //Path where image will be uploaded
                        //const filepath = __dirname + '/../tmp/' + filename.filename;
                        var contents = '';
                        file.on('data', (data) => {
                            contents += data;
                            console.log(`File [${filename.filename}] got ${data.length} bytes`);
                        }).on('close', () => {
                            console.log(`File [${filename.filename}] done`);
                            files.push(contents);
                        });
                        //                        file.pipe(fsx.createWriteStream(filepath));
                        //                        const fileC= fsx.readFileSync(filepath,{ encoding: 'utf8', flag: 'r' });
                        //                        files.push(fileC);
                    });
                    request.busboy.on('finish', function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            var bpmnFile, svgFile = null;
                            bpmnFile = files[0];
                            if (files.length > 1)
                                svgFile = files[1];
                            try {
                                yield bpmnServer.definitions.save(name, bpmnFile, svgFile);
                            }
                            catch (exc) {
                                console.log('error in api.ts import ', exc.message, exc);
                                response.json({ errors: exc.message });
                                return;
                            }
                            response.json("OK");
                        });
                    });
                }
                else {
                    response.json("No file to import");
                }
            }
            catch (exc) {
                console.log('request.pipe error:', exc);
                response.json(exc);
            }
        })));
        router.post('/definitions/rename', loggedIn, function (req, response) {
            return __awaiter(this, void 0, void 0, function* () {
                let name = req.body.name;
                let newName = req.body.newName;
                console.log('renaming ', name, newName);
                try {
                    var ret = yield bpmnServer.definitions.renameModel(name, newName);
                    console.log('ret:', ret);
                    response.json(ret);
                }
                catch (exc) {
                    console.log('error:', exc);
                    response.json({ errors: exc });
                }
            });
        });
        router.post('/definitions/delete', loggedIn, function (req, response) {
            return __awaiter(this, void 0, void 0, function* () {
                let name = req.body.name;
                console.log('deleting ', name);
                try {
                    var ret = yield bpmnServer.definitions.deleteModel(name);
                    console.log('ret: ', ret);
                    response.json(ret);
                }
                catch (exc) {
                    console.log('error:', exc);
                    response.json({ errors: exc.toString() });
                }
            });
        });
        router.get('/definitions/list', loggedIn, function (req, response) {
            return __awaiter(this, void 0, void 0, function* () {
                let list = yield bpmnServer.definitions.getList();
                console.log(list);
                response.json(list);
            });
        });
        router.get('/definitions/load/:name?', loggedIn, function (request, response) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(request.params);
                let name = request.params.name;
                let definition = yield bpmnServer.definitions.load(name);
                response.json(JSON.parse(definition.getJson()));
            });
        });
        router.delete('/datastore/deleteInstances', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let query;
            if (request.body.query) {
                query = request.body.query;
            }
            else
                query = request.body;
            console.log(query);
            let errors;
            let result;
            try {
                result = yield this.bpmnServer.dataStore.deleteInstances(query);
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, result });
        })));
        router.get('/shutdown', loggedIn, function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let instanceId = req.query.id;
                yield this.bpmnServer.cache.shutdown();
                let output = ['Complete ' + instanceId];
                console.log(" deleted");
                display(res, 'Show', output);
            });
        });
        router.get('/restart', loggedIn, function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let instanceId = req.query.id;
                yield this.bpmnServer.cache.restart();
                let output = ['Complete ' + instanceId];
                console.log(" deleted");
                display(res, 'Show', output);
            });
        });
        router.put('/rules/invoke', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            /*
             *
             *
        export async function WebService(request, response) {
        console.log(request);
        console.log(response);
        let { definition, data, options, loadFrom } = request.body;
        response.json(Execute(request.body));
    }
             */
            try {
                throw new Error("Decision Table not supported this release.");
                // await response.json(ExecuteDecisionTable(request.body));
                //await WebService(request, response);
            }
            catch (exc) {
                console.log(exc);
                response.json({ errors: JSON.stringify(exc, null, 2) });
            }
        })));
        return router;
    }
}
exports.API = API;
function display(res, title, output, logs = [], items = []) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(" Display Started");
        var instances = yield this.bpmnServer.dataStore.findInstances({}, 'full');
        let waiting = yield this.bpmnServer.dataStore.findItems({ items: { status: 'wait' } });
        waiting.forEach(item => {
            item.fromNow = (0, __1.dateDiff)(item.startedAt);
        });
        let engines = this.bpmnServer.cache.list();
        engines.forEach(engine => {
            engine.fromNow = (0, __1.dateDiff)(engine.startedAt);
            engine.fromLast = (0, __1.dateDiff)(engine.lastAt);
        });
        instances.forEach(item => {
            item.fromNow = (0, __1.dateDiff)(item.startedAt);
            if (item.endedAt)
                item.endFromNow = (0, __1.dateDiff)(item.endedAt);
            else
                item.endFromNow = '';
        });
        res.render('index', {
            title: title, output: output,
            engines,
            procs: this.bpmnServer.definitions.getList(),
            debugMsgs: [],
            waiting: waiting,
            instances,
            logs, items
        });
    });
}
exports.default = router;
//# sourceMappingURL=api.js.map