"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptBehaviour = void 0;
const _1 = require(".");
class ScriptBehaviour extends _1.Behaviour {
    init() {
        const event = this.definition.event;
        const script = this.definition.$body;
        this.node.scripts.set(event, script);
    }
    start(item) {
        if ((!this.event) || (this.event == 'start'))
            this.executeScript(item);
    }
    run(item) {
        if ((this.event) && (this.event == 'run'))
            this.executeScript(item);
    }
    end(item) {
        if ((this.event) && (this.event == 'end'))
            this.executeScript(item);
    }
    resume(item) {
    }
    executeScript(item) {
        item.token.log('invoking script call ' + " for " + item.id);
        item.token.execution.appDelegate.scopeJS(item, this.script);
        item.token.log('returned from script call ' + " for " + item.id);
    }
    describe() {
        return ['script on ' + this.event, this.script];
    }
}
exports.ScriptBehaviour = ScriptBehaviour;
//# sourceMappingURL=Script.js.map