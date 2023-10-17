import { ServerComponent } from './ServerComponent';
import { ICacheManager, IExecution } from '../interfaces';
declare class NoCacheManager extends ServerComponent implements ICacheManager {
    constructor(server: any);
    list(): any[];
    /**
    **/
    getInstance(instanceId: any): any;
    add(execution: IExecution): any;
    remove(instanceId: any): any;
    shutdown(): void;
    restart(): void;
}
declare class CacheManager extends ServerComponent implements ICacheManager {
    static liveInstances: Map<any, any>;
    constructor(server: any);
    list(): any[];
    /**
    **/
    getInstance(instanceId: any): any;
    add(execution: IExecution): void;
    remove(instanceId: any): void;
    shutdown(): Promise<void>;
}
export { CacheManager, NoCacheManager };
