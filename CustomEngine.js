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
const DefaultEngine_1 = require("./src/DefaultEngine");
const DefaultLogger_1 = require("./src/DefaultLogger");
const JsExtension = require('./test/resources/JsExtension');
let customLogger;
console.log("CustomEngine");
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
class CustomEngine extends DefaultEngine_1.CustomEngine {
    execute({ listener, callback }) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            if (this.logger)
                customLogger = this.logger;
            else
                customLogger = new DefaultLogger_1.DefaultLogger({});
            yield this.engine.execute({
                Logger: engineLogger,
                listener: listener,
                services: this.getServices(),
                extensions: this.getExtensions()
            }, (err, execution) => {
                self.logger.log("custom engine is done.");
                if (callback)
                    callback(err, execution);
                if (err)
                    throw err;
            });
        });
    }
    resume({ listener }, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            if (this.logger)
                customLogger = this.logger;
            else
                customLogger = new DefaultLogger_1.DefaultLogger({});
            yield this.engine.resume({
                Logger: engineLogger,
                listener: listener,
                services: this.getServices(),
                extensions: this.getExtensions()
            }, (err, execution) => {
                self.logger.log("engine is done.");
                if (callback)
                    callback(err, execution);
                if (err)
                    throw err;
            });
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
        };
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
        };
    }
    getModdleOptions() {
        return {
            //            js: JsExtension.moddleOptions , 
            camunda: require('camunda-bpmn-moddle/resources/camunda.json')
        };
    }
}
exports.CustomEngine = CustomEngine;
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
//# sourceMappingURL=CustomEngine.js.map