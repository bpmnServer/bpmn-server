
import { Token, Execution, TOKEN_TYPE  } from '../../engine';
import { Node } from '..';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../';
import { Item ,ScriptHandler} from '../../engine';
import { BPMNServer } from '../../server';
import { Behaviour  } from './';
import { Cron } from '../../server/Cron';
import { NODE_SUBTYPE } from '../../interfaces';

const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)




/*
 * will fire a timer at start and go into wait sleep
 * timer will later invoke the item when due
 * 
 *
 * 
 *  <timerEventDefinition>
        <timeDate>2011-03-11T12:13:14Z</timeDate>
    </timerEventDefinition>

Example (interval lasting 10 days):

    <timerEventDefinition>
        <timeDuration>P10D</timeDuration>
    </timerEventDefinition>

Time Cycle

Example (3 repeating intervals, each lasting 10 hours):

    <timerEventDefinition>
        <timeCycle>R3/PT10H</timeCycle>
    </timerEventDefinition>

      <bpmn:timerEventDefinition id="TimerEventDefinition_07xu06a">
        <bpmn:timeDuration xsi:type="bpmn:tExpression">PT2S</bpmn:timeDuration>
      </bpmn:timerEventDefinition>


Item Attributes:
    item.timeDue
    -- only for repeated timers --

    item.timerCount     - count of completed timers 

 */
class TimerBehaviour extends Behaviour {
    duration;
    repeat=1;
    timeCycle;
    timeDate;
    init() {
        let def;
        this.node.subType = NODE_SUBTYPE.timer;

        this.node.def.eventDefinitions.forEach(ed => {

            if (ed.$type == 'bpmn:TimerEventDefinition') {
                if (ed.timeDuration) {
                    this.duration = ed.timeDuration.body;
                }
            else if (ed.timeCycle) {
                    this.timeCycle = ed.timeCycle.body;
                }
            else if (ed.timeDate) {
                    this.timeDate = ed.timeDate.body;
                }
            else {
                    console.log("Error No timeDuration is defined");
                }
            }
        });

    }
    describe() {
        return ['timer','is a timer duration='+this.duration];
    }
    /**
     * return the next time the timer is due
     * format is time format
     * @param timerModifier - for testing purposes configuration can alter the timer
     */
    timeDue(item,timerModifier=null) {

        let seconds;
        let timeDue;
        if (timerModifier)
            seconds = timerModifier/1000;
        else {
            if (this.duration) {
                //seconds = toSeconds((parse(this.duration)));
                seconds= Cron.timeDue(this.duration, null);
                timeDue = new Date();
                timeDue = dayjs(timeDue).add(seconds,'s').toDate();
            }
            else if (this.timeCycle) {
                //seconds = toSeconds((parse(this.timeCycle)));
                seconds = Cron.timeDue(this.timeCycle, null);
                this.repeat = this.getRepeat(this.timeCycle);
                timeDue = new Date();
                timeDue = dayjs(timeDue).add(seconds,'s').toDate();
            }
            else if (this.timeDate) {
                    let timeDate=this.timeDate;
                    if (timeDate.startsWith('$')) {
                        timeDate= ScriptHandler.evaluateExpression(item,timeDate);
                        }
                timeDue=timeDate;
            }
        }
        return timeDue;
    }
    getRepeat(input) {
            if (input.startsWith('R')) {
                var l = input.indexOf('/');
                if (l > 0)
                    return input.substring(1, l);
                }
            return 1;
    }
    start(item: Item) {

        if (item.node.type == "bpmn:StartEvent")
            return;
        item.token.log("..------timer running --- " );
        this.startTimer(item);
        item.timerCount = 0;

        return NODE_ACTION.wait;
    }

    startTimer(item) {

        let timerModifier = null;
        const config = item.context.configuration;
        if (config.timers && config.timers.forceTimersDelay) {
            timerModifier = config.timers.forceTimersDelay;
            item.token.log("...Timer duration modified by the configuration to " + timerModifier);
        }

        item.timeDue = this.timeDue(item,timerModifier);

        item.token.log("timer is set at " + item.timeDue + " - "+ new Date(item.timeDue).toISOString());

        const seconds = ((new Date(item.timeDue)).getTime()/1000) - (new Date().getTime()/1000);

        item.log("..setting timer for " + seconds + " seconds for: "+item.id);
        setTimeout(this.expires.bind({ item, instanceId: item.token.execution.id, timer: this }), seconds * 1000);
    }
    async expires() {
        let item = this['item'] as unknown as Item;
        let timer = this['timer'];
        let instanceId= this['instanceId'];
     
        const exec=item.token.execution;
        item.token.log("Action:---timer Expired --- lock:"+exec.isLocked+' for '+item.id);
        if (item.status == ITEM_STATUS.wait)    // just in case it was cancelled
        {
            //item.token.signal(null);

            if (exec.isLocked===true)
                exec.promises.push(exec.signalItem(item.id, {}));
            else
    			await exec.server.engine.invoke({ "items.id": item.id }, null); 

        }
        // check for repeat
        if (this.timeCycle) {

console.log('repeating ',item.timerCount);

            if (timer.repeat > item.timerCount) {

                let resp=await exec.server.engine.startRepeatTimerEvent(instanceId, item,{});
                //let newToken=await Token.startNewToken(TOKEN_TYPE.BoundaryEvent, item.token.execution, item.node, null, item.token, item, null);
                //let newItem = newToken.currentItem;
                //item.token.log('new token for timer repeat ' + item.timerCount + '  '+newItem.elementId);

                //            item.timerCount++;

                //await timer.startTimer(new);
            }
        }
    }

    end(item: Item) {
        Cron.timerEnded(item);
        item.timeDue = undefined;
    }
    resume() { }
}
export { TimerBehaviour}