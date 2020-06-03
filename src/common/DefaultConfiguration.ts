
import { ModelsDatastore } from '../server';
import { DefaultHandler } from './DefaultHandler';

let definitionsPath = __dirname + '/processes/';
var defaultConfiguration =
{
	definitionsPath: definitionsPath,
	definitions: new ModelsDatastore(definitionsPath) ,
	appDelegate: new DefaultHandler(),
	database: {
		MongoDB:
		{
			db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
			db: 'test'
		}
	},
};

export { defaultConfiguration}