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
const definitions = configuration_1.configuration.definitions;
const bpmnServer = new __1.BPMNServer(configuration_1.configuration);
var caseId = Math.floor(Math.random() * 10000);
/* GET users listing. */
const awaitHandlerFactory = (middleware) => {
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
    router.get('/', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let output = [];
        output = show(output);
        display(response, 'Show', output);
    })));
    var test;
    router.get('/example', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        /* Testing only
         *
        */
        let file = '../tests/bpmn-engine/getFields.js';
        if (test)
            delete require.cache[require.resolve(file)];
        test = require(file);
        //        const test = require('../examples/example.js');
        /* */
    })));
    /*
     *  3 methods for execute:
     *      get: /execute       fires execute without input
     *      get: /executeInput  redirect to executeInput page -> call post: execute
     *      post:/execute       from form with input data
     *
     */
    router.get('/executeInput/:processName', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let processName = request.params.processName;
        response.render('executeInput', { processName });
    })));
    router.get('/execute/:processName', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let processName = request.params.processName;
        let execution = yield bpmnServer.execute(processName, { user: 'Ralph' }, { caseId: caseId++ });
        if (execution.error) {
            displayError(response, execution.error);
        }
        let instance = execution.instance;
        console.log(" insance id " + instance.id);
        response.redirect('/instanceDetails?id=' + instance.id);
        /*
        let output = ['run ' + processName];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems({}));
        */
    })));
    router.post('/execute', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(request.body);
        let process = request.body.processName;
        let data = {};
        parseField(request.body.field1, request.body.value1, data);
        parseField(request.body.field2, request.body.value2, data);
        parseField(request.body.field3, request.body.value3, data);
        console.log(data);
        data['caseId'] = caseId++;
        let execution = yield bpmnServer.execute(process, { user: 'Ralph' }, data);
        if (execution.error) {
            displayError(response, execution.error);
        }
        let instance = execution.instance;
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
    router.get('/resetData', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        yield bpmnServer.deleteData();
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
    router.get('/invokeItem', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
        let result = yield bpmnServer.invoke(id, {}, {});
        console.log("redirecting");
        response.redirect('/instanceDetails?id=' + result.instance.id);
        /*
        let output = ['save' + id];
        display(response, 'Save Instance', output); */
    })));
    router.post('/invokeItem', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
        let result = yield bpmnServer.invoke(id, 'rhanna', data);
        let instance;
        //instance= result.instance;
        response.redirect('/instanceDetails?id=' + result.instance.id);
        /*
        let output = ['save' + id];
        display(response, 'Save Instance', output); */
    })));
    router.get('/mocha', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const mocha = require('../node_modules/mocha/bin/mocha');
    })));
    router.get('/run/:process', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let process = request.params.process;
        let execution = yield bpmnServer.execute(process, { user: 'Ralph' }, { caseId: caseId++ });
        if (execution.error) {
            displayError(response, execution.error);
        }
        let instance = execution.instance;
        console.log(" insance id " + instance.id);
        let output = ['run ' + process];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems({}));
    })));
    router.get('/instanceDetails', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        let imageId = request.query.id;
        console.log("id: " + imageId);
        yield instanceDetails(response, imageId);
    })));
    router.get('/about', function (request, response) {
        response.render('about');
    });
    router.get('/deleteInstance', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let instanceId = req.query.id;
            yield bpmnServer.deleteData(instanceId);
            let output = ['Complete ' + instanceId];
            console.log(" deleted");
            display(res, 'Show', output);
        });
    });
    router.get('/shutdown', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let instanceId = req.query.id;
            yield bpmnServer.shutdown();
            let output = ['Complete ' + instanceId];
            console.log(" deleted");
            display(res, 'Show', output);
        });
    });
    router.get('/restart', function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let instanceId = req.query.id;
            yield bpmnServer.restart();
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
        var instances = yield bpmnServer.findInstances({});
        let waiting = yield bpmnServer.findItems({ status: 'wait' }); // ({ name: 'Approval', claimId: 5000 });
        waiting.forEach(item => {
            item.fromNow = __1.dateDiff(item.startedAt);
        });
        let engines = __1.BPMNServer.getLives();
        engines.forEach(engine => {
            engine.fromNow = __1.dateDiff(engine.instance.startedAt);
            engine.fromLast = __1.dateDiff(engine.instance.lastAt);
        });
        instances.forEach(item => {
            item.fromNow = __1.dateDiff(item.startedAt);
            if (item.endedAt)
                item.endFromNow = __1.dateDiff(item.endedAt);
            else
                item.endFromNow = '';
        });
        console.log("waiting " + waiting.length);
        res.render('index', {
            title: title, output: output,
            engines,
            procs: definitions.getList(),
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
        let elements = yield definitions.getElements(instance.name);
        /*
    
        instance.items=items;
    
        let view = new InstanceViewer();
        view.display(request, response,instance,svg);
    
        return;  */
        let output = ['View Process Log'];
        output = show(output);
        let vars = [];
        Object.keys(instance.data).forEach(function (key) {
            let value = instance.data[key];
            if (Array.isArray(value))
                value = JSON.stringify(value);
            vars.push({ key, value });
        });
        let decorations = JSON.stringify(calculateDecorations(result.items));
        response.render('InstanceDetails', {
            instance, vars,
            title: 'Instance Details',
            logs, items: result.items, svg,
            decorations, elements
        });
    });
}
function getFields(processName, elementId) {
    return __awaiter(this, void 0, void 0, function* () {
        let definition = yield bpmnServer.loadDefinition(processName);
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
//# sourceMappingURL=index.js.map