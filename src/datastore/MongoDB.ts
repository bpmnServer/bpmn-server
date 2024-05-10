'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoDb = require('mongodb');
//const mongoose= require('mongoose');
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
    operation;
    constructor(dbConfig,logger) {
        this.dbConfig = dbConfig;
        this.logger = logger;
        
    }
    profilerStart(operation) {
        if (process.env.ENABLE_PROFILER === 'true')
            console.time(operation);
        this.operation=operation;
    }
    profilerEnd() {
        if (process.env.ENABLE_PROFILER === 'true')
            console.timeEnd(this.operation);

    }
    async getClient() {

        if (this.client == null) {
            this.client = await this.connect();
        }
        return this.client;
    }
    async find( dbName, collName, qry, projection=null,sort=null) {

        var client = await this.getClient();

        const db = client.db(dbName);
        const collection = db.collection(collName);
        const self=this;

        return new Promise(function (resolve, reject) {

            // Use connect method to connect to the Server

            let cursor;
            self.profilerStart('>mongo.find:'+collName);
            if (projection)
                cursor = collection.find(qry).project(projection);
            else if (sort)
                cursor = collection.find(qry).sort(sort);
            else 
                cursor = collection.find(qry);
            
            self.profilerEnd();
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

        return new Promise(function (resolve, reject) {

            collection.createIndex(index, unique , function (err, result) {
                if (err) {
                    if (err.code==85)
                        console.log('index for '+JSON.stringify(index)+' already exists for collection "'+collName+'"' );
                    else
                        console.log('error',err);
                    resolve(null);
                } else 
                    {
                    //  self.logger.log(" inserted " + result.result);
                    console.log('index named "'+result+'" was created for collection "'+collName+'"');
                    resolve(result);
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

            self.profilerStart('>mongo.insert:'+collName);
            collection.insertMany(docs, function (err, result) {
                self.profilerEnd();
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

            self.profilerStart('>mongo.update:'+collName);
            collection.updateOne(query, updateObject, options, 
                function (err, result) {
                self.profilerEnd();

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

            self.profilerStart('>mongo.update:'+collName);
            collection.update(query, updateObject, options,
                function (err, result) {
                    self.profilerEnd();
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

            self.profilerStart('>mongo.remove:'+collName);
            collection.deleteMany(query,
                function (err, result) {
                    self.profilerEnd();

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