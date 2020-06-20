import { Behaviour } from '.';
import { Item } from "../../..";

class ScriptBehaviour extends Behaviour {
    /*       <bpmn:extensionElements>
            <camunda:script event="start">
              console.log("This is the start event");
            </camunda:script>
          </bpmn:extensionElements>
          
          */
    event;
    script;
    init() {
        console.log('event:' + this.definition.event);
        console.log('body:' + this.definition.$body);
        this.event = this.definition.event;
        this.script = this.definition.$body;

    }
    start(item: Item) {

        if ((!this.event) || (this.event == 'start'))
            this.executeScript(item);
    }
    run(item: Item) {

        if ((this.event) && (this.event == 'run'))
            this.executeScript(item);
    }
    end(item: Item) {

        if ((this.event) && (this.event == 'end'))
            this.executeScript(item);
    }
    resume(item: Item) {
    }
    executeScript(item) {
        item.token.log('invoking script call ' + " for " + item.id);
        item.token.execution.appDelegate.scopeJS(item, this.script);
        item.token.log('returned from script call ' + " for " + item.id);
    }
    describe() {
        return ['script on ' + this.event, this.script];
    }
}

export { ScriptBehaviour }