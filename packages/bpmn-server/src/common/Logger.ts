import { createRequire } from 'module';
const require = createRequire(import.meta.url);
'use strict';

import type { ILogger } from '../interfaces/common.js';

class Logger implements ILogger {

    debugMsgs = [];
    toConsole = true;
    toFile = null;
    callback = null;
    level=0;
    /** Keep the messages in memory for `get()` and `save()`; without it nothing accumulates (it grew with every step a server ran). */
    keepMessages = false;

    constructor({ toConsole=true, toFile='', callback=null, keepMessages=undefined }: { toConsole?: boolean, toFile?: string, callback?: any, keepMessages?: boolean } = {}) {
        this.setOptions({ toConsole, toFile, callback });
        // the per-instance log files (logFolder) are written from the kept messages
        this.keepMessages = keepMessages ?? !!process.env['logFolder'];
    }
    setOptions({ toConsole, toFile, callback }) {

        this.toConsole = toConsole;
        this.toFile = toFile;
        this.callback = callback;
    }
    msg(message , type='log') {
        let level=this.level>-1 ? ' '.repeat(this.level):'';
        if (this.toConsole)
            console.log(level+message);
        if (this.callback) {
            this.callback(message, type);
        }

        if (this.toFile !== '') {
            const fs = require('fs');
            fs.appendFileSync(this.toFile, message);        
        }
        const entry = { date: new Date(), message, type, level: this.level };
        if (this.keepMessages)
            this.debugMsgs.push(entry);
        return entry;
    }
    clear() {

        this.debugMsgs = [];
    }
    get() {

        return this.debugMsgs;
    }
    info(...message) {
        return this.msg(this.toString(...message), 'info');
    }
    debug(...message)
    {
        return this.msg(this.toString(...message),'debug');
    }
    warn(...message) {
        return this.msg(this.toString(...message),'warn');
    }
    log(...message) {
        return this.msg(this.toString(...message),'log');
    }
    logS(...message) {
        
        let msg=this.msg(this.toString(...message),'log');
        this.level++;
        return msg;
    }
    logE(...message) {
        let msg=this.msg(this.toString(...message),'log');
        this.level--;
        return msg;
    }
    toString(...args) {
        var out = '';
        for (var i = 0; i < args.length; i++) {
            var val = args[i];
            if (i > 0)
                out += ' ,';

            if (typeof val === 'undefined') {
                out += val;
            }
            else {
                var cls = val.constructor.name;
                if (cls === 'String')
                    out += val;
                else if (cls === 'Array' && val.length==1)
                    {
                        if (val[0].constructor.name==='Array')
                            out += JSON.stringify(val[0]);
                        else 
                            out +=val[0];

                    }
                else
                    out += cls + " " + JSON.stringify(val, null, 2);
            }
        }
        if (out.substring(0,1)=='^') {
            out=out.substring(1);
            this.level=0;
        }
        return out;
    }
    reportError(err) {
        if (typeof err === 'object') {
            if (err.message) {
                this.msg(err.message, 'error');
                if (this.toConsole) console.log('\nError Message: ' + err.message)
            }
            if (err.stack) {
                if (this.toConsole) {
                    console.log('\nStacktrace:')
                    console.log('====================')
                    console.log(err.stack);
                }
                this.log(err.stack);
            }
        } else {
            this.msg(err, 'error');
        }

    }
    error(err) {
        throw new Error(err);
    }
    async save(filename,flag='w') {
        const fs = require('fs');
        console.log("writing to:" + filename + " " + this.debugMsgs.length);
        let id = fs.openSync(filename, flag, 666);
        {
            fs.writeSync(id,'Started at: '+new Date().toISOString() + "\n", null, 'utf8');

            let l = 0;
            for (l = 0; l < this.debugMsgs.length; l++) {
                let msg = this.debugMsgs[l];
                if (msg.type == 'error') {
                    let line = msg.type + ": at line " + (l+1) + " " + msg.message;
                    fs.writeSync(id, line + "\n", null, 'utf8');
                }
            }
            for (l = 0; l < this.debugMsgs.length; l++) {
                let msg = this.debugMsgs[l];
                let line;
                if (msg.type == 'eror')
                    line = msg.type + ":" + msg.message;
                else
                    line = msg.message;

                let level=this.level>-1 ? ' '.repeat(this.level):'';
                fs.writeSync(id,level+line + "\n", null, 'utf8');
            }

            fs.closeSync(id );
            this.clear();

        }
    }
    async saveForInstance(instanceId) {
        if (process.env['logFolder'])
            await this.save(process.env['logFolder']+'/'+instanceId+'.log', 'a');
        
    }
}

export { Logger };

