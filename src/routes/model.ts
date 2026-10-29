/*
 * GET users listing.
 */
import express from 'express';
import { ModelerNoProp } from '../views/Modeler-noProp.js';
import { ModelerWProp } from '../views/Modeler-wProp.js';
import { ViewHelper } from './ViewHelper.js';

import FS from 'node:fs';
import path from 'node:path';
import { layoutProcess } from 'bpmn-auto-layout';
import { bpmnToSvg } from './bpmnToSvg.js';

import { BPMNServer, BPMNAdminAPI, verifyModel } from '../index.js';
import { Common } from './common.js';
import { modelNameGuard, isSafeModelName } from './middleware/modelName.js';


const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}
var bpmnAPI;

export class Model extends Common {
    config() {

        const bpmnServer = this.webApp.bpmnServer;

        const definitions = bpmnServer.definitions;
        bpmnAPI = new BPMNAdminAPI(bpmnServer);   // the designer reads and saves models


        var router = express.Router();

        // Deny-by-default: model designer routes require a session, as a designer (or administrator).
        router.use(this.isAuthenticated, this.isDesigner, modelNameGuard);

        router.get('/list', awaitHandlerFactory(async (request, response) => {

            let procs=await ViewHelper.getProcs(bpmnAPI);
            let procsDocs=ViewHelper.getProcsDocs(procs);
            
            response.render('models/list', {procs,request, procsDocs: JSON.stringify(procsDocs)});

        }));

        router.get('/new', awaitHandlerFactory(async (request, response) => {

            response.render('models/add');

        }));
        router.post('/new', awaitHandlerFactory(async (request, response) => {

            let processName = request.body.processName;
            request.session.processName = processName;

            response.redirect('/model/add/' + processName);
        }));
        router.get('/addNoProp/:process', awaitHandlerFactory(async (request, response) => {

            let processName = request.params.process;

            console.log('adding ' + processName);

            let view = new ModelerNoProp(bpmnServer);

            view.displayNew(processName, request, response);

        }));
        router.get('/add/:process', awaitHandlerFactory(async (request, response) => {

            let processName = request.params.process;
            request.session.processName = processName;

            console.log('adding ' + processName);

            let view = new ModelerWProp();

            view.displayNew(processName, request, response);

        }));
        router.get('/export', awaitHandlerFactory(async (request, response) => {
            console.log(request.params);
            let procs = await bpmnServer.definitions.getList();
            response.render('models/export', { procs});

        }));
        router.get('/download/:file', awaitHandlerFactory(async (request, response) => {
            // basename() defeats traversal via encoded separators in the param
            const safeFile = path.basename(request.params.file);
            const filePath = bpmnServer.configuration.definitionsPath + safeFile;

            response.download(filePath); // Set disposition and send it.

        }));

        router.get('/import', awaitHandlerFactory(async (request, response) => {
            console.log(request.params);
            response.render('models/import');

        }));


        router.post('/import', awaitHandlerFactory(async (req, res) => {

            try
                {
                   req.pipe(req.busboy);
                }
                catch(exc)
                {
                    console.log(exc);
                }
            req.busboy.on('file', function (fileUploaded, file, filename) {
                console.log("Uploading: ",filename);

                // Strip any path components from the client-supplied filename to prevent
                // path traversal (e.g. "../../app.ts") writing outside the tmp folder.
                const safeName = path.basename(filename.filename);
                if (!isSafeModelName(safeName)) {
                    res.status(400).send('Invalid model name');
                    file.resume();
                    return;
                }
                // read the upload in memory: no temp folder (dist/tmp does not exist in a build)
                const chunks = [];
                file.on('data', chunk => chunks.push(chunk));
                file.on('end', async function () {
                    console.log("Upload Finished of " + safeName);
                    const name = safeName.replace(/\.(bpmn|xml)$/i, '');   // the model's name, not the file's: saved as <name>.bpmn
                    let source = Buffer.concat(chunks).toString('utf8');

                    // files without diagram information (BPMN DI) can't be drawn by the modeler
                    if (!/<(\w+:)?BPMNDiagram[\s>]/.test(source)) {
                        try {
                            source = await layoutProcess(source);
                        }
                        catch (exc) {
                            console.log('auto-layout error:', exc);
                        }
                    }

                    let svg = null;
                    try {
                        svg = await bpmnToSvg(source);
                    }
                    catch (exc) {
                        console.log('svg render error:', exc);
                    }

                    try {
                    await definitions.save(name, source, svg);
                    req.session.processName = name;     // focus the imported model on the home page
                    }
                    catch(exc)
                    {
                        console.log('save error:',exc);
                    }

                    res.redirect('/');

                });
            });


        }));


        router.get('/delete/:process', awaitHandlerFactory(async (request, response) => {
            response.render('models/delete', { processName: request.params.process });

        }));
        router.post('/delete', awaitHandlerFactory(async (request, response) => {

            let process = request.body.processName;
            await definitions.deleteModel(process);
            console.log('deleting ' + process);
            response.redirect('/');

        }));
        router.post('/rename', awaitHandlerFactory(async (request, response) => {

            let process = request.body.processName;
            let newName = request.body.newName;
            await definitions.renameModel(process, newName);
            console.log('renamed ' + process + " to " + newName);
            response.redirect('/');

        }));
        router.get('/rename/:process', awaitHandlerFactory(async (request, response) => {

            response.render('models/rename', { processName: request.params.process });

        }));
        router.get('/editNoProp/:process', awaitHandlerFactory(async (request, response) => {
            let output = [];

            console.log('model.ts/:process ');
            let xml, base_url, title, processName;

            processName = request.params.process;
            xml = await definitions.getSource(processName);
            title = processName;

            let view = new ModelerNoProp(bpmnServer);

            view.display(processName, request, response);

        }));
        router.get('/edit/:process', awaitHandlerFactory(async (request, response) => {
            let output = [];

            console.log('model.ts/:process ');
            let xml, base_url, title, processName;

            processName = request.params.process;
            request.session.processName = processName;
            try {
                xml = await definitions.getSource(processName);
            } catch (exc) {
                xml = `
                    <?xml version="1.0" encoding="UTF-8"?>
                    <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
                      <bpmn2:process id="Process_1" isExecutable="false">
                        <bpmn2:startEvent id="StartEvent_1" />
                      </bpmn2:process>
                      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
                        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
                          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                            <dc:Bounds x="412" y="240" width="36" height="36" />
                          </bpmndi:BPMNShape>
                        </bpmndi:BPMNPlane>
                      </bpmndi:BPMNDiagram>
                    </bpmn2:definitions>
                `;
            }
            title = processName;

            let view = new ModelerWProp();

            response.setHeader('Content-Security-Policy', `frame-ancestors 'self' ${process.env.ITSM_HOST}`);
            view.display(processName,xml, request, response);

        }));
        router.post('/addNoProp{/:process}', awaitHandlerFactory(async (request, response) => {

            let body = request.body;

            let name = body.processId;
            let bpmn = body.bpmn;
            let svg = body.svg;

            await definitions.save(name, bpmn, svg);
            console.log(" save completed");

            //        console.log(request);
            response.status(200).send("");
        }));
        router.post('/add{/:process}', awaitHandlerFactory(async (request, response) => {

            let body = request.body;

            let name = body.processId;
            request.session.processName = name;
            let bpmn = body.bpmn;
            let svg = body.svg;

            await definitions.save(name, bpmn, svg);
            console.log(" save completed");

            //        console.log(request);
            response.status(200).send("");
        }));


        router.post('/editNoProp/:process', awaitHandlerFactory(async (request, response) => {

            let body = request.body;

            let name = body.processId;
            let bpmn = body.bpmn;
            let svg = body.svg;

            await definitions.save(name, bpmn, svg);
            console.log(" save completed");

            //        console.log(request);
            response.status(200).send("");
        }));
        router.post('/edit/:process', awaitHandlerFactory(async (request, response) => {

            console.log('edit/process request.body', request.params, request.query)
            let body = request.body;

            let name = body.processId;
            request.session.processName = name;
            let bpmn = body.bpmn;
            let svg = body.svg;

            await definitions.save(name, bpmn, svg);
            console.log(" save completed");

            //        console.log(request);
            response.status(200).send("");
        }));


        router.get('/getSvg/:process', awaitHandlerFactory(async (request, response) => {

            let processName = request.params.process;
            let fileName = import.meta.dirname + '/../processes/' + processName + '.svg';

            let svg = await definitions.getSVG(processName);
            if (!svg) {     // models saved without a preview, e.g. imported before previews were generated
                try {
                    svg = await bpmnToSvg(await definitions.getSource(processName));
                }
                catch (exc) {
                    console.log('svg render error:', exc);
                }
            }

            response.header("Content-Type", "image/svg+xml");
            response.send(svg);

        }));
        // the editor's Problems list: checks the model being edited, as sent, without saving it
        router.post('/verify', awaitHandlerFactory(async (request, response) => {
            const { bpmn, processName } = request.body ?? {};
            if (typeof bpmn !== 'string') {
                response.status(400).json({ error: 'bpmn (the model XML) is required' });
                return;
            }
            response.json(await verifyModel(bpmn, bpmnServer, processName || 'model'));
        }));
        return router;
    }
}
