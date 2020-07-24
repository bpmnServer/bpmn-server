import { ModelsDatastoreDB } from '../datastore/ModelsDatastoreDB';
import { DefaultAppDelegate } from '../engine/DefaultAppDelegate';
import { IConfiguration, DataStore, ILogger } from '../..';
declare class Configuration implements IConfiguration {
    definitionsPath: string;
    timers: {
        forceTimersDelay: number;
        precision: number;
    };
    database: {
        MongoDB: {
            db_url: string;
            db: string;
        };
    };
    logger: ILogger;
    definitions(server: any): ModelsDatastoreDB;
    appDelegate(server: any): DefaultAppDelegate;
    dataStore(server: any): DataStore;
    constructor({ definitionsPath, timers, database, logger, definitions, appDelegate, dataStore }: {
        definitionsPath: any;
        timers: any;
        database: any;
        logger: any;
        definitions: any;
        appDelegate: any;
        dataStore: any;
    });
}
declare var defaultConfiguration: Configuration;
export { Configuration, defaultConfiguration };
