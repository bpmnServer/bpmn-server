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
exports.InstanceLocker = void 0;
;
const COLLECTION = 'wf_locks';
const WAIT = 1500;
const MAX_TRIES = 20;
class InstanceLocker {
    constructor(dataStore) {
        this.dataStore = dataStore;
    }
    lock(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var counter = 0;
            var failed = true;
            while (counter++ < MAX_TRIES && failed) {
                failed = !(yield this.try(id));
                if (failed)
                    yield this.delay(WAIT, {});
            }
            if (failed) {
                yield this.list();
                throw new Error('failed to lock instance: ' + id);
            }
            else {
                return true;
            }
        });
    }
    try(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lock = { "id": id, "server": process.env.SERVER_ID, "time": new Date() };
            try {
                var records = yield this.dataStore.db.insert(this.dataStore.dbConfiguration.db, "wf_locks", [lock]);
                //console.log(records);
            }
            catch (err) {
                //console.log('lock error',err.code);
                return false;
            }
            return true;
        });
    }
    release(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { "id": id };
            return yield this.dataStore.db.remove(this.dataStore.dbConfiguration.db, "wf_locks", query);
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            var records = yield this.dataStore.db.find(this.dataStore.dbConfiguration.db, "wf_locks", {}, {});
            return records;
        });
    }
    delay(time, result) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(result);
                }, time);
            });
        });
    }
}
exports.InstanceLocker = InstanceLocker;
//# sourceMappingURL=InstanceLocker.js.map