import express from 'express';
import FS from 'node:fs';
import path from 'node:path';

import { BPMNServer, dateDiff, Behaviour_names, labelInstances, labelItems, actorsOf, actorElements, notificationsOf } from '../index.js';
import { BPMNAPI , SecureUser, formFieldLookup } from '../index.js';
import { answerMessage, Common } from './common.js';
import { packageReadme } from './docs.js';
import { ViewHelper } from './ViewHelper.js';
import { rationaleSteps } from '../testing/rationale.js';
import { runProcess } from './runErrors.js';
import { labelFilterOf } from './labelFilter.js';
import { accessDirectory } from './caseAccess.js';
import { pageApi, ApiError } from './api/pageClient.js';
import { ProcessRunError } from './runErrors.js';
import { listTestCases, modelsWithTestCases, readTestCase } from '../testing/testCases.js';
import { testsRun } from '../runtime/environment.js';
import { bpmnToSvg } from './bpmnToSvg.js';
import { guardModelParams } from './middleware/modelName.js';
import { afterWork, canDesign, isAdminGroups } from '../userAccess/roles.js';
import { ruleAttributes } from './formAttributes.js';

/** Designers and administrators: who may do what with a case is theirs to see (the instance page's Assignment and access). */
const worksOnModels = user => !!user && (isAdminGroups(user.userGroups) || canDesign(user));
const FORM_ONLY = new Set(['itemId', '_csrf', 'returnTo']);     // the form's own fields, not the task's data


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

/**
 * The server a request came to, and its API (app.ts sets `bpmnServer` on the Express app): each request's own, no
 * module-level server, so two servers in one process each keep theirs (docs/design/multi-app-tenants.md §8.1).
 */
const serverOf = (req) => req.app.get('bpmnServer');
const apis = new WeakMap<object, BPMNAPI>();
function apiOf(req): BPMNAPI {
    const server = serverOf(req);
    let api = apis.get(server);
    if (!api) apis.set(server, api = new BPMNAPI(server));
    return api;
}

export class Workflow extends Common {
    config() {
        var router = express.Router();
        guardModelParams(router);


        // Deny-by-default: every workflow UI route requires a session
        // (unless REQUIRE_AUTHENTICATION=false — the demo dev bypass).
        // Public paths (/login, /signup, ...) are served by earlier routers.
        router.use(this.isAuthenticated);

        router.get('/home', awaitAppDelegateFactory(home));

        // ---- test cases (testing/testCases.ts): each scenario's last case, from its file beside the models; what
        // production shows of the tests (it runs none). Read-only: no action on them
        // a process explained (routes/api/guide.ts), for whoever may start it or works in it: the API decides
        router.get('/guide/:process', awaitAppDelegateFactory(async (request, response) => {
            const name = request.params.process;
            const read = await asPage(request, response, async api => ({ guide: await api.guide(name), svg: await api.guideDiagram(name) }));
            if (!read) return;
            let svg = read.svg;
            if (!svg || !svg.includes('data-element-id'))
                svg = await bpmnToSvg(await serverOf(request).definitions.getSource(name)).catch(() => null) || svg;
            response.render('guide', { title: name, guide: read.guide, svg: svg ? ViewHelper.withoutRunMarks(svg) : null });
        }));

        // whoever may read a process's guide sees its test cases (the API decides)
        const mayRead = async (request, name: string) => {
            try { return await (await pageApi(request, serverOf(request))).mayReadGuide(name); }
            catch (exc) { if (exc instanceof ApiError) return false; throw exc; }
        };
        router.get('/test-cases', awaitAppDelegateFactory(async (request, response) => {
            const folder = serverOf(request).configuration.definitionsPath;
            const readable = [];
            for (const model of modelsWithTestCases(folder)) if (await mayRead(request, model)) readable.push(model);
            const models = readable.map(model => ({ model, cases: listTestCases(folder, model) }));
            response.render('testCases', { title: 'Test cases', models, testsRun: testsRun() });
        }));
        router.get('/test-cases/:process', awaitAppDelegateFactory(async (request, response) => {
            const folder = serverOf(request).configuration.definitionsPath;
            const model = request.params.process;
            if (!await mayRead(request, model)) return answerMessage(request, response, 404, `No test cases of ${model}`);
            response.render('testCases', { title: `Test cases: ${model}`, models: [{ model, cases: listTestCases(folder, model) }], testsRun: testsRun(), one: model });
        }));
        router.get('/test-cases/:process/:testCase', awaitAppDelegateFactory(async (request, response) => {
            if (!await mayRead(request, request.params.process)) return answerMessage(request, response, 404, `No test cases of ${request.params.process}`);
            const c = readTestCase(serverOf(request).configuration.definitionsPath, request.params.process, request.params.testCase);
            if (!c) return answerMessage(request, response, 404, `No test case ${request.params.testCase} of ${request.params.process}`);
            const instance = { ...c.instance, source: c.source };
            return renderInstance(request, response, instance, undefined, {
                model: c.model, scenario: c.scenario, ranAt: c.ranAt, ok: c.ok, error: c.error, current: c.current, file: request.params.testCase,
            });
        }));

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
            // something to ask first (which start event, its start form): the start page
            const definition = await serverOf(request).definitions.load(processName).catch(() => null);
            const starts = definition?.getStartNodes(true) ?? [];
            if (starts.length > 1 || starts.some(node => (definition.getNodeInfo(node.id).fields ?? []).length))
                return response.redirect('/dashboard/start/' + encodeURIComponent(processName));
            let context = await runProcess(serverOf(request), { processName: processName }, () => apiOf(request).engine.start(processName, { caseId: caseId++ },getSecureUser(request)));

            if (context.errors)
                return displayError(request, response, context.errors);


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

            let context = await runProcess(serverOf(request), { processName: process }, () => apiOf(request).engine.start(process, data,getSecureUser(request), { startNodeId }));
            if (context.errors)
                return displayError(request, response, context.errors);
            let instance = context.execution;

            return await afterOperation(request,response,context);


        }));

        router.get('/listDefinitions', function (req, res) {
            let output = ['Data Reset'];
            output = show(output);
            return display(req,res, 'Show', output);

        });

        router.post('/resetData', this.isAdmin, awaitAppDelegateFactory(async (request, response) => {
            await serverOf(request).engine.deleteInstances({});
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
            


            // the task and its case as this user may read them: API v3's operations decide (their part in it, the
            // case's security policy); this page only shows them
            const page = await asPage(request, response, api => api.taskPage(id));
            if (!page) return;
            const { node, fields, instance } = page;
            elementId = page.task.elementId;
            processName = page.task.processName ?? instance.name;
            let vars = ViewHelper.formatData(instance.data || {});

            if (fields && fields.length > 0) {
                // the fields whose choices come from a connector operation (owf:list, owf:lookup)
                const lookups = Object.fromEntries(fields.map(f => [f.id, formFieldLookup(f)]).filter(([, lookup]) => lookup));
                // each field's rules as its input's attributes (formAttributes.ts)
                const attrs = Object.fromEntries(fields.map(f => [f.id, ruleAttributes(f)]));
                response.render('invokeItem', { node,
                    id, fields, lookups, attrs, processName, elementId ,instance,vars ,returnTo
                });
                return;
            }
            const result = await completeTask(request, response, id, {});
            if (!result) return;
            return await afterOperation(request,response,result);
        }));
        router.post('/invokeItem', awaitAppDelegateFactory(async (request, response) => {
            let id = request.body.itemId;
            let returnTo=request.body.returnTo;
            let data = {};
            
            for (const [key, value] of Object.entries(request.body))
                if (!FORM_ONLY.has(key)) data[key] = value;

            // completed through API v3's operations, which decide whether this user may (completeTask)
            const result = await completeTask(request, response, id, data);
            if (!result) return;
            return await afterOperation(request,response,result);

        }));


        router.get('/assign', awaitAppDelegateFactory(async (request, response) => {

            let id = request.query.id;
            let processName = request.query.processName;
            let elementId = request.query.elementId;
            let itemId = request.query.itemId;
            // the task and its case as this user may read them (API v3's operations decide)
            const page = await asPage(request, response, api => api.taskPage(id, 'assign'));
            if (!page) return;
            const { task: item, instance, fields } = page;
            elementId = item.elementId;
            processName = item.processName ?? instance.name;
            const lastItem = instance.items[instance.items.length - 1];
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

            // given through API v3's operations, which decide whether this user may, and to whom (the case's policy)
            const result = await asPage(request, response, api => runProcess(serverOf(request), { itemId: id }, () => api.assign(id, assignment, data)));
            if (!result) return;
            return await afterOperation(request,response,result);

        }));

        router.get('/run/:process', awaitAppDelegateFactory(async (request, response) => {
            let process = request.params.process;

            let exec = await runProcess(serverOf(request), { processName: process }, () => apiOf(request).engine.start(process, { caseId: caseId++ }, getSecureUser(request)));
            if (exec.errors)
                return displayError(request, response, exec.errors);

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
                var results = await apiOf(req).data.findInstances(query, getSecureUser(req), {
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
            const result = await runProcess(serverOf(request), { itemId: id }, () => apiOf(request).engine.retry({ "items.id": id }, getSecureUser(request)));
            return await afterOperation(request, response, result);
        }));
        return router;
    }
    async tasks(request, response) {


        // the waiting tasks through API v3's operations, as the person (an administrator's, every one): they decide
        const items: any[] = await asPage(request, response, api => api.allWaiting(MAX_TASKS));
        if (!items) return;

        items.forEach(item => {
            item['fromNow'] = dateDiff(item.startedAt);
            item['dueFrom'] = dateDiff(item.dueDate);
            item['followFrom'] = dateDiff(item.followUpDate);
        });
        let starts = await apiOf(request).model.findStartEvents({}, getSecureUser(request));


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

    await serverOf(req).engine.deleteInstances({ id: instanceId });

    let output = ['Complete ' + instanceId];
    return display(req,res, 'Show', output);
}
async function getProcs(req) {
    let list=[];
    let procs=await serverOf(req).definitions.getList();
    procs.forEach(p=>{list.push(p.name);});
    return list;
}

/**
 * An operation's error as a page: its message, escaped, with the menu (answerMessage). The stack goes to the server's
 * log, never to the browser (the Fable Review, M6).
 */
function displayError(req, res, error) {
    console.error('workflow page:', error);
    const message = typeof error === 'object' ? (error?.message ?? 'The operation failed') : String(error);
    return answerMessage(req, res, 500, message);
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

/** The Workbench's lists: a page of instances (the API's paging), and up to the API's most waiting tasks. */
const WORKBENCH_PAGE = 50, MAX_TASKS = 200;

async function display(req,res, title, output, logs = [], items = []) {

    let user = getSecureUser(req);
    
    // each list's own filter by the labels' named values, as the URL says (routes/labelFilter.ts)
    const labelFilter = await labelFilterOf(serverOf(req), req, '/#instances', { other: 'task_' });
    const taskFilter = await labelFilterOf(serverOf(req), req, '/#tasks', { prefix: 'task_', other: '' });
    // the lists through API v3's operations (pageClient.ts), as the person: what they may see, a page of instances
    // (newest first; ?after= the next page) and an administrator's every waiting task, labeled. No security rules here
    const lists = await asPage(req, res, async api => ({
        instances: await api.instances(WORKBENCH_PAGE, typeof req.query.after === 'string' ? req.query.after : undefined, labelFilter.query ?? undefined),
        waiting: await api.allWaiting(MAX_TASKS, taskFilter.query ?? undefined),
    }));
    if (!lists) return;
    const instances: any[] = lists.instances.instances;
    const nextInstances = lists.instances.next;
    const waiting: any[] = lists.waiting;
    // what each task is for: its label and its case's (engine/Labels.ts), as My work has them
    await labelItems(serverOf(req), waiting);

    waiting.forEach(item => {
        item['fromNow'] = dateDiff(item.startedAt);
    });

    let engines = await serverOf(req).engine.live();

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
            procs: await getProcs(req),
            debugMsgs: [], // Logger.get(),
            waiting: waiting,
            instances, nextInstances,
            labelFilter: labelFilter.view,
            taskFilter: taskFilter.view,
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
/**
 * What a page asks of API v3's operations (pageClient.ts), as the person signed in: the operations decide who may see
 * and do what (their part in it, the case's security policy), so the pages hold no security rules of their own. A
 * refusal (403, 404, 409) is a page that says so, and `undefined` here; a run that failed is the run's error page.
 */
type PageApi = Awaited<ReturnType<typeof pageApi>>;
async function asPage<T>(request, response, operation: (api: PageApi) => Promise<T>): Promise<T | undefined> {
    try {
        return await operation(await pageApi(request, serverOf(request)));
    }
    catch (exc) {
        const refusal = exc instanceof ApiError ? exc : exc instanceof ProcessRunError && exc.cause instanceof ApiError ? exc.cause : null;
        // a form refused, or a task already done: the run's own page says why, as before
        if (!refusal || ['FORM_INVALID', 'ITEM_NOT_WAITING'].includes(refusal.code) || refusal.status >= 500) throw exc;
        answerMessage(request, response, refusal.status === 404 ? 403 : refusal.status,
            refusal.status === 404 ? 'This task or case is not there, or not yours to open' : refusal.message);
        return undefined;
    }
}

/** A task completed with this data, through API v3's operations: { execution } for afterOperation, or undefined when refused. */
async function completeTask(request, response, id: string, data: object) {
    const done = await asPage(request, response, api => runProcess(serverOf(request), { itemId: id }, () => api.complete(id, data)));
    return done && { execution: { id: done.instance.id } };
}

async function afterOperation(request,response,result) {

    //console.log("isAuthenticated", request.isAuthenticated(), 'user', request.user);
    // let user = getSecureUser(request);
    let returnTo = (request.body && request.body.returnTo) || (request.query && request.query.returnTo);
    if (returnTo=='home')
        return display(request,response,'Show',[]);
    response.redirect(afterWork(request.user, result.execution.id));

//    response.redirect('/instanceDetails?id=' + result.execution.id);
//    console.log('items#',result.instance.items.length);

}
async function instanceDetails(request,response,instanceId,version) {
    // the whole case for whoever sees it fully, its data as the policy lets them read it: API v3's operations decide
    const page = await asPage(request, response, api => api.instancePage(instanceId));
    if (!page) return;
    return renderInstance(request, response, page.instance, version);
}

/**
 * An instance's page: a case from the store, or a test case from its file (`testCase`: testing/testCases.ts), shown
 * read-only, with the scenario it ran and the model it ran against.
 */
async function renderInstance(request, response, instance, version?, testCase: any = null) {
    let user = getSecureUser(request);
    await labelInstances(serverOf(request), [instance]).catch(() => { });

    let logs = instance.logs;
    if (!logs)
        logs = [];
    
    let svg = null;
    try {
        // a test case's diagram is its own model's, as it ran
        svg = testCase ? null : instance.svg;
        if (!svg && !testCase)
            svg = await serverOf(request).definitions.getSVG(instance.name);
        // decorations and the replay animation find elements by data-element-id; older generated
        // previews lack it, so draw the diagram again from the instance's model
        if (!svg || !svg.includes('data-element-id'))
            svg = (await bpmnToSvg(instance.source || await serverOf(request).definitions.getSource(instance.name))) || svg;
        // the model's picture, not the colours of a run the editor showed when it was saved
        if (svg) svg = ViewHelper.withoutRunMarks(svg);
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

    const def = await serverOf(request).definitions.loadFromInstance(instance);     // loaded: loading again listed each flow twice
    const defJson = def.getJson();
    let output = ['View Process Log'];
    output = show(output);

    let vars = ViewHelper.formatData(instance.data || {});
    // who did what in it: its actors (docs/design/expressions.md), from its items and its model's owf:actor
    const source = instance.source || await Promise.resolve().then(() => serverOf(request).definitions.getSource(instance.name)).catch(() => '');
    const actors = Object.entries(actorsOf({ instance: { ...instance, items }, elements: actorElements(source || '') }))
        .filter(([, who]) => who != null && !(Array.isArray(who) && !who.length))
        .map(([name, who]) => ({ name, who: Array.isArray(who) ? who.join(', ') : String(who) }));
    // whom its notification policies told what (docs/docs/notification-policies.md), delivered or not
    const notifications = testCase ? [] : await notificationsOf(serverOf(request), instance.id).catch(() => []);

    let decorations = JSON.stringify(ViewHelper.calculateDecorations(items,instance.tokens));

    response.render('InstanceDetails',
        {
            instance, vars, actors, notifications, request, user,
            accessRules: def.accessRules,
            title: 'Instance Details',
            logs,items:items, svg,
            decorations, definition: defJson, lastItem,
            rationale: rationaleSteps(logs, items, instance.startedAt),
            // under it: its user tasks' assignment, after the fact; who may do what, for those who work on the models
            // a test case: what ran, read-only (no access asked, no actions)
            testCase,
            access: testCase ? null : await (await pageApi(request, serverOf(request))).instanceAccess({ ...instance, items, logs }, worksOnModels(request.user)
                ? await accessDirectory(request, serverOf(request)) : {}).catch(() => null),
            accessDetails: worksOnModels(request.user),
            // the model as the Report shows it (report/view.js): the instance's own source, else the model's
            modelJson: JSON.stringify(source).replace(/</g, '\\u003c'),
        });

}//export default router;
