import express = require('express');
const router = express.Router();
var bodyParser = require('body-parser')

const FS = require('fs');

import { BPMNServer   } from '..';
import { configuration as config} from '../configuration';
import { docsFolder } from '..';
import { Common } from './common';


/* GET users listing. */

const url = 'https://raw.githubusercontent.com/ralphhanna/bpmn-server/master/';

const https = require('https');

function getRemoteFile(file) {
    return new Promise(resolve => {


        https.get(url + file, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                //console.log(data);
                resolve(data);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });


    });


}



const awaitAppDelegateFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}

export class Docs extends Common {

    config() {
        var router = express.Router();

        router.get('/', function (request, response) {
            let fileName = '../README.md';
            return processFile(fileName, response);

        });
        router.get('/api/*/:fileName', awaitAppDelegateFactory(async (request, response) => {

            console.log('from docs');
            console.log(request.params);
            let folder = '';
            if (request.params[0])
                folder = request.params[0] + '/';
            console.log(folder);
            let fileName = 'api/' + folder + request.params.fileName;

            return processFile(fileName, response);
        }));
        router.get('/api/:fileName', awaitAppDelegateFactory(async (request, response) => {

            console.log('from docs');
            console.log(request.params);
            let fileName = 'api/' + request.params.fileName;

            return processFile(fileName, response);
        }));
        router.get('/examples/:fileName', awaitAppDelegateFactory(async (request, response) => {

            console.log('from docs');
            console.log(request.params);

            let fileName = 'examples/' + request.params.fileName;

            return processFile(fileName, response);
        }));

        router.get('/:fileName', awaitAppDelegateFactory(async (request, response) => {

            console.log('from docs');
            console.log(request.params);

            let fileName = request.params.fileName;

            return processFile(fileName, response);


        }));
        router.get('/readme_md', awaitAppDelegateFactory(async (request, response) => {

            let processName = request.params.process;
            let fileName = __dirname + '/../node_modules/bpmn-server/README.md';

            let file = FS.readFileSync(fileName,
                { encoding: 'utf8', flag: 'r' });

            response.send(file);

        }));
        return router;
    }
}
function processFile(fileName,response) {

    fileName = docsFolder + fileName;

    let file = FS.readFileSync(fileName);


    if (fileName.endsWith('.png')) {
        console.log('.png');
        //            response.header("Content-Type", "image/png");
        //            response.send(file);
        response.writeHead(200, { 'Content-Type': 'image/png' });
        response.end(file, 'binary');
        return;
    }
    else if (fileName.endsWith('.gif')) {
        response.header("Content-Type", "image/gif");
        response.send(file);
    }
    else {
        response.render('docs', { md: file });
    }


}
function show(output) {
    return output;
}
export default router;
