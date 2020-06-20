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
const __1 = require("../");
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
    router.get('/', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let output = [];
        output = show(output);
        display(response, 'Show', output);
    })));
    /*
     *  3 methods for execute:
     *      get: /execute       fires execute without input
     *      get: /executeInput  redirect to executeInput page -> call post: execute
     *      post:/execute       from form with input data
     *
     */
    router.get('/start/:processName', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let processName = request.params.processName;
        console.log(request.params);
        let data = {};
        if (request.query.data) {
            console.log(data);
            data = JSON.parse(request.query.data);
        }
        if (request.query) {
            data = request.query;
        }
        console.log('changes2');
        console.log(data);
        data['caseId'] = caseId++;
        let context = yield bpmnServer.engine.start(processName, data);
        response.json(context);
    })));
    router.post('/execute', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(request.body);
        let process = request.body.processName;
        let data = {};
        parseField(request.body.field1, request.body.value1, data);
        parseField(request.body.field2, request.body.value2, data);
        let startNodeId = request.body.startNodeId;
        console.log(data);
        data['caseId'] = caseId++;
        let context = yield bpmnServer.engine.start(process, data, null, startNodeId);
        if (context.errors) {
            displayError(response, context.errors);
        }
        let instance = context.execution;
        response.redirect('/instanceDetails?id=' + instance.id);
        /*
        console.log(" insance id " + instance.id);
        let output = ['run ' + process];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems({})); */
    })));
    function parseField(field, value, data) {
        if (field) {
            if (value.substring(0, 1) == '[') {
                value = value.substring(1);
                value = value.substring(0, value.length - 1);
                console.log('array' + value);
                let array = value.split(',');
                value = array;
            }
            data[field] = value;
        }
    }
    router.get('/listDefinitions', function (req, res) {
        let output = ['Data Reset'];
        output = show(output);
        display(res, 'Show', output);
    });
    router.get('/resetData', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        yield bpmnServer.dataStore.deleteData();
        console.log(" Data Reset");
        let output = ['Data Reset'];
        output = show(output);
        display(response, 'Show', output);
    })));
    router.get('/refresh', function (req, res) {
        let output = [];
        output = show(output);
        display(res, 'Show', output);
    });
    router.get('/clearDebug', function (req, res) {
        //    Logger.clear();
        let output = [];
        output = show(output);
        display(res, 'Show', output);
    });
    router.get('/invokeItem', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let id = request.query.id;
        let processName = request.query.processName;
        let elementId = request.query.elementId;
        let fields = yield getFields(processName, elementId);
        if (fields && fields.length > 0) {
            response.render('invokeItem', {
                id, fields, processName, elementId
            });
            return;
        }
        let result = yield bpmnServer.engine.invoke({ items: { id: id } }, {});
        console.log("redirecting");
        response.redirect('/instanceDetails?id=' + result.execution.id);
        /*
        let output = ['save' + id];
        display(response, 'Save Instance', output); */
    })));
    router.post('/invokeItem', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('invoke');
        console.log(request.body);
        let id = request.body.itemId;
        let data = {};
        console.log(id);
        Object.entries(request.body).forEach(entry => {
            if (entry[0] == 'itemId') { }
            else {
                data[entry[0]] = entry[1];
            }
        });
        console.log(data);
        let result = yield bpmnServer.engine.invoke({ items: { id: id } }, data);
        response.redirect('/instanceDetails?id=' + result.execution.id);
    })));
    router.get('/mocha', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const mocha = require('../node_modules/mocha/bin/mocha');
    })));
    router.get('/run/:process', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let process = request.params.process;
        let context = yield bpmnServer.engine.start(process, { caseId: caseId++ });
        if (context.errors) {
            displayError(response, context.errors);
        }
        let instance = context.execution;
        console.log(" insance id " + instance.id);
        let output = ['run ' + process];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.items);
    })));
    router.get('/instanceDetails', awaitAppDelegateFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let imageId = request.query.id;
        console.log("id: " + imageId);
        yield instanceDetails(response, imageId);
    })));
    router.get('/deleteInstance', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let instanceId = req.query.id;
            yield bpmnServer.dataStore.deleteData(instanceId);
            let output = ['Complete ' + instanceId];
            console.log(" deleted");
            display(res, 'Show', output);
        });
    });
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
        var instances = yield bpmnServer.dataStore.findInstances({});
        let waiting = yield bpmnServer.dataStore.findItems({ items: { status: 'wait' } });
        waiting.forEach(item => {
            item.fromNow = __1.dateDiff(item.startedAt);
        });
        let engines = bpmnServer.cache.getList();
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
//# sourceMappingURL=engine.js.map