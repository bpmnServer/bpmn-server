
import { Token, Execution  } from '../../engine';
import { Node } from '..';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../..';
import { Item } from '../../engine/Item';
import { EventsRegistry, TimerEvent, BPMNServer } from '../../server';
import { Behaviour } from './';
import { Cron } from '../../server/Cron';

const duration = require('iso8601-duration');
const parse = duration.parse;
const end = duration.end;
const toSeconds = duration.toSeconds;

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
 */
class TimerBehaviour extends Behaviour {
    duration;
    timeCycle;
    init() {
        let def;

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
        return ['timer','is a timer duration='+duration];
    }
    start(item: Item) {
        let seconds;
        if (this.duration) {
            seconds = toSeconds((parse(this.duration)));
        }
        else if (this.timeCycle) 
        {
            seconds = toSeconds((parse(this.timeCycle)));
        }
        item.token.log("..------timer running --- " + seconds);
        this.startTimer(item, seconds);

        Cron.timersFired++;
        //setTimeout(this.expires.bind(item), seconds * 1000);

        return NODE_ACTION.wait;
    }
    startTimer(item, seconds) {

        const config = item.context.configuration;
        if (config.timers && config.timers.forceTimersDelay) {
            seconds = config.timers.forceTimersDelay;
            item.token.log("Timer duration modified by the configuration to " + seconds);
        }

        let timeDue = new Date().getTime();
        timeDue += seconds;

        item.timeDue = timeDue;//  new Date(timeDue);
        item.token.log("timer is set at " + timeDue);
//          done by cron class
//        setTimeout(this.expires.bind(item), seconds * 1000);
    }
    expires() {
        let item = this as unknown as Item;

        item.token.log("Action:---timer Expired --- ");
        if (item.status == ITEM_STATUS.wait)    // just in case it was cancelled
            item.token.signal(null);
    }
    end(item: Item) {
        Cron.timersFired--;
        item.timeDue = undefined;
    }
    resume() { }
}
export { TimerBehaviour}