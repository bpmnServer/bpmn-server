'use strict';

const { Engine } = require('bpmn-engine');
import { IEngine, BpmnCreateOptions, BpmnExecutionOptions } from './API';
import { EventEmitter } from 'events';
import { DefaultLogger } from './DefaultLogger';


let customLogger;

console.log("DefaultEngine");

function engineLogger(name) {
    return new EngineCustomLogger(name);
}
class EngineCustomLogger {
    name;
    constructor(name) {
        this.name = name;
    }
    debug(...args) { customLogger.debug('bpmn:' + args); }
    warn(...args) { customLogger.warn('bpmn:' + args); }
    error(...args) { customLogger.error('bpmn:' + args); }
}


class CustomEngine  implements IEngine {

    protected engine;
    protected logger;

    constructor(logger) {
        this.logger = logger;
    }

    getImplemntingEngine() {
        return this.engine;
    }

    create(options: BpmnCreateOptions) {

        if (options.moddleOptions == null) {
            options.moddleOptions =  this.getModdleOptions();
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
    async execute(options: BpmnExecutionOptions) {
        let self = this;

        if (this.logger)
            customLogger = this.logger;
        else
            customLogger = new DefaultLogger({});

        options.Logger = engineLogger;


        let listener = options.listener;
        if (!listener)
            listener = this.getListener(options.callback);



        return await this.engine.execute(options
            , (err, execution) => {
                self.logger.log("engine is done.");
                if (err) throw err;
            });
    }
    recover(state) {
        this.engine = Engine({ name: 'Recovered engine' });

        this.engine.recover(state);

        return this.engine;
    }

    async resume({ listener }, callback) {
        let self = this;

        if (this.logger)
            customLogger = this.logger;
        else
            customLogger = new DefaultLogger({});

        if (!listener)
            listener = this.getListener(callback);

        await this.engine.resume({
            Logger :engineLogger,
            listener: listener
        }, (err, execution) => {
            self.logger.log("engine is done.");
            if (callback)
                callback(err, execution);
            if (err) throw err;
        });
    }
    async stop() {
        await this.engine.stop();
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

        const listener = new EventEmitter();

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
    async getState() {

        return this.engine.getState();
    }
    get state(): string{
        return this.engine.state;
    }
    async getFields(taskId) {
        let list = [];

        let definitions = await this.engine.getDefinitions();

        let defContext = definitions[0].context.definitionContext;
        let act = defContext.getActivityById(taskId);

        if (act && act.behaviour.extensionElements) {

            let exts = act.behaviour.extensionElements.values;

            let i,j;
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


    }

    async getElements() {
        let elements = [];

        let definition1 = await this.engine.getDefinitions();

        let defContext = definition1[0].context.definitionContext;

        let activities = await defContext.getActivities();  //definition1[0].context.definitionContext.getActivities();

        activities.forEach(act => {

            elements.push({ id: act.id, type: act.type });
                //            console.log(act);
            });
        let flows = await definition1[0].context.definitionContext.getSequenceFlows();

        flows.forEach(act => {
                // console.log(`----flow ${act.id} ${act.type} `);
                elements.push({ id: act.id, type: act.type });
                //            console.log(act);
        });

        return elements;
    }

}


export { CustomEngine };

