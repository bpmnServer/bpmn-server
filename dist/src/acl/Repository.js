"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = exports.Authorization = exports.Involvement = exports.Notification = exports.Assignment = exports.User = void 0;
const MongoDB = require('../datastore/MongoDB').MongoDB;
const fs = require('fs');
const Path = require('path');
const { v4: uuidv4 } = require('uuid');
/**
 *  find assigned Items for userId
 *  find assigned Items for userGroup
 *  find authorized Items
 * */
class BaseRepository {
    constructor(server, cls, coll = null) {
        const dbConfiguration = server.configuration.database.MongoDB;
        this.db = new MongoDB(dbConfiguration, server.logger);
        this.dbname = dbConfiguration.db;
        this.cls = cls;
        if (coll == null)
            this.coll = cls.name;
        else
            this.coll = coll;
    }
    insert(objects) {
        return __awaiter(this, void 0, void 0, function* () {
            let i;
            const results = [];
            for (let i = 0; i < objects.length; i++) {
                let obj = objects[i];
                let cls = obj.constructor.name;
                results.push(yield this.db.insert(this.dbname, this.coll, [obj]));
            }
            return results;
        });
    }
    update(query, updateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.db.getClient();
            // Get the documents collection
            const db = client.db(this.dbname);
            const collection = db.collection(this.coll);
            let self = this;
            return new Promise(function (resolve, reject) {
                collection.updateMany(query, {
                    $set: updateObject
                }, {}, function (err, result) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        resolve(JSON.parse(result).n);
                    }
                });
            });
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = yield this.db.remove(this.dbname, this.coll, query);
            return res;
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var records = yield this.db.find(this.dbname, this.coll, query, {});
            const objs = [];
            records.forEach(rec => {
                objs.push(Object.assign(new this.cls, rec));
            });
            //console.log(objs);
            return objs;
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var records = yield this.db.find(this.dbname, this.coll, query, {});
            const objs = [];
            records.forEach(rec => {
                objs.push(Object.assign(new this.cls, rec));
            });
            return objs[0];
        });
    }
}
exports.BaseRepository = BaseRepository;
var rulesCount = 0;
var rulesMatched = 0;
class User {
    constructor() {
        this.id = uuidv4();
    }
    static findById(server, id) {
        User.Repository(server).findOne({ id: id });
    }
    static Repository(server) {
        return new BaseRepository(server, User, 'User');
    }
}
exports.User = User;
class Involvement {
    constructor() {
        this.id = uuidv4();
    }
    describe() {
        return `Designate '${this.userId}' as '${this.assignActor}' by Rule: ${this.ruleId}`;
    }
}
exports.Involvement = Involvement;
class Assignment {
    constructor() {
        this.id = uuidv4();
    }
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Assign Task to '${user}' by Rule: ${this.ruleId} by Rule: ${this.ruleId}`;
    }
}
exports.Assignment = Assignment;
class Authorization {
    constructor() {
        this.id = uuidv4();
    }
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Authorize '${user}' to '${this.privilege}' by Rule: ${this.ruleId}`;
    }
}
exports.Authorization = Authorization;
class Notification {
    constructor() {
        this.id = uuidv4();
    }
    /**
     * will issue the notification through email
     * if delayed, will wait for the cron job to execute it
     *
     * Step 1:  build the template
     *
     * Step 2:  Issue the email;
     * */
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const pug = require('pug');
            const template = this.template ? this.template : 'default';
            let users;
            context.logger.log("Notification:execute" + this.describe());
            if (this.userGroup) {
                context.logger.log("User Group:" + this.userGroup);
                users = yield context.server.iam.getUsersForGroup(this.userGroup);
            }
            else
                users = [yield context.server.iam.getUser(this.userId)];
            users.forEach(user => {
                if (user) {
                    const path = context.server.configuration.templatesPath + '/' + template;
                    const msg = pug.renderFile(path + '.message.pug', { context, notification: this });
                    const body = pug.renderFile(path + '.body.pug', { context, notification: this });
                    console.log("email msg", msg);
                    console.log("emailbody", body);
                    context.server.appDelegate.sendEmail(user.email, msg, body);
                }
            });
        });
    }
    describe() {
        const user = (this.userGroup ? this.userGroup : this.userId);
        return `Notify '${user}' on '${this.event}' by Rule: ${this.ruleId}`;
    }
}
exports.Notification = Notification;
//# sourceMappingURL=Repository.js.map