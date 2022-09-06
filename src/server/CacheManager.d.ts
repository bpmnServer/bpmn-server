import { ServerComponent } from './ServerComponent';
import { ICacheManager, IExecution } from '../interfaces';
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
    restart(): Promise<void>;
}
export { CacheManager };
