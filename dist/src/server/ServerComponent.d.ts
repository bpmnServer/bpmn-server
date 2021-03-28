import { Cron, CacheManager } from "./";
import { IEngine, IBPMNServer } from "../interfaces";
/**
 * super class for various objects that are part of the server
 * */
declare class ServerComponent {
    server: any;
    constructor(server: IBPMNServer);
    get configuration(): any;
    get logger(): any;
    get dataStore(): any;
    get engine(): IEngine;
    get cron(): Cron;
    get cache(): CacheManager;
    get definitions(): any;
    get appDelegate(): any;
}
export { ServerComponent };
