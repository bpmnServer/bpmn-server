import express from 'express';
import FS from 'node:fs';
import https from 'node:https';
import path from 'node:path';

import { BPMNServer   } from '../index.js';
import { Common } from './common.js';

/* GET users listing. */

const url = 'https://raw.githubusercontent.com/ralphhanna/bpmn-server/master/';

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

//console.log('get file',getRemoteFile('README.md').then(file=>{console.log(file)}));

const awaitAppDelegateFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}
// bpmn-server's documentation: DOCS_PATH, else a bpmn-server checkout next to this one
// (the npm package does not ship docs/). The README comes with the package.
var docsFolder = process.env.DOCS_PATH ? path.resolve(process.env.DOCS_PATH) + path.sep
    : path.resolve(import.meta.dirname, '../../../bpmn-server/docs') + path.sep;
const packageReadme = path.resolve(import.meta.dirname, '../../node_modules/bpmn-server/README.md');
export class Docs extends Common {

    constructor(app) {
        super(app);

//        docsFolder= this.webApp.packageJson.homepage;
        console.log(docsFolder);
        
    }

    config() {

        var router = express.Router();

        // Deny-by-default: docs viewer requires a session.
        router.use(this.isAuthenticated);

        router.get('/', function (request, response) {
            const readme = path.resolve(docsFolder, '../README.md');
            return renderFile(FS.existsSync(readme) ? readme : packageReadme, response);
        });
        router.get('/api/*splat/:fileName', awaitAppDelegateFactory(async (request, response) => {

            let folder = '';
            const splat = (request.params as any).splat;
            if (splat && splat.length)
                folder = (Array.isArray(splat) ? splat.join('/') : splat) + '/';
            let fileName = 'api/' + folder + request.params.fileName;

            return processFile(fileName, response);
        }));
        router.get('/api/:fileName', awaitAppDelegateFactory(async (request, response) => {

            let fileName = 'api/' + request.params.fileName;

            return processFile(fileName, response);
        }));
        router.get('/examples/:fileName', awaitAppDelegateFactory(async (request, response) => {

            let fileName = 'examples/' + request.params.fileName;

            return processFile(fileName, response);
        }));

        router.get('/images/:fileName', awaitAppDelegateFactory(async (request, response) => {

            let fileName = 'images/' + request.params.fileName;

            return processFile(fileName, response);
        }));

        router.get('/:fileName', awaitAppDelegateFactory(async (request, response) => {

            let fileName = request.params.fileName;

            return processFile(fileName, response);


        }));
        router.get('/readme_md', awaitAppDelegateFactory(async (request, response) => {

            let processName = request.params.process;
            let fileName = packageReadme;

            let file = FS.readFileSync(fileName,
                { encoding: 'utf8', flag: 'r' });

            response.send(file);

        }));
        return router;
    }
}
function processFile(fileName,response) {

    if (!fileName.includes('.'))
        fileName=fileName+'.md';

    // Containment check: resolve and refuse anything that escapes docsFolder
    // (fileName can include splat-derived path segments).
    const resolvedBase = path.resolve(docsFolder) + path.sep;
    const resolved = path.resolve(docsFolder, fileName);
    if (!resolved.startsWith(resolvedBase)) {
        response.status(400).send('invalid path');
        return;
    }
    return renderFile(resolved, response);
}
function renderFile(fileName, response) {
    if (!FS.existsSync(fileName)) {
        response.status(404).send('Documentation not found; set DOCS_PATH to a bpmn-server docs folder.');
        return;
    }
    let file = FS.readFileSync(fileName);



    if (fileName.toLowerCase().endsWith('.png')) {
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
        let sidebar = null;
        if (FS.existsSync(docsFolder + 'sidebar.md')) 
            sidebar = FS.readFileSync(docsFolder + 'sidebar.md');
        response.render('docs', { md: file , sidebar});
    }


}
function show(output) {
    return output;
}
