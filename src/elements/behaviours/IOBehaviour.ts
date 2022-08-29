import { TimerBehaviour } from ".";
import { Node } from "..";
import { Behaviour } from '.';
import { Item } from "../../engine/Item";

/*
 * will prepare input at start
 * will prepare output at end
 *
 */

class IOParameter {
    type;
    name;
    value;
    isInput() { return (this.type == 'camunda:inputParameter'); }
    isOutput() { return (this.type == 'camunda:outputParameter'); }
    constructor(type, name, value) {
        this.type = type;
        this.name = name;
        this.value = value;
    }

}
class IOBehaviour extends Behaviour {
    parameters: IOParameter [];

    init() {
        this.parameters = [];
        var ios = this.definition['$children'];
        for (var i = 0; i < ios.length; i++) {
            var io = ios[i];
            this.parameters.push(new IOParameter(io['$type'], io['name'], io['$body']));
        }
    }
    /*
     * process input parameters here 
     */
    start(item: Item) {
        var data = {};
        this.parameters.forEach(param => {
            if (param.isInput()) {
                var val = item.token.execution.appDelegate.scopeEval(item, param.value);
                data[param.name] = val;
            }
        });
        if (data !== {})
            item.context.input = data;
    }
    /*
     * process output parameters here 
     * 
     * value is an expression need to be evaluated
     * 
     */
    end(item: Item) {

        var data = {};
        this.parameters.forEach(param => {
            if (param.isOutput()) {
                if (typeof param.value !== 'undefined' && param.value !== '')
                {
                    var val =item.token.execution.appDelegate.scopeEval(item, param.value);

                    data[param.name] = val;
                }
                else
                    data[param.name]= item.context.output;
            }
        });
        if (data !== {})
            item.token.appendData(data);
    }
    describe() {
        return ['', 'manages IO'];
    }
}

export { IOBehaviour }