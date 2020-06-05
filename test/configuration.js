
const { ModelsDatastore , DefaultHandler } = require ('../dist');


let definitionsPath = __dirname + '/processes/';
var configuration =
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

module.exports = { configuration };