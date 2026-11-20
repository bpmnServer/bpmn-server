import type { IQueryFilter } from '../engine/AddOns.js';

interface IUserInfo {
    userName:string;        //  Unique, saved in the workflow
    userGroups:string[];    //  to filter for security
    tenantId?:string;       //  Used to mark instances    
    modelsOwner?:string;    //  Used If models are not shared among tentants
}
interface ISecureUser extends IUserInfo {

    isAdmin(): boolean;
    isSystem(): boolean;
    inGroup(userGroup): boolean;
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyInstances(query, filters?: IQueryFilter[]);

    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyItems(query, filters?: IQueryFilter[])
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */

    qualifyStartEvents(query, filters?: IQueryFilter[]);
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyDeleteInstances(query, filters?: IQueryFilter[]);
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyModels(query);
    /**
     */
    canModifyModel(name);
    /**
     */
    canDeleteModel(name);
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyViewItems(query);
    canInvoke(item);
    canAssign(item);
    canStart(name, startNodeId, user);
}

export { IUserInfo, ISecureUser }