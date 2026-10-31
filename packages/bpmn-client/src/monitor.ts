import { BPMNClient } from './';


console.log("Testing BPMNClient");
const dotenv = require('dotenv');
const res = dotenv.config();

console.log(res);
monitor();

async function monitor() {

    const server = new BPMNClient(process.env.HOST, process.env.PORT, process.env.API_KEY);

    console.log('running monitor');
    for (var i = 0; i < 1000; i++) {
        await checkStatus(server);
        await delay(15000, 'test');
    }


}
async function checkStatus(server, reason = '') {


    var list = await server.engine.status();

    var insT = 0, insR = 0, itmT = 0, itmR = 0, tokT = 0, tokR = 0;
    for (var i = 0; i < list.length; i++) {
        var exec = list[i];
        var dInstance = null;
        insT++;
        tokT += exec.instance.tokens.length;
        if (exec.instance.status == 'running') insR++;
        var started = dateDiff(exec.instance.startedAt);
        var ended = dateDiff(exec.instance.endedAt);


        var msg = ` Instance for '${exec.instance.name}'  Status: ${exec.status} Started At ${started} Ended ${ended} items: ${exec.instance.items.length}`;
        try {
            dInstance = await server.datastore.findInstances({ id: exec.instance.id }, {});
            //console.log(reason+' logs:',exec.instance.logs.length, dInstance.logs.length,dInstance.data.caseId);
            if (dInstance.length > 0)
                msg += ' items:' + dInstance[0].items.length;
        }
        catch (exc) {
            msg += ' no instance' + exc.toString();
        }
        console.log(msg);

    }
    console.log(`${reason} ->Instances: Total: ${insT} Running: ${insR}`);// Tokens: ${tokT} `);
}

async function delay(time, result) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(result);
        }, time);
    });
}




function dateDiff(dateStr) {

    var endDate = new Date();
    var startTime = new Date(dateStr);
    var time1 = endDate.getTime();
    var time2 = startTime as unknown as number;

    var seconds = Math.abs(time1 - time2) / 1000;


    // get total seconds between the times
    var delta = seconds; //Math.abs(date_future - date_now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta % 60);  // in theory the modulus is not required
    if (days > 0)
        return (days + " days");
    if (hours > 0)
        return (hours + " hours");
    if (minutes > 0)
        return (minutes + " minutes");
    return (seconds + " seconds");
}
