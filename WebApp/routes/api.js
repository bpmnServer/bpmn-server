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
const configuration_1 = require("../configuration");
const bpmnServer = new __1.BPMNServer(configuration_1.configuration);
const definitions = bpmnServer.definitions;
var caseId = Math.floor(Math.random() * 10000);
/* GET users listing. */
console.log("api.ts");
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
    config() {
        var router = express.Router();
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
                items = yield bpmnServer.dataStore.findItems(query);
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
                instances = yield bpmnServer.dataStore.findInstances(query, 'full');
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instances });
        })));
        router.post('/engine/start/:name?', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let name = request.params.name;
                if (!name)
                    name = request.body.name;
                console.log(' starting ' + name);
                console.log(request.body);
                let data = request.body.data;
                let startNodeId, options = {};
                if (request.body.startNodeId) {
                    startNodeId = request.body.startNodeId;
                }
                if (request.body.options) {
                    options = request.body.options;
                }
                let context;
                console.log(data);
                context = yield bpmnServer.engine.start(name, data, startNodeId, null, options);
                response.json(context.instance);
            }
            catch (exc) {
                response.json({ error: exc.toString() });
            }
        })));
        router.put('/engine/invoke', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            let query, data;
            if (request.body.query) {
                query = request.body.query;
            }
            if (request.body.data) {
                data = request.body.data;
            }
            console.log(query);
            let context;
            let instance;
            let errors;
            try {
                context = yield bpmnServer.engine.invoke(query, data);
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
        /*
         *      response = await bpmn.engine.throwMessage(messageId,data);
        */
        router.post('/engine/throwMessage', loggedIn, awaitAppDelegateFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                let messageId = request.body.messageId;
                console.log(' MessageId ' + messageId);
                let data = request.body.data;
                let context;
                console.log(data);
                context = yield bpmnServer.engine.throwMessage(messageId, data);
                response.json(context.instance);
            }
            catch (exc) {
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
                let messageId = request.body.messageId;
                console.log(' Signal Id: ' + messageId);
                let data = request.body.data;
                let context;
                console.log(data);
                context = yield bpmnServer.engine.throwSignal(messageId, data);
                response.json(context.instance);
            }
            catch (exc) {
                response.json({ error: exc.toString() });
            }
        })));
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
                result = yield bpmnServer.dataStore.deleteInstances(query);
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
                yield bpmnServer.cache.shutdown();
                let output = ['Complete ' + instanceId];
                console.log(" deleted");
                display(res, 'Show', output);
            });
        });
        router.get('/restart', loggedIn, function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                let instanceId = req.query.id;
                yield bpmnServer.cache.restart();
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
function displayError(res, error) {
    return __awaiter(this, void 0, void 0, function* () {
        let msg = '';
        if (typeof error === 'object') {
            if (error.message) {
                //            msg += error.message;
                msg += '<br/>Error Message: ' + error.message;
            }
            if (error.stack) {
                msg += '<br/>Stacktrace:';
                msg += '<br/>====================<br/>';
                msg += error.stack.split('\n').join('<br/>');
            }
        }
        else {
            msg += error;
        }
        res.send(msg);
    });
}
function display(res, title, output, logs = [], items = []) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(" Display Started");
        var instances = yield bpmnServer.dataStore.findInstances({}, 'full');
        let waiting = yield bpmnServer.dataStore.findItems({ items: { status: 'wait' } });
        waiting.forEach(item => {
            item.fromNow = __1.dateDiff(item.startedAt);
        });
        let engines = bpmnServer.cache.list();
        engines.forEach(engine => {
            engine.fromNow = __1.dateDiff(engine.startedAt);
            engine.fromLast = __1.dateDiff(engine.lastAt);
        });
        instances.forEach(item => {
            item.fromNow = __1.dateDiff(item.startedAt);
            if (item.endedAt)
                item.endFromNow = __1.dateDiff(item.endedAt);
            else
                item.endFromNow = '';
        });
        res.render('index', {
            title: title, output: output,
            engines,
            procs: bpmnServer.definitions.getList(),
            debugMsgs: [],
            waiting: waiting,
            instances,
            logs, items
        });
    });
}
function show(output) {
    return output;
}
function instanceDetails(response, instanceId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield bpmnServer.dataStore.loadInstance(instanceId);
        //    let items = await bpmnServer.findItems({ id : instanceId });
        const instance = result.instance;
        let logs = instance.logs;
        let svg = null;
        try {
            svg = yield definitions.getSVG(instance.name);
        }
        catch (ex) {
        }
        const lastItem = result.items[result.items.length - 1];
        const def = yield bpmnServer.definitions.load(instance.name);
        yield def.load();
        const defJson = def.getJson();
        let output = ['View Process Log'];
        output = show(output);
        let vars = [];
        Object.keys(instance.data).forEach(function (key) {
            let value = instance.data[key];
            if (Array.isArray(value))
                value = JSON.stringify(value);
            if (typeof value === 'object' && value !== null)
                value = JSON.stringify(value);
            vars.push({ key, value });
        });
        let decorations = JSON.stringify(calculateDecorations(result.items));
        response.render('InstanceDetails', {
            instance, vars,
            title: 'Instance Details',
            logs, items: result.items, svg,
            decorations, definition: defJson, lastItem
        });
    });
}
function getFields(processName, elementId) {
    return __awaiter(this, void 0, void 0, function* () {
        let definition = yield bpmnServer.definitions.load(processName);
        let node = definition.getNodeById(elementId);
        let extName = __1.Behaviour_names.CamundaFormData;
        console.log("ext name:" + extName);
        let ext = node.getBehaviour(extName);
        if (ext) {
            console.log('fields:' + ext.fields.length);
            return ext.fields;
        }
        else
            return null;
    });
}
function calculateDecorations(items) {
    let decors = [];
    let seq = 1;
    items.forEach(item => {
        let color = 'red';
        if (item.status == 'end')
            color = 'black';
        let decor = { id: item.elementId, color, seq };
        decors.push(decor);
        seq++;
    });
    return decors;
}
exports.default = router;
//# sourceMappingURL=api.js.map