import express from 'express';
import FS from 'node:fs';
import path from 'node:path';

import { BPMNServer, dateDiff, Behaviour_names, SystemUser   } from '../index.js';
import { BPMNAPI , SecureUser } from '../index.js';
import { answerMessage, Common } from './common.js';
import { packageReadme } from './docs.js';
import { ViewHelper } from './ViewHelper.js';
import { rationaleSteps } from '../testing/rationale.js';
import { notATest } from '../testing/scenarios.js';
import { runProcess } from './runErrors.js';
import { guardModelParams } from './middleware/modelName.js';
import { afterWork } from '../userAccess/roles.js';
const FORM_ONLY = new Set(['itemId', '_csrf', 'returnTo']);     // the form's own fields, not the task's data


var caseId = Math.floor(Math.random() * 10000);



// main functions

function awaitAppDelegateFactory (middleware) {
    return async (req, res, next) => {
        try {
/*            if (req.query.userName && typeof (req.query.userName) !=='undefined' && req.query.userName !=='undefined') {
                req.session.userName = req.query.userName;
            }
            else if (!req.session.userName)
                req.session.userName = 'demoUser';
                */

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

export class EndUser extends Common {
    config() {
        var router = express.Router();
        guardModelParams(router);

        bpmnServer = this.webApp.bpmnServer;
        bpmnAPI = new BPMNAPI(bpmnServer);
        definitions = bpmnServer.definitions;

        // Deny-by-default: end-user task routes require a session.
        router.use(this.isAuthenticated);

        router.get('/home', home);

        router.get('/', this.isAuthenticated, awaitAppDelegateFactory(async (request, response) => {
		    //console.log("isAuthenticated", request.isAuthenticated(), 'user', request.user);
            
            return display(request,response, 'Show');
        }));

        router.get('/setUser', this.isAdmin, awaitAppDelegateFactory(async (request, response) => {
            setForUser(request);
            //console.log("isAuthenticated", request.isAuthenticated(), 'user', request.user);

            return display(request, response, 'Show');
        }));
        router.get('/tasks', this.isAuthenticated, awaitAppDelegateFactory(async (request, response) => {
            console.log('/tasks');
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
            // something to ask first (which start event, its start form): the start page
            const definition = await bpmnServer.definitions.load(processName).catch(() => null);
            const starts = definition?.getStartNodes(true) ?? [];
            if (starts.length > 1 || starts.some(node => (definition.getNodeInfo(node.id).fields ?? []).length))
                return response.redirect('/dashboard/start/' + encodeURIComponent(processName));
            let context = await runProcess(bpmnServer, { processName: processName }, () => bpmnAPI.engine.start(processName, { caseId: caseId++ },getSecureUser(request)));

            if (context.errors) {
                displayError(response, context.errors);
            }


            let execution = context.execution;

            response.redirect(afterWork(request.user, execution.id));
        }));

        router.get('/select/:processName', awaitAppDelegateFactory(async (request, response) => {

            let processName = request.params.processName;
            request.session.processName = processName;
		    //console.log("isAuthenticated", request.isAuthenticated(), 'user', request.user);
            
            return display(request,response, 'Show',processName);
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

            response.redirect(afterWork(request.user, instance.id));
        }));

        router.get('/invokeItem', awaitAppDelegateFactory(async (request, response) => {

            let id = request.query.id;
            let processName = request.query.processName;
            let elementId = request.query.elementId;

            // findItem authorizes the task; findInstances no longer returns data or items to non-admins
            const item = await bpmnAPI.data.findItem({ "items.id": id }, getSecureUser(request));
            if (!item) return answerMessage(request, response, 403, 'Item not found or not authorized');
            const instance = await bpmnServer.dataStore.findInstance({ id: item.instanceId }, 'full');

            let definition=await bpmnServer.definitions.loadFromInstance(instance);

            let { node, fields } =definition.getNodeInfo(elementId);
            
            let vars = ViewHelper.formatData(instance.data || {});
console.log('fields',fields);
            if (fields && fields.length > 0) {
                response.render('invokeItem', { node,
                    id, fields, processName, elementId ,instance,vars
                });
                return;
            }
            let result = await runProcess(bpmnServer, { itemId: id }, () => bpmnAPI.engine.invoke({ "items.id": id }, {}, getSecureUser(request)));

            response.redirect(afterWork(request.user, result.execution.id));
        }));
        router.post('/invokeItem', awaitAppDelegateFactory(async (request, response) => {
            let id = request.body.itemId;
            let data = {};
            
            for (const [key, value] of Object.entries(request.body))
                if (!FORM_ONLY.has(key)) data[key] = value;


            let result = await runProcess(bpmnServer, { itemId: id }, () => bpmnAPI.engine.invoke({ "items.id": id }, data, getSecureUser(request)));

            response.redirect(afterWork(request.user, result.execution.id));

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
            console.log('fieldsDef:',fields);

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

            assignment['dueDate'] = ViewHelper.dateInput(assignment['DueDate']);
            assignment['followUpDate'] = ViewHelper.dateInput(assignment['followUpDate']);

            assignment['candidateUsers'] = assignment['candidateUsers'].split(',');
            assignment['candidateGroups'] = assignment['candidateGroups'].split(',');

            //console.log('data', data, 'assignment', assignment);
            let result = await runProcess(bpmnServer, { itemId: id }, () => bpmnAPI.engine.assign({ "items.id": id }, data, assignment, getSecureUser(request)));

            response.redirect(afterWork(request.user, result.execution.id));

        }));


        router.get('/run/:process', awaitAppDelegateFactory(async (request, response) => {
            let process = request.params.process;

            let exec = await runProcess(bpmnServer, { processName: process }, () => bpmnAPI.engine.start(process, { caseId: caseId++ }, getSecureUser(request)));
            if (exec.errors) {
                displayError(response, exec.errors);
            }

            return display(request,response, 'Run Prcesses', exec.instance.logs, exec.instance.items);
        }));
        router.get('/instanceDetails', awaitAppDelegateFactory(async (request, response) => {

            let imageId = request.query.id;
            console.log(request.query,request.query.version);
            await instanceDetails(request, response, imageId);

        }));

        return router;
    }
    async tasks(request, response) {

/*        console.log('request.params', request.params, request.query);

        let forUserEmail = (!('forUserEmail' in request.query)) ? 'User1' : request.query.forUserEmail;
        let forUserGroups = (!('forUserGroups' in request.query)) ? 'group1' : request.query.forUserGroups;
        request.session.forUserEmail = forUserEmail;
        request.session.forUserGroups = forUserGroups;
        console.log('Session:', request.session);
*/

        let items = await bpmnAPI.data.findItems({ "items.type": "bpmn:UserTask", "items.status": "wait", ...notATest }, getSecureUser(request));

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
        if (request.session.views) {
            request.session.views++
        } else {
            request.session.views = 1
        }
        //console.log('Session:', request.session);



        return display(request,response, 'Show');
}


async function manage(req, res) {
    res.render('manageProcesses',
        {
            procs: await this.getProcs(bpmnAPI)
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
function getSecureUser(req) {
//console.log('process.env.REQUIRE_AUTHENTICATION',process.env.REQUIRE_AUTHENTICATION);

    let user;
    if (process.env.REQUIRE_AUTHENTICATION !== 'false')
    {
        const usr = getUser(req);
        if (usr)
            user=new SecureUser({ userName: usr.userName, userGroups: usr.userGroups, tenantId: usr.tenantId });
    }
    else
         user=SecureUser.SystemUser();
     
    console.log('getSecureUser',user);
    return user;        
 }

function getUser(req) {
    //console.log('getUser', req.user, req.session.forUser);
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


async function display(req,res, title, logs = [], items = []) {

    let user = getSecureUser(req);
    let query: any={...notATest};
    let process=req.session.processName;

    if (process)
        query={...query,"name":process};
    var instances = await bpmnAPI.data.findInstances(query, user,'summary');
        query["items.status"]='wait';
        query["items.type"]='bpmn:UserTask';
    let waiting = await bpmnAPI.data.findItems(query, getSecureUser(req)); 

    waiting.forEach(item => {
        item['fromNow'] = dateDiff(item.startedAt);
    });

    let engines = await bpmnServer.engine.live();

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
    let procs=await ViewHelper.getProcs(bpmnAPI,process);
    let procsDocs=ViewHelper.getProcsDocs(procs);

    res.render('user/home',
        {
            title: title, output: '',
            engines,
            user,
            procs,
            procsDocs: JSON.stringify(procsDocs),
            debugMsgs: [], // Logger.get(),
            waiting: waiting,
            instances,
            request: req,
            logs, items,
            forUserGroups: req.session.forUserGroups, forUserName: req.session.forUserName
        });

}
async function instanceDetails(request,response,instanceId) {

    const visibleItems = await bpmnAPI.data.findItems({ id: instanceId }, getSecureUser(request));
    if (visibleItems.length === 0) return response.status(403).send('Instance access denied');

    let instance = await bpmnServer.dataStore.findInstance({ id: instanceId }, 'Full');


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
    
    let vars = ViewHelper.formatData(instance.data || {});

    let decorations = JSON.stringify(ViewHelper.calculateDecorations(instance.items,instance.tokens));

    response.render('InstanceDetails',
        {
            instance, vars, request, user: getSecureUser(request),
            accessRules: def.accessRules,
            title: 'Instance Details',
            logs,items: instance.items, svg,
            decorations, definition: defJson, lastItem,
            rationale: rationaleSteps(logs, instance.items, instance.startedAt),
            // the model as the Report shows it (report/view.js): the instance's own source, else the model's
            modelJson: JSON.stringify(instance.source || await definitions.getSource(instance.name)).replace(/</g, '\\u003c'),
        });

}

//export default router;
