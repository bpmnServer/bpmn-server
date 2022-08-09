import { Cron, CacheManager} from "./";
import { IEngine, IBPMNServer } from "../interfaces";


/**
 * super class for various objects that are part of the server
 * */
class ServerComponent {
	server;
	constructor(server: IBPMNServer) {
		this.server = server;
	}

	get configuration() { return this.server.configuration; }
	get logger() { return this.server.logger; }
	get cron(): Cron { return this.server.cron; };
	get cache(): CacheManager { return this.server.cache; };
	get appDelegate() { return this.server.appDelegate; }
	get engine(): IEngine { return this.server.engine; };
	get dataStore() { return this.server.dataStore; }
	get definitions() { return this.server.definitions; }
	get listener() { return this.server.listener; }
	get acl() { return this.server.acl;}
	get iam() { return this.server.iam; }
}

export { ServerComponent }