"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Behaviour = void 0;
const duration = require('iso8601-duration');
const parse = duration.parse;
const end = duration.end;
const toSeconds = duration.toSeconds;
class Behaviour {
    constructor(node, definition) {
        this.node = node;
        this.definition = definition;
        this.init();
    }
    restored(item) { }
    describe() { return []; }
    init() { }
    enter(item) { }
    start(item) { }
    run(item) { }
    end(item) { }
    exit(item) { }
    resume(item) { }
    getNodeAttributes(attributes) { }
    getItemAttributes(item, attributes) { }
}
exports.Behaviour = Behaviour;
//# sourceMappingURL=Behaviour.js.map