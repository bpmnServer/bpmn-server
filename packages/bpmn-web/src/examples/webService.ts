import { EventEmitter } from "events";



const https = require('https');
const http = require('http');

class WebService {
    statusCode;
    result;
    response;
    constructor() { }
    async invoke(params, options) {

        var driver = http;
        var body = JSON.stringify(params);

        console.log(options, params);
        if (options.port == 443)
            driver = https;

        let data = '';
        let self = this;
        return new Promise(function (resolve, reject) {
            try {

                driver.request(options, function (res) {
                    console.log('STATUS: ' + res.statusCode);
                    this.response = res;
                    //console.log(res);
                    self.statusCode = res.statusCode;
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        data += chunk;
                    });
                    res.on('end', () => {
                        self.result = JSON.parse(data);

                        resolve(self.result);
                    });


                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    reject(err);
                }).end(body);
            }
            catch (exc) {
                console.log(exc);
            }

        });

    }
}
//test();
test2();
async function test2() {
    var resultData = {};
    var obj = {
        data: {},
        options: {
            host: 'dataservice.accuweather.com',
            port: 443,
            //        path: '/currentconditions/v1/349727',
            path: '/currentconditions/v1/349727?apikey=QXP5SzgcLlGQAQB5e0lnAWMMBjVEixiq',
            method: 'get',
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Connection": "keep-alive"
            }
        },
        actions: [
            { data: resultData, output: 'temp1', from: [0, 'Temperature', 'Metric', 'Value'] },
            { data: resultData, output: 'temp2', from: [0, 'Temperature', 'Imperial', 'Value'] }
        ]
    };

    let ret = await wsCall(obj, function (result) { });
    console.log('Return:', ret,'resultData',resultData);
}

async function wsCall(obj, callBack) {

    let ws = new WebService();

    let res = await ws.invoke(obj.data, obj.options);
    /*console.log(res);
    console.log(res[0]['Temperature']['Metric']);
    console.log(res[0]['Temperature']['Imperial']); */
    let msg = `current temperature is ${res[0]['Temperature']['Metric']['Value']} C`;

    for (var i = 0; i < obj['actions'].length; i++) {
        let action = obj['actions'][i];
        let from = action['from'];
        let ret = res;
        for (var j = 0; j < from.length; j++) {
            let key = from[j];
            ret = ret[key];
            let outVar = action['output'];
            action['data'][outVar] = ret;
        }
    }
    return res;
    callBack(res);
}
async function test() {

    let ws = new WebService();
    var params = {
    };
    var options = {
        host: 'dataservice.accuweather.com',
        port: 443,
//        path: '/currentconditions/v1/349727',
        path: '/currentconditions/v1/349727?apikey=QXP5SzgcLlGQAQB5e0lnAWMMBjVEixiq',
        method: 'get',
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Connection": "keep-alive"
        }
    };
    let res = await ws.invoke(params , options);
    console.log(res);
    console.log(res[0]['Temperature']['Metric']);
    console.log(res[0]['Temperature']['Imperial']);
    let msg = `current temperature is ${res[0]['Temperature']['Metric']['Value']} C`;
    console.log(msg);
}
    
