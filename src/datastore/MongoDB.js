'use strict';
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
exports.MongoDB = void 0;
const MongoClient = require('mongodb').MongoClient;
const MongoDb = require('mongodb');
const mongoose = require('mongoose');
const assert = require('assert');
//mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);
/*Replace update() with updateOne(), updateMany(), or replaceOne()
Replace remove() with deleteOne() or deleteMany().
Replace count() with countDocuments(), unless you want to count how many documents are in the whole collection(no filter).In the latter case, use estimatedDocumentCount().
*/
class MongoDB {
    constructor(dbConfig, logger) {
        this.dbConfig = dbConfig;
        this.logger = logger;
    }
    getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client == null) {
                this.client = yield this.connect();
            }
            return this.client;
        });
    }
    find(dbName, collName, qry, projection = null) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.getClient();
            const db = client.db(dbName);
            const collection = db.collection(collName);
            return new Promise(function (resolve, reject) {
                // Use connect method to connect to the Server
                let cursor;
                cursor = collection.find(qry).project(projection);
                cursor.toArray(function (err, docs) {
                    // Do async job
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(docs);
                    }
                });
            });
        });
    }
    // db.collection.createIndex( { "a.loc": 1, "a.qty": 1 }, { unique: true } )
    createIndex(dbName, collName, index, unique = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.getClient();
            const db = client.db(dbName);
            const collection = db.collection(collName);
            let self = this;
            return new Promise(function (resolve, reject) {
                collection.createIndex(index, unique, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        //  self.logger.log(" inserted " + result.result);
                        //                console.log(result);
                        resolve(result.result);
                    }
                });
            });
        });
    }
    insert(dbName, collName, docs) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.getClient();
            // Get the documents collection
            const db = client.db(dbName);
            const collection = db.collection(collName);
            // Insert some documents
            let self = this;
            return new Promise(function (resolve, reject) {
                collection.insertMany(docs, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        // self.logger.log(" inserted " + result.result.n);
                        //                console.log(result);
                        resolve(result.result.n);
                    }
                });
            });
        });
    }
    update(dbName, collName, query, updateObject, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.getClient();
            // Get the documents collection
            const db = client.db(dbName);
            const collection = db.collection(collName);
            // Insert some documents
            let self = this;
            return new Promise(function (resolve, reject) {
                collection.updateOne(query, updateObject, options, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        self.logger.log(" updated " + JSON.parse(result).n);
                        resolve(JSON.parse(result).n);
                    }
                });
            });
        });
    }
    update2(dbName, collName, query, updateObject, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.getClient();
            // Get the documents collection
            const db = client.db(dbName);
            const collection = db.collection(collName);
            // Insert some documents
            let self = this;
            return new Promise(function (resolve, reject) {
                collection.update(query, updateObject, options, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        self.logger.log(" updated " + JSON.parse(result).n);
                        resolve(JSON.parse(result).n);
                    }
                });
            });
        });
    }
    remove(dbName, collName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.getClient();
            // Get the documents collection
            const db = client.db(dbName);
            const collection = db.collection(collName);
            // Insert some documents
            let self = this;
            return new Promise(function (resolve, reject) {
                collection.deleteMany(query, function (err, result) {
                    if (err) {
                        self.logger.log("error " + err);
                        reject(err);
                    }
                    else {
                        self.logger.log("remove done for  " + JSON.parse(result).n + " docs in " + collName);
                        resolve(result);
                    }
                });
            });
        });
    }
    removeById(dbName, collName, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var client = yield this.getClient();
            // Get the documents collection
            const db = client.db(dbName);
            const collection = db.collection(collName);
            // Insert some documents
            let self = this;
            return new Promise(function (resolve, reject) {
                collection.deleteOne({ _id: new MongoDb.ObjectID(id) }, function (err, result) {
                    if (err) {
                        self.logger.log("error " + err);
                        reject(err);
                    }
                    else {
                        self.logger.log("remove done for " + id + " >" + JSON.parse(result).n);
                        resolve(result);
                    }
                });
            });
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Return new promise 
            const client = new MongoClient(this.dbConfig.db_url, { useUnifiedTopology: true });
            return new Promise(function (resolve, reject) {
                // Use connect method to connect to the Server
                client.connect(function (err) {
                    // Do async job
                    if (err) {
                        reject(err);
                        client.close();
                    }
                    else {
                        resolve(client);
                    }
                });
            });
        });
    }
}
exports.MongoDB = MongoDB;
//# sourceMappingURL=MongoDB.js.map