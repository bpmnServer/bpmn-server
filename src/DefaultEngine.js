'use strict';
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
exports.CustomEngine = void 0;
const { Engine } = require('bpmn-engine');
const events_1 = require("events");
const DefaultLogger_1 = require("./DefaultLogger");
let customLogger;
console.log("DefaultEngine");
function engineLogger(name) {
    return new EngineCustomLogger(name);
}
class EngineCustomLogger {
    constructor(name) {
        this.name = name;
    }
    debug(...args) { customLogger.debug('bpmn:' + args); }
    warn(...args) { customLogger.warn('bpmn:' + args); }
    error(...args) { customLogger.error('bpmn:' + args); }
}
class CustomEngine {
    constructor(logger) {
        this.logger = logger;
    }
    getImplemntingEngine() {
        return this.engine;
    }
    create(options) {
        if (options.moddleOptions == null) {
            options.moddleOptions = this.getModdleOptions();
        }
        if (options.services == null) {
            options.services = this.getServices();
        }
        if (options.extensions == null) {
            options.extensions = this.getExtensions();
        }
        this.engine = Engine(options);
        return this.engine;
    }
    execute(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            if (this.logger)
                customLogger = this.logger;
            else
                customLogger = new DefaultLogger_1.DefaultLogger({});
            options.Logger = engineLogger;
            let listener = options.listener;
            if (!listener)
                listener = this.getListener(options.callback);
            return yield this.engine.execute(options, (err, execution) => {
                self.logger.log("engine is done.");
                if (err)
                    throw err;
            });
        });
    }
    recover(state) {
        this.engine = Engine({ name: 'Recovered engine' });
        this.engine.recover(state);
        return this.engine;
    }
    resume({ listener }, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            if (this.logger)
                customLogger = this.logger;
            else
                customLogger = new DefaultLogger_1.DefaultLogger({});
            if (!listener)
                listener = this.getListener(callback);
            yield this.engine.resume({
                Logger: engineLogger,
                listener: listener
            }, (err, execution) => {
                self.logger.log("engine is done.");
                if (callback)
                    callback(err, execution);
                if (err)
                    throw err;
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.engine.stop();
        });
    }
    invoke(task, data) {
        task.signal({
            ioSpecification: {
                dataOutputs: data
            }
        });
    }
    eventFired(event, task, callback) {
        if (callback)
            callback(event, task);
    }
    getListener(engine, callback = null) {
        const listener = new events_1.EventEmitter();
        listener.on('activity.enter', (task) => {
            this.eventFired('enter', task, callback);
        });
        listener.on('activity.start', (task) => {
            this.eventFired('start', task, callback);
        });
        listener.on('activity.end', (task) => {
            this.eventFired('end', task, callback);
        });
        listener.on('activity.timer', (task) => {
            this.eventFired('timer', task, callback);
        });
        listener.on('wait', (task) => {
            this.eventFired('wait', task, callback);
        });
        listener.on('flow.take', (flow) => {
            this.eventFired('take', flow, callback);
        });
        listener.on('flow.discard', (flow) => {
            this.eventFired('take', flow, callback);
        });
        engine.on('end', (execution) => {
            this.eventFired('End', execution, callback);
        });
        return listener;
    }
    getExtensions() {
        return {};
    }
    getServices() {
        return {};
    }
    getModdleOptions() {
        return {};
    }
    getState() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.engine.getState();
        });
    }
    getFields(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = [];
            let definitions = yield this.engine.getDefinitions();
            let defContext = definitions[0].context.definitionContext;
            let act = defContext.getActivityById(taskId);
            if (act && act.behaviour.extensionElements) {
                let exts = act.behaviour.extensionElements.values;
                let i, j;
                for (i = 0; i < exts.length; i++) {
                    let ext = exts[i];
                    if (ext.$type.toLowerCase() == 'camunda:FormData'.toLowerCase()) {
                        let fields = ext.$children; // sometimes I get fields other i get $children
                        if (fields) { }
                        else
                            fields = ext.fields;
                        for (j = 0; j < fields.length; j++) {
                            let field = fields[j];
                            list.push({ id: field.id, type: field.type, label: field.label });
                        }
                    }
                }
                return list;
            }
            else
                return null;
        });
    }
    getElements() {
        return __awaiter(this, void 0, void 0, function* () {
            let elements = [];
            let definition1 = yield this.engine.getDefinitions();
            let defContext = definition1[0].context.definitionContext;
            let activities = yield defContext.getActivities(); //definition1[0].context.definitionContext.getActivities();
            activities.forEach(act => {
                elements.push({ id: act.id, type: act.type });
                //            console.log(act);
            });
            let flows = yield definition1[0].context.definitionContext.getSequenceFlows();
            flows.forEach(act => {
                // console.log(`----flow ${act.id} ${act.type} `);
                elements.push({ id: act.id, type: act.type });
                //            console.log(act);
            });
            return elements;
        });
    }
}
exports.CustomEngine = CustomEngine;
//# sourceMappingURL=DefaultEngine.js.map