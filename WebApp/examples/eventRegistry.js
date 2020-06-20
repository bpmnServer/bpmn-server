"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const configuration_1 = require("../configuration");
const FS = require('fs');
const __2 = require("../");
const MongoClient = require('mongodb').MongoClient;
const MongoDb = require('mongodb');
const mongoose = require('mongoose');
const logger = new __1.Logger({ toConsole: true });
var caseId = Math.floor(Math.random() * 10000);
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        //simulate a timer:
        const server = new __1.BPMNServer(configuration_1.configuration, logger);
        const registry = server.eventsRegistry;
        let duration = 100;
        let now = new Date();
        let timeDue = new Date(now.getTime() + duration);
        console.log(" now in time: " + now.getTime());
        let event1 = new __2.TimerEvent({ timeDue: timeDue });
        registry.addEvent(event1);
        let event2 = new __2.SignalEvent({ signalId: 'StopAllServices' });
        registry.addEvent(event2);
        yield delay(1500);
        yield server.cron.checkTimers();
        return;
        console.log(yield server.cron.findEventById('StopAllServices'));
    });
}
function delay(time) {
    return __awaiter(this, void 0, void 0, function* () {
        log("delaying ... " + time);
        return new Promise(function (resolve) {
            setTimeout(function () {
                log("delayed is done.");
                resolve();
            }, time);
        });
    });
}
function log(msg) {
    logger.log(msg);
}
test();
//# sourceMappingURL=eventRegistry.js.map