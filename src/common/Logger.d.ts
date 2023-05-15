import { ILogger } from "../../";
declare class Logger implements ILogger {
    debugMsgs: any[];
    toConsole: boolean;
    toFile: any;
    callback: any;
    constructor({ toConsole, toFile, callback }: {
        toConsole?: boolean;
        toFile?: string;
        callback?: any;
    });
    setOptions({ toConsole, toFile, callback }: {
        toConsole: any;
        toFile: any;
        callback: any;
    }): void;
    msg(message: any, type?: string): any;
    clear(): void;
    get(): any[];
    debug(...message: any[]): void;
    warn(...message: any[]): void;
    log(...message: any[]): any;
    toString(...args: any[]): string;
    error(err: any): void;
    save(filename: any): Promise<void>;
}
export { Logger };
