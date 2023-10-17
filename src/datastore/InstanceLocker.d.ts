declare class InstanceLocker {
    dataStore: any;
    constructor(dataStore: any);
    lock(id: any): Promise<boolean>;
    try(id: any): Promise<boolean>;
    release(id: any): Promise<any>;
    list(): Promise<any>;
    delay(time: any, result: any): Promise<unknown>;
}
export { InstanceLocker };
