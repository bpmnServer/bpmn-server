console.log("Testing BPMNClient raw");


raw1();

async function raw1() {
    var axios = require('axios');
    var data = JSON.stringify({ "items.status": "end", "items.elementId": "script_task" });

    var config = {
        method: 'get',
        url: 'http://localhost:3000/api/datastore/findItems',
        headers: {
            'x-api-key': '12345',
            'Content-Type': 'application/json',
//            'Cookie': 'connect.sid=s%3AFJpzbs-nlVsxrhROzC_e0joMyopi6ke0.uoCjT87OZa3SOJosZxXCrC7zriAIVdMmtwcKsrY2C4I'
        },
        data: data
    };
    var response = await axios(config);
    console.log(response.data);
    /*
    axios(config)
        .then(function (response) {
            console.log('then',JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log('error',error);
        });
        */
}
async function raw() {
    console.log('raw');
    var https = require('follow-redirects').http;
    var fs = require('fs');

    var options = {
        'method': 'GET',
        'hostname': 'localhost',
        'port': 3000,
        'path': '/api/datastore/findItems',
        'headers': {
            'x-api-key': '12345',
            'Content-Type': 'application/json',
            'Cookie': 'connect.sid=s%3AFJpzbs-nlVsxrhROzC_e0joMyopi6ke0.uoCjT87OZa3SOJosZxXCrC7zriAIVdMmtwcKsrY2C4I'
        },
        'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            console.log('data', chunk);
            chunks.push(chunk);
        });

        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            console.log('end',body.toString());
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });

    var postData = JSON.stringify({ "items.status": "end", "items.elementId": "script_task" });

    req.write(postData);

    req.end();
}
