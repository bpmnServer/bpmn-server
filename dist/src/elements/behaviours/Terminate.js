"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminateBehaviour = void 0;
const _1 = require(".");
/*
 * will terminate all active nodes as a result of terminate end event
 *
 */
class TerminateBehaviour extends _1.Behaviour {
    start(item) { }
    end(item) {
        item.token.execution.getItems().forEach(item => {
            item.token.log("..Terminating item:" + item.element.id);
        });
    }
    describe() {
        return ['', 'Terminates all active nodes'];
    }
}
exports.TerminateBehaviour = TerminateBehaviour;
//# sourceMappingURL=Terminate.js.map