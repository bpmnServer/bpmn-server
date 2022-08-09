import { ServerComponent } from './ServerComponent';
import { ICron } from '../..';
declare class Cron extends ServerComponent implements ICron {
    private static timersStarted;
    private static checkingTimers;
    private static timersFired;
    static timerScheduled(timeDue: any): void;
    static timerEnded(item: any): void;
    checkTimers(duration?: number): Promise<void>;
    start(): Promise<void>;
    startTimers(): Promise<void>;
    private itemTimerExpired;
    private processTimerExpired;
    private scheduleProcess;
    private scheduleItem;
    static checkCron(expression: any, referenceDateTime: any): number;
    static timeDue(expression: any, referenceDateTime: any): any;
}
export { Cron };
