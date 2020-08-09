"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BPMNServer = void 0;
const Logger_1 = require("../common/Logger");
const Engine_1 = require("./Engine");
const CacheManager_1 = require("./CacheManager");
const Cron_1 = require("./Cron");
const fs = require('fs');
/**
 *	The main class of Server Layer
 *	provides the full functionalities:
 *
 *		1.	access to Execution engine
 *		2.	data Presistence through DataStore class
 *		3.	access to models definitions, loading and saving of models
 *		4.	access to BPMN definition details
 *
 *		primary Use Cases:
 *		a.	execute a process
 *			server= new BPMNServer(...);
 *			server.execute(...);
 *
 *		b.	invoke a task in an already started process
 *			server= new BPMNServer(...);
 *			server.invoke(...);
 *
 *		c.	find items (various options)
  *			server= new BPMNServer(...);
 *			server.findItems(...);
*/
class BPMNServer {
    /**
     * Server Constructor
     *
     * @param configuration	see
     * @param logger
     */
    constructor(configuration, logger, options = {}) {
        if (logger == null) {
            logger = new Logger_1.Logger({});
        }
        this.logger = logger;
        this.configuration = configuration;
        this.cron = new Cron_1.Cron(this);
        this.cache = new CacheManager_1.CacheManager(this);
        this.engine = new Engine_1.Engine(this);
        this.dataStore = configuration.dataStore(this);
        this.definitions = configuration.definitions(this);
        this.appDelegate = configuration.appDelegate(this);
        console.log("bpmn-server version " + BPMNServer.getVersion());
        if (options['cron'] == false) {
            return;
        }
        this.cron.start();
    }
    static getVersion() {
        const pack = require("../../package.json");
        return pack.version;
    }
}
exports.BPMNServer = BPMNServer;
//# sourceMappingURL=BPMNServer.js.map