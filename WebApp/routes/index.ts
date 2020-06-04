import express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')

const FS = require('fs');

import { BPMNServer, dateDiff, Behaviour_names   } from 'bpmn-server';
import { configuration as config} from '../configuration';



const definitions = config.definitions;

const bpmnServer = new BPMNServer(config);


var caseId = Math.floor(Math.random() * 10000);



/* GET users listing. */

const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}
   {
    router.get('/', awaitHandlerFactory(async (request, response) => {
        let output = [];
        output = show(output);
        display(response, 'Show', output);
    }));

    var test;
    router.get('/example', awaitHandlerFactory(async (request, response) => {
        /* Testing only
         * 
        */
        let file = '../tests/bpmn-engine/getFields.js';
        if (test)
            delete require.cache[require.resolve(file)]

        test = require(file);
//        const test = require('../examples/example.js');

    /* */
    }));
    /*
     *  3 methods for execute:
     *      get: /execute       fires execute without input
     *      get: /executeInput  redirect to executeInput page -> call post: execute
     *      post:/execute       from form with input data
     *      
     */
    
    router.get('/executeInput/:processName', awaitHandlerFactory(async (request, response) => {
        let processName = request.params.processName;

        response.render('executeInput', { processName });
    }));


    router.get('/execute/:processName', awaitHandlerFactory(async (request, response) => {

        let processName = request.params.processName;

        let context = await bpmnServer.execute(processName, { user: 'Ralph' }, { caseId: caseId++ });

        if (context.error) {
            displayError(response, context.error);
        }


        let execution = context.execution;
        console.log(" insance id " + execution.id);

        response.redirect('/instanceDetails?id=' + execution.id);
        /*
        let output = ['run ' + processName];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems({}));
        */
    }));


    router.post('/execute', awaitHandlerFactory(async (request, response) => {

        console.log(request.body);
        let process = request.body.processName;
        let data = {};
        parseField(request.body.field1, request.body.value1, data);
        parseField(request.body.field2, request.body.value2, data);
        parseField(request.body.field3, request.body.value3, data);

        console.log(data);

        data['caseId'] = caseId++;
     
        let context = await bpmnServer.execute(process, { user: 'Ralph' } ,data);
        if (context.error) {
            displayError(response, context.error);
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

    router.get('/resetData', awaitHandlerFactory(async (request, response) => {
        await bpmnServer.deleteData();
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

    router.get('/invokeItem', awaitHandlerFactory(async (request, response) => {

        let id = request.query.id;
        let processName = request.query.processName;
        let elementId = request.query.elementId;

        let fields = await getFields(processName, elementId);

        if (fields && fields.length > 0) {
            response.render('invokeItem', {
                id , fields, processName,elementId
            });
            return;
        }

        let result = await bpmnServer.invoke(id, {}, {});

        console.log("redirecting");
        response.redirect('/instanceDetails?id=' + result.execution.id);
        /*
        let output = ['save' + id];
        display(response, 'Save Instance', output); */
    }));
    router.post('/invokeItem', awaitHandlerFactory(async (request, response) => {
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
        
        let result = await bpmnServer.invoke(id, 'rhanna', data);

        response.redirect('/instanceDetails?id=' + result.execution.id);
    }));


    router.get('/mocha', awaitHandlerFactory(async (request, response) => {

        const mocha = require('../node_modules/mocha/bin/mocha');
    }));

    router.get('/run/:process', awaitHandlerFactory(async (request, response) => {
        let process = request.params.process;
        let context = await bpmnServer.execute(process, {user: 'Ralph'}, { caseId: caseId++ });
        if (context.error) {
            displayError(response, context.error);
        }
        let instance = context.execution;
        console.log(" insance id " + instance.id);
        let output = ['run ' + process];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems({}));
    }));
    router.get('/instanceDetails', awaitHandlerFactory(async (request, response) => {

        let imageId = request.query.id;
        console.log("id: " + imageId);
        await instanceDetails(response,imageId);        

    }));
    router.get('/about', function (request, response) {

        response.render('about');
    });

    router.get('/deleteInstance',async function (req, res) {

        let instanceId = req.query.id;

        await bpmnServer.deleteData(instanceId);

        let output = ['Complete ' + instanceId];
        console.log(" deleted");
        display(res, 'Show', output);
    });
    router.get('/shutdown', async function (req, res) {

        let instanceId = req.query.id;

        await bpmnServer.shutdown();

        let output = ['Complete ' + instanceId];
        console.log(" deleted");
        display(res, 'Show', output);
    });
    router.get('/restart', async function (req, res) {

        let instanceId = req.query.id;

        await bpmnServer.restart();

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
    var instances = await bpmnServer.findInstances({});
    let waiting = await bpmnServer.findItems({ status: 'wait' }); // ({ name: 'Approval', claimId: 5000 });

    waiting.forEach(item => {
        item.fromNow = dateDiff(item.startedAt);
    });

    let engines = BPMNServer.getLives();

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

    console.log("waiting " + waiting.length);

    res.render('index',
        {
            title: title, output: output,
            engines,
            procs: definitions.getList(),
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

    let elements = await definitions.getElements(instance.name);

    const lastItem = result.items[result.items.length - 1];

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

    response.render('InstanceDetails',
        {
            instance, vars,
            title: 'Instance Details',
            logs,items: result.items, svg,
            decorations , elements , lastItem

        });

}
async function getFields(processName, elementId) {

    let definition = await bpmnServer.loadDefinition(processName);
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
