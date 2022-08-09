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
exports.Process = void 0;
const Token_1 = require("../engine/Token");
const interfaces_1 = require("../interfaces");
class Process {
    constructor(definition, parent = null) {
        this.id = definition.id;
        this.isExecutable = definition.isExecutable;
        this.name = definition.name;
        this.def = definition;
        this.parent = parent;
    }
    init(children, eventSubProcesses) {
        this.childrenNodes = children;
        this.eventSubProcesses = eventSubProcesses;
    }
    /**
     * Notify process that it started
     * */
    start(execution, parentToken) {
        return __awaiter(this, void 0, void 0, function* () {
            this.subProcessEvents = [];
            const events = [];
            this.eventSubProcesses.forEach(p => {
                p.getStartNodes().forEach(st => {
                    events.push(st);
                });
            });
            let i;
            for (i = 0; i < events.length; i++) {
                const st = events[i];
                execution.log('..starting event start subporcess ' + st.id);
                const newToken = yield Token_1.Token.startNewToken(Token_1.TOKEN_TYPE.EventSubProcess, execution, st, null, parentToken, null, null);
                this.subProcessEvents.push(newToken.currentItem);
            }
        });
    }
    /**
     * Notify process that it ended
     * */
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            /* removed; already done by token
            let i;
            for (i = 0; i < this.subProcessEvents.length;i++) {
                const event = this.subProcessEvents[i];
                await event.token.terminate();
            }
            */
        });
    }
    getStartNode(userInvokable = false) {
        return this.getStartNodes(userInvokable)[0];
    }
    getStartNodes(userInvokable = false) {
        let starts = [];
        this.childrenNodes.forEach(node => {
            if (node.type == 'bpmn:StartEvent') {
                if (!(userInvokable && ((node.subType == interfaces_1.NODE_SUBTYPE.timer) ||
                    (node.subType == interfaces_1.NODE_SUBTYPE.error) ||
                    (node.subType == interfaces_1.NODE_SUBTYPE.message) ||
                    (node.subType == interfaces_1.NODE_SUBTYPE.signal)))) {
                    starts.push(node);
                }
            }
        });
        return starts;
    }
    getEventSubProcessStart() {
        let starts = [];
        this.eventSubProcesses.forEach(sp => {
            const startNodes = sp.getStartNodes();
            startNodes.forEach(n => {
                starts.push(n);
            });
        });
        return starts;
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map