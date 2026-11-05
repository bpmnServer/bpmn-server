
import { Execution } from '../../engine/Execution.js';
import { Token, TOKEN_TYPE } from '../../engine/Token.js';
import { Node } from '../Node.js';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../interfaces/Enums.js';
import { Item } from '../../engine/Item.js';
import { ScriptHandler } from '../../engine/ScriptHandler.js';
import { evaluateText } from '../../engine/Expressions.js';
import { Behaviour } from './Behaviour.js';
import { Cron } from '../../server/Cron.js';
import { NODE_SUBTYPE } from '../../interfaces/Enums.js';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
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
    declare duration;
    repeat=1;
    declare timeCycle;
    declare timeDate;
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
//                  console.log("Error No timeDuration is defined in "+this.node.process.name+' node '+this.node.id);
                }
            }
        });

    }
    describe() {
        let spec = '';
        if (this.duration)
            spec = 'Duration:'+ this.duration;
        else if (this.timeCycle)
            spec = 'Cycle:'+ this.timeCycle;
        else if (this.timeDate)
            spec ='DateTime:'+ this.timeDate;
        

        return [['timer',spec]];
    }
    /**
     * return the next time the timer is due
     * format is time format
     * @param timerModifier - for testing purposes configuration can alter the timer
     */
    async timeDue(item,timerModifier=null) {

        let seconds;
        let timeDue;
        // filled in for this item: an expression ($js, ${js}) or a text with ${...} parts (PT${data.days}D). The
        // definition keeps its text (it was overwritten with the first item's value, which later items then got).
        const duration = this.duration ? await evaluateText(item.context.scriptHandler, item, this.duration) : undefined;
        const cycle = this.timeCycle ? await evaluateText(item.context.scriptHandler, item, this.timeCycle) : undefined;
        // a cycle's repeats count, forced delay or not (with one, it stayed 1: a cycle fired once)
        if (cycle) {
            this.repeat = this.getRepeat(cycle);
            item['timerRepeat'] = this.repeat;
        }
        if (timerModifier) {
            seconds = timerModifier/1000;
            timeDue = dayjs(new Date()).add(seconds,'s').toDate();
        }
        else {
            if (duration) {
                seconds= Cron.timeDue(duration, null);
                timeDue = new Date();
                timeDue = dayjs(timeDue).add(seconds,'s').toDate();
            }
            else if (cycle) {
                seconds = Cron.timeDue(cycle, null);
                timeDue = new Date();
                timeDue = dayjs(timeDue).add(seconds,'s').toDate();
            }
            else if (this.timeDate) {
                    let timeDate= await evaluateText(item.context.scriptHandler, item, this.timeDate);
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
    async start(item: Item) {

        if (item.node.type == "bpmn:StartEvent")
            return;
        item.token.log("..------timer running --- " );
        await this.startTimer(item);
        item.timerCount = 0;

        return NODE_ACTION.wait;
    }

    async startTimer(item) {

        let timerModifier = null;
        const config = item.context.configuration;
        if (config.demo) {
            const definition = this.duration ? `duration ${this.duration}` : this.timeCycle ? `cycle ${this.timeCycle}` : this.timeDate ? `date ${this.timeDate}` : 'no time';
            item.token.decision({
                seq: item.seq, element: `timer ${item.node.name ? `'${item.node.name}' (${item.node.id})` : item.node.id}`, action: 'waits until invoked',
                why: [definition, 'in this demo, timers are disabled so they do not keep the server busy'],
            });
            return;
        }
        if (config.timers && config.timers.forceTimersDelay) {
            timerModifier = config.timers.forceTimersDelay;
            item.token.log("...Timer duration modified by the configuration to " + timerModifier);
        }

        item.timeDue = await this.timeDue(item,timerModifier);

        item.token.log("timer is set at " + item.timeDue + " - "+ new Date(item.timeDue).toISOString());
        const definition = this.duration ? `duration ${this.duration}` : this.timeCycle ? `cycle ${this.timeCycle}` : this.timeDate ? `date ${this.timeDate}` : 'no time';
        item.token.decision({
            seq: item.seq, element: `timer ${item.node.name ? `'${item.node.name}' (${item.node.id})` : item.node.id}`, action: `due at ${new Date(item.timeDue).toISOString()}`,
            why: [timerModifier ? `the configuration's timers.forceTimersDelay, ${timerModifier} ms, instead of its ${definition}` : definition],
        });

        const seconds = ((new Date(item.timeDue)).getTime()/1000) - (new Date().getTime()/1000);

        item.log("..setting timer for " + seconds + " seconds for: "+item.id);
        // The server's scheduler owns the timer: cancelled on shutdown, claimed so that one server fires it.
        const expires = this.expires.bind({ item, instanceId: item.token.execution.id, timer: this });
        const cron = item.token.execution.server.cron;
        if (cron && typeof cron.scheduleItemTimer === 'function')
            cron.scheduleItemTimer({ id: item.id, timeDue: item.timeDue, instanceId: item.token.execution.id }, expires);
        else
            setLongTimeout(expires, seconds * 1000);
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

            // A call is running on this execution (it holds the lock): signal the timer's token alone; the call
            // waits for exec.promises, then saves. (signalItem would wait for exec.promises too, itself among them.)
            if (exec.isLocked===true)
                exec.promises.push(item.token.signal(null));
            else {
                // This execution may be an old copy: fire only while the stored item still waits.
                const stored = (await exec.server.dataStore.findItems({ "items.id": item.id }))[0];
                if (stored && stored.status == ITEM_STATUS.wait)
    			    await exec.server.engine.invoke({ "items.id": item.id }, null);
            }

        }
        // check for repeat
        if (timer.timeCycle) {

//console.log('repeating ',item.timerCount);

            // this item is fire number timerCount + 1 (the first has 0): R3 fires three times
            if (Number(item['timerRepeat'] ?? timer.repeat) > item.timerCount + 1) {

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

/** The longest delay setTimeout takes (about 24.8 days); it runs a longer one after 1 ms. */
const MAX_DELAY = 2 ** 31 - 1;

/** setTimeout for any delay: a longer one than it takes is waited out in steps. */
function setLongTimeout(fire: () => void, ms: number) {
    if (ms > MAX_DELAY)
        return setTimeout(() => setLongTimeout(fire, ms - MAX_DELAY), MAX_DELAY);
    return setTimeout(fire, Math.max(ms, 0));
}
