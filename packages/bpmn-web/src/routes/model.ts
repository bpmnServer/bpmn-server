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

import { BPMNServer, BPMNAdminAPI, verifyModel, Definition } from '../index.js';
import { Common } from './common.js';
import { modelNameGuard, isSafeModelName } from './middleware/modelName.js';
import { loadTemplateCatalog } from './elementTemplates.js';
import { loadScenarios, saveScenarios, checkScenarios, runScenario, startTest, completeTest, findTest, summarize, expectChecks, checksAt, setTestData, restartTest } from '../testing/scenarios.js';


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
                // a model without diagram information (written by hand or by another tool) is laid out to be
                // drawn; it is saved with the layout only when the designer saves it
                if (!/<(\w+:)?BPMNDiagram[\s>]/.test(xml)) {
                    try {
                        xml = await layoutProcess(xml);
                    } catch (exc) {
                        console.log('auto-layout error:', exc);
                    }
                }
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
        // the models' names, for the editor's model drop-down
        router.get('/names', awaitHandlerFactory(async (request, response) => {
            const names = (await bpmnServer.definitions.getList({})).map(m => m.name ?? m).sort((a, b) => String(a).localeCompare(String(b)));
            response.json({ names });
        }));
        // the editor's element templates; read on each request, so a template added to the folder shows on reload
        router.get('/templates', awaitHandlerFactory(async (request, response) => {
            let services;
            try {
                services = await bpmnServer.appDelegate.getServicesProvider(null);
            }
            catch (exc) {
                services = undefined;   // a provider that needs a running execution: service names are not checked
            }
            const catalog = loadTemplateCatalog(this.webApp.application?.elementTemplatesPath, services);
            for (const rejected of catalog.rejected)
                console.log(`element template ${rejected.file} ${rejected.id ?? ''} left out: ${rejected.problems.join('; ')}`);
            response.json(catalog);
        }));

        /**
         * How bpmn-server reads each element of a model, as the instance page's Model documentation shows it
         * (Definition.getJson): id -> [label, value] lines from the elements' and their behaviours' describe().
         * Empty when the model does not load (verifyModel says why).
         */
        async function describeModel(name: string, source: string) {
            const descriptions: Record<string, string[][]> = {};
            const text = value => String(value ?? '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
            const add = (id, lines) => {
                const clean = (lines || []).filter(Array.isArray).map(([label, value]) => [text(label), text(value)]).filter(([, value]) => value);
                if (id && clean.length)
                    descriptions[id] = [...(descriptions[id] || []), ...clean];
            };
            try {
                const definition = new Definition(name, source, bpmnServer);
                await definition.load();
                definition.processes.forEach(proc => add(proc.id, proc.describe()));
                definition.nodes.forEach(node => {
                    add(node.id, node.describe());
                    node.behaviours.forEach(behaviour => add(node.id, behaviour.describe()));
                });
                definition.flows.forEach(flow => add(flow.id, flow.describe()));
            }
            catch (exc) {
                return {};
            }
            return descriptions;
        }

        /**
         * The names of the application's services, for completion in the editor's scripts (appServices.…):
         * functions and properties of the services provider, its classes included, and one level into objects.
         */
        // ---- modeling rules (bpmnlint): the team's changes to the editor's rules, `bpmnlint.json` in the models
        // folder: { rules: { '<rule>': 'off' | 'info' | 'warn' | 'error' } }. The same for every designer, and
        // `npm run lint:models` applies them too.
        const LINT_FILE = 'bpmnlint.json';
        const LINT_LEVELS = ['off', 'info', 'warn', 'error'];
        const lintFile = () => path.join(bpmnServer.configuration.definitionsPath, LINT_FILE);

        router.get('/lint-rules', awaitHandlerFactory(async (request, response) => {
            let rules = {};
            try {
                rules = JSON.parse(FS.readFileSync(lintFile(), 'utf8')).rules || {};
            } catch {
                rules = {};     // none changed, or a file that can not be read: the editor's defaults
            }
            response.json({ rules });
        }));

        router.put('/lint-rules', awaitHandlerFactory(async (request, response) => {
            const rules = request.body && request.body.rules;
            if (!rules || typeof rules !== 'object' || Array.isArray(rules))
                return response.status(400).json({ errors: "Send { rules: { '<rule>': 'off' | 'info' | 'warn' | 'error' } }" });
            for (const [name, level] of Object.entries(rules))
                if (!/^[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)?$/.test(name) || !LINT_LEVELS.includes(level as string))
                    return response.status(400).json({ errors: `Rule '${name}': '${level}' is not one of ${LINT_LEVELS.join(', ')}` });
            FS.writeFileSync(lintFile(), JSON.stringify({ rules }, null, 2) + '\n');
            response.json({ rules });
        }));

        // ---- decisions (DMN): files `<name>.dmn.xml` in the models folder, as business rule tasks name them
        const DMN_FILE = /\.dmn(\.xml)?$/i;
        const decisionFiles = () => {
            try {
                return FS.readdirSync(bpmnServer.configuration.definitionsPath).filter(f => DMN_FILE.test(f));
            } catch {
                return [];
            }
        };
        /** The file of decision `name`: the existing one (either extension), else `<name>.dmn.xml`. */
        const decisionFile = (name: string) =>
            decisionFiles().find(f => f.replace(DMN_FILE, '') === name) || `${name}.dmn.xml`;

        router.get('/decisions', awaitHandlerFactory(async (request, response) => {
            // the files and their XML: the editor reads their decisions, inputs and outputs
            const decisions = decisionFiles().map(file => ({
                name: file.replace(DMN_FILE, ''), file,
                xml: FS.readFileSync(path.join(bpmnServer.configuration.definitionsPath, file), 'utf8')
            }));
            response.json({ decisions });
        }));

        router.get('/decision/:decision', awaitHandlerFactory(async (request, response) => {
            const name = request.params.decision;
            if (!isSafeModelName(name))
                return response.status(400).send('Invalid decision name');
            const file = path.join(bpmnServer.configuration.definitionsPath, decisionFile(name));
            const exists = FS.existsSync(file);
            const xml = exists ? FS.readFileSync(file, 'utf8') : newDecision(name);
            response.render('decision', {
                name, exists,
                modelJson: JSON.stringify(xml).replace(/</g, '<'),
                cspHost: process.env.ITSM_HOST,
            });
        }));

        router.post('/decision/:decision', awaitHandlerFactory(async (request, response) => {
            const name = request.params.decision;
            const xml = request.body && request.body.xml;
            if (!isSafeModelName(name))
                return response.status(400).json({ errors: 'Invalid decision name' });
            if (typeof xml !== 'string' || !/<(\w+:)?definitions[\s>]/.test(xml))
                return response.status(400).json({ errors: 'Not a DMN file' });
            FS.writeFileSync(path.join(bpmnServer.configuration.definitionsPath, decisionFile(name)), xml);
            response.json({ saved: decisionFile(name) });
        }));

        router.get('/services', awaitHandlerFactory(async (request, response) => {
            let provider;
            try {
                provider = await bpmnServer.appDelegate.getServicesProvider(null);
            }
            catch (exc) {
                provider = null;    // a provider that needs a running execution
            }
            const names = (obj) => {
                const found = new Set<string>();
                for (let o = obj; o && o !== Object.prototype && o !== Function.prototype; o = Object.getPrototypeOf(o))
                    for (const key of Object.getOwnPropertyNames(o))
                        if (key !== 'constructor' && !key.startsWith('_')) found.add(key);
                return [...found];
            };
            const services = [];
            if (provider && typeof provider === 'object') {
                for (const name of names(provider)) {
                    let value;
                    try { value = provider[name]; } catch { continue; }
                    services.push({ name, kind: typeof value === 'function' ? 'function' : 'property' });
                    if (value && typeof value === 'object' && !Array.isArray(value) && name !== 'appDelegate')
                        for (const inner of names(value).slice(0, 50))
                            services.push({ name: `${name}.${inner}`, kind: typeof value[inner] === 'function' ? 'function' : 'property' });
                }
            }
            response.json({ services });
        }));

        // ---- the editor's Test tab: scenarios per model, run on the saved model

        router.get('/scenarios/:process', awaitHandlerFactory(async (request, response) => {
            response.json({ scenarios: await loadScenarios(request.params.process) });
        }));
        router.put('/scenarios/:process', awaitHandlerFactory(async (request, response) => {
            const scenarios = request.body?.scenarios;
            const problems = checkScenarios(scenarios);
            if (problems.length) {
                response.status(400).json({ error: problems.join('; ') });
                return;
            }
            await saveScenarios(request.params.process, scenarios, request.user?.userName);
            response.json({ saved: scenarios.length });
        }));
        /** Run a scenario given in the body, or every saved scenario of the model (all: true). */
        router.post('/test/run', awaitHandlerFactory(async (request, response) => {
            const { processName, scenario, all } = request.body ?? {};
            const scenarios = all ? await loadScenarios(processName) : [scenario];
            const problems = checkScenarios(scenarios);
            if (!processName || problems.length) {
                response.status(400).json({ error: processName ? problems.join('; ') : 'processName is required' });
                return;
            }
            const results = [];
            for (const one of scenarios)      // one after another: they may share application state
                results.push(await runScenario(bpmnServer, processName, one, request.user?.userName));
            response.json({ results });
        }));
        /** Recording: start, then complete waiting items one at a time. */
        router.post('/test/start', awaitHandlerFactory(async (request, response) => {
            const { processName, startNodeId, data } = request.body ?? {};
            try {
                response.json({ instance: summarize(await startTest(bpmnServer, processName, startNodeId, data ?? {}, request.user?.userName)) });
            } catch (exc) {
                response.status(422).json({ error: String(exc?.message ?? exc) });
            }
        }));
        router.post('/test/invoke', awaitHandlerFactory(async (request, response) => {
            const { instanceId, itemId, data } = request.body ?? {};
            if (!String(instanceId || '').startsWith('test-')) {
                response.status(400).json({ error: 'only test instances are completed here' });
                return;
            }
            try {
                response.json({ instance: summarize(await completeTest(bpmnServer, instanceId, itemId, data ?? {}, request.user?.userName)) });
            } catch (exc) {
                response.status(422).json({ error: String(exc?.message ?? exc), instance: summarize(await findTest(bpmnServer, instanceId).catch(() => null)) });
            }
        }));

        /** A test instance, as the Test tab shows it: a scenario's earlier run. */
        router.get('/test/instance/:id', awaitHandlerFactory(async (request, response) => {
            const id = request.params.id;
            const instance = id.startsWith('test-') ? await findTest(bpmnServer, id) : null;
            if (!instance) {
                response.status(404).json({ error: 'no such test instance' });
                return;
            }
            response.json({ instance: summarize(instance) });
        }));
        /** A run deleted: its test instance removed from the database (test instances only). */
        router.delete('/test/instance/:id', awaitHandlerFactory(async (request, response) => {
            const id = request.params.id;
            if (!id.startsWith('test-')) {
                response.status(400).json({ error: 'only test instances are deleted here' });
                return;
            }
            await bpmnServer.dataStore.deleteInstances({ id });
            response.json({ deleted: id });
        }));

        /**
         * A scenario's checks on a test instance run step by step: at the end (the default), or after a step
         * (after: { element, name }): those of `checks` (and the older `expect`) due then.
         */
        router.post('/test/check', awaitHandlerFactory(async (request, response) => {
            const { instanceId, expect, checks, after } = request.body ?? {};
            const instance = String(instanceId || '').startsWith('test-') ? await findTest(bpmnServer, instanceId) : null;
            if (!instance) {
                response.status(404).json({ error: 'no such test instance' });
                return;
            }
            const all = [...expectChecks(expect), ...(Array.isArray(checks) ? checks : [])];
            response.json({ checks: checksAt(all, after?.element ? after : 'end', instance), instance: summarize(instance) });
        }));

        /** The debugger: a test instance's data replaced (the next steps run with it). */
        router.post('/test/data', awaitHandlerFactory(async (request, response) => {
            const { instanceId, data } = request.body ?? {};
            if (!String(instanceId || '').startsWith('test-')) {
                response.status(400).json({ error: 'only test instances are changed here' });
                return;
            }
            try {
                response.json({ instance: summarize(await setTestData(bpmnServer, instanceId, data)) });
            } catch (exc) {
                response.status(422).json({ error: String(exc?.message ?? exc) });
            }
        }));

        /** The debugger's Restart here: the test instance back at an item, with the variables given (data). */
        router.post('/test/restart', awaitHandlerFactory(async (request, response) => {
            const { instanceId, itemId, data } = request.body ?? {};
            if (!String(instanceId || '').startsWith('test-')) {
                response.status(400).json({ error: 'only test instances are restarted here' });
                return;
            }
            try {
                response.json({ instance: summarize(await restartTest(bpmnServer, instanceId, itemId, data, request.user?.userName)) });
            } catch (exc) {
                response.status(422).json({ error: String(exc?.message ?? exc), instance: summarize(await findTest(bpmnServer, instanceId).catch(() => null)) });
            }
        }));

        // the editor's Problems list: checks the model being edited, as sent, without saving it
        router.post('/verify', awaitHandlerFactory(async (request, response) => {
            const { bpmn, processName } = request.body ?? {};
            if (typeof bpmn !== 'string') {
                response.status(400).json({ error: 'bpmn (the model XML) is required' });
                return;
            }
            const name = processName || 'model';
            const [result, descriptions] = await Promise.all([verifyModel(bpmn, bpmnServer, name), describeModel(name, bpmn)]);
            response.json({ ...result, descriptions });
        }));
        return router;
    }
}

/** A new decision file: one decision table, named for the file, with an input, an output and a rule to start from. */
function newDecision(name: string): string {
    const id = /^[A-Za-z_]/.test(name) ? name.replace(/[^\w.-]/g, '_') : 'decision_' + name.replace(/[^\w.-]/g, '_');
    const label = name.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="${id}_definitions" name="${label}" namespace="http://bpmn-server/dmn">
  <decision id="${id}" name="${label}">
    <decisionTable id="${id}_table" hitPolicy="FIRST">
      <input id="${id}_input1" label="Input">
        <inputExpression id="${id}_inputExpression1" typeRef="string">
          <text>input1</text>
        </inputExpression>
      </input>
      <output id="${id}_output1" label="Output" name="output1" typeRef="string" />
      <rule id="${id}_rule1">
        <inputEntry id="${id}_rule1_in1"><text>-</text></inputEntry>
        <outputEntry id="${id}_rule1_out1"><text>"value"</text></outputEntry>
      </rule>
    </decisionTable>
  </decision>
  <dmndi:DMNDI>
    <dmndi:DMNDiagram id="${id}_diagram">
      <dmndi:DMNShape id="${id}_shape" dmnElementRef="${id}">
        <dc:Bounds height="80" width="180" x="160" y="100" />
      </dmndi:DMNShape>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>
`;
}
