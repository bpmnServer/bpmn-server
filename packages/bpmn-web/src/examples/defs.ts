import  { configuration }   from './';
import { BPMNServer, Logger } from './';
import { Definition } from './';

const fs = require('fs');

const logger = new Logger({ toConsole: false});


let name = 'Buy Used Car'; //      'error event';
let process;
let needsRepairs = true;
let needsCleaning = true;
let response;
let items;
let item;
let query, query1;

let server;
let instanceId;

//test();
describe(name,'md','test.html');


class DefinitionSorter {

    nodes=new Map();
    sortedNodes=new Map();
    sortedFlows=new Map();

    sort(definition)  {

        definition.nodes.forEach(el => {
            if (el.type=='bpmn:StartEvent')
                this.addSorted(el)
            else
                this.nodes.set(el.id,el);

        });
        let seq=0;
        let newNodes=[];
        this.sortedNodes.forEach(s=>{
            console.log('sorted',seq,s.id,s.type);
            newNodes.push(s);
            s['seq']=seq++; 
            }
        );
        let newFlows=[];
        this.sortedFlows.forEach(f=>{newFlows.push(f)});

        definition.nodes=this.sortedNodes;
        definition.flows=this.sortedFlows;

        return;
        
    }

    addSorted(el) {
        this.nodes.delete(el.id);
        this.sortedNodes.set(el.id,el);
        el.outbounds.forEach(o=>{
            this.sortedFlows.set(o.id,o);
            this.addSorted(o.to);
        })
    }
}
async function describe(model,format,outputFile) {

    var definition: Definition
    const server = new BPMNServer(configuration, logger, { cron: false });

    definition = await server.definitions.load(model);
//console.log(definition);
    const json = JSON.parse(definition.getJson());

    let ds=new DefinitionSorter();
    ds.sort (definition);

    json.elements=ds.sortedNodes;
    json.flows=ds.sortedFlows;

    json.elements.forEach(n=>{console.log('after el',n.id,n.type)});
    json.flows.forEach(n=>{console.log('after fl',n.id)});

    if (format=='json') {
        fs.writeFileSync(outputFile,json);
        console.log('file ',outputFile,' written');
            
        process.exit(0);
        return;
    }

   const pug = require('pug');
   const path = require('path');

   let svg = null;
   try {
       svg = await server.definitions.getSVG(model);

   }
   catch (ex) {

   }
   let text="<div>"+svg+"</div>";

   const templatePath = path.join(__dirname, '../views/includes/') ;
   text = text + pug.renderFile(templatePath+ 'modelDoc.pug', { docs:json });
   console.log(json.elements);

   fs.writeFileSync(outputFile,text);
}


function getTree(response) {
    let tokens = response.tokens;
    //tokens.forEach(t)
}
function descArray(arr) {

    arr.forEach(desc=>{
        if(Array.isArray(desc)){
            console.log('   -',desc[0],':',desc[1]);
        }
        else if (desc.text)
            console.log('   - Doc:',desc.text)
        else 
            console.log('else',desc);
    })

}
async function defScripts() {

    var definition: Definition
    console.log("start");
    const server = new BPMNServer(configuration, logger, { cron: false });

    definition = await server.definitions.load('Leave Application');

    const json = JSON.parse(definition.getJson());

    console.log('## Processes')
    json.processes.forEach(proc => {
        console.log('- Process', proc.id, proc.name, proc.description);
    });
    console.log('## Elements')
    json.elements.forEach(el => {
        console.log();
        console.log(`- Element: **${el.id}** `,el.type, el.name||'');
        el.description.forEach(desc => {
            descArray([desc]);
            //console.log('   - ', desc);
        });
        el.behaviours.forEach(desc => {
            descArray(desc);
            //console.log('   - > ', desc);
        });
        if (el.docs)
            descArray(el.docs);

    });
    console.log('## Sequence Flows')
    json.flows.forEach(el => {
        console.log();
        console.log(`- Flow: **${el.id}** `, el.type, el.name||'', el.from, el.to);
        descArray(el.description);
    });
    return;
    definition.nodes.forEach(node => {
        node.init();
        //        console.log(node.scripts);
        node.scripts.forEach((value, key) => {
            console.log(node.id, 'script on:', key, '->', value)
        })
        node.behaviours.forEach(behav => behav.init());
        //        console.log(node.type, node.id, node.subType);
    })
    return;

}
async function defScripts1() {

    var definition: Definition
    console.log("start");
    const server = new BPMNServer(configuration, logger, { cron: false });

    definition = await server.definitions.load('Leave Application') as Definition;

    definition.nodes.forEach(node => {
        node.init();
        if (node.def.documentation) {
            node.def.documentation.forEach(doc => {
                console.log('doc', node.id, doc.text);
            })
        }
    })
    return;

}
async function test() {

    var definition: Definition 
    console.log("start");
    const server = new BPMNServer(configuration, logger, { cron: false });

    try {
        definition= await server.definitions.load(name);

        response = await server.engine.start(name);
        response = await server.engine.invoke({ id: response.instance.id, "items.elementId": 'Activity_1' });

        response = await server.engine.invoke({ id: response.instance.id, "items.elementId": 'Activity_2_4_1' });
        response = await server.engine.invoke({ id: response.instance.id, "items.elementId": 'Activity_2_4_2' });
        response.instance.items.forEach(item => {
            console.log(item.name, item.elementId,item.status);

        });

        getTree(response);

        await logger.save('test_gateway1.log');
    }
    catch (exc) {
        console.log(exc);
    }
    return;
    definition.nodes.forEach(node => {
        node.init();
        node.behaviours.forEach(behav => behav.init());
        console.log(node.type, node.id, node.subType);
    })
    return;
    var def = JSON.parse(definition.getJson());
    Object.keys(def).forEach(key => { console.log(key); });
    var els = def['elements'];
    for (var i = 0; i < els.length; i++) {
        var el = els[i];
        console.log(el['type'] + ' ' + el['name']);
        console.log(el.description);
        console.log(el.behaviours);
    }
    return;
    const starts = definition.getStartNodes();

    const starts2 = definition.getStartNodes(true);

    console.log(starts);
    return;

    const node = await definition.getNodeById('StartEvent_0iay4ar');
    console.log(node.def);
    console.log('----------');
    console.log(node.def.extensionElements);

    const xml = await definition.moddle.toXML(node.def);
    console.log(xml);


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