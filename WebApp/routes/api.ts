import express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')
//import { ExecuteDecisionTable, ExecuteCondition, ExecuteExpression } from 'dmn-engine';

const FS = require('fs');

import { BPMNServer, dateDiff, Behaviour_names   } from '..';
import { configuration as config} from '../configuration';

const bpmnServer = new BPMNServer(config);

const definitions = bpmnServer.definitions;

var caseId = Math.floor(Math.random() * 10000);

/* GET users listing. */

console.log("api.ts");

const awaitAppDelegateFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

function loggedIn(req, res, next) {

    let apiKey = req.header('x-api-key');

    if (!apiKey) {
        apiKey= req.query.apiKey;
    }

    if (apiKey == process.env.API_KEY) {  
        next();
    } else {
        res.json({ errors: 'missing or invalid "x-api-key"'});
    }
}
import { Common } from './common';

export class API extends Common {
    config() {

        var router = express.Router();

        router.get('/datastore/findItems', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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
                items = await bpmnServer.dataStore.findItems(query);
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, items });
        }));

        router.get('/datastore/findInstances', loggedIn, awaitAppDelegateFactory(async (request, response) => {


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

                instances = await bpmnServer.dataStore.findInstances(query, 'full');
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instances });
        }));

        router.post('/engine/start/:name?', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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
                context = await bpmnServer.engine.start(name, data, startNodeId, null, options);
                response.json(context.instance);
            }
            catch (exc) {
                response.json({ error: exc.toString() });
            }
        }));

        router.put('/engine/invoke', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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
                context = await bpmnServer.engine.invoke(query, data );
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

        router.get('/engine/get', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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
                context = await bpmnServer.engine.get(query);
                instance = context.instance;
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instance });
        }));


        /*
         *      response = await bpmn.engine.throwMessage(messageId,data);
        */
        router.post('/engine/throwMessage', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            try {
                let messageId = request.body.messageId;
                console.log(' MessageId ' + messageId);
                let data = request.body.data;
                let context;
                console.log(data);

                context = await bpmnServer.engine.throwMessage(messageId, data);
                response.json(context.instance);
            }
            catch (exc) {
                response.json({ error: exc.toString() });
            }
        }));


/*
 *  engine.throwSignal     - issue a signal by id
 *  ------------------
 *      same as message except multiple receipients
 *
 *
 *
 */

        router.post('/engine/throwSignal', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            try {
                let messageId = request.body.messageId;
                console.log(' Signal Id: ' + messageId);
                let data = request.body.data;
                let context;
                console.log(data);
                context = await bpmnServer.engine.throwSignal(messageId, data);
                response.json(context.instance);
            }
            catch (exc) {
                response.json({ error: exc.toString() });
            }
        }));


        router.get('/definitions/list', loggedIn, async function (req, response) {

            let list = await bpmnServer.definitions.getList();
            console.log(list);
            response.json(list);
        });
        router.get('/definitions/load/:name?', loggedIn, async function (request, response) {

            console.log(request.params);
            let name = request.params.name;

            let definition = await bpmnServer.definitions.load(name);
            response.json(JSON.parse(definition.getJson()));
        });

        router.delete('/datastore/deleteInstances', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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
                result = await bpmnServer.dataStore.deleteInstances(query);
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, result });

        }));

        router.get('/shutdown', loggedIn, async function (req, res) {

            let instanceId = req.query.id;

            await bpmnServer.cache.shutdown();

            let output = ['Complete ' + instanceId];
            console.log(" deleted");
            display(res, 'Show', output);
        });
        router.get('/restart', loggedIn, async function (req, res) {

            let instanceId = req.query.id;

            await bpmnServer.cache.restart();

            let output = ['Complete ' + instanceId];
            console.log(" deleted");
            display(res, 'Show', output);
        });
        router.put('/rules/invoke', loggedIn, awaitAppDelegateFactory(async (request, response) => {
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
        }));

        return router;
    }
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
