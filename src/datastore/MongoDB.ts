'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoDb = require('mongodb');
const mongoose= require('mongoose');
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
    client;
    dbConfig;
    logger;
    constructor(dbConfig,logger) {
        this.dbConfig = dbConfig;
        this.logger = logger;
    }
    async getClient() {

        if (this.client == null) {
            this.client = await this.connect();
        }
        return this.client;
    }
    async find( dbName, collName, qry, projection=null) {

        var client = await this.getClient();

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
                } else {
                    resolve(docs);
                }
            })
        })
    }

    // db.collection.createIndex( { "a.loc": 1, "a.qty": 1 }, { unique: true } )

    async createIndex(dbName, collName, index, unique = {} ) {
        var client = await this.getClient();

        const db = client.db(dbName);
        const collection = db.collection(collName);

        let self = this;

        return new Promise(function (resolve, reject) {


            collection.createIndex(index, unique , function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    //  self.logger.log(" inserted " + result.result);
                    //                console.log(result);
                    resolve(result.result);
                }
            });
        });

    }
    async insert(dbName, collName, docs) {

        var client = await this.getClient();

        // Get the documents collection
        const db = client.db(dbName);
        const collection = db.collection(collName);
        // Insert some documents

        let self = this;
        return new Promise(function (resolve, reject) {

            collection.insertMany(docs, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    // self.logger.log(" inserted " + result.result.n);
    //                console.log(result);
                    resolve(result.result.n);
                }
            });
        });

    }

    async update(dbName, collName, query, updateObject, options = {}) {

        var client = await this.getClient();

        // Get the documents collection
        const db = client.db(dbName);
        const collection = db.collection(collName);
        // Insert some documents
        let self = this;
        return new Promise(function (resolve, reject) {

            collection.updateOne(query, updateObject, options, 
                function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    self.logger.log(" updated " + JSON.parse(result).n );
                    resolve(JSON.parse(result).n );
                }
            });
        });
    }
    async update2(dbName, collName, query, updateObject, options = {}) {

        var client = await this.getClient();

        // Get the documents collection
        const db = client.db(dbName);
        const collection = db.collection(collName);
        // Insert some documents
        let self = this;
        return new Promise(function (resolve, reject) {

            collection.update(query, updateObject, options,
                function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        self.logger.log(" updated " + JSON.parse(result).n);
                        resolve(JSON.parse(result).n);
                    }
                });
        });
    }

    async remove(dbName, collName, query) {

        var client = await this.getClient();

        // Get the documents collection
        const db = client.db(dbName);
        const collection = db.collection(collName);
        // Insert some documents

        let self = this;
        return new Promise(function (resolve, reject) {


            collection.deleteMany(query,
                function (err, result) {
                    if (err) {
                        self.logger.log("error " + err);
                        reject(err);
                    } else {

                        self.logger.log("remove done for  " + JSON.parse(result).n + " docs in " + collName);

                        resolve(result);
                    }
                });
        });
    }

    async removeById(dbName,collName,id) {

        var client = await this.getClient();

        // Get the documents collection
        const db = client.db(dbName);
        const collection = db.collection(collName);
        // Insert some documents

        let self = this;
        return new Promise(function (resolve, reject) {


            collection.deleteOne({ _id: new MongoDb.ObjectID(id) },
                 function (err, result) {
                if (err) {
                    self.logger.log("error " + err);
                    reject(err);
                } else {

                    self.logger.log("remove done for " + id + " >" + JSON.parse(result).n );

                    resolve(result);
                }
            });
        });
    }

    async connect() {
    // Return new promise 
        const client = new MongoClient(this.dbConfig.db_url , { useUnifiedTopology: true });

    return new Promise(function (resolve, reject) {

        // Use connect method to connect to the Server
        client.connect(function (err) {
            // Do async job
            if (err) {
                reject(err);
                client.close();
            } else {
                resolve(client);
            }
        })
    })
    }
}

export  { MongoDB };