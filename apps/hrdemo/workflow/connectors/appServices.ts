import { employees, departments } from '../../server/data.js';

// var seq = 0;
class AppServices {
    appDelegate;
    constructor(delegate) {
        this.appDelegate = delegate;
    }
    /**
     * An employee's own manager, as a user name: the employee's managerId in HR's records, else their department's
     * manager (server/data.js); null for someone who isn't an employee, or who has no manager (a department's head).
     * The demo's user names are the employees' mail names (david.kim@company.com: david.kim).
     * LeaveApproval's rule: $(appServices.managerOf(actors.initiator)).
     */
    managerOf(userName) {
        const nameOf = employee => employee?.email ? String(employee.email).split('@')[0] : null;
        const employee = employees.find(e => nameOf(e) === userName);
        if (!employee) return null;
        const managerId = employee.managerId
            ?? (departments.find(d => d.departmentId === employee.departmentId)?.managerId ?? null);
        if (!managerId || managerId === employee.employeeId) return null;
        return nameOf(employees.find(e => e.employeeId === managerId));
    }
    /**
     * Leave Application's Department field, a drop-down (docs/design/form-lookups.md):
     * <owf:list source="service:departments" key="departmentId" display="name" />. HR's departments (server/data.js).
     */
    async departments(criteria, context) {
        return departments.map(({ departmentId, name }) => ({ departmentId, name }));
    }
    /**
     * Leave Application's Covered by field, a search: <owf:lookup source="service:employees" key="userName"
     * display="name" filter="${data.Department}" />. Called with { text, filter }: the active employees whose name has
     * the text, in the department chosen; each with its user name (the demo's sign-in name) and full name.
     */
    async employees({ text = '', filter }: { text?: string, filter?: string } = {}, context?) {
        const search = String(text).trim().toLowerCase();
        return employees
            .filter(e => e.status === 'Active' && (!filter || e.departmentId === filter))
            .map(e => ({ userName: String(e.email).split('@')[0], name: `${e.firstName} ${e.lastName}`, jobTitle: e.jobTitle }))
            .filter(e => !search || e.name.toLowerCase().includes(search));
    }
    /** Hello.bpmn's Greet task: input { name }, the result stored as data.greeting. */
    async greet({ name }, context) {
        return `Hello ${name || 'there'}, from ${context.instance?.name ?? context.item?.token?.execution?.name}`;
    }
    /**
     * Leave Application's Record the leave: HR's system keeps the approved leave and answers its id. Here it is the
     * log; put your HR system's call here. A request it refuses is the BPMN error RecordFailed, which the model catches.
     */
    async recordLeave({ requester, LeaveType, StartDate, EndDate, days }, context) {
        if (!requester || !(days > 0))
            return { bpmnError: 'RecordFailed' };
        const recordId = `LV-${Date.now()}`;
        console.log(`leave recorded: ${recordId} ${requester} ${LeaveType} ${StartDate} to ${EndDate} (${days} days)`);
        return { recordId };
    }
    /**
     * A message to users and groups: input { users, groups } (a user name or group name, or a list of them), subject,
     * message; answers { sent: whom it was for, at }. The model says when and why. Here it is the log; put your email or
     * chat here.
     */
    async notifyUsers({ users, groups, subject, message }, context) {
        const to = [...[].concat(users ?? []), ...[].concat(groups ?? []).map(g => `group ${g}`)];
        console.log(`notify ${to.join(', ')}: ${subject}${message ? ` (${message})` : ''}`);
        return { sent: to, at: new Date().toISOString() };
    }
}
export {AppServices}
