declare class CacheManager {
    static liveInstances: Map<any, any>;
    static getList(): any[];
    /**
    **/
    static getInstance(instanceId: any): any;
    static add(instance: any, engine: any): void;
    static remove(instanceId: any): void;
}
export { CacheManager };
