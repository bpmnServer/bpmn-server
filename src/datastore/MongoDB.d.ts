declare class MongoDB {
    client: any;
    dbConfig: any;
    logger: any;
    constructor(dbConfig: any, logger: any);
    getClient(): Promise<any>;
    find(dbName: any, collName: any, qry: any, projection?: any): Promise<unknown>;
    createIndex(dbName: any, collName: any, index: any, unique?: {}): Promise<unknown>;
    insert(dbName: any, collName: any, docs: any): Promise<unknown>;
    update(dbName: any, collName: any, query: any, updateObject: any, options?: {}): Promise<unknown>;
    update2(dbName: any, collName: any, query: any, updateObject: any, options?: {}): Promise<unknown>;
    remove(dbName: any, collName: any, query: any): Promise<unknown>;
    removeById(dbName: any, collName: any, id: any): Promise<unknown>;
    connect(): Promise<unknown>;
}
export { MongoDB };
