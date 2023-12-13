import { TimerBehaviour } from ".";
import { Node } from "..";
import { Behaviour } from '.';
import type { Item } from "../../engine/Item";
import { ScriptHandler } from "../../engine/ScriptHandler";

/*
 * will prepare input at start
 * will prepare output at end
 *
 */

class IOParameter {
    type;
    name;
    subType;
    value;
    isInput() { return (this.type == 'camunda:inputParameter'); }
    isOutput() { return (this.type == 'camunda:outputParameter'); }
    constructor(ioObject) {
        
        this.type = ioObject['$type'];
        this.name = ioObject['name'];
        if (ioObject['$body'])
            this.value = ioObject['$body'];
        else if (ioObject['$children']) {
            let details = ioObject['$children'];
            details.forEach(detail => {
                this.subType = detail['$type'];
                if (this.subType == 'camunda:list') {
                    if (detail['$children']) {
                        this.value = [];
                        detail['$children'].forEach(entry => {
                            this.value.push(entry['$body']);
                        });
                    }
                }
                else if (this.subType == 'camunda:map') {
                    if (detail['$children']) {
                        const map = new Map();
                        detail['$children'].forEach(entry => {
                            map.set(entry['key'], entry['$body']);
                        });
                        this.value = map;
                    }
                }
                else
                    this.value = detail['$children'];
            });
        }
    }
    evaluate(item) {
        /**
         * scenario for call
         * */
        var val;
        var evalValue;
        if (this.subType == 'camunda:list') {
            val = [];
            this.value.forEach(entry => {
                //val.push(item.token.execution.appDelegate.scopeEval(item, entry));
                evalValue = ScriptHandler.evaluateExpression(item, entry);

                val.push(evalValue);
            });
        }
        else if (this.subType == 'camunda:map') {
            val = new Map();
            (this.value).forEach((value, key) => {
                //const newVal = item.token.execution.appDelegate.scopeEval(item, value);
                evalValue = ScriptHandler.evaluateExpression(item, value);

                val.set(key, evalValue)
            });
        }
        else {
             val = ScriptHandler.evaluateExpression(item, this.value);
        }

        return val;
    }

    

}
class IOBehaviour extends Behaviour {
    parameters: IOParameter[];

    init() {
        this.parameters = [];
        var ios = this.definition['$children'];
        for (var i = 0; i < ios.length; i++) {
            var io = ios[i];
            this.parameters.push(new IOParameter(io));//['$type'], io['name'], io['$body']));
        }
    }
    /*
     * process input parameters here 
     * 
     * generate item.input
     * 
     */
    enter(item: Item) {

        if (!item.input)
            item.input = {};
        var hasInput = false;
        this.parameters.forEach(param => {
            if (param.isInput()) {
                /**
                 * scenario for call
                 * */
                hasInput = true;
                var val;
                val = param.evaluate(item);
                item.input[param.name] = val;
                item.log('...set at enter data input : input.' + param.name + ' = ' + val);
            }
        });
        if (hasInput == false) {
            /**
             * scenario for throw
             * */
            this.parameters.forEach(param => {
                if (param.isOutput()) {
                    var val = ScriptHandler.evaluateExpression(item, param.value);
                    item.output[param.name] = val;
                    item.log('...set at enter data output : output.' + param.name + ' = ' + val);
                }
            });
        }
    }
    process(item: Item) {

    }
    /*
     * process output parameters here 
     * 
     * value is an expression need to be evaluated
     *  
     *      moving output into data
     * 
     */
    exit(item: Item) {
        this.parameters.forEach(param => {
            if (param.isOutput()) {
                /**
                 * scenario for call results
                 * */

                if (typeof param.value !== 'undefined' && param.value !== '') {
                    var val = ScriptHandler.evaluateExpression(item, param.value);
                    item.log('...set at exit data output : data.' + param.name + ' = ' + val);
                    item.token.data[param.name] = val;
                }
                else
                {
                    item.token.data[param.name] = item.output;
                    item.log('...set at exit data output : data.' + param.name + ' = ' + item.output);
                }
            }
        });

    }
    describe() {
        var input = '';
        var output = '';
        this.parameters.forEach(param => {
            if (param.isOutput()) {
                    output += param.name +'='+param.value;
            }
            else
                input+= param.name + '=' + param.value;

        });

        return [['Input', input],['output',output]];
    }
}

export { IOBehaviour }