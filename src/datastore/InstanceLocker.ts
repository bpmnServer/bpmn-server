import { APP_CONFIGURATION } from '../server';
import  { JSONDataStore }   from './';import { JSONDB } from './JSONDB';
;


const COLLECTION='wf_locks';
const WAIT=1500;
const MAX_TRIES=20;

class InstanceLocker {
    db;

    constructor(db) {

        this.db=db;
    }
    async lock(id) {

        var counter=0;
        var failed=true;
        while(counter++<MAX_TRIES && failed) {
            failed=! await this.try(id);
            if (failed)
                await this.delay(WAIT,{});
        }
        if (failed)
        {
            await this.list();
            throw new Error('failed to lock instance: '+id);
        }
        else
        {
            return true;
        }


    }
    async try(id) {

        const serverId=APP_CONFIGURATION.env.SERVER_ID;
        const lock={"id":id,"server":serverId,"time": new Date()};

        try
        {
            await this.db.saveFile(id,lock);
        }
        catch(err)
        {
            console.log('lock error',err.code);
            return false;
        }

        return true;
    }
    async release(id) {

        const query={"id":id};

        return await this.db.deleteFile(id);
    }    
    async delete(query) {

        return [];
        //return await this.dataStore.db.remove(this.dataStore.dbConfiguration.db, "wf_locks", query);
    }    

    async list() {

       //var records = await this.dataStore.db.find(this.dataStore.dbConfiguration.db, "wf_locks" , {}, {});
        return [];//records;
    }

    async delay(time,result) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(result);
        }, time);
    });
    }
}

export { InstanceLocker }