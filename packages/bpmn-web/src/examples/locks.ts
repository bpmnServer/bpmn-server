import  { configuration }   from './';;
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';
export { InstanceLocker } from 'bpmn-server';

const COLLECTION='wf_locks';
const WAIT=1000;
const MAX_TRIES=20;

class InstanceLockerLocal {
    server;

    constructor(server) {
        this.server=server;
    }
    async lock(id,srv) {

        var counter=0;
        var failed=true;
        while(counter++<10 && failed) {
            console.log('trying ');

            failed=! await this.try(id,srv);
            if (failed)
                await this.delay(WAIT,{});
        }
        console.log('failed',failed);
        return !failed;


    }
    async try(id,srv) {
        const ds=this.server.dataStore;
        const lock={"id":id,"server":srv};

        try
        {
            var records = await ds.db.insert(ds.dbConfiguration.db, "wf_locks", [lock]);
            //console.log(records);
        }
        catch(err)
        {
            console.log('error',err.code);
            return false;
        }

        return true;
    }
    async release(id,srv) {
        const ds=this.server.dataStore;

        const query={"id":id};

        return await ds.db.remove(ds.dbConfiguration.db, "wf_locks", query );
    }    

    async list() {

        const ds=this.server.dataStore;
        console.log(ds.dbConfiguration);
       var records = await ds.db.find(ds.dbConfiguration.db, "wf_locks" , {}, {});
        console.log('locks', records);
    }

    async delay(time,result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
    }
}
console.log('--- start ---');
async function performTask(id,params,task: (params: any) => any) {

    //  1.  lock
    //  2.  restore
    //  3.  do the task
    var ret;
    try {
        const promise = await task(params);
        ret=await promise;
    }   
    catch (exc) {
        console.log(exc);
    }
    //  4.  release
    return ret;

}
function callbackTester(callback: (v1:number ,v2:number )=> number) {
    console.log('callbackTester',callback);
    return callback(5,10);
}
function myCallBack(v1, v2) {
    console.log('myCallBack', v1, v2);
    return v1 + v2;
}
async function t1() {

    var ret = callbackTester(myCallBack);

    console.log('ret:', ret);

    ret = callbackTester(function (v1: number, v2: number) { return v1 * v2; });

    console.log('ret:', ret);
    ret = await performTask(1, { v1: 5, v2: 10 }, async function ({ v1, v2 }) {
        console.log('task', v1,v2)
        return v1 + v2;

    });

    console.log('ret:', ret);
}
t1();
/*

const logger = new Logger({ toConsole: true});

 const server = new BPMNServer(configuration, logger, { cron: false });

const listener = server.listener;


listener.on('all', async function ({ context, event, }) {
    if (context.item)
        console.log(`----->Event: '${event}' for ${context.item.element.type} '${context.item.element.id}' id: ${context.item.id}`);
    else
        console.log('----->All:' + event, context.definition.name);
});
*/
//server.engine.start('Issue124.bpmn');



   //test(server);
async function test(server) {

    const lock = server.dataStore.locker;

    console.log('=============');
    //await lock.list();
    var ret=await lock.lock("1234");
    console.log('=============',ret);
    ret=await lock.lock("1234");
    console.log('=============',ret);
    await lock.release("1234");
    //await lock.list();
}

async function delay(time, result) {
    console.log("delaying ... " + time)
    return new Promise(function (resolve) {
        setTimeout(function () {
            console.log("delayed is done.");
            resolve(result);
        }, time);
    });
}