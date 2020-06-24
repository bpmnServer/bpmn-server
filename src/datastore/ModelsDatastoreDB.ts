import { Definition, IModelsDatastore, BpmnModelData } from "../..";
import { ServerComponent , BPMNServer } from "../server";
import { IBpmnModelData } from "../interfaces/datastore";


const fs = require('fs');
const Path = require('path')
const MongoDB = require('./MongoDB').MongoDB;


const Definition_collection = 'wf_models';
const Events_collection = 'wf_events';

class ModelsDatastoreDB extends ServerComponent implements IModelsDatastore {
    dbConfiguration;
    db;

    constructor(server: BPMNServer) {
        super(server);

        this.dbConfiguration = this.configuration.database.MongoDB;
        this.db = new MongoDB(this.dbConfiguration, this.logger);

    }
    async getList(): Promise<string[]> {

        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, {}, {});

        this.logger.log('find events for ' +  " recs:" + records.length);
        const list = [];
        records.forEach(r => { list.push(r.name); });
        return list;
    }
	/*
	 *	loads a definition 
	 *	
	 */
    async load(name): Promise<Definition> {

        let data = await this.loadModel(name);
        const definition = new Definition(name, data.source, this.logger);
        await definition.load();
        return definition;
    }
    async getSource(name) {
        let model = await this.loadModel(name);
        return model.source;

    }
    async getSVG(name) {
        let model = await this.loadModel(name);
        return model.svg;

    }
	/*
	 *	loads a definition data record from DB
	 *	
	 */
    async loadModel(name) : Promise<BpmnModelData> {

        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, { name: name } , {});

        this.logger.log('find model for  ' + name + " recs:" + records.length);

        return records[0];

    }
    async save(name,source,svg): Promise<any> {
        let bpmnModelData: BpmnModelData = new BpmnModelData(name, source, svg, null, null);
        let definition = new Definition(bpmnModelData.name, bpmnModelData.source, this.logger);
        await definition.load();

        bpmnModelData.parse(definition);
        await this.saveModel(bpmnModelData);

        return bpmnModelData;

    }
    async findEvents(query) {

        let projection = this.getProjection(query);
        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, query, projection);

        this.logger.log('find events for ' + JSON.stringify(query)  + " recs:" + records.length);
        const events = [];
        records.forEach(rec => {
            rec.events.forEach(ev => {
                ev.modelName = rec.name;
                ev._id = rec._id;
                events.push(ev);

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
            if (match == {})
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
        return await this.db.createIndex(this.dbConfiguration.db, Definition_collection,{ name: 1 }, { unique: true });
    }
    async import(data) {
        console.log('inserting');
        console.log(data.length);
        return await this.db.insert(this.dbConfiguration.db, Definition_collection, data);

    }
    async saveModel(model: IBpmnModelData): Promise<boolean> {

        this.logger.log("Saving...");

        var recs;
        model.saved = new Date().toISOString();;

            await this.db.update(this.dbConfiguration.db, Definition_collection,
                { name: model.name },
                {
                    $set:
                    {
                        name: model.name, source: model.source, svg: model.svg, processes: model.processes, events: model.events
                    }
                }, { upsert: true });


            this.logger.log("updating model");

        this.logger.log('DataStore:saving Complete');

        return true;

    }
    async deleteModel(name) {

        await this.db.remove(this.dbConfiguration.db, Definition_collection, { name: name});

    }
    async renameModel(name, newName) {

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
    async export(name,folderPath) {

        let model = await this.loadModel(name);

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
}

export {ModelsDatastoreDB  }