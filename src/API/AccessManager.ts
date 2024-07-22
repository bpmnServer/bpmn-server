import { ISecureUser, IUserInfo } from "../interfaces";

import { APP_CONFIGURATION } from "../server";

enum USER_ROLE {
    SYSTEM = 'SYSTEM',  // SYSTEM ADMIN
    ADMIN = 'ADMIN',    // TENANT ADMIN
    DESIGNER = 'DESIGNER'
}

var byPass = false;
class SecureUser implements ISecureUser {
    userName;
    userGroups;
    tenantId?;
    modelsOwner?;
    constructor(params: IUserInfo) {
        Object.assign(this, params);

        if (APP_CONFIGURATION.env.REQUIRE_AUTHENTICATION === 'false' || APP_CONFIGURATION.env.ENFORCE_SECURITY === 'false') {
            console.log('****Security is disabled as requested in .env****');
            byPass = true;
        }
        else
            console.log('Security is enabled as requested in .env');

    }
    static SystemUser() {
        return new SecureUser({ userName: 'system', userGroups: [USER_ROLE.SYSTEM], tenantId: null, modelsOwner: null });
    }
    isAdmin(): boolean {
        if (byPass)
            return true;
        return (this.userGroups.includes(USER_ROLE.ADMIN) || this.userGroups.includes(USER_ROLE.SYSTEM));
    }
    isSystem(): boolean {
        if (byPass)
            return true;
        return (this.userGroups.includes(USER_ROLE.SYSTEM));
    }
    inGroup(userGroup) :boolean {
        if (byPass)
            return true;
        return (this.userGroups.includes(userGroup))
    }
    /**
     * alters the query adding conditions based on security rules
     * @param query
     * @returns query
     */
    qualifyInstances(query) {
        if (byPass)
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
        if (byPass)
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
        if (byPass)
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