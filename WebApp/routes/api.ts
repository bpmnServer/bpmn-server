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
    router.get('/datastore/findItems', awaitAppDelegateFactory(async (request, response) => {

        console.log(request.body);
        let query;
        if (request.body.query) {
            query = request.body.query;
        }

        console.log(query);
        let items;
        let errors;
        try {
            items= await bpmnServer.dataStore.findItems(query);
        }
        catch (exc) {
            errors = exc.toString();
            console.log(errors);
        }
        response.json({ errors: errors, items});
    }));

    router.get('/datastore/findInstances', awaitAppDelegateFactory(async (request, response) => {


        console.log(request.body);
        let query;
        if (request.body.query) {
            query = request.body.query;
        }

        console.log(query);
        let instances;
        let errors;
        try {
            instances = await bpmnServer.dataStore.findInstances(query,'full');
        }
        catch (exc) {
            errors = exc.toString();
            console.log(errors);
        }
        response.json({ errors: errors, instances });
    }));

    router.post('/engine/start/:name?', awaitAppDelegateFactory(async (request, response) => {

        try {
        let name = request.params.name;
        if (!name)
            name = request.body.name;
        console.log(' starting ' + name);
        console.log(request.body);
        let data = request.body.data;
        let context;
        console.log(data);
            context = await bpmnServer.engine.start(name, data);
            response.json(context.instance);
        }
        catch (exc) {
            response.json({ error: exc.toString() });
        }
    }));

    router.put('/engine/invoke', awaitAppDelegateFactory(async (request, response) => {

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
            context = await bpmnServer.engine.invoke(query, data);
            instance = context.instance;
            if (context && context.errors)
                errors = context.errors.toString();
        }
        catch (exc) {
            errors = exc.toString();
            console.log(errors);
        }
        response.json({ errors: errors, instance });


    }));

    router.get('/engine/get', awaitAppDelegateFactory(async (request, response) => {

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
            context = await bpmnServer.engine.get(query);
            instance = context.instance;
        }
        catch (exc) {
            errors = exc.toString();
            console.log(errors);
        }
        response.json({errors: errors, instance});
    }));


    router.get('/definitions/list',async function (req, response) {

        let list = await bpmnServer.definitions.getList();
         console.log(list);
        response.json(list);
    });
    router.get('/definitions/load/:name?',async function (request, response) {

        console.log(request.params);
        let name = request.params.name;

        let definition= await bpmnServer.definitions.load(name);
        response.json(JSON.parse(definition.getJson()));
    });

    router.delete('/datastore/deleteInstances', awaitAppDelegateFactory(async (request, response) => {

        console.log(request.body);
        let query;
        if (request.body.query) {
            query = request.body.query;
        }

        console.log(query);

        let errors;
        let result;
        try {
            result = await bpmnServer.dataStore.deleteInstances(query);
        }
        catch (exc) {
            errors = exc.toString();
            console.log(errors);
        }
        response.json({ errors: errors, result });

    }));

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
    var instances = await bpmnServer.dataStore.findInstances({},'full');
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
