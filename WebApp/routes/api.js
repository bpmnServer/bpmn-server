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
const express = require("express");
const router = express.Router();
var bodyParser = require('body-parser');
const FS = require('fs');
const __1 = require("..");
const configuration_1 = require("../configuration");
const bpmnServer = new __1.BPMNServer(configuration_1.configuration);
const definitions = bpmnServer.definitions;
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
{
    router.get('/datastore/findItems', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(request.body);
        let query;
        if (request.body.query) {
            query = request.body.query;
        }
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
    router.get('/datastore/findInstances', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(request.body);
        let query;
        if (request.body.query) {
            query = request.body.query;
        }
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
    router.post('/engine/start/:name?', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let name = request.params.name;
            if (!name)
                name = request.body.name;
            console.log(' starting ' + name);
            console.log(request.body);
            let data = request.body.data;
            let context;
            console.log(data);
            context = yield bpmnServer.engine.start(name, data);
            response.json(context.instance);
        }
        catch (exc) {
            response.json({ error: exc.toString() });
        }
    })));
    router.put('/engine/invoke', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
    router.get('/engine/get', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(request.body);
        let query;
        if (request.body.query) {
            query = request.body.query;
        }
        console.log(query);
        let context;
        let instance;
        let errors;
        try {
            context = yield bpmnServer.engine.get(query);
            instance = context.instance;
        }
        catch (exc) {
            errors = exc.toString();
            console.log(errors);
        }
        response.json({ errors: errors, instance });
    })));
    router.get('/definitions/list', function (req, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = yield bpmnServer.definitions.getList();
            console.log(list);
            response.json(list);
        });
    });
    router.get('/definitions/load/:name?', function (request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.params);
            let name = request.params.name;
            let definition = yield bpmnServer.definitions.load(name);
            response.json(JSON.parse(definition.getJson()));
        });
    });
    router.delete('/datastore/deleteInstances', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(request.body);
        let query;
        if (request.body.query) {
            query = request.body.query;
        }
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
    router.get('/shutdown', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let instanceId = req.query.id;
            yield bpmnServer.cache.shutdown();
            let output = ['Complete ' + instanceId];
            console.log(" deleted");
            display(res, 'Show', output);
        });
    });
    router.get('/restart', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let instanceId = req.query.id;
            yield bpmnServer.cache.restart();
            let output = ['Complete ' + instanceId];
            console.log(" deleted");
            display(res, 'Show', output);
        });
    });
}
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