"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
/*
 * GET users listing.
 */
const express = require("express");
const Modeler_noProp_1 = require("../views/Modeler-noProp");
const Modeler_wProp_1 = require("../views/Modeler-wProp");
var bodyParser = require('body-parser');
const FS = require('fs');
const common_1 = require("./common");
const awaitHandlerFactory = (middleware) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield middleware(req, res, next);
        }
        catch (err) {
            next(err);
        }
    });
};
class Model extends common_1.Common {
    config() {
        const config = require('../configuration.js').configuration;
        const bpmnServer = this.webApp.bpmnServer;
        const definitions = bpmnServer.definitions;
        var router = express.Router();
        router.get('/new', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            response.render('models/add');
        })));
        router.post('/new', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let processName = request.body.processName;
            request.session.processName = processName;
            response.redirect('/model/add/' + processName);
        })));
        router.get('/addNoProp/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let processName = request.params.process;
            console.log('adding ' + processName);
            let view = new Modeler_noProp_1.ModelerNoProp(bpmnServer);
            view.displayNew(processName, request, response);
        })));
        router.get('/add/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let processName = request.params.process;
            request.session.processName = processName;
            console.log('adding ' + processName);
            let view = new Modeler_wProp_1.ModelerWProp();
            view.displayNew(processName, request, response);
        })));
        router.get('/export', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log(request.params);
            let procs = yield bpmnServer.definitions.getList();
            response.render('models/export', { procs });
        })));
        router.get('/download/:file', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log(request.params.file);
            const filePath = config.definitionsPath + request.params.file;
            console.log('filePath:' + filePath);
            response.download(filePath); // Set disposition and send it.
        })));
        router.get('/import', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log(request.params);
            response.render('models/import');
        })));
        var fsx = require('fs-extra'); //File System - for file manipulation
        router.post('/import', awaitHandlerFactory((req, res) => __awaiter(this, void 0, void 0, function* () {
            var fstream;
            try {
                req.pipe(req.busboy);
            }
            catch (exc) {
                console.log(exc);
            }
            req.busboy.on('file', function (fileUploaded, file, filename) {
                console.log("Uploading: ", filename);
                //Path where image will be uploaded
                const filepath = __dirname + '/../tmp/' + filename.filename;
                fstream = fsx.createWriteStream(filepath);
                file.pipe(fstream);
                fstream.on('close', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        console.log("Upload Finished of " + filename.filename);
                        const name = filename.filename;
                        const source = fsx.readFileSync(filepath, { encoding: 'utf8', flag: 'r' });
                        try {
                            yield definitions.save(name, source, null);
                        }
                        catch (exc) {
                            console.log('save error:', exc);
                        }
                        res.redirect('/');
                    });
                });
            });
        })));
        router.get('/delete/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            response.render('models/delete', { processName: request.params.process });
        })));
        router.post('/delete', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let process = request.body.processName;
            yield definitions.deleteModel(process);
            console.log('deleting ' + process);
            response.redirect('/');
        })));
        router.post('/rename', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let process = request.body.processName;
            let newName = request.body.newName;
            yield definitions.renameModel(process, newName);
            console.log('renamed ' + process + " to " + newName);
            response.redirect('/');
        })));
        router.get('/rename/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            response.render('models/rename', { processName: request.params.process });
        })));
        router.get('/editNoProp/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let output = [];
            console.log('model.ts/:process ');
            const config = require('../configuration.js').configuration;
            let xml, base_url, title, processName;
            processName = request.params.process;
            xml = yield definitions.getSource(processName);
            title = processName;
            let view = new Modeler_noProp_1.ModelerNoProp(bpmnServer);
            view.display(processName, request, response);
        })));
        router.get('/edit/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let output = [];
            console.log('model.ts/:process ');
            const config = require('../configuration.js').configuration;
            let xml, base_url, title, processName;
            processName = request.params.process;
            request.session.processName = processName;
            xml = yield definitions.getSource(processName);
            title = processName;
            let view = new Modeler_wProp_1.ModelerWProp();
            view.display(processName, xml, request, response);
        })));
        router.post('/addNoProp/:process?', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let body = request.body;
            let name = body.processId;
            let bpmn = body.bpmn;
            let svg = body.svg;
            yield definitions.save(name, bpmn, svg);
            console.log(" save completed");
            //        console.log(request);
            response.status(200).send("");
        })));
        router.post('/add/:process?', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let body = request.body;
            let name = body.processId;
            request.session.processName = name;
            let bpmn = body.bpmn;
            let svg = body.svg;
            yield definitions.save(name, bpmn, svg);
            console.log(" save completed");
            //        console.log(request);
            response.status(200).send("");
        })));
        router.post('/editNoProp/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let body = request.body;
            let name = body.processId;
            let bpmn = body.bpmn;
            let svg = body.svg;
            let definitionsPath = bpmnServer.configuration.definitionsPath;
            let fullpath = definitionsPath + '/' + name + '.bpmn';
            fsx.writeFile(fullpath, bpmn, function (err) {
                if (err)
                    throw err;
                console.log(`Saved bpmn to ${fullpath}`);
            });
            yield definitions.save(name, bpmn, svg);
            console.log(" save completed");
            //        console.log(request);
            response.status(200).send("");
        })));
        router.post('/edit/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            console.log('edit/process request.body', request.params, request.query);
            let body = request.body;
            let name = body.processId;
            request.session.processName = name;
            let bpmn = body.bpmn;
            let svg = body.svg;
            let definitionsPath = bpmnServer.configuration.definitionsPath;
            let fullpath = definitionsPath + '/' + name + '.bpmn';
            fsx.writeFile(fullpath, bpmn, function (err) {
                if (err)
                    throw err;
                console.log(`Saved bpmn to ${fullpath}`);
            });
            yield definitions.save(name, bpmn, svg);
            console.log(" save completed");
            //        console.log(request);
            response.status(200).send("");
        })));
        router.get('/getSvg/:process', awaitHandlerFactory((request, response) => __awaiter(this, void 0, void 0, function* () {
            let processName = request.params.process;
            let fileName = __dirname + '/../processes/' + processName + '.svg';
            let svg = yield definitions.getSVG(processName);
            response.header("Content-Type", "image/svg+xml");
            response.send(svg);
        })));
        return router;
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map