"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
class Element {
    constructor() {
        this.behaviours = new Map();
        this.isFlow = false;
    }
    /* is called after the execution is restarted */
    continue(item) { }
    describe() { return []; }
    restored(item) {
        this.behaviours.forEach(behav => { behav.restored(item); });
    }
    resume(item) {
        this.behaviours.forEach(behav => { behav.resume(item); });
    }
    /**
     * respond by providing behaviour attributes beyond item and node information
     *  ex: timer due , input/outupt , fields
     * */
    hasBehaviour(name) {
        return this.behaviours.has(name);
    }
    getBehaviour(name) {
        return this.behaviours.get(name);
    }
    addBehaviour(nane, behavriour) {
        this.behaviours.set(nane, behavriour);
    }
}
exports.Element = Element;
//# sourceMappingURL=Element.js.map