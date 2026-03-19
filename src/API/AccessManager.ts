import { ISecureUser, IUserInfo } from "../interfaces";

enum USER_ROLE {
    SYSTEM = 'SYSTEM',  // SYSTEM ADMIN
    ADMIN = 'ADMIN',    // TENANT ADMIN
    DESIGNER = 'DESIGNER'
}

class SecureUser implements ISecureUser {
    userName;
    userGroups;
    tenantId?;
    modelsOwner?;

    static isSecurityBypassed(): boolean {
        return typeof process !== 'undefined' &&
            (process.env.REQUIRE_AUTHENTICATION === 'false' || process.env.ENFORCE_SECURITY === 'false');
    }

    constructor(params: IUserInfo) {
        Object.assign(this, params);
    }
    static SystemUser() {
        return new SecureUser({ userName: 'system', userGroups: [USER_ROLE.SYSTEM], tenantId: null, modelsOwner: null });
    }
    isAdmin(): boolean {
        if (SecureUser.isSecurityBypassed())
            return true;
        return (this.userGroups.includes(USER_ROLE.ADMIN) || this.userGroups.includes(USER_ROLE.SYSTEM));
    }
    isSystem(): boolean {
        if (SecureUser.isSecurityBypassed())
            return true;
        return (this.userGroups.includes(USER_ROLE.SYSTEM));
    }
    inGroup(userGroup) :boolean {
        if (SecureUser.isSecurityBypassed())
            return true;
        return (this.userGroups.includes(userGroup))
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyInstances(query) {
        if (SecureUser.isSecurityBypassed())
            return query;
        if (this.tenantId)
            query['tenantId'] = this.tenantId;
        if (!this.isAdmin()) {

            const grpQuery = [];

            grpQuery.push({ 'items.assignee': null, 'items.candidateUsers': null, 'items.candidateGroups': null });

            grpQuery.push({ 'items.assignee': this.userName });
            grpQuery.push({ 'items.candidateUsers': this.userName });

            this.userGroups.forEach(grp => {
                grpQuery.push({ 'items.candidateGroups': grp });
                });
            query['$or'] =grpQuery;
        }

        return query;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyItems(query) {
        if (SecureUser.isSecurityBypassed())
            return query;
        return this.qualifyInstances(query);

    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */

    qualifyStartEvents(query) {
        if (!this.isAdmin()) {
            const grpQuery = [];
            grpQuery.push({ "events.candidateUsers": null, "events.candidateGroups": null ,"events.lane": null });

            grpQuery.push({ 'events.candidateUsers': this.userName });

            this.userGroups.forEach(grp => {
                grpQuery.push({ 'events.candidateGroups': grp });
                grpQuery.push({ 'events.lane': grp });
            });
            query['$or'] = grpQuery;
        }

        return query;

    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyDeleteInstances(query) {
        if (this.isAdmin())
            return this.qualifyInstances(query);
        else
            return false;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyModels(query) {
        if (SecureUser.isSecurityBypassed())
            return true;
        if (this.modelsOwner)
            query['owner'] = this.modelsOwner;

        return query;
    }
    /**
     */
    canModifyModel(name) {
        if (this.isAdmin())
            return true;
        else
            return false;
    }
    /**
     */
    canDeleteModel(name) {
        if (this.isAdmin())
            return true;
        else
            return false;
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    async qualifyViewItems(query) { }
    async canInvoke(item) { }
    async canAssign(item) { }
    async canStart(name, startNodeId, user) { }
}

export {SecureUser,USER_ROLE , IUserInfo }