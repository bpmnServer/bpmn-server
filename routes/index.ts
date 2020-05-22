/*
 * GET home page.
 */
import express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')

const FS = require('fs');



import { BPMNServer } from '../src/BPMNServer';
import { Modeller } from '../views/Modeller';
import { InstanceViewer } from '../views/InstanceViewer';
const config = require('../configuration.js').configuration;
const Timer = require('../src/timer.js');


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

        let execution = await bpmnServer.execute(processName, { user: 'Ralph' }, { caseId: caseId++ });
        if (execution.error) {
            displayError(response, execution.error);
        }


        let instance = execution.instance;
        console.log(" insance id " + instance.id);

        response.redirect('/instanceDetails?id=' + instance.id);
        /*
        let output = ['run ' + processName];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems());
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
     
        let execution = await bpmnServer.execute(process, { user: 'Ralph' } ,data);
        if (execution.error) {
            displayError(response, execution.error);
        }
        let instance = execution.instance;

        response.redirect('/instanceDetails?id=' + instance.id);
        /*
        console.log(" insance id " + instance.id);
        let output = ['run ' + process];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems()); */
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

        let item = await bpmnServer.dataStore.findItem({ id: id });

        if (item.inputFields && item.inputFields.length > 0) {
            response.render('invokeItem', {
                item 
            });
            return;
        }

        let result = await bpmnServer.invoke({ id: id }, {}, {});
           let instance;
        //instance= result.instance;

        response.redirect('/instanceDetails?id=' + result.instance.id);
        /*
        let output = ['save' + id];
        display(response, 'Save Instance', output); */
    }));
    router.post('/invokeItem', awaitHandlerFactory(async (request, response) => {

        let id = request.body.itemId;
        let data = {};

        Object.entries(request.body).forEach(entry => {
            if (entry[0] == 'itemId') { }
            else {
                data[entry[0]] = entry[1];
            }
        });

        console.log(data);
        
        let result = await bpmnServer.invoke({ id: id }, {}, data);
        let instance;
        //instance= result.instance;

        response.redirect('/instanceDetails?id=' + result.instance.id);
        /*
        let output = ['save' + id];
        display(response, 'Save Instance', output); */
    }));


    router.get('/mocha', awaitHandlerFactory(async (request, response) => {

        const mocha = require('../node_modules/mocha/bin/mocha');
    }));

    router.get('/run/:process', awaitHandlerFactory(async (request, response) => {
        let process = request.params.process;
        let execution = await bpmnServer.execute(process, {user: 'Ralph'}, { caseId: caseId++ });
        if (execution.error) {
            displayError(response,execution.error);
        }
        let instance = execution.instance;
        console.log(" insance id " + instance.id);
        let output = ['run ' + process];
        output = show(output);
        display(response, 'Run Prcesses', output, instance.logs, instance.getItems());
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
        item.fromNow = Timer.dateDiff(item.startAt);
    });

    let engines = BPMNServer.getLives();

    engines.forEach(engine => {
        engine.fromNow = Timer.dateDiff(engine.instance.startAt); 
        engine.fromLast = Timer.dateDiff(engine.instance.lastAt); 
        });

    instances.forEach(item => {
        item.fromNow = Timer.dateDiff(item.startAt);
        if (item.endAt)
            item.endFromNow = Timer.dateDiff(item.endAt);
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
    let instances = await bpmnServer.findInstances({ id: instanceId });
    let items = await bpmnServer.findItems({ instanceId: instanceId });

    
    let instance;
    if (instances.length > 0)
        instance = instances[0];
    else
        return false;

    let logs = instance.logs;
    let svg = null;
    try {
        svg = await definitions.getSVG(instance.name);

    }
    catch (ex) {

    }

    let elements = await definitions.getElements(instance.name);

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
        vars.push({ key, value });
    });

    let decorations = JSON.stringify(calculateDecorations(items));

    console.log(decorations);

    response.render('InstanceDetails',
        {
            instance, vars,
            title: 'Instance Details',
            logs, items, svg,
            decorations , elements

        });

}
function calculateDecorations(items) {
    let decors = [];
    let seq = 1;
    items.forEach(item => {
        let color = 'red';
        if (item.status == 'end')
            color = 'black';
        let decor = { id: item.taskId, color, seq };
        decors.push(decor);
        seq++;
    });
    return decors;

}
export default router;
