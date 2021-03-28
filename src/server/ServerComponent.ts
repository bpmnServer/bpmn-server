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
	get dataStore() { return this.server.dataStore; }
	get engine(): IEngine { return this.server.engine; };
	get cron(): Cron { return this.server.cron; };
	get cache(): CacheManager { return this.server.cache; };
	get definitions() { return this.server.definitions; }
	get appDelegate() { return this.server.appDelegate; }
}

export { ServerComponent }