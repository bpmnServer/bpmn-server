/**
 *
 * */
declare function checkOnWait(task: any, item: any): void;
declare function checkOnEnd(): void;
declare function getDueTimers(): void;
declare function getDueDate(task: any): void;
declare function dateDiff(dateStr: any): string;
export { dateDiff, checkOnWait, checkOnEnd, getDueTimers, getDueDate };
