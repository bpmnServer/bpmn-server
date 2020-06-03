
import { ModelsDatastore } from '../src';
import { MyHandler } from './handler';

let definitionsPath = __dirname + '/processes/';
var configuration =
{
	definitionsPath: definitionsPath,
	definitions: new ModelsDatastore(definitionsPath) ,
	appDelegate: new MyHandler(),
	database: {
		MongoDB:
		{
			db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
			db: 'test'
		}
	},
};

export { configuration}