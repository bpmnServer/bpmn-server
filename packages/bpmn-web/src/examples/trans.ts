import  { Execution, configuration }   from './';
import { BPMNServer, Logger } from './';
import { EventEmitter } from 'events';
import { Definition } from './';

const logger = new Logger({ toConsole: true});


let name = 'Trans'; //      'error event';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;

let instanceId;
const server = new BPMNServer(configuration, logger, { cron: false });

testAll();

async function testAll() {

    await test(6010,'Complete Process',{},{},'Event_end','end');  //works fine
    //await test(6011,'Error thrown',{error:'true'},null,'Event_end_error','end');
    //await test(6012,'Cancel thrown',{cancel:'true'},null,'Activity_after_trans_cancel','end');
  //  await test(6013,'Cancel after Complete Process',{},{cancel2:'true'},'Activity_cancelHotel','end'); 
    
    await logger.save('trans.log');
}

async function test(caseId,scenario,data1,data2,checkItem,checkStatus) {

    console.log("st");

    let response;

    response=await server.engine.start(name,{caseId,scenario});

    response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_bookFlight'},{});
    response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_bookHotel'},{});
    response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_confirm'},data1);
    if (data2)
        response=await server.engine.invoke({id:response.instance.id,'items.elementId':'Activity_after_trans'},data2);

    if (checkItem) {

        let result=false;
        response.getItems().forEach(item=>{
            if (item.elementId==checkItem && item.status==checkStatus)
                result=true;
        });
    console.log(scenario+' Check is true',result)
    }
    response.getItems().forEach(item=>{
 //       console.log('item:',item.elementId,item.seq,item.status);
    });

    //open('http://localhost:3000/instanceDetails?id='+response.id);

    return;

}
function checkItem(items, criteria) {

    //    expect(items.length).greaterThan(0);

    if (items.length == 0) {
        console.log(" No items");
        return false;
    }
    const item = items[0];
    let pass = '';
    console.log(' items' + items.length);
    /*
    Object.keys(criteria).forEach(key => {
        if (item[key] != criteria[key]) {
            if (item[key] == criteria[key])
        }

    }); */
}
function checkInstance(instances, criteria) {

    //    expect(items.length).greaterThan(0);

    if (instances.length == 0) {
        console.log(" No items");
        return false;
    }
    const instance = instances[0];
    let pass = '';
    Object.keys(criteria).forEach(key => {
        if (instance[key] != criteria[key]) {
            //expect(instance[key]).equals(criteria[key]);
        }

    });
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