import { IExecution } from "../interfaces/engine";
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
declare class Involvement {
    id: any;
    ruleId: any;
    userId: any;
    assignActor: any;
    describe(): string;
}
declare class Assignment {
    id: any;
    ruleId: any;
    userId: any;
    userName: any;
    userGroup: any;
    dateCreated: any;
    describe(): string;
}
declare class Authorization {
    id: any;
    ruleId: any;
    userId: any;
    userName: any;
    userGroup: any;
    privilege: any;
    dateCreated: any;
    describe(): string;
}
declare class Notification {
    id: any;
    ruleId: any;
    userId: any;
    userName: any;
    userGroup: any;
    event: any;
    eventDate: any;
    template: any;
    delay: any;
    status: any;
    issueDate: any;
    repeat: any;
    cancelEvent: any;
    cancelDate: any;
    dateCreated: any;
    text: any;
    /**
     * will issue the notification through email
     * if delayed, will wait for the cron job to execute it
     *
     * Step 1:  build the template
     *
     * Step 2:  Issue the email;
     * */
    execute(context: IExecution): Promise<void>;
    describe(): string;
}
export { User, Assignment, Notification, Involvement, Authorization, BaseRepository };
