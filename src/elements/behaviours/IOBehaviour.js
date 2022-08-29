"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOBehaviour = void 0;
const _1 = require(".");
/*
 * will prepare input at start
 * will prepare output at end
 *
 */
class IOParameter {
    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }
    isInput() { return (this.type == 'camunda:inputParameter'); }
    isOutput() { return (this.type == 'camunda:outputParameter'); }
}
class IOBehaviour extends _1.Behaviour {
    init() {
        this.parameters = [];
        var ios = this.definition['$children'];
        for (var i = 0; i < ios.length; i++) {
            var io = ios[i];
            this.parameters.push(new IOParameter(io['$type'], io['name'], io['$body']));
        }
    }
    /*
     * process input parameters here
     */
    start(item) {
        var data = {};
        this.parameters.forEach(param => {
            if (param.isInput()) {
                var val = item.token.execution.appDelegate.scopeEval(item, param.value);
                data[param.name] = val;
            }
        });
        if (data !== {})
            item.context.input = data;
    }
    /*
     * process output parameters here
     *
     * value is an expression need to be evaluated
     *
     */
    end(item) {
        var data = {};
        this.parameters.forEach(param => {
            if (param.isOutput()) {
                if (typeof param.value !== 'undefined' && param.value !== '') {
                    var val = item.token.execution.appDelegate.scopeEval(item, param.value);
                    data[param.name] = val;
                }
                else
                    data[param.name] = item.context.output;
            }
        });
        if (data !== {})
            item.token.appendData(data);
    }
    describe() {
        return ['', 'manages IO'];
    }
}
exports.IOBehaviour = IOBehaviour;
//# sourceMappingURL=IOBehaviour.js.map