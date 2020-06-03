import { ModelsDatastore } from '../server';
import { DefaultHandler } from './DefaultHandler';
declare var defaultConfiguration: {
    definitionsPath: string;
    definitions: ModelsDatastore;
    appDelegate: DefaultHandler;
    database: {
        MongoDB: {
            db_url: string;
            db: string;
        };
    };
};
export { defaultConfiguration };
