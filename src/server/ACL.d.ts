/// <reference types="node" />
import { EventEmitter } from "events";
import { DesignateRule, NotifyRule, AssignRule, AuthorizeRule } from '../acl/';
import { User } from '../acl/';
import { IACL, IIAM } from "../interfaces/server";
declare class IAM implements IIAM {
    server: any;
    static currentUsers: Map<any, any>;
    constructor(server: any);
    addUser(userId: any, name: any, email: any, userGroups: any, password: any): Promise<User>;
    /**
     * Returns a key
     * @param userId
     */
    getRemoteUser(userId: any): any;
    login(userId: any, password: any): Promise<any>;
    /**
     *
     *
     * @param key
     */
    getCurrentUser(key: any): User;
    getUser(userId: any): Promise<User>;
    getUsersForGroup(userGroup: any): Promise<User[]>;
}
declare class ACL implements IACL {
    listener: EventEmitter;
    server: any;
    constructor(server: any);
    canPerform(operation: any, object: any): boolean;
    checkEvent(event: any, context: any): void;
    checkFileExistsSync(filepath: any): boolean;
    loadAccessRules(processName: any): any[];
    static convertRule(spec: any): DesignateRule | AuthorizeRule | AssignRule | NotifyRule;
    listen(listener: any): void;
    cancelPendingAssignments(self: any, id: any, seq: any): Promise<void>;
}
export { ACL, IAM };
