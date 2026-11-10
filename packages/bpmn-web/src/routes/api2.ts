import express from 'express';

import { SecureUser } from '../index.js';
import { adminDisabled } from '../userAccess/roles.js';



const awaitAppDelegateFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

import { apiKeyAuth as loggedIn, apiServiceAuth, configuredApiUser } from './middleware/apiKeyAuth.js';
import { modelNameGuard, guardModelParams } from './middleware/modelName.js';
import { Common } from './common.js';
import { taskApi } from './taskApi.js';
import { sendModelRejection } from '../runtime/modelVerification.js';
import { Operations } from './api/operations.js';
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////

export class API2 extends Common {
    getUser(request): SecureUser {
        // The API key authenticates one configured service account. Client-supplied
        // user/group claims must never become an authorization principal.
        return configuredApiUser();
    }
    requireSystem = (req, res, next) => {
        try {
            if (this.getUser(req).isSystem()) return next();
            return res.status(403).json({ errors: 'System permission required' });
        } catch (error) {
            return res.status(500).json({ errors: error.message });
        }
    };
    requireAdmin = (req, res, next) => {
        try {
            if (adminDisabled()) return res.status(404).json({ errors: 'Administration is turned off on this server' });
            if (this.getUser(req).isAdmin()) return next();
            return res.status(403).json({ errors: 'Administrator permission required' });
        } catch (error) {
            return res.status(500).json({ errors: error.message });
        }
    };
    get bpmnServer() { return this.webApp.bpmnServer; }
    config() {

        var router = express.Router();

        guardModelParams(router);
        // the task API has a key of its own, and API_KEY does not open it
        router.use('/tasks', taskApi(this.bpmnServer));
        router.use(loggedIn, apiServiceAuth);
        router.use('/model', modelNameGuard);
        var bpmnServer = this.bpmnServer;
        const ops = new Operations(this.bpmnServer);
        let self = this;


        // Reading models (bpmn-server >= 3.2: BPMNAPI.model is read-only). What a client needs to
        // offer processes: the list, start events the service account may use, events. Changing
        // models stays under /admin/api2.
        router.get('/model/list', awaitAppDelegateFactory(async (request, response) => {
            response.json(await ops.listModels(self.getUser(request), request.body?.query ?? {}));
        }));
        router.get('/model/findEvents', awaitAppDelegateFactory(async (request, response) => {
            response.json(await ops.findEvents(self.getUser(request), request.body?.query ?? {}));
        }));
        router.get('/model/findStartEvents', awaitAppDelegateFactory(async (request, response) => {
            response.json(await ops.findStartEvents(self.getUser(request), request.body?.query ?? {}));
        }));

        router.get('/status', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let status;
            let errors;
            try {
                status = await ops.status();
            }
            catch (exc) {
                errors = exc.toString();
                //console.log(errors);
            }
            response.json({ errors: errors, status });
        }));       

        router.post('/data/findItems', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let query;
            if (request.body?.query) {
                query = request.body.query;
            }
            else
                query = request.body;

            //console.log(query);
            let items;
            let errors;
            try {
                items = await ops.findItems(self.getUser(request), query);
            }
            catch (exc) {
                errors = exc.toString();
                //console.log(errors);
            }
            response.json({ errors: errors, items });
        }));

        router.get('/data/findInstances', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            //console.log(request.body);
            let query;
            if (request.body?.query) {
                query = request.body.query;
            }
            else
                query = request.body ?? {};     // a GET usually has no body: all visible instances
            //console.log(query);
            let instances;
            let errors;
            try {

                instances = await ops.findInstances(self.getUser(request), query);
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instances });
        }));
        router.get('/datastore/find', loggedIn, this.requireSystem, awaitAppDelegateFactory(async (request, response) => {

            let error, results = null;
            let {
                filter = {}, // filter object to match documents.   // e.g. { status: 'running' }
                projection = { name: 1, status: 1, data: 1, items: { elementId: 1, seq: 1, type: 1, status: 1 } }, // projection object to specify fields to return
                after,
                limit = 10,
                sort = { '_id': -1 } ,// default sort by _id (descending)'},
                lastItem={},
                latestItem={},
                getTotalCount= false
              } = request.body ?? {};   // a GET may come without a body

              limit=Number.parseInt(limit); // ensure limit is a number
            
            try {

                results = await ops.find(self.getUser(request), { filter, projection, after, limit, sort, lastItem, latestItem, getTotalCount });
                
            }
            catch (exc) {
                error = exc.toString();
                console.log(error);
            }
            if (!error && results && results.error) error = results.error;   // the store reports some failures as { error }
            response.json(error ? { errors: error } : results);
        }));
        router.get('/data/fieldInfo', loggedIn, this.requireSystem, awaitAppDelegateFactory(async (request, response) => {
    
                response.json(await ops.fieldInfo(self.getUser(request), request.query.id as string, request.query.elementId as string));
            }));
        router.delete('/data/deleteInstances', loggedIn, this.requireAdmin, awaitAppDelegateFactory(async (request, response) => {

            let query;
            if (request.body?.query) {
                query = request.body.query;
            }
            else
                query = request.body;

            //console.log(query);

            let errors;
            let result;
            try {
                result = await ops.deleteInstances(self.getUser(request), query);
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, result });

        }));
        // ---------------- engine ----------------------------------

        router.post('/engine/start{/:name}', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            try {
                let name = (request.params as any).name;
                if (!name)
                    name = request.body.name;
  
                let data = request.body.data;
                let options={};
                if (request.body.options) {
                    options = request.body.options;
                }

                let context;
                //console.log(data,userName);

                context = await ops.start(self.getUser(request), name, { data, options });
                response.json(context.instance);
            }
            catch (exc) {
                response.json({ errors: exc.toString() });
            }
        }));
///
        router.put('/engine/assign', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            //console.log(request.body);
            let query, data,userName,assignment;
            if (request.body?.query) {
                query = request.body.query;
            }
            if (request.body.data) {
                data = request.body.data;
            }
            if (request.body.assignment) {
                assignment = request.body.assignment;
            }

            let context;
            let instance;
            let errors;
            try {

                context = await ops.assign(self.getUser(request), query, data, assignment);
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

///
        router.put('/engine/invoke', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            //console.log('---------invoke',request.body);
            let query, data,options;
            if (request.body?.query) {
                query = request.body.query;
            }
            if (request.body.data) {
                data = request.body.data;
            }
            if (request.body.options) {
                options = request.body.options;
            }

            let context;
            let instance;
            let errors;
            try {

                context = await ops.invoke(self.getUser(request), query, { data, options });
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
        /*
         *      response = await bpmn.engine.throwMessage(messageId,data);
        */
        router.post('/engine/throwMessage', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            try {
                let messageId = request.body.messageId;
                //console.log(' MessageId ' + messageId);
                let data = request.body.data;
                let messageMatchingKey = {};
                let options={};
                
                if (request.body.messageMatchingKey)
                    messageMatchingKey = request.body.messageMatchingKey;

                let context;
                if (request.body.options) {
                    options = request.body.options;
                }
    
                context = await ops.throwMessage(self.getUser(request), messageId, data, messageMatchingKey, options);
                if (context)
                    response.json(context.instance);
                else
                    response.json({});

            }
            catch (exc) {
                console.log(exc);
                response.json({ errors: exc.toString() });
            }
        }));

        router.post('/engine/startEvent', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let instanceId, data,startNodeId,userName,options;
            if (request.body.instanceId) {
                instanceId = request.body.instanceId;
            }
            if (request.body.startNodeId) {
                startNodeId = request.body.startNodeId;
            }
    
            if (request.body.data) {
                data = request.body.data;
            }
            if (request.body.options) {
                options = request.body.options;
            }
    
            let context;
            let instance;
            let errors;
            try {
                context = await ops.startEvent(self.getUser(request), instanceId, startNodeId, { data, options });
                //context = await this.bpmnServer.engine.restart(query, data,userName,options );
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
    
    
/*
 *  engine.throwSignal     - issue a signal by id
 *  ------------------
 *      same as message except multiple receipients
 */

        router.post('/engine/throwSignal', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            try {
                let signalId = request.body.signalId;
                //console.log(' Signal Id: ' + signalId);
                let data = request.body.data;
                let options={};
                let messageMatchingKey = {};

                if (request.body.messageMatchingKey)
                    messageMatchingKey = request.body.messageMatchingKey;
                let context;

                if (request.body.options) {
                    options = request.body.options;
                }

                context = await ops.throwSignal(self.getUser(request), signalId, data, messageMatchingKey, options);
                response.json(context);
            }
            catch (exc) {
                console.log(exc);
                response.json({ errors: exc.toString() });
            }
        }));


        // an unknown API path is the caller's mistake: answer it here, not with the UI's login redirect
        router.use((request, response) => response.status(404).json({ errors: `No API route ${request.method} ${request.originalUrl.split('?')[0]}` }));
        return router;
    }

    /** Model administration is mounted separately under /admin/api2. */
    adminConfig() {
        const router = express.Router();
        guardModelParams(router);
        const bpmnServer = this.bpmnServer;
        const ops = new Operations(this.bpmnServer);
        const self = this;

        //// ---------------------  Model -----------------------

//        save(name, source, svg, user?: ISecureUser);
//        getSource(name, user?: ISecureUser);
//        export(query, folder, user?: ISecureUser) ;
       
        router.post('/model/import{/:name}', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let name = (request.params as any).name;
            if (!name)
                name = request.body.name;
            //console.log(' importing: ' + name);
            //console.log('request', request);
            //console.log('request.body',request.body);

            var fstream;
            var files=[];

            try {
                if (request.busboy) {
                    request.pipe(request.busboy);
                    request.busboy.on('file', function (fileUploaded, file, filename) {
                         // no longer writing to tmp
                        //Path where image will be uploaded
                        //const filepath = __dirname + '/../tmp/' + filename.filename;
                        var contents='';
                        file.on('data', (data) => {
                            contents+=data;
                            console.log(`File [${filename.filename}] got ${data.length} bytes`);
                        }).on('close', () => {
                            console.log(`File [${filename.filename}] done`);
                            files.push(contents);
                        });

//                        file.pipe(fsx.createWriteStream(filepath));
//                        const fileC= fsx.readFileSync(filepath,{ encoding: 'utf8', flag: 'r' });
//                        files.push(fileC);
                        });
                    request.busboy.on('finish',  async function () {
                        var bpmnFile,svgFile=null;
                        bpmnFile=files[0];
                        
                        if (files.length>1)
                            svgFile= files[1];

                        try {
                            const saved = await ops.saveModel(self.getUser(request), name, bpmnFile, svgFile);
                            if (saved === false) {
                                response.status(403).json({ errors: 'Model modification denied' });
                                return;
                            }
                            }
                        catch(exc)
                            {
                            if (sendModelRejection(response, exc)) return;
                            console.log('error in api.ts import ',exc.message,exc);
                            response.json({errors:  exc.message});
                            return;
                            }

                        response.json("OK");

                    });
                }
                else {
                   response.json("No file to import");
                }

            }
            catch (exc) {

                    console.log('request.pipe error:', exc);
                    response.json(exc);
                }

        }));


        router.post('/model/rename', loggedIn, async function (req, response) {

            let name = req.body.name;
            let newName = req.body.newName;
            //console.log('renaming ', name, newName);
            try {
                var ret = await ops.renameModel(self.getUser(req), name, newName);
                //console.log('ret:',ret);
                response.json(ret);
            }
            catch (exc) {
                console.log('error:',exc);
                response.json({ errors: exc.toString() });
            }
        });

        router.post('/model/delete', loggedIn, async function (req, response) {

            let name = req.body.name;
            //console.log('deleting ', name);
            try {
                var ret = await ops.deleteModel(self.getUser(req), name);
                //console.log('ret: ',ret);
                response.json(ret);
            }
            catch (exc) {
                console.log('error:', exc);
                response.json({ errors: exc.toString()});
            }
        });

        router.get('/model/list', loggedIn, async function (req, response) {

            let query=req.body?.query ?? {};   // GET requests may carry no body
            
            let list = await ops.listModels(self.getUser(req), query);
            //console.log(list);
            response.json(list);
        });
        router.get('/model/findEvents', loggedIn, async function (req, response) {

            let query=req.body?.query ?? {};   // GET requests may carry no body
            let list = await ops.findEvents(self.getUser(req), query);
            response.json(list);
        });
        router.get('/model/findStartEvents', loggedIn, async function (req, response) {

            let query=req.body?.query ?? {};   // GET requests may carry no body
            let list = await ops.findStartEvents(self.getUser(req), query);
            response.json(list);
        });
        router.get('/model/load{/:name}', loggedIn, self.requireSystem, async function (request, response) {

            //console.log(request.params);
            let name = (request.params as any).name;

            response.json(await ops.modelJson(self.getUser(request), name));
        });

        router.put('/rules/invoke', loggedIn, awaitAppDelegateFactory(async (request, response) => {
            // evaluate a decision of the models folder: { decision, data } -> { decision, file, result }
            try {
                response.json(await ops.invokeRules(self.getUser(request), request.body));
            }
            catch (exc) {
                response.status(400).json({ errors: exc.message || String(exc) });
            }
        }));
        // an unknown API path is the caller's mistake: answer it here, not with the UI's login redirect
        router.use((request, response) => response.status(404).json({ errors: `No API route ${request.method} ${request.originalUrl.split('?')[0]}` }));
        return router;
    }
}
