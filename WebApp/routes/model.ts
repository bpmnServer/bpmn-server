/*
 * GET users listing.
 */
import express = require('express');
import { Modeller } from '../views/Modeller';
var bodyParser = require('body-parser')

const FS = require('fs');

import { BPMNServer, dateDiff, Behaviour_names } from '../';
const config = require('../configuration.js').configuration;


const bpmnServer = new BPMNServer(config);

const definitions = bpmnServer.definitions;
const router = express.Router();


const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

    router.get('/:process', awaitHandlerFactory(async (request, response) => {
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
        let view = new Modeller();

        view.display(processName,request, response);

    }));

    router.post('/:process', awaitHandlerFactory(async (request, response) => {
        console.log(" modeller posted");

        let body = request.body;

        let name = body.processId;
        let bpmn = body.bpmn;
        let svg = body.svg;

        await definitions.save(name, bpmn, svg);
        console.log(" save completed");

//        console.log(request);
        response.status(200).send("");
    }));

    router.get('/getSvg/:process', awaitHandlerFactory(async (request, response) => {

        let processName = request.params.process;
        let fileName = __dirname + '/../processes/' + processName + '.svg';

        let svg = await definitions.getSVG(processName);

        response.header("Content-Type", "image/svg+xml");
        response.send(svg);

    }));




export default router;