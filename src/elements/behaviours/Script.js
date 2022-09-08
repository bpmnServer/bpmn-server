"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptBehaviour = void 0;
const _1 = require(".");
class ScriptBehaviour extends _1.Behaviour {
    init() {
        this.scripts = [];
        var scrs = this.definition['$children'];
        for (var i = 0; i < scrs.length; i++) {
            var scr = scrs[i];
            this.scripts.push(scr.$body);
            this.node.scripts.set(this.definition.event, this.scripts);
        }
    }
    /*
    start(item: Item) {

        if ((!this.event) || (this.event == 'start'))
            this.executeScript(item);
    }
    run(item: Item) {

        if ((this.event) && (this.event == 'run'))
            this.executeScript(item);
    }
    end(item: Item) {

        if ((this.event) && (this.event == 'end'))
            this.executeScript(item);
    }
    resume(item: Item) {
    }
    executeScript(item) {
        item.token.log('invoking script call ' + " for " + item.id);
        item.token.execution.appDelegate.scopeJS(item, this.script);
        item.token.log('returned from script call ' + " for " + item.id);
    } */
    describe() {
        var scrs = this.definition['$children'];
        var desc = [];
        for (var i = 0; i < scrs.length; i++) {
            var scr = scrs[i];
            desc.push([`script on ${this.definition.event}`, ` ${this.scripts}`]);
        }
        return desc;
    }
}
exports.ScriptBehaviour = ScriptBehaviour;
//# sourceMappingURL=Script.js.map