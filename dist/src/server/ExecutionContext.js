"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionContext = void 0;
const _1 = require("./");
const events_1 = require("events");
class ExecutionContext extends _1.ServerComponent {
    constructor(server, parentContext = null) {
        super(server);
        this.parentContext = parentContext;
        this.listener = new events_1.EventEmitter();
    }
    tillDone() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.worker;
            return this;
        });
    }
    error(error) {
        return this;
    }
    get instance() {
        if (this.execution)
            return this.execution.getState();
    }
    get items() {
        if (this.execution)
            return this.execution.getItems();
    }
}
exports.ExecutionContext = ExecutionContext;
//# sourceMappingURL=ExecutionContext.js.map