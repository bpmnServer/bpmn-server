import { NODE_ACTION } from '../../..';
import { Item } from '../../engine/Item';
import { Behaviour } from './';
declare class TimerBehaviour extends Behaviour {
    duration: any;
    timeCycle: any;
    init(): void;
    describe(): string[];
    /**
     * return the next time the timer is due
     * format is time format
     * @param timerModifier - for testing purposes configuration can alter the timer
     */
    timeDue(timerModifier?: any): number;
    start(item: Item): NODE_ACTION;
    startTimer(item: any): void;
    expires(): void;
    end(item: Item): void;
    resume(): void;
}
export { TimerBehaviour };
