/**
 *  find assigned Items for userId
 *  find assigned Items for userGroup
 *  find authorized Items
 * */
declare class BaseRepository<T> {
    db: any;
    dbname: any;
    coll: any;
    cls: any;
    constructor(server: any, cls: any, coll?: any);
    insert(objects: T[]): Promise<any>;
    update(query: any, updateObject: any): Promise<any>;
    delete(query: any): Promise<any>;
    find(query: any): Promise<T[]>;
    findOne(query: any): Promise<T>;
}
declare class User {
    _id: any;
    id: any;
    userId: any;
    name: any;
    email: any;
    userGroups: any;
    password: any;
    static findById(server: any, id: any): void;
    static Repository(server: any): BaseRepository<User>;
}
export { User, BaseRepository };
