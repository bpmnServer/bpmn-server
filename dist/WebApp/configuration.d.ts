import { ModelsDatastore } from '../dist';
import { MyHandler } from './handler';
declare var configuration: {
    definitionsPath: string;
    definitions: ModelsDatastore;
    appDelegate: MyHandler;
    database: {
        MongoDB: {
            db_url: string;
            db: string;
        };
    };
};
export { configuration };
