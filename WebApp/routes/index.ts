import express = require('express');

const FS = require('fs');

import { BPMNServer, dateDiff, Behaviour_names   } from '../';
import { Common } from './common';


var caseId = Math.floor(Math.random() * 10000);
var userId;


const docsFolder = __dirname + '/../bpmnServer/docs/';

// main functions

function awaitAppDelegateFactory (middleware) {
    return async (req, res, next) => {
        try {
            if (req.query.userId && typeof (req.query.userId) !=='undefined' && req.query.userId !=='undefined') {
                req.session.userId = req.query.userId;
            }
            else if (!req.session.userId)
                req.session.userId = 'demoUser';


            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}
//   
var bpmnServer;
var definitions;

export class Workflow extends Common {

    config() {
        var router = express.Router();

        bpmnServer = this.webApp.bpmnServer;
        definitions = bpmnServer.definitions;

        router.get('/home', home);
        router.get('/', awaitAppDelegateFactory(async (request, response) => {
            let output = [];
            output = show(output);
		//NOPASSPORT             console.log("isAuthenticated", request.isAuthenticated(), 'user', request.user);

            if (request.session.views) {
                request.session.views++
            } else {
                request.session.views = 1
            }
            console.log('Session:', request.session);

            userId = request.session.userId;

            display(request,response, 'Show', output);
        }));


        router.get('/readme_md', awaitAppDelegateFactory(async (request, response) => {

            let processName = request.params.process;
            let fileName = docsFolder + '../README.md';

            let file = FS.readFileSync(fileName,
                { encoding: 'utf8', flag: 'r' });

            response.send(file);

        }));
        router.get('/userId', awaitAppDelegateFactory(async (request, response) => {
            response.send(request.session.userId);
        }));
        router.get('/example', awaitAppDelegateFactory(async (request, response) => {
            /* Testing only
             * 
            */
            var test;
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

        router.get('/executeInput/:processName', awaitAppDelegateFactory(async (request, response) => {
            let processName = request.params.processName;

            response.render('executeInput', { processName });
        }));


        router.get('/execute/:processName', awaitAppDelegateFactory(async (request, response) => {



            let processName = request.params.processName;
            request.session.processName = processName;

            let context = await bpmnServer.engine.start(processName, { caseId: caseId++ },
                null, userId);

            if (context.errors) {
                displayError(response, context.errors);
            }


            let execution = context.execution;

            response.redirect('/instanceDetails?id=' + execution.id);
        }));


        router.post('/execute', awaitAppDelegateFactory(async (request, response) => {

            let process = request.body.processName;
            request.session.processName = process;
            let data = {};
            parseField(request.body.field1, request.body.value1, data);
            parseField(request.body.field2, request.body.value2, data);


            let startNodeId = request.body.startNodeId


            data['caseId'] = caseId++;

            let context = await bpmnServer.engine.start(process, data, startNodeId, userId);
            if (context.errors) {
                displayError(response, context.errors);
            }
            let instance = context.execution;

            response.redirect('/instanceDetails?id=' + instance.id);
        }));

        router.get('/listDefinitions', function (req, res) {
            let output = ['Data Reset'];
            output = show(output);
            display(req,res, 'Show', output);

        });

        router.get('/resetData', awaitAppDelegateFactory(async (request, response) => {
            await bpmnServer.dataStore.deleteInstances();
            let output = ['Data Reset'];
            output = show(output);
            display(request,response, 'Show', output);
        }));

        router.get('/refresh', function (req, res) {
            let output = [];
            output = show(output);
            display(req,res, 'Show', output);
        });

        router.get('/clearDebug', function (req, res) {
            //    Logger.clear();
            let output = [];
            output = show(output);
            display(req,res, 'Show', output);
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
            try {
                let result = await bpmnServer.engine.invoke({ "items.id": id }, {}, userId);

                console.log("redirecting");
                response.redirect('/instanceDetails?id=' + result.execution.id);
            }
            catch (exc) {
                response.send(exc.toString());
            }
        }));
        router.post('/invokeItem', awaitAppDelegateFactory(async (request, response) => {
            let id = request.body.itemId;
            let data = {};
            
            Object.entries(request.body).forEach(entry => {
                if (entry[0] == 'itemId') { }
                else {
                    data[entry[0]] = entry[1];
                }
            });

            try {

                let result = await bpmnServer.engine.invoke({ "items.id": id }, data, userId);

                response.redirect('/instanceDetails?id=' + result.execution.id);
            }
            catch (exc) {
                response.send(exc.toString());
            }

        }));


        router.get('/mocha', awaitAppDelegateFactory(async (request, response) => {

            const mocha = require('../node_modules/mocha/bin/mocha');
        }));

        router.get('/run/:process', awaitAppDelegateFactory(async (request, response) => {
            let process = request.params.process;
            let exec = await bpmnServer.engine.start(process, { caseId: caseId++ }, null, userId);
            if (exec.errors) {
                displayError(response, exec.errors);
            }

            let output = ['run ' + process];
            output = show(output);
            display(request,response, 'Run Prcesses', output, exec.instance.logs, exec.instance.items);
        }));
        router.get('/instanceDetails', awaitAppDelegateFactory(async (request, response) => {

            let imageId = request.query.id;
            await instanceDetails(response, imageId);

        }));

        router.get('/deleteInstance', deleteInstance);
        router.get('/shutdown', shutdown);
        router.get('/restart', restart);
        router.get('/manage', manage);
        return router;
    }
}


async function home(request, response)  {
        let output = [];
        output = show(output);

        if (request.session.views) {
            request.session.views++
        } else {
            request.session.views = 1
        }
        console.log('Session:', request.session);



        display(request,response, 'Show', output);
}

async function deleteInstance(req, res) {

    let instanceId = req.query.id;

    await bpmnServer.dataStore.deleteInstances({ id: instanceId });

    let output = ['Complete ' + instanceId];
    display(req,res, 'Show', output);
}
async function shutdown(req, res) {

    let instanceId = req.query.id;

    await bpmnServer.cache.shutdown();

    let output = ['Complete ' + instanceId];
    display(req,res, 'Show', output);
}
async function restart(req, res) {

    let instanceId = req.query.id;

    await bpmnServer.cache.restart();

    let output = ['Complete ' + instanceId];
    display(req,res, 'Show', output);
}
async function getProcs() {
    let list=[];
    let procs=await bpmnServer.definitions.getList();
    procs.forEach(p=>{list.push(p.name);});
    return list;
}
async function manage(req, res) {
    res.render('manageProcesses',
        {
            procs: await getProcs()
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
async function display(req,res, title, output, logs = [], items = []) {

    var instances = await bpmnServer.dataStore.findInstances({},'summary');
    let waiting = await bpmnServer.dataStore.findItems({"items.status": 'wait',"items.type": 'bpmn:UserTask' }); 

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
            userId: req.session.userId,
            procs: await getProcs(),
            debugMsgs: [], // Logger.get(),
            waiting: waiting,
            instances,
            request: req,
            logs, items
        });

}
function show(output) {
    return output;
}
async function instanceDetails(response,instanceId) {
    let instance = await bpmnServer.dataStore.findInstance({ id: instanceId },'Full');


    let logs = instance.logs;
    let svg = null;
    try {
        svg = await definitions.getSVG(instance.name);

    }
    catch (ex) {

    }

    const lastItem = instance.items[instance.items.length - 1];

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

    let decorations = JSON.stringify(calculateDecorations(instance.items));

    response.render('InstanceDetails',
        {
            instance, vars,
            accessRules: def.accessRules,
            title: 'Instance Details',
            logs,items: instance.items, svg,
            decorations, definition: defJson, lastItem,
        });

}
async function getFields(processName, elementId) {

    let definition = await bpmnServer.definitions.load(processName);
    let node = definition.getNodeById(elementId);
    let extName = Behaviour_names.CamundaFormData;
    let ext = node.getBehaviour(extName);
    if (ext) {
        return ext.fields;
    }
    else
        return null;
}

function parseField(field, value, data) {
    if (field) {
        if (value.substring(0, 1) == '[') {
            value = value.substring(1);
            value = value.substring(0, value.length - 1);
            let array = value.split(',');
            value = array;
        }
        data[field] = value;
    }
}
function calculateDecorations(items) {
    let decors = [];
    let seq = 1;
    items.forEach(item => {
        let color = 'red';
        if (item.status == 'end')
            {
            if (item.endedAt == null && item.type !='bpmn:SequenceFlow')
                color ='gray';
            else 
                color = 'black';
            }
        let decor = { id: item.elementId, color, seq };
        decors.push(decor);
        seq++;
    });
    return decors;

}
//export default router;
