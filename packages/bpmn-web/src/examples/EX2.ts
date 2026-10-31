console.log('----------------------------- EX.ts ------------------');

//require('./concurrent');
require('../scripts/setupDemoUsers');

import { SystemUser, configuration } from '../';
const logger = new Logger({ toConsole: false });
const server = new BPMNServer(configuration, logger, { cron: false });


const api = new BPMNAPI(server);
let user = new SecureUser({userName:'user1',userGroups:['group1']});


// Function to parse MongoDB query
function parseMongoQuery(query) {
  for (const key in query) {
    if (key === "$and" || key === "$or") {
      query[key] = query[key].map(parseMongoQuery);
    } else if (typeof query[key] === 'object' && !Array.isArray(query[key])) {
      query[key] = parseMongoQuery(query[key]);
    } else if (typeof query[key] === 'string' && query[key].includes('.')) {
      const [field, subField] = query[key].split('.');
      query[field] = {};
      query[field][subField] = query[key];
      delete query[key];
    } else if (typeof query[key] === 'object' && Array.isArray(query[key])) {
      query[key] = query[key].map(parseMongoQuery);
    } else if (typeof query[key] === 'object') {
      for (const op in query[key]) {
        const value = query[key][op];
        if (op === '$regex') {
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
      const objValue = getValue(obj, key);
      const queryValue = query[key];
      if (typeof queryValue === 'object') {
        for (const op in queryValue) {
          if (op === '$eq') {
            if (objValue !== queryValue[op]) {
              return false;
            }
          } else if (op === '$gte') {
            if (objValue < queryValue[op]) {
              return false;
            }
          } else if (op === '$lte') {
            if (objValue > queryValue[op]) {
              return false;
            }
          } else if (op === '$lt') {
            if (objValue >= queryValue[op]) {
              return false;
            }
          } else if (op === '$gt') {
            if (objValue <= queryValue[op]) {
              return false;
            }
          } else if (op === '$regex') {
            if (!queryValue[op].test(objValue)) {
              return false;
            }
          }
        }
      } else if (objValue !== queryValue) {
        return false;
      }
    }
  }
  return true;
}

// Utility function to get value from nested objects
function getValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
}

// Sample MongoDB query
const mongoQuery1 = {
  $and: [
    { age: { $gte: 18 } ,type: 'Active'} , 
    { "address.city": "New York" }
  ]
};
const mongoQuery2 = {
  $or: [
    { age: { $gte: 18 } ,type: 'Active'} , 
    { "address.city": "New York" }
  ]
};

const mongoQuery3 = {

}
// Parsing MongoDB query

// Sample objects for testing
const sampleObjects = [
  { name: "John", age: 25, address: { city: "New York", street: "123 Main St" },type:'Active' },
  { name: "Alice", age: 30, address: { city: "Chicago", street: "456 Elm St" } },
  { name: "Bob", age: 20, address: { city: "New York", street: "789 Oak St" } }
];

const sampleObjects2 = [
  { name: "John", age: 25, address: { city: "New York", street: "123 Main St" },type:'Active' },
  { name: "Alice", age: 30, address: { city: "Chicago", street: "456 Elm St" } },
  { name: "Bob", age: 20, address: { city: "New York", street: "789 Oak St" } }
];

// Test function to apply query against all sample objects
function testQuery(query, objects) {
  const parsedQuery = parseMongoQuery(query);
  console.log(query);

  for (let indx in objects) {
    let obj=objects[indx];
    let res=applyQuery(parsedQuery,obj);
    console.log(res,JSON.stringify(obj));
  }
//  let res=objects.map(obj => applyQuery(parsedQuery, obj));
//  console.log(res);
}

// Test the query against sample objects
// testQuery(mongoQuery1, sampleObjects);
// testQuery(mongoQuery2, sampleObjects);

//console.log("Query Results:", results);

//canInvoke();

async function canInvoke() {
    let inst=await server.dataStore.findInstance({"data.caseId":2615},{});
    let appr;
    inst.items.forEach(item=>{ 
        console.log(item.elementId);
        if (item.elementId=='Approve')
            appr=item;
    });
    console.log('item',appr);
    let query=user.qualifyInstances({});
    console.log('query',query);

    let parsedQuery=parseMongoQuery(query);
    let res=applyQuery(parsedQuery,{items:appr});
    console.log('res:',res);

    /*
    const trans = new QueryTranslator('items');
    let result=trans.filterItem(appr,query);
    console.log(result);
    */
//    parseQuery(query,appr);
}
