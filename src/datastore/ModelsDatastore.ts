//import { ModelsDatastoreDB } from "./ModelsDatastoreDB";

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

        this.logger.log('find events for ' + " recs:" + records.length);
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
        await definition.load();

        bpmnModelData.parse(definition);
        await this.saveModel(bpmnModelData);

        return bpmnModelData;

    }
    async findEvents(query): Promise<IEventData[]> {

        let projection = {}; // this.getProjection(query);
        var records = await this.db.find(this.dbConfiguration.db, Definition_collection, query, projection);

        this.logger.log('...find events for ' + JSON.stringify(query) + " recs:" + records.length);

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
}

export { ModelsDatastoreDB }
class ModelsDatastore extends ModelsDatastoreDB implements IModelsDatastore {

    definitionsPath;
    constructor(server: BPMNServer) {
        super(server);
    this.definitionsPath = server.configuration.definitionsPath;
        
    }

    async import(data) {
        return await super.import(data);

    }

    async getList(): Promise<string[]> {

        let files = [];

        fs.readdirSync(this.definitionsPath).forEach(file => {
            if (Path.extname(file) == '.bpmn') {
                let name = Path.basename(file);
                name = name.substring(0, name.length - 5);;
                files.push(name);
            }
        });
  
        return files;
    }

	/*
	 *	loads a definition
	 *	
	 */
    async load(name) : Promise<Definition> {

        const source = await this.getSource(name);
        //const rules = this.getFile(name, 'rules');

        const definition = new Definition(name, source, this.server);
        await definition.load();
        return definition;
    }

    private getPath(name, type) {

        return this.definitionsPath + name + '.' + type;
    }

    private getFile(name, type) {

        let file = fs.readFileSync(this.getPath(name,type),
            { encoding: 'utf8', flag: 'r' });
        return file;

    }
    private saveFile(name, type , data) {
        let fullpath = this.getPath(name, type);

        fs.writeFile(fullpath, data, function (err) {
            if (err) throw err;
            console.log(`Saved ${type} to ${fullpath}`);
        });

    }
    async getSource(name): Promise<string> {

        return this.getFile(name, 'bpmn');

    }
    async getSVG(name): Promise<string> {
        return this.getFile(name, 'svg');
    }

    async save(name, bpmn, svg?): Promise<boolean> {

        this.saveFile(name, 'bpmn', bpmn);
        if (svg)
            this.saveFile(name, 'svg', svg);

        await super.save(name, bpmn, svg);

        return true;

    }

    async deleteModel(name: any): Promise<void> {

        await super.deleteModel(name);
        await fs.unlink(this.definitionsPath + name + '.bpmn',  function (err) {
            if (err) console.log('ERROR: ' + err);
        });
        await fs.unlink(this.definitionsPath + name + '.svg',function (err) {
            if (err) console.log('ERROR: ' + err);
        });
    }
    async renameModel(name: any, newName: any): Promise<boolean> {

        await super.renameModel(name, newName);
        await fs.rename(this.definitionsPath + name + '.bpmn', this.definitionsPath + newName + '.bpmn', function (err) {
            if (err) console.log('ERROR: ' + err);
        });
        await fs.rename(this.definitionsPath + name + '.svg', this.definitionsPath + newName + '.svg', function (err) {
            if (err) console.log('ERROR: ' + err);
        });
        return true;
    }
    /**
     * 
     * reconstruct the models database from files
     * 
     * use when modifying the files manually or importing new environment
     * 
     * */
    async rebuild(model=null) {

        if (model)
            return this.rebuildModel(model);
        let filesList = await this.getList();
        const models = new Map();

        filesList.forEach(f => {
            const path=this.definitionsPath + f + '.bpmn';

            var stats = fs.statSync(path);
            var mtime = stats.mtime;
            models.set(f, mtime);
        });
        const dbList = await super.getList();
        dbList.forEach(model => {
            const name = model['name'];
            const saved = new Date(model['saved']);
            const entry = models.get(name);
            if (entry) {
                if (saved.getTime() > entry.getTime()) {
                    models.delete(name);
                }
            }
            else {
                super.deleteModel(name);
            }
        });
        let i;

        for (const entry of models.entries()) {
            const name = entry[0];
            await this.rebuildModel(name);
        }
    }
    private async rebuildModel(name) {
        console.log("rebuilding " + name);
        let source = await this.getSource(name);
        let svg;
        try {
            svg = await this.getSVG(name);
        }
        catch (exc) {
            //console.log(exc);
        }
        await super.save(name, source, svg);

    }

}

export {ModelsDatastore  }