
import { Execution } from '../../engine/Execution.js';
import { Token, TOKEN_TYPE } from '../../engine/Token.js';
import { Node } from '../Node.js';
import { NODE_ACTION, FLOW_ACTION, EXECUTION_EVENT, TOKEN_STATUS, ITEM_STATUS } from '../../interfaces/Enums.js';
import { Item } from '../../engine/Item.js';
import { ScriptHandler } from '../../engine/ScriptHandler.js';
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
        if (timerModifier) {
            seconds = timerModifier/1000;
            timeDue = dayjs(new Date()).add(seconds,'s').toDate();
        }
        else {
            if (this.duration) {

                if (this.duration.startsWith('$')) 
                    this.duration= await item.context.scriptHandler.evaluateExpression(item,this.duration);

                //seconds = toSeconds((parse(this.duration)));
                seconds= Cron.timeDue(this.duration, null);
                timeDue = new Date();
                timeDue = dayjs(timeDue).add(seconds,'s').toDate();
            }
            else if (this.timeCycle) {

                if (this.timeCycle.startsWith('$')) 
                    this.timeCycle= await item.context.scriptHandler.evaluateExpression(item,this.timeCycle);

                //seconds = toSeconds((parse(this.timeCycle)));
                seconds = Cron.timeDue(this.timeCycle, null);
                this.repeat = this.getRepeat(this.timeCycle);
                timeDue = new Date();
                timeDue = dayjs(timeDue).add(seconds,'s').toDate();
            }
            else if (this.timeDate) {
                    let timeDate=this.timeDate;
                    if (timeDate.startsWith('$')) {
                        timeDate= await item.context.scriptHandler.evaluateExpression(item,timeDate);
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
        if (config.timers && config.timers.forceTimersDelay) {
            timerModifier = config.timers.forceTimersDelay;
            item.token.log("...Timer duration modified by the configuration to " + timerModifier);
        }

        item.timeDue = await this.timeDue(item,timerModifier);

        item.token.log("timer is set at " + item.timeDue + " - "+ new Date(item.timeDue).toISOString());

        const seconds = ((new Date(item.timeDue)).getTime()/1000) - (new Date().getTime()/1000);

        item.log("..setting timer for " + seconds + " seconds for: "+item.id);
        // The server's scheduler owns the timer: cancelled on shutdown, claimed so that one server fires it.
        const expires = this.expires.bind({ item, instanceId: item.token.execution.id, timer: this });
        const cron = item.token.execution.server.cron;
        if (cron && typeof cron.scheduleItemTimer === 'function')
            cron.scheduleItemTimer({ id: item.id, timeDue: item.timeDue, instanceId: item.token.execution.id }, expires);
        else
            setTimeout(expires, seconds * 1000);
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