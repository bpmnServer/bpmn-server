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
class Involvement {
    id = uuidv4();
    ruleId;
    userId;
    assignActor;
    describe() {
        return `Designate '${this.userId}' as '${this.assignActor}' by Rule: ${this.ruleId}`;
    }
}
class Assignment {
    id = uuidv4();
    ruleId;
    userId;
    userName;
    userGroup;
    dateCreated;
    describe() {
        const user=(this.userGroup ? this.userGroup : this.userId);
        return `Assign Task to '${user}' by Rule: ${this.ruleId} by Rule: ${this.ruleId}`;
    }
}
class Authorization {
    id = uuidv4();
    ruleId;
    userId;
    userName;
    userGroup;
    privilege;

    dateCreated;
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Authorize '${user}' to '${this.privilege}' by Rule: ${this.ruleId}`;
    }
}
class Notification {
    id = uuidv4();
    ruleId;
    userId;
    userName;
    userGroup;
    event;
    eventDate;
    template;
    delay;
    status;     // created; but not issued
    // issued;
    // cancelled
    issueDate;  //  eventDate+delay
    repeat;
    cancelEvent;
    cancelDate;
    dateCreated;
    text;
    /**
     * will issue the notification through email
     * if delayed, will wait for the cron job to execute it
     * 
     * Step 1:  build the template 
     * 
     * Step 2:  Issue the email;
     * */
    async execute(context: IExecution) {
        const pug = require('pug');
        const template = this.template ? this.template : 'default';
        let users;
        context.logger.log("Notification:execute"+ this.describe());
        if (this.userGroup) {
            context.logger.log("User Group:"+ this.userGroup);
            users = await context.server.iam.getUsersForGroup(this.userGroup);
        }
        else
            users=[await context.server.iam.getUser(this.userId)];


        users.forEach(user => {
            if (user) {
                const path = context.server.configuration.templatesPath + '/' + template;
                const msg = pug.renderFile(path + '.message.pug', { context, notification: this });
                const body = pug.renderFile(path + '.body.pug', { context, notification: this })
                console.log("email msg", msg);
                console.log("emailbody", body);
                context.server.appDelegate.sendEmail(user.email, msg, body);
            }
        });

    }
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Notify '${user}' on '${this.event}' by Rule: ${this.ruleId}`;
    }
}

export { User, Assignment, Notification, Involvement, Authorization, BaseRepository}