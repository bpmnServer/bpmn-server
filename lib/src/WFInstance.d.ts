/***
 *	============================================================
 * */
declare class WFInstance {
    id: any;
    name: any;
    startAt: any;
    endAt: any;
    data: any;
    state: any;
    lastAt: any;
    lastItem: any;
    lastStatus: any;
    items: Map<any, any>;
    logs: any[];
    engineClassPath: any;
    dbAction: any;
    modified: boolean;
    constructor(action?: string);
    getDataObject(): {
        id: any;
        name: any;
        startAt: any;
        endAt: any;
        lastAt: any;
        lastItem: any;
        lastStatus: any;
        engineClassPath: any;
        data: any;
    };
    fromDataObject(instanceObj: any): void;
    getItems({ status, name }: {
        status?: any;
        name?: any;
    }): any[];
}
export { WFInstance };
