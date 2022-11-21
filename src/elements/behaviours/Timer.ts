
import { Token, Execution, TOKEN_TYPE  } from '../../engine';
import { Node } from '..';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../..';
import { Item } from '../../engine/Item';
import { BPMNServer } from '../../server';
import { Behaviour } from './';
import { Cron } from '../../server/Cron';
import { NODE_SUBTYPE } from '../../interfaces';


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
    timeDue(timerModifier=null) {

        let seconds;
        if (timerModifier)
            seconds = timerModifier/1000;
        else {
            if (this.duration) {
                //seconds = toSeconds((parse(this.duration)));
                seconds= Cron.timeDue(this.duration, null);
            }
            else if (this.timeCycle) {
                //seconds = toSeconds((parse(this.timeCycle)));
                seconds = Cron.timeDue(this.timeCycle, null);
                 this.repeat = this.getRepeat(this.timeCycle);
            }
        }
        let timeDue = new Date().getTime()/1000;
        timeDue += seconds;
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

        item.timeDue = this.timeDue(timerModifier);

        item.token.log("timer is set at " + item.timeDue + " - "+ new Date(item.timeDue).toISOString());

        const seconds = item.timeDue - (new Date().getTime()/1000);

        item.log("..setting timer for " + seconds + " seconds");
        setTimeout(this.expires.bind({ item, timer: this }), seconds * 1000);
    }
    async expires() {
        let item = this['item'] as unknown as Item;
        let timer = this['timer'];
     
        item.timerCount++;
        item.token.log("Action:---timer Expired --- ");
        if (item.status == ITEM_STATUS.wait)    // just in case it was cancelled
        {
            //item.token.signal(null);
            await item.token.execution.signal(item.id, {});
        }
        // check for repeat
        if (timer.repeat > item.timerCount) {
            let newToken=await Token.startNewToken(TOKEN_TYPE.BoundaryEvent, item.token.execution, item.node, null, item.token, item, null);
            let newItem = newToken.currentItem;
            item.token.log('new token for timer repeat ' + item.timerCount + '  '+newItem.elementId);
            newItem.timerCount = item.timerCount;     

            //await timer.startTimer(new);
        }
    }
    end(item: Item) {
        Cron.timerEnded(item);
        item.timeDue = undefined;
    }
    resume() { }
}
export { TimerBehaviour}