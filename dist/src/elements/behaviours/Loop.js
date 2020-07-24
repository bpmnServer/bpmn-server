"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopBehaviour = void 0;
const _1 = require(".");
class LoopBehaviour extends _1.Behaviour {
    init() {
    }
    get collection() {
        if (this.node.def.loopCharacteristics.collection)
            return this.node.def.loopCharacteristics.collection;
        else {
            return this.node.def.loopCharacteristics.$attrs["camunda:collection"];
        }
    }
    isSequential() {
        return this.node.def.isSequential;
    }
    describe() {
        if (this.isSequential)
            return ['loop', `is a sequential loop based on '${this.collection}'`];
        else
            return ['loop', `is a parallel loop based on '${this.collection}'`];
    }
}
exports.LoopBehaviour = LoopBehaviour;
//# sourceMappingURL=Loop.js.map