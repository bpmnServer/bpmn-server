import { QueryTranslator } from "../datastore/QueryTranslator";
import { ISecureUser, IUserInfo } from "../interfaces";

enum USER_ROLE {
    SYSTEM = 'SYSTEM',  // SYSTEM ADMIN
    ADMIN = 'ADMIN',    // TENANT ADMIN
    DESIGNER = 'DESIGNER'
}
/** 
 *  
 *  Security Rules:
 *  Security Rules are by-passed if
 *      a.  User is and Admin or System
 *      b.  .env REQUIRE_AUTHENTICATION === 'false' || process.env.ENFORCE_SECURITY
 *  
 *  User can View/Assign Item if:
 *  1.  Item has no restrictions if (Assignee==null and CandidateUsers == null and CandidateGroups==null)
 *  2.  If user is has a group indicated in item.CandidateGroups 
 * 
 *  User can Execute Item -- If user is the Assignee
 *  
 *  Scenarios:
 *  1.  User is Assignee
 *      Can Invoke/Complete Task
 *      Can Assign to another User
 *  2.  User is not Assignee but Can View (see rules above)
 *      Can Assign Task to either another user or self (Take Task)
 *      Then User can Invoke Task
 *  We may need to utilize Optimistic Lock pattern here, keep track of version # of the Instance and on update
 *  Warn the User that instance information has changed since last seen
 *  
 * */
var byPass = false;

class SecureUser implements ISecureUser {
    userName;
    userGroups;
    tenantId?;
    modelsOwner?;
    constructor(params: IUserInfo) {
        Object.assign(this, params);

        if (process.env.REQUIRE_AUTHENTICATION === 'false' || process.env.ENFORCE_SECURITY === 'false') {
            console.log('****Security is disabled as requested in .env****');
            byPass = true;
        }
//        else
//            console.log('Security is enabled as requested in .env');

//        console.log('new SecureUser', this);

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
/* old
            grpQuery.push({ 'items.assignee': null, 'items.candidateUsers': null, 'items.candidateGroups': null });

            grpQuery.push({ 'items.assignee': this.userName });
            grpQuery.push({ 'items.candidateUsers': this.userName, 'items.assignee': null });

            this.userGroups.forEach(grp => {
                grpQuery.push({ 'items.candidateGroups': grp, 'items.assignee': null });
                });

            query['$or'] = grpQuery;
*/
            grpQuery.push({ 'items.assignee': null, 'items.candidateUsers': null, 'items.candidateGroups': null });

            grpQuery.push({ 'items.assignee': this.userName });
            grpQuery.push({ 'items.candidateUsers': this.userName});

            this.userGroups.forEach(grp => {
                grpQuery.push({ 'items.candidateGroups': grp});
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
    async qualifyViewItems(query) {

    }
    canInvoke(item) : boolean {

        if (this.isAdmin())
            return true;
        else if (item.assignee == this.userName)
            return true;
        else
            return false;
    }
    canAssign(item) : boolean {

        if (this.isAdmin())
            return true;
        else if (item.assignee == this.userName)
            return true;
        else
            {
            let query={};
            const grpQuery = [];

            grpQuery.push({ 'items.assignee': null, 'items.candidateUsers': null, 'items.candidateGroups': null });

            grpQuery.push({ 'items.candidateUsers': this.userName});

            this.userGroups.forEach(grp => {
                grpQuery.push({ 'items.candidateGroups': grp});
            });

            query['$or'] = grpQuery;


            let trans=new QueryTranslator('items');
            let dbQry=trans.translateCriteria(query);
            return trans.filterItem(item,dbQry);
            }
    }
    async canStart(name, startNodeId, user) { }
}
const SystemUser = new SecureUser({ userName: 'system', userGroups: [USER_ROLE.SYSTEM], tenantId: null, modelsOwner: null });

export {SecureUser,USER_ROLE , IUserInfo, SystemUser }