import express from 'express';
import FS from 'node:fs';

import { BPMNServer, dateDiff, Behaviour_names   } from '../index.js';

//const bpmnServer = new BPMNServer(config);

//const definitions = bpmnServer.definitions;


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

import { apiKeyAuth as loggedIn } from './middleware/apiKeyAuth.js';
import { modelNameGuard } from './middleware/modelName.js';
import { Common } from './common.js';
import { invokeDecision } from './decisions.js';
import { ViewHelper } from './ViewHelper.js';
import { assertModelAcceptable, checkModel, sendModelRejection } from '../runtime/modelVerification.js';

export class API extends Common {
    get bpmnServer() { return this.webApp.bpmnServer; }
    config() {

        var router = express.Router();
        var bpmnServer = this.bpmnServer;

        router.use(['/definitions', '/model'], modelNameGuard);

        // the models' names, read-only (as /api2/model/list), so a client can list them with administration
        // off (DISABLE_ADMIN); changing models stays under /admin/api
        router.get('/definitions/list', loggedIn, async function (req, response) {
            response.json(await bpmnServer.definitions.getList());
        });

        // a model's BPMN XML, read-only: who may run a process may read what it does
        router.get('/definitions/load/:name', loggedIn, async function (request, response) {
            const name = (request.params as any).name;
            let source;
            try {
                source = await bpmnServer.definitions.getSource(name);
            } catch {
                response.status(404).json({ errors: `No process definition named ${name}` });
                return;
            }
            response.type('application/xml').send(source);
        });

        router.get('/status', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let status;
            let errors;
            try {
                status = await this.bpmnServer.status();
            }
            catch (exc) {
                errors = exc.toString();
                //console.log(errors);
            }
            response.json({ errors: errors, status });
        }));

        router.get('/datastore/findItems', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            //console.log(request.body);
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
                items = await this.bpmnServer.dataStore.findItems(query);
            }
            catch (exc) {
                errors = exc.toString();
                //console.log(errors);
            }
            response.json({ errors: errors, items });
        }));
        //option: 'summary' | 'full' | any = 'summary'

        router.post('/query', loggedIn, async (req, res) => {
            try {
                const query = req.body.query;
                var results = await this.bpmnServer.dataStore.findInstances(query,{
                    projection:    {name:1,status:1,data:1,
                        items:{elementId:1,seq:1,type:1,status:1} },
                        sort:{saved:-1}});
                        res.json(results);
            } catch (error) {
                console.error('POST /api/query failed:', error);
                res.status(500).json({ errors: 'query failed' });
            }
        });
        router.get('/datastore/findInstances', loggedIn, awaitAppDelegateFactory(async (request, response) => {


            //console.log(request.body);
            let query,projection='full';
            if (request.body?.query) {
                query = request.body.query;
            }
            else
                query = request.body;

            if (request.body.projection)
                projection=request.body.projection;

            let instances;
            let errors;
            try {

                instances = await this.bpmnServer.dataStore.findInstances(query,projection);
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, instances });
        }));
        router.get('/datastore/find', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let error, results = null;
            let {
                filter = {}, // filter object to match documents.   // e.g. { status: 'running' }
                projection = { name: 1, status: 1, data: 1, items: { elementId: 1, seq: 1, type: 1, status: 1 } }, // projection object to specify fields to return
                after,
                limit = 10,
                sort = { '_id': -1 }, // default sort by _id (descending)'},
                lastItem={},
                latestItem={},
                getTotalCount = false
              } = request.body ?? {};   // a GET may come without a body

              limit=Number.parseInt(limit); // ensure limit is a number
            
            try {

                results = await this.bpmnServer.dataStore.find({ filter, projection, after, limit, sort,lastItem,latestItem,getTotalCount});
                
            }
            catch (exc) {
                error = exc.toString();
                console.log(error);
            }
            if (!error && results && results.error) error = results.error;   // the store reports some failures as { error }
            response.json(error ? { errors: error } : results);
        }));
        router.get('/data/fieldInfo', loggedIn, awaitAppDelegateFactory(async (request, response) => {
    
                let id = request.query.id;
                let processName = request.query.processName;
                let elementId = request.query.elementId;
                let errors;
                
                const instances = await this.bpmnServer.dataStore.findInstances({ "items.id": id }, 'full');
                const instance = instances[0];
    
                let definition=await this.bpmnServer.definitions.loadFromInstance(instance);

                let { node, fields } =definition.getNodeInfo(elementId);

                let cache=[];
                let node2=
                JSON.stringify(node, (key, value) => {
                    if (typeof value === 'object' && value !== null) {
                      // Duplicate reference found, discard key
                      if (cache.includes(value)) return;
                  
                      // Store value in our collection
                      cache.push(value);
                    }
                    return value;
                  });
                cache=null;

                let data = ViewHelper.formatData(instance.data);
    
                response.json({ node: JSON.parse(node2),fields ,data });
            }));

        /*
            returns list of current instances running or ended
        */
        router.get('/engine/status', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            try {

                var list = [];
                (this.bpmnServer.cache.list() || []).forEach(exec => {   // this server's live executions
                    list.push({ instance: exec.instance, currentItem: exec.item.id,currentElement: exec.item.elementId, status: exec.instance.status });
                });
                response.json({cache:list,engine: this.bpmnServer.engine.status()});
            }
            catch (exc) {
                response.json({ errors: exc.toString() });
            }
        }));

        router.post('/engine/start{/:name}', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            try {
                let name = (request.params as any).name;
                if (!name)
                    name = request.body.name;
                //console.log(' starting ' + name);
                //console.log(request.body);
                let data = request.body.data;

                let startNodeId, options = {}, userName;
                if (request.body.startNodeId) {
                    startNodeId = request.body.startNodeId;
                }
                if (request.body.options) {
                    options = request.body.options;
                }

                if(options['userName'] !== undefined){
                    userName = options['userName']
                }else if (request.body.userName) {
                    userName = request.body.userName;
                }

                let context;
                //console.log(data,userName);
                context = await this.bpmnServer.engine.start(name, data, startNodeId, userName, options);
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

            if (request.body.userName) {
                userName= request.body.userName;
            }

            //console.log(query);
            let context;
            let instance;
            let errors;
            try {

                context = await this.bpmnServer.engine.assign(query, data, assignment, userName);
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
            let query, data,userName,options;
            if (request.body?.query) {
                query = request.body.query;
            }
            if (request.body.data) {
                data = request.body.data;
            }
            if (request.body.options) {
                options = request.body.options;
            }

            if (request.body.userName) {
                userName= request.body.userName;
            }

            let context;
            let instance;
            let errors;
            try {

                context = await this.bpmnServer.engine.invoke(query, data,userName,options );
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
        router.put('/engine/startEvent', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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

            if (request.body.userName) {
                userName= request.body.userName;
            }
            let context;
            let instance;
            let errors;
            try {
                context = await this.bpmnServer.engine.startEvent(instanceId, startNodeId, data,userName, options);
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



        router.put('/engine/restart', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let query, data,startNodeId,userName,options;
            if (request.body?.query) {
                query = request.body.query;
            }
            if (request.body.data) {
                data = request.body.data;
            }
            if (request.body.options) {
                options = request.body.options;
            }

            if (request.body.userName) {
                userName= request.body.userName;
            }
            let context;
            let instance;
            let errors;
            try {
                context = await this.bpmnServer.engine.restart(query, data,userName,options );
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
        router.get('/engine/get', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let query;
            if (request.body?.query) {
                query = request.body.query;
            }
            else
                query = request.body;

            //console.log("Query", query);
            let context;
            let instance;
            let errors;
            try {
                context = await this.bpmnServer.engine.get(query);
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
                //console.log(' MessageId ' + messageId);
                let data = request.body.data;
                let messageMatchingKey = {};

                if (request.body.messageMatchingKey)
                    messageMatchingKey = request.body.messageMatchingKey;

                let context;
                //console.log(data);

                context = await this.bpmnServer.engine.throwMessage(messageId, data, messageMatchingKey);
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
                let signalId = request.body.signalId;
                //console.log(' Signal Id: ' + signalId);
                let data = request.body.data;
                let messageMatchingKey = {};

                if (request.body.messageMatchingKey)
                    messageMatchingKey = request.body.messageMatchingKey;
                let context;

                context = await this.bpmnServer.engine.throwSignal(signalId, data, messageMatchingKey);
                response.json(context);
            }
            catch (exc) {
                console.log(exc);
                response.json({ errors: exc.toString() });
            }
        }));


        ///
        router.put('/engine/upgrade', loggedIn, awaitAppDelegateFactory(async (request, response) => {

            let model, nodeIds;
            if (request.body.model) {
                model = request.body.model;
            }
            if (request.body.nodeIds) {
                nodeIds = request.body.nodeIds;
            }
            let result;
            let errors;
            try {

                result = await this.bpmnServer.engine.upgrade(model, nodeIds );
                if (result && result.errors)
                    errors = result.errors.toString();
            }
            catch (exc) {
                errors = exc.toString();
                console.log(errors);
            }
            response.json({ errors: errors, result });

        }));


        // an unknown API path is the caller's mistake: answer it here, not with the UI's login redirect
        router.use((request, response) => response.status(404).json({ errors: `No API route ${request.method} ${request.originalUrl.split('?')[0]}` }));
        return router;
    }

    /** Definition administration is mounted separately under /admin/api. */
    adminConfig() {
        const router = express.Router();
        const bpmnServer = this.bpmnServer;
        const fsx = FS;

            router.post('/definitions/import{/:name}', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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
                                await assertModelAcceptable(bpmnServer, name, bpmnFile);
                                await bpmnServer.definitions.save(name, bpmnFile, svgFile, null, request.user?.userName);
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


            router.post('/definitions/rename', loggedIn, async function (req, response) {

                let name = req.body.name;
                let newName = req.body.newName;
                //console.log('renaming ', name, newName);
                try {
                    var ret = await bpmnServer.definitions.renameModel(name, newName);
                    //console.log('ret:',ret);
                    response.json(ret);
                }
                catch (exc) {
                    console.log('error:',exc);
                    response.json({ errors: exc.toString() });
                }
            });

            router.post('/definitions/delete', loggedIn, async function (req, response) {

                let name = req.body.name;
                //console.log('deleting ', name);
                try {
                    var ret = await bpmnServer.definitions.deleteModel(name);
                    //console.log('ret: ',ret);
                    response.json(ret);
                }
                catch (exc) {
                    console.log('error:', exc);
                    response.json({ errors: exc.toString()});
                }
            });

            router.get('/definitions/list', loggedIn, async function (req, response) {

                let list = await bpmnServer.definitions.getList();
                //console.log(list);
                response.json(list);
            });
            router.get('/definitions/load{/:name}', loggedIn, async function (request, response) {

                //console.log(request.params);
                let name = (request.params as any).name;

                try {
                    let definition = await bpmnServer.definitions.getSource(name);
                    response.send(definition);
                } catch (error) {
                    response.status(404).send(error);
                    return;
                }
            });

            router.post('/model/save', loggedIn, awaitAppDelegateFactory(async function (request, response) {

                const name = request.body.name;
                const bpmn = request.body.xml;
                const svg = '';
                try {
                    await assertModelAcceptable(bpmnServer, name, bpmn);
                }
                catch (exc) {
                    // the model editor's save: 422 (no bpmn-client caller)
                    if (sendModelRejection(response, exc, 422)) return;
                    throw exc;
                }
                await bpmnServer.definitions.save(name, bpmn, svg, null, (request.user as any)?.userName);
                console.log(" save completed");

                //        console.log(request);
                response.status(200).send("");

            }));

            // check a model without saving it: { name } for a saved model, or { source } (and an optional name)
            router.post('/definitions/verify', loggedIn, awaitAppDelegateFactory(async (request, response) => {
                const { name, source } = request.body ?? {};
                if (!source && !name) {
                    response.status(400).json({ errors: 'Give the model\'s name, or its source' });
                    return;
                }
                let xml = source;
                if (!xml) {
                    try {
                        xml = await bpmnServer.definitions.getSource(name);
                    }
                    catch {
                        response.status(404).json({ errors: `No model ${name}` });
                        return;
                    }
                }
                // always verified here, whatever VERIFY_MODELS_ON_IMPORT says
                const check = await checkModel(bpmnServer, name ?? 'model', xml, 'warn');
                response.json({
                    name: name ?? null,
                    valid: check.errors.length === 0,
                    errors: check.errors,
                    warnings: check.warnings,
                });
            }));

            router.delete('/datastore/deleteInstances', loggedIn, awaitAppDelegateFactory(async (request, response) => {

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
                    result = await this.bpmnServer.dataStore.deleteInstances(query);
                }
                catch (exc) {
                    errors = exc.toString();
                    console.log(errors);
                }
                response.json({ errors: errors, result });

            }));

            router.put('/rules/invoke', loggedIn, awaitAppDelegateFactory(async (request, response) => {
                // evaluate a decision of the models folder: { decision, data } -> { decision, file, result }
                try {
                    response.json(await invokeDecision(this.bpmnServer, request.body));
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
