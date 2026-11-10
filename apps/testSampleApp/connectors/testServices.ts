/*
 * The services of the test environment (APP_ENV=test): the same names as AppServices, and what the models get back,
 * without what happens outside: nothing sent, nothing recorded. A test environment has its own configuration, its own
 * database and these services; production never loads them. A service with nothing outside to protect is AppServices'
 * own, inherited.
 */
import { AppServices } from './appServices.js';

class TestServices extends AppServices {
    /** As AppServices.recordLeave: a request it refuses is RecordFailed; nothing is recorded. */
    async recordLeave({ requester, days }, context) {
        if (!requester || !(days > 0))
            return { bpmnError: 'RecordFailed' };
        return { recordId: 'LV-TEST' };
    }
    /** As AppServices.notifyUsers: whom it was for; nothing is sent. */
    async notifyUsers({ users, groups, subject, message }, context) {
        return { sent: [...[].concat(users ?? []), ...[].concat(groups ?? []).map(g => `group ${g}`)], at: 'test' };
    }
}
export { TestServices };
