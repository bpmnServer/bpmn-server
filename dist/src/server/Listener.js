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
exports.Listener = void 0;
const events_1 = require("events");
class Listener extends events_1.EventEmitter {
    doEvent(event, execution, item = null) {
        return __awaiter(this, void 0, void 0, function* () {
            execution.item = item;
            yield this.delegateEvent(event, execution);
            yield this.emit(event, { event, context: execution });
            yield this.emit('all', { event, context: execution });
        });
    }
    delegateEvent(event, execution) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = execution.appDelegate;
            const defDelegate = null; //execution.defDelegate;
            if (app[event]) {
                // method exists in the component
                yield app[event](event, execution); // call it
            }
            if (defDelegate && defDelegate[event]) {
                // method exists in the component
                yield defDelegate[event](event, execution); // call it
            }
        });
    }
}
exports.Listener = Listener;
//# sourceMappingURL=Listener.js.map