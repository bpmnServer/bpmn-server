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
/*
 * GET users listing.
 */
const express = require("express");
const Modeller_1 = require("../views/Modeller");
var bodyParser = require('body-parser');
const FS = require('fs');
const __1 = require("../");
const config = require('../configuration.js').configuration;
const bpmnServer = new __1.BPMNServer(config);
const definitions = bpmnServer.definitions;
const router = express.Router();
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
router.get('/:process', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let output = [];
    const config = require('../configuration.js').configuration;
    let xml, base_url, title, processName;
    processName = request.params.process;
    xml = definitions.getSource(processName);
    title = processName;
    /*
    response.render('modeller',
        {
            processName,
            xml,
            title
        });

    */
    let view = new Modeller_1.Modeller();
    view.display(processName, request, response);
})));
router.post('/:process', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(" modeller posted");
    let body = request.body;
    let name = body.processId;
    let bpmn = body.bpmn;
    let svg = body.svg;
    yield definitions.save(name, bpmn, svg);
    console.log(" save completed");
    //        console.log(request);
    response.status(200).send("");
})));
router.get('/getSvg/:process', awaitHandlerFactory((request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let processName = request.params.process;
    let fileName = __dirname + '/../processes/' + processName + '.svg';
    let svg = yield definitions.getSVG(processName);
    response.header("Content-Type", "image/svg+xml");
    response.send(svg);
})));
exports.default = router;
//# sourceMappingURL=model.js.map