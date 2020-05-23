'use strict';
const DFS  = require('./src/ModelsDatastore');

let definitionsPath = __dirname + '/processes/';
var configuration =
{
	definitionsPath: definitionsPath,
	definitions: new DFS.ModelsDatastore(definitionsPath) ,
	engineClassPath: __dirname+'/CustomEngine.js',
	database: {
		MongoDB:
		{
			db_url: "mongodb://localhost:27017?retryWrites=true&w=majority",
			db: 'test',
			instance_collection: 'wf_instances',
			item_collection: 'wf_instance_items'
		}
	},
};


module.exports = { configuration}