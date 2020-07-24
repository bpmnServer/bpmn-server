import { ServerComponent } from './ServerContext';
import { ExecutionContext } from '.';
declare class CacheManager extends ServerComponent {
    static liveInstances: Map<any, any>;
    list(): any[];
    /**
    **/
    getInstance(instanceId: any): any;
    add(executionContext: ExecutionContext): void;
    remove(instanceId: any): void;
    shutdown(): Promise<void>;
    restart(): Promise<void>;
}
export { CacheManager };
