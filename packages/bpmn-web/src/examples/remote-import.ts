
//FromPostMan();
//request('test4', 'Trans.bpmn');
var client = require('../../../bpmnClient/');
console.log(client);

fromClientLib();

async function fromClientLib() {
    const server = new client.BPMNClient('localhost', 3000, '1234');

    var name = 'test-import';
    var file = 'Trans.bpmn';

    server.definitions.import(name, file);

}
async function FromPostMan() {

    console.log("Testing Remote import");


    var http = require('follow-redirects').http;
    var fs = require('fs');

    var options = {
        'method': 'POST',
        'hostname': 'localhost',
        'port': 3000,
        'path': '/api/definitions/import/testing3',
        'headers': {
            'x-api-key': '12345',
            'Cookie': 'connect.sid=s%3AXMa01DuOlQ4WsrvBj0FVaIrTak49vLPB.hDIV9j7ONA437rZf%2F%2Biu%2Bc6B7T5%2FVuEIjj1BAaoCJW4'
        },
        'maxRedirects': 20
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\"Trans.bpmn\"\r\nContent-Type: \"text/plain\"\r\n\r\n" + fs.readFileSync('Trans.bpmn') + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    req.write(postData);

    req.end();

}


async function request(name,path) {

    console.log("Testing Request");


    var http = require('http');
    var fs = require('fs');

    var options = {
        'method': 'POST',
        'hostname': 'localhost',
        'port': 3000,
        'path': '/api/definitions/import/'+name,
        'headers': {
            'x-api-key': '12345',
            'Cookie': 'connect.sid=s%3AXMa01DuOlQ4WsrvBj0FVaIrTak49vLPB.hDIV9j7ONA437rZf%2F%2Biu%2Bc6B7T5%2FVuEIjj1BAaoCJW4'
        },
        'maxRedirects': 20
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"file\"; filename=\""
        + path + "\"\r\nContent-Type: \"text/plain\"\r\n\r\n" +
        fs.readFileSync(path) + "\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";

    req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

    req.write(postData);

    req.end();

}