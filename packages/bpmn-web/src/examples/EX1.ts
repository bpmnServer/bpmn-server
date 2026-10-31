
console.log('----------------------------- EX.ts ------------------');

//require('./concurrent');


import { configuration } from './';
import { BPMNServer, Logger ,SecureUser,BPMNAPI} from './';
import {QueryTranslator} from './';
import { EventEmitter } from 'events';

const logger = new Logger({ toConsole: false });
const server = new BPMNServer(configuration, logger, { cron: false });
let response;
//const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:['group1']});


// Sample MongoDB query
const mongoQuery1 = {
    $and: [
      { age: { $gte: 18 } },
      { name: { $regex: /^J/i } }
    ]
  };
const mongoQuery2 = {
    $or: [
      { age: { $gte: 18 } },
      { name: { $regex: /^J/i } }
    ]
  };
  // Sample MongoDB query
const mongoQuery = {
    $and: [
      { age: { $gte: 18 } },
      { name: { $regex: /^J/i } }
    ]
  };
  
  // Function to parse MongoDB query
  function parseMongoQuery(query) {
    for (const key in query) {
      if (key === "$and" || key === "$or") {
        query[key] = query[key].map(parseMongoQuery);
      } else {
        for (const op in query[key]) {
          const value = query[key][op];
          if (typeof value === 'object') {
            query[key][op] = parseMongoQuery(value);
          } else if (op === '$regex') {
            query[key][op] = new RegExp(value);
          }
        }
      }
    }
    return query;
  }
  
  // Function to apply the parsed query against an object
  function applyQuery(query, obj) {
    for (const key in query) {
      if (key === "$and") {
        for (const condition of query[key]) {
          if (!applyQuery(condition, obj)) {
            return false;
          }
        }
      } else if (key === "$or") {
        let match = false;
        for (const condition of query[key]) {
          if (applyQuery(condition, obj)) {
            match = true;
            break;
          }
        }
        if (!match) {
          return false;
        }
      } else {
        const objValue = obj[key];
        for (const op in query[key]) {
          const queryValue = query[key][op];
          if (op === "$eq") {
            if (objValue !== queryValue) {
              return false;
            }
          } else if (op === "$gte") {
            if (objValue < queryValue) {
              return false;
            }
          } else if (op === "$regex") {
            if (!queryValue.test(objValue)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
  function testQ(query,obj) {

    const parsedQuery = parseMongoQuery(query);
    const result = applyQuery(parsedQuery, obj);
    
    console.log("Query Result:", result,JSON.stringify(query),'Object',JSON.stringify(obj));

  }

  testQ( { $and: [{ age: { $gte: 18 } },{ name: { $regex: /^J/i } }]},
       { name: "John",  age: 25,   city: "New York" });

  testQ( { $and: [{ age: { $gte: 18 } }, {type:'Active'}]},
       { name: "John",  age: 25,   city: "NewYork",type:'ActiveX' });
       
  // Applying the parsed query against the sample object
  
//canInvoke();

async function canInvoke() {
    let inst=await server.dataStore.findInstance({"data.caseId":2615},{});
    let appr;
    inst.items.forEach(item=>{ 
        console.log(item.elementId);
        if (item.elementId=='Approve')
            appr=item;
    });
    console.log(appr);
    let query=user.qualifyInstances({});
    console.log(query);
    const trans = new QueryTranslator('items');
    let result=trans.filterItem(appr,query);
    console.log(result);
//    parseQuery(query,appr);
}
function parseQuery(query,item) {
    for (let key in query){
        console.log('key',key,query[key]);
        switch(key) 
        {
            case '$or':

        }
    }

}
//test197();
async function test197() {

    const del=await server.dataStore.deleteInstances({"data.caseId": 1005});
    console.log('deleted ', del);

    response=await server.engine.start('callTask',{caseId:1005});
    let response1=response;
    let instances=await server.dataStore.findInstances({"data.caseId":1005},{})
    console.log(instances.length);

    response=await server.engine.invoke({"data.caseId":1005,"items.elementId":'task_Buy'});
    response=await server.engine.invoke({"data.caseId":1005,"items.elementId":'task_Drive'});
    return;
    
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_create_vote',"items.itemKey":"IT"});
    //response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
    //console.log('items:',response.getItems().filter(item=>{return (item.status=='wait')}).length);

    response=await server.engine.invoke({id:response.id,"items.elementId":'Event_cancel',"items.itemKey":"IT"});
    

    list();
    

    return;
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"1.1001"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"1.1002"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"1.1003"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"2.1001"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"2.1002"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"2.1003"});
    list();
//    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
 //   list();
    return;

}
async function test1() {

    response=await server.engine.start('Issue 196',{});
    
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"1"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
    console.log('items:',response.getItems().filter(item=>{return (item.status=='wait')}).length);

    response=await server.engine.invoke({id:response.id,"items.elementId":'Event_Cancel',"items.itemKey":"2"});
    

    list();
    

    return;
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"1.1001"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"1.1002"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"1.1003"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"2.1001"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"2.1002"});
    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT2',"items.itemKey":"2.1003"});
    list();
//    response=await server.engine.invoke({id:response.id,"items.elementId":'Activity_UT1',"items.itemKey":"2"});
 //   list();
    return;

}
function list() {

    response.getItems().forEach(item=>{
        console.log('item:',item.seq,item.elementId,item.itemKey,item.status,item.endedAt);
    });

}