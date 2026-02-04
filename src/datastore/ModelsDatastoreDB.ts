
import { Definition } from "../elements";
import { BPMNServer } from "../server";

import { ServerComponent } from "../server/ServerComponent";
import { IBpmnModelData, IModelsDatastore, IEventData } from "../interfaces/";
import { BpmnModelData } from "./ModelsData";
import { QueryTranslator } from "./QueryTranslator";

const Definition_collection = 'wf_models';
const Events_collection = 'wf_events';

class ModelsDatastoreDB extends ServerComponent implements IModelsDatastore {
    dbConfiguration;
    db;

    constructor(server: BPMNServer) {
        super(server);

        this.dbConfiguration = this.configuration.database.MongoDB;
        const MongoDB = require('./MongoDB').MongoDB;
        this.db = new MongoDB(this.dbConfiguration, this.logger);

    }
    async get(query={}): Promise<object[]> {

        const list=await this.db.find(this.dbConfiguration.db, Definition_collection,query, {});
        return list;

    }
    async getList(query={}): Promise<string[]> {

        var records = await this.db.find(this.dbConfiguration.db, Definition_collection,query, {});

//        this.logger.log('find events for ' + " recs:" + records.length);
        const list = [];
      
        records.forEach(r => { list.push({ name: r.name }); });
        return list;
    }


    /**
     * load definition for instance
     * @param instance
     * @param owner 
     */
    async loadFromInstance(instance,owner=null): Promise<Definition> {
        if (instance.source) {
            return this.loadDefinition(instance.name, instance.source);
        }
        else {
            return this.load(instance.name,owner);
        }
    }

	/*
	 *	loads a definition by name
	 *	
	 */
    async load(name,owner=null) : Promise<Definition> {

        const source = await this.getSource(name);
        return this.loadDefinition(name, source);
    }

    protected async loadDefinition(name, source): Promise<Definition> {
        
        const definition = new Definition(name, source, this.server);
        await definition.load();
        return definition;
    }

    async getSource(name,owner=null) {
        let model = await this.loadModel(name);
        return model.source;

    }
    async getSVG(name,owner=null) {
        let model = await this.loadModel(name);
        return model.svg;

    }
    /*
     *	loads a definition data record from DB
     *	
     */
    async loadModel(name,owner=null): Promise<BpmnModelData> {

        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, { name: name }, {});

        this.logger.log('find model for  ' + name + " recs:" + records.length);

        return records[0];

    }

    async save(name, source, svg,owner=null): Promise<any> {
        let bpmnModelData: BpmnModelData = new BpmnModelData(name, source, svg, null, null);
        let definition = new Definition(bpmnModelData.name, bpmnModelData.source, this.server);
        try {
            await definition.load();

            bpmnModelData.parse(definition);
            await this.saveModel(bpmnModelData,owner);

            return bpmnModelData;
        }
        catch(exc)
        {
            console.log('error in saving',name,exc);
            throw exc;
            return null;
        }

    }
    async findEvents(query,owner=null): Promise<IEventData[]> {

        let projection = {}; // this.getProjection(query);

        const events = [];
        let trans;
        let newQuery=query;
        if (query) {
            trans = new QueryTranslator('events');
            newQuery = trans.translateCriteria(query);
        }

        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, newQuery, projection);

//        this.logger.log('...find events for ' + JSON.stringify(query) + "=>" + JSON.stringify(newQuery) + " recs:" + records.length);

        records.forEach(rec => {
            rec.events.forEach(ev => {
                let pass = true;
                if (query) {
                    pass = trans.filterItem(ev, newQuery);

                }
                if (pass) {
                    ev.modelName = rec.name;
                    ev._id = rec._id;
                    events.push(ev);
                }
            });
        });

        return events;

    }
    private getProjection(query) {

        let match = {};
        let projection = {};
        {
            Object.keys(query).forEach(key => {
                if (key.startsWith('events.')) {
                    let val = query[key];
                    key = key.replace('events.', '');
                    match[key] = val;
                }
            });
            if (Object.keys(match).length == 0)
                projection = { id: 1, name: 1 };
            else
                projection = { id: 1, name: 1, "events": { $elemMatch: match } };
        }
        return projection;
    }
    // db.collection.createIndex({ "a.loc": 1, "a.qty": 1 }, { unique: true })
    /**
     * first time installation of DB
     * 
     * creates a new collection and add an index
     * 
     * */
    async install() {
        return await this.db.createIndex(this.dbConfiguration.db, Definition_collection, { name: 1 , owner: 1 }, { unique: true });
    }
    async import(data,owner=null) {
        return await this.db.insert(this.dbConfiguration.db, Definition_collection, data);

    }
    async updateTimer(name,owner=null): Promise<boolean> {

        const source = await this.getSource(name,owner);
        let model: BpmnModelData = new BpmnModelData(name, source, null, null, null);
        let definition = new Definition(model.name, model.source, this.server);
        await definition.load();

        model.parse(definition);

        await this.db.update(this.dbConfiguration.db, Definition_collection,
            { name: model.name },
            {
                $set:
                {
                    events: model.events
                }
            }, { upsert: false });


        this.logger.log("updating model");

        this.logger.log('DataStore:saving Complete');

        return true;

    }
    async saveModel(model: IBpmnModelData,owner=null): Promise<boolean> {

        this.logger.log("Saving Model " + model.name);

        var recs;
        model.saved = new Date();

        await this.db.update(this.dbConfiguration.db, Definition_collection,
            { name: model.name , owner:owner},
            {
                $set:
                {
                    name: model.name, owner:owner, saved: model.saved, source: model.source, svg: model.svg, processes: model.processes, events: model.events
                }
            }, { upsert: true });


        return true;

    }
    async deleteModel(name,owner=null) {

        await this.db.remove(this.dbConfiguration.db, Definition_collection, { name: name });

    }
    async renameModel(name, newName,owner=null) {

        await this.db.update(this.dbConfiguration.db, Definition_collection,
            { name: name },
            {
                $set:
                {
                    name: newName
                }
            }, { upsert: false });


        this.logger.log("updating model");

        this.logger.log('DataStore:saving Complete');

        return true;
    }
    async export(name, folderPath,owner=null) {
        const fs = require('fs');

        let model = await this.loadModel(name,owner);

        let fullpath = folderPath + "/" + name + ".bpmn";

        fs.writeFile(fullpath, model.source, function (err) {
            if (err) throw err;
            console.log(`Saved bpmn to ${fullpath}`);
        });

        fullpath = folderPath + "/" + name + ".svg";

        fs.writeFile(fullpath, model.svg, function (err) {
            if (err) throw err;
            console.log(`Saved svg to ${fullpath}`);
        });
    }
    async rebuild(model=null) {
    }
}

export { ModelsDatastoreDB }