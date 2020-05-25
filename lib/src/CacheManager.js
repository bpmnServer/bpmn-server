"use strict";
//
//-----------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = void 0;
let CacheManager = /** @class */ (() => {
    class CacheManager {
        static getList() {
            let items = [];
            CacheManager.liveInstances.forEach(item => { items.push(item); });
            return items;
        }
        /**
        **/
        static getInstance(instanceId) {
            let instance = CacheManager.liveInstances.get(instanceId);
            return instance;
        }
        static add(instance, engine) {
            CacheManager.liveInstances.set(instance.id, { instance, engine });
        }
        static remove(instanceId) {
            CacheManager.liveInstances.delete(instanceId);
        }
    }
    CacheManager.liveInstances = new Map();
    return CacheManager;
})();
exports.CacheManager = CacheManager;
//# sourceMappingURL=CacheManager.js.map