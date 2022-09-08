import { Behaviour } from '.';
import { Item } from "../../..";

class ScriptBehaviour extends Behaviour {
    /*    
     *    old:
     *    <bpmn:extensionElements>
            <camunda:script event="start">
              console.log("This is the start event");
            </camunda:script>
          </bpmn:extensionElements>
          
          
          New:

      <bpmn2:extensionElements>
        <camunda:executionListener event="start">
          <camunda:script scriptFormat="JavaScript">
			script1
		  </camunda:script>
        </camunda:executionListener>
        <camunda:executionListener event="end">
          <camunda:script scriptFormat="JavaScript">
			script2
			</camunda:script>
        </camunda:executionListener>


          */
    scripts: string[] ;
    init() {
        this.scripts = [];
        var scrs = this.definition['$children'];
        for (var i = 0; i < scrs.length; i++) {
            var scr = scrs[i];
            this.scripts.push(scr.$body);
            this.node.scripts.set(this.definition.event, this.scripts);
        }

    }
    /*
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
    } */
    describe() {
        var scrs = this.definition['$children'];
        var desc = [];
        for (var i = 0; i < scrs.length; i++) {
            var scr = scrs[i];
            desc.push([`script on ${this.definition.event}`,` ${this.scripts}`]);
        }

        return desc;
    }
}

export { ScriptBehaviour }