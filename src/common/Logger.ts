'use strict';

import { ILogger } from "../../";

const FS = require('fs');

class Logger implements ILogger {

    debugMsgs = [];
    toConsole = true;
    toFile = null;
    callback = null;

    constructor({ toConsole=true, toFile='', callback=null }) {
        this.setOptions({ toConsole, toFile, callback });
    }
    setOptions({ toConsole, toFile, callback }) {

        this.toConsole = toConsole;
        this.toFile = toFile;
        this.callback = callback;
    }
    msg(message , type='log') {
        if (this.toConsole)
            console.log(message);
        if (this.callback) {
            this.callback(message, type);
        }
        this.debugMsgs.push({ message, type });
        return message;
    }
    clear() {

        this.debugMsgs = [];
    }
    get() {

        return this.debugMsgs;
    }
    debug(...message)
    {
        this.msg(this.toString(...message),'debug');
    }
    warn(...message) {
        this.msg(this.toString(...message),'warn');
    }
    log(...message) {
        return this.msg(this.toString(...message));
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
                else
                    out += cls + " " + JSON.stringify(val, null, 2);
            }
        }
        return out;
    }
    error(err) {
       if (typeof err === 'object') {
          if (err.message) {
              this.msg(err.message, 'error');
               console.log('\nError Message: ' + err.message)
             }
             if (err.stack) {
                    console.log('\nStacktrace:')
                    console.log('====================')
                 console.log(err.stack);
                 this.log(err.stack);
                }
            } else {
                   this.msg(err, 'error');
        }

        throw new Error(err);
    }
    async save(filename) {
        console.log("writing to:" + filename + " " + this.debugMsgs.length);
        let id = FS.openSync(filename, 'w', 666);
        {
            FS.writeSync(id,'Started at: '+new Date().toISOString() + "\n", null, 'utf8');

            let l = 0;
            for (l = 0; l < this.debugMsgs.length; l++) {
                let msg = this.debugMsgs[l];
                if (msg.type == 'error') {
                    let line = msg.type + ": at line " + (l+1) + " " + msg.message;
                    FS.writeSync(id, line + "\n", null, 'utf8');
                }
            }
            for (l = 0; l < this.debugMsgs.length; l++) {
                let msg = this.debugMsgs[l];
                let line;
                if (msg.type == 'eror')
                    line = msg.type + ":" + msg.message;
                else
                    line = msg.message;
                FS.writeSync(id, line + "\n", null, 'utf8');
            }

            FS.closeSync(id );
            this.clear();

        }
    }
}

export { Logger };

