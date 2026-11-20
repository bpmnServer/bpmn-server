// The Labels add-on's part of the editor (docs/docs/labels.md): the Label group, what a case or an element is called,
// with its preview. Loaded only when the add-on is on; without it the panel has no Label group, and the model keeps
// its labels.
import { LabelGroup } from './LabelGroup.jsx';

// after bpmn-server's own provider (400)
const PRIORITY = 300;

class LabelsPropertiesProvider {
    constructor(propertiesPanel, translate) {
        this._translate = translate;
        propertiesPanel.registerProvider(PRIORITY, this);
    }

    getGroups(element) {
        return groups => {
            // what a case or an element is called, after the General group
            const label = LabelGroup(element, this._translate);
            if (label)
                groups.splice(Math.min(groups.length, 1), 0, label);
            return groups;
        };
    }
}
LabelsPropertiesProvider.$inject = ['propertiesPanel', 'translate'];

export default {
    __init__: ['labelsPropertiesProvider'],
    labelsPropertiesProvider: ['type', LabelsPropertiesProvider]
};
