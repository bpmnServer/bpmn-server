import { EventEmitter } from "events";

import { configuration } from './';
import { BPMNServer, Logger } from './';


const fs = require('fs');

const logger = new Logger({ toConsole: false });

list();
async function list() {

    const server = new BPMNServer(configuration, logger, { cron: false });
    let res = await server.dataStore.findInstances({},{projection:{'name':1}});

    let list=[];
    res.forEach(r=>{ list.push(r.name); });

    list.sort();
    
    let names={}

    list.forEach(r=>{
        if (names[r]) {
            names[r]++;
        }
        else
        names[r]=1;   
    });

    console.log(names);
    process.exit();
}
