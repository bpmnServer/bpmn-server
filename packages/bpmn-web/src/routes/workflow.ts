import express from 'express';
import FS from 'node:fs';
import path from 'node:path';

import { BPMNServer, dateDiff, Behaviour_names   } from '../index.js';
import { BPMNAPI , SecureUser } from '../index.js';
import { engineGroups } from '../userAccess/roles.js';
import { Common } from './common.js';
import { packageReadme } from './docs.js';
import { ViewHelper } from './ViewHelper.js';
import { runProcess } from './runErrors.js';
import { bpmnToSvg } from './bpmnToSvg.js';


var caseId = Math.floor(Math.random() * 10000);



// main functions

function awaitAppDelegateFactory (middleware) {
    return async (req, res, next) => {
        try {

            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}
//   
var bpmnServer;
var definitions;
var bpmnAPI;

export class Workflow extends Common {
    config() {
        var router = express.Router();

        bpmnServer = this.webApp.bpmnServer;
        bpmnAPI = new BPMNAPI(bpmnServer);
        definitions = bpmnServer.definitions;

        // Deny-by-default: every workflow UI route requires a session
        // (unless REQUIRE_AUTHENTICATION=false — the demo dev bypass).
        // Public paths (/login, /signup, ...) are served by earlier routers.
        router.use(this.isAuthenticated);

        router.get('/home', awaitAppDelegateFactory(home));

        router.get('/', this.isAuthenticated, awaitAppDelegateFactory(async (request, response) => {
            let output = [];
            output = show(output);
            
            return display(request,response, 'Show', output);
        }));

        router.get('/setUser', this.isAdmin, awaitAppDelegateFactory(async (request, response) => {
            let output = [];
            setForUser(request);
            output = show(output);

            return display(request, response, 'Show', output);
        }));
        router.get('/tasks', this.isAuthenticated, awaitAppDelegateFactory(async (request, response) => {
            return await this.tasks(request, response);
        }));


        router.get('/readme_md', awaitAppDelegateFactory(async (request, response) => {

            let processName = request.params.process;
            let fileName = packageReadme;

            let file = FS.readFileSync(fileName,
                { encoding: 'utf8', flag: 'r' });

            response.send(file);

        }));
        router.get('/userName', awaitAppDelegateFactory(async (request, response) => {
            response.send(getUser(request).userName);
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
            let context = await runProcess(bpmnServer, { processName: processName }, () => bpmnAPI.engine.start(processName, { caseId: caseId++ },getSecureUser(request)));

            if (context.errors) {
                displayError(response, context.errors);
            }


            let execution = context.execution;

            return await afterOperation(request,response,context);
        }));


        router.post('/execute', awaitAppDelegateFactory(async (request, response) => {

            let process = request.body.processName;
            request.session.processName = process;
            let data = {};
            ViewHelper.parseField(request.body.field1, request.body.value1, data);
            ViewHelper.parseField(request.body.field2, request.body.value2, data);


            let startNodeId = request.body.startNodeId


            data['caseId'] = caseId++;

            let context = await runProcess(bpmnServer, { processName: process }, () => bpmnAPI.engine.start(process, data,getSecureUser(request), { startNodeId }));
            if (context.errors) {
                displayError(response, context.errors);
            }
            let instance = context.execution;

            return await afterOperation(request,response,context);


        }));

        router.get('/listDefinitions', function (req, res) {
            let output = ['Data Reset'];
            output = show(output);
            return display(req,res, 'Show', output);

        });

        router.post('/resetData', this.isAdmin, awaitAppDelegateFactory(async (request, response) => {
            await bpmnServer.dataStore.deleteInstances({});
            let output = ['Data Reset'];
            output = show(output);
            return display(request,response, 'Show', output);
        }));

        router.get('/refresh', function (req, res) {
            let output = [];
            output = show(output);
            return display(req,res, 'Show', output);
        });

        router.get('/clearDebug', function (req, res) {
            //    Logger.clear();
            let output = [];
            output = show(output);
            return display(req,res, 'Show', output);
        });

        router.get('/invokeItem', awaitAppDelegateFactory(async (request, response) => {

            let id = request.query.id;
            let processName = request.query.processName;
            let elementId = request.query.elementId;
            let returnTo=request.query.returnTo;
            


            // findItem authorizes the task; findInstances no longer returns data or items to non-admins
            const item = await bpmnAPI.data.findItem({ "items.id": id }, getSecureUser(request));
            if (!item) return response.status(403).send('Item not found or not authorized');
            const instance = await bpmnServer.dataStore.findInstance({ id: item.instanceId }, 'full');

            let definition=await bpmnServer.definitions.loadFromInstance(instance);

            let { node, fields } =definition.getNodeInfo(elementId);

            
            let vars = ViewHelper.formatData(instance.data || {});

            if (fields && fields.length > 0) {
                response.render('invokeItem', { node,
                    id, fields, processName, elementId ,instance,vars ,returnTo
                });
                return;
            }
            let result = await runProcess(bpmnServer, { itemId: id }, () => bpmnAPI.engine.invoke({ "items.id": id }, {}, getSecureUser(request)));

            return await afterOperation(request,response,result);
        }));
        router.post('/invokeItem', awaitAppDelegateFactory(async (request, response) => {
            let id = request.body.itemId;
            let returnTo=request.body.returnTo;
            let data = {};
            
            Object.entries(request.body).forEach(entry => {
                if (entry[0] == 'itemId') { }
                else {
                    data[entry[0]] = entry[1];
                }
            });


            let result = await runProcess(bpmnServer, { itemId: id }, () => bpmnAPI.engine.invoke({ "items.id": id }, data, getSecureUser(request)));

            return await afterOperation(request,response,result);

        }));


        router.get('/assign', awaitAppDelegateFactory(async (request, response) => {

            let id = request.query.id;
            let processName = request.query.processName;
            let elementId = request.query.elementId;
            let itemId = request.query.itemId;
            let item = await bpmnAPI.data.findItem({"items.id": id},getSecureUser(request));
            //console.log('item:', item);
            if (!item) {
                request.flash('errors', [{ msg: 'Item not found or not authorized' }]);
                response.redirect('/');
                return;
            }

            const instance = await bpmnServer.dataStore.findInstance({ id: item.instanceId }, 'full');   // item authorized above
            const lastItem = instance.items[instance.items.length - 1];
            let definition=await bpmnServer.definitions.loadFromInstance(instance);

            let { node, fields } =definition.getNodeInfo(elementId);

            let vars = ViewHelper.formatData(instance.data || {});
            response.render('assign', {
                    item, instance, vars, lastItem,
                    dueDate: ViewHelper.dateDisplay(item.dueDate),
                    followUpDate: ViewHelper.dateDisplay(item.followUpDate),
                    id, fields, processName, elementId
                });
            return;
            
        }));

        router.post('/assign', awaitAppDelegateFactory(async (request, response) => {
            let id = request.body.itemId;
            let data = {};
            let assignment = {};

            Object.entries(request.body).forEach(entry => {
                const label = entry[0];
                if (label == 'itemId') { }
                else if (label.startsWith('data_')) {
                    data[label.substr(5)] = entry[1];
                }
                else {
                    //console.log(label, entry[1]);
                    assignment[label] = entry[1];

                }
            });

            assignment['dueDate'] = ViewHelper.dateInput(assignment['dueDate']);
            assignment['followUpDate'] = ViewHelper.dateInput(assignment['followUpDate']);

            assignment['candidateUsers'] = assignment['candidateUsers'].split(',');
            assignment['candidateGroups'] = assignment['candidateGroups'].split(',');

            //console.log('data', data, 'assignment', assignment);
            let result = await runProcess(bpmnServer, { itemId: id }, () => bpmnAPI.engine.assign({ "items.id": id }, data, assignment, getSecureUser(request)));

            return await afterOperation(request,response,result);

        }));

        router.get('/run/:process', awaitAppDelegateFactory(async (request, response) => {
            let process = request.params.process;

            let exec = await runProcess(bpmnServer, { processName: process }, () => bpmnAPI.engine.start(process, { caseId: caseId++ }, getSecureUser(request)));
            if (exec.errors) {
                displayError(response, exec.errors);
            }

            let output = ['run ' + process];
            output = show(output);
            return display(request,response, 'Run Prcesses', output, exec.instance.logs, exec.instance.items);
        }));
        router.get('/instanceDetails', awaitAppDelegateFactory(async (request, response) => {

            let imageId = request.query.id;
            let version = request.query.version;
            await instanceDetails(request,response, imageId,version);

        }));
        router.post('/query', async (req, res) => {
            try {
                const query = req.body.query;
                var results = await bpmnAPI.data.findInstances(query, getSecureUser(req), {
                    projection: { name: 1, status: 1, data: 1, items: 1 },
                    sort: { saved: -1 }
                });
                res.json(results);
            } catch (error) {
                console.error('POST /query failed:', error);
                res.status(500).json({ errors: 'query failed' });
            }
        });

        router.post('/deleteInstance', this.isAdmin, awaitAppDelegateFactory(deleteInstance));
        // a failed item (status error): its work again
        router.post('/retryItem', this.isAdmin, awaitAppDelegateFactory(async (request, response) => {
            const id = request.body.itemId;
            const result = await runProcess(bpmnServer, { itemId: id }, () => bpmnAPI.engine.retry({ "items.id": id }, getSecureUser(request)));
            return await afterOperation(request, response, result);
        }));
        return router;
    }
    async tasks(request, response) {


        let items = await bpmnAPI.data.findItems({ "items.type": "bpmn:UserTask", "items.status": "wait" }, getSecureUser(request));

        items.forEach(item => {
            item['fromNow'] = dateDiff(item.startedAt);
            item['dueFrom'] = dateDiff(item.dueDate);
            item['followFrom'] = dateDiff(item.followUpDate);
        });
        let starts = await bpmnAPI.model.findStartEvents({}, getSecureUser(request));


        await response.render('tasks',
            {
                userName: request.session.userName,
                starts: starts,
                debugMsgs: [], // Logger.get(),
                request,
                items: items
            });
        return null;
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
        //console.log('Session:', request.session);



        return display(request,response, 'Show', output);
}

async function deleteInstance(req, res) {

    let instanceId = req.body.id;

    await bpmnServer.dataStore.deleteInstances({ id: instanceId });

    let output = ['Complete ' + instanceId];
    return display(req,res, 'Show', output);
}
async function getProcs() {
    let list=[];
    let procs=await bpmnServer.definitions.getList();
    procs.forEach(p=>{list.push(p.name);});
    return list;
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
function getSecureUser(req) {
//console.log('process.env.REQUIRE_AUTHENTICATION',process.env.REQUIRE_AUTHENTICATION);

    let user;
    if (process.env.REQUIRE_AUTHENTICATION !== 'false')
    {
        const usr = getUser(req);
        if (usr)
            user=new SecureUser({ userName: usr.userName, userGroups: engineGroups(usr), tenantId: usr.tenantId });
    }
    else
         user=SecureUser.SystemUser();
     
    //console.log('getSecureUser',user);
    return user;        
 }

function getUser(req) {
    if (process.env.REQUIRE_AUTHENTICATION === 'false' && req.session.forUser)
        return req.session.forUser;
    else
        return req.user;
}
function setForUser(req) {
    if (process.env.REQUIRE_AUTHENTICATION !== 'false') {
        delete req.session.forUser;
        return;
    }
    let forUserName;
    let forUserGroups;
    if ('forUserName' in req.query) {
        forUserName = req.query.forUserName;
        forUserGroups = req.query.forUserGroups;

        let userInfo = { userName: forUserName, userGroups: forUserGroups.split(',') };
        req.session.forUser = userInfo;
    }
}

async function display(req,res, title, output, logs = [], items = []) {

    let user = getSecureUser(req);
    
    var instances = await bpmnAPI.data.findInstances({}, user,{sort:{saved:-1}});
    let waiting = await bpmnAPI.data.findItems({ "items.status": 'wait', "items.type": 'bpmn:UserTask' }, getSecureUser(req)); 

    waiting.forEach(item => {
        item['fromNow'] = dateDiff(item.startedAt);
    });

    let engines = bpmnServer.cache.list();

    engines.forEach(engine => {
        engine.fromNow = dateDiff(engine.startedAt); 
        engine.fromLast = dateDiff(engine.lastAt); 
        });

    instances.forEach(item => {
        item['fromNow'] = dateDiff(item.startedAt);
        if (item.endedAt)
            item['endFromNow'] = dateDiff(item.endedAt);
        else
            item['endFromNow'] = '';
    });

    res.render('index',
        {
            title: title, output: output,
            engines,
            user, 
            procs: await getProcs(),
            debugMsgs: [], // Logger.get(),
            waiting: waiting,
            instances,
            request: req,
            logs, items,
            forUserGroups: req.session.forUserGroups, forUserName: req.session.forUserName
        });

}
function show(output) {
    return output;
}
function isAdmin(request) {
    if (process.env.REQUIRE_AUTHENTICATION === 'false')
       return true;
    else
        return request.isAdmin;

}
async function afterOperation(request,response,result) {

    //console.log("isAuthenticated", request.isAuthenticated(), 'user', request.user);
    // let user = getSecureUser(request);
    let returnTo = (request.body && request.body.returnTo) || (request.query && request.query.returnTo);
    if (returnTo=='home')
        return display(request,response,'Show',[]);
    else if (isAdmin(request))
        {
         response.redirect('/instanceDetails?id=' + result.execution.id);
        }
    else
        return display(request,response, 'Show', []);

//    response.redirect('/instanceDetails?id=' + result.execution.id);
//    console.log('items#',result.instance.items.length);

}
async function instanceDetails(request,response,instanceId,version) {

    let user = getSecureUser(request);

    const visibleItems = await bpmnAPI.data.findItems({ id: instanceId }, user);
    if (visibleItems.length === 0) return response.status(403).send('Instance access denied');

    let instance = await bpmnServer.dataStore.findInstance({ id: instanceId }, 'Full');

    let logs = instance.logs;
    if (!logs)
        logs = [];
    
    let svg = null;
    try {
        svg= instance.svg;
        if (!svg)
            svg = await definitions.getSVG(instance.name);
        // decorations and the replay animation find elements by data-element-id; older generated
        // previews lack it, so draw the diagram again from the instance's model
        if (!svg || !svg.includes('data-element-id'))
            svg = (await bpmnToSvg(instance.source || await definitions.getSource(instance.name))) || svg;
    }
    catch (ex) {

    }

    let data = instance.data;
    let items = instance.items;
    if (version) {
        let savePoint=instance.savePoints[version];
        data = savePoint.data;
        items= savePoint.items;

    }
    let lastItem = items[items.length - 1];

    const def = await bpmnServer.definitions.loadFromInstance(instance);     // loaded: loading again listed each flow twice
    const defJson = def.getJson();
    let output = ['View Process Log'];
    output = show(output);

    let vars = ViewHelper.formatData(instance.data || {});

    let decorations = JSON.stringify(ViewHelper.calculateDecorations(items,instance.tokens));

    response.render('InstanceDetails',
        {
            instance, vars, request, user,
            accessRules: def.accessRules,
            title: 'Instance Details',
            logs,items:items, svg,
            decorations, definition: defJson, lastItem,
            // the model as the Report shows it (report/view.js): the instance's own source, else the model's
            modelJson: JSON.stringify(instance.source || await definitions.getSource(instance.name)).replace(/</g, '\\u003c'),
        });

}//export default router;
