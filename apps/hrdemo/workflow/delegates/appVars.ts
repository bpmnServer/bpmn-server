import { AppServices } from './appServices.js';

/**
 * The HR application's variables (docs/design/app-contract.md §2.1): what an expression reads as appVars.<name>, made
 * for each evaluation from its context (its user, data, instance, and evaluatingSource). Declared in app-contract.json.
 */
export class HrVars {
    constructor(private context: any) { }

    /** The acting user's manager, as a user name (HR's records); null for someone without one. */
    employeeManager(): string | null {
        return new AppServices(null).managerOf(this.context?.user?.userName);
    }

    /**
     * Where this deployment serves HR's own forms, which a model names with
     * `camunda:formKey="${appVars.hrForms}/assignment"` (docs/design/form-keys.md §3). HR_FORMS_URL in `.env` moves
     * them without touching a model.
     */
    hrForms(): string {
        return process.env.HR_FORMS_URL ?? '/forms';
    }

    /** The last day of the fiscal year: 31 March. */
    endFiscalYear(): string {
        const now = new Date();
        const year = now.getMonth() > 2 ? now.getFullYear() + 1 : now.getFullYear();
        return `${year}-03-31`;
    }
}
