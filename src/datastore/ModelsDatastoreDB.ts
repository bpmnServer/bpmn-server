
import { Definition } from "../elements";
import { BPMNServer } from "../server";



const fs = require('fs');
const Path = require('path')

const BpmnModdle = require('bpmn-moddle');
import { ServerComponent } from "../server/ServerComponent";
import { IBpmnModelData, IModelsDatastore, IEventData } from "../interfaces/";
import { BpmnModelData } from "./ModelsData";


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

        // this.logger.log('find events for ' + " recs:" + records.length);
        const list = [];
        records.forEach(r => { list.push({ name: r.name, saved: r.saved }); });
        return list;
    }
    /*
     *	loads a definition 
     *	
     */
    async load(name): Promise<Definition> {

        let data = await this.loadModel(name);
        const definition = new Definition(name, data.source, this.server);
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
    async loadModel(name): Promise<BpmnModelData> {

        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, { name: name }, {});

        this.logger.log('find model for  ' + name + " recs:" + records.length);

        return records[0];

    }

    async save(name, source, svg): Promise<any> {
        let bpmnModelData: BpmnModelData = new BpmnModelData(name, source, svg, null, null);
        let definition = new Definition(bpmnModelData.name, bpmnModelData.source, this.server);
        try {
            await definition.load();

            bpmnModelData.parse(definition);
            await this.saveModel(bpmnModelData);

            return bpmnModelData;
        }
        catch(exc)
        {
            console.log('error in save',exc);
            throw exc;
            return null;
        }

    }
    async findEvents(query): Promise<IEventData[]> {

        let projection = {}; // this.getProjection(query);
        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, query, projection);

        // this.logger.log('...find events for ' + JSON.stringify(query) + " recs:" + records.length);

        const events = [];

        records.forEach(rec => {
            rec.events.forEach(ev => {
                let pass = true;

                if (query) {
                    const keys = Object.keys(query);
                    keys.forEach(key => {
                        let prop=key.replace('events.', '');
                        if (ev[prop] !== query[key])
                            pass = false;
                    });
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
        return await this.db.createIndex(this.dbConfiguration.db, Definition_collection, { name: 1 }, { unique: true });
    }
    async import(data) {
        console.log('inserting');
        return await this.db.insert(this.dbConfiguration.db, Definition_collection, data);

    }
    async updateTimer(name): Promise<boolean> {

        const source = await this.getSource(name);
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
    async saveModel(model: IBpmnModelData): Promise<boolean> {

        this.logger.log("Saving Model " + model.name);

        var recs;
        model.saved = new Date().toISOString();

        await this.db.update(this.dbConfiguration.db, Definition_collection,
            { name: model.name },
            {
                $set:
                {
                    name: model.name, saved: model.saved, source: model.source, svg: model.svg, processes: model.processes, events: model.events
                }
            }, { upsert: true });


        return true;

    }
    async deleteModel(name) {

        await this.db.remove(this.dbConfiguration.db, Definition_collection, { name: name });

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
    async export(name, folderPath) {

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
    async rebuild(model=null) {
    }
}

export { ModelsDatastoreDB }