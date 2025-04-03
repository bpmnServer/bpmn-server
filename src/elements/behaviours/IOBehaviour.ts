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
                else if (this.subType == 'camunda:script') {
                  this.value=detail['$body'];
                }
                else
                    this.value = detail['$children'];
            });
        }
    }
    /**
     * 
     * 
#### Input/Output

`myVar` Type| Example Value| |
--- | --- | --- |
Text/String| hello| No explicit quotes needed
List| [ 'str1', 'str2', item.data.myExistingVar ]
Map| { 'key1':  'val1', 'key2': 'val2' } 
JavaScript | data.item.myExistingVar 
JavaScript| { 'key1': 'val1', 'key2': 'val2' , 'key3': [item.data.myExistingVar, 'hello'], 'key4': { 'ikey5': item.data.myExistingVar}}

     * 
     * @param item 
     *  
     * @returns 
     */
    async evaluate(item) {
        /**
         * scenario for call
         * */
        var val;
        var evalValue;
        if (this.subType == 'camunda:text') {
            val = this.value;
        }
        else if (this.subType == 'camunda:list') {
            val = [];
            for(const entry of this.value) {
                //val.push(item.token.execution.appDelegate.scopeEval(item, entry));
                
                evalValue = await item.context.scriptHandler.evaluateExpression(item, entry);

                val.push(evalValue);
            }
        }
        else if (this.subType == 'camunda:map') {
            val = new Map();
            for (const [key,value] of this.value) {
//            (this.value).forEach(async (value, key) => {
                //const newVal = item.token.execution.appDelegate.scopeEval(item, value);
                evalValue = await item.context.scriptHandler.evaluateExpression(item, value);

                val.set(key, evalValue)
            }
        }
        else if (this.subType == 'camunda:script') {
            val = await item.context.scriptHandler.evaluateExpression(item, this.value);
        }        
        else { // just text
            if ((this.value.startsWith('$')))
                val = await item.context.scriptHandler.evaluateExpression(item, this.value.substring(1));
            else
                val=this.value;
        }

        return val;
    }

    describe() {
        /**
         * scenario for call
         * */
        var val;
        var evalValue;
        if (this.subType == 'camunda:text') {
            val = 'text:'+this.value;
        }
        else if (this.subType == 'camunda:list') {
            val = [];
            this.value.forEach(entry => {
                val.push(entry);
            });
            val='list:'+JSON.stringify(val);
        }
        else if (this.subType == 'camunda:map') {
            val = new Map();
            (this.value).forEach((value, key) => {
                val.set(key, value)
            });
            val='map:'+Array.from(val.entries());
        }
        else if (this.subType == 'camunda:script') {
            val = 'script:'+this.value;
        }        
        else { // just text
                val='text:'+this.value;
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
    async enter(item: Item) {

        if (!item.input)
            item.input = {};
        var hasInput = false;
        for (const param of this.parameters) {
//        this.parameters.forEach(async param => {
            if (param.isInput()) {
                /**
                 * scenario for call
                 * */
                hasInput = true;
                var val;
                val = await param.evaluate(item);
                item.input[param.name] = val;
                item.log('...set at enter data input : input.' + param.name + ' = ' + val);
            }
        }
        if (hasInput == false) {
            /**
             * scenario for throw
             * */
            for (const param of this.parameters) {
//            this.parameters.forEach(async param => {
                if (param.isOutput()) {
                    var val = await item.context.scriptHandler.evaluateExpression(item, param.value);
                    item.output[param.name] = val;
                    item.log('...set at enter data output : output.' + param.name + ' = ' + val);
                }
            }
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
    async exit(item: Item) {
        for (const param of this.parameters) {
            if (param.isOutput()) {
                /**
                 * scenario for call results
                 * */

                if (typeof param.value !== 'undefined' && param.value !== '') {
                    var val = await item.context.scriptHandler.evaluateExpression(item, param.value);
                    item.log('...set at exit data output : data.' + param.name + ' = ' + val);
                    item.token.data[param.name] = val;
                }
                else
                {
                    item.token.data[param.name] = item.output;
                    item.log('...set at exit data output : data.' + param.name + ' = ' + item.output);
                }
            }
        }

    }
    describe() {
        var input = '';
        var output = '';
        this.parameters.forEach(param => {
            if (param.isOutput()) {
                    output +='\n' + param.name +'='+param.value;
            }
            else
                input+='<br />'+ param.name + '=' + param.describe();

        });

        return [['Input', input],['output',output]];
    }
}

export { IOBehaviour }