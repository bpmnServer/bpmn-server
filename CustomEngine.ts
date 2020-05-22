'use strict';

const { Engine } = require('bpmn-engine');
import { CustomEngine as DefaultEngine } from './src/DefaultEngine';
import { DefaultLogger } from './src/DefaultLogger';
const JsExtension = require('./test/resources/JsExtension');

let customLogger;

console.log("CustomEngine");

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



class CustomEngine extends DefaultEngine {

    async execute({ listener, callback }) {
        let self = this;
        if (this.logger)
            customLogger = this.logger;
        else
            customLogger = new DefaultLogger({});

        await this.engine.execute({
            Logger: engineLogger ,
            listener: listener,
            services: this.getServices(), 
            extensions: this.getExtensions()

        }, (err, execution) => {
            self.logger.log("custom engine is done.");
            if (callback)
                callback(err, execution);
            if (err) throw err;
        });
    }

    async resume({ listener }, callback) {
        let self = this;

        if (this.logger)
            customLogger = this.logger;
        else
            customLogger = new DefaultLogger({});

        await this.engine.resume({
            Logger: engineLogger,
            listener: listener ,
            services: this.getServices(),
            extensions: this.getExtensions()
        }, (err, execution) => {
            self.logger.log("engine is done.");
            if (callback)
                callback(err, execution);
            if (err) throw err;
        });
    }
    /**
     * return services to be performed in workflow
     * 
     * example to use: calling service2
     * 
     *     <serviceTask id="task1" camunda:expression="\${environment.services.service2}" camunda:resultVariable="result" />
     *     
     * or inside a script:
     * 
     *   <scriptTask id="scriptTask" scriptFormat="Javascript">
    <script>
      <![CDATA[
        const self = this;
        const fun1= self.environment.services.function1;
        let result=fun1('testing');
 
      ]]>
    </script>
     * 
     * */
    getServices() {

        return {
            service1(scope, callback) {
                callback(null, { data: 1 });
            },
            service2(scope, callback) {
                callback(null, { data: 1 });
            },
            function1(scope, callback) {
                callback(null, { data: 1 });
            }

        }
    }
    getExtensions() {

        return {
            js: JsExtension.extension,
            camunda: function (activity) {
                    if (activity.behaviour.expression) {
                        activity.behaviour.Service = ServiceExpression;
                    }
                    if (activity.behaviour.resultVariable) {
                        activity.on('end', (api) => {
                            activity.environment.output[activity.behaviour.resultVariable] = api.content.output;
                        });
                    }
                }
             }

    }
    getModdleOptions() {
        return {
//            js: JsExtension.moddleOptions , 
            camunda: require('camunda-bpmn-moddle/resources/camunda.json')
        };
    }


}
function ServiceExpression(activity) {
    const { type: atype, behaviour, environment } = activity;
    const expression = behaviour.expression;
    const type = `${atype}:expression`;
    return {
        type,
        expression,
        execute,
    };

    function execute(executionMessage, callback) {
        console.log(' camunda: expression="\${environment.services.serviceFn}" camunda: resultVariable="result" ');
        console.log('executionMessage');
        console.log(executionMessage);
        console.log('expression');
        console.log(expression);
        const serviceFn = environment.resolveExpression(expression, executionMessage);
        console.log('serviceFn');
        console.log(serviceFn);
        serviceFn.call(activity, executionMessage, (err, result) => {
            callback(err, result);
        });
    }
}
/*
const engine = Engine({
    name: 'extend service task',
    source,
    moddleOptions: {
        camunda: require('camunda-bpmn-moddle/resources/camunda.json'),
    },
    services: {
        serviceFn(scope, callback) {
            callback(null, { data: 1 });
        }
    },
    extensions: {
        camundaServiceTask(activity) {
            if (activity.behaviour.expression) {
                activity.behaviour.Service = ServiceExpression;
            }
            if (activity.behaviour.resultVariable) {
                activity.on('end', (api) => {
                    activity.environment.output[activity.behaviour.resultVariable] = api.content.output;
                });
            }
        },
    }
});

*/
export { CustomEngine };

