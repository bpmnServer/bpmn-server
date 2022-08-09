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
    get cron(): Cron;
    get cache(): CacheManager;
    get appDelegate(): any;
    get engine(): IEngine;
    get dataStore(): any;
    get definitions(): any;
    get listener(): any;
    get acl(): any;
    get iam(): any;
}
export { ServerComponent };
