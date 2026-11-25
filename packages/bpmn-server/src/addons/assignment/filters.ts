/**
 * What a user sees, as the assignment says (a query filter, engine/AddOns.ts): the tasks and cases with a task offered to
 * them (their own, to them as a candidate, to one of their groups, or to no one), and the processes they may start
 * (`candidateStarterUsers`, `candidateStarterGroups`, a start event's lane). Not applied to an administrator.
 */
import type { IQueryFilter } from '../../engine/AddOns.js';

export const assignmentFilter: IQueryFilter = {
    name: 'policies',
    filter(kind, user, query) {
        const offered = [];
        if (kind === 'startEvents') {
            offered.push({ 'events.candidateUsers': null, 'events.candidateGroups': null, 'events.lane': null });
            offered.push({ 'events.candidateUsers': user.userName });
            for (const group of user.userGroups) {
                offered.push({ 'events.candidateGroups': group });
                offered.push({ 'events.lane': group });
            }
        }
        else {
            offered.push({ 'items.assignee': null, 'items.candidateUsers': null, 'items.candidateGroups': null });
            offered.push({ 'items.assignee': user.userName });
            offered.push({ 'items.candidateUsers': user.userName });
            for (const group of user.userGroups) offered.push({ 'items.candidateGroups': group });
        }
        query['$or'] = offered;
        return query;
    },
};
