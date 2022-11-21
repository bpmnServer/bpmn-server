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
exports.BoundaryEvent = exports.ThrowEvent = exports.CatchEvent = exports.EndEvent = exports.StartEvent = exports.Event = void 0;
const _1 = require(".");
const behaviours_1 = require("./behaviours");
const __1 = require("../../");
const interfaces_1 = require("../interfaces");
class Event extends _1.Node {
    hasMessage() {
        return this.getBehaviour(behaviours_1.Behaviour_names.MessageEventDefinition);
    }
    hasSignal() {
        return this.getBehaviour(behaviours_1.Behaviour_names.SignalEventDefinition);
    }
    hasTimer() {
        return this.getBehaviour(behaviours_1.Behaviour_names.TimerEventDefinition);
    }
    /**
     *
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     *
     * @param item
     */
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.start.call(this, item);
        });
    }
    end(item) {
        return super.end(item);
    }
    get canBeInvoked() { return true; }
}
exports.Event = Event;
class CatchEvent extends Event {
    get isCatching() { return true; }
    get requiresWait() {
        return true; // return this.hasMessage(); 
    }
    get canBeInvoked() {
        return true; // return this.hasMessage();
    }
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.start.call(this, item);
        });
    }
}
exports.CatchEvent = CatchEvent;
class BoundaryEvent extends Event {
    constructor(id, process, type, def) {
        super(id, process, type, def);
        this.isCancelling = true;
        if ((typeof this.def['cancelActivity'] !== 'undefined') && (this.def['cancelActivity'] === false))
            this.isCancelling = false;
    }
    get isCatching() { return true; }
    get requiresWait() {
        return true;
    }
    get canBeInvoked() {
        return true;
    }
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.start.call(this, item);
        });
    }
    run(item) {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (item.token.parentToken.currentItem.status == interfaces_1.ITEM_STATUS.end) // in cancelling mode
                return;
            if (this.isCancelling) {
                item.token.parentToken.currentItem.status = interfaces_1.ITEM_STATUS.end; //force status so it would not run
                yield item.token.parentToken.terminate();
            }
            return _super.run.call(this, item);
        });
    }
}
exports.BoundaryEvent = BoundaryEvent;
class ThrowEvent extends Event {
    /**
     *
     * 	using token: check if fromEventBasedGateway;	if yes cancel all other events
     */
    get isCatching() { return false; }
    start(item) {
        const _super = Object.create(null, {
            start: { get: () => super.start }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.start.call(this, item);
        });
    }
    run(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return __1.NODE_ACTION.end;
        });
    }
}
exports.ThrowEvent = ThrowEvent;
class EndEvent extends Event {
    get isCatching() { return false; }
    end(item) {
        return super.end(item);
    }
}
exports.EndEvent = EndEvent;
class StartEvent extends Event {
    get isCatching() { return true; }
}
exports.StartEvent = StartEvent;
//# sourceMappingURL=Events.js.map