"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
class Process {
    constructor(definition, children) {
        this.id = definition.id;
        this.isExecutable = definition.isExecutable;
        this.name = definition.name;
        this.def = definition;
        this.childrenNodes = children;
    }
    getStartNode() {
        let start = null;
        this.childrenNodes.forEach(node => {
            if (node.type == 'bpmn:StartEvent')
                start = node;
        });
        return start;
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map