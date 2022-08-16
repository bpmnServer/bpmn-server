import { EventEmitter } from "events";
import { BPMNServer } from '../server';
import { IExecution } from "../interfaces/engine";
import { IUser } from "../interfaces";
const MongoDB = require('../datastore/MongoDB').MongoDB;

const fs = require('fs');
const Path = require('path')

const { v4: uuidv4 } = require('uuid');
/**
 *  find assigned Items for userId
 *  find assigned Items for userGroup
 *  find authorized Items 
 * */

class BaseRepository<T>  {
    db;
    dbname;
    coll;
    cls;
    constructor(server,cls, coll = null) {
        const dbConfiguration = server.configuration.database.MongoDB;

        this.db = new MongoDB(dbConfiguration, server.logger);
        this.dbname = dbConfiguration.db;
        this.cls = cls;
        if (coll == null)
            this.coll = cls.name;
        else
            this.coll = coll;

    }
    async insert(objects: T[]): Promise<any> {
        let i;
        const results = [];
        for (let i = 0; i < objects.length; i++) {
            let obj = objects[i];
            let cls = obj.constructor.name;
            results.push(await this.db.insert(this.dbname, this.coll, [obj]));
        }
        return results;
    }
    async update(query, updateObject): Promise<any> {

        var client = await this.db.getClient();

        // Get the documents collection
        const db = client.db(this.dbname);
        const collection = db.collection(this.coll);
        let self = this;
        return new Promise(function (resolve, reject) {

            collection.updateMany(query,
                {
                    $set: updateObject
                }
                , {},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        resolve(JSON.parse(result).n);
                    }
                });
        });
    }

    async delete(query: any): Promise<any> {

        let res = await this.db.remove(this.dbname, this.coll, query);
        return res;

    }
    async find(query): Promise<T[]> {
        var records = await this.db.find(this.dbname, this.coll, query, {});
        const objs = [];
        records.forEach(rec => {

            objs.push(Object.assign(new this.cls, rec));
        });
        //console.log(objs);
        return objs;

    }
    async findOne(query): Promise<T> {
        var records = await this.db.find(this.dbname, this.coll, query, {});
        const objs = [];
        records.forEach(rec => {

            objs.push(Object.assign(new this.cls, rec));
        });
        return objs[0];
    }
}

var rulesCount = 0;
var rulesMatched = 0;
class User {
    _id;
    id = uuidv4();
    userId;
    name;
    email;
    userGroups;
    password;

    static findById(server,id) {
        User.Repository(server).findOne({ id: id });
    }
    static Repository(server) {
        return new BaseRepository<User>(server,User, 'User');
    }
}

export { User, BaseRepository}