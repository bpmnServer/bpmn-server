import { ModelsDatastore } from '../datastore/ModelsDatastore';
import { IConfiguration, DataStore, CacheManager, ILogger, IAppDelegate } from '../..';
declare class Configuration implements IConfiguration {
    definitionsPath: string;
    templatesPath: string;
    timers: {
        forceTimersDelay: number;
        precision: number;
    };
    database: {
        MongoDB: {
            db_url: string;
            db: string;
        };
        loopbackRepositories?: any;
    };
    logger: ILogger;
    apiKey: string;
    sendGridAPIKey: string;
    definitions(server: any): ModelsDatastore;
    appDelegate(server: any): IAppDelegate;
    dataStore(server: any): DataStore;
    cacheManager(server: any): CacheManager;
    constructor({ definitionsPath, templatesPath, timers, database, apiKey, logger, definitions, appDelegate, dataStore, cacheManager }: {
        definitionsPath: any;
        templatesPath: any;
        timers: any;
        database: any;
        apiKey: any;
        logger: any;
        definitions: any;
        appDelegate: any;
        dataStore: any;
        cacheManager: any;
    });
}
declare var defaultConfiguration: Configuration;
export { Configuration, defaultConfiguration };
