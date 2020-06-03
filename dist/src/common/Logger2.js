/*'use strict';

import { ILogger } from "..";

const FS = require('fs');

class LogItem {
    level;
    constructor(level) { this.level = level; }
    content;
    subItems = [];
    addContent(content, level) {
        if (level > this.level)
            this.current.addContent(content, level);
        else
            this.subItems.push(item);
    }
    get current() {
        return this.subItems[this.subItems.length - 1];
    }
    getContents(contents) {
        const children = [];
        this.subItems.forEach(item => { item.contents(children); });
        contents.push({ content: this.content, children });

    }
}
class Logger2  {


    toConsole = true;
    toFile = null;
    callback = null;

    root;

    constructor({ toConsole = true, toFile = '', callback = null }) {
        this.setOptions({ toConsole, toFile, callback });
    }
    setOptions({ toConsole, toFile, callback }) {

        this.toConsole = toConsole;
        this.toFile = toFile;
        this.callback = callback;
    }
    clear() {
        this.actions = [];
    }
    get() {
        return JSON.stringify(this.actions);
    }
    debug(message) {
        this.msg(message, 'debug');
    }
    warn(message) {
        this.msg(message, 'warn');
    }
    action(message) {
        this.msg(message, 'action');
    }
    log(message) {
        this.msg(message);
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
            FS.writeSync(id, 'Started at: ' + new Date().toISOString() + "\n", null, 'utf8');

            let l = 0;
            for (l = 0; l < this.debugMsgs.length; l++) {
                let msg = this.debugMsgs[l];
                if (msg.type == 'error') {
                    let line = msg.type + ": at line " + (l + 1) + " " + msg.message;
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

            FS.closeSync(id);
            this.clear();

        }
    }
}

export { Logger };

*/ 
//# sourceMappingURL=Logger2.js.map