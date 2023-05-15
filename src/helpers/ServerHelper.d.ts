declare class ServerHelper {
    constructor(configuration: any);
    bpmnServer: any;
    configuration: any;
    instance: any;
    items: any;
    engine: any;
    instanceId: any;
    log(msg: any): void;
    getLogger(): any;
    execute(definitionName: any, data?: {}): Promise<this>;
    invoke(nodeName: any, data: any): Promise<this>;
    waitingItems(): any[];
    completedItems(): any[];
    getItems(status: any): any[];
    resetData(): Promise<boolean>;
    dumpInfo(execution: any): Promise<boolean>;
    isComplete(): Promise<boolean>;
    checkItem(query: any, step: any): Promise<boolean>;
    findItems(query: any): Promise<any>;
    delay(time: any, result: any): Promise<unknown>;
    saveLog(name: any): void;
}
export { ServerHelper };
