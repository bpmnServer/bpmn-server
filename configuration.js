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
			db: 'test'
		}
	},
};

module.exports = { configuration}