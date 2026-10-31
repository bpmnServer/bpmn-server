
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
    qualifyInstances(query);

    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyItems(query)
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */

    qualifyStartEvents(query);
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyDeleteInstances(query);
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

interface IUserService {
    findUsers(query);
    addUser(userName, email, password, userGroups);
    setPassword(userName, password);
    install();
}
export { IUserService,IUserInfo,ISecureUser}