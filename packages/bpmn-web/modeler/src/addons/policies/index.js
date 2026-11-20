// The Policies add-on's part of the editor (docs/design/add-ons.md): who works on a user task (its assignee,
// candidates and assignment policy), who may start the process at a start event, and the process's policies
// (security, notification). The modeler loads it only when the add-on is on; without it the panel has none of these,
// and the model keeps what it has.
import { UserAssignmentGroup, StartAssignmentGroup, ProcessPoliciesGroup } from './AssignmentGroups.jsx';

// after bpmn-server's own provider (400): its groups are in place, these go among them
const PRIORITY = 300;

class PoliciesPropertiesProvider {
    constructor(propertiesPanel, translate) {
        this._translate = translate;
        propertiesPanel.registerProvider(PRIORITY, this);
    }

    getGroups(element) {
        return groups => {
            const translate = this._translate;
            const userAssignment = UserAssignmentGroup(element, translate);
            if (userAssignment)
                groups.splice(Math.min(groups.length, 2), 0, userAssignment);
            const startAssignment = StartAssignmentGroup(element, translate);
            if (startAssignment)
                groups.splice(Math.min(groups.length, 2), 0, startAssignment);
            const policies = ProcessPoliciesGroup(element, translate);
            if (policies)
                groups.splice(Math.min(groups.length, 2), 0, policies);
            return groups;
        };
    }
}
PoliciesPropertiesProvider.$inject = ['propertiesPanel', 'translate'];

export default {
    __init__: ['policiesPropertiesProvider'],
    policiesPropertiesProvider: ['type', PoliciesPropertiesProvider]
};
