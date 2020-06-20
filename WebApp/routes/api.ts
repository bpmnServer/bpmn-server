import express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')

const FS = require('fs');

import { BPMNServer, dateDiff, Behaviour_names   } from '..';
import { configuration as config} from '../configuration';

const bpmnServer = new BPMNServer(config);

const definitions = bpmnServer.definitions;

var caseId = Math.floor(Math.random() * 10000);

/* GET users listing. */

const awaitAppDelegateFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}
   {
    router.get('/engine/get', awaitAppDelegateFactory(async (request, response) => {
        let output = [];
        output = show(output);
        response.send('hi');
    }));

    /*
     *  3 methods for execute:
     *      get: /execute       fires execute without input
     *      get: /executeInput  redirect to executeInput page -> call post: execute
     *      post:/execute       from form with input data
     *      
     */
  

    router.get('engine/get/:instanceId', awaitAppDelegateFactory(async (request, response) => {

        let instanceId = request.params.instanceId;
        console.log(request.params);


        let context = await bpmnServer.engine.get(instanceId);

        response.json(context);
    }));

    router.get('/engine/start/:processName', awaitAppDelegateFactory(async (request, response) => {

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
        let context = await bpmnServer.engine.start(processName, data);

        response.json(context);
    }));

    router.get('/engine/invoke', awaitAppDelegateFactory(async (request, response) => {

        console.log(request.query);
        let query, data;
        if (request.query.query) {
            query = request.query.query;
        }
        if (request.query.data) {
            data = request.query.data;
        }
//        let context = await bpmnServer.engine.invoke(query, data);

        response.json(request.query);
    }));



    router.post('/execute', awaitAppDelegateFactory(async (request, response) => {

        console.log(request.body);
        let process = request.body.processName;
        let data = {};
        parseField(request.body.field1, request.body.value1, data);
        parseField(request.body.field2, request.body.value2, data);

        
        let startNodeId = request.body.startNodeId

        console.log(data);

        data['caseId'] = caseId++;
     
        let context = await bpmnServer.engine.start(process,data , null,startNodeId);
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
    }));

    function parseField(field, value, data) {
        if (field) {
            if (value.substring(0, 1) == '[') {
                value = value.substring(1);
                value = value.substring(0, value.length - 1);
                console.log('array'+value );
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

    router.get('/resetData', awaitAppDelegateFactory(async (request, response) => {
        await bpmnServer.dataStore.deleteData();
        console.log(" Data Reset");
        let output = ['Data Reset'];
        output = show(output);
        display(response, 'Show', output);
    }));

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

    router.get('/invokeItem', awaitAppDelegateFactory(async (request, response) => {

        let id = request.query.id;
        let processName = request.query.processName;
        let elementId = request.query.elementId;

        let fields = await getFields(processName, elementId);

        if (fields && fields.length > 0) {
            response.render('invokeItem', {
                id, fields, processName, elementId
            });
            return;
        }

        let result = await bpmnServer.engine.invoke({ items: { id: id }}, {});

        console.log("redirecting");
        response.redirect('/instanceDetails?id=' + result.execution.id);
        /*
        let output = ['save' + id];
        display(response, 'Save Instance', output); */
    }));
    router.post('/invokeItem', awaitAppDelegateFactory(async (request, response) => {
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
        
        let result = await bpmnServer.engine.invoke({ items: { id: id } },  data);


        response.redirect('/instanceDetails?id=' + result.execution.id);
    }));


    router.get('/mocha', awaitAppDelegateFactory(async (request, response) => {

        const mocha = require('../node_modules/mocha/bin/mocha');
    }));

    router.get('/run/:process', awaitAppDelegateFactory(async (request, response) => {
        let process = request.params.process;
        let context = await bpmnServer.engine.start(process, { caseId: caseId++ });
        if (context.errors) {
            displayError(response, context.errors);
        }
        let instance = context.execution;
        console.log(" insance id " + instance.id);
        let output = ['run ' + process];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.items);
    }));
    router.get('/instanceDetails', awaitAppDelegateFactory(async (request, response) => {

        let imageId = request.query.id;
        console.log("id: " + imageId);
        await instanceDetails(response,imageId);        

    }));


    router.get('/deleteInstance',async function (req, res) {

        let instanceId = req.query.id;

        await bpmnServer.dataStore.deleteData(instanceId);

        let output = ['Complete ' + instanceId];
        console.log(" deleted");
        display(res, 'Show', output);
    });
    router.get('/shutdown', async function (req, res) {

        let instanceId = req.query.id;

        await bpmnServer.cache.shutdown();

        let output = ['Complete ' + instanceId];
        console.log(" deleted");
        display(res, 'Show', output);
    });
    router.get('/restart', async function (req, res) {

        let instanceId = req.query.id;

        await bpmnServer.cache.restart();

        let output = ['Complete ' + instanceId];
        console.log(" deleted");
        display(res, 'Show', output);
    });
}
async function displayError(res, error) {
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
    } else {
        msg +=error;
    }
    res.send(msg);

}
async function display(res, title, output, logs = [], items = []) {

    console.log(" Display Started");
    var instances = await bpmnServer.dataStore.findInstances({});
    let waiting = await bpmnServer.dataStore.findItems({ items: { status: 'wait' } }); 

    waiting.forEach(item => {
        item.fromNow = dateDiff(item.startedAt);
    });

    let engines = bpmnServer.cache.list();

    engines.forEach(engine => {
        engine.fromNow = dateDiff(engine.startedAt); 
        engine.fromLast = dateDiff(engine.lastAt); 
        });

    instances.forEach(item => {
        item.fromNow = dateDiff(item.startedAt);
        if (item.endedAt)
            item.endFromNow = dateDiff(item.endedAt);
        else
            item.endFromNow = '';
    });

    res.render('index',
        {
            title: title, output: output,
            engines,
            procs: bpmnServer.definitions.getList(),
            debugMsgs: [], // Logger.get(),
            waiting: waiting,
            instances,
            logs, items
        });

}
function show(output) {
    return output;
}
async function instanceDetails(response,instanceId) {
    let result = await bpmnServer.dataStore.loadInstance(instanceId);
//    let items = await bpmnServer.findItems({ id : instanceId });
    const instance = result.instance;

    let logs = instance.logs;
    let svg = null;
    try {
        svg = await definitions.getSVG(instance.name);

    }
    catch (ex) {

    }

    const lastItem = result.items[result.items.length - 1];

    const def = await bpmnServer.definitions.load(instance.name);
    await def.load();
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

    response.render('InstanceDetails',
        {
            instance, vars,
            title: 'Instance Details',
            logs,items: result.items, svg,
            decorations , definition:defJson, lastItem
        });

}
async function getFields(processName, elementId) {

    let definition = await bpmnServer.definitions.load(processName);
    let node = definition.getNodeById(elementId);
    let extName = Behaviour_names.CamundaFormData;
    console.log("ext name:" + extName);
    let ext = node.getBehaviour(extName);
    if (ext) {
        console.log('fields:' + ext.fields.length);
        return ext.fields;
    }
    else
        return null;
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
export default router;
