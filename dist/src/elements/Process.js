"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
const interfaces_1 = require("../interfaces");
class Process {
    constructor(definition, children) {
        this.id = definition.id;
        this.isExecutable = definition.isExecutable;
        this.name = definition.name;
        this.def = definition;
        this.childrenNodes = children;
    }
    getStartNodes(userInvokable = false) {
        let starts = [];
        this.childrenNodes.forEach(node => {
            if (node.type == 'bpmn:StartEvent') {
                if (!(userInvokable && ((node.subType == interfaces_1.NODE_SUBTYPE.timer) ||
                    (node.subType == interfaces_1.NODE_SUBTYPE.message) ||
                    (node.subType == interfaces_1.NODE_SUBTYPE.signal)))) {
                    starts.push(node);
                }
            }
        });
        return starts;
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map